"use client";

import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { CatalogLanguageSelector } from "@/features/reference/catalog-language-selector";
import { formatCardNumber } from "@/features/reference/card-number";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { addTransitionType, startTransition, useId } from "react";
import { ContentSurface } from "@/features/shell/content-surface";
import { useSearchParams } from "next/navigation";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { ExploreCard } from "@/features/reference/explore-card";
import type { ReferenceCard, ReferenceSet } from "@/features/reference/catalog";

const filterKeys = ["q", "pokemon", "type", "rarity", "artist", "page"];
function normalizeSearch(value: string) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9♀♂]/g, "");
}

function CardTypeIcon({ type }: { type: string }) {
	const normalized = normalizeSearch(type);
	return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5">
		{normalized === "pokemon" ? <><circle cx="12" cy="12" r="8" /><path d="M4 12h5m6 0h5" /><circle cx="12" cy="12" r="3" /></>
			: normalized === "trainer" || normalized === "dresseur" ? <><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2M5 5V3h3m8 0h3v2" /></>
				: normalized === "energy" || normalized === "energie" ? <path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z" />
					: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>}
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
	const filters = { type: params.get("type") ?? "", rarity: params.get("rarity") ?? "" };
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
	const rarities = [...new Set(sectionCards.flatMap((card) => card.rarity ? [card.rarity] : []))].sort();
	const terms = query.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
	const filtered = sectionCards.filter((card) => {
		if (filters.type && card.supertype !== filters.type) return false;
		if (filters.rarity && card.rarity !== filters.rarity) return false;
		const searchable = normalizeSearch(`${card.name} ${card.number} ${card.artist ?? ""}`);
		return terms.every((term) => searchable.includes(term));
	}).sort((a, b) => a.number.localeCompare(b.number, "en", { numeric: true }) || a.id.localeCompare(b.id));
	const filteredView = !!query || Object.values(filters).some(Boolean);
	const counts = types.map((type) => ({ type, count: sectionCards.filter((card) => card.supertype === type).length }));
	return (
			<section id="checklist" aria-labelledby="checklist-title" className="mt-8 scroll-mt-[calc(var(--app-header-height)+1rem)]">
				<ContentSurface className="rounded-[28px] bg-gradient-to-br from-[#202020] to-[#191919] p-5 shadow-[inset_0_1px_0_#ffffff06] sm:p-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex items-center gap-3"><h2 id="checklist-title" className="text-2xl font-medium tracking-[-0.045em]">Cards</h2><p role="status" className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-white/45">{filtered.length}{filteredView ? ` / ${sectionCards.length}` : ""}</p></div>
						<div className="flex flex-wrap items-center gap-4"><CatalogLanguageSelector /></div>
					</div>
					{sections && <LayoutGroup id={sectionGroup}><nav aria-label="Set checklists" className="mt-5 flex flex-wrap gap-2">{sections.map((section) => <motion.button key={section.id} whileTap={reducedMotion ? undefined : { scale: 0.97 }} type="button" aria-pressed={section.id === activeSection?.id} onClick={() => updateFilter("section", section.id)} className={`relative isolate flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-xs transition-colors ${section.id === activeSection?.id ? "text-black" : "text-white/55 hover:text-white"}`}>{section.id === activeSection?.id && <motion.span layoutId="checklist-section" className="absolute inset-0 -z-10 rounded-full bg-white" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}{section.name}<span className="font-mono text-[10px] opacity-60">{allCards.filter((card) => card.setId === section.setId).length}</span></motion.button>)}</nav></LayoutGroup>}
					<form onSubmit={(event) => event.preventDefault()} className="mt-5">
						<div className="flex flex-wrap gap-3">
							<label className="min-w-0 flex-1 basis-48"><span className="sr-only">Search cards by name, number, or illustrator</span><input name="q" type="search" value={query} onChange={(event) => updateFilter("q", event.target.value)} placeholder="Name, number, or illustrator…" className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none placeholder:text-white/30 focus:border-white/35" /></label>
						</div>
						<div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-5">
							<fieldset className="min-w-0 shrink-0">
								<legend className="mb-2 text-[11px] text-white/40">Card type</legend>
								<div className="flex gap-2">{["", ...types].map((type) => <button key={type} type="button" aria-label={type || "All card types"} title={type || "All card types"} aria-pressed={filters.type === type} onClick={() => updateFilter("type", filters.type === type ? "" : type)} className={`flex size-11 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.type === type ? "border-white bg-white text-black" : "border-white/10 bg-[#171717] text-white/45 hover:border-white/25 hover:text-white"}`}><CardTypeIcon type={type} /></button>)}</div>
							</fieldset>
						<fieldset className="ml-auto min-w-0 flex-1 basis-64 text-right">
							<legend className="mb-2 ml-auto text-[11px] text-white/40">Rarity</legend>
							<div className="flex flex-wrap justify-end gap-2">{["", ...rarities].map((rarity) => <button key={rarity} type="button" aria-pressed={filters.rarity === rarity} onClick={() => updateFilter("rarity", filters.rarity === rarity ? "" : rarity)} className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-full border px-3.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.rarity === rarity ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.025] text-white/50 hover:border-white/25 hover:text-white"}`}>{rarity || "All rarities"}</button>)}</div>
						</fieldset>
						</div>
						{filteredView && <button type="button" onClick={clearFilters} className="mt-4 inline-block cursor-pointer text-xs text-white/50 hover:text-white">Clear all filters ×</button>}
					</form>
				</ContentSurface>
				<div className="my-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40">{counts.map(({ type, count }) => <span key={type}>{count} {type} cards</span>)}{printedTotal && sectionCards.length > printedTotal ? <span>Includes cards beyond the printed set number</span> : null}</div>
				{filtered.length > 0 ? <ul className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{filtered.map((card) => <li key={card.id}>
					<ExploreCard name={card.name} brand={`#${formatCardNumber(card, printedTotal)}`} brandMono href={catalogHref(`/explore/cards/${card.id}`, language)} alt={card.name} imageLayout="portrait" image={getCardArtwork(card.id, language)?.src} placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} description={[card.rarity ?? card.supertype, card.artist].filter(Boolean).join(" · ")} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
				</li>)}</ul> : <div className="rounded-3xl bg-white/[0.025] px-6 py-16 text-center"><h3 className="text-xl">No matching cards</h3><p className="mt-3 text-sm text-white/45">Try changing your search or filters.</p><button type="button" onClick={clearFilters} className="mt-5 inline-block cursor-pointer text-sm text-white/70 hover:text-white">Reset filters ↗</button></div>}
			</section>
	);
}
