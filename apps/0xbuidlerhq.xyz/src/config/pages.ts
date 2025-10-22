const PAGES = {
	about: "/about",
	projects: "/projects",
	music: "/music",
	thoughts: "/thoughts",

	_youtube: "https://www.youtube.com/@0xbuidlerhq",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
