const shortenHash = (hash: string) =>
	`${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;

export { shortenHash };
