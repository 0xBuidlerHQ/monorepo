const formatEvmAddress = (address: string) =>
	`${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export { formatEvmAddress };
