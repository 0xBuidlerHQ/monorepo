import { loadConfig } from "./config.ts";
const { adminPassword } = loadConfig();
if (process.env.NODE_ENV === "production") throw new Error("Local bootstrap credentials are development-only.");
console.log(adminPassword);
