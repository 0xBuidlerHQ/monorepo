import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createIpfsService } from "./server.ts";

const directory = fileURLToPath(new URL("../", import.meta.url));
for (const name of [".env", ".env.local"]) {
	const path = resolve(directory, name);
	if (existsSync(path)) process.loadEnvFile(path);
}
const port = Number(process.env.IPFS_PORT ?? 3003);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("IPFS_PORT must be between 1 and 65535.");
const maxUploadBytes = Number(process.env.IPFS_MAX_UPLOAD_BYTES ?? 25 * 1024 * 1024);
if (!Number.isSafeInteger(maxUploadBytes) || maxUploadBytes < 1) throw new Error("IPFS_MAX_UPLOAD_BYTES must be a positive integer.");

const service = await createIpfsService({
	port,
	directory: resolve(directory, process.env.IPFS_DATA_DIR ?? ".data"),
	adminOrigin: process.env.IPFS_ADMIN_ORIGIN ?? "http://localhost:3002",
	maxUploadBytes,
});
console.log(`Local IPFS: ${service.url} (persistent storage, public networking disabled)`);
console.log(`Gateway: ${service.url}/ipfs/{cid}/{filename}`);

let stopping = false;
async function shutdown() {
	if (stopping) return;
	stopping = true;
	await service.close();
}
process.on("SIGINT", () => { void shutdown(); });
process.on("SIGTERM", () => { void shutdown(); });
