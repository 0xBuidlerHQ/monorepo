import type { User } from "@0xbuidlerhq/package-ethos.xyz";
import { type Context, Hono } from "hono";
import * as jwt from "hono/jwt";
import type { BlankEnv, BlankInput, BlankSchema } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { JWTPayload as JwtPayloadPrimitive } from "hono/utils/jwt/types";
import type { Address } from "viem";

const JWT_SECRET = "soleil";

interface JwtPayload extends JwtPayloadPrimitive {
	sub: User.UserId;
}

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: JwtPayload;

		user: User.User;
	}
}

const signJwt = async (address: Address, expiresInSeconds = 3600) => {
	const payload: JwtPayload = {
		sub: `user-${address}`,
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

		const user: User.User = {
			id: payload.sub,
		};

		c.set("user", user);

		await next();
	});

	app.route("/", routeHandler);

	return app;
};

const extractJwtSub = (c: Context<BlankEnv, "/", BlankInput>) => c.var.jwtPayload.sub;

type TypedContext<
	Params extends Record<string, string> = {},
	Response = unknown,
	Data extends Record<string, unknown> = {},
> = {
	user: User.User;
	params: Params;
	data: Data;
	json: (data: Response, status?: ContentfulStatusCode) => ResponseReturnType<Response>;
};

// Hono’s `c.json` actually returns a Response object
type ResponseReturnType<T> = Response & { __type?: T };

export async function createCtx<
	Params extends Record<string, string> = {},
	Response = unknown,
	Data extends Record<string, unknown> = {},
>(c: Context<BlankEnv, "/", BlankInput>): Promise<TypedContext<Params, Response, Data>> {
	let body = {};

	try {
		body = await c.req.json();
	} catch (_) {}

	return {
		user: c.var.user,
		params: c.req.param() as Params,
		data: body as Data,
		json: (data, status?: ContentfulStatusCode) =>
			c.json(data, status, {}) as ResponseReturnType<Response>,
	};
}

export { type JwtPayload, signJwt, verifyJwt, withJwt, extractJwtSub };
