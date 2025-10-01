import { Hono } from "hono";
import { MachineSnapshotDB } from "@/db/index.js";

const healthRoute = new Hono();

healthRoute.get("/", (c) => {
	const state = MachineSnapshotDB.getAllMachinesSnapshot();

	return c.json({
		allState: state,
	});
});

export { healthRoute };
