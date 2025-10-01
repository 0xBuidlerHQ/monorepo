import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { z } from 'zod';
import { N as NetworkId, a as NetworkChainId } from './networks-N9hD4Sq-.js';

/**
 * @dev List of all the {Tokens} the app interact with.
 */
declare const zTokenId: z.ZodEnum<["eth", "usdc", "usdt", "op"]>;
type TokenId = z.infer<typeof zTokenId>;
/**
 * @dev List of all the {Tokens} the app interact with.
 */
declare const zDepositTokenId: z.ZodEnum<["usdc", "usdt"]>;
type DepositTokenId = z.infer<typeof zDepositTokenId>;
/**
 * @dev List of all the {Tokens}'s name.
 */
declare const TokenTicker: {
    readonly eth: "ETH";
    readonly usdc: "USDC";
    readonly usdt: "USDT";
    readonly op: "OP";
};
type TokenTicker = (typeof TokenTicker)[keyof typeof TokenTicker];
declare const zTokenTicker: z.ZodUnion<any>;
/**
 * @dev Simply convert {TokenAddress} to a mapping of token addresses -> tokenId.
 *
 * 0xf0F161fDA2712DB8b566946122a5af183995e2eD -> usdt
 * 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 -> usdc
 */
declare const TokenAddressToTokenId: {
    [tokenAddress: string]: "eth" | "usdc" | "usdt" | "op";
};
/**
 * @dev
 */
