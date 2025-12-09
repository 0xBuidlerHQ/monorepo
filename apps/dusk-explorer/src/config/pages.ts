const PAGES = {
	homepage: "/",
	blocks: "/blocks",
	transactions: "/transactions",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
