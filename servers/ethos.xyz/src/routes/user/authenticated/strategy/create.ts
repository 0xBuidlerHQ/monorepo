import { Hono } from "hono";
import { createActor } from "xstate";
import { StrategyMachine } from "@/logic/machine.js";

const strategyCreateRoute = new Hono();

strategyCreateRoute.get("/", (c) => {
	const actor = createActor(StrategyMachine);

	actor.send({ type: "START" });

	return c.json({});
});

export { strategyCreateRoute };
