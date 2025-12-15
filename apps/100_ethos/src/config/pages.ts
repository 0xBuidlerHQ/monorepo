const PAGES = {
	homepage: "/",

	dashboard: "/dashboard",

	explore: "/explore",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
