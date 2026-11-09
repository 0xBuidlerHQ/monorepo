import data from "./evolutions.json";
import pokedex from "./pokedex.json";

const species = new Map(pokedex.pokemon.map((pokemon) => [pokemon.id, pokemon]));
const relations = new Map(data.species.map((entry) => [entry.id, entry]));
const children = new Map<number, number[]>();
for (const entry of data.species) {
	if (entry.parentId !== null) children.set(entry.parentId, [...(children.get(entry.parentId) ?? []), entry.id]);
}

export function getEvolutionRelations(id: number) {
	const parentId = relations.get(id)?.parentId;
	return {
		parent: parentId ? species.get(parentId) : undefined,
		children: (children.get(id) ?? []).flatMap((childId) => {
			const child = species.get(childId);
			return child ? [child] : [];
		}),
	};
}

export function getEvolutionRoot(id: number) {
	let root = id;
	while (relations.get(root)?.parentId) root = relations.get(root)?.parentId as number;
	return species.get(root);
}
