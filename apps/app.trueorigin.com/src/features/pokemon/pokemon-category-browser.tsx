"use client";

import { useState } from "react";
import { FilterPanel } from "@/components/ui/filter-panel";
import { EditorialFilter } from "@/components/ui/editorial-filter";
import { ExploreCard } from "@/features/reference/explore-card";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { CatalogSkeleton } from "@/features/shell/loading-skeleton";

type Collection = { id: string; name: string; series: string; href: string; image?: string; description: string };
export function PokemonCollectionBrowser({ collections, series, loading = false, loadingCount = 1 }: { collections: Collection[]; series: string[]; loading?: boolean; loadingCount?: number }) {
 const [selected, setSelected] = useState("all");
 const visible = collections.filter(item => selected === "all" || item.series === selected);
 return <>
  <FilterPanel resultCount={loading ? undefined : visible.length} canReset={selected !== "all"} onReset={() => setSelected("all")}>
   <EditorialFilter label="Series" value={selected} onChange={setSelected} options={[{ value: "all", label: "All" }, ...series.map(value => ({ value, label: value }))]} />
  </FilterPanel>
  <div className="mt-6">{loading ? <CatalogSkeleton variant="sets" count={loadingCount} /> : visible.length ? <ul aria-label="Card collections" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
   {visible.map(item => <li key={item.id}><ExploreCard name={item.name} brand={item.series} href={item.href} alt={item.name} image={item.image} description={item.description} placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} sizes="(min-width: 1024px) 16.67vw, (min-width: 640px) 33vw, 50vw" /></li>)}
  </ul> : <p className="py-16 text-center text-sm text-white/45">No matching collections. Try another search or filter.</p>}</div>
 </>;
}
