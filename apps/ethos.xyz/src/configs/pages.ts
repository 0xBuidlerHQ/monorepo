const PAGES = {
	homapage: "/",

	dashboard: "/dashboard",
	metrics: "/metrics",
	create: "/create",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
