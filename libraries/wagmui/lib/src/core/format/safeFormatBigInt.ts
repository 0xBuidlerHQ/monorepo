import { formatUnits } from "viem";

const safeFormatBigInt = (value: bigint | undefined, decimals: number | undefined) => {
	if (value === undefined || decimals === undefined) return "0";
	return formatUnits(value, decimals);
};

export { safeFormatBigInt };
