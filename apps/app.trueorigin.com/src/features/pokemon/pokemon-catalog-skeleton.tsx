import { getReferenceSets } from "@/features/reference/catalog";
import { PokemonCollectionBrowser } from "./pokemon-category-browser";
import { Pokedex } from "./pokedex";
export function PokemonCatalogSkeleton({ category = "cards" }: { category?: string }) {
 if (category === "pokedex") return <Pokedex embedded />;
 return <PokemonCollectionBrowser collections={[]} series={[...new Set(getReferenceSets().map(set => set.series))]} loading />;
}
