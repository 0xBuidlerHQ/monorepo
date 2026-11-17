import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { cardCollectionId, setPageHref } from "@/features/reference/set-relationships";
import { pokemonCategories as categories } from "./categories";
import { Pokedex } from "./pokedex";
import { setArtwork } from "@/features/reference/set-artwork";
import { PokemonCollectionBrowser } from "./pokemon-category-browser";
import { normalizeSearch, getReferenceSets, searchReferenceCards } from "@/features/reference/catalog";
import { redirect } from "next/navigation";

type Params = { lang?: string; mode?: string; subcategory?: string; category?: string; q?: string; page?: string };
export async function PokemonSectionResults({ searchParams, category: selectedCategory = "cards" }: { searchParams: Promise<Params>; category?: string }) {
 const params = await searchParams;
 const language = catalogLanguage(params.lang);
 if (params.category === "sets" || params.subcategory) {
  const destination = params.subcategory === "other" ? "/explore/catalogue/collections/misc" : "/explore/pokemon";
  const query = new URLSearchParams(); if (language !== "en") query.set("lang", language); if (params.q) query.set("q", params.q);
  redirect(`${destination}${query.size ? `?${query}` : ""}`);
 }
 const sets = getReferenceSets(language);
 const category = categories.find(entry => entry.id === selectedCategory) ?? categories[1];
 const query = typeof params.q === "string" ? params.q : "";
 const allCards = searchReferenceCards("", { language });
 const matchingCards = searchReferenceCards(query, { language });
 const matchingIds = new Set(matchingCards.map(card => cardCollectionId(card.setId, sets)));
 const counts = new Map<string, number>();
 for (const card of allCards) { const id = cardCollectionId(card.setId, sets); counts.set(id, (counts.get(id) ?? 0) + 1); }
 const collections = sets.filter(set => set.id !== "me55c").filter(set => !query || normalizeSearch(`${set.name} ${set.series}`).includes(normalizeSearch(query)) || matchingIds.has(set.id));
 const showMisc = (counts.get("misc") ?? 0) > 0 && (!query || normalizeSearch("Misc ungrouped cards").includes(normalizeSearch(query)) || matchingIds.has("misc"));
 const tiles: Parameters<typeof PokemonCollectionBrowser>[0]["collections"] = collections.map(set => ({ id: set.id, name: set.name, series: set.series, href: catalogHref(setPageHref(set.id), language), image: setArtwork[set.id]?.src, description: `${counts.get(set.id) ?? 0} cards${set.releaseDate ? ` · ${set.releaseDate.slice(0, 4)}` : ""}` }));
 if (showMisc) tiles.push({ id: "misc", name: "Misc", series: "Other cards", href: catalogHref("/explore/catalogue/collections/misc", language), image: undefined, description: `${counts.get("misc") ?? 0} cards` });
 return <div>
  {category.id === "pokedex" && <Pokedex key={query} initialQuery={query} embedded />}
  {category.id === "cards" && <PokemonCollectionBrowser collections={tiles} series={[...new Set(sets.map(set => set.series))]} />}
 </div>;
}
