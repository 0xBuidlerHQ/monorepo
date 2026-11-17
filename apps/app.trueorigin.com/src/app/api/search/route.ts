import { referenceCards, referenceSets, pokemonSpecies } from "@/features/reference/catalog";
import { cardPageHref, setPageHref } from "@/features/reference/set-relationships";
import { navigationItems } from "@/features/navigation/navigation-items";
import { rankSearchResults, type SearchResult } from "@/features/navigation/search-results";
import { publicPassports } from "@/server/passports/client";

const pages: SearchResult[] = [
 ...navigationItems.filter(item => item.href !== "/scan").map(item => ({ title: item.name, detail: "Open page", href: item.href, group: "Pages", keywords: item.href === "/submit" ? "submit register" : "" })),
 { title: "Pokédex", detail: "Pokémon species", href: "/explore/pokemon/pokedex", group: "Pages" },
 { title: "Catalogue", detail: "Pokémon cards and collections", href: "/explore/pokemon/catalogue", group: "Pages" },
];
const catalogue: SearchResult[] = [
 ...pokemonSpecies.map(pokemon => ({ title: pokemon.name, detail: `#${String(pokemon.id).padStart(3, "0")} · Generation ${pokemon.generation}`, href: `/explore/pokemon/${pokemon.id}`, group: "Pokédex", keywords: String(pokemon.id) })),
 ...referenceSets.map(set => ({ title: set.name, detail: `${set.printedTotal} cards · ${set.series}`, href: setPageHref(set.id), group: "Collections" })),
 ...referenceCards.map(card => ({ title: card.name, detail: `${referenceSets.find(set => set.id === card.setId)?.name ?? "Misc"} · ${card.number}/${referenceSets.find(set => set.id === card.setId)?.printedTotal ?? ""}`, href: cardPageHref(card), group: "Cards", keywords: `${card.artist ?? ""} ${card.types.join(" ")} ${card.rarity ?? ""}` })),
];
export async function GET(request: Request) {
 const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
 if (query.length > 120) return Response.json({ error: "Search is limited to 120 characters." }, { status: 400 });
 const headers = { "Cache-Control": "no-store" };
 if (!query) return Response.json({ results: pages, passportsUnavailable: false }, { headers });
 let passportsUnavailable = false;
 let passports: SearchResult[] = [];
 try {
  passports = (await publicPassports(AbortSignal.any([request.signal, AbortSignal.timeout(2500)]))).map(passport => ({ title: passport.title, detail: `${passport.certifier} ${passport.certificationNumber} · Passport #${passport.tokenId}`, href: `/items/${passport.itemId}`, group: "Passports", keywords: `${passport.itemId} ${passport.tokenId}` }));
 } catch { passportsUnavailable = true; }
 return Response.json({ results: rankSearchResults([...pages, ...catalogue, ...passports], query), passportsUnavailable }, { headers });
}
