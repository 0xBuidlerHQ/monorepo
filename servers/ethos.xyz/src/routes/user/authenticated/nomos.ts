/**
 * @dev
 */

import type { API } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { createCtx } from "@/utils/jwt.js";

const nomos = new Hono();

/**
 * @dev
 */
nomos.get("/", (c) => {
	type Params = {};
	type Response = API.Types.NomosT[];

	const { json } = createCtx<Params, Response>(c);

	const response: Response = (() => {
		return [];
	})();

	return json(response);
});

/**
 * @dev
 */
nomos.get("/:id", (c) => {
	type Params = { id: API.Types.NomosT["id"] };
	type Response = API.Types.NomosT;

	const { params, json } = createCtx<Params, Response>(c);

	const response: Response = (() => {
		return {};
	})();

	return json(response);
});

export { nomos };
