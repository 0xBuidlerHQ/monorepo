import { Hono } from "hono";

const daemons = new Hono();

daemons.get("/", async (c) => {
	// const { actor, controls } = createDaemonMachine(aaveStrategy, "eded", AaveDaemon);

	// const state = actor.getPersistedSnapshot();

	return c.json({});
});

export { daemons };
