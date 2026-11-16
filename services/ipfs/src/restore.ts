import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createStorage } from "./storage.ts";

const directory = fileURLToPath(new URL("../", import.meta.url));
for (const name of [".env", ".env.local"]) {
	const path = resolve(directory, name);
	if (existsSync(path)) process.loadEnvFile(path);
}
const files = process.argv.slice(2);
if (!files.length) throw new Error("Stop the IPFS service, then run: pnpm --filter @0xhq/ipfs restore /absolute/path/to/archive.car [...]");
const storage = await createStorage(resolve(directory, process.env.IPFS_DATA_DIR ?? ".data"));
try {
	for (const filename of files) {
		const roots = await storage.restore(await readFile(resolve(filename)));
		for (const root of roots) console.log(`Restored and pinned ${root}`);
	}
} finally { await storage.close(); }
