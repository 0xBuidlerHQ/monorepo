import { printingNames } from "../pokemon/card-printings.ts";
import { navigationItems } from "./navigation-items.ts";
import { pokemonCategories } from "../pokemon/categories.ts";
import { setPageHref } from "../reference/set-relationships.ts";
import { catalogHref, catalogLanguage } from "../reference/catalog-language.ts";

export type BreadcrumbItem = { label: string; href: string; copyValue?: string };
export type BreadcrumbDetail = {
	name: string | null;
	setId?: string;
	setName?: string;
};
export function needsBreadcrumbDetail(pathname: string) {
	return /^\/explore\/(pokemon\/\d+|sets\/[^/]+|catalogue\/(?!pokemon$)[^/]+\/[^/]+)\/?$/.test(
		pathname.replace("/explore/catalogue/collections/", "/explore/sets/").replace(/\/$/, ""),
	);
}

export function breadcrumbTrail(
	pathname: string,
	params: Pick<URLSearchParams, "get">,
	detail?: BreadcrumbDetail,
): BreadcrumbItem[] {
	const language = catalogLanguage(params.get("lang"));
	const catalog = (href: string) => catalogHref(href, language);
	const explore = { label: "Explore", href: "/explore" };
	const pokemon = { label: "Pokémon", href: catalog("/explore/pokemon") };
	const category = (id: string, label: string) => ({
		label,
		href: catalog(`/explore/pokemon/${id === "cards" ? "catalogue" : id}`),
	});
	const base = [explore, pokemon];
	const path = pathname.replace(/\/$/, "") || "/";
	if (path === "/" || path === "/explore") return [explore];
	if (path === "/explore/pokemon") {
		const selected =
			pokemonCategories.find((entry) => entry.id === params.get("category")) ??
			pokemonCategories[1];
		const trail = [...base, category(selected.id, selected.name)];

		return trail;
	}
	if (path === "/explore/pokemon/catalogue") return [...base, category("cards", "Catalogue")];
	if (path === "/explore/pokemon/sealed") return [...base, category("sealed", "Sealed")];
	if (path === "/explore/pokemon/pokedex")
		return [...base, category("pokedex", "Pokédex")];
	const species = path.match(/^\/explore\/pokemon\/(\d+)$/);
	if (species)
		return [
			...base,
			category("pokedex", "Pokédex"),
			{ label: detail?.name ?? `Pokémon #${species[1]}`, href: catalog(path) },
		];
	if (path === "/explore/sets") return [...base, category("cards", "Catalogue")];
	if (path.startsWith("/explore/sets/") || path.startsWith("/explore/catalogue/collections/")) {
		const trail = [
			...base,
			category("cards", "Catalogue"),
			{ label: path.endsWith("/misc") ? "Misc" : detail?.name ?? "Collection", href: catalog(path.startsWith("/explore/sets/") ? setPageHref(path.split("/").at(-1) ?? "") : path) },
		];
		if (params.get("section") === "classic")
			trail.push({
				label: "Classic Collection",
				href: catalog(`${path.startsWith("/explore/sets/") ? setPageHref(path.split("/").at(-1) ?? "") : path}?section=classic`),
			});
		return trail;
	}
	if (path === "/explore/catalogue")
		return [explore, { label: "Catalogue", href: path }];
	if (path === "/explore/catalogue/pokemon")
		return [...base, category("cards", "Catalogue")];
	if (path.startsWith("/explore/catalogue/")) {
        const group = detail
            ? detail.setId && detail.setName
                ? { label: detail.setName, href: catalog(setPageHref(detail.setId)) }
                : { label: "Misc", href: catalog("/explore/catalogue/collections/misc") }
            : undefined;
        const trail = [...base, category("cards", "Catalogue"), ...(group ? [group] : []), { label: detail?.name ?? "Card", href: catalog(path) }];
        const printing = params.get("printing");
        if (printing && Object.hasOwn(printingNames, printing)) {
            const query = new URLSearchParams({ printing });
            trail.push({ label: printingNames[printing], href: catalog(`${path}?${query}`) });
        }
        return trail;
    }

 if (path.startsWith("/activity/")) {
  let id: string;
  try { id = decodeURIComponent(path.slice("/activity/".length)); } catch { id = ""; }
  const parts = id.split(":");
  const label = parts.length === 3 ? `${parts[1].slice(0, 6)}…${parts[1].slice(-4)} · ${parts[2]}` : "Event";
  return [{ label: "Activity", href: "/activity" }, { label, href: path }];
 }

	if (path.startsWith("/registry/"))
		return [
			{ label: "Registry", href: "/registry" },
			{ label: `${path.split("/").at(-1)?.slice(0, 6)}…${path.slice(-4)}`, href: path, copyValue: path.split("/").at(-1) },
		];
	const universe = {
		"/magic": "Magic",
		"/one-piece": "One Piece",
		"/yugioh": "Yu-Gi-Oh!",
	}[path];
	if (universe) return [explore, { label: universe, href: path }];
	const entry = navigationItems.find((item) => item.href === path);
	if (entry) {
		const trail = [
			{
				label: entry.name,
				href: path,
			},
		];
		return trail;
	}
	return [explore];
}
