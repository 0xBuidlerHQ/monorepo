import { type Context, Hono } from "hono";
import * as jwt from "hono/jwt";
import type { BlankEnv, BlankInput, BlankSchema } from "hono/types";
import type { JWTPayload as JwtPayloadPrimitive } from "hono/utils/jwt/types";
import type { Address } from "viem";

const JWT_SECRET = "soleil";

interface JwtPayload extends JwtPayloadPrimitive {
	sub: string;
}

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: JwtPayload;
	}
}

const signJwt = async (address: Address, expiresInSeconds = 3600) => {
	const payload: JwtPayload = {
		sub: address,
		exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
	};

	return await jwt.sign(payload, JWT_SECRET);
};

const verifyJwt = async (token: string): Promise<JwtPayload> => {
	return (await jwt.verify(token, JWT_SECRET)) as JwtPayload;
};

const jwtMiddleware = jwt.jwt({ cookie: "auth", secret: JWT_SECRET });

const withJwt = (routeHandler: Hono<BlankEnv, BlankSchema, "/">) => {
	const app = new Hono();

	app.use(jwtMiddleware);

	app.use(async (c, next) => {
		const payload = c.get("jwtPayload");

		if (!payload.sub) return c.text("Unauthorized", 401);

		await next();
	});

	app.route("/", routeHandler);

	return app;
};

const extractJwtSub = (c: Context<BlankEnv, "/", BlankInput>) => c.var.jwtPayload.sub;

export { type JwtPayload, signJwt, verifyJwt, withJwt, extractJwtSub };
