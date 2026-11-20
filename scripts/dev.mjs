import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { freshDevelopmentEnvironment } from "./dev-environment.mjs";
import { assertNoDevelopment, superviseDevelopment } from "./dev-processes.mjs";

const workspace = fileURLToPath(new URL("../", import.meta.url));
const trueoriginOnly = process.argv.includes("--trueorigin");
const ports = [3001, 3002, 3003, 3004, 3005, 4337, 8545];
if (!trueoriginOnly) ports.push(3000);

async function checkPort(port) {
	await new Promise((resolve, reject) => {
		const server = createServer();
		server.once("error", error => reject(new Error(`Port ${port} is in use (${error.code}). Run make clean to stop this workspace's development processes. If the port belongs to another project, stop it there before restarting.`)));
		server.listen(port, "127.0.0.1", () => server.close(resolve));
	});
}

try {
	assertNoDevelopment(workspace);
	for (const port of ports) await checkPort(port);
	const rootEnv = join(workspace, ".env");
	if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);
	const { directory, env } = await freshDevelopmentEnvironment(workspace);
	console.log(`Starting a fresh development environment: ${directory}`);
	console.log(env.TRUEORIGIN_DEV_SEED === "true" ? "The same .dev-data directory is reset on each launch. Local demo submissions, NFTs, card images, and activity are seeded once the services are ready." : "The same .dev-data directory is reset on each launch. Demo seeding is disabled; the registry starts empty.");
	const args = ["dev"];
	if (trueoriginOnly) for (const name of ["app.trueorigin.com", "admin.trueorigin.com", "api", "ipfs", "indexer", "trueorigin-sdk"]) args.push(`--filter=@0xhq/${name}`);
	const child = spawn("pnpm", args, { cwd: workspace, env, stdio: "inherit", detached: true });
	const stop = superviseDevelopment(workspace, child);
	let stopping;
	const shutdown = code => {
		if (stopping) return stopping;
		stopping = stop().then(() => { process.exitCode = code; }).catch(error => { console.error(error.message); process.exitCode = 1; });
		return stopping;
	};
	for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(signal, () => void shutdown(0));
	child.once("error", error => { console.error(error.message); void shutdown(1); });
	child.once("exit", code => { if (!stopping) void shutdown(code ?? 1); });
} catch (error) {
	console.error(error.message);
	process.exitCode = 1;
}
