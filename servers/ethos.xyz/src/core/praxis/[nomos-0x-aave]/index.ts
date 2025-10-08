import { type Nomos, Praxis } from "@0xbuidlerhq/package-ethos.xyz";
import { NomosRegistry } from "@/core/nomos/index.js";

/**
 * @dev
 */
const nomosId = "nomos-0x-aave" satisfies Nomos.NomosId;
const nomos = NomosRegistry[nomosId];

const praxis: Praxis.Praxis<typeof nomos> = {
	actors: {
		/**
		 * @dev
		 */
		[nomos.states.idle]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("idle");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[nomos.states.__initializing__]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__initializing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[nomos.states.__depositing__]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__depositing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[nomos.states.chilling]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("chilling");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[nomos.states.__harvesting__]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__harvesting__");
			await new Promise((res) => setTimeout(res, 1000));
		}),

		/**
		 * @dev
		 */
		[nomos.states.__withdrawing__]: Praxis.createPraxisActor<typeof nomos>(async ({ input }) => {
			const { context, event } = input;

			console.log("__withdrawing__");
			await new Promise((res) => setTimeout(res, 1000));
		}),
	},

	states: {
		[nomos.states.idle]: {
			name: nomos.states.idle,

			invoke: {
				src: nomos.states.idle,
				input: (ctx) => ctx,
			},

			on: {
				START: {
					target: nomos.states.__initializing__,
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
		[nomos.states.__initializing__]: {
			name: nomos.states.__initializing__,

			invoke: {
				src: nomos.states.__initializing__,
				input: (ctx) => ctx,
				onDone: { target: nomos.states.__depositing__ },
			},
		},

		/**
		 * @dev
		 */
		[nomos.states.__depositing__]: {
			name: nomos.states.__depositing__,

			invoke: {
				src: nomos.states.__depositing__,
				input: (ctx) => ctx,
				onDone: { target: nomos.states.chilling },
			},
		},

		/**
		 * @dev
		 */
		[nomos.states.chilling]: {
			name: nomos.states.chilling,

			invoke: {
				src: nomos.states.chilling,
				input: (ctx) => ctx,
			},

			on: {
				HARVEST: { target: nomos.states.__harvesting__ },
				WITHDRAW: { target: nomos.states.__withdrawing__ },
			},
		},

		/**
		 * @dev
		 */
		[nomos.states.__harvesting__]: {
			name: nomos.states.__harvesting__,

			invoke: {
				src: nomos.states.__harvesting__,
				input: (ctx) => ctx,
				onDone: { target: nomos.states.chilling },
			},
		},

		/**
		 * @dev
		 */
		[nomos.states.__withdrawing__]: {
			name: nomos.states.__withdrawing__,

			invoke: {
				src: nomos.states.__withdrawing__,
				input: (ctx) => ctx,
				onDone: { target: nomos.states.idle },
			},
		},
	},
} as const;

export { praxis };
