export function parseActivityId(id: string) {
	const match = /^(31337):(0x[0-9a-f]{64}):(0|[1-9][0-9]{0,9})$/i.exec(id);
	if (!match || Number(match[3]) > 2147483647) return null;
	return {
		chainId: Number(match[1]),
		transactionHash: match[2].toLowerCase(),
		logIndex: Number(match[3]),
	};
}
