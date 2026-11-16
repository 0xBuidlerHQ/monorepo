"use client";

import { Suspense, addTransitionType, startTransition } from "react";
import { useSearchParams } from "next/navigation";
import { PokedexSearchField } from "./pokedex-search";

function SearchField() {
 const params = useSearchParams();
 return <PokedexSearchField query={params.get("q") ?? ""} label="Search cards by name, number, or illustrator" setQuery={(value) => {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set("q", value); else url.searchParams.delete("q");
  url.searchParams.delete("page");
  startTransition(() => {
   addTransitionType("catalog-filter");
   window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  });
 }} />;
}

export function SetCardSearch() {
 return <Suspense fallback={null}><SearchField /></Suspense>;
}
