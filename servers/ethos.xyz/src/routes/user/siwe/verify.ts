import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { Porto } from "porto";
import { RelayClient } from "porto/viem";
import { parseSiweMessage, verifySiweMessage } from "viem/siwe";
import { signJwt } from "@/utils/jwt.js";

const verify = new Hono();
const porto = Porto.create();

verify.post("/", async (c) => {
	const params = await c.req.json();
	const siweMessage = parseSiweMessage(params.message);

	// Verify the signature.
	const client = RelayClient.fromPorto(porto, { chainId: siweMessage.chainId });

	const valid = await verifySiweMessage(client, {
		address: siweMessage.address!,
		message: params.message,
		signature: params.signature,
	});

	// If the signature is invalid, we cannot authenticate the user.
	if (!valid) return c.json({ error: "Invalid signature" }, 401);

	// Issue a JWT for the user in a HTTP-only cookie.
	const token = await signJwt(siweMessage.address!);
	setCookie(c, "auth", token, { httpOnly: true, secure: true });

	// If the signature is valid, we can authenticate the user.
	return c.json({ message: "Authenticated" });
});

export { verify };
