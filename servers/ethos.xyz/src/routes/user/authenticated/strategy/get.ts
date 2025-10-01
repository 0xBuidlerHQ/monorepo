import { Hono } from "hono";

const strategyGetRoute = new Hono();

strategyGetRoute.get("/", (c) => {
	return c.text("strategyGetRoute");
});

export { strategyGetRoute };
