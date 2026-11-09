import "server-only";
import snapshot from "./pokemon-cards.json";
import frenchSnapshot from "./pokemon-cards.fr.json";
import type { CatalogLanguage } from "./catalog-language";
import corrections from "./card-corrections.json";
import pokedex from "@/features/pokemon/pokedex.json";

export interface ReferenceSet { id: string; name: string; series: string; printedTotal: number; releaseDate: string | null; language?: CatalogLanguage }
export interface ReferenceCard { id: string; name: string; setId: string; number: string; supertype: string; subtypes: string[]; types: string[]; hp: string | null; rarity: string | null; artist: string | null; evolvesFrom: string | null; pokemonIds: number[]; language?: CatalogLanguage }
const source = snapshot as { sets: ReferenceSet[]; cards: ReferenceCard[] };
const enabledSetIds = new Set(["base1", "me55", "me55c"]);
export const referenceSets = source.sets.filter((set) => enabledSetIds.has(set.id)).sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || a.name.localeCompare(b.name));
const cardCorrections: Record<string, { rarity: string; source: string; reason: string; verifiedAt: string }> = corrections;
export const referenceCards = source.cards.filter((card) => enabledSetIds.has(card.setId)).map((card) => {
 const correction = cardCorrections[card.id];
 return correction ? { ...card, rarity: correction.rarity } : card;
});
export const pokemonSpecies = pokedex.pokemon;
const french = frenchSnapshot as { sets: ReferenceSet[]; cards: ReferenceCard[] };
export const getReferenceSets = (language: CatalogLanguage = "en") => language === "fr" ? french.sets : referenceSets;
const localizedSetsById = new Map(french.sets.map((set) => [set.id, set]));
const localizedCardsById = new Map(french.cards.map((card) => [card.id, card]));
const setsById = new Map(referenceSets.map((set) => [set.id, set]));
const cardsById = new Map(referenceCards.map((card) => [card.id, card]));
export const findReferenceCard = (id: string, language: CatalogLanguage = "en") => language === "fr" ? localizedCardsById.get(id) : cardsById.get(id);
export const findReferenceSet = (id: string, language: CatalogLanguage = "en") => language === "fr" ? localizedSetsById.get(id) : setsById.get(id);
export const findPokemon = (id: string) => pokemonSpecies.find((pokemon) => String(pokemon.id) === id);

export function normalizeSearch(value: string) {
 return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9♀♂]/g, "");
}

export function searchReferenceCards(query = "", options: { setId?: string; pokemonId?: number; language?: CatalogLanguage } = {}) {
 const terms = query.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
 return (options.language === "fr" ? french.cards : referenceCards).filter((card) => {
  if (options.setId && card.setId !== options.setId) return false;
  if (options.pokemonId && !card.pokemonIds.includes(options.pokemonId)) return false;
  const set = findReferenceSet(card.setId, options.language);
  const text = normalizeSearch(`${card.name} ${card.number}/${set?.printedTotal ?? ""} ${set?.name ?? ""} ${set?.series ?? ""}`);
  return terms.every((term) => text.includes(term));
 }).sort((a, b) => {
  const dateOrder = (setsById.get(b.setId)?.releaseDate ?? "").localeCompare(setsById.get(a.setId)?.releaseDate ?? "");
  return dateOrder || a.setId.localeCompare(b.setId) || a.number.localeCompare(b.number, "en", { numeric: true });
 });
}

export function paginate<T>(items: T[], pageValue?: string, pageSize = 48) {
 const pages = Math.max(1, Math.ceil(items.length / pageSize));
 const requested = Number(pageValue);
 const page = Math.min(pages, Math.max(1, Number.isSafeInteger(requested) ? requested : 1));
 return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pages, total: items.length };
}
