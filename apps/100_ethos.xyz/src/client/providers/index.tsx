import { BlockchainProvider } from "@client/providers/blockchain";
import { QueryProvider } from "@client/providers/query";
import { ThemeProvider } from "@client/providers/theme";
import { Web3Provider } from "@client/providers/web3";
import type { PropsWithChildren } from "react";

/**
 * @dev Layout Providers.
 */
const LayoutProviders = ({ children }: PropsWithChildren) => {
	return <ThemeProvider>{children}</ThemeProvider>;
};

/**
 * @dev Layout Providers.
 */
const LogicProviders = ({ children }: PropsWithChildren) => {
	return (
		<QueryProvider>
			<BlockchainProvider>
				<Web3Provider>{children}</Web3Provider>
			</BlockchainProvider>
		</QueryProvider>
	);
};

/**
 * @dev Providers.
 */
const Providers = ({ children }: PropsWithChildren) => {
	return (
		<LayoutProviders>
			<LogicProviders>{children}</LogicProviders>
		</LayoutProviders>
	);
};

export { Providers };
