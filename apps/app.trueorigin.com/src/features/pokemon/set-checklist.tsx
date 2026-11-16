"use client";

import { cardPageHref } from "@/features/reference/set-relationships";

import { RaritySymbol } from "./rarity-symbol";
import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { formatCardNumber } from "@/features/reference/card-number";

import Image from "next/image";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { addTransitionType, startTransition, useId } from "react";
import { FilterPanel } from "@/components/ui/filter-panel";
import { useSearchParams } from "next/navigation";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { ExploreCard } from "@/features/reference/explore-card";
import type { ReferenceCard, ReferenceSet } from "@/features/reference/catalog";

const filterKeys = ["q", "pokemon", "type", "rarity", "artist", "element", "page"];
function normalizeSearch(value: string) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9♀♂]/g, "");
}

function CardTypeIcon({ type }: { type: string }) {
 const normalized = normalizeSearch(type);
 const gradientId = useId();
 const pokemon = normalized === "pokemon";
 const trainer = normalized === "trainer" || normalized === "dresseur";
 const energy = normalized === "energy" || normalized === "energie";
 const colors = pokemon ? ["#ffd6be", "#f26d51", "#a52c28"] : trainer ? ["#d0efff", "#54a3df", "#285d9b"] : energy ? ["#fff4c2", "#e9bd4d", "#a7731e"] : ["#f4f4f4", "#aaaeb5", "#555d67"];
 return <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
  <defs><radialGradient id={gradientId} cx="30%" cy="23%" r="83%"><stop stopColor={colors[0]} /><stop offset="0.48" stopColor={colors[1]} /><stop offset="1" stopColor={colors[2]} /></radialGradient></defs>
  <circle cx="16" cy="16" r="15" fill={`url(#${gradientId})`} stroke={colors[1]} strokeWidth="1" />
  <circle cx="16" cy="16" r="13.5" fill="none" stroke="white" strokeOpacity="0.2" />
  <ellipse cx="10" cy="7" rx="4" ry="2.5" transform="rotate(-30 10 7)" fill="white" opacity="0.4" />
  <g fill="#171717">
   {pokemon ? <><path fillRule="evenodd" d="M16 7a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2.5a6.5 6.5 0 0 1 6.38 5.25h-3.3a3.32 3.32 0 0 0-6.16 0h-3.3A6.5 6.5 0 0 1 16 9.5Zm-6.38 7.75h3.3a3.32 3.32 0 0 0 6.16 0h3.3a6.5 6.5 0 0 1-12.76 0Z" /><circle cx="16" cy="16" r="1.5" /></>
    : trainer ? <><circle cx="16" cy="12" r="4" /><path d="M8 24v-2a8 8 0 0 1 16 0v2H8Z" /></>
    : energy ? <path d="m18 6-10 12h7l-1 8 10-13h-7l1-7Z" />
    : <><rect x="9" y="9" width="6" height="6" rx="1" /><rect x="17" y="9" width="6" height="6" rx="1" /><rect x="9" y="17" width="6" height="6" rx="1" /><rect x="17" y="17" width="6" height="6" rx="1" /></>}
  </g>
 </svg>;
}


