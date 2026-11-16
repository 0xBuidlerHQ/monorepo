import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { createLocalPassportIssuer } from "@0xhq/trueorigin-sdk/passport-issuer";
import { openStore } from "./store.ts";
import { createPassportWorkflow } from "./passports/workflow.ts";

const staff = { kind: "staff" as const, id: "admin" };
const customer = { kind: "customer" as const, id: "owner-a" };
const wallet = "0x1111111111111111111111111111111111111111" as const;
const contract = "0x2222222222222222222222222222222222222222" as const;
const metadataURI = "ipfs://bafy-test/metadata.json";
const imageURI = "ipfs://bafy-image/passport.svg";
const password = "test-password-for-passports";
function approved(store: ReturnType<typeof openStore>) {
	let submission = store.create({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "12345678", contactEmail: "private-owner@example.com", recipientAddress: wallet, notes: "Private inspection information" }, customer);
	submission = store.submit(submission.id, customer);
	for (const status of ["accepted", "received", "under_inspection", "approved"]) submission = store.transition(submission.id, { status, version: submission.version, note: "" }, staff);
	return submission;
}
function mockIssuer() {
	type Issuer = Awaited<ReturnType<typeof createLocalPassportIssuer>>;
	let broadcasts = 0, prepared = 0, deployed = 0;
	let timeoutAfterBroadcast = false;
	let record: { tokenId: string; owner: `0x${string}`; metadataURI: string } | null = null;
	const hash = `0x${"a".repeat(64)}` as const;
	const issuer: Issuer = {
		deployment: async () => { deployed++; return contract; },
		prepareIssue: async () => { prepared++; return { raw: "0x1234", hash }; },
		broadcast: async () => { broadcasts++; record = { tokenId: "1", owner: wallet, metadataURI }; if (timeoutAfterBroadcast) throw new Error("Simulated lost RPC response"); },
		receipt: async () => record ? { status: "success", transactionHash: hash } as NonNullable<Awaited<ReturnType<Issuer["receipt"]>>> : null,
		passport: async () => record,
	};
	return { issuer, get counts() { return { broadcasts, prepared, deployed }; }, loseResponse() { timeoutAfterBroadcast = true; }, transferTo(owner: `0x${string}`) { if (record) record.owner = owner; } };
}

test("issuance is staff-only, requires approval, and preserves the server-recorded recipient", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-passport-authorization-"));
	const store = openStore(join(directory, "submissions.sqlite"), password);
	const mock = mockIssuer();
	const workflow = createPassportWorkflow(directory, store, { enabled: true, issuer: mock.issuer, storeMetadata: async () => ({ metadataURI, imageURI }) });
	try {
		const draft = store.create({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "12345678", contactEmail: "a@example.com", recipientAddress: wallet }, customer);
		assert.throws(() => workflow.queue(draft.id, {}, customer), /Only staff/);
		store.submit(draft.id, customer);
		assert.throws(() => workflow.queue(draft.id, {}, staff), /Approve the inspection/);
		let submission = store.get(draft.id, staff);
		for (const status of ["accepted", "received", "under_inspection", "approved"]) submission = store.transition(draft.id, { status, version: submission.version, note: "" }, staff);
		const queued = workflow.queue(draft.id, { title: "Charizard", grade: "10", version: submission.version, recipientAddress: contract }, staff);
		assert.equal(queued.recipientAddress, wallet);
		assert.equal(workflow.queue(draft.id, { title: "Different", grade: "1", version: 0 }, staff).itemId, queued.itemId);
		await workflow.pump();
		assert.equal(store.get(draft.id, staff).passport?.status, "confirmed");
		assert.deepEqual(mock.counts, { broadcasts: 1, prepared: 1, deployed: 1 });
		assert.throws(() => store.get(draft.id, { kind: "customer", id: "other-owner" }), /not found/);
	} finally { await workflow.close(); store.close(); await rm(directory, { recursive: true, force: true }); }
});

