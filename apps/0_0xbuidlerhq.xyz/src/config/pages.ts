const PAGES = {
	meditations: "/meditations",
	projects: "/projects",
	music: "/music",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
