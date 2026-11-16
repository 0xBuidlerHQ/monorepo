import assert from "node:assert/strict";
import { test } from "node:test";
import { cardCollectionId, setPageHref, cardPageHref } from "../reference/set-relationships.ts";
import { breadcrumbTrail, needsBreadcrumbDetail } from "./breadcrumb-trail.ts";

const labels = (
	path: string,
	query = "",
	detail?: Parameters<typeof breadcrumbTrail>[2],
) =>
	breadcrumbTrail(path, new URLSearchParams(query), detail).map(
		(item) => item.label,
	);

test("Pokédex profiles include clickable ancestors and a readable current name", () => {
	const trail = breadcrumbTrail("/explore/pokemon/2", new URLSearchParams(), {
		name: "Ivysaur",
	});
	assert.deepEqual(trail, [
		{ label: "Explore", href: "/explore" },
		{ label: "Pokémon", href: "/explore/pokemon" },
		{ label: "Pokédex", href: "/explore/pokemon/pokedex" },
		{ label: "Ivysaur", href: "/explore/pokemon/2" },
	]);
	assert.equal(needsBreadcrumbDetail("/explore/pokemon/2"), true);
	assert.equal(needsBreadcrumbDetail("/explore/pokemon/pokedex"), false);
	assert.equal(needsBreadcrumbDetail("/explore/catalogue/pokemon"), false);
});

test("query-based categories and subcategories update without adding search/filter parameters", () => {
	assert.deepEqual(labels("/explore/pokemon", "category=pokedex&q=pika"), [
		"Explore",
		"Pokémon",
		"Pokédex",
	]);
	assert.deepEqual(labels("/explore/pokemon", "category=sets"), [
		"Explore",
		"Pokémon",
		"Catalogue",
	]);
	assert.deepEqual(labels("/explore/pokemon", "category=sealed"), [
		"Explore",
		"Pokémon",
		"Sealed",
	]);
	assert.deepEqual(labels("/explore/pokemon", "subcategory=promos"), [
		"Explore",
		"Pokémon",
		"Catalogue",
	]);
	assert.deepEqual(
		labels("/explore/pokemon", "category=unknown&subcategory=unknown"),
		["Explore", "Pokémon", "Catalogue"],
	);
});

test("legacy language parameters keep English catalogue links and collection hierarchy", () => {
	const card = breadcrumbTrail(
		"/explore/catalogue/base-set/4",
		new URLSearchParams("lang=fr"),
		{ name: "Charizard", setName: "Base Set", setId: "base-set" },
	);
	assert.deepEqual(
		card.map((item) => item.label),
		["Explore", "Pokémon", "Catalogue", "Base Set", "Charizard"],
	);
	assert.equal(card[2].href, "/explore/pokemon/catalogue");
	assert.equal(card[3].href, "/explore/catalogue/collections/base-set");
	assert.equal(card[4].href, "/explore/catalogue/base-set/4");
	assert(
		card
			.slice(1)
			.every(
				(item) =>
					new URL(item.href, "https://example.test").searchParams.get(
						"lang",
					) === null,
			),
	);
	assert.deepEqual(
		labels("/explore/sets/me55", "section=classic", {
			name: "30th Celebration",
		}),
		["Explore", "Pokémon", "Catalogue", "30th Celebration", "Classic Collection"],
	);
	const classic = breadcrumbTrail(
		"/explore/catalogue/me55c/1",
		new URLSearchParams(),
		{ name: "Mew", setName: "30th Celebration", setId: "me55" },
	);
	assert.deepEqual(classic.map(item => item.label), ["Explore", "Pokémon", "Catalogue", "30th Celebration", "Mew"]);
	assert.equal(classic[3].href, "/explore/catalogue/collections/me55");
	assert.equal(classic[4].href, "/explore/catalogue/me55c/1");
});

test("main pages and unresolved records retain valid breadcrumbs", () => {
	for (const [path, label] of [
		["/explore", "Explore"],
		["/feed", "Feed"],
		["/registry", "Registry"],
		["/collection", "Collection"],
		["/submit", "Submit"],
		["/verify", "Verify"],
		["/transfers", "Transfers"],
		["/scan", "Scan"],
	])
		assert.deepEqual(labels(path), [label]);
	assert.deepEqual(labels("/trading", "mode=sell"), ["Trading", "Sell"]);
	assert.deepEqual(labels(`/items/0x${"a".repeat(64)}`), [
		"Registry",
		"Passport",
	]);
	assert.deepEqual(labels("/explore/pokemon/2"), [
		"Explore",
		"Pokémon",
		"Pokédex",
		"Pokémon #2",
	]);
	assert.deepEqual(labels("/one-piece"), ["Explore", "One Piece"]);
	assert.deepEqual(labels("/"), ["Explore"]);
});


