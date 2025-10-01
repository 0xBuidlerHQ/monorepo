import { Hono } from "hono";

const strategyDeleteRoute = new Hono();

strategyDeleteRoute.get("/", (c) => {
	return c.text("strategyDeleteRoute");
});

export { strategyDeleteRoute };
