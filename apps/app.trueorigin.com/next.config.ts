import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{ source: "/app", destination: "/", permanent: true },
			{ source: "/app/:path+", destination: "/:path+", permanent: true },
		];
	},
	allowedDevOrigins: ["trueorigin.dev"],
	transpilePackages: ["@0xhq/api-client", "@0xhq/config", "@0xhq/contracts.trueorigin.com"],
	cacheComponents: true,
	partialPrefetching: true,
	turbopack: {
		rules: {
			"*.css": {
				condition: { not: { path: "*.module.css" } },
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;
