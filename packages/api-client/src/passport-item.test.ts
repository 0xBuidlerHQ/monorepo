import assert from "node:assert/strict";
import { test } from "node:test";
import {
	getItemSchema,
	itemAttributeDetails,
	itemDisplayTitle,
	itemMetadataAttributes,
	parsePassportItem,
	passportDisplayTitle,
	readPassportItem,
} from "./passport-item.ts";

const item = {
	type: "card",
	schemaVersion: 1,
	universe: "pokemon",
	attributes: {
		subject: "Venusaur",
		set: "Base Set",
		number: "15",
		total: "102",
	},
};
test("one schema drives short, compact and full titles and ordered display fields", () => {
	assert.equal(itemDisplayTitle(item, "short"), "Venusaur");
	assert.equal(itemDisplayTitle(item, "compact"), "Venusaur — Base Set");
	assert.equal(itemDisplayTitle(item), "Venusaur — Base Set #15/102");
	assert.equal(
		passportDisplayTitle({ item, title: "Ignored" }),
		"Venusaur — Base Set #15/102",
	);
	assert.deepEqual(
		itemAttributeDetails(item).map((field) => field.label),
		["Subject", "Set", "Card number", "Printed total"],
	);
	assert.equal(itemMetadataAttributes(item)[0].value, "Pokémon");
	assert.equal(
		itemDisplayTitle({
			...item,
			attributes: { ...item.attributes, number: "TG01", total: "TG30" },
		}),
		"Venusaur — Base Set #TG01/TG30",
	);
});
test("issuance validates schema versions, universe, field types and cross-field requirements", () => {
	assert.deepEqual(
		parsePassportItem({
			...item,
			attributes: { ...item.attributes, subject: " Venusaur " },
		}),
		item,
	);
	for (const value of [
		null,
		[],
		{ ...item, type: "watch" },
		{ ...item, schemaVersion: 2 },
		{ ...item, universe: "unknown" },
		{ ...item, attributes: { ...item.attributes, subject: "" } },
		{ ...item, attributes: { ...item.attributes, set: "" } },
		{ ...item, attributes: { ...item.attributes, number: "" } },
		{ ...item, attributes: { ...item.attributes, subject: 42 } },
		{ ...item, attributes: { ...item.attributes, subject: "bad\ntext" } },
		{ ...item, attributes: { ...item.attributes, subject: "a".repeat(101) } },
		{ ...item, attributes: { ...item.attributes, mystery: "no" } },
		{ universe: "pokemon", subject: "Legacy flat shape" },
	])
		assert.throws(() => parsePassportItem(value));
});
test("readers render unknown types and versions without assuming card fields", () => {
	const watch = {
		type: "watch",
		schemaVersion: 2,
		universe: "watches",
		attributes: { brand: "Rolex", caseDiameterMm: 40, waterResistant: true },
	};
	assert.deepEqual(readPassportItem(watch), watch);
	assert.equal(getItemSchema(watch), undefined);
	assert.equal(
		passportDisplayTitle({ item: watch, title: "Rolex — Submariner" }),
		"Rolex — Submariner",
	);
	assert.deepEqual(itemAttributeDetails(watch), [
		{ label: "brand", value: "Rolex" },
		{ label: "case Diameter Mm", value: "40" },
		{ label: "water Resistant", value: "Yes" },
	]);
	assert.throws(() =>
		readPassportItem({ ...watch, attributes: { nested: {} } }),
	);
	assert.throws(() =>
		readPassportItem({ ...watch, attributes: { size: Infinity } }),
	);
	assert.deepEqual(
		readPassportItem({ ...item, schemaVersion: 9 }).schemaVersion,
		9,
	);
});

test("universe is independent of object type and metadata includes both", () => {
	const book = parsePassportItem({
		type: "book",
		schemaVersion: 1,
		universe: "pokemon",
		attributes: {
			title: "Pokémon Adventures",
			author: "Hidenori Kusaka",
			isbn: "9781421530543",
		},
	});
	assert.equal(itemDisplayTitle(book, "short"), "Pokémon Adventures");
	assert.equal(itemDisplayTitle(book), "Pokémon Adventures — Hidenori Kusaka");
	assert.deepEqual(itemMetadataAttributes(book).slice(0, 2), [
		{ trait_type: "Universe", value: "Pokémon" },
		{ trait_type: "Type", value: "Book" },
	]);
	const sealed = parsePassportItem({
		type: "box",
		schemaVersion: 1,
		universe: "magic",
		attributes: {
			name: "Collector Booster Box",
			set: "Foundations",
			format: "Booster box",
		},
	});
	assert.equal(itemDisplayTitle(sealed), "Collector Booster Box — Foundations");
	assert.deepEqual(
		itemAttributeDetails(sealed).map((field) => field.label),
		["Name", "Set", "Product format"],
	);
	for (const invalid of [
		{ ...book, attributes: { title: "Missing author" } },
		{ ...book, attributes: { ...book.attributes, number: "15" } },
		{ ...sealed, attributes: { name: "Missing format" } },
		{ ...sealed, universe: "unknown" },
		{
			type: "card",
			schemaVersion: 1,
			category: "pokemon",
			attributes: item.attributes,
		},
	])
		assert.throws(() => parsePassportItem(invalid));
});

test("factory seal is a boolean attribute independent of object type", () => {
	for (const source of [
		item,
		{
			type: "book",
			schemaVersion: 1,
			universe: "pokemon",
			attributes: { title: "Guide", author: "Author" },
		},
		{
			type: "box",
			schemaVersion: 1,
			universe: "pokemon",
			attributes: { name: "Base Set", format: "Booster box" },
		},
	]) {
		for (const sealed of [true, false]) {
			const parsed = parsePassportItem({
				...source,
				attributes: { ...source.attributes, sealed },
			});
			assert.equal(parsed.attributes.sealed, sealed);
			assert.ok(
				itemMetadataAttributes(parsed).some(
					(trait) =>
						trait.trait_type === "Factory sealed" && trait.value === sealed,
				),
			);
			assert.ok(
				itemAttributeDetails(parsed).some(
					(field) =>
						field.label === "Factory sealed" &&
						field.value === (sealed ? "Yes" : "No"),
				),
			);
		}
		assert.equal(parsePassportItem(source).attributes.sealed, undefined);
		assert.throws(() =>
			parsePassportItem({
				...source,
				attributes: { ...source.attributes, sealed: "true" },
			}),
		);
	}
	assert.throws(() =>
		parsePassportItem({
			type: "sealed",
			schemaVersion: 1,
			universe: "pokemon",
			attributes: { name: "Box", format: "Booster box" },
		}),
	);
});
