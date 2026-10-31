import type { ContentLocale } from "./locales";
import { type ContentEntry, getEntries } from "./content";

export type LearnEntry = ContentEntry & { date: string };

export function getLearnEntries(locale: ContentLocale = "en") {
	return getEntries("learn", locale)
		.filter((entry): entry is LearnEntry => entry.date !== undefined)
		.sort(
			(a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
		);
}

export function getLearnEntry(slug: string) {
	return getLearnEntries().find((entry) => entry.slug === slug);
}
