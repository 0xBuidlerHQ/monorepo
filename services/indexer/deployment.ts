import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
export const deploymentPath = resolve(
	process.env.PASSPORT_DEPLOYMENTS_FILE ??
		fileURLToPath(new URL("./deployments/local.json", import.meta.url)),
);
export function loadDeployments() {
	const value = JSON.parse(readFileSync(deploymentPath, "utf8")) as {
		chainId: number;
		contracts: {
			address: `0x${string}`;
			startBlock: number;
			blockHash: `0x${string}`;
		}[];
	};
	if (
		value.chainId !== 31337 ||
		!value.contracts.length ||
		value.contracts.some(
			(c) =>
				!/^0x[0-9a-f]{40}$/i.test(c.address) ||
				!Number.isSafeInteger(c.startBlock) ||
				c.startBlock < 0 ||
				!/^0x[0-9a-f]{64}$/i.test(c.blockHash),
		)
	)
		throw new Error("Invalid trusted passport deployment manifest.");
	return value;
}
