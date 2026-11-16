import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createPublicClient, http } from "viem";
import { writeFile, mkdir, rename, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const directory = fileURLToPath(new URL("../", import.meta.url));
for (const name of [".env", ".env.local"]) {
	const path = resolve(directory, name);
	if (existsSync(path)) process.loadEnvFile(path);
}
const manifest =
	process.env.PASSPORT_DEPLOYMENTS_FILE ??
	fileURLToPath(new URL("../deployments/local.json", import.meta.url));
// Migrate an existing trusted local deployment without consulting submission SQLite or creating a key.
async function discoverExisting() {
	try {
		await readFile(manifest);
		return;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	const apiDirectory = resolve(
		fileURLToPath(new URL("../../api/", import.meta.url)),
		process.env.API_DATA_DIR ?? ".data",
	);
	try {
		const state = JSON.parse(
			await readFile(`${apiDirectory}/passport-chain/deployment.json`, "utf8"),
		);
		if (!state.address || !state.transaction?.hash) return;
		const client = createPublicClient({
			transport: http(process.env.PASSPORT_RPC_URL ?? "http://127.0.0.1:8545", {
				retryCount: 0,
			}),
		});
		if ((await client.getChainId()) !== 31337) return;
		const receipt = await client.getTransactionReceipt({
			hash: state.transaction.hash,
		});
		if (
			receipt.status !== "success" ||
			receipt.contractAddress?.toLowerCase() !== state.address.toLowerCase()
		)
			return;
		await mkdir(dirname(manifest), { recursive: true });
		await writeFile(
			`${manifest}.tmp`,
			JSON.stringify(
				{
					chainId: 31337,
					contracts: [
						{
							address: state.address,
							startBlock: Number(receipt.blockNumber),
							blockHash: receipt.blockHash,
						},
					],
				},
				null,
				2,
			),
		);
		await rename(`${manifest}.tmp`, manifest);
	} catch (error) {
		if (error.code !== "ENOENT")
			console.log(
				"Waiting for the saved deployment to become available on the local chain.",
			);
	}
}
let child,
	previous = "",
	stopping = false;
async function stop() {
	if (!child) return;
	const current = child;
	child = undefined;
	await new Promise((resolve) => {
		current.once("exit", resolve);
		current.kill("SIGTERM");
	});
}
for (const signal of ["SIGINT", "SIGTERM"])
	process.on(signal, () => {
		stopping = true;
		void stop().then(() => process.exit(0));
	});
console.log(
	"Passport indexer: waiting for the local passport contract to initialize…",
);
while (!stopping) {
	await discoverExisting();
	let contents = "";
	try {
		contents = await readFile(manifest, "utf8");
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	if (contents && contents !== previous) {
		await stop();
		previous = contents;
		child = spawn(
			process.execPath,
			[
				fileURLToPath(
					new URL(
						"../node_modules/ponder/dist/esm/bin/ponder.js",
						import.meta.url,
					),
				),
				"dev",
				"--hostname",
				"127.0.0.1",
				"--port",
				process.env.PONDER_PORT ?? "3005",
			],
			{ cwd: directory, stdio: "inherit", env: process.env },
		);
		child.once("exit", (code) => {
			if (child && !stopping) {
				console.error(`Ponder exited (${code}); retrying…`);
				child = undefined;
				previous = "";
			}
		});
	}
	await new Promise((resolve) => setTimeout(resolve, 1000));
}
