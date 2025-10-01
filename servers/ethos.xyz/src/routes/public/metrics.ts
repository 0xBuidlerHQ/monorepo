import { Hono } from "hono";

const metricsRoute = new Hono();

metricsRoute.get("/", (c) => {
	return c.text("metricsRoute");
});

export { metricsRoute };
