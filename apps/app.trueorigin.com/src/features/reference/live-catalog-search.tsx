"use client";

import { PokedexSearchField } from "@/features/pokemon/pokedex-search";

export function LiveCatalogSearch({ query, placeholder = "Search cards or sets…" }: { query: string; placeholder?: string }) {
 return <PokedexSearchField query={query} setQuery={() => {}} label={placeholder} />;
}
