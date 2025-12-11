"use client";

import type { PropsWithChildren } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";

const wagmiConfig = createConfig({
	chains: [mainnet],
	ssr: true,
	transports: {
		[mainnet.id]: http(),
	},
});

const BlockchainProvider = ({ children }: PropsWithChildren) => (
	<WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
);

export { BlockchainProvider };
