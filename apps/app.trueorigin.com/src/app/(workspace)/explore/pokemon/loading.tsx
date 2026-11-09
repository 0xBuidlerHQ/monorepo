import Image from "next/image";
import { Suspense } from "react";
import { UniverseTitle } from "@/features/reference/universe-title";
import { pokemonCategories } from "@/features/pokemon/categories";
import { PokemonCategoryNavigation, PokemonCategoryTabs } from "@/features/pokemon/pokemon-category-navigation";
import { PokemonCatalogSkeleton } from "@/features/pokemon/pokemon-catalog-skeleton";
import { CatalogSkeleton } from "@/features/shell/loading-skeleton";

export default function Loading() {
	return <section>
		<UniverseTitle name="Pokémon" titleId="pokemon-loading-title"><Image src="/pika.png" alt="Pikachu" width={120} height={120} className="size-[clamp(48px,9vw,120px)] shrink-0 object-contain" /></UniverseTitle>
		<div className="mt-9"><Suspense fallback={<PokemonCategoryNavigation categories={pokemonCategories} activeCategory="cards" />}><PokemonCategoryTabs /></Suspense><div className="pt-6"><Suspense fallback={<CatalogSkeleton />}><PokemonCatalogSkeleton /></Suspense></div></div>
	</section>;
}
