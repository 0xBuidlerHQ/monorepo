import type { AccountConfig, PasskeyIdentity } from "./config.ts";

export function ethereumChainId(): AccountConfig["chainId"] {
	const production = process.env.NODE_ENV === "production";
	const chainId = Number(
		process.env.TRUEORIGIN_CHAIN_ID ?? (production ? 1 : 31337),
	);
	if (chainId !== 1 && chainId !== 31337)
		throw new Error("Unsupported Ethereum chain ID.");
	if (production && chainId !== 1)
		throw new Error("Production must use Ethereum mainnet.");
	return chainId;
}

export function ethereumEndpoint(service: "rpc" | "bundler") {
	if (ethereumChainId() === 31337)
		return service === "rpc"
			? "http://127.0.0.1:8545"
			: "http://127.0.0.1:4337";
	const endpoint =
		service === "rpc"
			? process.env.ETHEREUM_RPC_URL
			: process.env.ZERODEV_BUNDLER_RPC_URL;
	if (!endpoint)
		throw new Error(
			"Configure ETHEREUM_RPC_URL and ZERODEV_BUNDLER_RPC_URL for mainnet.",
		);
	return endpoint;
}

export function browserAccountConfig(): AccountConfig {
	// Validate providers without returning their credentials to the browser.
	ethereumEndpoint("rpc");
	ethereumEndpoint("bundler");
	return {
		chainId: ethereumChainId(),
		rpcUrl: "/api/ethereum/rpc",
		bundlerUrl: "/api/ethereum/bundler",
	};
}

/** Resolve the authenticated owner's smart account using read-only RPC calls. */
export async function passkeyAccountAddress(identity: PasskeyIdentity) {
	const { connectPasskeyAccount } = await import("./account.ts");
	const connection = await connectPasskeyAccount(identity, {
		chainId: ethereumChainId(),
		rpcUrl: ethereumEndpoint("rpc"),
		bundlerUrl: ethereumEndpoint("bundler"),
	});
	return connection.account.address;
}

/** The app must authenticate the owner before calling this local-only helper. */
export async function fundLocalAccount(identity: PasskeyIdentity) {
	if (process.env.NODE_ENV === "production" || ethereumChainId() !== 31337)
		throw new Error("Local funding is unavailable on this network.");
	const { connectPasskeyAccount } = await import("./account.ts");
	const connection = await connectPasskeyAccount(identity, {
		chainId: 31337,
		rpcUrl: ethereumEndpoint("rpc"),
		bundlerUrl: ethereumEndpoint("bundler"),
	});
	const balance = await connection.publicClient.getBalance({
		address: connection.account.address,
	});
	if (balance >= 100_000_000_000_000_000n) return;
	const response = await fetch(ethereumEndpoint("rpc"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "anvil_setBalance",
			params: [connection.account.address, "0xde0b6b3a7640000"],
		}),
		signal: AbortSignal.timeout(10_000),
	});
	const result = await response.json();
	if (!response.ok || result.error) throw new Error("Local funding failed.");
}
