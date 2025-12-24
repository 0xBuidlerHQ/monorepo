const formatEvmExplorerAddress = (
	evmExplorerUrl: string | undefined,
	address: string | undefined,
) => {
	if (!evmExplorerUrl || !address) return "#";

	return `${evmExplorerUrl}/address/${address}`;
};

export { formatEvmExplorerAddress };
