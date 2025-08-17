/**
 *
 * @dev Alchemy Environment.
 *
 */
const AlchemyEnv = {
	/**
	 * @dev Alchemy.
	 */
	ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
	NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
} as const;

export { AlchemyEnv };
