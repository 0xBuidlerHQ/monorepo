import { type ContentLocale, localeRegions } from "./locales.ts";

export function formatPublicationDate(
	date: string,
	locale: ContentLocale = "en",
) {
	return new Intl.DateTimeFormat(localeRegions[locale], {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(date));
}
