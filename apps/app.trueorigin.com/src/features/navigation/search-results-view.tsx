"use client";

import { Command } from "cmdk";
import { useState, type ReactNode } from "react";
import { RevealImage } from "@/components/ui/reveal-image";
import type { SearchResult } from "./search-results";

const categories = ["All", "Collections", "Cards", "Pokédex", "Passports", "Pages"] as const;
type Category = typeof categories[number];
function CategoryIcon({ category, className = "size-5" }: { category: string; className?: string }) {
 const drawings: Record<string, ReactNode> = {
  All: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" fill="currentColor" /></>,
  Collections: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="18" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  Cards: <><rect x="7" y="5" width="13" height="17" rx="2" /><path d="M4 18 2.5 4a2 2 0 0 1 1.8-2.2L15 1" /></>,
  "Pokédex": <><circle cx="12" cy="12" r="9" /><path d="M3 12h6m6 0h6" /><circle cx="12" cy="12" r="3" /></>,
  Passports: <><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="10" r="4" /><path d="M8 18h8m-4-12v8m-4-4h8" /></>,
  Pages: <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></>,
 };
 return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>{drawings[category] ?? drawings.Pages}</svg>;
}

export function SearchResultsView({ results, loading, error, passportsUnavailable, query, onSelect }: {
 results: SearchResult[]; loading: boolean; error: string; passportsUnavailable: boolean; query: string; onSelect: (href: string) => void;
}) {
 const [category, setCategory] = useState<Category>("All");
 const [universe, setUniverse] = useState("All");
 const visible = results.filter(result => (category === "All" || result.group === category) && (universe === "All" || result.universe === universe));
 const groups = categories.filter(group => group !== "All" && visible.some(result => result.group === group));
 return <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
  <nav aria-label="Search categories" className="flex shrink-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-[#242424] bg-[#0b0b0b] p-2 sm:w-[22%] sm:min-w-44 sm:max-w-72 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r sm:p-2">
   {categories.map(name => <button key={name} type="button" onKeyDown={event => { if (event.key === "Enter") event.stopPropagation(); }} aria-pressed={category === name} onClick={() => setCategory(name)} className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors sm:gap-3 sm:px-3 sm:py-2 sm:text-[15px] ${category === name ? "bg-[#222222] text-white" : "text-[#a0a0a0] hover:bg-white/[0.035] hover:text-white"}`}><CategoryIcon category={name} />{name}</button>)}
  </nav>
  <div className="flex min-h-0 min-w-0 flex-1 flex-col">
   <fieldset aria-label="Search ecosystem" className="flex h-[60px] shrink-0 items-center gap-2 overflow-x-auto border-b border-[#242424] px-4">
    <button type="button" onKeyDown={event => { if (event.key === "Enter") event.stopPropagation(); }} aria-pressed={universe === "All"} onClick={() => setUniverse("All")} className={`h-9 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${universe === "All" ? "border-[#333] bg-[#191919] text-white" : "border-[#242424] text-white/50 hover:text-white"}`}>All</button>
    <button type="button" onKeyDown={event => { if (event.key === "Enter") event.stopPropagation(); }} aria-pressed={universe === "Pokémon"} onClick={() => setUniverse("Pokémon")} className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors ${universe === "Pokémon" ? "border-[#333] bg-[#191919] text-white" : "border-[#242424] text-white/60 hover:border-white/20 hover:text-white"}`}><RevealImage src="/pika.png" alt="" width={24} height={24} className="size-6 object-contain" />Pokémon</button>
   </fieldset>
   <Command.List aria-busy={loading} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {loading && <div role="status" className="space-y-3"><p className="font-mono text-xs uppercase tracking-wide text-white/35">Searching…</p><div aria-hidden="true" className="grid gap-3 lg:grid-cols-2">{[0,1,2,3].map(index => <div key={index} className="flex h-20 items-center gap-3 rounded-xl border border-[#242424] px-4"><div className="size-12 rounded-lg bg-white/5" /><div className="h-3 w-32 rounded bg-white/5" /></div>)}</div></div>}
    {error && <p role="alert" className="py-4 text-sm text-red-300">{error}</p>}
    {!loading && !error && !visible.length && <Command.Empty className="py-6 text-sm leading-6 text-white/45">{query ? "No matches in this category. Try another name, number, or filter." : "No items in this category yet. Try another category or search by name or number."}</Command.Empty>}
    {!loading && !error && groups.map(group => <Command.Group key={group} heading={group} className="mb-5 last:mb-0 [&_[cmdk-group-heading]]:mb-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-[#999] [&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:gap-3 lg:[&_[cmdk-group-items]]:grid-cols-2">
     {visible.filter(result => result.group === group).map(result => <Command.Item key={result.href} value={result.href} onSelect={() => onSelect(result.href)} className="flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border border-[#242424] p-3 text-white/90 transition-colors hover:border-[#343434] data-[selected=true]:border-[#333] data-[selected=true]:bg-[#202020]">
      <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#151515] text-white/40">{result.image ? <RevealImage src={result.image} alt="" fill sizes="48px" unoptimized={result.group === "Passports"} className="object-contain p-0.5" /> : <CategoryIcon category={result.group} className="size-6" />}</span>
      <span className="min-w-0"><span className="block truncate text-[15px] font-medium">{result.title}</span><span className="mt-1 block truncate font-mono text-xs leading-5 text-[#929292]">{result.detail}</span></span>
     </Command.Item>)}
    </Command.Group>)}
    {passportsUnavailable && <p role="status" className="pt-3 text-xs leading-5 text-white/40">Passport search is temporarily unavailable. Catalogue results are still available.</p>}
   </Command.List>
  </div>
 </div>;
}
