import "server-only";

import { ethereumEndpoint } from "@0xhq/contracts.trueorigin.com/rpc";
import { AccountError } from "../auth/errors.ts";
import {
	requireAccountIdentity,
	requireTrustedOrigin,
} from "../auth/session.ts";

const methods = {
	rpc: new Set([
		"eth_chainId",
		"eth_blockNumber",
		"eth_call",
		"eth_getCode",
		"eth_getBalance",
		"eth_getTransactionCount",
		"eth_estimateGas",
		"eth_gasPrice",
		"eth_maxPriorityFeePerGas",
		"eth_feeHistory",
		"eth_getBlockByNumber",
		"eth_getTransactionReceipt",
		"eth_getLogs",
	]),
	bundler: new Set([
		"eth_chainId",
		"eth_supportedEntryPoints",
		"eth_estimateUserOperationGas",
		"eth_sendUserOperation",
		"eth_getUserOperationReceipt",
		"eth_getUserOperationByHash",
	]),
};

function errorResponse(error: string, status: number) {
	return Response.json(
		{ error },
		{ status, headers: { "Cache-Control": "no-store" } },
	);
}

/** JSON-RPC transports require an HTTP endpoint, so these remain Route Handlers. */
export async function proxyEthereumRequest(request: Request, service: string) {
	try {
		await requireTrustedOrigin();
		await requireAccountIdentity();
		if (service !== "rpc" && service !== "bundler")
			return errorResponse("Not found.", 404);
		if (Number(request.headers.get("content-length") ?? 0) > 131_072)
			return errorResponse("Request too large.", 413);
		const text = await request.text();
		if (text.length > 131_072) return errorResponse("Request too large.", 413);
		let payload: unknown;
		try {
			payload = JSON.parse(text);
		} catch {
			return errorResponse("Invalid JSON-RPC request.", 400);
		}
		const calls: unknown[] = Array.isArray(payload) ? payload : [payload];
		if (
			!calls.length ||
			calls.length > 20 ||
			calls.some(
				(call) =>
					!call ||
					typeof call !== "object" ||
					!("method" in call) ||
					typeof call.method !== "string" ||
					!methods[service].has(call.method),
			)
		)
			return errorResponse("RPC method not allowed.", 403);
		const upstream = await fetch(ethereumEndpoint(service), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: text,
			signal: AbortSignal.timeout(30_000),
		});
		return new Response(await upstream.text(), {
			status: upstream.status,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		if (error instanceof AccountError)
			return errorResponse(error.message, error.status);
		return errorResponse(
			"Ethereum service unavailable. Check your local stack or provider configuration.",
			502,
		);
	}
}
