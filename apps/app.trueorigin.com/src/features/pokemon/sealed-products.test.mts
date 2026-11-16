import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { sealedProducts, findSealedProduct, findSealedPrinting, documentedPrintingCount, sealedPrintingHref, searchSealedProducts } from "./sealed-products.ts";

test("Base Set keeps seven product identities, independent of their printings", () => {
 assert.equal(sealedProducts.length, 7);
 assert.equal(new Set(sealedProducts.map(product => product.id)).size, 7);
 assert.ok(sealedProducts.every(product => product.setId === "base-set" && product.languageCode === "en"));
 const box = findSealedProduct("base-set-booster-box"), deck = findSealedProduct("base-set-blackout");
 assert.ok(box); assert.ok(deck);
 assert.equal(documentedPrintingCount(box), 4);
 assert.equal(documentedPrintingCount(deck), 3);
});

test("First Edition is a booster printing, not a deck printing inferred from Machamp", () => {
 for (const product of sealedProducts) {
  assert.equal(Boolean(findSealedPrinting(product.id, "first-edition")), ["Booster packs", "Booster boxes"].includes(product.type));
 }
 assert.equal(findSealedProduct("base-set-starter-set")?.featuredCard?.name, "Machamp");
 assert.equal(findSealedPrinting("base-set-booster-box", "not-a-printing"), undefined);
 assert.equal(findSealedPrinting("not-a-product", "unlimited"), undefined);
});

test("unconfirmed printing is explicit and separate from documented variants", () => {
 for (const product of sealedProducts) {
  const printing = findSealedPrinting(product.id, "unconfirmed");
  assert.ok(printing);
  assert.equal(printing.status, "unconfirmed");
  assert.equal(printing.cardPrinting, "Not confirmed");
  assert.equal(printing.image, undefined);
  assert.equal(sealedPrintingHref(product.id, printing.id), `/explore/pokemon/sealed/${product.id}/unconfirmed`);
  assert.equal(new Set(product.printings.map(item => item.id)).size, product.printings.length);
 }
});

test("reference images exist and product dates do not become printing dates", () => {
 const publicRoot = new URL("../../../public/", import.meta.url);
 for (const product of sealedProducts) {
  assert.ok(existsSync(new URL(product.image.slice(1), publicRoot)), product.image);
  for (const printing of product.printings) {
   assert.equal("releaseDate" in printing, false);
   if (printing.image) assert.ok(existsSync(new URL(printing.image.src.slice(1), publicRoot)), printing.image.src);
  }
 }
 assert.equal(findSealedProduct("base-set-starter-set")?.originalRelease, null);
});

test("search finds documented printings without duplicating products", () => {
 assert.deepEqual(searchSealedProducts("first edition").map(product => product.id), ["base-set-booster-pack", "base-set-booster-box"]);
 assert.equal(searchSealedProducts("shadowless").length, 7);
 assert.equal(searchSealedProducts("", "Theme decks").length, 4);
 assert.equal(searchSealedProducts("zap", "Theme decks")[0]?.id, "base-set-zap");
});
