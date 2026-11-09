import pokedex from "./pokedex.json";

// Original-resolution artwork, WebP quality 85 with full alpha quality.
// Source: https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
export const pokemonArtwork: Record<number, string> = Object.fromEntries(
	pokedex.pokemon.map(({ id }) => [id, `/images/pokemon/${id}.webp`]),
);
