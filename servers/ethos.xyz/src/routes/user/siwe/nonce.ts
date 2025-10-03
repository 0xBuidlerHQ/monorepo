import { Hono } from "hono";
import { generateSiweNonce } from "viem/siwe";

const nonce = new Hono();

nonce.post("/", (c) => {
	return c.json({ nonce: generateSiweNonce() });
});

export { nonce };
