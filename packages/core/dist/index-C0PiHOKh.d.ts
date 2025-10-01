/**
 * @dev
 */
declare const FormatUSD: {
    classic: (value: Parameters<ReturnType<typeof Intl.NumberFormat>["format"]>[0], config?: Parameters<typeof Intl.NumberFormat>[1]) => string;
    full: (value: Parameters<ReturnType<typeof Intl.NumberFormat>["format"]>[0], config?: Parameters<typeof Intl.NumberFormat>[1]) => string;
};
/**
 * @dev
 */
declare const FormatPercent: Intl.NumberFormat;
/**
 * @dev
 */
declare const FormatNumber: Intl.NumberFormat;
/**
 * @dev
 */
declare const FormatUnits: {
    format: (value: bigint | undefined, decimals: number | undefined) => string;
    parse: (value: string | undefined, decimals: number | undefined) => bigint;
};
declare const FormatEvmHash: (hash: string | undefined) => string | undefined;
declare const FormatEvmAddress: (address: string | undefined) => string | undefined;

/**
 * @dev
 */
declare const FormatExplorerAddress: (blockExplorerUrl: string | undefined, address: string | undefined) => string;
/**
 * @dev
 */
declare const FormatExplorerTransaction: (blockExplorerUrl: string | undefined, txHash: string | undefined) => string;
/**
 * @dev
 */
declare const FormatExplorerBlock: (blockExplorerUrl: string | undefined, blockNumber: number | undefined) => string;

declare const index_FormatEvmAddress: typeof FormatEvmAddress;
declare const index_FormatEvmHash: typeof FormatEvmHash;
declare const index_FormatExplorerAddress: typeof FormatExplorerAddress;
declare const index_FormatExplorerBlock: typeof FormatExplorerBlock;
declare const index_FormatExplorerTransaction: typeof FormatExplorerTransaction;
declare const index_FormatNumber: typeof FormatNumber;
declare const index_FormatPercent: typeof FormatPercent;
declare const index_FormatUSD: typeof FormatUSD;
declare const index_FormatUnits: typeof FormatUnits;
declare namespace index {
  export { index_FormatEvmAddress as FormatEvmAddress, index_FormatEvmHash as FormatEvmHash, index_FormatExplorerAddress as FormatExplorerAddress, index_FormatExplorerBlock as FormatExplorerBlock, index_FormatExplorerTransaction as FormatExplorerTransaction, index_FormatNumber as FormatNumber, index_FormatPercent as FormatPercent, index_FormatUSD as FormatUSD, index_FormatUnits as FormatUnits };
}

export { FormatEvmHash as F, FormatEvmAddress as a, FormatExplorerAddress as b, FormatExplorerBlock as c, FormatExplorerTransaction as d, FormatUSD as e, FormatPercent as f, FormatNumber as g, FormatUnits as h, index as i };
