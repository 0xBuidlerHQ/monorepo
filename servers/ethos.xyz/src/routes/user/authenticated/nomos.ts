/**
 * @dev
 */

import type { Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { createCtx } from "@/utils/jwt.js";

const nomos = new Hono();

/**
 * @dev
 */
nomos.get("/", async (c) => {
	type Params = {};
	type Response = {}[];

	const { json } = await createCtx<Params, Response>(c);

	const response: Response = (() => {
		return [];
	})();

	return json(response);
});

/**
 * @dev
 */
nomos.get("/:id", async (c) => {
	type Params = { id: Nomos.NomosId };
	type Response = {};

	const { params, json } = await createCtx<Params, Response>(c);

	const response: Response = (() => {
		return {};
	})();

	return json(response);
});

export { nomos };
