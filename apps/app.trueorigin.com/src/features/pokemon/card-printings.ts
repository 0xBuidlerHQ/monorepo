import baseSetCards from "./base-set-printing-cards.json" with { type: "json" };

export type CardPrinting = {
 id: string;
 name: string;
 finish: string;
 rarity: string | null;
 identification: string;
 sources: string[];
};

export const printingNames: Record<string, string> = {
 "first-edition": "First Edition",
 shadowless: "Shadowless",
 unlimited: "Unlimited",
 "1999-2000": "1999–2000",
 "first-edition-shadowless": "First Edition · Shadowless",
 "first-edition-shadowed": "First Edition · Shadowed",
 "first-edition-1999-2000": "First Edition · 1999–2000",
 "cosmos-holo": "Cosmos Holo",
};

const standardSources = [
 "https://www.pokemastercenter.com/pokemon-base-set-guide/",
 "https://www.psacard.com/psasetregistry/tcg/company-sets/1999-pokemon-game-base-set-2000/composition/22046",
];
const machampSources = [
 "https://www.elitefourum.com/t/guide-to-understanding-base-set-machamp-8-102-variants/30908",
 "https://www.psacard.com/psasetregistry/tcg/famous-figures/pokemon-machamp-master-set/composition/22158",
];
const cards: Record<string, { rarity: string | null; supertype: string }> = baseSetCards;

// Standard English retail printings. Prototype decks, errors, stamp thickness,
// and other within-printing variations are not inferred by this catalogue.
export function getCardPrintings(setId: string, number: string, language = "en"): readonly CardPrinting[] {
 if (setId !== "base-set" || language !== "en" || !Object.hasOwn(cards, number)) return [];
 const card = cards[number];
 const finish = card.rarity === "Rare Holo" ? "Holo" : "Non-holo";
 const make = (id: string, identification: string, sources = standardSources, specificFinish = finish): CardPrinting => ({id,name:printingNames[id],finish:specificFinish,rarity:card.rarity,identification,sources});
 if (number === "8") return [
  make("first-edition-shadowless","First Edition stamp, no illustration-frame shadow, and Galaxy holofoil.",machampSources),
  make("first-edition-shadowed","First Edition stamp with a shadowed illustration frame, Galaxy holofoil, and a 1999 Wizards copyright date.",machampSources),
  make("first-edition-1999-2000","First Edition stamp, shadowed illustration frame, Galaxy holofoil, and a 1999–2000 Wizards copyright date.",machampSources),
  make("cosmos-holo","First Edition stamp with the Cosmos holofoil pattern; distributed in the 2000 2-Player CD-ROM Starter Set.",machampSources,"Cosmos Holo"),
 ];
 const illustration = card.supertype === "Pokémon";
 return [
  make("first-edition",illustration ? "First Edition stamp below the illustration, with no drop shadow along the illustration frame." : "First Edition stamp on the card face; the illustration-frame shadow test does not apply to Trainer or Energy cards."),
  make("shadowless",illustration ? "No First Edition stamp and no drop shadow along the illustration frame." : "No First Edition stamp; the Nintendo copyright years include 99. Trainer and Energy cards are identified by the copyright line rather than an illustration-frame shadow."),
  make("unlimited",illustration ? "No First Edition stamp, a shadowed illustration frame, and a 1999 Wizards copyright date." : "No First Edition stamp, Nintendo copyright years without the extra 99, and a 1999 Wizards copyright date."),
  make("1999-2000","A 1999–2000 Wizards copyright date along the bottom of the card."),
 ];
}
