import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { once } from "node:events";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { digest, verifySignature, type ServiceKeys } from "@0xhq/api-client/protocol";
import type { PhotoSide } from "@0xhq/api-client/types";
import { openStore, type Actor } from "./store.ts";
import { HttpError } from "./errors.ts";

async function readBody(request: IncomingMessage, max: number) {
	if (Number(request.headers["content-length"]) > max) throw new HttpError(413, "Request is too large.");
	const chunks: Buffer[] = []; let size = 0;
	for await (const chunk of request.iterator({ destroyOnReturn: false })) {
		size += chunk.length;
		if (size > max) { request.resume(); throw new HttpError(413, "Request is too large."); }
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
function send(response: ServerResponse, status: number, value: unknown) { response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" }); response.end(JSON.stringify(value)); }
function parseJson(bytes: Uint8Array): unknown {
	try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
	catch { throw new HttpError(400, "Send valid JSON."); }
}
function photoType(bytes: Buffer) {
	if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return { contentType: "image/png", extension: "png" };
	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { contentType: "image/jpeg", extension: "jpg" };
	if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return { contentType: "image/webp", extension: "webp" };
	throw new HttpError(415, "Use a PNG, JPEG, or WebP photo.");
}

export async function createApiService({ directory, keys, adminPassword, port = 3004, allowDevelopmentAdmin = false }: { directory: string; keys: ServiceKeys; adminPassword: string; port?: number; allowDevelopmentAdmin?: boolean }) {
	if (keys.customer.length < 32 || keys.admin.length < 32 || keys.customer === keys.admin || adminPassword.length < 12) throw new Error("Use separate API secrets of at least 32 characters and a staff password of at least 12 characters.");
	await mkdir(join(directory, "uploads"), { recursive: true });
	const store = openStore(join(directory, "submissions.sqlite"), adminPassword);
	const server = createServer((request, response) => { void handle(request, response).catch((error: unknown) => {
		if (response.headersSent) { response.destroy(); return; }
		if (!(error instanceof HttpError)) console.error("API operation failed:", error instanceof Error ? error.name : "Unknown error");
		send(response, error instanceof HttpError ? error.status : 500, { error: error instanceof HttpError ? error.message : "The request could not be completed." });
	}); });
	server.requestTimeout = 30_000; server.headersTimeout = 10_000;
	async function handle(request: IncomingMessage, response: ServerResponse) {
		const address = server.address(), actualPort = address && typeof address !== "string" ? address.port : port;
		if (![ `localhost:${actualPort}`, `127.0.0.1:${actualPort}` ].includes(request.headers.host ?? "") || request.headers.origin) throw new HttpError(403, "Backend requests only.");
		response.setHeader("X-Content-Type-Options", "nosniff");
		const url = new URL(request.url ?? "/", `http://localhost:${actualPort}`), method = request.method ?? "GET";
		if (method === "GET" && url.pathname === "/health") { send(response, 200, { status: "ok", service: "trueorigin-api" }); return; }
		const photo = url.pathname.match(/^\/v1\/submissions\/([a-f0-9-]{36})\/photos\/(front|back)$/);
		const body = await readBody(request, photo && method === "POST" ? 8 * 1024 * 1024 : 64 * 1024);
		const headers = new Headers();
		for (const [key, value] of Object.entries(request.headers)) if (typeof value === "string") headers.set(key, value);
		const verified = verifySignature({ headers, keys, method, path: url.pathname + url.search, body });
		if (!verified) throw new HttpError(401, "Valid backend authentication is required.");
		store.useNonce(verified.client, verified.nonce, verified.expires);
		const token = headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
		if (verified.client === "admin" && verified.subject !== "staff") throw new HttpError(403, "Invalid staff identity.");
		if (method === "POST" && url.pathname === "/v1/staff/login") {
			if (verified.client !== "admin") throw new HttpError(403, "Staff sign-in requires the admin application.");
			const input = parseJson(body) as { password?: unknown } | null;
			send(response, 200, store.login(input?.password)); return;
		}
		const actor: Actor = verified.client === "customer" ? { kind: "customer", id: verified.subject } : !token && allowDevelopmentAdmin && process.env.NODE_ENV === "development" ? { kind: "staff", id: "admin" } : store.staff(token);
		if (url.pathname === "/v1/staff/session" && method === "GET" && actor.kind === "staff") { send(response, 200, { id: actor.id }); return; }
		if (url.pathname === "/v1/staff/logout" && method === "POST" && actor.kind === "staff") { store.logout(token); send(response, 200, { ok: true }); return; }
		if (url.pathname === "/v1/submissions") {
			if (method === "GET") { send(response, 200, store.list(actor)); return; }
			if (method === "POST") { send(response, 201, store.create(parseJson(body), actor)); return; }
		}
		if (photo) {
			const id = photo[1], side = photo[2] as PhotoSide;
			if (method === "GET") {
				const saved = store.photo(id, side, actor), bytes = await readFile(join(directory, "uploads", saved.filename));
				response.writeHead(200, { "Content-Type": saved.content_type, "Content-Length": bytes.length, "Cache-Control": "private, no-store", "Content-Security-Policy": "default-src 'none'" }); response.end(bytes); return;
			}
			if (method === "POST") {
				const submission = store.get(id, actor);
				if (actor.kind !== "customer" || submission.status !== "draft") throw new HttpError(403, "Only the owner can add photos to a draft.");
				const type = photoType(body);
				if (headers.get("content-type")?.split(";")[0] !== type.contentType) throw new HttpError(400, "Photo content must match its file type.");
				const sha256 = digest(body), filename = `${id}-${side}-${sha256}.${type.extension}`, temporary = join(directory, "uploads", `${randomUUID()}.tmp`);
				await writeFile(temporary, body, { mode: 0o600 }); await rename(temporary, join(directory, "uploads", filename));
				send(response, 200, store.savePhoto(id, side, { filename, content_type: type.contentType, size: body.length, sha256 }, actor)); return;
			}
		}
		const submission = url.pathname.match(/^\/v1\/submissions\/([a-f0-9-]{36})(\/submit|\/status)?$/);
		if (submission) {
			const id = submission[1], operation = submission[2];
			if (!operation && method === "GET") { send(response, 200, store.get(id, actor)); return; }
			if (operation === "/submit" && method === "POST") { send(response, 200, store.submit(id, actor)); return; }
			if (operation === "/status" && method === "PATCH") { send(response, 200, store.transition(id, parseJson(body), actor)); return; }
		}
		throw new HttpError(404, "Endpoint not found.");
	}
	try { server.listen(port, "127.0.0.1"); await once(server, "listening"); }
	catch (error) { store.close(); throw error; }
	const address = server.address(); if (!address || typeof address === "string") throw new Error("API failed to bind.");
	return { url: `http://localhost:${address.port}`, async close() { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); store.close(); } };
}
