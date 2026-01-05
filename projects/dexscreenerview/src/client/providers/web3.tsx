"use client";

import { Web3 } from "@0xbuidlerhq/core/index";
import type { NetworkMetadata } from "@0xbuidlerhq/core/web3/networks";
import React from "react";
import {
	injected,
	useChains,
	useClient,
	useConnect,
	useConnection,
	useConnectors,
	useDisconnect,
	usePublicClient,
	useSwitchChain,
} from "wagmi";

/**
 * @dev useWeb3 hook.
 */
const useWeb3Primitive = () => {
	/**
	 *
	 * @dev Viem.
	 *
	 */
	const client = useClient();
	const publicClient = usePublicClient();

	/**
	 *
	 * @dev EOA.
	 *
	 */
	const eoa = useConnection();

	/**
	 *
	 * @dev Connectors.
	 *
	 */
	const connectors = useConnectors();
	const portoConnector = connectors.find((connector) => connector.id === "xyz.ithaca.porto")!;

	/**
	 *
	 * @dev Chain / Network.
	 *
	 * @param chains: All available chain in WAGMI config.
	 * @param chain: Chain config of the network connected. Will be `Undefined` if the connected chain is not set in the current network config.
	 *
	 */
	const chains = useChains();
	const chain = eoa.chain;
	const switchChain = useSwitchChain().switchChain;
	const [isNetworkUnsupported, setIsNetworkUnsupported] = React.useState<boolean | undefined>(
		undefined,
	);

	const [networkMetadata, setNetworkMetadata] = React.useState<NetworkMetadata>();

	const switchToDefaultChain = () => switchChain({ chainId: chains[0].id });

	/**
	 * @dev When the chain connected to the app change, update the network metadata.
	 */
	React.useEffect(() => {
		setNetworkMetadata(Web3.Networks.networkMetadataByChainId(chain?.id));
		setIsNetworkUnsupported(!chain);
	}, [chain]);

	/**
	 *
	 * @dev Provider.
	 *
	 */
	const provider = {
		name: eoa.connector?.name,
		image: eoa.connector?.icon,
	};

	/**
	 *
	 * @dev Account status.
	 *
	 */
	const isConnected = eoa.isConnected;
	const isConnecting = eoa.isConnecting || eoa.isReconnecting;
	const isDisconnected = eoa.isDisconnected;

	const status: "connected" | "connecting" | "disconnected" = (() => {
		if (isConnected) return "connected";
		if (isConnecting) return "connecting";
		if (isDisconnected) return "disconnected";
		return "disconnected";
	})();

	/**
	 *
	 * @dev Connect / Disconnect.
	 *
	 */
	const { mutate: connectPrimitive } = useConnect();
	const { mutate: disconnectPrimitive } = useDisconnect();
	const connect = () =>
		connectPrimitive(
			{
				connector: injected(),
			},
			{
				onSuccess: (e) => console.log("Connect -> success: ", e),
				onError: (e) => console.log("Connect -> failed: ", e),
			},
		);
	const disconnect = () =>
		disconnectPrimitive(
			{},
			{
				onSuccess: (e) => console.log("Disconnect -> success: ", e),
				onError: (e) => console.log("Disconnect -> failed: ", e),
			},
		);

	return {
		client,
		publicClient,
		eoa,
		isConnected,
		isConnecting,
		isDisconnected,
		chain,
		status,
		chains,
		isNetworkUnsupported,
		connect,
		disconnect,
		switchToDefaultChain,
		switchChain,
		provider,
		networkMetadata,
		portoConnector,
	};
};

/**
 * @dev useWeb3 context.
 */
const Web3Context = React.createContext<ReturnType<typeof useWeb3Primitive> | undefined>(undefined);
const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const web3 = useWeb3Primitive();

	return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};

/**
 * @dev useWeb3 context hook.
 */
const useWeb3 = () => {
	const context = React.useContext(Web3Context);
	if (context === undefined) {
		throw new Error("useWeb3 must be used within an Web3Provider");
	}
	return context;
};

export { Web3Provider, useWeb3 };
