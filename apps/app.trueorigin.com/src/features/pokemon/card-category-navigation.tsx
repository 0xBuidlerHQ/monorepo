import Link from "next/link";
import { cardCategories } from "./card-categories";
import type { CatalogLanguage } from "@/features/reference/catalog-language";

export function CardCategoryNavigation({ active, query, language }: { active: string; query: string; language: CatalogLanguage }) {
	return <nav aria-label="Card subcategories" className="flex min-w-max gap-1">{cardCategories.map((entry) => <Link key={entry.id} href={`/explore/pokemon?${new URLSearchParams({ lang: language, category: "cards", subcategory: entry.id, ...(query ? { q: query } : {}) })}`} scroll={false} aria-current={entry.id === active ? "page" : undefined} className={`shrink-0 rounded-xl px-3.5 py-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-white ${entry.id === active ? "bg-[#eeeeeb] text-black shadow-sm" : "text-white/45 hover:bg-white/[0.03] hover:text-white"}`}>{entry.name}</Link>)}</nav>;
}
