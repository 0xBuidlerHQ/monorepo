import { createConfig } from "ponder";
import { trueOriginPassportAbi } from "@0xhq/trueorigin-sdk/passport";
import { loadDeployments } from "./deployment.ts";
const deployment = loadDeployments();
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL)
	throw new Error("Production indexing requires DATABASE_URL (PostgreSQL).");
export default createConfig({
	database: process.env.DATABASE_URL
		? { kind: "postgres", connectionString: process.env.DATABASE_URL }
		: {
				kind: "pglite",
				directory: process.env.PONDER_DATABASE_DIR ?? ".ponder/pglite",
			},
	chains: {
		local: {
			id: 31337,
			rpc: process.env.PASSPORT_RPC_URL ?? "http://127.0.0.1:8545",
			pollingInterval: 1000,
		},
	},
	contracts: {
		Passport: {
			abi: trueOriginPassportAbi,
			chain: "local",
			address: deployment.contracts.map((c) => c.address),
			startBlock: Math.min(...deployment.contracts.map((c) => c.startBlock)),
		},
	},
});
