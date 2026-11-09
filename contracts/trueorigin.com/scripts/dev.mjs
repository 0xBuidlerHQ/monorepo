import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const contractsDirectory = fileURLToPath(new URL("../", import.meta.url));
const workspaceDirectory = resolve(contractsDirectory, "../..");

const ports = { ethereum: 8545, bundler: 4337 };
const ethereumRpc = `http://127.0.0.1:${ports.ethereum}`;
const bundlerRpc = `http://127.0.0.1:${ports.bundler}`;

const accountContracts = {
	"EntryPoint v0.7": "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
	"Kernel v3.3 factory": "0x2577507b78c2008Ff367261CB6285d44ba5eF2E9",
	"Kernel v3.3 implementation": "0xd6CEDDe84be40893d153Be9d467CD6aD37875b28",
	"Kernel meta factory": "0xd703aaE79538628d27099B8c4f621bE4CCd142d5",
	"Patched passkey validator": "0x7ab16Ff354AcB328452F1D445b3Ddee9a91e9e69",
};

// Anvil's publicly known development key. Only used on the isolated local fork.
const developmentKey =
	"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const processes = [];
let shuttingDown = false;

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

async function main() {
	const config = loadConfiguration();
	await checkPrerequisites(config);

	await startEthereumFork(config.forkUrl);
	await verifyAccountContracts();
	await startBundler();

	console.log(`Ethereum fork: 127.0.0.1:${ports.ethereum}`);
	console.log(`Bundler: 0.0.0.0:${ports.bundler}`);

	if (config.withApp) startApp(config);
}

// Environment and startup checks.

function loadConfiguration() {
	const rootEnvironmentFile = resolve(workspaceDirectory, ".env");
	if (existsSync(rootEnvironmentFile)) process.loadEnvFile(rootEnvironmentFile);
	const environmentFile = resolve(contractsDirectory, ".env");
	if (existsSync(environmentFile)) process.loadEnvFile(environmentFile);
	const appEnvironmentFile = resolve(
		workspaceDirectory,
		"apps/app.trueorigin.com/.env.local",
	);
	if (existsSync(appEnvironmentFile)) process.loadEnvFile(appEnvironmentFile);

	const appPort = Number(process.env.TRUEORIGIN_APP_PORT || 3001);
	if (!Number.isInteger(appPort) || appPort < 1 || appPort > 65535) {
		throw new Error("TRUEORIGIN_APP_PORT must be a port between 1 and 65535.");
	}

	return {
		appPort,
		appOrigin: process.env.PASSKEY_ORIGIN || `http://localhost:${appPort}`,
		forkUrl: ethereumForkUrl(),
		withApp: process.argv.includes("--app"),
	};
}

function ethereumForkUrl() {
	if (process.env.ETHEREUM_RPC_URL) return process.env.ETHEREUM_RPC_URL;
	if (process.env.ENV_ALCHEMY_BASE_RPC) {
		const endpoint = new URL(process.env.ENV_ALCHEMY_BASE_RPC);
		if (endpoint.hostname !== "base-mainnet.g.alchemy.com") {
			throw new Error("Set ETHEREUM_RPC_URL for this Alchemy endpoint.");
		}
		// Alchemy API keys can serve multiple networks; keep this fork on Ethereum.
		endpoint.hostname = "eth-mainnet.g.alchemy.com";
		return endpoint.href;
	}
	return "https://ethereum.publicnode.com";
}

async function checkPrerequisites({ appPort, forkUrl, withApp }) {
	if (spawnSync("anvil", ["--version"], { stdio: "ignore" }).status !== 0) {
		throw new Error(
			"Install Foundry (https://getfoundry.sh) so anvil is on PATH.",
		);
	}

	const requiredPorts = [ports.ethereum, ports.bundler];
	if (withApp) requiredPorts.push(appPort);
	if (new Set(requiredPorts).size !== requiredPorts.length) {
		throw new Error(
			"The app, Ethereum fork, and bundler must use different ports.",
		);
	}
	for (const port of requiredPorts) await checkPort(port);

	if ((await callRpc(forkUrl, "eth_chainId")) !== "0x1") {
		throw new Error("ETHEREUM_RPC_URL must be an Ethereum mainnet RPC.");
	}
}

