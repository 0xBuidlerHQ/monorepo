import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: [
		"@0xbuidlerhq/ui",
		"@0xbuidlerhq/core",
		"@0xbuidlerhq/assets",
		"@0xbuidlerhq/connect-button",
	],
};

export default nextConfig;
