import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeFunctionData, encodeEventTopics, encodeAbiParameters } from "viem";
import type { ConnectedAccount } from "./account.ts";
import { sendPassportTransfer, transferRecipient, waitPassportTransfer } from "./transfers.ts";
import { trueOriginPassportAbi, trueOriginPassportRuntimeBytecode } from "./generated/passport.ts";
const owner = "0x1111111111111111111111111111111111111111";
const recipient = "0x2222222222222222222222222222222222222222";
const contractAddress = "0x3333333333333333333333333333333333333333";
const itemId = `0x${"a".repeat(64)}`;
const transfer = { contractAddress, recipient, itemId, tokenId: "1", metadataURI: "ipfs://metadata" };
test("recipient checks reject invalid, zero, self and passport contract addresses", () => {
 for (const address of ["not-a-wallet", "0x0000000000000000000000000000000000000000", owner, contractAddress]) assert.throws(() => transferRecipient(address, owner, contractAddress));
 assert.equal(transferRecipient(recipient, owner, contractAddress), recipient);
});
test("transfer checks chain, bytecode, live ownership and immutable identity before signing", async () => {
 let chain = 31337, code = trueOriginPassportRuntimeBytecode as string, actualOwner = owner, actualItem = itemId, sent = 0;
 const connection = { account: { address: owner }, publicClient: { chain: { id: 31337 }, getChainId: async () => chain, getCode: async () => code, readContract: async ({ functionName }: { functionName: string }) => functionName === "ownerOf" ? actualOwner : functionName === "itemIdOf" ? actualItem : transfer.metadataURI }, client: { sendUserOperation: async ({ calls }: { calls: { data: `0x${string}` }[] }) => { sent++; const decoded = decodeFunctionData({ abi: trueOriginPassportAbi, data: calls[0].data }); assert.equal(decoded.functionName, "safeTransferFrom"); assert.deepEqual(decoded.args, [owner, recipient, 1n]); return `0x${"b".repeat(64)}`; } } } as unknown as ConnectedAccount;
 chain = 1; await assert.rejects(sendPassportTransfer(connection, transfer), /local development/);
 chain = 31337; code = "0x1234"; await assert.rejects(sendPassportTransfer(connection, transfer), /does not match/);
 code = trueOriginPassportRuntimeBytecode; actualOwner = recipient; await assert.rejects(sendPassportTransfer(connection, transfer), /no longer owns/);
 actualOwner = owner; actualItem = `0x${"c".repeat(64)}`; await assert.rejects(sendPassportTransfer(connection, transfer), /identity changed/);
 assert.equal(sent, 0);
 actualItem = itemId; await sendPassportTransfer(connection, transfer); assert.equal(sent, 1);
});

test("confirmation requires the exact passport transfer event, not merely a successful operation", async () => {
 const hash = `0x${"b".repeat(64)}` as const;
 const pending = { ...transfer, hash };
 let logs: unknown[] = [];
 const connection = { account: { address: owner }, client: { waitForUserOperationReceipt: async () => ({ success: true, receipt: { transactionHash: hash, logs } }) } } as unknown as ConnectedAccount;
 await assert.rejects(waitPassportTransfer(connection, pending), /does not confirm/);
 logs = [{ address: contractAddress, topics: encodeEventTopics({ abi: trueOriginPassportAbi, eventName: "Transfer", args: { from: owner, to: recipient, tokenId: 1n } }), data: encodeAbiParameters([], []) }];
 assert.deepEqual(await waitPassportTransfer(connection, pending), { success: true, transactionHash: hash });
 await assert.rejects(waitPassportTransfer(connection, { ...pending, recipient: owner }), /does not confirm/);
});

test("a reverted operation is reported as failed and a receipt timeout can be checked again without resending", async () => {
 const hash = `0x${"b".repeat(64)}` as const;
 let calls = 0;
 const connection = { client: { waitForUserOperationReceipt: async () => {
  calls++;
  if (calls === 1) throw new Error("Receipt request timed out");
  return { success: false, receipt: { transactionHash: hash, logs: [] } };
 } } } as unknown as ConnectedAccount;
 const pending = { ...transfer, hash };
 await assert.rejects(waitPassportTransfer(connection, pending), /timed out/);
 assert.deepEqual(await waitPassportTransfer(connection, pending), { success: false, transactionHash: hash });
 assert.equal(calls, 2);
});
