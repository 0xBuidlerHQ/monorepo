import type { AAVELidoClassic } from "@0xbuidlerhq/package-ethos.xyz";
import { type Actor, assign, fromPromise, setup } from "xstate";

interface StrategyLogs {
	event: StrategyEvent;
	timestamp: string;
}

interface StrategyContext {
	params: AAVELidoClassic.Params | undefined;

	internal: {
		logs: StrategyLogs[];
	};
}

enum StrategyState {
	/**
	 * @dev Stable states.
	 */
	idle = "idle",
	chilling = "chilling",

	/**
	 * @dev Transient states.
	 */
	_initializing = "_initializing",
	_depositing = "_depositing",
	_harvesting = "_harvesting",
	_withdrawing = "_withdrawing",
}

enum StrategyActor {
	initialize = "initialize",
	depositFunds = "depositFunds",
	harvestFunds = "harvestFunds",
	withdrawFunds = "withdrawFunds",
}

type EventPayloads = {
	START: AAVELidoClassic.Params;
	HARVEST: undefined;
	WITHDRAW: undefined;
};

type StrategyEvent = {
	[K in keyof EventPayloads]: { type: K; payload: EventPayloads[K] };
}[keyof EventPayloads];

const StrategyEvent = {
	Start: (payload: EventPayloads["START"]): StrategyEvent => ({
		type: "START",
		payload,
	}),
	Harvest: (payload: EventPayloads["HARVEST"] = undefined): StrategyEvent => ({
		type: "HARVEST",
		payload,
	}),
	Withdraw: (payload: EventPayloads["WITHDRAW"] = undefined): StrategyEvent => ({
		type: "WITHDRAW",
		payload,
	}),
};

type StrategyEmitted =
	//
	{ type: ""; payload: undefined };

interface ActorInput {
	context: StrategyContext;
	event: StrategyEvent;
}

const initialize = fromPromise<void, ActorInput>(async ({ input, self, signal, emit }) => {
	console.log("initializing");
	const { context, event } = input; // fully typed

	// simulate async deposit
	return await new Promise<void>((resolve) =>
		setTimeout(() => {
			context.internal.logs.push({
				event,
				timestamp: new Date().toISOString(),
			});

			resolve();
		}, 1000),
	);
});

const depositFunds = fromPromise<void, ActorInput>(async ({ input, self, signal, emit }) => {
	console.log("depositFunds");
	const { context, event } = input; // fully typed

	// simulate async deposit
	return await new Promise<void>((resolve) =>
		setTimeout(() => {
			context.internal.logs.push({
				event,
				timestamp: new Date().toISOString(),
			});

			resolve();
		}, 1000),
	);
});

const harvestFunds = fromPromise<void, ActorInput>(async ({ input, self, signal, emit }) => {
	console.log("harvestFunds");
	const { context, event } = input; // fully typed

	// simulate async deposit
	return await new Promise<void>((resolve) =>
		setTimeout(() => {
			context.internal.logs.push({
				event,
				timestamp: new Date().toISOString(),
			});
			resolve();
		}, 1000),
	);
});

const withdrawFunds = fromPromise<void, ActorInput>(async ({ input, self, signal, emit }) => {
	console.log("withdrawFunds");
	const { context, event } = input; // fully typed

	// simulate async deposit
	return await new Promise<void>((resolve) =>
		setTimeout(() => {
			context.internal.logs.push({
				event,
				timestamp: new Date().toISOString(),
			});
			resolve();
		}, 1000),
	);
});

// ---------------------------
// Create machine
// ---------------------------
const StrategyMachineSetup = setup({
	types: {
		context: {} as StrategyContext,
		events: {} as StrategyEvent,
		emitted: {} as StrategyEmitted,
	} as const,
	actors: {
		[StrategyActor.initialize]: initialize,
		[StrategyActor.depositFunds]: depositFunds,
		[StrategyActor.harvestFunds]: harvestFunds,
		[StrategyActor.withdrawFunds]: withdrawFunds,
	},
});

const StrategyMachine = StrategyMachineSetup.createMachine({
	id: "aaveStrategy",
	initial: StrategyState.idle,
	context: {
		params: undefined,

		internal: {
			logs: [],
		},
	},
	on: {},
	states: {
		/**
		 * @dev Idle state.
		 */
		[StrategyState.idle]: {
			on: {
				START: {
					target: StrategyState._initializing,

					actions: assign({ params: ({ event }) => event.payload }),
				},

				"*": { actions: () => console.log("Unknown event") },
			},
		},

		/**
		 * @dev Initializing state.
		 */
		[StrategyState._initializing]: {
			invoke: {
				src: StrategyActor.initialize,
				input: (c) => c,

				onDone: {
					target: StrategyState._depositing,
				},
			},

			on: {
				"*": { actions: () => console.log("Unknown event") },
			},
		},

		/**
		 * @dev Depositing state.
		 */
		[StrategyState._depositing]: {
			invoke: {
				src: StrategyActor.depositFunds,
				input: (c) => c,

				onDone: {
					target: StrategyState.chilling,
				},
			},

			on: {
				"*": { actions: () => console.log("Unknown event") },
			},
		},

		/**
		 * @dev Chilling state.
		 */
		[StrategyState.chilling]: {
			on: {
				HARVEST: {
					target: StrategyState._harvesting,
				},

				WITHDRAW: {
					target: StrategyState._withdrawing,
				},

				"*": { actions: () => console.log("Unknown event") },
			},
		},

		/**
		 * @dev Harvesting state.
		 */
		[StrategyState._harvesting]: {
			invoke: {
				src: StrategyActor.harvestFunds,
				input: (c) => c,

				onDone: {
					target: StrategyState.chilling,
				},
			},

			on: {
				"*": { actions: () => console.log("Unknown event") },
			},
		},

		/**
		 * @dev Withdrawing state.
		 */
		[StrategyState._withdrawing]: {
			invoke: {
				src: StrategyActor.withdrawFunds,
				input: (c) => c,

				onDone: {
					target: StrategyState.idle,
				},
			},

			on: {
				"*": { actions: () => console.log("Unknown event") },
			},
		},
	},
});

const sendEventAndWait = async (
	actor: Actor<typeof StrategyMachine>,
	event: StrategyEvent,
	stateSequence: StrategyState[],
) => {
	return await new Promise<{ value: StrategyState; context: any }>((resolve) => {
		let index = 0;

		const sub = actor.subscribe((snapshot) => {
			const value = snapshot.value as StrategyState;

			if (value === stateSequence[index]) {
				index++;

				// If we reached the last state in the sequence, resolve
				if (index >= stateSequence.length) {
					sub.unsubscribe();
					resolve({ value, context: snapshot.context });
				}
			}
		});

		actor.send(event);
	});
};

export { StrategyMachine, StrategyState, sendEventAndWait, StrategyEvent };
