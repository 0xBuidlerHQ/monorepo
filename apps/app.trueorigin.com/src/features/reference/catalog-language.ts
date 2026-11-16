// Retain the data language type so the archived French source can be enabled again later.
export type CatalogLanguage = "en" | "fr";

export function catalogLanguage(_value: unknown): CatalogLanguage {
 return "en";
}

export function catalogHref(href: string, _language: CatalogLanguage) {
 const [base, hash] = href.split("#");
 const [path, query = ""] = base.split("?");
 const params = new URLSearchParams(query);
 params.delete("lang");
 return `${path}${params.size ? `?${params}` : ""}${hash ? `#${hash}` : ""}`;
}

export const catalogLanguageNames = { en: "English", fr: "Français" };
