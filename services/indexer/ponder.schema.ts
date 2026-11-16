import { onchainTable, index } from "ponder";
export const passport = onchainTable(
	"passport",
	(t) => ({
		id: t.text().primaryKey(),
		itemId: t.hex().notNull(),
		contractAddress: t.hex().notNull(),
		tokenId: t.bigint().notNull(),
		metadataURI: t.text().notNull(),
		issuer: t.hex().notNull(),
		issuedTo: t.hex().notNull(),
		owner: t.hex().notNull(),
		transactionHash: t.hex().notNull(),
		issuedAt: t.integer().notNull(),
	}),
	(table) => ({
		ownerIndex: index().on(table.owner),
		itemIndex: index().on(table.itemId),
	}),
);
export const transfer = onchainTable("transfer", (t) => ({
	id: t.text().primaryKey(),
	passportId: t.text().notNull(),
	from: t.hex().notNull(),
	to: t.hex().notNull(),
	transactionHash: t.hex().notNull(),
	blockNumber: t.bigint().notNull(),
	logIndex: t.integer().notNull(),
	timestamp: t.integer().notNull(),
}), table => ({ chronologicalIndex: index().on(table.blockNumber, table.logIndex), passportIndex: index().on(table.passportId) }));
