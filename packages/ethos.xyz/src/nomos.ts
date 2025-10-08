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

export { type NomosId, type Nomos, type NomosEvent, defineNomos, type EmptyEvent };
