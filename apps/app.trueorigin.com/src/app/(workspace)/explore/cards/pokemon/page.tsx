import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import Link from "next/link";
import { CatalogFrame, CatalogSearch, CardList, Pagination, linkStyle } from "@/features/reference/catalog-ui";
import { normalizeSearch, paginate, pokemonSpecies, referenceCards, referenceSets, searchReferenceCards } from "@/features/reference/catalog";

export const metadata = { title: "Pokémon cards" };
type Props = { searchParams: Promise<{ q?: string; page?: string }> };

async function ExploreResults({ searchParams }: Props) {
 const params = await searchParams;
 const query = typeof params.q === "string" ? params.q : "";
 const result = paginate(searchReferenceCards(query), params.page);
 const species = query ? pokemonSpecies.filter((pokemon) => normalizeSearch(pokemon.name).includes(normalizeSearch(query))).slice(0, 8) : [];
 const sets = query ? referenceSets.filter((set) => normalizeSearch(set.name).includes(normalizeSearch(query))).slice(0, 8) : [];
 return <CatalogFrame title="Pokémon" description="Explore Pokémon cards by character or set, or search for a specific card reference.">
 <CatalogSearch query={query} placeholder="Search a Pokémon, card, or set…" />
 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Link href="/explore/pokemon/pokedex" className="group border border-white/15 p-6 hover:border-brand-accent/40"><p className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">Browse by Pokémon</p><h2 className="mt-3 text-xl">Choose a Pokémon. Find its cards.</h2><p className="mt-3 text-xs leading-6 text-white/40">{pokemonSpecies.length.toLocaleString("en-US")} Pokémon, grouped by generation.</p></Link><Link href="/explore/sets" className="group border border-white/15 p-6 hover:border-brand-accent/40"><p className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">Browse by set</p><h2 className="mt-3 text-xl">Explore the expansions.</h2><p className="mt-3 text-xs leading-6 text-white/40">{referenceSets.length} sets in the current English card catalog.</p></Link></div>
 <p className="text-xs leading-6 text-white/35">Currently available: Pokémon cards in English. {referenceCards.length.toLocaleString("en-US")} card references. Catalog entries describe cards, not individual owned copies.</p>
 {species.length > 0 && <section aria-labelledby="matching-pokemon"><h2 id="matching-pokemon" className="mb-3 text-sm text-white/60">Pokémon matching your search</h2><div className="flex flex-wrap gap-2">{species.map((pokemon) => <Link key={pokemon.id} href={`/explore/pokemon/${pokemon.id}`} className={linkStyle}>{pokemon.name} ↗</Link>)}</div></section>}
 {sets.length > 0 && <section aria-labelledby="matching-sets"><h2 id="matching-sets" className="mb-3 text-sm text-white/60">Sets matching your search</h2><div className="flex flex-wrap gap-2">{sets.map((set) => <Link key={set.id} href={`/explore/sets/${set.id}`} className={linkStyle}>{set.name} ↗</Link>)}</div></section>}
 <section aria-labelledby="cards-title"><h2 id="cards-title" className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50">{query ? "Matching cards" : "Browse cards"}</h2><CardList cards={result.items} /></section>
 <Pagination {...result} path="/explore/cards/pokemon" query={query} />
 <a href="https://github.com/PokemonTCG/pokemon-tcg-data" target="_blank" rel="noreferrer" className="inline-block text-[10px] text-white/30 hover:text-white">Card data: Pokémon TCG Data · English snapshot ↗</a>
 </CatalogFrame>;
}

export default function ExplorePage(props: Props) {
 return <LoadingBoundary fallback={<PageSkeleton variant="cards" />}><ExploreResults {...props} /></LoadingBoundary>;
}
