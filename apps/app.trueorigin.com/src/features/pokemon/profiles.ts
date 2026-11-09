import "server-only";
import data from "./profiles.json";

type PokemonProfile = {
	genus: string | null;
	heightMeters: number;
	weightKg: number;
	types: string[];
	description: string | null;
};

export function findPokemonProfile(id: number) {
	return (data.pokemon as Record<string, PokemonProfile>)[String(id)];
}
