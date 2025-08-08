import { EthereumLogo } from "@ethos/assets/crypto/ethereum/Logo";
import { OptimismLogo } from "@ethos/assets/crypto/optimism/Logo";
import { USDCLogo } from "@ethos/assets/crypto/usdc/Logo";
import { USDTLogo } from "@ethos/assets/crypto/usdt/Logo";
import { z } from "zod";
import { createZodSchemaFromObjectValues } from "../utils";
import {
	type NetworkChainId,
	type NetworkId,
	networkIdByNetworkChainId,
	zNetworkChainId,
	zNetworkId,
} from "./networks";

/**
 * @dev Utils.
 */
const PreUndefined = {
	mode: undefined,
	ethereum: undefined,
	base: undefined,
	optimism: undefined,
	arbitrum: undefined,
	polygon: undefined,
	linea: undefined,
	zksync: undefined,

	// Testnets.
	anvil: undefined,
	sepolia: undefined,
} as const satisfies { [key in NetworkId]: undefined };

/**
 * @dev List of all the {Tokens} the app interact with.
 */
const zTokenId = z.enum([
	// The goat
	"eth",

	"usdc",
	"usdt",
	"op",
]);
type TokenId = z.infer<typeof zTokenId>;

/**
 * @dev List of all the {Tokens} the app interact with.
 */
const zDepositTokenId = z.enum([zTokenId.Enum.usdc, zTokenId.Enum.usdt]);
type DepositTokenId = z.infer<typeof zDepositTokenId>;

/**
 * @dev List of all the {Tokens}'s name.
 */
const TokenTicker = {
	eth: "ETH",

	usdc: "USDC",
	usdt: "USDT",
	op: "OP",
} as const satisfies { [key in TokenId]: string };
type TokenTicker = (typeof TokenTicker)[keyof typeof TokenTicker];
const zTokenTicker = createZodSchemaFromObjectValues(TokenTicker);

/**
 * @dev List of all the {Tokens}'s logo.
 */
const TokenLogo = {
	eth: EthereumLogo,

	usdc: USDCLogo,
	usdt: USDTLogo,
	op: OptimismLogo,
} as const satisfies { [key in TokenId]: React.ElementType };

/**
 * @dev List of all the {Tokens}'s logo.
 */
const TokenDecimals = {
	eth: 18,

	usdc: 6,
	usdt: 6,
	op: 18,
} as const satisfies { [key in TokenId]: number };

/**
 * @dev List of all the {Tokens}'s address.
 */
const TokenAddress = {
	eth: {
		...PreUndefined,
		base: "0x4200000000000000000000000000000000000006",
		mode: "0x4200000000000000000000000000000000000006",
	},
	usdc: {
		...PreUndefined,
		mode: "0xd988097fb8612cc24eeC14542bC03424c656005f",
		ethereum: "0xd988097fb8612cc24eeC14542bC03424c656005f",
		base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
		optimism: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
		arbitrum: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
		polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
		linea: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
		zksync: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
	},
	usdt: {
		...PreUndefined,
		mode: "0xf0F161fDA2712DB8b566946122a5af183995e2eD",
		ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		optimism: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
		arbitrum: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
		polygon: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
		linea: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
	},
	op: {
		...PreUndefined,
		optimism: "0x4200000000000000000000000000000000000042",
	},
} as const satisfies { [key in TokenId]: { [key in NetworkId]: string | undefined } };

/**
 * @dev Simply convert {TokenAddress} to a mapping of token addresses -> tokenId.
 *
 * 0xf0F161fDA2712DB8b566946122a5af183995e2eD -> usdt
 * 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 -> usdc
 */
const TokenAddressToTokenId = (() => {
	type AddressToTokenIdMap = { [tokenAddress: string]: TokenId };
	return Object.fromEntries(
		Object.entries(TokenAddress).flatMap(([tokenId, networks]) =>
			Object.entries(networks)
				.map(([_, tokenAddress]) => [tokenAddress, tokenId])
				.filter(([tokenAddress]) => tokenAddress),
		),
	) as AddressToTokenIdMap;
})();

/**
 * @dev Simply convert {TokenTicker} to a mapping of token ticker -> tokenId.
 *
 * "USDC" -> "usdc"
 */
const TokenTickerToTokenId = Object.fromEntries(
	Object.entries(TokenTicker).map(([k, v]) => [v, k as TokenId]),
);

