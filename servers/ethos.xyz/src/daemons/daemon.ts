import { type Daemon, Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import type { Actor } from "xstate";
import { createDaemonMachine, type DaemonStep } from "./factory.js";

const aaveStrategy = Nomos.NomosRegistry["nomos-0x-aave"];

type AaveEvents = {
	START: { initialAmount: bigint };
	HARVEST: undefined;
	WITHDRAW: undefined;
};

enum AaveStates {
	idle = "idle",
	chilling = "chilling",

	_initializing = "_initializing",
	_depositing = "_depositing",
	_harvesting = "_harvesting",
	_withdrawing = "_withdrawing",
}
// Define steps
const aaveSteps: DaemonStep<typeof aaveStrategy, AaveEvents, AaveStates>[] = [
	{
		name: AaveStates._initializing,
		actor: async (ctx) => {
			console.log("Initializing");
			ctx.internal.logs.push({
				event: { type: "START", payload: ctx.params },
				timestamp: new Date().toISOString(),
			});
			await new Promise((r) => setTimeout(r, 1500));
		},
		onDone: AaveStates._depositing,
	},
	{
		name: AaveStates._depositing,
		actor: async (ctx) => {
			console.log("Depositing");
			ctx.internal.logs.push({
				event: { type: "START", payload: ctx.params },
				timestamp: new Date().toISOString(),
			});
			await new Promise((r) => setTimeout(r, 1500));
		},
		onDone: AaveStates.chilling,
	},
	{
		name: AaveStates.chilling,
		actor: async () => {},
		onEvents: { HARVEST: AaveStates._harvesting, WITHDRAW: AaveStates._withdrawing },
	},
	{
		name: AaveStates._harvesting,
		actor: async (ctx) => {
			console.log("Harvesting");
			ctx.internal.logs.push({
				event: { type: "HARVEST", payload: undefined },
				timestamp: new Date().toISOString(),
			});
			await new Promise((r) => setTimeout(r, 1500));
		},
		onDone: AaveStates.chilling,
	},
	{
		name: AaveStates._withdrawing,
		actor: async (ctx) => {
			console.log("Withdrawing");
			ctx.internal.logs.push({
				event: { type: "WITHDRAW", payload: undefined },
				timestamp: new Date().toISOString(),
			});
			await new Promise((r) => setTimeout(r, 1500));
		},
		onDone: AaveStates.idle,
	},
	{
		name: AaveStates.idle,
		actor: async () => {},
	},
];

// Create the machine
const DaemonMachine = createDaemonMachine(aaveStrategy, "user-0x123", aaveSteps);

type AaveDaemonEvent = Daemon.DaemonEvent<AaveEvents>;

const DaemonEvent = {
	Start: (payload: AaveEvents["START"]): AaveDaemonEvent => ({ type: "START", payload }),
	Harvest: (payload: AaveEvents["HARVEST"] = undefined): AaveDaemonEvent => ({
		type: "HARVEST",
		payload,
	}),
	Withdraw: (payload: AaveEvents["WITHDRAW"] = undefined): AaveDaemonEvent => ({
		type: "WITHDRAW",
		payload,
	}),
};

const sendEventAndWait = async (
	actor: Actor<typeof DaemonMachine>,
	event: AaveDaemonEvent,
	stateSequence: AaveStates[],
) => {
	return await new Promise<{ value: AaveStates; context: any }>((resolve) => {
		let index = 0;

		const sub = actor.subscribe((snapshot) => {
			const value = snapshot.value as AaveStates;

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

export { DaemonMachine, sendEventAndWait, DaemonEvent, AaveStates };
