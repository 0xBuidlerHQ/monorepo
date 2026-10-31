import { getEntries } from "./content";

export type { ContentEntry as Idea } from "./content";

export function getIdeas() {
	return getEntries("ideas");
}

export function getIdea(slug: string) {
	return getIdeas().find((idea) => idea.slug === slug);
}
