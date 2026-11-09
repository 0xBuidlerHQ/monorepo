import { defineChain } from "viem";
import { mainnet } from "viem/chains";

export const LOCAL_CHAIN_ID = 31337;
export const localEthereum = defineChain({
	id: LOCAL_CHAIN_ID,
	name: "Ethereum local fork",
	nativeCurrency: mainnet.nativeCurrency,
	rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
	testnet: true,
});

export interface AccountConfig {
	chainId: 1 | 31337;
	rpcUrl: string;
	bundlerUrl: string;
}

// Only public authentication material. Private keys never leave the authenticator.
export interface PasskeyIdentity {
	id: string;
	pubX: string;
	pubY: string;
	rpId: string;
}

export function accountChain(chainId: AccountConfig["chainId"]) {
	return chainId === LOCAL_CHAIN_ID ? localEthereum : mainnet;
}
