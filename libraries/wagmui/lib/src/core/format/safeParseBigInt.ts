import { parseUnits } from "viem";

const safeParseBigInt = (value: string | undefined, decimals: number | undefined) => {
	if (value === undefined || decimals === undefined) return 0n;
	return parseUnits(value, decimals);
};

export { safeParseBigInt };
