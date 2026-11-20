import { fileURLToPath } from "node:url";
import { cleanDevelopment } from "./dev-processes.mjs";

try {
 const { count, foreign } = await cleanDevelopment(fileURLToPath(new URL("../", import.meta.url)));
 console.log(`Development cleanup complete (${count} process${count === 1 ? "" : "es"} tracked). Development data and build caches were preserved.`);
 if (foreign.length) console.log(`Left unrelated processes on development ports untouched (PIDs: ${foreign.join(", ")}).`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
