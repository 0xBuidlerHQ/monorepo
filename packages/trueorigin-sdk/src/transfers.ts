import { encodeFunctionData, getAddress, isAddress, zeroAddress, parseEventLogs, type Hex } from "viem";
import type { ConnectedAccount } from "./account.ts";
import { executableCode } from "./contract-code.ts";
import { trueOriginPassportAbi, trueOriginPassportRuntimeBytecode } from "./generated/passport.ts";

export type PassportTransfer = { contractAddress: string; tokenId: string; itemId: string; metadataURI: string; recipient: string };
export function transferRecipient(value: string, owner: string, contract: string) {
	if (!isAddress(value, { strict: true })) throw new Error("Enter a valid Ethereum address. Mixed-case addresses must have a valid checksum.");
	const address = getAddress(value);
	if ([zeroAddress, owner, contract].some(other => other.toLowerCase() === address.toLowerCase())) throw new Error("Choose a different receiving wallet.");
	return address;
}
/** Revalidates live ownership and immutable identity immediately before requesting a signature. */
export async function sendPassportTransfer(connection: ConnectedAccount, transfer: PassportTransfer): Promise<Hex> {
	if (connection.publicClient.chain.id !== 31337 || await connection.publicClient.getChainId() !== 31337) throw new Error("Passport transfers currently require the local development chain.");
	const address = getAddress(transfer.contractAddress);
	const recipient = transferRecipient(transfer.recipient, connection.account.address, address);
	if (!/^\d+$/.test(transfer.tokenId) || !/^0x[0-9a-f]{64}$/i.test(transfer.itemId)) throw new Error("Invalid passport identity.");
	const tokenId = BigInt(transfer.tokenId);
	const code = await connection.publicClient.getCode({ address });
	if (!code || executableCode(code) !== executableCode(trueOriginPassportRuntimeBytecode)) throw new Error("The passport contract does not match TrueOrigin.");
	const [owner, itemId, uri] = await Promise.all([
		connection.publicClient.readContract({ address, abi: trueOriginPassportAbi, functionName: "ownerOf", args: [tokenId] }),
		connection.publicClient.readContract({ address, abi: trueOriginPassportAbi, functionName: "itemIdOf", args: [tokenId] }),
		connection.publicClient.readContract({ address, abi: trueOriginPassportAbi, functionName: "tokenURI", args: [tokenId] }),
	]);
	if (owner.toLowerCase() !== connection.account.address.toLowerCase()) throw new Error("This wallet no longer owns the passport.");
	if (itemId.toLowerCase() !== transfer.itemId.toLowerCase() || uri !== transfer.metadataURI) throw new Error("The passport identity changed. Reload before continuing.");
	return connection.client.sendUserOperation({ calls: [{ to: address, value: 0n, data: encodeFunctionData({ abi: trueOriginPassportAbi, functionName: "safeTransferFrom", args: [connection.account.address, recipient, tokenId] }) }] });
}

export async function waitPassportTransfer(connection: ConnectedAccount, pending: { hash: Hex; contractAddress: string; tokenId: string; recipient: string }) {
 const result = await connection.client.waitForUserOperationReceipt({ hash: pending.hash, timeout: 45_000 });
 if (result.success) {
  const events = parseEventLogs({ abi: trueOriginPassportAbi, eventName: "Transfer", logs: result.receipt.logs });
  if (!events.some(event => event.address.toLowerCase() === pending.contractAddress.toLowerCase() && event.args.from.toLowerCase() === connection.account.address.toLowerCase() && event.args.to.toLowerCase() === pending.recipient.toLowerCase() && event.args.tokenId === BigInt(pending.tokenId))) throw new Error("The receipt does not confirm this passport transfer. Keep the operation hash for investigation.");
 }
 return { success: result.success, transactionHash: result.receipt.transactionHash };
}
