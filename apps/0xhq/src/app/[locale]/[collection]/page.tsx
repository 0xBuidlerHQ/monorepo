import { messages } from "@/lib/messages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleList } from "@/components/article-list";
import { getEntries } from "@/lib/content";
import {
	contentLocales,
	isContentLocale,
	isTranslatedCollection,
} from "@/lib/locales";

export const ensureStatic = "navigation";
export function generateStaticParams() {
	return contentLocales.flatMap((locale) =>
		["learn", "thoughts", "ideas"].map((collection) => ({
			locale,
			collection,
		})),
	);
}
export async function generateMetadata({
	params,
}: PageProps<"/[locale]/[collection]">): Promise<Metadata> {
	const { locale, collection } = await params;
	if (!isContentLocale(locale) || !isTranslatedCollection(collection))
		notFound();
	return { title: `${messages[locale][collection]} | 0xhq` };
}
async function ContentIndex({ params }: PageProps<"/[locale]/[collection]">) {
	const { locale, collection } = await params;
	if (!isContentLocale(locale) || !isTranslatedCollection(collection))
		notFound();
	const entries = getEntries(collection, locale).sort(
		(a, b) =>
			(b.date ?? "").localeCompare(a.date ?? "") ||
			a.title.localeCompare(b.title),
	);

	return (
		<section className="w-full min-w-0 py-12">
			<h1 className="thought-title text-5xl sm:text-6xl">
				{messages[locale][collection]}
			</h1>
			<div lang={locale}>
				<ArticleList
					entries={entries}
					basePath={`/${locale}/${collection}`}
					emptyMessage={messages[locale].noArticles}
				/>
			</div>
		</section>
	);
}
export default function LocalizedIndex(
	props: PageProps<"/[locale]/[collection]">,
) {
	return (
		<Suspense fallback={null}>
			<ContentIndex {...props} />
		</Suspense>
	);
}
