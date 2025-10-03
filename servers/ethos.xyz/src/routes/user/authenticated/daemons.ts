import type { API } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { createCtx } from "@/utils/jwt.js";

const daemons = new Hono();

daemons.get("/", (c) => {
	type Params = {};
	type Response = API.Types.Daemon[];

	const { json } = createCtx<Params, Response>(c);

	const response: Response = [];

	return json(response);
});

daemons.get("/:id", (c) => {
	type Params = { id: API.Types.Daemon["id"] };
	type Response = API.Types.Daemon;

	const { params, json } = createCtx<Params, Response>(c);

	const response: Response = {};

	return json(response);
});

export { daemons };
