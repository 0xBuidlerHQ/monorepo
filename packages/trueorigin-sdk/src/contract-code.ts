import type { Hex } from "viem";

// Solidity appends CBOR source metadata and its two-byte length to runtime code.
// Ignore that source-only trailer so moving a dependency does not invalidate the same executable contract.
export function executableCode(code: Hex): Hex {
	const byteLength = (code.length - 2) / 2;
	if (byteLength < 2) return code;
	const trailerLength = Number.parseInt(code.slice(-4), 16) + 2;
	if (trailerLength >= byteLength) return code;
	const start = 2 + (byteLength - trailerLength) * 2;
	const firstByte = Number.parseInt(code.slice(start, start + 2), 16);
	return firstByte >= 0xa0 && firstByte <= 0xbf ? code.slice(0, start) as Hex : code;
}

