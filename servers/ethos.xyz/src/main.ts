import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

import { internalStrategyEventsRoute } from "@/routes/internal/strategy/events.js";
import { healthRoute } from "@/routes/public/health.js";
import { metricsRoute } from "@/routes/public/metrics.js";
import { strategyCreateRoute } from "@/routes/user/authenticated/strategy/create.js";
import { strategyDeleteRoute } from "@/routes/user/authenticated/strategy/delete.js";
import { strategyGetRoute } from "@/routes/user/authenticated/strategy/get.js";
import { logoutRoute } from "@/routes/user/siwe/logoutRoute.js";
import { nonceRoute } from "@/routes/user/siwe/nonceRoute.js";
import { verifyRoute } from "@/routes/user/siwe/verifyRoute.js";
import { withJwt } from "@/utils/jwt.js";

const app = new Hono();

app.use("*", cors({ origin: ["https://id.porto.sh", "http://localhost:3000"], credentials: true }));

app.use("*", logger());

app.get("/", (c) => c.text("Hello World."));

/**
 * @dev Public Routes.
 */
app.route(
	"/public",
	new Hono()

		/**
		 * @dev Health Routes.
		 */
		.route("/health", healthRoute)

		/**
		 * @dev Metrics Routes.
		 */
		.route("/metrics", metricsRoute),
);

/**
 * @dev User Routes.
 */
app.route(
	"/user",
	new Hono()

		/**
		 * @dev SIWE Routes.
		 */
		.route(
			"/siwe",
			new Hono()

				/**
				 * @dev Nonce Route.
				 */
				.route("/nonce", nonceRoute)

				/**
				 * @dev Verify Route.
				 */
				.route("/verify", verifyRoute)

				/**
				 * @dev Logout Route.
				 */
				.route("/logout", withJwt(logoutRoute)),
		)

		/**
		 * @dev Authenticated Routes.
		 */
		.route(
			"/authenticated",
			withJwt(
				new Hono()

					/**
					 * @dev Strategy Route.
					 */
					.route(
						"/strategy",
						new Hono()

							/**
							 * @dev Create Route.
							 */
							.route("/create", strategyCreateRoute)

							/**
							 * @dev Get Route.
							 */
							.route("/get", strategyGetRoute)

							/**
							 * @dev Delete Route.
							 */
							.route("/delete", strategyDeleteRoute),
					),
			),
		),
);

/**
 * @dev Internal Routes.
 */
app.route(
	"/internal",
	new Hono()

		/**
		 * @dev Strategy Routes.
		 */
		.route(
			"/strategy",
			new Hono()

				/**
				 * @dev Event Route.
				 */
				.route("/event", internalStrategyEventsRoute),
		),
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
