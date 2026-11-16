import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { PokemonCatalogSkeleton } from "./pokemon-catalog-skeleton";
import { PokemonSectionResults, PokemonSealedContent } from "./pokemon-section-results";

export function PokemonSectionContent({ searchParams, category = "cards" }: {
 category?: string;
 searchParams: Promise<{ q?: string }>;
}) {
 if (category === "sealed") return <PokemonSealedContent />;
 return <LoadingBoundary fallback={<PokemonCatalogSkeleton category={category} />}>
  <PokemonSectionResults searchParams={searchParams} category={category} />
 </LoadingBoundary>;
}
