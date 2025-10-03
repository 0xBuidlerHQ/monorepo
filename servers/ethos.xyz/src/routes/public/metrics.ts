import { Hono } from "hono";

const metrics = new Hono();

metrics.get("/", (c) => {
	return c.text("metricsRoute");
});

export { metrics };
