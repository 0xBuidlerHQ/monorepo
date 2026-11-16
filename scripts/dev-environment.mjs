import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

// Reset only the fixed make dev directory; never follow configured persistent data paths.
export async function freshDevelopmentEnvironment(workspace, inherited = process.env) {
	const directory = join(workspace, ".dev-data");
	await rm(directory, { recursive: true, force: true });
	await mkdir(directory, { recursive: true, mode: 0o700 });
	const api = join(directory, "api");
	await mkdir(api, { mode: 0o700 });
	const keys = { customer: randomBytes(32).toString("base64url"), admin: randomBytes(32).toString("base64url") };
	const keysFile = join(api, "service-keys.json");
	await writeFile(keysFile, JSON.stringify(keys), { mode: 0o600, flag: "wx" });
	const env = {
		...inherited,
		NODE_ENV: "development",
		API_DATA_DIR: api,
		API_PORT: "3004",
		ADMIN_ORIGIN: "http://localhost:3002",
		API_URL: "http://localhost:3004",
		API_SERVICE_KEYS_FILE: keysFile,
		API_CUSTOMER_SECRET: keys.customer,
		API_ADMIN_SECRET: keys.admin,
		API_ADMIN_PASSWORD: randomBytes(24).toString("base64url"),
		IPFS_DATA_DIR: join(directory, "ipfs"),
		IPFS_PORT: "3003",
		IPFS_ADMIN_ORIGIN: "http://localhost:3002",
		PASSPORT_IPFS_URL: "http://localhost:3003",
		PASSPORT_RPC_URL: "http://127.0.0.1:8545",
		PASSPORT_INDEXER_URL: "http://127.0.0.1:3005",
		PASSPORT_DEPLOYMENTS_FILE: join(directory, "deployments.json"),
		PASSPORT_LOCAL_ISSUANCE: "true",
		PASSPORT_LOCAL_BOOTSTRAP: "true",
		PASSKEY_DB_PATH: join(directory, "accounts", "passkeys.sqlite"),
		PASSKEY_ORIGIN: "http://localhost:3001",
		PASSKEY_RP_ID: "localhost",
		TRUEORIGIN_CHAIN_ID: "31337",
		TRUEORIGIN_APP_PORT: "3001",
		PONDER_DATABASE_DIR: join(directory, "indexer"),
		PONDER_PORT: "3005",
		// An exported empty value also prevents service .env files from selecting a shared database.
		DATABASE_URL: "",
		DATABASE_SCHEMA: "public",
	};
	return { directory, env };
}