declare const tokenMetadata: (tokenId: TokenId | undefined, networkId: NetworkId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    network: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    address: "0x4200000000000000000000000000000000000006" | "0xd988097fb8612cc24eeC14542bC03424c656005f" | "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" | "0x0b2c639c533813f4aa9d7837caf62653d097ff85" | "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" | "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" | "0x176211869cA2b568f2A7D4EE941E073a821EE1ff" | "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4" | "0xf0F161fDA2712DB8b566946122a5af183995e2eD" | "0xdAC17F958D2ee523a2206206994597C13D831ec7" | "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" | "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" | "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" | "0xA219439258ca9da29E9Cc4cE5596924745e12B93" | "0x4200000000000000000000000000000000000042";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
type TokenMetadata = NonNullable<ReturnType<typeof tokenMetadata>>;
/**
 * @dev
 */
declare const tokenMetadataByNetworkChainId: (tokenId: TokenId | undefined, networkChainId: NetworkChainId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    network: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    address: "0x4200000000000000000000000000000000000006" | "0xd988097fb8612cc24eeC14542bC03424c656005f" | "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" | "0x0b2c639c533813f4aa9d7837caf62653d097ff85" | "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" | "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" | "0x176211869cA2b568f2A7D4EE941E073a821EE1ff" | "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4" | "0xf0F161fDA2712DB8b566946122a5af183995e2eD" | "0xdAC17F958D2ee523a2206206994597C13D831ec7" | "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" | "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" | "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" | "0xA219439258ca9da29E9Cc4cE5596924745e12B93" | "0x4200000000000000000000000000000000000042";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
/**
 * @dev
 */
declare const tokenMetadataByAddress: (tokenAddress: string | undefined, networkId: NetworkId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    network: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    address: "0x4200000000000000000000000000000000000006" | "0xd988097fb8612cc24eeC14542bC03424c656005f" | "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" | "0x0b2c639c533813f4aa9d7837caf62653d097ff85" | "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" | "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" | "0x176211869cA2b568f2A7D4EE941E073a821EE1ff" | "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4" | "0xf0F161fDA2712DB8b566946122a5af183995e2eD" | "0xdAC17F958D2ee523a2206206994597C13D831ec7" | "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" | "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" | "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" | "0xA219439258ca9da29E9Cc4cE5596924745e12B93" | "0x4200000000000000000000000000000000000042";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
/**
 * @dev
 */
declare const tokenMetadataByAddressByNetworkChainId: (tokenAddress: string | undefined, networkChainId: NetworkChainId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    network: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    address: "0x4200000000000000000000000000000000000006" | "0xd988097fb8612cc24eeC14542bC03424c656005f" | "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" | "0x0b2c639c533813f4aa9d7837caf62653d097ff85" | "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" | "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" | "0x176211869cA2b568f2A7D4EE941E073a821EE1ff" | "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4" | "0xf0F161fDA2712DB8b566946122a5af183995e2eD" | "0xdAC17F958D2ee523a2206206994597C13D831ec7" | "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" | "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" | "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" | "0xA219439258ca9da29E9Cc4cE5596924745e12B93" | "0x4200000000000000000000000000000000000042";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
/**
 * @dev
 */
declare const tokenMetadataByTokenTicker: (tokenTicker: TokenTicker | undefined, networkId: NetworkId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    network: "mode" | "ethereum" | "base" | "optimism" | "arbitrum" | "polygon" | "linea" | "zksync" | "anvil" | "sepolia" | "baseSepolia";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    address: "0x4200000000000000000000000000000000000006" | "0xd988097fb8612cc24eeC14542bC03424c656005f" | "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" | "0x0b2c639c533813f4aa9d7837caf62653d097ff85" | "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" | "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" | "0x176211869cA2b568f2A7D4EE941E073a821EE1ff" | "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4" | "0xf0F161fDA2712DB8b566946122a5af183995e2eD" | "0xdAC17F958D2ee523a2206206994597C13D831ec7" | "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" | "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" | "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" | "0xA219439258ca9da29E9Cc4cE5596924745e12B93" | "0x4200000000000000000000000000000000000042";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
/**
 * @dev
 */
declare const simpleTokenMetadata: (tokenId: TokenId | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;
type SimpleTokenMetadata = NonNullable<ReturnType<typeof simpleTokenMetadata>>;
/**
 * @dev
 */
declare const simpleTokenMetadataByTokenTicker: (tokenTicker: TokenTicker | undefined) => {
    id: "eth" | "usdc" | "usdt" | "op";
    ticker: "ETH" | "USDC" | "USDT" | "OP";
    decimals: 6 | 18;
    Logo: ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element) | ((props: react.SVGProps<SVGSVGElement>) => react_jsx_runtime.JSX.Element);
} | undefined;

type tokens_DepositTokenId = DepositTokenId;
type tokens_SimpleTokenMetadata = SimpleTokenMetadata;
declare const tokens_TokenAddressToTokenId: typeof TokenAddressToTokenId;
type tokens_TokenId = TokenId;
type tokens_TokenMetadata = TokenMetadata;
type tokens_TokenTicker = TokenTicker;
declare const tokens_simpleTokenMetadata: typeof simpleTokenMetadata;
declare const tokens_simpleTokenMetadataByTokenTicker: typeof simpleTokenMetadataByTokenTicker;
declare const tokens_tokenMetadata: typeof tokenMetadata;
declare const tokens_tokenMetadataByAddress: typeof tokenMetadataByAddress;
declare const tokens_tokenMetadataByAddressByNetworkChainId: typeof tokenMetadataByAddressByNetworkChainId;
declare const tokens_tokenMetadataByNetworkChainId: typeof tokenMetadataByNetworkChainId;
declare const tokens_tokenMetadataByTokenTicker: typeof tokenMetadataByTokenTicker;
declare const tokens_zDepositTokenId: typeof zDepositTokenId;
declare const tokens_zTokenId: typeof zTokenId;
declare const tokens_zTokenTicker: typeof zTokenTicker;
declare namespace tokens {
  export { type tokens_DepositTokenId as DepositTokenId, type tokens_SimpleTokenMetadata as SimpleTokenMetadata, tokens_TokenAddressToTokenId as TokenAddressToTokenId, type tokens_TokenId as TokenId, type tokens_TokenMetadata as TokenMetadata, type tokens_TokenTicker as TokenTicker, tokens_simpleTokenMetadata as simpleTokenMetadata, tokens_simpleTokenMetadataByTokenTicker as simpleTokenMetadataByTokenTicker, tokens_tokenMetadata as tokenMetadata, tokens_tokenMetadataByAddress as tokenMetadataByAddress, tokens_tokenMetadataByAddressByNetworkChainId as tokenMetadataByAddressByNetworkChainId, tokens_tokenMetadataByNetworkChainId as tokenMetadataByNetworkChainId, tokens_tokenMetadataByTokenTicker as tokenMetadataByTokenTicker, tokens_zDepositTokenId as zDepositTokenId, tokens_zTokenId as zTokenId, tokens_zTokenTicker as zTokenTicker };
}

export { type DepositTokenId as D, type SimpleTokenMetadata as S, TokenAddressToTokenId as T, zTokenTicker as a, zDepositTokenId as b, tokenMetadata as c, tokenMetadataByTokenTicker as d, tokenMetadataByAddress as e, tokenMetadataByAddressByNetworkChainId as f, tokenMetadataByNetworkChainId as g, simpleTokenMetadataByTokenTicker as h, type TokenId as i, TokenTicker as j, type TokenMetadata as k, simpleTokenMetadata as s, tokens as t, zTokenId as z };
