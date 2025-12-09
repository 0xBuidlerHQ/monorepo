import { ThemeProvider } from "@client/providers/theme";
import type { PropsWithChildren } from "react";

/**
 * @dev Layout Providers.
 */
const LayoutProviders = ({ children }: PropsWithChildren) => {
	return <ThemeProvider>{children}</ThemeProvider>;
};

/**
 * @dev Providers.
 */
const Providers = ({ children }: PropsWithChildren) => {
	return <LayoutProviders>{children}</LayoutProviders>;
};

export { Providers };
