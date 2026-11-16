import assert from "node:assert/strict";
import { test } from "node:test";
import { getCardPrintings } from "./card-printings.ts";
import { breadcrumbTrail } from "../navigation/breadcrumb-trail.ts";

test("English Base Set Blastoise has four explicitly researched holo printings", () => {
 const printings = getCardPrintings("base-set","2");
 assert.deepEqual(printings.map(p=>p.id),["first-edition","shadowless","unlimited","1999-2000"]);
 for (const printing of printings) {
  assert.equal(printing.finish,"Holo");
  assert(printing.sources.length > 0);
  assert(printing.identification.length > 0);
  const trail = breadcrumbTrail("/explore/catalogue/base-set/2",new URLSearchParams({printing:printing.id}),{name:"Blastoise",setId:"base-set",setName:"Base Set"});
  assert.equal(trail.at(-1)?.label,printing.name);
 }
});

test("printings are not assumed for other sets, numbers or languages", () => {
 assert.deepEqual(getCardPrintings("base-set","103"),[]);
 assert.deepEqual(getCardPrintings("base-set","2","fr"),[]);
 assert.deepEqual(getCardPrintings("base2","2"),[]);
});


test("every English Base Set card has valid unique retail printings", () => {
 for (let number=1;number<=102;number++) {
  const printings=getCardPrintings("base-set",String(number));
  assert.equal(printings.length,4);
  assert.equal(new Set(printings.map(p=>p.id)).size,4);
  for (const printing of printings) {
   assert(printing.name);
   assert(printing.sources.length);
   assert.equal(printing.finish === "Non-holo",number>16);
  }
 }
});

test("Machamp retains its stamp across retail printings rather than inventing Unlimited", () => {
 const printings=getCardPrintings("base-set","8");
 assert.deepEqual(printings.map(p=>p.id),["first-edition-shadowless","first-edition-shadowed","first-edition-1999-2000","cosmos-holo"]);
 assert(printings.every(p=>p.identification.includes("First Edition stamp")));
 assert.equal(printings.at(-1)?.finish,"Cosmos Holo");
});

test("non-holo and basic Energy rarities are preserved", () => {
 assert(getCardPrintings("base-set","17").every(p=>p.rarity === "Rare" && p.finish === "Non-holo"));
 assert(getCardPrintings("base-set","97").every(p=>p.rarity === null && p.finish === "Non-holo"));
 assert(getCardPrintings("base-set","70").find(p=>p.id==="shadowless")?.identification.includes("copyright"));
});
