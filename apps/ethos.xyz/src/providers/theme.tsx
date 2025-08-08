"use client";

import { ThemeProvider as ThemeProviderPrimitive } from "@ethos/ui/providers/theme";
import type { PropsWithChildren } from "react";

/**
 * Theme provider.
 */
const ThemeProvider = ({ children }: PropsWithChildren) => (
	<ThemeProviderPrimitive
		attribute="class"
		defaultTheme="light"
		forcedTheme="light"
		enableSystem
		disableTransitionOnChange
	>
		{children}
	</ThemeProviderPrimitive>
);

export { ThemeProvider };
