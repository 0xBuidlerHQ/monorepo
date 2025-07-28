"use client";

import { porto } from "porto/wagmi";
import type { PropsWithChildren } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";

const wagmiConfig = createConfig({
	chains: [baseSepolia],
	connectors: [porto()],
	ssr: true,
	transports: {
		[baseSepolia.id]: http(),
	},
});

const BlockchainProvider = ({ children }: PropsWithChildren) => (
	<WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
);

export { BlockchainProvider };
