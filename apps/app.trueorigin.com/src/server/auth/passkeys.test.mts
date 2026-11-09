import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import {
	type Credential,
	consumeChallenge,
	createChallenge,
	createSession,
	deleteSession,
	findSessionCredential,
	saveCredential,
} from "../db/account-store.ts";
import { accountDatabase } from "../db/database.ts";
import { passkeySettings, validateOrigin } from "./config.ts";
import {
	authenticationOptions,
	registrationOptions,
	verifyAuthentication,
	verifyRegistration,
} from "./passkeys.ts";

const directory = mkdtempSync(join(tmpdir(), "trueorigin-passkeys-"));
process.env.PASSKEY_DB_PATH = join(directory, "passkeys.sqlite");
process.env.PASSKEY_ORIGIN = "http://localhost:3001";
process.env.PASSKEY_RP_ID = "localhost";
after(() => {
	accountDatabase().close();
	rmSync(directory, { recursive: true, force: true });
});

test("registration creates discoverable ES256 credentials without device restrictions", async () => {
	const { options } = await registrationOptions();
	assert.equal(options.authenticatorSelection?.residentKey, "required");
	assert.equal(options.authenticatorSelection?.userVerification, "required");
	assert.equal(
		options.authenticatorSelection?.authenticatorAttachment,
		undefined,
	);
	assert.deepEqual(
		options.pubKeyCredParams.map((param) => param.alg),
		[-7],
	);
});

test("authentication discovers credentials without browser-local state", async () => {
	const { options } = await authenticationOptions();
	assert.equal(options.rpId, "localhost");
	assert.equal(options.userVerification, "required");
	assert.ok(!options.allowCredentials?.length);
});

test("only the configured origin is trusted", () => {
	assert.doesNotThrow(() => validateOrigin("http://localhost:3001"));
	for (const origin of [
		null,
		"https://untrusted.example",
		"http://localhost:3002",
	])
		assert.throws(() => validateOrigin(origin), /Origin not allowed/);
});

test("passkey verification needs a challenge, consumes it once, and checks its purpose", async () => {
	await assert.rejects(
		verifyRegistration({}),
		/Start passkey authentication again/,
	);
	const { token } = await registrationOptions();
	await assert.rejects(
		verifyRegistration({}, token),
		/Invalid passkey response/,
	);
	await assert.rejects(verifyRegistration({}, token), /expired/);
	const login = await authenticationOptions();
	await assert.rejects(verifyRegistration({}, login.token), /expired/);
});

test("invalid and expired challenges cannot be reused", () => {
	const token = createChallenge("challenge", "login", "http://localhost:3001");
	assert.equal(consumeChallenge(token)?.challenge, "challenge");
	assert.equal(consumeChallenge(token), undefined);
	const expired = createChallenge("expired", "login", "http://localhost:3001");
	accountDatabase().prepare("UPDATE challenges SET expires = 0").run();
	assert.equal(consumeChallenge(expired), undefined);
});

test("starting a new flow invalidates the previous challenge", async () => {
	const first = await registrationOptions();
	const second = await authenticationOptions(first.token);
	assert.equal(consumeChallenge(first.token), undefined);
	assert.equal(consumeChallenge(second.token)?.purpose, "login");
});

test("unknown credentials cannot authenticate", async () => {
	const { token } = await authenticationOptions();
	await assert.rejects(
		verifyAuthentication({ id: "unknown", response: {} }, token),
		/not registered/,
	);
});

test("sessions are opaque, RP-scoped, expiring, and revocable", () => {
	const credential: Credential = {
		id: "test-credential",
		rp_id: "localhost",
		public_key: new Uint8Array([1, 2]),
		counter: 0,
		pub_x: "0x01",
		pub_y: "0x02",
	};
	saveCredential(credential);
	const token = createSession(credential.id, 60);
	assert.equal(findSessionCredential(token, "localhost")?.id, credential.id);
	assert.equal(findSessionCredential(token, "other.example"), undefined);
	assert.equal(findSessionCredential("forged-token", "localhost"), undefined);
	assert.equal(
		accountDatabase()
			.prepare("SELECT token FROM sessions WHERE token = ?")
			.get(token),
		undefined,
	);
	deleteSession(token);
	assert.equal(findSessionCredential(token, "localhost"), undefined);
	const expired = createSession(credential.id, -1);
	assert.equal(findSessionCredential(expired, "localhost"), undefined);
});

test("RP configuration is constrained to the trusted origin", () => {
	const previous = process.env.PASSKEY_RP_ID;
	process.env.PASSKEY_RP_ID = "other.example";
	try {
		assert.throws(passkeySettings, /must match/);
	} finally {
		process.env.PASSKEY_RP_ID = previous;
	}
});
