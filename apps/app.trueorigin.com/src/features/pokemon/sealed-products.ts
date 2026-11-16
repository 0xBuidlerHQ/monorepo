import { englishBaseSetPrintings, type SealedPrintingId } from "./sealed-printings.ts";
import artwork from "./sealed-artwork.json" with { type: "json" };

// English Base Set retail products. Product names and print-run descriptions:
// https://tcgcsv.com/tcgplayer/3/604/products (TCGplayer catalogue mirror).
// Packaging photographs: source URLs and dimensions are recorded in sealed-artwork.json.
// Deck contents cross-checked against the linked Bulbapedia product pages.
const deckSource = (name: string) => `https://bulbapedia.bulbagarden.net/wiki/${name}_(TCG)`;
const common = { setId: "base-set", setName: "Base Set", language: "English", languageCode: "en" as const };
export const sealedProducts = [
 { ...common, id: "base-set-booster-pack", name: "Booster Pack", type: "Booster packs", contents: "11 cards", description: "An English Base Set booster pack. The wrapping features Charizard, Blastoise, or Venusaur; the image shows Charizard artwork.", productId: 138130, source: "https://www.tcgplayer.com/product/138130", reference: "https://bulbapedia.bulbagarden.net/wiki/Base_Set_(TCG)" },
 { ...common, id: "base-set-booster-box", name: "Booster Box", type: "Booster boxes", contents: "36 booster packs", description: "A sealed display box of English Base Set booster packs.", productId: 185731, source: "https://www.tcgplayer.com/product/185731", reference: "https://bulbapedia.bulbagarden.net/wiki/Base_Set_(TCG)" },
 { ...common, id: "base-set-starter-set", name: "2-Player Starter Set", type: "Starter sets", contents: "61 cards", description: "Two 30-card introductory decks and an additional Machamp card, with rules and damage counters.", productId: 136400, source: "https://www.tcgplayer.com/product/136400", reference: deckSource("2-Player_Starter_Set") },
 { ...common, id: "base-set-blackout", name: "Blackout", type: "Theme decks", contents: "60 cards", description: "A ready-to-play deck featuring Water and Fighting Pokémon, with a coin, damage counters, and rulebook.", productId: 136401, source: "https://www.tcgplayer.com/product/136401", reference: deckSource("Blackout") },
 { ...common, id: "base-set-brushfire", name: "Brushfire", type: "Theme decks", contents: "60 cards", description: "One of the four English Base Set theme decks, supplied as a fixed 60-card deck.", productId: 136403, source: "https://www.tcgplayer.com/product/136403", reference: deckSource("Brushfire") },
 { ...common, id: "base-set-overgrowth", name: "Overgrowth", type: "Theme decks", contents: "60 cards", description: "One of the four English Base Set theme decks, supplied as a fixed 60-card deck.", productId: 136404, source: "https://www.tcgplayer.com/product/136404", reference: deckSource("Overgrowth") },
 { ...common, id: "base-set-zap", name: "Zap!", type: "Theme decks", contents: "60 cards", description: "One of the four English Base Set theme decks, supplied as a fixed 60-card deck.", productId: 136402, source: "https://www.tcgplayer.com/product/136402", reference: deckSource("Zap!") },
].map(product => {
 const image = artwork[product.id as keyof typeof artwork];
 return {
  ...product, image: image.src, imageSource: image.source, imageSourcePage: image.page,
  printings: englishBaseSetPrintings(product),
  originalRelease: product.id === "base-set-starter-set" ? null : "1999-01-09",
  featuredCard: ({ "base-set-starter-set": { id: "base-set-8", name: "Machamp" }, "base-set-blackout": { id: "base-set-7", name: "Hitmonchan" }, "base-set-brushfire": { id: "base-set-12", name: "Ninetales" }, "base-set-overgrowth": { id: "base-set-6", name: "Gyarados" }, "base-set-zap": { id: "base-set-10", name: "Mewtwo" } } as Record<string, { id: string; name: string }>)[product.id],
 };
});

export const sealedProductTypes = [...new Set(sealedProducts.map(product => product.type))];
export const findSealedProduct = (id: string) => sealedProducts.find(product => product.id === id);
export const sealedProductHref = (id: string) => `/explore/pokemon/sealed/${id}`;
export const sealedPrintingHref = (id: string, printing: SealedPrintingId) => `${sealedProductHref(id)}/${printing}`;
export const documentedPrintingCount = (product: (typeof sealedProducts)[number]) => product.printings.filter(printing => printing.status === "documented").length;
export const findSealedPrinting = (productId: string, printingId: string) => findSealedProduct(productId)?.printings.find(printing => printing.id === printingId);
export function searchSealedProducts(query: string, type = "all") {
 const normalize = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
 const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
 return sealedProducts.filter(product => (type === "all" || product.type === type) && terms.every(term => normalize(`${product.name} ${product.type} ${product.setName} ${product.printings.filter(printing => printing.status === "documented").map(printing => printing.label).join(" ")} ${product.contents}`).includes(term)));
}
