export function RaritySymbol({ rarity }: { rarity: string }) {
 if (!rarity) return null;
 return <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-3.5 shrink-0 fill-current ${rarity === "Rare Holo" ? "text-[#b9a3ed] drop-shadow-[0_0_4px_#a7cfff80]" : ""}`}>
  {rarity === "Common" ? <circle cx="10" cy="10" r="4" /> : rarity === "Uncommon" ? <path d="m10 3 5 7-5 7-5-7 5-7Z" /> : <path d="m10 1.5 2.5 5.6 6 .6-4.5 4 1.3 5.9-5.3-3-5.3 3 1.3-5.9-4.5-4 6-.6L10 1.5Z" />}
  {rarity === "Rare Holo" && <path d="m13 4 1 2.5 2.5 1-2.5 1L13 11l-1-2.5-2.5-1 2.5-1L13 4Z" fill="#e2faff" />}
 </svg>;
}

