import type { ContentLocale } from "./locales";
import { type ContentEntry, getEntries } from "./content";

export { formatPublicationDate } from "./dates";

export type Thought = ContentEntry & { date: string; tags: string[] };

export function getThoughts(locale: ContentLocale = "en") {
	return getEntries("thoughts", locale)
		.filter(
			(entry): entry is Thought =>
				entry.date !== undefined && entry.tags !== undefined,
		)
		.sort(
			(a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
		);
}

export function getThoughtTags(locale: ContentLocale = "en") {
	return [
		...new Set(getThoughts(locale).flatMap((thought) => thought.tags)),
	].sort();
}

export function getThought(slug: string) {
	return getThoughts().find((thought) => thought.slug === slug);
}
