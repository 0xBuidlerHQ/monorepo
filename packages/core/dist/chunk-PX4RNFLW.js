import {
  __export
} from "./chunk-PZ5AY32C.js";

// src/env/index.ts
var env_exports = {};
__export(env_exports, {
  Alchemy: () => alchemy_exports,
  Vercel: () => vercel_exports
});

// src/env/alchemy.tsx
var alchemy_exports = {};
__export(alchemy_exports, {
  AlchemyEnv: () => AlchemyEnv
});
var AlchemyEnv = {
  /**
   * @dev Alchemy.
   */
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
};

// src/env/vercel.tsx
var vercel_exports = {};
__export(vercel_exports, {
  VercelEnv: () => VercelEnv,
  isDevelopment: () => isDevelopment,
  isPreview: () => isPreview,
  isProduction: () => isProduction
});
var VercelEnv = {
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
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
};
var isDevelopment = VercelEnv.VERCEL_ENV === "development";
var isPreview = VercelEnv.VERCEL_ENV === "preview";
var isProduction = VercelEnv.VERCEL_ENV === "production";

export {
  alchemy_exports,
  vercel_exports,
  env_exports
};
//# sourceMappingURL=chunk-PX4RNFLW.js.map