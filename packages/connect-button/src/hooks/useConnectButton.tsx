import type { Web3 } from "@0xbuidlerhq/core";
import { create } from "zustand";

type ConnectButtonStore = {
	/**
	 * @dev Internal Data.
	 */
	props: {
		status: "connected" | "disconnected" | "connecting";
		eoa: { address: string };
		network?: Web3.Networks.NetworkMetadata;
		isNetworkUnsupported?: boolean;
		cb: { onConnect: () => void; onDisconnect: () => void; onWrongNetwork: () => void };
		provider: { name: string; img: string };
	};
	setConnectButton: (wallet: ConnectButtonStore["props"]) => void;
};

const useConnectButton = create<ConnectButtonStore>()((set) => ({
	/**
	 * @dev Wallet.
	 */
	props: {
		status: "disconnected",
		eoa: { address: "" },
		network: undefined,
		isNetworkUnsupported: undefined,
		cb: { onConnect: () => {}, onDisconnect: () => {}, onWrongNetwork: () => {} },
		provider: { name: "", img: "" },
	},
	setConnectButton: (connectButton) =>
		set((s) => ({ ...s, props: { ...s.props, ...connectButton } })),
}));

export { useConnectButton, type ConnectButtonStore };
