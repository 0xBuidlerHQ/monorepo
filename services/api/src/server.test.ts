import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { signedHeaders } from "@0xhq/api-client/protocol";
import type { Submission } from "@0xhq/api-client/types";
import { createApiService } from "./server.ts";

const keys = { customer: "customer-test-secret-".repeat(3), admin: "admin-test-secret-".repeat(3) };
const password = "local-test-password-123";
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=", "base64");
const details = (cert = "12345678") => ({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: cert, contactEmail: "owner@example.com", recipientAddress: "0x1111111111111111111111111111111111111111", notes: "Please inspect the slab." });

test("customer isolation, private photos, staff transitions, and persistence", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-api-"));
	let service = await createApiService({ directory, keys, adminPassword: password, port: 0 });
	const call = (path: string, method = "GET", value?: unknown, client: "customer" | "admin" = "customer", subject = "customer:a", token = "", bytes?: Buffer) => {
		const body = bytes ?? (value === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(value)));
		return fetch(service.url + path, { method, headers: { ...signedHeaders({ client, secret: keys[client], subject, method, path, body, token }), ...(body.length ? { "Content-Type": bytes ? "image/png" : "application/json" } : {}) }, body: body.length ? Uint8Array.from(body) : undefined });
	};
	try {
		const input = details();
		assert.equal((await call("/v1/submissions", "POST", { ...input, recipientAddress: "" })).status, 400);
		assert.equal((await call("/v1/submissions", "POST", { ...input, recipientAddress: "0x0000000000000000000000000000000000000000" })).status, 400);
		const created = await call("/v1/submissions", "POST", { ...input, owner: "customer:b" }); assert.equal(created.status, 201);
		const draft = await created.json() as Submission;
		assert.equal((await (await call("/v1/submissions", "POST", input)).json()).id, draft.id);
		assert.equal((await call(`/v1/submissions/${draft.id}`, "GET", undefined, "customer", "customer:b")).status, 404);
		for (const side of ["front", "back"]) assert.equal((await call(`/v1/submissions/${draft.id}/photos/${side}`, "POST", undefined, "customer", "customer:a", "", png)).status, 200);
		assert.equal((await call(`/v1/submissions/${draft.id}/photos/front`, "GET", undefined, "customer", "customer:b")).status, 404);
		const submitted = await call(`/v1/submissions/${draft.id}/submit`, "POST"); assert.equal(submitted.status, 200);
		let record = await submitted.json() as Submission; assert.equal(record.status, "requested");
		assert.equal((await call(`/v1/submissions/${draft.id}/status`, "PATCH", { status: "approved", version: record.version, note: "" })).status, 403);
		assert.equal((await call("/v1/submissions", "GET", undefined, "admin", "staff")).status, 401);
		assert.equal((await call("/v1/staff/login", "POST", { password })).status, 403);
		const loggedIn = await call("/v1/staff/login", "POST", { password }, "admin", "staff"); assert.equal(loggedIn.status, 200); const { token } = await loggedIn.json();
		assert.equal((await (await call("/v1/submissions", "GET", undefined, "admin", "staff", token)).json()).length, 1);
		const duplicate = await (await call("/v1/submissions", "POST", details(), "customer", "customer:b")).json() as Submission;
		for (const side of ["front", "back"]) await call(`/v1/submissions/${duplicate.id}/photos/${side}`, "POST", undefined, "customer", "customer:b", "", png);
		assert.equal((await call(`/v1/submissions/${duplicate.id}/submit`, "POST", undefined, "customer", "customer:b")).status, 409);
		assert.equal((await call(`/v1/submissions/${duplicate.id}/status`, "PATCH", { status: "cancelled", version: duplicate.version, note: "" }, "customer", "customer:b")).status, 200);
		assert.equal((await call(`/v1/submissions/${duplicate.id}`, "GET", undefined, "admin", "staff", token)).status, 404);
		assert.equal((await (await call("/v1/submissions", "GET", undefined, "admin", "staff", token)).json()).length, 1);
		for (const status of ["accepted", "received", "under_inspection", "approved"]) {
			const response = await call(`/v1/submissions/${draft.id}/status`, "PATCH", { status, version: record.version, note: "Inspection update" }, "admin", "staff", token);
			assert.equal(response.status, 200); record = await response.json();
		}
		assert.equal((await call(`/v1/submissions/${draft.id}/status`, "PATCH", { status: "rejected", version: 1, note: "stale" }, "admin", "staff", token)).status, 409);
		assert.equal((await call(`/v1/submissions/${draft.id}/photos/front`, "POST", undefined, "customer", "customer:a", "", png)).status, 403);
		await service.close(); service = await createApiService({ directory, keys, adminPassword: password, port: 0 });
		const persisted = await (await call(`/v1/submissions/${draft.id}`)).json() as Submission;
		assert.equal(persisted.status, "approved"); assert.equal(persisted.history.length, 6);
		const photo = await call(`/v1/submissions/${draft.id}/photos/front`); assert.equal(photo.headers.get("cache-control"), "private, no-store"); assert.deepEqual(Buffer.from(await photo.arrayBuffer()), png);
		await call("/v1/staff/logout", "POST", undefined, "admin", "staff", token);
		assert.equal((await call("/v1/submissions", "GET", undefined, "admin", "staff", token)).status, 401);
	} finally { await service.close(); await rm(directory, { recursive: true, force: true }); }
});

