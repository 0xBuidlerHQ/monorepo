"use client";
import { PokedexSearchField } from "./pokedex-search";
export function PokemonSectionSearch({ category }: { category: string }) {
 const label = category === "pokedex" ? "Search Pokémon" : category === "sealed" ? "Search sealed products" : "Search collections or cards";
 return <PokedexSearchField query="" setQuery={() => {}} label={label} />;
}
