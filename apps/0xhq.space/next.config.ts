import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@0xhq/config"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  redirects() {
    return [
      {
        source: "/:locale(en|fr|es|pt)/video",
        destination: "/:locale/content",
        permanent: true,
      },
      {
        source: "/video",
        destination: "/en/content",
        permanent: true,
      },
      {
        source: "/:locale(en|fr|es|pt)/cool-stuff/:path*",
        destination: "/:locale/curated/:path*",
        permanent: true,
      },
      {
        source: "/cool-stuff/:path*",
        destination: "/en/curated/:path*",
        permanent: true,
      },
    ];
  },
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
