"use client";

import { useSearchParams } from "next/navigation";
import { CatalogSkeleton } from "@/features/shell/loading-skeleton";
import { catalogLanguage } from "@/features/reference/catalog-language";
import { CatalogToolbar } from "./catalog-toolbar";
import { CardCategoryNavigation } from "./card-category-navigation";
import { cardCategories } from "./card-categories";

export function PokemonCatalogSkeleton() {
	const params = useSearchParams();
	const category = params.get("category");
	const query = params.get("q") ?? "";
	const language = catalogLanguage(params.get("lang"));
	const subcategory = cardCategories.find((entry) => entry.id === params.get("subcategory")) ?? cardCategories[0];
	if (category === "pokedex" || category === "sealed") return <CatalogSkeleton variant={category} />;
	const sets = category === "sets";
	return <>
		<CatalogToolbar title={sets ? "Sets" : "Cards"} category={sets ? "sets" : "cards"} query={query} subcategory={sets ? undefined : subcategory.id} searchPlaceholder={sets ? "Search sets or series…" : undefined}>
			{!sets && <CardCategoryNavigation active={subcategory.id} query={query} language={language} />}
		</CatalogToolbar>
		<div className="mt-6"><CatalogSkeleton toolbar={false} variant={sets ? "sets" : "cards"} /></div>
	</>;
}
