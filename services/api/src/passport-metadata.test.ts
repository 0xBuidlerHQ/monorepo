import assert from "node:assert/strict";
import { test } from "node:test";
import { createPassportIndex, type IndexedPassport } from "./passports/index.ts";
import { itemDisplayTitle, itemMetadataAttributes } from "@0xhq/api-client/passport-item";

const row: IndexedPassport = { itemId: `0x${"a".repeat(64)}`, contractAddress: `0x${"b".repeat(40)}`, tokenId: "1", metadataURI: "ipfs://test/metadata.json", issuer: "issuer", issuedTo: "owner", owner: "owner", transactionHash: "tx", issuedAt: 1 };
const item = { type: "card", schemaVersion: 1, universe: "pokemon", attributes: { subject: "Venusaur", set: "Base Set", number: "15", total: "102" } };
const structured = { name: itemDisplayTitle(item), image: "ipfs://image/passport.svg", attributes: [...itemMetadataAttributes(item), { trait_type: "Certifier", value: "PSA" }, { trait_type: "Certification number", value: "12345678" }, { trait_type: "Grade", value: "9" }], trueorigin: { schema_version: "4", item_id: row.itemId, chain_id: 31337, item } };

test("public metadata validates versioned item titles and traits and reads future types", async t => {
 t.mock.method(globalThis, "fetch", async () => Response.json(row));
 const read = (document: unknown) => createPassportIndex("http://127.0.0.1:1", async () => Buffer.from(JSON.stringify(document))).record(row.itemId);
 const current = await read(structured);
 assert.deepEqual(current.item, item);
 const future = { type: "watch", schemaVersion: 1, universe: "watches", attributes: { brand: "Rolex", diameterMm: 40 } };
 const unknown = await read({ ...structured, name: "Rolex — Submariner", trueorigin: { ...structured.trueorigin, item: future } });
 assert.deepEqual(unknown.item, future);
 assert.equal(unknown.title, "Rolex — Submariner");
 assert.equal(current.title, "Venusaur — Base Set #15/102");
 for (const document of [
  { ...structured, name: "Edited name" },
  { ...structured, trueorigin: { ...structured.trueorigin, item: undefined } },
  { ...structured, attributes: structured.attributes.map(attribute => attribute.trait_type === "Set" ? { ...attribute, value: "Different set" } : attribute) },
  { ...structured, trueorigin: { ...structured.trueorigin, item: { ...item, universe: "invalid" } } },
 ]) await assert.rejects(read(document), /metadata is invalid/);
});
