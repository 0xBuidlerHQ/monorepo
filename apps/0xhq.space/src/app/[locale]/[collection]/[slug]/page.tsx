import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent, ArticleLayout } from "@/components/article";
import { ArticleNavigation } from "@/components/article-navigation";
import { getEntries } from "@/lib/content";
import {
	articleMetadata,
	articleStructuredData,
	serializeJsonLd,
} from "@/lib/article-seo";
import {
	contentLocales,
	isContentLocale,
	isTranslatedCollection,
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
	return articleMetadata(
		entry,
		collection,
		articleAlternates(collection, slug, locale),
	);
}

async function LocalizedContent({
	params,
}: PageProps<"/[locale]/[collection]/[slug]">) {
	const { entry, collection, locale } = await resolveEntry(params);
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: serializeJsonLd escapes < so article text cannot close this script.
				dangerouslySetInnerHTML={{
					__html: serializeJsonLd(articleStructuredData(entry, collection)),
				}}
			/>
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
