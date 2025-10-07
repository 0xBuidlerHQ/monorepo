import { Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import type { UnknownActorLogic } from "xstate";
import { createDaemonActor, type DaemonStep } from "./factory.js";

const AaveNomos = Nomos.NomosRegistry["nomos-0x-aave"];

const AaveDaemon: {
	actors: Record<keyof (typeof AaveNomos)["states"], UnknownActorLogic>;
	states: Record<keyof (typeof AaveNomos)["states"], DaemonStep<typeof AaveNomos>>;
} = {
	actors: {
		/**
		 * @dev
		 */
		[AaveNomos.states.idle]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("idle");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[AaveNomos.states.__initializing__]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__initializing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[AaveNomos.states.__depositing__]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__depositing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[AaveNomos.states.chilling]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("chilling");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[AaveNomos.states.__harvesting__]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__harvesting__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[AaveNomos.states.__withdrawing__]: createDaemonActor<typeof AaveNomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__withdrawing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),
	},

	states: {
		[AaveNomos.states.idle]: {
			name: AaveNomos.states.idle,

			invoke: {
				src: AaveNomos.states.idle,
				input: (ctx) => ctx,
			},

			on: {
				START: {
					target: AaveNomos.states.__initializing__,
					actions: [
						({ context, event }) => {
							context.params = event.payload;
						},
					],
				},
			},
		},

		/**
		 * @dev
		 */
		[AaveNomos.states.__initializing__]: {
			name: AaveNomos.states.__initializing__,

			invoke: {
				src: AaveNomos.states.__initializing__,
				input: (ctx) => ctx,
				onDone: { target: AaveNomos.states.__depositing__ },
			},
		},

		/**
		 * @dev
		 */
		[AaveNomos.states.__depositing__]: {
			name: AaveNomos.states.__depositing__,

			invoke: {
				src: AaveNomos.states.__depositing__,
				input: (ctx) => ctx,
				onDone: { target: AaveNomos.states.chilling },
			},
		},

		/**
		 * @dev
		 */
		[AaveNomos.states.chilling]: {
			name: AaveNomos.states.chilling,

			invoke: {
				src: AaveNomos.states.chilling,
				input: (ctx) => ctx,
			},

			on: {
				HARVEST: { target: AaveNomos.states.__harvesting__ },
				WITHDRAW: { target: AaveNomos.states.__withdrawing__ },
			},
		},

		/**
		 * @dev
		 */
		[AaveNomos.states.__harvesting__]: {
			name: AaveNomos.states.__harvesting__,

			invoke: {
				src: AaveNomos.states.__harvesting__,
				input: (ctx) => ctx,
				onDone: { target: AaveNomos.states.chilling },
			},
		},

		/**
		 * @dev
		 */
		[AaveNomos.states.__withdrawing__]: {
			name: AaveNomos.states.__withdrawing__,

			invoke: {
				src: AaveNomos.states.__withdrawing__,
				input: (ctx) => ctx,
				onDone: { target: AaveNomos.states.idle },
			},
		},
	},
} as const;

export { AaveDaemon };
