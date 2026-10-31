import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReferenceContent } from "@/components/article";
import { ArticleOutline } from "@/components/article-outline";
import { isContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import {
	getGlossary,
	getGlossaryFigures,
	glossaryLanguages,
} from "@/lib/translations";

export const ensureStatic = "navigation";
export function generateStaticParams() {
	return glossaryLanguages().map(({ locale }) => ({ locale }));
}
export async function generateMetadata({
	params,
}: PageProps<"/[locale]/glossary">): Promise<Metadata> {
	const { locale } = await params;
	if (!isContentLocale(locale) || getGlossary(locale) === undefined) notFound();
	return {
		title: `${messages[locale].glossary} | 0xhq`,
		alternates: {
			canonical: `/${locale}/glossary`,
			languages: Object.fromEntries(
				glossaryLanguages().map(({ locale, href }) => [locale, href]),
			),
		},
	};
}
async function GlossaryContent({ params }: PageProps<"/[locale]/glossary">) {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	const content = getGlossary(locale);
	if (content === undefined) notFound();
	return (
		<article lang={locale} className="w-full min-w-0 py-12">
			<ArticleOutline key={locale} side="right" mobileNavigation>
				<ReferenceContent content={content} figures={getGlossaryFigures()} />
			</ArticleOutline>
		</article>
	);
}
export default function LocalizedGlossary(
	props: PageProps<"/[locale]/glossary">,
) {
	return (
		<Suspense fallback={null}>
			<GlossaryContent {...props} />
		</Suspense>
	);
}
