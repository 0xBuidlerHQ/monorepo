import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent, ArticleLayout } from "@/components/article";
import { ArticleNavigation } from "@/components/article-navigation";
import { getEntries } from "@/lib/content";
import {
	contentLocales,
	isContentLocale,
	isTranslatedCollection,
	localeRegions,
} from "@/lib/locales";
import { articleAlternates } from "@/lib/translations";

export const ensureStatic = "navigation";

export function generateStaticParams() {
	return contentLocales.flatMap((locale) =>
		(["learn", "thoughts", "ideas"] as const).flatMap((collection) =>
			getEntries(collection, locale).map(({ slug }) => ({
				locale,
				collection,
				slug,
			})),
		),
	);
}

async function resolveEntry(
	params: PageProps<"/[locale]/[collection]/[slug]">["params"],
) {
	const { locale, collection, slug } = await params;
	if (!isContentLocale(locale) || !isTranslatedCollection(collection))
		notFound();
	const entry = getEntries(collection, locale).find(
		(entry) => entry.slug === slug,
	);
	if (!entry) notFound();
	return { entry, locale, collection, slug };
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/[collection]/[slug]">): Promise<Metadata> {
	const { entry, locale, collection, slug } = await resolveEntry(params);
	return {
		title: `0xhq | ${entry.title}`,
		alternates: articleAlternates(collection, slug, locale),
		openGraph: {
			type: "article",
			title: entry.title,
			publishedTime: entry.date,
			locale: localeRegions[locale].replace("-", "_"),
		},
	};
}

async function LocalizedContent({
	params,
}: PageProps<"/[locale]/[collection]/[slug]">) {
	const { entry, collection, locale } = await resolveEntry(params);
	return (
		<>
			<ArticleContent entry={entry} />
			<ArticleNavigation
				entry={entry}
				collection={collection}
				locale={locale}
			/>
		</>
	);
}

export default function LocalizedArticle(
	props: PageProps<"/[locale]/[collection]/[slug]">,
) {
	return (
		<ArticleLayout>
			<LocalizedContent {...props} />
		</ArticleLayout>
	);
}
