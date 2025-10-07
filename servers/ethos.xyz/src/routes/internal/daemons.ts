import { Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { AaveDaemon } from "@/daemons/daemon.js";
import { createDaemonMachine } from "@/daemons/factory.js";

const daemons = new Hono();

const aaveStrategy = Nomos.NomosRegistry["nomos-0x-aave"];

daemons.get("/", async (c) => {
	const { actor, controls } = createDaemonMachine(aaveStrategy, "eded", AaveDaemon);

	await controls.sendEvents.START({ initialAmount: 100n });
	await controls.sendEvents.HARVEST({});
	await controls.sendEvents.WITHDRAW({});

	const state = actor.getPersistedSnapshot();

	return c.json(state);
});

export { daemons };
