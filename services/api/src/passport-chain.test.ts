import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLocalPassportIssuer } from "@0xhq/trueorigin-sdk/passport-issuer";

test("local issuance refuses a non-local endpoint and a loopback RPC reporting mainnet", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-chain-guard-"));
	const methods: string[] = [];
	const server = createServer(async (request, response) => {
		const chunks: Buffer[] = []; for await (const chunk of request) chunks.push(chunk);
		const message = JSON.parse(Buffer.concat(chunks).toString()); methods.push(message.method);
		response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ jsonrpc: "2.0", id: message.id, result: "0x1" }));
	});
	server.listen(0, "127.0.0.1"); await once(server, "listening");
	try {
		await assert.rejects(createLocalPassportIssuer(directory, "https://example.com"), /loopback/);
		const address = server.address(); assert(address && typeof address !== "string");
		const issuer = await createLocalPassportIssuer(directory, `http://127.0.0.1:${address.port}`);
		await assert.rejects(issuer.deployment(), /outside the local chain/);
		assert.deepEqual(methods, ["eth_chainId"]);
	} finally { await new Promise<void>(resolve => server.close(() => resolve())); await rm(directory, { recursive: true, force: true }); }
});
