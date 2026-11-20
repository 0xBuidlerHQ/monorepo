import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { createServer } from "node:net";
import { once } from "node:events";
import { mkdtemp, readFile, rm, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { signedHeaders } from "@0xhq/api-client/protocol";
import type { PassportIssuance, Submission } from "@0xhq/api-client/types";
import { createApiService } from "./server.ts";
import { createIpfsService } from "../../ipfs/src/server.ts";
import { createStorage } from "../../ipfs/src/storage.ts";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
test("real local issuance, CAR restoration, restart idempotency, and external NFT ownership", { timeout: 180_000 }, async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-real-issuance-"));
	const reservation = createServer(); reservation.listen(0, "127.0.0.1"); await once(reservation, "listening");
	const address = reservation.address(); assert(address && typeof address !== "string");
	const port = address.port; await new Promise<void>(resolve => reservation.close(() => resolve()));
	const anvil = spawn("anvil", ["--port", String(port), "--chain-id", "31337", "--silent"], { stdio: "ignore" });
	const rpcURL = `http://127.0.0.1:${port}`;
	const indexReservation = createServer(); indexReservation.listen(0, "127.0.0.1"); await once(indexReservation, "listening");
	const indexAddress = indexReservation.address(); assert(indexAddress && typeof indexAddress !== "string");
	const indexPort = indexAddress.port; await new Promise<void>(resolve => indexReservation.close(() => resolve()));
	const indexerURL = `http://127.0.0.1:${indexPort}`;
	const deploymentsFile = join(directory, "deployments.json");
	let indexer: ReturnType<typeof spawn> | undefined;
	let indexLogs = "";
	async function stopIndexer() {
		const current = indexer; indexer = undefined;
		if (current && current.exitCode === null && current.signalCode === null) { const stopped = once(current, "exit"); current.kill("SIGTERM"); await stopped; }
	}
	async function startIndexer(database: string) {
		const cwd = fileURLToPath(new URL("../../indexer/", import.meta.url));
		indexer = spawn(process.execPath, [join(cwd, "scripts/dev.mjs")], {
			cwd, env: { ...process.env, NODE_ENV: "development", PONDER_PORT: String(indexPort), PASSPORT_RPC_URL: rpcURL, PASSPORT_DEPLOYMENTS_FILE: deploymentsFile, PONDER_DATABASE_DIR: join(directory, database), PONDER_TELEMETRY_DISABLED: "true" }, stdio: ["ignore", "pipe", "pipe"] });
		indexer.stdout?.on("data", chunk => { indexLogs += chunk; }); indexer.stderr?.on("data", chunk => { indexLogs += chunk; });
	}
	async function waitIndexed(owner?: string, expectedCount = 1) {
		for (let n = 0; n < 200; n++) {
			try {
				if (!(await fetch(`${indexerURL}/ready`)).ok) throw new Error("Not ready");
				const response = await fetch(`${indexerURL}/v1/passports`);
				const rows = await response.json();
				if (response.ok && rows.length === expectedCount && (!owner || rows[0].owner.toLowerCase() === owner)) return;
			} catch {}
			if (indexer?.exitCode !== null) throw new Error(`Indexer exited: ${indexLogs}`);
			await pause(150);
		}
		throw new Error(`Indexer did not catch up: ${indexLogs}`);
	}
	async function rpc(method: string, params: unknown[] = []) {
		const response = await fetch(rpcURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
		const result = await response.json(); if (result.error) throw new Error(JSON.stringify(result.error)); return result.result;
	}
	let api: Awaited<ReturnType<typeof createApiService>> | undefined;
	let ipfs: Awaited<ReturnType<typeof createIpfsService>> | undefined;
	try {
		for (let n = 0; ; n++) { try { assert.equal(await rpc("eth_chainId"), "0x7a69"); break; } catch (error) { if (n > 80) throw error; await pause(100); } }
		ipfs = await createIpfsService({ directory: join(directory, "ipfs"), port: 0 });
		const keys = { customer: "customer-test-secret-".repeat(3), admin: "admin-test-secret-".repeat(3) }, password = "local-issuance-test-password";
		const config = { directory: join(directory, "api"), keys, adminPassword: password, port: 0, passport: { enabled: true, bootstrap: true, rpcURL, ipfsURL: ipfs.url, indexerURL, deploymentsFile } };
		api = await createApiService(config);
		await startIndexer("index-original");
		let staffToken = "";
		async function call(path: string, method = "GET", value?: unknown, staff = false) {
			const body = value === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(value));
			const client = staff ? "admin" : "customer";
			return fetch(`${api?.url}${path}`, { method, headers: { ...signedHeaders({ client, secret: keys[client], subject: staff ? "staff" : "owner-a", method, path, body, token: staff ? staffToken : "" }), "Content-Type": "application/json" }, body: body.length ? body : undefined });
		}
		const wallet = "0x1111111111111111111111111111111111111111", buyer = "0x2222222222222222222222222222222222222222";
		const response = await call("/v1/submissions", "POST", { requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "12345678", contactEmail: "private@example.com", recipientAddress: wallet, notes: "Never publish this private note" });
		assert.equal(response.status, 201);
		let submission = await response.json() as Submission;
		submission = await (await call(`/v1/submissions/${submission.id}/submit`, "POST")).json();
		staffToken = (await (await call("/v1/staff/login", "POST", { password }, true)).json()).token;
		const path = `/v1/submissions/${submission.id}/passport`;
		await waitIndexed(undefined, 0);
        assert.deepEqual(await (await call("/v1/passports/public")).json(), []);
        assert.deepEqual(await (await call(`/v1/passports?wallet=${wallet}`)).json(), []);
        assert.deepEqual(await (await call("/v1/activity")).json(), { events: [], nextCursor: null });
        assert.equal((await call("/v1/passports/lookup?certifier=PSA&number=12345678")).status, 404);
		assert.equal((await call(path, "POST", {})).status, 403);
		assert.equal((await call(path, "POST", {}, true)).status, 409);
		for (const status of ["accepted", "received", "under_inspection", "approved"]) {
			const update = await call(`/v1/submissions/${submission.id}/status`, "PATCH", { status, version: submission.version, note: "" }, true);
			assert.equal(update.status, 200); submission = await update.json();
		}
		const queued = await call(path, "POST", { item: { type: "trading-card", schemaVersion: 1, category: "pokemon", attributes: { subject: "Charizard", set: "Base Set", number: "4", total: "102" } }, grade: "10", version: submission.version }, true);
		assert.equal(queued.status, 202);
		const first = await queued.json() as PassportIssuance;
		assert.equal((await (await call(path, "POST", {}, true)).json()).itemId, first.itemId);
		let minted: PassportIssuance | null = null;
		for (let n = 0; n < 150; n++) {
			const record = await (await call(`/v1/submissions/${submission.id}`, "GET", undefined, true)).json() as Submission;
			if (record.passport?.status === "confirmed") { minted = record.passport; break; }
			if (n === 149) throw new Error(`Issuance did not confirm: ${JSON.stringify(record.passport)}`);
			await pause(150);
		}
		assert(minted?.transactionHash && minted.contractAddress && minted.metadataURI && minted.imageURI);
		assert.equal(minted.tokenId, "1");
  assert.equal(minted.title, "Charizard — Base Set #4/102");
  assert.deepEqual(minted.item, { type: "trading-card", schemaVersion: 1, category: "pokemon", attributes: { subject: "Charizard", set: "Base Set", number: "4", total: "102" } });
		await waitIndexed(wallet);
		assert.notEqual(await rpc("eth_getCode", [minted.contractAddress, "latest"]), "0x");
		assert.equal((await (await call(`/v1/passports?wallet=${wallet}`)).json()).length, 1);
		const publicPath = `/v1/passports/${minted.itemId}`;
		const issuedActivity = await (await call("/v1/activity")).json();
		assert.equal(issuedActivity.events.length, 1); assert.equal(issuedActivity.events[0].kind, "issued");
		assert.equal(issuedActivity.events[0].itemId, minted.itemId); assert.equal(issuedActivity.events[0].passport.title, minted.title);
		assert.equal(issuedActivity.nextCursor, null);
  const registrationId = issuedActivity.events[0].id;
  const registrationDetail = await call(`/v1/activity/${encodeURIComponent(registrationId)}`);
  assert.equal(registrationDetail.status, 200);
  assert.deepEqual(await registrationDetail.json(), issuedActivity.events[0]);
  assert.equal((await call("/v1/activity/invalid")).status, 400);
  assert.equal((await call(`/v1/activity/${encodeURIComponent(`31337:0x${"f".repeat(64)}:0`)}`)).status, 404);
		for (const query of ["kind=unknown", "cursor=broken", "cursor=9999999999999999999:1", "limit=51", "limit=-1"]) assert.equal((await call(`/v1/activity?${query}`)).status, 400);
		for (const privateValue of ["private@example.com", "Never publish", "raw_tx", "submission_id"]) assert(!JSON.stringify(issuedActivity).includes(privateValue));

		const publicResult = await (await call(publicPath)).json();
  assert.deepEqual(publicResult.item, minted.item);
  const archivedMetadata = await (await call(`${publicPath}/metadata`)).json();
  assert.equal(archivedMetadata.name, minted.title);
  assert.deepEqual(archivedMetadata.trueorigin.item, minted.item);
  assert.equal(archivedMetadata.trueorigin.schema_version, "4");
		assert.equal(publicResult.verification.status, "verified");
		assert.equal(publicResult.verification.currentOwner.toLowerCase(), wallet);
		assert.equal(publicResult.verification.history.length, 1);
		assert.equal(publicResult.verification.history[0].kind, "mint");
		assert.equal(publicResult.inspection.status, "approved"); assert(publicResult.inspection.approvedAt);
		assert.equal(publicResult.inspection.revocationSupported, false);
		for (const privateValue of ["private@example.com", "Never publish", "recipientAddress", "raw_tx", "submission_id"]) assert(!JSON.stringify(publicResult).includes(privateValue));
		assert.equal((await (await call("/v1/passports/lookup?certifier=PSA&number=12345678")).json()).itemId, minted.itemId);
		assert.equal((await call(`/v1/passports/0x${"0".repeat(64)}`)).status, 404);
		// Public verification never loads or creates an issuer key.
		const keyPath = join(config.directory, "passport-chain", "issuer-key.txt");
		await rename(keyPath, `${keyPath}.saved`);
		try {
			assert.equal((await (await call(publicPath)).json()).verification.status, "verified");
			await assert.rejects(readFile(keyPath), { code: "ENOENT" });
		} finally { await rename(`${keyPath}.saved`, keyPath); }
		const backup = join(config.directory, "passports", minted.itemId);
		const metadata = await readFile(join(backup, "metadata.json"));
		assert(!metadata.toString().includes("private@example.com")); assert(!metadata.toString().includes("Never publish"));
		assert.equal(JSON.parse(metadata.toString()).image, minted.imageURI);
		const metadataCAR = await readFile(join(backup, "metadata.json.car")), imageCAR = await readFile(join(backup, "passport.svg.car"));
		// Restore into an entirely empty blockstore after the original IPFS service is gone.
		await ipfs.close(); ipfs = undefined;
		await rm(join(directory, "ipfs"), { recursive: true, force: true });
		const restored = await createStorage(join(directory, "restored-ipfs"));
		try {
			const [root] = await restored.restore(metadataCAR);
			assert(minted.metadataURI.includes(root.toString()));
			const chunks: Uint8Array[] = []; for await (const chunk of restored.files.cat(root, { path: "metadata.json" })) chunks.push(chunk);
			assert.deepEqual(Buffer.concat(chunks), metadata);
			const [imageRoot] = await restored.restore(imageCAR); assert(minted.imageURI.includes(imageRoot.toString()));
			const imageChunks: Uint8Array[] = []; for await (const chunk of restored.files.cat(imageRoot, { path: "passport.svg" })) imageChunks.push(chunk);
			assert.deepEqual(Buffer.concat(imageChunks), await readFile(join(backup, "passport.svg")));
		} finally { await restored.close(); }
		const publicImage = await call(`${publicPath}/image`); assert.equal(publicImage.status, 200); assert.match(publicImage.headers.get("content-security-policy") ?? "", /sandbox/);
		assert.equal((await call(`${publicPath}/metadata`)).status, 200);
		// Activity remains readable when immutable item facts are temporarily offline.
		await rename(backup, `${backup}.hidden`);
		try {
			const withoutMetadata = await (await call("/v1/activity")).json();
			assert.equal(withoutMetadata.events.length, 1); assert.equal(withoutMetadata.events[0].passport, null);
		} finally { await rename(`${backup}.hidden`, backup); }

		await api.close(); api = await createApiService(config);
		const repeat = await call(path, "POST", {}, true); assert.equal(repeat.status, 202);
		assert.equal((await repeat.json()).transactionHash, minted.transactionHash);
		// Private physical return is tracked separately from the public NFT.
        submission = await (await call(`/v1/submissions/${submission.id}`)).json();
        const returnPath = `/v1/submissions/${submission.id}/return`;
        assert.equal((await call(returnPath, "POST", { method: "delivery", details: { carrier: "DHL", trackingNumber: "PRIVATE-RETURN-123" }, version: submission.version })).status, 403);
        submission = await (await call(returnPath, "POST", { method: "delivery", details: { carrier: "DHL", trackingNumber: "PRIVATE-RETURN-123" }, version: submission.version }, true)).json();
        assert.equal(submission.returnHandover?.status, "awaiting_receipt");
        submission = await (await call(returnPath, "PATCH", { version: submission.version })).json();
        assert.equal(submission.returnHandover?.status, "received");
        assert(!JSON.stringify(await (await call(publicPath)).json()).includes("PRIVATE-RETURN"));
        assert(!JSON.stringify(await (await call("/v1/activity")).json()).includes("PRIVATE-RETURN"));
		// Simulate a standard transfer outside TrueOrigin on this isolated development chain.
		await rpc("anvil_impersonateAccount", [wallet]); await rpc("anvil_setBalance", [wallet, "0x8ac7230489e80000"]);
		const { stdout } = await promisify(execFile)("cast", ["calldata", "safeTransferFrom(address,address,uint256)", wallet, buyer, "1"]);
		await rpc("eth_sendTransaction", [{ from: wallet, to: minted.contractAddress, data: stdout.trim(), gas: "0x493e0" }]);
		await waitIndexed(buyer);
		assert.equal((await (await call(`/v1/passports?wallet=${wallet}`)).json()).length, 0);
		assert.equal((await (await call(`/v1/passports?wallet=${buyer}`)).json()).length, 1);
		const afterTransfer = await (await call(publicPath)).json();
		assert.equal(afterTransfer.verification.status, "verified");
		assert.equal(afterTransfer.verification.currentOwner.toLowerCase(), buyer);
		assert.equal(afterTransfer.verification.history.length, 2);
		assert.equal(afterTransfer.verification.history[1].kind, "transfer");
		const newest = await (await call("/v1/activity?limit=1")).json();
		assert.equal(newest.events.length, 1); assert.equal(newest.events[0].kind, "transfer");
  assert.deepEqual(await (await call(`/v1/activity/${encodeURIComponent(newest.events[0].id)}`)).json(), newest.events[0]);
  assert.equal((await (await call(`/v1/activity/${encodeURIComponent(registrationId)}`)).json()).kind, "issued");
		assert.equal(newest.events[0].to.toLowerCase(), buyer); assert(newest.nextCursor);
		const older = await (await call(`/v1/activity?limit=1&cursor=${encodeURIComponent(newest.nextCursor)}`)).json();
		assert.equal(older.events.length, 1); assert.equal(older.events[0].kind, "issued"); assert.equal(older.nextCursor, null);
		assert.notEqual(newest.events[0].id, older.events[0].id);
		for (const kind of ["issued", "transfer"]) {
			const filtered = await (await call(`/v1/activity?kind=${kind}`)).json();
			assert.equal(filtered.events.length, 1); assert.equal(filtered.events[0].kind, kind);
		}
		for (const kind of ["sale", "listing"]) assert.deepEqual(await (await call(`/v1/activity?kind=${kind}`)).json(), { events: [], nextCursor: null });

		// Private issuance caches cannot override the public source of truth.
		const db = new DatabaseSync(join(config.directory, "submissions.sqlite"));
		db.prepare("UPDATE passports SET data=json_set(data,'$.metadataURI',?,'$.title',?) WHERE item_id=?").run("ipfs://different/metadata.json", "Wrong item name", minted.itemId); db.close();
		assert.equal((await (await call(publicPath)).json()).title, minted.title);
		// Rebuild with an entirely empty index DB and a fresh API directory: no private SQLite or archive files.
		await stopIndexer();
		await rm(join(directory, "index-original"), { recursive: true, force: true });
		ipfs = await createIpfsService({ directory: join(directory, "restored-ipfs"), port: 0 });
		await startIndexer("index-rebuilt"); await waitIndexed(buyer);
		await api.close();
		api = await createApiService({ ...config, directory: join(directory, "api-empty"), passport: { ...config.passport, enabled: false, ipfsURL: ipfs.url } });
		const rebuilt = await (await call(publicPath)).json();
		assert.equal(rebuilt.verification.status, "verified");
		assert.deepEqual(rebuilt.item, minted.item);
		assert.equal(rebuilt.title, minted.title); assert.equal(rebuilt.metadataURI, minted.metadataURI);
		assert.equal(rebuilt.certificationNumber, "12345678"); assert.equal(rebuilt.grade, "10");
		assert.equal(rebuilt.verification.currentOwner.toLowerCase(), buyer);
		assert.equal(rebuilt.verification.history.length, 2);
		const rebuiltActivity = await (await call("/v1/activity")).json();
		assert.deepEqual(rebuiltActivity.events.map((event: { id: string }) => event.id), [newest.events[0].id, older.events[0].id]);
		assert.equal(rebuiltActivity.events[0].passport.title, minted.title);

		const indexedHistory = await (await fetch(`${indexerURL}/v1/passports/${minted.itemId}`)).json();
		assert.equal(indexedHistory.history.length, 2); assert.equal(indexedHistory.history[1].to.toLowerCase(), buyer);
		assert.equal(rebuilt.inspection.approvedAt, publicResult.inspection.approvedAt);
		assert.equal((await (await call(`/v1/passports?wallet=${buyer}`)).json()).length, 1);
		assert.equal((await (await call("/v1/passports/public")).json()).length, 1);
		assert.equal((await call(`${publicPath}/image`)).status, 200);
		assert.equal((await call(`${publicPath}/metadata`)).status, 200);
		assert.deepEqual(await (await call("/v1/submissions")).json(), []);
		await assert.rejects(readFile(join(directory, "api-empty", "passport-chain", "issuer-key.txt")), { code: "ENOENT" });
		console.log("Rebuilt registry, collection, item facts, approval date, images, and transfer history without submission SQLite or API backups.");

		await rpc("anvil_reset");
		assert.equal((await call(publicPath)).status, 503, "Anvil reset must not serve stale public passports");
		assert.equal((await call("/v1/activity")).status, 503);
		const stopped = once(anvil, "exit"); anvil.kill("SIGTERM"); await stopped;
		assert.equal((await call(publicPath)).status, 503);
		assert.equal((await call(`/v1/passports?wallet=${buyer}`)).status, 503);

	} finally {
		await stopIndexer(); await api?.close(); await ipfs?.close();
		if (anvil.exitCode === null && anvil.signalCode === null) { const exited = once(anvil, "exit"); anvil.kill("SIGTERM"); await exited; }
		await rm(directory, { recursive: true, force: true });
	}
});
