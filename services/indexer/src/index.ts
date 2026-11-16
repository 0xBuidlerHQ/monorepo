import { ponder } from "ponder:registry";
import { passport, transfer } from "ponder:schema";
import { trueOriginPassportAbi } from "@0xhq/trueorigin-sdk/passport";
const key = (address: string, tokenId: bigint) =>
	`${address.toLowerCase()}:${tokenId}`;
ponder.on("Passport:PassportIssued", async ({ event, context }) => {
	const metadataURI = await context.client.readContract({
		address: event.log.address,
		abi: trueOriginPassportAbi,
		functionName: "tokenURI",
		args: [event.args.tokenId],
	});
	await context.db
		.insert(passport)
		.values({
			id: key(event.log.address, event.args.tokenId),
			itemId: event.args.itemId,
			contractAddress: event.log.address,
			tokenId: event.args.tokenId,
			metadataURI,
			issuer: event.args.issuer,
			issuedTo: event.args.recipient,
			owner: event.args.recipient,
			transactionHash: event.transaction.hash,
			issuedAt: Number(event.block.timestamp),
		});
});
ponder.on("Passport:Transfer", async ({ event, context }) => {
	const id = key(event.log.address, event.args.tokenId);
	await context.db.update(passport, { id }).set({ owner: event.args.to });
	await context.db
		.insert(transfer)
		.values({
			id: event.id,
			passportId: id,
			from: event.args.from,
			to: event.args.to,
			transactionHash: event.transaction.hash,
			blockNumber: event.block.number,
			logIndex: event.log.logIndex,
			timestamp: Number(event.block.timestamp),
		});
});
