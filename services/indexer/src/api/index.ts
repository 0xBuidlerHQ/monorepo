import { db } from "ponder:api";
import { passport, transfer } from "ponder:schema";
import { eq, asc, desc, and, or, lt, ne, replaceBigInts } from "ponder";
import { Hono } from "hono";
import { createPublicClient, http } from "viem";
import { loadDeployments } from "../../deployment.ts";
const app = new Hono();
const client = createPublicClient({
	transport: http(process.env.PASSPORT_RPC_URL ?? "http://127.0.0.1:8545", {
		retryCount: 0,
		timeout: 3000,
	}),
});
// Reject stale local-chain data after an Anvil reset, including reuse of the same chain ID.
app.use("/v1/*", async (c, next) => {
	try {
		const deployment = loadDeployments();
		if ((await client.getChainId()) !== deployment.chainId)
			throw new Error("Wrong chain");
		for (const contract of deployment.contracts) {
			const block = await client.getBlock({
				blockNumber: BigInt(contract.startBlock),
			});
			if (
				block.hash !== contract.blockHash ||
				!(await client.getCode({ address: contract.address }))
			)
				throw new Error("Deployment is unavailable");
		}
	} catch {
		return c.json(
			{ error: "The configured passport chain is unavailable or was reset." },
			503,
		);
	}
	await next();
});
app.get("/v1/passports", async (c) => {
	const owner = c.req.query("owner");
	if (owner && !/^0x[0-9a-f]{40}$/i.test(owner))
		return c.json({ error: "Invalid owner" }, 400);
	const rows = await db
		.select()
		.from(passport)
		.where(
			owner
				? eq(passport.owner, owner.toLowerCase() as `0x${string}`)
				: undefined,
		);
	return c.json(replaceBigInts(rows, (n) => n.toString()));
});
app.get("/v1/passports/:itemId", async (c) => {
	const itemId = c.req.param("itemId");
	if (!/^0x[0-9a-f]{64}$/i.test(itemId))
		return c.json({ error: "Invalid item ID" }, 400);
	const [row] = await db
		.select()
		.from(passport)
		.where(eq(passport.itemId, itemId.toLowerCase() as `0x${string}`));
	if (!row) return c.json({ error: "Passport not found" }, 404);
	const history = await db
		.select()
		.from(transfer)
		.where(eq(transfer.passportId, row.id))
		.orderBy(asc(transfer.blockNumber), asc(transfer.logIndex));
	return c.json(replaceBigInts({ ...row, history }, (n) => n.toString()));
});
const zeroAddress = "0x0000000000000000000000000000000000000000" as const;
app.get("/v1/activity/:id", async c => {
 const id = c.req.param("id");
 if (!/^[A-Za-z0-9_-]{21}[AQgw]$/.test(id)) return c.json({ error: "Invalid event ID." }, 400);
 const [row] = await db.select({ event: transfer, passport }).from(transfer)
  .innerJoin(passport, eq(transfer.passportId, passport.id))
  .where(eq(transfer.id, id)).limit(1);
 if (!row) return c.json({ error: "Event not found." }, 404);
 return c.json(replaceBigInts(row, n => n.toString()));
});
app.get("/v1/activity", async c => {
	const kind = c.req.query("kind") ?? "all";
	const cursor = c.req.query("cursor") ?? "";
	const limit = Number(c.req.query("limit") ?? 30);
	if (!["all", "sale", "listing", "transfer", "issued"].includes(kind) || !Number.isInteger(limit) || limit < 1 || limit > 50 || (cursor && !/^\d{1,19}:\d{1,10}$/.test(cursor))) return c.json({ error: "Invalid activity query." }, 400);
	const [block, log] = cursor ? cursor.split(":").map(BigInt) : [0n, 0n];
	if (block > 9223372036854775807n || log > 2147483647n) return c.json({ error: "Invalid activity cursor." }, 400);
	// Marketplace events require a marketplace contract; never infer a sale from an ERC-721 transfer.
	if (kind === "sale" || kind === "listing") return c.json({ events: [], nextCursor: null });
	const rows = await db.select({ event: transfer, passport }).from(transfer)
		.innerJoin(passport, eq(transfer.passportId, passport.id))
		.where(and(kind === "issued" ? eq(transfer.from, zeroAddress) : kind === "transfer" ? ne(transfer.from, zeroAddress) : undefined,
			cursor ? or(lt(transfer.blockNumber, block), and(eq(transfer.blockNumber, block), lt(transfer.logIndex, Number(log)))) : undefined))
		.orderBy(desc(transfer.blockNumber), desc(transfer.logIndex)).limit(limit + 1);
	const page = rows.slice(0, limit), last = page.at(-1);
	return c.json(replaceBigInts({ events: page, nextCursor: rows.length > limit && last ? `${last.event.blockNumber}:${last.event.logIndex}` : null }, n => n.toString()));
});
export default app;
