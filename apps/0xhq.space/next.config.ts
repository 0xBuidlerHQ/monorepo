import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@0xhq/config"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/*": ["./content/**/*.md", "./content/**/meta.json"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
