import type { PropsWithChildren } from "react";
import { BlockchainProvider } from "@/providers/blockchain";
import { QueryProvider } from "@/providers/query";
import { Web3Provider } from "@/providers/web3";

// /**
//  * @dev Layout Providers.
//  */
// const LayoutProviders = ({ children }: PropsWithChildren) => {
// 	return (
// 		<ThemeProvider>
// 			<TooltipProvider>{children}</TooltipProvider>
// 		</ThemeProvider>
// 	);
// };

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
		// <LayoutProviders>
		<LogicProviders>{children}</LogicProviders>
		// </LayoutProviders>
	);
};

export { Providers };
