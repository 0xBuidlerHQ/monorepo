import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { freshDevelopmentEnvironment } from "./dev-environment.mjs";

const workspace = fileURLToPath(new URL("../", import.meta.url));
const trueoriginOnly = process.argv.includes("--trueorigin");
const ports = [3001, 3002, 3003, 3004, 3005, 4337, 8545];
if (!trueoriginOnly) ports.push(3000);

async function checkPort(port) {
	await new Promise((resolve, reject) => {
		const server = createServer();
		server.once("error", error => reject(new Error(`Port ${port} is in use (${error.code}). Stop the previous development run before running make dev.`)));
		server.listen(port, "127.0.0.1", () => server.close(resolve));
	});
}

try {
	for (const port of ports) await checkPort(port);
	const rootEnv = join(workspace, ".env");
	if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);
	const { directory, env } = await freshDevelopmentEnvironment(workspace);
	console.log(`Starting a fresh development environment: ${directory}`);
	console.log("Accounts, submissions, IPFS, passport deployments and the public index start empty. The same .dev-data directory is reset on each launch.");
	const args = ["dev"];
	if (trueoriginOnly) for (const name of ["app.trueorigin.com", "admin.trueorigin.com", "api", "ipfs", "indexer", "trueorigin-sdk"]) args.push(`--filter=@0xhq/${name}`);
	const child = spawn("pnpm", args, { cwd: workspace, env, stdio: "inherit", detached: true });
	let stopping = false;
	let forceStop;
	const signalChild = signal => {
		if (!child.pid) return;
		try { process.kill(-child.pid, signal); } catch (error) { if (error.code !== "ESRCH") console.error(error.message); }
	};
	for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
		if (stopping) return;
		stopping = true;
		signalChild("SIGTERM");
		forceStop = setTimeout(() => signalChild("SIGKILL"), 10_000);
		forceStop.unref();
	});
	child.once("error", error => { console.error(error.message); process.exitCode = 1; });
	child.once("exit", code => { clearTimeout(forceStop); process.exitCode = stopping ? 0 : code ?? 1; });
} catch (error) {
	console.error(error.message);
	process.exitCode = 1;
}
