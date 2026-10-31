"use client";
import { createContext, type ReactNode, useContext } from "react";
import type { ContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";

const LocaleContext = createContext<ContentLocale>("en");
export function LocaleProvider({
	locale,
	children,
}: {
	locale: ContentLocale;
	children: ReactNode;
}) {
	return (
		<LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
	);
}
export function useLocale() {
	return useContext(LocaleContext);
}
export function UiText({ name }: { name: keyof typeof messages.en }) {
	return messages[useLocale()][name];
}
