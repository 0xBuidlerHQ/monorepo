const formatEvmExplorerBlock = (evmExplorerUrl: string | undefined, block: number | undefined) => {
	if (!evmExplorerUrl || !block) return "#";

	return `${evmExplorerUrl}/block/${block}`;
};

export { formatEvmExplorerBlock };
