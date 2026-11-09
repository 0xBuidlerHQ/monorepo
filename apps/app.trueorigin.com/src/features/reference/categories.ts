// Each domain can supply its own reference catalog and browsing fields.
export const catalogCategories = [
 { name: "Cards", description: "Games, sets, and the cards that make a collection.", href: "/explore/cards", available: true },
 { name: "Watches", description: "Brands, model references, and editions.", href: null, available: false },
 { name: "Fashion & Accessories", description: "Designers, collections, and individual pieces.", href: null, available: false },
 { name: "Vehicles", description: "Makes, models, and production years.", href: null, available: false },
] as const;
