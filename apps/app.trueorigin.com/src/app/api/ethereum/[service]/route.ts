import "server-only";
import { proxyEthereumRequest } from "@/server/ethereum/proxy";

export async function POST(
	request: Request,
	context: { params: Promise<{ service: string }> },
) {
	const { service } = await context.params;
	return proxyEthereumRequest(request, service);
}
