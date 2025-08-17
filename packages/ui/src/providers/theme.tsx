"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
	useTheme,
} from "next-themes";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme, ThemeProvider };
