import images from "./sealed-printing-artwork.json" with { type: "json" };

export type SealedPrintingId = "first-edition" | "shadowless" | "unlimited" | "1999-2000" | "unconfirmed";
export type SealedPrinting = {
 id: SealedPrintingId;
 label: string;
 status: "documented" | "unconfirmed";
 cardPrinting: string;
 identification: string;
 note?: string;
 source: string;
 image?: { src: string; source: string; page: string; width: number; height: number };
};
const guide = "https://www.pokemastercenter.com/pokemon-base-set-guide/";
const packagingGuide = "https://www.elitefourum.com/t/identifying-shadowless-unlimited-base-set-boxes-packs/16993";

// These are documented product categories, not a guarantee about any physical copy.
// English printing rules must not be applied to other languages.
export function englishBaseSetPrintings(product: { id: string; type: string }): SealedPrinting[] {
 const booster = product.type === "Booster packs" || product.type === "Booster boxes";
 const definitions: SealedPrinting[] = [
  ...(booster ? [{
   id: "first-edition" as const, label: "First Edition", status: "documented" as const,
   cardPrinting: "First Edition Base Set cards",
   identification: "Look for the First Edition marking on the original English packaging.",
   note: "Check the complete packaging design: later triangle-error booster wrappers are a separate variant and do not establish First Edition contents.",
   source: guide,
  }] : []),
  {
   id: "shadowless", label: "Shadowless", status: "documented",
   cardPrinting: "Shadowless Base Set cards, subject to packaging identification",
   identification: booster ? "Early pack and box designs are associated with Shadowless cards. Several designs also occur with Unlimited contents." : "Early deck packaging is associated with Shadowless cards; front artwork alone does not establish the contents.",
   note: "A sealed packaging photo alone does not guarantee Shadowless contents. Identification needs the relevant seals, copyright text, and packaging features.",
   source: booster ? packagingGuide : guide,
  },
  {
   id: "unlimited", label: "Unlimited", status: "documented",
   cardPrinting: "Later shadowed Base Set cards",
   identification: "The later English printing with the shadowed card design. Check the full packaging and copyright text to distinguish it from other runs.",
   source: guide,
  },
  {
   id: "1999-2000", label: "©1999–2000", status: "documented",
   cardPrinting: "Later Unlimited cards with the ©1999–2000 copyright line",
   identification: "Identify this later packaging run using the ©1999–2000 copyright text; the front photo is insufficient.",
   note: "Packaging date and individual card copyright dates are separate details. Some products can contain cards from more than one printing.",
   source: guide,
  },
  {
   id: "unconfirmed", label: "Printing unconfirmed", status: "unconfirmed",
   cardPrinting: "Not confirmed",
   identification: "Use this when the product is identifiable but the printing has not been established. Do not infer it from a generic packaging photo.",
   source: guide,
  },
 ];
 return definitions.map(printing => {
  const image = images[`${product.id}:${printing.id}` as keyof typeof images];
  return { ...printing, ...(image ? { image } : {}) };
 });
}
