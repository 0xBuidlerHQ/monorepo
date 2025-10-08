import { Nomos } from "@0xbuidlerhq/package-ethos.xyz";

/**
 * @dev
 */
const nomos = Nomos.defineNomos({
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
			payload: {} as Nomos.EmptyEvent,
		},
		WITHDRAW: {
			type: "WITHDRAW",
			payload: {} as Nomos.EmptyEvent,
		},
	} as const,

	emitted: {} as const,

	eventDependencies: {
		START: ["__initializing__", "__depositing__", "chilling"],
		HARVEST: ["__harvesting__", "chilling"],
		WITHDRAW: ["__withdrawing__", "idle"],
	},
});

export { nomos };
