export type NavigationItem = { name: string; icon: string; href: string };

export const navigationItems: NavigationItem[] = [
	{ name: "Explore", icon: "Explore", href: "/explore" },
	{ name: "Collection", icon: "My Collection", href: "/collection" },
	{ name: "Activity", icon: "Activity", href: "/activity" },
	{ name: "Passports", icon: "Passports", href: "/passports" },
	{ name: "Authenticate", icon: "Submit", href: "/submit" },
	{ name: "Transfers", icon: "Transfers", href: "/transfers" },
	{ name: "Verify", icon: "Verify", href: "/verify" },
	{ name: "Scan", icon: "Scan", href: "/scan" },
];

export const isNavigationActive = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`);

export const primaryNavigationItems = navigationItems.filter(item => !["/transfers", "/scan"].includes(item.href));
