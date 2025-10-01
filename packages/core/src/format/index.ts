///////////////////////////
////////// UNITS //////////
///////////////////////////

import { formatUnits, parseUnits } from "viem";

/**
 * @dev
 */
const FormatUSD = {
	classic: (
		value: Parameters<ReturnType<typeof Intl.NumberFormat>["format"]>[0],
		config?: Parameters<typeof Intl.NumberFormat>[1],
	) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			...config,
		}).format(value),

	full: (
		value: Parameters<ReturnType<typeof Intl.NumberFormat>["format"]>[0],
		config?: Parameters<typeof Intl.NumberFormat>[1],
	) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 100,
			...config,
		}).format(value),
};

/**
 * @dev
 */
const FormatPercent = new Intl.NumberFormat("en-US", {
	style: "percent",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

/**
 * @dev
 */
const FormatNumber = new Intl.NumberFormat("en-US", {
	style: "decimal",
	roundingMode: "trunc",
	maximumFractionDigits: 4,
});

/**
 * @dev
 */
const FormatUnits = {
	format: (value: bigint | undefined, decimals: number | undefined) => {
		if (value === undefined || decimals === undefined) return "0";
		return formatUnits(value, decimals);
	},
	parse: (value: string | undefined, decimals: number | undefined) => {
		if (value === undefined || decimals === undefined) return 0n;
		return parseUnits(value, decimals);
	},
};

///////////////////////////
////// HASH & ADDRESS /////
///////////////////////////

const FormatEvmHash = (hash: string | undefined) =>
	hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash;

const FormatEvmAddress = (address: string | undefined) =>
	address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined;

export { FormatEvmHash, FormatEvmAddress };

///////////////////////////
////// BLOCK EXPLORER /////
///////////////////////////

/**
 * @dev
 */
const FormatExplorerAddress = (
	blockExplorerUrl: string | undefined,
	address: string | undefined,
) => {
	if (!blockExplorerUrl || !address) return "#";

	return `${blockExplorerUrl}/address/${address}`;
};

/**
 * @dev
 */
const FormatExplorerTransaction = (
	blockExplorerUrl: string | undefined,
	txHash: string | undefined,
) => {
	if (!blockExplorerUrl || !txHash) return "#";

	return `${blockExplorerUrl}/tx/${txHash}`;
};
//
/**
 * @dev
 */
const FormatExplorerBlock = (
	blockExplorerUrl: string | undefined,
	blockNumber: number | undefined,
) => {
	if (!blockExplorerUrl || !blockNumber) return "#";

	return `${blockExplorerUrl}/block/${blockNumber}`;
};

export {
	FormatExplorerAddress,
	FormatExplorerBlock,
	FormatExplorerTransaction,
	FormatUSD,
	FormatPercent,
	FormatNumber,
	FormatUnits,
};
