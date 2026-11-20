import { createHash } from "node:crypto";

// Versioned domain and canonical source identity keep IDs stable across reindexing.
export function createActivityId(
	chainId: number,
	transactionHash: string,
	logIndex: number,
) {
	if (
		!Number.isSafeInteger(chainId) ||
		chainId < 1 ||
		!/^0x[0-9a-f]{64}$/i.test(transactionHash) ||
		!Number.isSafeInteger(logIndex) ||
		logIndex < 0 ||
		logIndex > 2147483647
	)
		throw new Error("Invalid activity source.");
	const source = `trueorigin:activity:v1:${chainId}:${transactionHash.toLowerCase()}:${logIndex}`;
	return createHash("sha256")
		.update(source)
		.digest()
		.subarray(0, 16)
		.toString("base64url");
}