test("a lost RPC response is reconciled after restart without signing or minting twice", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-passport-retry-"));
	let store = openStore(join(directory, "submissions.sqlite"), password);
	const submission = approved(store);
	const mock = mockIssuer(); mock.loseResponse();
	let workflow = createPassportWorkflow(directory, store, { enabled: true, issuer: mock.issuer, storeMetadata: async () => ({ metadataURI, imageURI }) });
	try {
		workflow.queue(submission.id, { title: "Charizard", grade: "10", version: submission.version }, staff);
		await workflow.pump();
		const uncertain = store.get(submission.id, staff).passport;
		assert.equal(uncertain?.status, "prepared"); assert(uncertain?.transactionHash);
		await workflow.close(); store.close();
		store = openStore(join(directory, "submissions.sqlite"), password);
		workflow = createPassportWorkflow(directory, store, { enabled: true, issuer: mock.issuer, storeMetadata: async () => ({ metadataURI, imageURI }) });
		await workflow.pump();
		const issued = store.get(submission.id, staff).passport;
		assert.equal(issued?.status, "confirmed"); assert.equal(issued?.tokenId, "1");
		assert.equal(issued?.transactionHash, uncertain?.transactionHash);
		assert.equal(mock.counts.prepared, 1); assert.equal(mock.counts.broadcasts, 1);

	} finally { await workflow.close(); store.close(); await rm(directory, { recursive: true, force: true }); }
});

test("storage failure prevents signing and broadcasting; production issuance remains disabled", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-passport-storage-"));
	const store = openStore(join(directory, "submissions.sqlite"), password);
	const submission = approved(store), mock = mockIssuer();
	const workflow = createPassportWorkflow(directory, store, { enabled: true, issuer: mock.issuer, storeMetadata: async () => { throw new Error("Backup unavailable"); } });
	const previous = process.env.NODE_ENV;
	try {
		workflow.queue(submission.id, { title: "Charizard", grade: "10", version: submission.version }, staff);
		await workflow.pump();
		assert.deepEqual(mock.counts, { broadcasts: 0, prepared: 0, deployed: 0 });
		assert.equal(store.get(submission.id, staff).passport?.error, "Backup unavailable");
		process.env.NODE_ENV = "production";
		assert.throws(() => workflow.queue(submission.id, {}, staff), /only in local development/);
	} finally {
		if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
		await workflow.close(); store.close(); await rm(directory, { recursive: true, force: true });
	}
});


test("physical returns require staff dispatch and owner receipt, survive restart, and remain independent of minting", async () => {
 const directory = await mkdtemp(join(tmpdir(), "trueorigin-return-"));
 const filename = join(directory, "submissions.sqlite");
 let store = openStore(filename, password);
 try {
  const submission = approved(store), input = { method: "delivery", details: { carrier: "DHL", trackingNumber: "PRIVATE-TRACKING" }, version: submission.version };
  assert.throws(() => store.confirmReturn(submission.id, { version: submission.version }, customer), /not been recorded/);
  assert.throws(() => store.recordReturn(submission.id, input, customer), /Only staff/);
  assert.throws(() => store.recordReturn(submission.id, { ...input, version: 0 }, staff), /changed/);
  const dispatched = store.recordReturn(submission.id, input, staff);
  assert.equal(dispatched.returnHandover?.status, "awaiting_receipt"); assert.equal(dispatched.passport, null);
  assert.equal(store.recordReturn(submission.id, input, staff).version, dispatched.version);
  assert.throws(() => store.recordReturn(submission.id, { ...input, details: { carrier: "DHL", trackingNumber: "replacement" } }, staff), /cannot be overwritten/);
  assert.throws(() => store.confirmReturn(submission.id, { version: dispatched.version }, staff), /Only the owner/);
  assert.throws(() => store.confirmReturn(submission.id, { version: dispatched.version }, { kind: "customer", id: "outsider" }), /not found/);
  assert.throws(() => store.confirmReturn(submission.id, { version: 0 }, customer), /changed/);
  store.close(); store = openStore(filename, password);
  const restored = store.get(submission.id, customer).returnHandover;
  assert.equal(restored?.method, "delivery");
  assert(restored?.method === "delivery"); assert.equal(restored.details.trackingNumber, "PRIVATE-TRACKING");
  const received = store.confirmReturn(submission.id, { version: dispatched.version }, customer);
  assert.equal(received.returnHandover?.status, "received"); assert(received.returnHandover?.receivedAt);
  assert.equal(store.confirmReturn(submission.id, { version: 0 }, customer).version, received.version);
  const draft = store.create({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "87654321", contactEmail: "a@example.com", recipientAddress: wallet }, customer);
  const requested = store.submit(draft.id, customer);
  assert.throws(() => store.recordReturn(draft.id, { ...input, version: requested.version }, staff), /Record receipt/);
 } finally { store.close(); await rm(directory, { recursive: true, force: true }); }
});
