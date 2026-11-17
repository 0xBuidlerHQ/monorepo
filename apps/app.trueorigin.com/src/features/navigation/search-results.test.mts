import assert from "node:assert/strict";
import { test } from "node:test";
import { rankSearchResults } from "./search-results.ts";
const entries = [
 { title: "Pikachu", detail: "#025 · Generation 1", href: "/explore/pokemon/25", group: "Pokédex", keywords: "25" },
 { title: "Pikachu", detail: "Base Set · 58/102", href: "/explore/catalogue/base-set/58", group: "Cards" },
 { title: "Charizard", detail: "Base Set · 4/102", href: "/explore/catalogue/base-set/4", group: "Cards" },
 { title: "Charizard passport", detail: "PSA 12345678 · Passport #1", href: "/items/test", group: "Passports" },
];
test("search distinguishes species, catalogue cards, and registered copies", () => {
 assert.deepEqual(rankSearchResults(entries, "pikachu").map(row => row.group), ["Pokédex", "Cards"]);
 assert.equal(rankSearchResults(entries, "12345678")[0]?.href, "/items/test");
 assert.equal(rankSearchResults(entries, "base set 4/102")[0]?.title, "Charizard");
});
test("search normalizes accents, ranks exact names first, caps groups, and omits internal keywords", () => {
 const extra = Array.from({length: 10}, (_, i) => ({title: `Pikachu ${i}`, detail: "Pokémon", href: `/${i}`, group: "Cards", keywords: "private-index"}));
 const results = rankSearchResults([...extra, entries[1]], "pikachu");
 assert.equal(results.length, 6); assert.equal(results[0].title, "Pikachu");
 assert(!("keywords" in results[0]));
 assert.equal(rankSearchResults(extra, "pokemon").length, 6);
 assert.deepEqual(rankSearchResults(entries, "  "), []);
 assert.deepEqual(rankSearchResults(entries, "no-such-item"), []);
});
