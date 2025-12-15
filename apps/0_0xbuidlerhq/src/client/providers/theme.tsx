"use client";

import { ThemeProvider as ThemeProviderPrimitive } from "@0xbuidlerhq/ui/providers/theme";
import type { PropsWithChildren } from "react";

/**
 * Theme provider.
 */
const ThemeProvider = ({ children }: PropsWithChildren) => (
	<ThemeProviderPrimitive
		attribute="class"
		defaultTheme="light"
		forcedTheme="light"
		disableTransitionOnChange
	>
		{children}
	</ThemeProviderPrimitive>
);

export { ThemeProvider };
