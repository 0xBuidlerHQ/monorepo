/**
 *
 * @dev Alchemy Environment.
 *
 */
declare const AlchemyEnv: {
    /**
     * @dev Alchemy.
     */
    readonly ALCHEMY_API_KEY: string | undefined;
    readonly NEXT_PUBLIC_ALCHEMY_API_KEY: string | undefined;
};

declare const alchemy_AlchemyEnv: typeof AlchemyEnv;
declare namespace alchemy {
  export { alchemy_AlchemyEnv as AlchemyEnv };
}

/**
 *
 * @dev Vercel Environment.
 *
 */
declare const VercelEnv: {
    /**
     * @dev Vercel.
     */
    readonly VERCEL_ENV: "development" | "production" | "preview";
    readonly NEXT_PUBLIC_VERCEL_BRANCH_URL: string | undefined;
    readonly NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: string | undefined;
};
/**********************************
 *
 * @dev Vercel Utils.
 *
 **********************************/
declare const isDevelopment: boolean;
declare const isPreview: boolean;
declare const isProduction: boolean;

declare const vercel_VercelEnv: typeof VercelEnv;
declare const vercel_isDevelopment: typeof isDevelopment;
declare const vercel_isPreview: typeof isPreview;
declare const vercel_isProduction: typeof isProduction;
declare namespace vercel {
  export { vercel_VercelEnv as VercelEnv, vercel_isDevelopment as isDevelopment, vercel_isPreview as isPreview, vercel_isProduction as isProduction };
}

declare namespace index {
  export { alchemy as Alchemy, vercel as Vercel };
}

export { alchemy as a, index as i, vercel as v };
