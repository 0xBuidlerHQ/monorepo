import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@0xhq/api-client", "@0xhq/config"],
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
