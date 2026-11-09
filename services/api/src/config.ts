import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";
import { randomBytes } from "node:crypto";
import type { ServiceKeys } from "@0xhq/api-client/protocol";

export const serviceDirectory = fileURLToPath(new URL("../", import.meta.url));
export function loadConfig() {
	for (const name of [".env", ".env.local"]) { const path = join(serviceDirectory, name); if (existsSync(path)) process.loadEnvFile(path); }
	const directory = resolve(serviceDirectory, process.env.API_DATA_DIR ?? ".data"), production = process.env.NODE_ENV === "production";
	if (production && !process.env.API_DATA_DIR) throw new Error("Configure API_DATA_DIR on persistent storage.");
	mkdirSync(directory, { recursive: true, mode: 0o700 });
	let keys: ServiceKeys;
	let adminPassword = process.env.API_ADMIN_PASSWORD;
	if (process.env.API_CUSTOMER_SECRET && process.env.API_ADMIN_SECRET) keys = { customer: process.env.API_CUSTOMER_SECRET, admin: process.env.API_ADMIN_SECRET };
	else {
		if (production) throw new Error("Configure API_CUSTOMER_SECRET and API_ADMIN_SECRET.");
		const file = join(directory, "service-keys.json");
		if (!existsSync(file)) writeFileSync(file, JSON.stringify({ customer: randomBytes(32).toString("base64url"), admin: randomBytes(32).toString("base64url") }), { mode: 0o600, flag: "wx" });
		const localKeys = JSON.parse(readFileSync(file, "utf8")) as ServiceKeys;
		keys = { customer: process.env.API_CUSTOMER_SECRET ?? localKeys.customer, admin: process.env.API_ADMIN_SECRET ?? localKeys.admin };
	}
	if (!adminPassword) {
		if (production) throw new Error("Configure API_ADMIN_PASSWORD.");
		const file = join(directory, "admin-bootstrap.txt");
		if (!existsSync(file)) writeFileSync(file, randomBytes(18).toString("base64url"), { mode: 0o600, flag: "wx" });
		adminPassword = readFileSync(file, "utf8").trim();
	}
	const port = Number(process.env.API_PORT ?? 3004);
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("API_PORT must be between 1 and 65535.");
	return { directory, port, keys, adminPassword };
}
