import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

const logout = new Hono();

logout.post("/", (c) => {
	deleteCookie(c, "auth");
	return c.json({ success: true });
});

export { logout };
