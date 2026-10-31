import { getEntries } from "./content";

export type { ContentEntry as Project } from "./content";

export function getProjects() {
	return getEntries("projects");
}

export function getProject(slug: string) {
	return getProjects().find((project) => project.slug === slug);
}
