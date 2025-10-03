import type { Web3 } from "@0xbuidlerhq/core";

/**
 * @dev
 */
type NomosId = `nomos-0x${string}`;

/**
 * @dev
 */
type Nomos<P extends Record<string, unknown> = {}> = {
	id: NomosId;

	name: string;
	description: string;

	networks: Web3.Networks.NetworkId[];
	tokens: Web3.Tokens.TokenId[];
	protocols: Web3.Protocols.ProtocolId[];

	params?: P;
};

const NomosRegistry = {
	"nomos-0x-aave": {
		id: "nomos-0x-aave",

		name: "AAVE",
		description: "",

		networks: ["base"],
		tokens: ["usdc", "eth"],
		protocols: ["aave"],

		params: {
			initialAmount: 0n as bigint,
		},
	},
} as const satisfies { [key: NomosId]: Nomos };

export { type NomosId, type Nomos, NomosRegistry };
