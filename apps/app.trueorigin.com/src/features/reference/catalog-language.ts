export type CatalogLanguage = "en" | "fr";

export function catalogLanguage(value: unknown): CatalogLanguage {
	return value === "fr" ? "fr" : "en";
}

export function catalogHref(href: string, language: CatalogLanguage) {
	if (language === "en") return href;
	const [base, hash] = href.split("#");
	const [path, query = ""] = base.split("?");
	const params = new URLSearchParams(query);
	params.set("lang", language);
	return `${path}?${params}${hash ? `#${hash}` : ""}`;
}

export const catalogLanguageNames = { en: "English", fr: "Français" };