test("the API rejects unsigned, modified, expired, and replayed requests", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-api-auth-"));
	const service = await createApiService({ directory, keys, adminPassword: password, port: 0 });
	try {
		assert.equal((await fetch(`${service.url}/v1/submissions`)).status, 401);
		const path = "/v1/submissions", body = Buffer.from(JSON.stringify(details()));
		const headers = { ...signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "POST", path, body }), "Content-Type": "application/json" };
		assert.equal((await fetch(service.url + path, { method: "POST", headers, body: Buffer.from(JSON.stringify(details("87654321"))) })).status, 401);
		assert.equal((await fetch(service.url + path, { method: "POST", headers, body })).status, 201);
		assert.equal((await fetch(service.url + path, { method: "POST", headers, body })).status, 401);
		const expired = signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "GET", path, now: Date.now() - 60_000 });
		assert.equal((await fetch(service.url + path, { headers: expired })).status, 401);
		const simpleBody = Buffer.from(JSON.stringify({ ...details("87654321"), notes: undefined }));
		const simpleHeaders = signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "POST", path, body: simpleBody });
		const simple = await (await fetch(service.url + path, { method: "POST", headers: simpleHeaders, body: simpleBody })).json() as Submission;
		const submitPath = `/v1/submissions/${simple.id}/submit`;
		const submitted = await fetch(service.url + submitPath, { method: "POST", headers: signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "POST", path: submitPath }) });
		assert.equal(submitted.status, 200);
		const record = await submitted.json() as Submission;
		assert.equal(record.status, "requested"); assert.equal(record.photos.length, 0); assert.equal(record.notes, "");
		assert.equal(record.title, ""); assert.equal(record.grade, "");
		const cgcBody = Buffer.from(JSON.stringify({ ...details("87654321"), gradingCompany: "CGC" }));
		const cgcResponse = await fetch(service.url + path, { method: "POST", headers: signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "POST", path, body: cgcBody }), body: cgcBody });
		assert.equal(cgcResponse.status, 201);
		const cgc = await cgcResponse.json() as Submission; assert.equal(cgc.gradingCompany, "CGC");
		const cgcPath = `/v1/submissions/${cgc.id}/submit`;
		assert.equal((await fetch(service.url + cgcPath, { method: "POST", headers: signedHeaders({ client: "customer", secret: keys.customer, subject: "customer:a", method: "POST", path: cgcPath }) })).status, 200);
	} finally { await service.close(); await rm(directory, { recursive: true, force: true }); }
});

test("password-free local admin still requires its backend signature and is disabled in production", async () => {
	const directory = await mkdtemp(join(tmpdir(), "trueorigin-api-local-admin-"));
	const previous = process.env.NODE_ENV;
	process.env.NODE_ENV = "development";
	const service = await createApiService({ directory, keys, adminPassword: password, port: 0, allowDevelopmentAdmin: true });
	const path = "/v1/submissions";
	const admin = () => signedHeaders({ client: "admin", secret: keys.admin, subject: "staff", method: "GET", path });
	try {
		assert.equal((await fetch(service.url + path)).status, 401);
		assert.equal((await fetch(service.url + path, { headers: admin() })).status, 200);
		process.env.NODE_ENV = "production";
		assert.equal((await fetch(service.url + path, { headers: admin() })).status, 401);
	} finally {
		if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
		await service.close(); await rm(directory, { recursive: true, force: true });
	}
});
