import { Hono } from "hono";
import { AaveStates, DaemonEvent, sendEventAndWait } from "@/daemons/daemon.js";
import { MachineSnapshotDB, useMachine } from "@/db/index.js";

const daemons = new Hono();

daemons.get("/", async (c) => {
	const machine = useMachine("2");

	await sendEventAndWait(machine, DaemonEvent.Start({ initialAmount: 1000n }), [
		AaveStates._initializing,
		AaveStates._depositing,
		AaveStates.chilling,
	]);

	await sendEventAndWait(machine, DaemonEvent.Harvest(), [
		AaveStates._harvesting,
		AaveStates.chilling,
	]);

	await sendEventAndWait(machine, DaemonEvent.Withdraw(), [
		AaveStates._withdrawing,
		AaveStates.idle,
	]);

	const state = MachineSnapshotDB.getAllMachinesSnapshot();

	return c.json(state);
});

export { daemons };
