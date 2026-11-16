import { PageLayout } from "@/features/shell/page-layout";
import { ContentSurface } from "@/features/shell/content-surface";
import Link from "next/link";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";

export function TradingPanel({ mode }: { mode?: string }) {
	const selling = mode === "sell";
	return (
		<PageLayout title="Trading" actions={<nav aria-label="Buy or sell" className="inline-flex gap-1 rounded-full bg-white/5 p-1">
					{["buy", "sell"].map((entry) => <Link key={entry} href={`/trading?mode=${entry}`} scroll={false} aria-current={(selling ? "sell" : "buy") === entry ? "page" : undefined} className={`rounded-full px-6 py-2 text-sm transition-colors ${(selling ? "sell" : "buy") === entry ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>{entry === "buy" ? "Buy" : "Sell"}</Link>)}
				</nav>}>

			<ContentSurface className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-[#1c1c1c] px-6 py-12 text-center">
				<div className="mb-5 flex size-12 items-center justify-center rounded-full bg-white/5 text-white/50"><CatalogCategoryIcon category="trading" /></div>
				<p className="mb-3 text-xs text-white/40">Coming soon</p>
				<h3 className="text-2xl font-medium tracking-tight">{selling ? "Your collection, a new chapter." : "Your next discovery is on its way."}</h3>
				<p className="mt-3 max-w-sm text-sm leading-6 text-white/50">{selling ? "Selling isn’t available yet. Your collection will be the starting point for listing an item." : "There are no live listings yet. Explore the catalog while the marketplace takes shape."}</p>
				<Link href={selling ? "/collection" : "/explore"} className="mt-7 rounded-full bg-white px-6 py-3 text-sm text-black transition-colors hover:bg-white/85">{selling ? "View collection" : "Explore items"} <span aria-hidden="true" className="ml-3">↗</span></Link>
			</ContentSurface>
		</PageLayout>
	);
}
