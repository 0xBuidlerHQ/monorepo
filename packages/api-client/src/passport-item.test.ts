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
	type: "trading-card",
	schemaVersion: 1,
	category: "pokemon",
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
test("issuance validates schema versions, category, field types and cross-field requirements", () => {
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
		{ ...item, category: "unknown" },
		{ ...item, attributes: { ...item.attributes, subject: "" } },
		{ ...item, attributes: { ...item.attributes, set: "" } },
		{ ...item, attributes: { ...item.attributes, number: "" } },
		{ ...item, attributes: { ...item.attributes, subject: 42 } },
		{ ...item, attributes: { ...item.attributes, subject: "bad\ntext" } },
		{ ...item, attributes: { ...item.attributes, subject: "a".repeat(101) } },
		{ ...item, attributes: { ...item.attributes, mystery: "no" } },
		{ category: "pokemon", subject: "Legacy flat shape" },
	])
		assert.throws(() => parsePassportItem(value));
});
test("readers render unknown types and versions without assuming card fields", () => {
	const watch = {
		type: "watch",
		schemaVersion: 2,
		category: "watches",
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
