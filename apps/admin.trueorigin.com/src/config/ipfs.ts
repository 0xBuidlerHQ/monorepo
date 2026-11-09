import { ipfsGatewayUrl } from "@0xhq/config/ipfs";

export function resolveIpfsUri(uri: string) {
	const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3003/ipfs/" : undefined);
	if (!gateway) throw new Error("Configure NEXT_PUBLIC_IPFS_GATEWAY_URL to display IPFS files.");
	return ipfsGatewayUrl(uri, gateway);
}
