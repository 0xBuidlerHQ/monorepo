import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { accountDatabase } from "./database.ts";

export type Credential = {
	id: string;
	rp_id: string;
	public_key: Uint8Array;
	counter: number;
	pub_x: string;
	pub_y: string;
};
export type ChallengePurpose = "register" | "login";
type Challenge = {
	challenge: string;
	purpose: ChallengePurpose;
	origin: string;
};

const tokenHash = (token: string) =>
	createHash("sha256").update(token).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

export function findCredential(id: string, rpId: string) {
	return accountDatabase()
		.prepare("SELECT * FROM credentials WHERE id = ? AND rp_id = ?")
		.get(id, rpId) as Credential | undefined;
}
export function saveCredential(row: Credential) {
	accountDatabase()
		.prepare("INSERT INTO credentials VALUES (?, ?, ?, ?, ?, ?)")
		.run(row.id, row.rp_id, row.public_key, row.counter, row.pub_x, row.pub_y);
}
export function updateCredentialCounter(id: string, counter: number) {
	accountDatabase()
		.prepare("UPDATE credentials SET counter = ? WHERE id = ?")
		.run(counter, id);
}
export function createChallenge(
	challenge: string,
	purpose: ChallengePurpose,
	origin: string,
	previousToken?: string,
) {
	const db = accountDatabase();
	db.prepare("DELETE FROM challenges WHERE expires < ?").run(Date.now());
	if (previousToken)
		db.prepare("DELETE FROM challenges WHERE token = ?").run(
			tokenHash(previousToken),
		);
	const token = newToken();
	db.prepare("INSERT INTO challenges VALUES (?, ?, ?, ?, ?)").run(
		tokenHash(token),
		challenge,
		purpose,
		origin,
		Date.now() + 300_000,
	);
	return token;
}
export function consumeChallenge(token: string) {
	// Atomic delete prevents reusing a challenge across concurrent requests.
	return accountDatabase()
		.prepare(
			"DELETE FROM challenges WHERE token = ? AND expires > ? RETURNING challenge, purpose, origin",
		)
		.get(tokenHash(token), Date.now()) as Challenge | undefined;
}
export function createSession(credentialId: string, lifetimeSeconds: number) {
	const db = accountDatabase();
	db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
	const token = newToken();
	db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(
		tokenHash(token),
		credentialId,
		Date.now() + lifetimeSeconds * 1000,
	);
	return token;
}
export function findSessionCredential(token: string, rpId: string) {
	return accountDatabase()
		.prepare(`SELECT c.* FROM credentials c JOIN sessions s ON c.id = s.credential_id
		WHERE s.token = ? AND s.expires > ? AND c.rp_id = ?`)
		.get(tokenHash(token), Date.now(), rpId) as Credential | undefined;
}
export function deleteSession(token: string) {
	accountDatabase()
		.prepare("DELETE FROM sessions WHERE token = ?")
		.run(tokenHash(token));
}
