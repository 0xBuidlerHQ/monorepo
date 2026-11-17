"use client";

import { OPEN_SEARCH_EVENT } from "./open-search";
import { Command } from "cmdk";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "./search-results";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export function ResearchPanel({ compact = false }: { compact?: boolean }) {
 const reducedMotion = useReducedMotion();
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState("");
 const router = useRouter();
 const [results, setResults] = useState<SearchResult[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [passportsUnavailable, setPassportsUnavailable] = useState(false);
 useEffect(() => {
  if (!open) return;
  const controller = new AbortController();
  setLoading(true); setError(""); setResults([]); setPassportsUnavailable(false);
  const timer = setTimeout(async () => {
   try {
    const response = await fetch(`/api/search?${new URLSearchParams({ q: query })}`, { signal: controller.signal });
    if (!response.ok) throw new Error("Search is temporarily unavailable. Try again.");
    const data = await response.json();
    if (!controller.signal.aborted) { setResults(data.results); setPassportsUnavailable(data.passportsUnavailable); }
   } catch {
    if (!controller.signal.aborted) setError("Search is temporarily unavailable. Try again.");
   } finally { if (!controller.signal.aborted) setLoading(false); }
  }, query ? 180 : 0);
  return () => { clearTimeout(timer); controller.abort(); };
 }, [open, query]);
 function changeOpen(next: boolean) {
  setOpen(next);
  if (!next) setQuery("");
 }
 useEffect(() => {
  function onKeyDown(event: KeyboardEvent) {
   if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.isComposing && !event.repeat) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
    setQuery("");
   }
  }
  function openDrawer() { setOpen(true); setQuery(""); }
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener(OPEN_SEARCH_EVENT, openDrawer);
  return () => {
   document.removeEventListener("keydown", onKeyDown);
   window.removeEventListener(OPEN_SEARCH_EVENT, openDrawer);
  };
 }, []);
 return <Drawer open={open} onOpenChange={changeOpen} swipeDirection="down">
  <DrawerTrigger data-header-search aria-label="Open search (Command K or Control K)" render={<motion.button whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} />} className={compact ? "group flex h-[30px] cursor-pointer items-center gap-2 border-r border-white/[0.07] px-3 text-[11px] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white [&>span:first-child]:size-4 [&>span:first-child>svg]:size-3.5 [&>kbd]:h-5 [&>kbd]:rounded [&>kbd]:px-1 [&>span:nth-child(2)]:text-[11px]" : "group flex h-12 w-12 shrink-0 cursor-pointer items-center gap-3 rounded-full bg-[#222222] p-1.5 text-white/65 shadow-[0_3px_12px_#00000018,inset_0_1px_0_#ffffff08] transition-[background-color,box-shadow] duration-200 hover:bg-[#2a2a2a] hover:shadow-[0_4px_20px_#00000026,inset_0_1px_0_#ffffff0c] data-popup-open:bg-[#2a2a2a] motion-reduce:transition-none sm:w-64 sm:pr-3"}>
   <span className={`grid shrink-0 place-items-center text-white/55 transition-colors group-hover:text-white/85 ${compact ? "size-3.5" : "size-9 rounded-full bg-white/[0.035]"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" className={compact ? "size-3.5" : "size-[19px]"}><circle cx="10.75" cy="10.75" r="6.25" /><path d="m15.5 15.5 4 4" /></svg></span>
   <span className="hidden flex-1 text-left text-[13px] font-medium tracking-[-0.025em] sm:block">Search</span>
   <kbd className="hidden h-7 items-center gap-1 rounded-lg bg-white/[0.045] px-2 font-sans text-[10px] leading-none text-white/35 sm:inline-flex"><span className="text-xs">⌘</span>K</kbd>
  </DrawerTrigger>
  <DrawerContent style={{ height: "min(65dvh, calc(100dvh - var(--app-header-height)))", maxHeight: "calc(100dvh - var(--app-header-height))" }} className="border-white/15 bg-[#111] text-white [--drawer-bleed-background:#111] [color-scheme:dark] data-[swipe-direction=down]:rounded-t-2xl">
   <DrawerTitle className="sr-only">Search TrueOrigins</DrawerTitle>
   <DrawerDescription className="sr-only">Search panel.</DrawerDescription>
   <Command shouldFilter={false} label="Search TrueOrigins" className="flex min-h-0 flex-1 flex-col" vimBindings={false}>
    <Command.Input value={query} onValueChange={setQuery} maxLength={120} placeholder="Search Pokémon, cards, passports…" aria-label="Search" className="h-16 shrink-0 border-b border-white/10 bg-transparent px-6 text-base text-white outline-none placeholder:text-white/35 sm:px-10" />
    <Command.List aria-busy={loading} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8">
     {loading && <div role="status" className="px-3 py-6 text-sm text-white/40">Searching…</div>}
     {error && <p role="alert" className="px-3 py-6 text-sm text-red-300">{error}</p>}
     {!loading && !error && !results.length && <Command.Empty className="px-3 py-6 text-sm text-white/45">No matches. Try a name, card number, or certification number.</Command.Empty>}
     {[...new Set(results.map(result => result.group))].map(group => <Command.Group key={group} heading={group} className="mb-5 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-white/35">
      {results.filter(result => result.group === group).map(result => <Command.Item key={result.href} value={result.href} onSelect={() => { changeOpen(false); router.push(result.href); }} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 text-white/80 data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white">
       <span className="min-w-0"><span className="block truncate text-sm">{result.title}</span><span className="mt-1 block truncate text-xs text-white/40">{result.detail}</span></span><span aria-hidden="true" className="text-white/30">↗</span>
      </Command.Item>)}
     </Command.Group>)}
     {passportsUnavailable && <p role="status" className="px-3 pb-3 text-xs text-white/40">Passport search is temporarily unavailable. Catalogue results are still available.</p>}
    </Command.List>
   </Command>
  </DrawerContent>
 </Drawer>;
}
