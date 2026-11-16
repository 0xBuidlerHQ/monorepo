"use client";

import { addTransitionType, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PokedexSearchField, SharedPokedexSearch, SharedSealedSearch } from "./pokedex-search";

export function PokemonSectionSearch({ category }: { category: string }) {
 return category === "pokedex" ? <SharedPokedexSearch /> : category === "sealed" ? <SharedSealedSearch /> : <SectionSearch key={category} category={category} />;
}

function SectionSearch({ category }: { category: string }) {
 const router = useRouter();
 const [query, setQuery] = useState("");
 const [pending, startTransition] = useTransition();
 const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 useEffect(() => {
  setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  return () => clearTimeout(timer.current);
 }, []);
 function search(value: string) {
  setQuery(value);
  clearTimeout(timer.current);
  timer.current = setTimeout(() => {
   const url = new URL(window.location.href);
   if (value) url.searchParams.set("q", value); else url.searchParams.delete("q");
   url.searchParams.delete("page");
   startTransition(() => {
    addTransitionType("catalog-search");
    router.replace(url.pathname + url.search + url.hash, { scroll: false });
   });
  }, 200);
 }
 return <search aria-busy={pending}><PokedexSearchField query={query} setQuery={search} label={category === "sealed" ? "Search sealed products" : "Search collections or cards"} /></search>;
}
