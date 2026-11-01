export const contentLocales = ["en", "fr", "es", "pt"] as const;
export type ContentLocale = (typeof contentLocales)[number];
export const translatedCollections = ["learn", "thoughts", "ideas"] as const;
export type TranslatedCollection = (typeof translatedCollections)[number];
export function isContentLocale(value: string): value is ContentLocale {
	return contentLocales.some((locale) => locale === value);
}
export function isTranslatedCollection(
	value: string,
): value is TranslatedCollection {
	return translatedCollections.some((collection) => collection === value);
}

export const localeRegions = {
	en: "en-GB",
	fr: "fr-FR",
	es: "es-ES",
	pt: "pt-PT",
} satisfies Record<ContentLocale, string>;
export const languageLabelKeys = {
	en: "english",
	fr: "french",
	es: "spanish",
	pt: "portuguese",
} as const;
export const languageCodes = {
	en: "EN",
	fr: "FR",
	es: "ES",
	pt: "PT",
} as const;
