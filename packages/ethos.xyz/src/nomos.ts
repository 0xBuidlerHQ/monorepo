import type { Web3 } from "@0xbuidlerhq/core";

/**
 * @dev
 */
type NomosId = `nomos-0x${string}`;

/**
 * @dev
 */
type NomosEvent<O extends {} = {}> = {
	type: string;
	payload: O;
};

/**
 * @dev
 */
type Nomos<
	S extends Record<string, string> = Record<string, string>,
	E extends Record<string, NomosEvent<object>> = Record<string, NomosEvent<object>>,
	P extends Record<string, {}> = Record<string, {}>,
> = {
	id: NomosId;

	name: string;
	description: string;

	networks: Web3.Networks.NetworkId[];
	tokens: Web3.Tokens.TokenId[];
	protocols: Web3.Protocols.ProtocolId[];

	params: P;

	states: S;
	events: E & {
		START: {
			type: "START";
			payload: P;
		};
	};
	emitted: Record<string, object>;

	/**
	 * Dependencies: for each event key (from E) a sequence of states
	 * (must be keys of S)
	 */
	eventDependencies?: {
		[K in keyof E]?: Array<keyof S>;
	};
};

type EmptyEvent = Record<string, never>;
const NomosRegistry = {
	"nomos-0x-aave": defineNomos({
		id: "nomos-0x-aave",

		name: "AAVE",
		description: "",

		networks: ["base"],
		tokens: ["usdc", "eth"],
		protocols: ["aave"],

		params: {
			initialAmount: 0n as bigint,
		},

		states: {
			idle: "idle",
			chilling: "chilling",
			//
			__initializing__: "__initializing__",
			__depositing__: "__depositing__",
			__harvesting__: "__harvesting__",
			__withdrawing__: "__withdrawing__",
		} as const,

		events: {
			START: {
				type: "START",
				payload: {
					initialAmount: 0n as bigint,
				},
			},
			HARVEST: {
				type: "HARVEST",
				payload: {} as EmptyEvent,
			},
			WITHDRAW: {
				type: "WITHDRAW",
				payload: {} as EmptyEvent,
			},
		} as const,

		emitted: {} as const,

		eventDependencies: {
			START: ["__initializing__", "__depositing__", "chilling"],
			HARVEST: ["__harvesting__", "chilling"],
			WITHDRAW: ["__withdrawing__", "idle"],
		},
	}),
} as const satisfies { [key: NomosId]: Nomos };

function defineNomos<
	S extends Record<string, string>,
	P extends Record<string, {}>,
	E extends Record<string, NomosEvent<object>>,
>(
	nomos: Nomos<S, E, P> & {
		events: E & {
			START: NomosEvent<P>;
		};
	},
) {
	return nomos;
}

const getNomos = (id: NomosId) => (NomosRegistry as { [key: NomosId]: Nomos })[id];

export { type NomosId, type Nomos, NomosRegistry, type NomosEvent, getNomos };
