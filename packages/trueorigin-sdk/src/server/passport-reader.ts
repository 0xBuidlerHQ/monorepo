import { createPublicClient, http, keccak256, parseEventLogs, zeroAddress, type Address, type Hash, type Hex } from "viem";
import { localEthereum } from "../config.ts";
import { trueOriginPassportAbi as abi, trueOriginPassportRuntimeBytecode } from "../generated/passport.ts";
import { executableCode } from "./contract-code.ts";

export class PassportMismatch extends Error {}
export function createPassportReader(rpcURL = "http://127.0.0.1:8545") {
	const client = createPublicClient({ chain: localEthereum, transport: http(rpcURL, { timeout: 8000, retryCount: 0 }) });
	return {
		async verify(expected: { contractAddress: Address; itemId: Hex; tokenId: string; metadataURI: string; transactionHash: Hash; issuedTo: Address }) {
			if (await client.getChainId() !== 31337) throw new PassportMismatch("The RPC is connected to a different network.");
			const block = await client.getBlock({ blockTag: "latest" });
			const address = expected.contractAddress, blockNumber = block.number;
			const code = await client.getCode({ address, blockNumber });
			if (!code || code === "0x" || keccak256(executableCode(code)) !== keccak256(executableCode(trueOriginPassportRuntimeBytecode))) throw new PassportMismatch("The contract does not match this passport version.");
			const tokenId = await client.readContract({ address, abi, functionName: "tokenIdForItem", args: [expected.itemId], blockNumber });
			if (!tokenId || tokenId.toString() !== expected.tokenId) throw new PassportMismatch("The registered item and on-chain token do not match.");
			const [owner, metadataURI, receipt] = await Promise.all([
				client.readContract({ address, abi, functionName: "ownerOf", args: [tokenId], blockNumber }),
				client.readContract({ address, abi, functionName: "tokenURI", args: [tokenId], blockNumber }),
				client.getTransactionReceipt({ hash: expected.transactionHash }),
			]);
			if (metadataURI !== expected.metadataURI) throw new PassportMismatch("The on-chain metadata reference does not match the recorded passport.");
			if (receipt.status !== "success" || receipt.blockNumber > blockNumber) throw new PassportMismatch("The issuance transaction is not confirmed in this chain snapshot.");
			const canonical = await client.getBlock({ blockNumber: receipt.blockNumber });
			if (canonical.hash !== receipt.blockHash) throw new PassportMismatch("The issuance transaction is no longer in the canonical chain.");
			const issuance = parseEventLogs({ abi, eventName: "PassportIssued", logs: receipt.logs, strict: true }).find(log => log.address.toLowerCase() === address.toLowerCase() && log.args.itemId === expected.itemId && log.args.tokenId === tokenId);
			if (!issuance || issuance.args.recipient.toLowerCase() !== expected.issuedTo.toLowerCase()) throw new PassportMismatch("The issuance event does not match the registered recipient.");
			const logs = await client.getContractEvents({ address, abi, eventName: "Transfer", args: { tokenId }, fromBlock: receipt.blockNumber, toBlock: blockNumber, strict: true });
			logs.sort((a, b) => a.blockNumber === b.blockNumber ? a.logIndex - b.logIndex : a.blockNumber < b.blockNumber ? -1 : 1);
			if (!logs.length || logs[0].args.from !== zeroAddress || logs[0].transactionHash !== expected.transactionHash || logs.at(-1)?.args.to.toLowerCase() !== owner.toLowerCase()) throw new PassportMismatch("The available transfer history does not reconcile with the current owner.");
			const selected = logs.slice(-200);
			const dates = new Map<bigint, string>();
			await Promise.all([...new Set(selected.map(log => log.blockNumber))].map(async number => {
				const entry = number === blockNumber ? block : await client.getBlock({ blockNumber: number });
				dates.set(number, new Date(Number(entry.timestamp) * 1000).toISOString());
			}));
			return {
				currentOwner: owner, issuer: issuance.args.issuer, blockNumber: blockNumber.toString(), blockHash: block.hash,
				historyTruncated: logs.length > selected.length,
				history: selected.map(log => ({ kind: log.args.from === zeroAddress ? "mint" as const : "transfer" as const, from: log.args.from, to: log.args.to, transactionHash: log.transactionHash, blockNumber: log.blockNumber.toString(), logIndex: log.logIndex, timestamp: dates.get(log.blockNumber) ?? "" })),
			};
		},
	};
}
