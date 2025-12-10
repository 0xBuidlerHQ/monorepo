"use client";

import { Chains } from "porto";
import type { PropsWithChildren } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";

const wagmiConfig = createConfig({
	chains: [Chains.baseSepolia],
	ssr: true,
	transports: {
		[Chains.baseSepolia.id]: http(),
	},
});

const BlockchainProvider = ({ children }: PropsWithChildren) => (
	<WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
);

export { BlockchainProvider };
