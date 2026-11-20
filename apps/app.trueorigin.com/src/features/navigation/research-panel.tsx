"use client";

import { OPEN_SEARCH_EVENT } from "./open-search";
import { Command } from "cmdk";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "./search-results";
import { Dialog } from "@base-ui/react/dialog";
import { SearchResultsView } from "./search-results-view";

export function ResearchPanel({ compact = false }: { compact?: boolean }) {
 const reducedMotion = useReducedMotion();
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState("");
 const router = useRouter();
 const inputRef = useRef<HTMLInputElement>(null);
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
 return <Dialog.Root open={open} onOpenChange={changeOpen}>
  <Dialog.Trigger data-header-search aria-label="Open search (Command K or Control K)" render={<motion.button whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} />} className={compact ? "group flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-white/25 px-1.5 text-xs font-medium text-white/85 transition-colors hover:border-white/45 hover:bg-white/[0.07] hover:text-white lg:px-3 [&>span:first-child]:size-[18px] [&>span:first-child>svg]:size-[18px] [&>kbd]:h-5 [&>kbd]:rounded [&>kbd]:px-1 [&>span:nth-child(2)]:text-xs" : "group flex h-12 w-12 shrink-0 cursor-pointer items-center gap-3 rounded-full bg-[#222222] p-1.5 text-white/65 shadow-[0_3px_12px_#00000018,inset_0_1px_0_#ffffff08] transition-[background-color,box-shadow] duration-200 hover:bg-[#2a2a2a] hover:shadow-[0_4px_20px_#00000026,inset_0_1px_0_#ffffff0c] data-popup-open:bg-[#2a2a2a] motion-reduce:transition-none sm:w-64 sm:pr-3"}>
   <span className={`grid shrink-0 place-items-center text-white/55 transition-colors group-hover:text-white/85 ${compact ? "size-3.5" : "size-9 rounded-full bg-white/[0.035]"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" className={compact ? "size-3.5" : "size-[19px]"}><circle cx="10.75" cy="10.75" r="6.25" /><path d="m15.5 15.5 4 4" /></svg></span>
   <span className="hidden flex-1 text-left text-[13px] font-medium tracking-[-0.025em] sm:block">Search</span>
   <kbd className="hidden h-7 items-center gap-1 rounded-lg bg-white/[0.045] px-2 font-sans text-[10px] leading-none text-white/35 sm:inline-flex"><span className="text-xs">⌘</span>K</kbd>
  </Dialog.Trigger>
  <Dialog.Portal>
   <Dialog.Backdrop className="fixed inset-0 z-[120] bg-black/65 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
   <Dialog.Viewport className="pointer-events-none fixed inset-0 z-[121] grid place-items-center p-3 sm:p-8">
    <Dialog.Popup initialFocus={inputRef} data-search-popup className="pointer-events-auto flex h-[60dvh] max-h-[540px] w-full max-w-[900px] flex-col overflow-hidden rounded-[18px] border border-[#292929] bg-[#090909] text-white shadow-[0_32px_120px_#00000080] transition-[opacity,transform] duration-200 ease-out data-starting-style:translate-y-2 data-starting-style:scale-[0.985] data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:scale-[0.985] data-ending-style:opacity-0 motion-reduce:transition-none [color-scheme:dark]">
     <Dialog.Title className="sr-only">Search TrueOrigin</Dialog.Title>
     <Dialog.Description className="sr-only">Search collections, cards, Pokémon, public passports, and pages. Filter by category or ecosystem.</Dialog.Description>
     <Command shouldFilter={false} label="Search TrueOrigin" className="flex min-h-0 flex-1 flex-col" vimBindings={false}>
      <div className="flex h-14 shrink-0 items-center border-b border-[#242424] sm:h-16">
       <Command.Input ref={inputRef} value={query} onValueChange={setQuery} maxLength={120} placeholder="Search TrueOrigin" aria-label="Search" className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-normal tracking-[-0.025em] text-white outline-none placeholder:text-[#777] sm:px-5 sm:text-xl" />
       <Dialog.Close aria-label="Close search" className="mr-3 grid h-8 cursor-pointer place-items-center rounded-md px-2 text-[11px] text-white/35 transition-colors hover:bg-white/5 hover:text-white sm:mr-4"><span aria-hidden="true">Esc</span></Dialog.Close>
      </div>
      <SearchResultsView results={results} loading={loading} error={error} passportsUnavailable={passportsUnavailable} query={query} onSelect={href => { changeOpen(false); router.push(href); }} />
     </Command>
    </Dialog.Popup>
   </Dialog.Viewport>
  </Dialog.Portal>
 </Dialog.Root>;
}
