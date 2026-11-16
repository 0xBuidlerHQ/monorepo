import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{ source: "/explore/sets", destination: "/explore/pokemon", permanent: true },
			{ source: "/explore/sets/:id", destination: "/explore/catalogue/collections/:id", permanent: true },
			{ source: "/explore/catalogue/pokemon", destination: "/explore/pokemon", permanent: true },
			{ source: "/app", destination: "/", permanent: true },
			{ source: "/app/:path+", destination: "/:path+", permanent: true },
		];
	},
	allowedDevOrigins: ["trueorigin.dev"],
	transpilePackages: ["@0xhq/api-client", "@0xhq/config", "@0xhq/trueorigin-sdk"],
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
