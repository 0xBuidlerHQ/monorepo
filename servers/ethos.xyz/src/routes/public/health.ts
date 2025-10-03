import { Hono } from "hono";
import { MachineSnapshotDB } from "@/db/index.js";

const health = new Hono();

health.get("/", (c) => {
	const state = MachineSnapshotDB.getAllMachinesSnapshot();

	return c.json({
		allState: state,
	});
});

export { health };
