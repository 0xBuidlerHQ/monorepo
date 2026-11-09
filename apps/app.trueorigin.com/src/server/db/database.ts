import "server-only";

import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | undefined;

export function accountDatabase() {
	if (database) return database;
	if (process.env.NODE_ENV === "production" && !process.env.PASSKEY_DB_PATH)
		throw new Error("PASSKEY_DB_PATH must point to persistent storage.");
	const path =
		process.env.PASSKEY_DB_PATH ??
		resolve(process.cwd(), ".data/passkeys.sqlite");
	mkdirSync(dirname(path), { recursive: true });

	// Preserve credentials from the previous contracts-owned registry, including WAL data.
	const legacyPath = resolve(
		process.cwd(),
		"../../contracts/trueorigin.com/.data/passkeys.sqlite",
	);
	if (
		!process.env.PASSKEY_DB_PATH &&
		!existsSync(/* turbopackIgnore: true */ path) &&
		existsSync(/* turbopackIgnore: true */ legacyPath)
	) {
		const legacy = new DatabaseSync(legacyPath, { readOnly: true });
		try {
			legacy.prepare("VACUUM INTO ?").run(path);
		} finally {
			legacy.close();
		}
	}

	database = new DatabaseSync(path);
	database.exec(`
		PRAGMA journal_mode=WAL;
		CREATE TABLE IF NOT EXISTS credentials (
			id TEXT PRIMARY KEY, rp_id TEXT NOT NULL, public_key BLOB NOT NULL,
			counter INTEGER NOT NULL, pub_x TEXT NOT NULL, pub_y TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS challenges (
			token TEXT PRIMARY KEY, challenge TEXT NOT NULL, purpose TEXT NOT NULL,
			origin TEXT NOT NULL, expires INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS sessions (
			token TEXT PRIMARY KEY, credential_id TEXT NOT NULL, expires INTEGER NOT NULL
		);
	`);
	return database;
}
