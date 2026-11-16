import { PokemonSectionContent } from "@/features/pokemon/pokemon-section-content";
export const metadata = { title: "Sealed · Pokémon" };
export default function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
 return <PokemonSectionContent category="sealed" searchParams={searchParams} />;
}
