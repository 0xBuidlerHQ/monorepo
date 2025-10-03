import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { InternalRoutes } from "@/routes/internal/index.js";
import { PublicRoutes } from "@/routes/public/index.js";
import { UserAuthenticatedRoutes } from "@/routes/user/authenticated/index.js";
import { UserSiweRoutes } from "@/routes/user/siwe/index.js";
import { buildRoutes } from "@/utils/buildRoutes.js";
import { withJwt } from "@/utils/jwt.js";

const app = new Hono();

app.use("*", cors({ origin: ["https://id.porto.sh", "http://localhost:3000"], credentials: true }));
app.use("*", logger());

app.get("/", (c) => c.text("Hello World."));

buildRoutes(
	{
		/**
		 * @dev Public Routes.
		 */
		"/public": {
			"/health": PublicRoutes.health,
			"/metrics": PublicRoutes.metrics,
		},

		/**
		 * @dev User Routes.
		 */
		"/user": {
			/**
			 * @dev SIWE Routes.
			 */
			"/siwe": {
				"/nonce": UserSiweRoutes.nonce,
				"/verify": UserSiweRoutes.verify,
				"/logout": UserSiweRoutes.logout,
			},

			/**
			 * @dev Authenticated Routes.
			 */
			"/authenticated": withJwt(
				buildRoutes({
					/**
					 * @dev Nomos Routes.
					 */
					"/nomos": UserAuthenticatedRoutes.nomos,

					/**
					 * @dev Daemons Routes.
					 */
					"/daemons": UserAuthenticatedRoutes.daemons,
				}),
			),
		},

		/**
		 * @dev Internal Routes.
		 */
		"/internal": buildRoutes({
			/**
			 * @dev Daemons Routes.
			 */
			"/daemons": InternalRoutes.daemons,
		}),
	},
	app,
);

showRoutes(app, { verbose: true });

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
