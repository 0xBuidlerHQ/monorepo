import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleList } from "@/components/article-list";
import { contentLocales, isContentLocale } from "@/lib/locales";
import { formatTagLabel, messages } from "@/lib/messages";
import { getThoughts, getThoughtTags } from "@/lib/thoughts";

export const ensureStatic = "navigation";
export function generateStaticParams() {
	const params = contentLocales.flatMap((locale) =>
		getThoughtTags(locale).map((tag) => ({ locale, tag })),
	);
	return params.length ? params : [{ locale: "en", tag: "__empty__" }];
}
export async function generateMetadata({
	params,
}: PageProps<"/[locale]/thoughts/tags/[tag]">): Promise<Metadata> {
	const { locale, tag } = await params;
	if (!isContentLocale(locale) || !getThoughtTags(locale).includes(tag))
		notFound();
	return {
		title: `${formatTagLabel(tag, locale)} — ${messages[locale].thoughts} | 0xhq`,
	};
}
async function TaggedContent({
	params,
}: PageProps<"/[locale]/thoughts/tags/[tag]">) {
	const { locale, tag } = await params;
	if (!isContentLocale(locale)) notFound();
	const entries = getThoughts(locale).filter((entry) =>
		entry.tags.includes(tag),
	);
	if (!entries.length) notFound();
	return (
		<section className="w-full min-w-0 py-12">
			<Link
				href={`/${locale}/thoughts`}
				className="text-sm underline underline-offset-4"
			>
				{messages[locale].allThoughts}
			</Link>
			<h1 className="thought-title mt-6 text-4xl sm:text-5xl">
				{formatTagLabel(tag, locale)}
			</h1>
			<ArticleList
				entries={entries}
				basePath={`/${locale}/thoughts`}
				emptyMessage={messages[locale].noArticles}
			/>
		</section>
	);
}
export default function TaggedPage(
	props: PageProps<"/[locale]/thoughts/tags/[tag]">,
) {
	return (
		<Suspense fallback={null}>
			<TaggedContent {...props} />
		</Suspense>
	);
}
