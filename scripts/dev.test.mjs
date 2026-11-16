import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { freshDevelopmentEnvironment } from "./dev-environment.mjs";
import { openStore } from "../services/api/src/store.ts";

const execute = promisify(execFile);
const accountModule = fileURLToPath(new URL("../apps/app.trueorigin.com/src/server/db/database.ts", import.meta.url));
async function accountCount(env, seed = false) {
	const code = `const { accountDatabase } = await import(${JSON.stringify(accountModule)}); const db = accountDatabase();
		${seed ? `db.prepare("INSERT INTO credentials VALUES (?,?,?,?,?,?)").run("old-credential", "localhost", new Uint8Array([1]), 0, "x", "y");` : ""}
		console.log(db.prepare("SELECT count(*) AS count FROM credentials").get().count); db.close();`;
	const result = await execute(process.execPath, ["--conditions=react-server", "--input-type=module", "-e", code], { env });
	return Number(result.stdout.trim());
}

test("each make dev environment starts with empty accounts and submissions in the same directory while preserving unrelated data", async () => {
	const workspace = await mkdtemp(join(tmpdir(), "trueorigin-dev-reset-"));
	const external = join(workspace, "existing-data");
	await mkdir(external); await writeFile(join(external, "keep.txt"), "existing development data");
	const inherited = { ...process.env, API_DATA_DIR: external, PASSKEY_DB_PATH: join(external, "accounts.sqlite"), IPFS_DATA_DIR: external, PASSPORT_DEPLOYMENTS_FILE: join(external, "deployments.json"), PONDER_DATABASE_DIR: external, DATABASE_URL: "postgresql://do-not-use/real-database", NODE_ENV: "production" };
	try {
		const first = await freshDevelopmentEnvironment(workspace, inherited);
		const store = openStore(join(first.env.API_DATA_DIR, "submissions.sqlite"), first.env.API_ADMIN_PASSWORD);
		try {
			const customer = { kind: "customer", id: "owner" }, staff = { kind: "staff", id: "admin" };
			let submission = store.create({ requestId: randomUUID(), gradingCompany: "PSA", certificationNumber: "12345678", contactEmail: "test@example.com", recipientAddress: `0x${"1".repeat(40)}` }, customer);
			submission = store.submit(submission.id, customer);
			for (const status of ["accepted", "received", "under_inspection", "approved"]) submission = store.transition(submission.id, { status, version: submission.version, note: "" }, staff);
			store.queuePassport(submission.id, { title: "Test card", grade: "10", version: submission.version }, staff);
			assert.equal(store.passportJobs().length, 1);
		}
		finally { store.close(); }
		assert.equal(await accountCount(first.env, true), 1);
		for (const path of [join(first.env.IPFS_DATA_DIR, "old-block"), first.env.PASSPORT_DEPLOYMENTS_FILE, join(first.env.PONDER_DATABASE_DIR, "old-index")]) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, "previous run state"); }

		const second = await freshDevelopmentEnvironment(workspace, inherited);
		assert.equal(first.directory, second.directory);
		assert.equal(second.directory, join(workspace, ".dev-data"));
		for (const key of ["API_DATA_DIR", "IPFS_DATA_DIR", "PASSKEY_DB_PATH", "PASSPORT_DEPLOYMENTS_FILE", "PONDER_DATABASE_DIR", "API_SERVICE_KEYS_FILE"]) {
			assert.equal(first.env[key], second.env[key]);
			assert(!relative(second.directory, second.env[key]).startsWith(".."));
		}
		const empty = openStore(join(second.env.API_DATA_DIR, "submissions.sqlite"), second.env.API_ADMIN_PASSWORD);
		try { assert.deepEqual(empty.list({ kind: "customer", id: "owner" }), []); assert.deepEqual(empty.passportJobs(), []); }
		finally { empty.close(); }
		assert.equal(await accountCount(second.env), 0);
		await assert.rejects(access(second.env.PASSPORT_DEPLOYMENTS_FILE));
		await assert.rejects(access(join(second.env.IPFS_DATA_DIR, "old-block")));
		await assert.rejects(access(join(second.env.PONDER_DATABASE_DIR, "old-index")));
		await assert.rejects(access(first.env.PASSPORT_DEPLOYMENTS_FILE));
		assert.equal(await readFile(join(external, "keep.txt"), "utf8"), "existing development data");
		assert.equal(second.env.DATABASE_URL, ""); assert.equal(second.env.NODE_ENV, "development");
		assert.equal(second.env.TRUEORIGIN_CHAIN_ID, "31337");
		assert.notEqual(first.env.API_CUSTOMER_SECRET, second.env.API_CUSTOMER_SECRET);
		assert.notEqual(first.env.API_ADMIN_SECRET, second.env.API_ADMIN_SECRET);
		const keys = JSON.parse(await readFile(second.env.API_SERVICE_KEYS_FILE, "utf8"));
		assert.equal(keys.customer, second.env.API_CUSTOMER_SECRET); assert.equal(keys.admin, second.env.API_ADMIN_SECRET);
		const turbo = JSON.parse(await readFile(new URL("../turbo.json", import.meta.url), "utf8"));
		for (const name of ["API_*", "IPFS_*", "PASSPORT_*", "PONDER_*", "PASSKEY_*", "TRUEORIGIN_*"]) assert(turbo.tasks.dev.passThroughEnv.includes(name));
	} finally { await rm(workspace, { recursive: true, force: true }); }
});
