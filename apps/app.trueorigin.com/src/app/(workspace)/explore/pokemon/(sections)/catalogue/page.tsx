import { PokemonSectionContent } from "@/features/pokemon/pokemon-section-content";
export const metadata = { title: "Catalogue · Pokémon" };
export default function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
 return <PokemonSectionContent category="cards" searchParams={searchParams} />;
}
