import type { API } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { createCtx } from "@/utils/jwt.js";

const nomos = new Hono();

nomos.get("/", (c) => {
	type Params = {};
	type Response = API.Types.Nomos[];

	const { json } = createCtx<Params, Response>(c);

	const response: Response = (() => {
		return [];
	})();

	return json(response);
});

nomos.get("/:id", (c) => {
	type Params = { id: API.Types.Nomos["id"] };
	type Response = API.Types.Nomos;

	const { params, json } = createCtx<Params, Response>(c);

	const response: Response = (() => {
		return {};
	})();

	return json(response);
});

export { nomos };
