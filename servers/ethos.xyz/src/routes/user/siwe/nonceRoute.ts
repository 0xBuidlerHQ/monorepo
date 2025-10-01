import { Hono } from "hono";
import { generateSiweNonce } from "viem/siwe";

const nonceRoute = new Hono();

nonceRoute.post("/", (c) => {
	return c.json({ nonce: generateSiweNonce() });
});

export { nonceRoute };
