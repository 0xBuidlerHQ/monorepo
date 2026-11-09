import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { Stats } from "@helia/unixfs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { once } from "node:events";
import { extname } from "node:path";
import { CID } from "multiformats/cid";
import { createStorage } from "./storage.ts";

const mediaTypes: Record<string, string> = {
	".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
	".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif", ".pdf": "application/pdf",
};

class HttpError extends Error {
	status: number;
	constructor(status: number, message: string) { super(message); this.status = status; }
}

function json(response: ServerResponse, status: number, data: unknown) {
	response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
	response.end(JSON.stringify(data));
}

async function readUpload(request: IncomingMessage, maxBytes: number) {
	if (Number(request.headers["content-length"]) > maxBytes) throw new HttpError(413, "Upload exceeds the size limit.");
	const chunks: Buffer[] = [];
	let size = 0;
	for await (const chunk of request.iterator({ destroyOnReturn: false })) {
		size += chunk.length;
		if (size > maxBytes) { request.resume(); throw new HttpError(413, "Upload exceeds the size limit."); }
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}

export async function createIpfsService({ directory, port = 3003, adminOrigin = "http://localhost:3002", maxUploadBytes = 25 * 1024 * 1024 }: {
	directory: string; port?: number; adminOrigin?: string; maxUploadBytes?: number;
}) {
	const storage = await createStorage(directory);
	const server = createServer((request, response) => {
		void handle(request, response).catch((error: unknown) => {
			if (response.headersSent) { response.destroy(); return; }
			if (!(error instanceof HttpError)) console.error("IPFS request failed:", error);
			json(response, error instanceof HttpError ? error.status : 500, { error: error instanceof HttpError ? error.message : "IPFS request failed." });
		});
	});
	server.requestTimeout = 30_000;
	server.headersTimeout = 10_000;

	async function handle(request: IncomingMessage, response: ServerResponse) {
		const address = server.address();
		const actualPort = typeof address === "object" && address ? address.port : port;
		const origin = `http://localhost:${actualPort}`;
		// This unauthenticated service is strictly for local development.
		if (![ `localhost:${actualPort}`, `127.0.0.1:${actualPort}` ].includes(request.headers.host ?? "")) throw new HttpError(403, "Invalid host.");
		response.setHeader("X-Content-Type-Options", "nosniff");
		const url = new URL(request.url ?? "/", origin);

		if (url.pathname === "/api/uploads") {
			if (request.headers.origin && request.headers.origin !== adminOrigin) throw new HttpError(403, "Upload origin is not allowed.");
			if (request.headers.origin) {
				response.setHeader("Access-Control-Allow-Origin", adminOrigin);
				response.setHeader("Vary", "Origin");
			}
			if (request.method === "OPTIONS") {
				response.writeHead(204, { "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type, X-File-Name" });
				response.end(); return;
			}
			if (request.method !== "POST") { response.setHeader("Allow", "POST, OPTIONS"); throw new HttpError(405, "Use POST to upload a file."); }
			const mediaType = request.headers["content-type"]?.split(";")[0].trim().toLowerCase() ?? "";
			const extension = Object.entries(mediaTypes).find(([, type]) => type === mediaType)?.[0];
			if (!extension) throw new HttpError(415, "Upload JSON, a raster image, or a PDF.");
			const filename = request.headers["x-file-name"];
			let name: string;
			try { name = typeof filename === "string" ? decodeURIComponent(filename) : (mediaType === "application/json" ? "metadata.json" : `file${extension}`); }
			catch { throw new HttpError(400, "Invalid filename encoding."); }
			if (!/^[\p{L}\p{N}_. -]{1,160}$/u.test(name) || name.startsWith(".") || name.includes("..")) throw new HttpError(400, "Use a simple filename without directory paths.");
			if (mediaTypes[extname(name).toLowerCase()] !== mediaType) throw new HttpError(400, "Filename extension must match Content-Type.");
			const bytes = await readUpload(request, maxUploadBytes);
			if (!bytes.length) throw new HttpError(400, "The upload is empty.");
			if (mediaType === "application/json") {
				try { JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
				catch { throw new HttpError(400, "Upload valid UTF-8 JSON."); }
			}
			const cid = await storage.add(name, bytes);
			const path = `${cid}/${encodeURIComponent(name)}`;
			json(response, 201, { cid, name, size: bytes.length, contentType: mediaType, uri: `ipfs://${path}`, gatewayUrl: `${origin}/ipfs/${path}` });
			return;
		}

		if (request.method !== "GET" && request.method !== "HEAD") { response.setHeader("Allow", "GET, HEAD"); throw new HttpError(405, "Method not allowed."); }
		response.setHeader("Access-Control-Allow-Origin", "*");
		if (url.pathname === "/health") { json(response, 200, { status: "ok", mode: "local", gateway: `${origin}/ipfs/` }); return; }
		if (!url.pathname.startsWith("/ipfs/")) throw new HttpError(404, "Not found.");
		let cid: CID;
		let path: string;
		try {
			const [root, ...parts] = url.pathname.slice(6).split("/");
			cid = CID.parse(root);
			const decoded = parts.map(decodeURIComponent);
			if (decoded.some((part) => !part || part === "." || part === ".." || /[\\/\0]/.test(part))) throw new Error("Invalid path");
			path = decoded.join("/");
		} catch { throw new HttpError(400, "Invalid IPFS CID or path."); }
		let stats: Stats;
		try { stats = await storage.files.stat(cid, { path: path || undefined, offline: true }); }
		catch { throw new HttpError(404, "Content is not stored locally."); }
		if (stats.type === "directory") throw new HttpError(400, "Include the filename after the directory CID.");
		const etag = `"${cid}/${encodeURIComponent(path)}"`;
		response.setHeader("ETag", etag);
		response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		if (request.headers["if-none-match"] === etag) { response.writeHead(304); response.end(); return; }
		response.setHeader("Content-Type", mediaTypes[extname(path).toLowerCase()] ?? "application/octet-stream");
		response.setHeader("Content-Length", stats.size.toString());
		if (request.method === "HEAD") { response.writeHead(200); response.end(); return; }
		await pipeline(Readable.from(storage.files.cat(cid, { path: path || undefined, offline: true })), response);
	}

	try {
		server.listen(port, "127.0.0.1");
		await once(server, "listening");
	} catch (error) { await storage.close(); throw error; }
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("IPFS service has no address.");
	return {
		url: `http://localhost:${address.port}`,
		async close() {
			await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
			await storage.close();
		},
	};
}
