"use client";
import { openSearchDrawer } from "@/features/navigation/open-search";
import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

type SearchState = { query: string; setQuery: Dispatch<SetStateAction<string>> };
const PokedexSearchContext = createContext<SearchState | null>(null);
const SealedSearchContext = createContext<SearchState | null>(null);
export function PokedexSearchProvider({ children }: { children: ReactNode }) {
 const [query, setQuery] = useState("");
 const [sealedQuery, setSealedQuery] = useState("");
 return <PokedexSearchContext.Provider value={{ query, setQuery }}><SealedSearchContext.Provider value={{ query: sealedQuery, setQuery: setSealedQuery }}>{children}</SealedSearchContext.Provider></PokedexSearchContext.Provider>;
}
export function usePokedexSearch() { return useContext(PokedexSearchContext); }
export function PokedexSearchField({ query, label = "Search Pokémon by name or number" }: { query: string; setQuery: (value: string) => void; label?: string }) {
 return <button type="button" onClick={openSearchDrawer} aria-label={`${label} (Command K or Control K)`} aria-haspopup="dialog" className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-2xl bg-black/20 px-4 text-left ring-1 ring-white/[0.06] transition-colors hover:bg-black/30 sm:w-80">
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-white/40"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
  <span className={`min-w-0 flex-1 truncate text-sm ${query ? "text-white" : "text-white/30"}`}>{query || "Search…"}</span>
  <kbd className="shrink-0 rounded-md border border-white/10 px-1.5 py-1 font-mono text-[10px] leading-none text-white/35">⌘ K</kbd>
 </button>;
}
export function SharedPokedexSearch() {
 const search = usePokedexSearch();
 return search ? <PokedexSearchField {...search} /> : null;
}

export function useSealedSearch() { return useContext(SealedSearchContext); }
export function SharedSealedSearch() {
 const search = useSealedSearch();
 useEffect(() => {
  const query = new URLSearchParams(window.location.search).get("q") ?? "";
  search?.setQuery(query);
 }, [search?.setQuery]);
 return search ? <PokedexSearchField {...search} label="Search sealed products" /> : null;
}
