const formatEvmExplorerTxHash = (
	evmExplorerUrl: string | undefined,
	txHash: string | undefined,
) => {
	if (!evmExplorerUrl || !txHash) return "#";

	return `${evmExplorerUrl}/tx/${txHash}`;
};

export { formatEvmExplorerTxHash };