export function SetChecklist({ set, cards: allCards, sections }: {
	set: ReferenceSet;
	cards: ReferenceCard[];
	sections?: { id: string; name: string; setId: string; printedTotal: number | null }[];
}) {
	const params = useSearchParams();
	const language = catalogLanguage(set.language);
	const reducedMotion = useReducedMotion();
	const sectionGroup = useId();
	const query = params.get("q") ?? "";
	const activeSection = sections?.find((section) => section.id === params.get("section")) ?? sections?.[0];
	const sectionCards = activeSection ? allCards.filter((card) => card.setId === activeSection.setId) : allCards;
	const printedTotal = activeSection ? activeSection.printedTotal : set.printedTotal;
	const filters = { element: params.get("element") ?? "", type: params.get("type") ?? "", rarity: params.get("rarity") ?? "" };
	function replaceFilters(url: URL) {
		startTransition(() => {
			addTransitionType("catalog-filter");
			window.history.replaceState(null, "", url.pathname + url.search + url.hash);
		});
	}
	function updateFilter(key: string, value: string) {
		const url = new URL(window.location.href);
		if (value) url.searchParams.set(key, value);
		else url.searchParams.delete(key);
		url.searchParams.delete("page");
		replaceFilters(url);
	}
	function clearFilters() {
		const url = new URL(window.location.href);
		for (const key of filterKeys) url.searchParams.delete(key);
		replaceFilters(url);
	}
	const types = [...new Set(sectionCards.map((card) => card.supertype))].sort();
	const pokemonTypes = [...new Set(sectionCards.filter(card => card.supertype === "Pokémon").flatMap(card => card.types))].sort();
	const rarities = [...new Set(sectionCards.flatMap((card) => card.rarity ? [card.rarity] : []))].sort();
	const terms = query.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
	const filtered = sectionCards.filter((card) => {
		if (filters.element && (card.supertype !== "Pokémon" || !card.types.includes(filters.element))) return false;
		if (filters.type && card.supertype !== filters.type) return false;
		if (filters.rarity && card.rarity !== filters.rarity) return false;
		const searchable = normalizeSearch(`${card.name} ${card.number} ${card.artist ?? ""}`);
		return terms.every((term) => searchable.includes(term));
	}).sort((a, b) => a.number.localeCompare(b.number, "en", { numeric: true }) || a.id.localeCompare(b.id));
	const filteredView = !!query || Object.values(filters).some(Boolean);
	return (
			<section id="checklist" aria-label="Set cards" className="mt-3 scroll-mt-[calc(var(--app-header-height)+1rem)]">
				<FilterPanel resultCount={filtered.length} canReset={filteredView} onReset={clearFilters}>
					{sections && <LayoutGroup id={sectionGroup}><nav aria-label="Set checklists" className="mt-5 flex flex-wrap gap-2">{sections.map((section) => <motion.button key={section.id} whileTap={reducedMotion ? undefined : { scale: 0.97 }} type="button" aria-pressed={section.id === activeSection?.id} onClick={() => updateFilter("section", section.id)} className={`relative isolate flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-xs transition-colors ${section.id === activeSection?.id ? "text-black" : "text-white/55 hover:text-white"}`}>{section.id === activeSection?.id && <motion.span layoutId="checklist-section" className="absolute inset-0 -z-10 rounded-full bg-white" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}{section.name}<span className="font-mono text-[10px] opacity-60">{allCards.filter((card) => card.setId === section.setId).length}</span></motion.button>)}</nav></LayoutGroup>}
					<form onSubmit={(event) => event.preventDefault()} className="py-1">
						<div className=" flex flex-wrap items-center gap-x-8 gap-y-5">
							<fieldset className="min-w-0 shrink-0">
								<legend className="mb-2 text-[11px] text-white/40">Card type</legend>
								<div className="flex gap-2">{["", ...types].map((type) => <button key={type} type="button" aria-label={type || "All card types"} title={type || "All card types"} aria-pressed={filters.type === type} onClick={() => updateFilter("type", filters.type === type ? "" : type)} className={`flex size-11 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.type === type ? "border-white bg-white/15 text-white" : "border-white/10 bg-[#171717] text-white/45 hover:border-white/25 hover:text-white"}`}><CardTypeIcon type={type} /></button>)}</div>
							</fieldset>
							<fieldset className="min-w-0">
                                <legend className="mb-2 text-[11px] text-white/40">Pokémon type</legend>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" aria-label="All Pokémon types" title="All Pokémon types" aria-pressed={!filters.element} onClick={() => updateFilter("element", "")} className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border px-2 text-xs transition-colors ${!filters.element ? "border-white bg-white/15 text-white" : "border-white/10 bg-[#171717] text-white/45 hover:border-white/25 hover:text-white"}`}><CardTypeIcon type="" /></button>
                                    {pokemonTypes.map(type => <button key={type} type="button" title={type} aria-label={`${type} Pokémon`} aria-pressed={filters.element === type} onClick={() => updateFilter("element", filters.element === type ? "" : type)} className={`flex size-11 cursor-pointer items-center justify-center rounded-xl border transition-colors ${filters.element === type ? "border-white bg-white/15" : "border-white/10 bg-[#171717] hover:border-white/30"}`}><Image src={`/images/tcg-types/${type.toLowerCase()}.png`} alt="" width={28} height={28} className="size-7 object-contain" /></button>)}
                                </div>
                            </fieldset>
						<fieldset className="ml-auto min-w-0 flex-1 basis-64 text-left">
							<legend className="mb-2 text-[11px] text-white/40">Rarity</legend>
							<div className="flex flex-wrap justify-start gap-2">{["", ...rarities].map((rarity) => <button key={rarity} type="button" aria-label={rarity || "All rarities"} title={rarity || "All rarities"} aria-pressed={filters.rarity === rarity} onClick={() => updateFilter("rarity", filters.rarity === rarity ? "" : rarity)} className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border ${rarity ? "px-3.5" : "w-11"} text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.rarity === rarity ? (rarity ? "border-white bg-white text-black" : "border-white bg-white/15 text-white") : (rarity ? "border-white/10 bg-white/[0.025] text-white/50 hover:border-white/25 hover:text-white" : "border-white/10 bg-[#171717] text-white/45 hover:border-white/25 hover:text-white")}`}>{rarity ? <><RaritySymbol rarity={rarity} />{rarity}</> : <CardTypeIcon type="" />}</button>)}</div>
						</fieldset>
						</div>
					</form>
				</FilterPanel>
				{printedTotal && sectionCards.length > printedTotal ? <p className="mt-5 text-xs text-white/40">Includes cards beyond the printed set number</p> : null}
				{filtered.length > 0 ? <ul className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{filtered.map((card) => <li key={card.id}>
					<ExploreCard inlineMetadata name={card.name} brand={`#${formatCardNumber(card, printedTotal)}`} brandMono href={catalogHref(cardPageHref(card), language)} alt={card.name} imageLayout="portrait" image={getCardArtwork(card.id, language)?.src} placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} nameAdornment={card.supertype === "Pokémon" && card.types.map(type => <span key={type} title={type} className="inline-flex"><Image src={`/images/tcg-types/${type.toLowerCase()}.png`} alt={`${type} type`} width={18} height={18} className="size-[18px] object-contain" /></span>)} description={<span className="inline-flex items-center gap-2">{card.rarity ? <span title={card.rarity} className="inline-flex items-center [&>svg]:size-[18px]"><RaritySymbol rarity={card.rarity} /><span className="sr-only">{card.rarity}</span></span> : null}</span>} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
				</li>)}</ul> : <div className="mt-5 rounded-3xl bg-white/[0.025] px-6 py-16 text-center"><h3 className="text-xl">No matching cards</h3><p className="mt-3 text-sm text-white/45">Try changing your search or filters.</p><button type="button" onClick={clearFilters} className="mt-5 inline-block cursor-pointer text-sm text-white/70 hover:text-white">Reset filters ↗</button></div>}
			</section>
	);
}
