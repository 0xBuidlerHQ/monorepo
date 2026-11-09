/** Resolve a stored ipfs:// URI through the configured HTTP gateway. */
export function ipfsGatewayUrl(uri: string, gateway: string) {
	if (!uri.startsWith("ipfs://")) throw new Error("Expected an ipfs:// URI.");
	const base = new URL(gateway.endsWith("/") ? gateway : `${gateway}/`);
	if (!["http:", "https:"].includes(base.protocol) || base.search || base.hash) throw new Error("Use an HTTP(S) gateway URL without query parameters.");
	const [cid, ...parts] = uri.slice(7).split("/");
	if (!/^[a-zA-Z0-9]{32,120}$/.test(cid)) throw new Error("Invalid IPFS CID.");
	const path = parts.map((part) => {
		const value = decodeURIComponent(part);
		if (!value || value === "." || value === ".." || /[\\/\0?#]/.test(value)) throw new Error("Invalid IPFS path.");
		return encodeURIComponent(value);
	}).join("/");
	return `${base.href}${cid}${path ? `/${path}` : ""}`;
}
