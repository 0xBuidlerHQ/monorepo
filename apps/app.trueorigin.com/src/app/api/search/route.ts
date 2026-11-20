import { referenceCards, referenceSets, pokemonSpecies } from "@/features/reference/catalog";
import { cardPageHref, setPageHref } from "@/features/reference/set-relationships";
import { navigationItems } from "@/features/navigation/navigation-items";
import { rankSearchResults, type SearchResult } from "@/features/navigation/search-results";
import { publicPassports } from "@/server/passports/client";
import { cardArtwork } from "@/features/reference/card-artwork";
import { setArtwork } from "@/features/reference/set-artwork";

const pages: SearchResult[] = [
 ...navigationItems.filter(item => item.href !== "/scan").map(item => ({ title: item.name, detail: "Open page", href: item.href, group: "Pages", keywords: item.href === "/submit" ? "submit register" : "" })),
 { title: "Pokédex", detail: "Pokémon species", href: "/explore/pokemon/pokedex", group: "Pages", universe: "Pokémon" },
 { title: "Catalogue", detail: "Pokémon cards and collections", href: "/explore/pokemon/catalogue", group: "Pages", universe: "Pokémon" },
];
const catalogue: SearchResult[] = [
 ...pokemonSpecies.map(pokemon => ({ title: pokemon.name, detail: `#${String(pokemon.id).padStart(3, "0")} · Generation ${pokemon.generation}`, href: `/explore/pokemon/${pokemon.id}`, group: "Pokédex", keywords: String(pokemon.id), image: `/images/pokemon/${pokemon.id}.webp`, universe: "Pokémon" })),
 ...referenceSets.map(set => ({ title: set.name, detail: `${set.printedTotal} cards · ${set.series}`, href: setPageHref(set.id), group: "Collections", image: setArtwork[set.id]?.src, universe: "Pokémon" })),
 ...referenceCards.map(card => ({ title: card.name, detail: `${referenceSets.find(set => set.id === card.setId)?.name ?? "Misc"} · ${card.number}/${referenceSets.find(set => set.id === card.setId)?.printedTotal ?? ""}`, href: cardPageHref(card), group: "Cards", keywords: `${card.artist ?? ""} ${card.types.join(" ")} ${card.rarity ?? ""}`, image: cardArtwork[card.id]?.src, universe: "Pokémon" })),
];
const featured = catalogue.filter(result => result.group === "Collections" || ["/explore/pokemon/1", "/explore/pokemon/4", "/explore/pokemon/7", "/explore/pokemon/25", "/explore/catalogue/base-set/2", "/explore/catalogue/base-set/4", "/explore/catalogue/base-set/15"].includes(result.href));
export async function GET(request: Request) {
 const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
 if (query.length > 120) return Response.json({ error: "Search is limited to 120 characters." }, { status: 400 });
 const headers = { "Cache-Control": "no-store" };
 let passportsUnavailable = false;
 let passports: SearchResult[] = [];
 try {
  passports = (await publicPassports(AbortSignal.any([request.signal, AbortSignal.timeout(2500)]))).map(passport => ({ title: passport.title, detail: `${passport.certifier} ${passport.certificationNumber} · Passport #${passport.tokenId}`, href: `/passports/${passport.itemId}`, group: "Passports", keywords: `${passport.itemId} ${passport.tokenId}`, image: `/api/passports/${passport.itemId}/image` }));
 } catch { passportsUnavailable = true; }
 const results = query ? rankSearchResults([...pages, ...catalogue, ...passports], query) : [...featured, ...passports.slice(0, 6), ...pages].map(({ keywords: _keywords, ...result }) => result);
 return Response.json({ results, passportsUnavailable }, { headers });
}
