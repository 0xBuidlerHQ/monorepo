/**
 *
 * @dev Vercel Environment.
 *
 */
const VercelEnv = {
	/**
	 * @dev Vercel.
	 */

	VERCEL_ENV: (() => {
		const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
		const defaultValue = "development";

		if (!vercelEnv) return defaultValue;

		switch (vercelEnv) {
			case "production":
				return "production";
			case "preview":
				return "preview";

			default:
				return "development";
		}
	})(),
	NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
	NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
} as const;

/**********************************
 *
 * @dev Vercel Utils.
 *
 **********************************/

const isDevelopment = VercelEnv.VERCEL_ENV === "development";
const isPreview = VercelEnv.VERCEL_ENV === "preview";
const isProduction = VercelEnv.VERCEL_ENV === "production";

export { VercelEnv, isDevelopment, isPreview, isProduction };
