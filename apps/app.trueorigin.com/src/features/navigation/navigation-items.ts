export const navigationItems = [
	{ name: "Explore", icon: "Explore", href: "/explore" },
	{ name: "Feed", icon: "Feed", href: "/feed" },
	{ name: "Registry", icon: "Registry", href: "/registry" },
	{ name: "Trading", icon: "Trading", href: "/trading" },
	{ name: "Submit", icon: "Submit", href: "/submit" },
	{ name: "Collections", icon: "My Collection", href: "/collection" },
	{ name: "Verify", icon: "Verify", href: "/verify" },
	{ name: "Transfers", icon: "Transfers", href: "/transfers" },
	{ name: "Scan", icon: "Scan", href: "/scan" },
];

export const isNavigationActive = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`) || (href === "/registry" && pathname.startsWith("/items/"));
