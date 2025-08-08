import { ArbitrumLogo } from "@ethos/assets/crypto/arbitrum/Logo";
import { BaseLogo } from "@ethos/assets/crypto/base/Logo";
import { EthereumLogo } from "@ethos/assets/crypto/ethereum/Logo";
import { LineaLogo } from "@ethos/assets/crypto/linea/Logo";
import { ModeLogo } from "@ethos/assets/crypto/mode/Logo";
import { OptimismLogo } from "@ethos/assets/crypto/optimism/Logo";
import { PolygonLogo } from "@ethos/assets/crypto/polygon/Logo";
import { ZKsyncLogo } from "@ethos/assets/crypto/zksync/Logo";

import {
	anvil,
	arbitrum,
	base,
	type Chain,
	linea,
	mainnet,
	mode,
	optimism,
	polygon,
	sepolia,
	zksync,
} from "viem/chains";

import { z } from "zod";

import { createZodSchemaFromObjectValues } from "../utils";

/**
 * @dev List of all the {Networks} the app interact with.
 */
const zNetworkId = z.enum([
	"mode",
	"ethereum",
	"base",
	"optimism",
	"arbitrum",
	"polygon",
	"linea",
	"zksync",

	// Testnets.
	"anvil",
	"sepolia",
]);
type NetworkId = z.infer<typeof zNetworkId>;

/**
 * @dev List of all the {Networks} name.
 */
const NetworkName = {
	mode: "Mode",
	ethereum: "Ethereum",
	base: "Base",
	optimism: "Optimism",
	arbitrum: "Arbitrum",
	polygon: "Polygon",
	linea: "Linea",
	zksync: "ZKsync",

	// Testnets.
	anvil: "Anvil",
	sepolia: "Sepolia",
} as const satisfies { [key in NetworkId]: string };
type NetworkName = (typeof NetworkName)[keyof typeof NetworkName];
const zNetworkName = createZodSchemaFromObjectValues(NetworkName);

/**
 * @dev List of all the {Networks} logo.
 */
const NetworkLogo = {
	mode: ModeLogo,
	ethereum: EthereumLogo,
	base: BaseLogo,
	optimism: OptimismLogo,
	arbitrum: ArbitrumLogo,
	polygon: PolygonLogo,
	linea: LineaLogo,
	zksync: ZKsyncLogo,

	// Testnets.
	anvil: EthereumLogo,
	sepolia: EthereumLogo,
} as const satisfies { [key in NetworkId]: React.ElementType };

/**
 * @dev List of all the {Networks} chain id.
 */
const NetworkChainId = {
	mode: mode.id,
	ethereum: mainnet.id,
	base: base.id,
	optimism: optimism.id,
	arbitrum: arbitrum.id,
	polygon: polygon.id,
	linea: linea.id,
	zksync: zksync.id,

	// Testnets.
	anvil: anvil.id,
	sepolia: sepolia.id,
} as const satisfies { [key in NetworkId]: number };
type NetworkChainId = (typeof NetworkChainId)[keyof typeof NetworkChainId];
const zNetworkChainId = createZodSchemaFromObjectValues(NetworkChainId);

/**
 * @dev List of all the {Networks} viem chain.
 */
const NetworkViemChain = {
	mode: mode,
	ethereum: mainnet,
	base: base,
	optimism: optimism,
	arbitrum: arbitrum,
	polygon: polygon,
	linea: linea,
	zksync: zksync,

	// Testnets.
	anvil: { ...anvil, blockExplorers: { default: { name: "#", url: "#", apiUrl: "#" } } }, //
	sepolia: sepolia,
} as const satisfies { [key in NetworkId]: Chain };

/**
 * @dev
 */
const networkMetadata = (networkId: NetworkId | undefined) => {
	if (!networkId) return undefined;

	if (!zNetworkId.safeParse(networkId).success) return undefined;

	return {
		id: networkId,
		name: NetworkName[networkId],
		chainId: NetworkChainId[networkId],
		chain: NetworkViemChain[networkId],

		// Tsx.
		Logo: NetworkLogo[networkId],
	};
};
type NetworkMetadata = NonNullable<ReturnType<typeof networkMetadata>>;

/**
 * @dev
 */
const networkMetadataByChainId = (networkChainId: NetworkChainId | number | undefined) => {
	if (!networkChainId) return undefined;

	if (!zNetworkChainId.safeParse(networkChainId).success) return undefined;

	const networkId = networkIdByNetworkChainId(networkChainId);

	if (!networkId) return undefined;

	return networkMetadata(networkId);
};

/**
 * @dev
 */
const networkIdByNetworkChainId = (networkChainId: NetworkChainId | number | undefined) => {
	if (!networkChainId) return undefined;
	return Object.entries(NetworkChainId).find(([, id]) => id === networkChainId)?.[0] as NetworkId;
};

export {
	// Schemas.
	zNetworkId,
	zNetworkName,
	zNetworkChainId,
	NetworkLogo,
	//
	networkMetadata,
	networkIdByNetworkChainId,
	networkMetadataByChainId,
	//
	NetworkName,
	type NetworkId,
	NetworkChainId,
	type NetworkMetadata,
	NetworkViemChain,
};
