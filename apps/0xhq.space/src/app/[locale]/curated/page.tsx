import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCuratedProducts } from "@/lib/curated";
import { contentLocales, isContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";

export const ensureStatic = "navigation";

export function generateStaticParams() {
	return contentLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/curated">): Promise<Metadata> {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	const t = messages[locale];
	return {
		title: `0xhq | ${t.curated}`,
		description: t.curatedDescription,
		alternates: {
			canonical: `/${locale}/curated`,
			languages: Object.fromEntries(
				contentLocales.map((language) => [language, `/${language}/curated`]),
			),
		},
	};
}

export default async function CuratedPage({
	params,
}: PageProps<"/[locale]/curated">) {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	const t = messages[locale];
	const products = getCuratedProducts();
	return (
		<section className="w-full min-w-0 py-12">
			<h1 className="thought-title text-5xl sm:text-6xl">{t.curated}</h1>
			<p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/55">
				{t.curatedDescription}
			</p>
			{products.length ? (
				<div className="mt-10 sm:mt-12">
					<div className="mb-5 flex items-baseline justify-between gap-4">
						<h2
							id="curated-objects"
							className="text-xl font-medium tracking-tight"
						>
							{t.curatedObjects}
						</h2>
						<span className="font-mono text-xs text-foreground/40">
							{String(products.length).padStart(2, "0")}
						</span>
					</div>
					<ul
						aria-labelledby="curated-objects"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
					>
						{products.map((product) => (
							<ProductCard key={product.id} product={product} locale={locale} />
						))}
					</ul>
				</div>
			) : (
				<p className="mt-8 border-y border-foreground/10 py-8 text-sm text-foreground/50">
					{t.noProducts}
				</p>
			)}
		</section>
	);
}
