import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import Link from "next/link";
import { normalizeSearch, referenceCards, referenceSets } from "@/features/reference/catalog";
import { CatalogFrame, CatalogSearch } from "@/features/reference/catalog-ui";

export const metadata = { title: "Pokémon Sets" };
type Props = { searchParams: Promise<{ q?: string }> };
async function Results({ searchParams }: Props) {
 const params = await searchParams;
 const query = typeof params.q === "string" ? params.q : "";
 const sets = referenceSets.filter((set) => set.id !== "me55c" && normalizeSearch(`${set.name} ${set.series}`).includes(normalizeSearch(query)));
 const counts = new Map<string, number>();
 for (const card of referenceCards) counts.set(card.setId, (counts.get(card.setId) ?? 0) + 1);
 return <CatalogFrame title="Browse by set" description="Explore Pokémon expansions and their English card lists, from the original sets to later releases."><CatalogSearch query={query} placeholder="Search sets or series…" /><p role="status" className="font-mono text-[10px] text-white/35">{sets.length} sets</p>{!sets.length && <p className="text-sm text-white/40">No matching sets. Try another search.</p>}<ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{sets.map((set) => <li key={set.id}><Link href={`/explore/sets/${set.id}`} className="block h-full border border-white/10 p-5 hover:border-brand-accent/40"><p className="font-mono text-[9px] uppercase tracking-widest text-white/35">{set.series}</p><h2 className="mt-3 text-lg">{set.name}</h2><p className="mt-3 text-xs text-white/40">{set.releaseDate} · {counts.get(set.id) ?? 0} cataloged cards</p></Link></li>)}</ul></CatalogFrame>;
}
export default function Page(props: Props) { return <LoadingBoundary fallback={<PageSkeleton variant="sets" />}><Results {...props} /></LoadingBoundary>; }
