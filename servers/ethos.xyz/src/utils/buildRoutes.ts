import type { MiddlewareHandler } from "hono";
import { Hono } from "hono";

export type RouteConfig = Hono | MiddlewareHandler | { [path: string]: RouteConfig };

function buildRoutes(config: { [path: string]: RouteConfig }, app: Hono = new Hono()): Hono {
	for (const [path, value] of Object.entries(config)) {
		if (!value) continue;

		if (value instanceof Hono) {
			app.route(path, value);
		} else if (typeof value === "function") {
			app.use(path, value as MiddlewareHandler);
		} else if (typeof value === "object") {
			app.route(path, buildRoutes(value as { [p: string]: RouteConfig }));
		}
	}
	return app;
}

export { buildRoutes };