async function checkPort(port) {
	await new Promise((resolvePromise, reject) => {
		const server = createServer();
		server.once("error", (error) => {
			reject(
				new Error(
					`Cannot use port ${port}: ${error.code}. Stop any service using it before starting TrueOrigin.`,
				),
			);
		});
		server.listen(port, "127.0.0.1", () => server.close(resolvePromise));
	});
}

// Start each service only after its dependencies are ready.

async function startEthereumFork(forkUrl) {
	console.log("Starting Ethereum mainnet fork (local chain 31337)…");
	startProcess(
		"Ethereum fork",
		"anvil",
		[
			"--fork-url",
			forkUrl,
			"--chain-id",
			"31337",
			"--host",
			"127.0.0.1",
			"--port",
			String(ports.ethereum),
			"--no-storage-caching",
			"--silent",
		],
		{ env: { ...process.env, RUST_LOG: "error" } },
	);
	await waitForRpc(ethereumRpc, "eth_chainId");
}

async function verifyAccountContracts() {
	for (const [name, address] of Object.entries(accountContracts)) {
		const code = await callRpc(ethereumRpc, "eth_getCode", [address, "latest"]);
		if (!code || code === "0x") {
			throw new Error(`${name} is missing from the Ethereum fork: ${address}`);
		}
	}
}

async function startBundler() {
	const altoDirectory = dirname(
		fileURLToPath(import.meta.resolve("@pimlico/alto")),
	);
	const altoCli = resolve(altoDirectory, "cli/alto.js");

	console.log("Starting ERC-4337 bundler…");
	startProcess("Bundler", process.execPath, [
		altoCli,
		"--entrypoints",
		accountContracts["EntryPoint v0.7"],
		"--executor-private-keys",
		developmentKey,
		"--utility-private-key",
		developmentKey,
		"--rpc-url",
		ethereumRpc,
		"--port",
		String(ports.bundler),
		"--safe-mode",
		"false",
		"--refilling-wallets",
		"false",
		"--log-level",
		"warn",
	]);
	await waitForRpc(bundlerRpc, "eth_supportedEntryPoints");
}

function startApp({ appPort, appOrigin }) {
	startProcess(
		"TrueOrigin app",
		"pnpm",
		["--filter", "@0xhq/app.trueorigin.com", "dev", "--port", String(appPort)],
		{
			cwd: workspaceDirectory,
			env: {
				...process.env,
				TRUEORIGIN_CHAIN_ID: "31337",
				PASSKEY_DB_PATH: resolve(contractsDirectory, ".data/passkeys.sqlite"),
				PASSKEY_ORIGIN: appOrigin,
			},
		},
	);
	console.log(`Open ${appOrigin}/explore`);
}

// RPC readiness and process lifecycle.

async function callRpc(url, method, params = []) {
	const response = await fetch(url, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
		signal: AbortSignal.timeout(2000),
	});
	if (!response.ok)
		throw new Error(`RPC request failed (HTTP ${response.status}).`);
	const body = await response.json();
	if (body.error) throw new Error(body.error.message);
	return body.result;
}

async function waitForRpc(url, method) {
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		try {
			return await callRpc(url, method);
		} catch {
			await delay(500);
		}
	}
	throw new Error(
		`Timed out waiting for ${url}. Check the RPC configuration and service logs.`,
	);
}

function startProcess(name, command, args, options = {}) {
	const child = spawn(command, args, {
		cwd: contractsDirectory,
		stdio: "inherit",
		detached: true,
		...options,
	});
	processes.push(child);
	child.on("error", (error) => {
		console.error(`${name}: ${error.message}`);
		void shutdown(1);
	});
	child.on("exit", (code, signal) => {
		if (shuttingDown) return;
		console.error(`${name} stopped unexpectedly (${signal ?? code}).`);
		void shutdown(code || 1);
	});
}

function signalProcesses(signal) {
	for (const child of processes) {
		if (!child.pid) continue;
		try {
			// Each detached child owns a process group, including its descendants.
			process.kill(-child.pid, signal);
		} catch (error) {
			if (error.code !== "ESRCH") console.error(error.message);
		}
	}
}

async function shutdown(exitCode = 0) {
	if (shuttingDown) return;
	shuttingDown = true;
	signalProcesses("SIGTERM");
	if (processes.length) {
		await delay(500);
		signalProcesses("SIGKILL");
	}
	process.exit(exitCode);
}

try {
	await main();
} catch (error) {
	console.error(error.message);
	await shutdown(1);
}
