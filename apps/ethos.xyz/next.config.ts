import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@ethos/ui", "@ethos/core", "@ethos/assets", "@ethos/connect-button"],
};

export default nextConfig;
