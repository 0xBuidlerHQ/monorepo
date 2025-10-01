import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

const logoutRoute = new Hono();

logoutRoute.post("/", (c) => {
	deleteCookie(c, "auth");
	return c.json({ success: true });
});

export { logoutRoute };
