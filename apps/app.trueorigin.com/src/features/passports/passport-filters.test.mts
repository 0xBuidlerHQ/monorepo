import assert from "node:assert/strict";
import { test } from "node:test";
import type { PublicPassport } from "@0xhq/api-client/types";
import { emptyPassportFilters, filterPassports } from "./passport-filters.ts";

function passport(
	id: string,
	item: PublicPassport["item"],
	certifier: PublicPassport["certifier"],
): PublicPassport {
	return {
		itemId: `0x${id.repeat(64)}`,
		item,
		title: "",
		certifier,
		certificationNumber: `1234567${id}`,
		grade: "9",
		chainId: 31337,
		contractAddress: `0x${"a".repeat(40)}`,
		tokenId: id,
		metadataURI: "ipfs://metadata",
		imageURI: null,
		transactionHash: "0xtx",
		issuedTo: "0xowner",
		issuedAt: "2026-11-20T12:00:00Z",
		inspection: {
			status: "approved",
			approvedAt: null,
			revocationSupported: false,
		},
	};
}
const passports = [
	passport(
		"1",
		{
			type: "card",
			schemaVersion: 1,
			universe: "pokemon",
			attributes: {
				subject: "Venusaur",
				sealed: false,
				set: "Base Set",
				number: "15",
				total: "102",
			},
		},
		"PSA",
	),
	passport(
		"2",
		{
			type: "book",
			schemaVersion: 1,
			universe: "pokemon",
			attributes: { title: "Pokémon Adventures", author: "Hidenori Kusaka" },
		},
		"CGC",
	),
	passport(
		"3",
		{
			type: "box",
			schemaVersion: 1,
			universe: "magic",
			attributes: {
				name: "Collector Booster Box",
				format: "Booster box",
				sealed: true,
			},
		},
		"PSA",
	),
];

test("passport filters combine universe, physical object type, and certifier", () => {
	assert.deepEqual(filterPassports(passports, emptyPassportFilters), passports);
	assert.deepEqual(
		filterPassports(passports, {
			...emptyPassportFilters,
			universe: "pokemon",
		}),
		passports.slice(0, 2),
	);
	assert.deepEqual(
		filterPassports(passports, {
			q: "",
			sealed: "",
			universe: "pokemon",
			type: "book",
			certifier: "CGC",
		}),
		[passports[1]],
	);
	assert.deepEqual(
		filterPassports(passports, {
			q: "",
			sealed: "",
			universe: "pokemon",
			type: "book",
			certifier: "PSA",
		}),
		[],
	);
	assert.deepEqual(
		filterPassports(passports, { ...emptyPassportFilters, type: "unknown" }),
		[],
	);
});

test("search finds accented names, type-specific attributes, and full identifiers", () => {
	for (const [q, expected] of [
		["pokemon adventures", 1],
		["kusaka", 1],
		["venusaur base", 0],
		["12345673", 2],
		[passports[0].itemId, 0],
		["MAGIC booster", 2],
	] as const) {
		assert.deepEqual(
			filterPassports(passports, { ...emptyPassportFilters, q }),
			[passports[expected]],
		);
	}
	assert.deepEqual(
		filterPassports(passports, { ...emptyPassportFilters, q: "   " }),
		passports,
	);
	assert.deepEqual(
		filterPassports(passports, {
			...emptyPassportFilters,
			q: "Venusaur",
			certifier: "CGC",
		}),
		[],
	);
});

test("seal filters work across types and do not infer unsealed status", () => {
	assert.deepEqual(
		filterPassports(passports, { ...emptyPassportFilters, sealed: "true" }),
		[passports[2]],
	);
	assert.deepEqual(
		filterPassports(passports, { ...emptyPassportFilters, sealed: "false" }),
		[passports[0]],
	);
	assert.deepEqual(
		filterPassports(passports, {
			...emptyPassportFilters,
			sealed: "true",
			type: "card",
		}),
		[],
	);
	const sealedCard = {
		...passports[0],
		item: {
			...passports[0].item,
			attributes: { ...passports[0].item.attributes, sealed: true },
		},
	};
	assert.deepEqual(
		filterPassports([sealedCard, passports[2]], {
			...emptyPassportFilters,
			sealed: "true",
		}),
		[sealedCard, passports[2]],
	);
});
