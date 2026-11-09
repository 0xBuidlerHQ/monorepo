import { LoadingBoundary } from "@/features/shell/loading-boundary";
import Image from "next/image";
import { Suspense } from "react";
import { UniverseTitle } from "@/features/reference/universe-title";
import { CatalogSkeleton } from "@/features/shell/loading-skeleton";
import { PokemonCatalogSkeleton } from "@/features/pokemon/pokemon-catalog-skeleton";
import { pokemonCategories } from "@/features/pokemon/categories";
import { PokemonCategoryNavigation, PokemonCategoryTabs } from "@/features/pokemon/pokemon-category-navigation";
import { PokemonCatalog } from "@/features/pokemon/pokemon-catalog";

export const metadata = { title: "Pokémon" };

export default function PokemonExplorePage({ searchParams }: { searchParams: Promise<{ lang?: string; mode?: string; category?: string; subcategory?: string; q?: string; page?: string }> }) {
	return (
		<section aria-labelledby="pokemon-title">
			<UniverseTitle name="Pokémon" titleId="pokemon-title">
				<Image src="/pika.png" alt="Pikachu" width={120} height={120} className="size-[clamp(48px,9vw,120px)] shrink-0 object-contain" />
			</UniverseTitle>

			<div className="mt-9">
				<Suspense fallback={<PokemonCategoryNavigation categories={pokemonCategories} activeCategory="cards" />}>
					<PokemonCategoryTabs />
				</Suspense>
				<div className="pt-6">
					<LoadingBoundary fallback={<Suspense fallback={<CatalogSkeleton />}><PokemonCatalogSkeleton /></Suspense>}>
						<PokemonCatalog searchParams={searchParams} />
					</LoadingBoundary>
				</div>
			</div>
		</section>
	);
}