test("collections and Misc sit under Catalogue while individual card URLs stay stable", () => {
 assert.deepEqual(labels("/explore/catalogue/collections/base-set", "", {name:"Base Set"}), ["Explore","Pokémon","Catalogue","Base Set"]);
 assert.equal(needsBreadcrumbDetail("/explore/catalogue/collections/base-set"),true);
 assert.deepEqual(labels("/explore/catalogue/collections/misc"), ["Explore","Pokémon","Catalogue","Misc"]);
 const card = breadcrumbTrail("/explore/catalogue/misc/ungrouped-card", new URLSearchParams("lang=fr"), {name:"Promo"});
 assert.deepEqual(card.map(item=>item.label), ["Explore","Pokémon","Catalogue","Misc","Promo"]);
 assert.equal(card[3].href,"/explore/catalogue/collections/misc");
 assert.equal(card[4].href,"/explore/catalogue/misc/ungrouped-card");
});

test("only unnamed or unknown collections use Misc, while Classic Collection stays in its parent", () => {
 const sets = [{id:"base-set"},{id:"me55"},{id:"me55c"}];
 assert.equal(cardCollectionId("base-set",sets),"base-set");
 assert.equal(cardCollectionId("me55c",sets),"me55");
 assert.equal(cardCollectionId("unidentified",sets),"misc");
 assert.equal(cardCollectionId(null,sets),"misc");
 assert.equal(setPageHref("me55c"),"/explore/catalogue/collections/me55?section=classic");
});


test("Pokémon sections have dedicated routes", () => {
 for (const [slug, name] of [["pokedex", "Pokédex"], ["catalogue", "Catalogue"], ["sealed", "Sealed"]]) {
  const path = `/explore/pokemon/${slug}`;
  const trail = breadcrumbTrail(path, new URLSearchParams());
  assert.deepEqual(trail.map(item => item.label), ["Explore", "Pokémon", name]);
  assert.equal(trail.at(-1)?.href, path);
  assert.equal(needsBreadcrumbDetail(path), false);
 }
});


test("unresolved card breadcrumbs do not add a duplicate Pokémon link", () => {
 const path = "/explore/catalogue/base-set/4";
 const pending = breadcrumbTrail(path, new URLSearchParams());
 assert.deepEqual(pending.map(item => item.label), ["Explore", "Pokémon", "Catalogue", "Card"]);
 assert.equal(new Set(pending.map(item => item.href)).size, pending.length);
 const resolved = breadcrumbTrail(path, new URLSearchParams(), {name: "Charizard", setId: "base-set", setName: "Base Set"});
 assert.deepEqual(resolved.slice(-2).map(item => item.label), ["Base Set", "Charizard"]);
 assert.equal(new Set(resolved.map(item => item.href)).size, resolved.length);
});

test("card URLs use set and printed number as separate segments", () => {
 assert.equal(cardPageHref({setId:"base-set",number:"2"}),"/explore/catalogue/base-set/2");
 assert.equal(cardPageHref({setId:"promos",number:"SV001"}),"/explore/catalogue/promos/SV001");
 assert.equal(needsBreadcrumbDetail("/explore/catalogue/base-set/2"),true);
});


test("selected printings extend card breadcrumbs and the card link clears the printing", () => {
 const path = "/explore/catalogue/base-set/2";
 const detail = {name:"Blastoise",setId:"base-set",setName:"Base Set"};
 for (const [printing,label] of [["first-edition","First Edition"],["shadowless","Shadowless"],["unlimited","Unlimited"]]) {
  const trail = breadcrumbTrail(path,new URLSearchParams({printing}),detail);
  assert.deepEqual(trail.slice(-2), [{label:"Blastoise",href:path},{label,href:`${path}?printing=${printing}`}]);
  assert.equal(breadcrumbTrail(path,new URLSearchParams({printing})).at(-1)?.label,label);
 }
 assert.equal(breadcrumbTrail(path,new URLSearchParams(),detail).at(-1)?.label,"Blastoise");
 assert.equal(breadcrumbTrail(path,new URLSearchParams("printing=unknown"),detail).at(-1)?.label,"Blastoise");
 assert.equal(breadcrumbTrail("/explore/pokemon/catalogue",new URLSearchParams("printing=first-edition")).at(-1)?.label,"Catalogue");
});
