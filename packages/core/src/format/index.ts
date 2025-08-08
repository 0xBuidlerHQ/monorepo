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

export { FormatExplorerAddress, FormatExplorerBlock, FormatExplorerTransaction };
