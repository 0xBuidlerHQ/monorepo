import { join } from "node:path";
import { loadConfig } from "./config.ts";
import { createApiService } from "./server.ts";
import { seedDevelopmentData } from "./development/seed.ts";

const config = loadConfig();
const service = await createApiService(config);
console.log(`TrueOrigin API: ${service.url} (private submissions and staff review)`);
console.log("Local admin: http://localhost:3002 (no password required in development)");
const controller = new AbortController();
const seeding = config.seed ? seedDevelopmentData({ apiURL: service.url, rpcURL: config.passport.rpcURL, keys: config.keys, adminPassword: config.adminPassword, manifest: join(config.directory, "development-seed.json"), signal: controller.signal }).catch(error => {
 if (!controller.signal.aborted) console.error("Development seed failed:", error instanceof Error ? error.message : "Unknown error");
}) : Promise.resolve();
let stopping = false;
async function stop() { if (stopping) return; stopping = true; controller.abort(); await seeding; await service.close(); }
process.on("SIGINT", () => { void stop(); }); process.on("SIGTERM", () => { void stop(); });
