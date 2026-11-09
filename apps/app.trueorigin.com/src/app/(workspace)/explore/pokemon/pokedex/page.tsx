import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import { Pokedex } from "@/features/pokemon/pokedex";

export const metadata = { title: "Pokédex" };
type Props = { searchParams: Promise<{ q?: string }> };
async function PokemonResults({ searchParams }: Props) {
 const params = await searchParams;
 const query = typeof params.q === "string" ? params.q : "";
 return <Pokedex key={query} initialQuery={query} />;
}
export default function Page(props: Props) {
 return <LoadingBoundary fallback={<PageSkeleton variant="pokedex" />}><PokemonResults {...props} /></LoadingBoundary>;
}
