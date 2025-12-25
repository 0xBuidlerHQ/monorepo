const PAGES = {
	homapage: "/",

	myDino: "/my-dino",
	myBase: "/my-base",

	quests: "/quests",
	hunt: "/hunt",
	casino: "/casino",
	fight: "/fight",
	jobs: "/jobs",
	auctions: "/auctions",
	bank: "/bank",

	ranking: "/ranking",

	shop: "/shop",
} as const;
const allPages = Object.values(PAGES);

export { PAGES, allPages };
