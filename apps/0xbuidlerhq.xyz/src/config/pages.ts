const PAGES = {
	about: "/about",
	thoughts: "/thoughts",

	_youtube: "https://www.youtube.com/@0xbuidlerhq",
	_twitter: "https://x.com/0xbuidlerhq",
	_github: "https://github.com/sshmaxime",
	_spotify:
		"https://open.spotify.com/intl-fr/artist/17iimt6EQxbPUUPRmO4GBi?si=QcjDcYM2S7G8pMbgm2YEQw",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