/**
 * @dev
 */
const tokenMetadata = (tokenId: TokenId | undefined, networkId: NetworkId | undefined) => {
	if (!tokenId || !networkId) return undefined;

	if (!zTokenId.safeParse(tokenId).success) return undefined;
	if (!zNetworkId.safeParse(networkId).success) return undefined;

	const tokenAddress = TokenAddress[tokenId][networkId];
	if (!tokenAddress) return undefined;

	return {
		id: tokenId,
		network: networkId,
		ticker: TokenTicker[tokenId],
		address: tokenAddress,
		decimals: TokenDecimals[tokenId],

		// Tsx.
		Logo: TokenLogo[tokenId],
	};
};
type TokenMetadata = NonNullable<ReturnType<typeof tokenMetadata>>;

/**
 * @dev
 */
const tokenMetadataByNetworkChainId = (
	tokenId: TokenId | undefined,
	networkChainId: NetworkChainId | undefined,
) => {
	if (!tokenId || !networkChainId) return undefined;

	if (!zTokenId.safeParse(tokenId).success) return undefined;
	if (!zNetworkChainId.parse(networkChainId).success) return undefined;

	const networkId = networkIdByNetworkChainId(networkChainId);
	return tokenMetadata(tokenId, networkId);
};

/**
 * @dev
 */
const tokenMetadataByAddress = (
	tokenAddress: string | undefined,
	networkId: NetworkId | undefined,
) => {
	if (!tokenAddress || !networkId) return undefined;

	if (!zNetworkId.safeParse(networkId).success) return undefined;

	const tokenId = TokenAddressToTokenId[tokenAddress];
	if (!tokenId) return undefined;

	return tokenMetadata(tokenId, networkId);
};

/**
 * @dev
 */
const tokenMetadataByAddressByNetworkChainId = (
	tokenAddress: string | undefined,
	networkChainId: NetworkChainId | undefined,
) => {
	if (!tokenAddress || !networkChainId) return undefined;

	if (!zNetworkChainId.parse(networkChainId).success) return undefined;

	const networkId = networkIdByNetworkChainId(networkChainId);
	return tokenMetadataByAddress(tokenAddress, networkId);
};

/**
 * @dev
 */
const tokenMetadataByTokenTicker = (
	tokenTicker: TokenTicker | undefined,
	networkId: NetworkId | undefined,
) => {
	if (!tokenTicker || !networkId) return undefined;

	if (!zTokenTicker.safeParse(tokenTicker).success) return undefined;
	if (!zNetworkId.safeParse(networkId).success) return undefined;

	const tokenId = TokenTickerToTokenId[tokenTicker];
	if (!zTokenId.safeParse(tokenId).success) return undefined;

	return tokenMetadata(tokenId, networkId);
};

/**
 * @dev
 */
const simpleTokenMetadata = (tokenId: TokenId | undefined) => {
	if (!tokenId) return undefined;

	if (!zTokenId.safeParse(tokenId).success) return undefined;

	return {
		id: tokenId,
		ticker: TokenTicker[tokenId],
		decimals: TokenDecimals[tokenId],

		// Tsx.
		Logo: TokenLogo[tokenId],
	};
};
type SimpleTokenMetadata = NonNullable<ReturnType<typeof simpleTokenMetadata>>;

/**
 * @dev
 */
const simpleTokenMetadataByTokenTicker = (tokenTicker: TokenTicker | undefined) => {
	if (!tokenTicker) return undefined;

	if (!zTokenTicker.safeParse(tokenTicker).success) return undefined;

	const tokenId = TokenTickerToTokenId[tokenTicker];
	if (!zTokenId.safeParse(tokenId).success) return undefined;

	return simpleTokenMetadata(tokenId);
};

export {
	//
	zTokenId,
	zTokenTicker,
	zDepositTokenId,
	TokenAddressToTokenId,
	//
	tokenMetadata,
	tokenMetadataByTokenTicker,
	tokenMetadataByAddress,
	tokenMetadataByAddressByNetworkChainId,
	tokenMetadataByNetworkChainId,
	//
	simpleTokenMetadata,
	simpleTokenMetadataByTokenTicker,
	//
	type DepositTokenId,
	type TokenId,
	type TokenTicker,
	type TokenMetadata,
	type SimpleTokenMetadata,
};
