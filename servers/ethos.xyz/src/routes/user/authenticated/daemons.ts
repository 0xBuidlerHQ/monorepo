/**
 * @dev
 */

import { type API, Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { Hono } from "hono";
import { createDaemonMachine } from "@/daemons/factory.js";
import { getDaemon } from "@/daemons/registry.js";
import { createCtx } from "@/utils/jwt.js";

const daemons = new Hono();

/**
 * @dev GET.
 */
daemons.get("/", async (c) => {
	type Params = {};
	type Response = API.Types.Daemon[];
	const { json } = await createCtx<Params, Response>(c);

	const response: Response = [];

	return json(response);
});

/**
 * @dev GET.
 */
daemons.get("/:id", async (c) => {
	type Params = { id: API.Types.Daemon["id"] };
	type Response = API.Types.Daemon;
	const { params, json } = await createCtx<Params, Response>(c);

	const response: Response = {};

	return json(response);
});

/**
 * @dev POST.
 */
daemons.post("/create", async (c) => {
	type Params = {};
	type Response = {};
	type Data = {
		nomosId: API.Types.Nomos._Nomos["id"];
		event: API.Types.Nomos._Nomos["events"]["START"];
	};
	const { json, data, user } = await createCtx<Params, Response, Data>(c);

	const nomos = Nomos.getNomos(data.nomosId);
	const daemon = getDaemon(data.nomosId)!;

	const { controls } = createDaemonMachine(nomos, user.id, daemon);

	await controls.sendEvent(data.event);

	const response: Response = {};

	return json(response);
});

/**
 * @dev POST.
 */
// daemons.post("/:id/events", async (c) => {
// 	type Params = { id: API.Types.Daemon["id"] };
// 	type Response = API.Types.Daemon;
// 	type Data = API.Types.Nomos._NomosEvent;
// 	const { params, json, data } = await createCtx<Params, Response, Data>(c);

// const nomos = Nomos.getNomos(data.nomosId);
// 	const daemon = getDaemon(data.nomosId)!;

// 	const { controls } = createDaemonMachine(nomos, "eded", daemon);

// 	await controls.sendEvent(data.event);

// 	const response: Response = {};

// 	return json(response);
// });

export { daemons };
