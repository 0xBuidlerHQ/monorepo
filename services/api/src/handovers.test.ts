import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { handoverMethods, parseHandover } from "@0xhq/api-client/handovers";
import { openStore } from "./store.ts";
const staff = { kind: "staff", id: "admin" } as const;
const customer = { kind: "customer", id: "owner" } as const;
const password = "handover-test-password";
function inspected(store: ReturnType<typeof openStore>, result: "approved" | "rejected" = "approved") {
 let submission = store.create({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "12345678", contactEmail: "private@example.com", recipientAddress: "0x1111111111111111111111111111111111111111" }, customer);
 submission = store.submit(submission.id, customer);
 for (const status of ["accepted", "received", "under_inspection", result]) submission = store.transition(submission.id, { status, version: submission.version, note: status === "rejected" ? "Inspection could not confirm authenticity." : "" }, staff);
 return submission;
}
test("method definitions validate their own fields and discard unrelated details", () => {
 assert.deepEqual(parseHandover({ method: "in_person", details: { location: "  Paris  ", trackingNumber: "unused" } }), { method: "in_person", details: { location: "Paris" } });
 assert.deepEqual(parseHandover({ method: "in_person", details: {} }), { method: "in_person", details: { location: "" } });
 for (const value of [null, [], { method: "drone", details: {} }, { method: "__proto__", details: {} }, { method: "delivery", details: {} }, { method: "in_person", details: { location: 123 } }, { method: "in_person", details: { location: "x".repeat(201) } }]) assert.throws(() => parseHandover(value));
 assert.equal(Object.keys(handoverMethods).length, 2);
});
test("hand-to-hand uses the same owner-only confirmation workflow without requiring delivery details", async () => {
 const directory = await mkdtemp(join(tmpdir(), "trueorigin-handover-"));
 const store = openStore(join(directory, "submissions.sqlite"), password);
 try {
  const submission = inspected(store, "rejected");
  const input = { method: "in_person", details: { location: "TrueOrigin office" }, version: submission.version };
  assert.throws(() => store.recordReturn(submission.id, input, customer), /Only staff/);
  assert.throws(() => store.recordReturn(submission.id, { ...input, method: "unknown" }, staff), /supported handover/);
  const recorded = store.recordReturn(submission.id, input, staff);
  assert.equal(recorded.returnHandover?.method, "in_person"); assert.equal(recorded.returnHandover?.status, "awaiting_receipt");
  assert.equal(store.recordReturn(submission.id, input, staff).version, recorded.version);
  assert.throws(() => store.recordReturn(submission.id, { method: "delivery", details: { carrier: "DHL", trackingNumber: "123" }, version: recorded.version }, staff), /cannot be overwritten/);
  assert.throws(() => store.confirmReturn(submission.id, { version: recorded.version }, { kind: "customer", id: "stranger" }), /not found/);
  const received = store.confirmReturn(submission.id, { version: recorded.version }, customer);
  assert.equal(received.returnHandover?.status, "received"); assert(received.returnHandover?.receivedAt);
  assert.equal(received.passport, null); assert.equal(received.status, "rejected");
 } finally { store.close(); await rm(directory, { recursive: true, force: true }); }
});
test("v3 delivery records migrate without losing tracking, timestamps, receipt status or optimistic version", async () => {
 const directory = await mkdtemp(join(tmpdir(), "trueorigin-handover-migration-"));
 const path = join(directory, "submissions.sqlite");
 let store = openStore(path, password);
 try {
  const submission = inspected(store);
  store.close();
  const db = new DatabaseSync(path);
  db.exec(`DROP TABLE submission_handovers; CREATE TABLE submission_returns (submission_id TEXT PRIMARY KEY, carrier TEXT NOT NULL, tracking_number TEXT NOT NULL, status TEXT NOT NULL, dispatched_at TEXT NOT NULL, received_at TEXT, dispatched_by TEXT NOT NULL, received_by TEXT); PRAGMA user_version=3;`);
  db.prepare("INSERT INTO submission_returns VALUES (?,?,?,?,?,?,?,?)").run(submission.id, "DHL", "LEGACY-PRIVATE", "received", "2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z", "admin", "owner"); db.close();
  store = openStore(path, password);
  const migrated = store.get(submission.id, customer);
  assert.equal(migrated.version, submission.version);
  assert.deepEqual(migrated.returnHandover, { method: "delivery", details: { carrier: "DHL", trackingNumber: "LEGACY-PRIVATE" }, status: "received", recordedAt: "2026-01-01T00:00:00.000Z", receivedAt: "2026-01-02T00:00:00.000Z" });
  store.close(); store = openStore(path, password);
  assert.deepEqual(store.get(submission.id, customer).returnHandover, migrated.returnHandover);
 } finally { store.close(); await rm(directory, { recursive: true, force: true }); }
});
