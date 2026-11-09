import { request as httpRequest } from "node:http";
import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createIpfsService } from "./server.ts";

const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=", "base64");

test("real image and metadata CIDs remain readable after a restart", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-ipfs-"));
	let service = await createIpfsService({ directory, port: 0 });
	try {
		const upload = await fetch(`${service.url}/api/uploads`, { method: "POST", headers: { "Content-Type": "image/png", "X-File-Name": "front.png" }, body: image });
		assert.equal(upload.status, 201);
		const artwork = await upload.json();
		assert.match(artwork.cid, /^bafy/);
		assert.equal(artwork.uri, `ipfs://${artwork.cid}/front.png`);
		const metadata = JSON.stringify({ name: "Test passport", image: artwork.uri, report: "Inspection evidence. ".repeat(40_000) });
		const response = await fetch(`${service.url}/api/uploads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: metadata });
		assert.equal(response.status, 201);
		const passport = await response.json();
		assert.equal(await (await fetch(passport.gatewayUrl)).text(), metadata);
		const repeated = await fetch(`${service.url}/api/uploads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: metadata });
		assert.equal((await repeated.json()).cid, passport.cid);
		await service.close();
		service = await createIpfsService({ directory, port: 0 });
		const loaded = await fetch(`${service.url}/ipfs/${artwork.cid}/front.png`);
		assert.equal(loaded.status, 200);
		assert.equal(loaded.headers.get("content-type"), "image/png");
		assert.deepEqual(Buffer.from(await loaded.arrayBuffer()), image);
		assert.equal(await (await fetch(`${service.url}/ipfs/${passport.cid}/metadata.json`)).text(), metadata);
		const head = await fetch(`${service.url}/ipfs/${passport.cid}/metadata.json`, { method: "HEAD" });
		assert.equal(head.status, 200);
		assert.equal(head.headers.get("content-length"), String(Buffer.byteLength(metadata)));
		assert.equal((await fetch(`${service.url}/ipfs/${passport.cid}/metadata.json`)).headers.get("cache-control"), "public, max-age=31536000, immutable");
		assert.equal((await fetch(`${service.url}/ipfs/${passport.cid}/metadata.json`, { headers: { "If-None-Match": head.headers.get("etag") ?? "" } })).status, 304);
		assert.equal((await fetch(`${service.url}/ipfs/${passport.cid}/missing.json`)).status, 404);
	} finally { await service.close(); await rm(directory, { recursive: true, force: true }); }
});

test("local uploads reject untrusted origins, malformed files, and oversized bodies", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-ipfs-errors-"));
	const service = await createIpfsService({ directory, port: 0, maxUploadBytes: 128 });
	try {
		const upload = (headers: Record<string, string>, body = "{}") => fetch(`${service.url}/api/uploads`, { method: "POST", headers, body });
		assert.equal((await upload({ "Content-Type": "application/json", Origin: "https://untrusted.example" })).status, 403);
		const badHost = await new Promise<number | undefined>((resolve, reject) => {
			const request = httpRequest(`${service.url}/health`, { headers: { Host: "untrusted.example" } }, (response) => { response.resume(); resolve(response.statusCode); });
			request.on("error", reject); request.end();
		});
		assert.equal(badHost, 403);
		assert.equal((await upload({ "Content-Type": "application/json" }, "invalid")).status, 400);
		assert.equal((await upload({ "Content-Type": "application/json" }, "")).status, 400);
		assert.equal((await upload({ "Content-Type": "text/html" }, "<html>test</html>")).status, 415);
		assert.equal((await upload({ "Content-Type": "application/json", "X-File-Name": "../metadata.json" })).status, 400);
		assert.equal((await upload({ "Content-Type": "application/json" }, JSON.stringify({ large: "a".repeat(200) }))).status, 413);
		const chunked = await new Promise<number | undefined>((resolve, reject) => {
			const request = httpRequest(`${service.url}/api/uploads`, { method: "POST", headers: { "Content-Type": "application/json" } }, (response) => { response.resume(); resolve(response.statusCode); });
			request.on("error", reject); request.write('{"large":"'); request.write("a".repeat(200)); request.end('"}');
		});
		assert.equal(chunked, 413);
		const preflight = await fetch(`${service.url}/api/uploads`, { method: "OPTIONS", headers: { Origin: "http://localhost:3002" } });
		assert.equal(preflight.status, 204);
		assert.equal(preflight.headers.get("access-control-allow-origin"), "http://localhost:3002");
		assert.equal((await fetch(`${service.url}/ipfs/not-a-cid/metadata.json`)).status, 400);
	} finally { await service.close(); await rm(directory, { recursive: true, force: true }); }
});
