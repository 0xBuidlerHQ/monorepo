import { loadConfig } from "./config.ts";
import { createApiService } from "./server.ts";

const service = await createApiService(loadConfig());
console.log(`TrueOrigin API: ${service.url} (private submissions and staff review)`);
console.log("Local admin: http://localhost:3002 (no password required in development)");
let stopping = false;
async function stop() { if (stopping) return; stopping = true; await service.close(); }
process.on("SIGINT", () => { void stop(); }); process.on("SIGTERM", () => { void stop(); });
