import { Suspense } from "react";
import { CatalogLanguageSelector } from "@/features/reference/catalog-language-selector";
import { ContentSurface } from "@/features/shell/content-surface";
import { LiveCatalogSearch } from "@/features/reference/live-catalog-search";
import type { ReactNode } from "react";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";

export function CatalogToolbar({ title, category, count, query, subcategory, searchPlaceholder, children }: {
	title: string;
	category: string;
	count?: number;
	query?: string;
	subcategory?: string;
	searchPlaceholder?: string;
	children?: ReactNode;
}) {
	return <ContentSurface className="rounded-[28px] bg-gradient-to-br from-[#202020] to-[#191919] p-5 shadow-[inset_0_1px_0_#ffffff06] sm:p-6">
		<header className="flex flex-wrap items-center justify-between gap-5">
			<div className="flex items-center gap-3">
				<span className="flex size-10 items-center justify-center rounded-2xl bg-white/5 text-white/65"><CatalogCategoryIcon category={category} /></span>
				<h2 className="text-2xl font-medium tracking-[-0.045em] sm:text-[28px]">{title}</h2>
				{count !== undefined && <p role="status" aria-label={`${count.toLocaleString("en-US")} results`} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] tabular-nums text-white/40">{count.toLocaleString("en-US")}</p>}
			</div>
			<div className="flex flex-wrap items-center gap-3">{["cards", "sets"].includes(category) && <Suspense fallback={null}><CatalogLanguageSelector /></Suspense>}{query !== undefined && <LiveCatalogSearch key={`${category}:${subcategory ?? ""}`} query={query} placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}…`} />}</div>
		</header>
		{children && <div className="mt-5 overflow-x-auto rounded-2xl bg-black/15 p-1.5">{children}</div>}
	</ContentSurface>;
}
