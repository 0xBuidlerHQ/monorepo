import type { Web3 } from "@0xbuidlerhq/core";

type Params = {
	initialAmount: bigint;
	token: Web3.Tokens.TokenId;
	network: Web3.Networks.NetworkId;
};
namespace AAVELidoClassic {
	export type Params = {
		initialAmount: bigint;
		token: Web3.Tokens.TokenId;
		network: Web3.Networks.NetworkId;
	};
}

export type { AAVELidoClassic, Params };
