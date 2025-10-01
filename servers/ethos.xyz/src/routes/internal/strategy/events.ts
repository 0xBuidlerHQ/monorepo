import { Hono } from "hono";
import { MachineSnapshotDB, useMachine } from "@/db/index.js";
import { StrategyEvent, StrategyState, sendEventAndWait } from "@/logic/machine.js";

const internalStrategyEventsRoute = new Hono();

internalStrategyEventsRoute.get("/", async (c) => {
	const machine = useMachine("2");

	await sendEventAndWait(
		machine,
		StrategyEvent.Start({
			initialAmount: 100000000n,
			network: "base",
			token: "usdc",
		}),
		[StrategyState._initializing, StrategyState._depositing, StrategyState.chilling],
	);

	await sendEventAndWait(machine, StrategyEvent.Harvest(), [
		StrategyState._harvesting,
		StrategyState.chilling,
	]);

	await sendEventAndWait(machine, StrategyEvent.Withdraw(), [
		StrategyState._withdrawing,
		StrategyState.idle,
	]);

	const state = MachineSnapshotDB.getAllMachinesSnapshot();

	return c.json(state);
});

export { internalStrategyEventsRoute };
