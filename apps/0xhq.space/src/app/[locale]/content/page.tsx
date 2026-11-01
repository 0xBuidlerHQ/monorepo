import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentLocales, isContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";

export const ensureStatic = "navigation";

export function generateStaticParams() {
	return contentLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/content">): Promise<Metadata> {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	return {
		title: `0xhq | ${messages[locale].content}`,
		alternates: {
			canonical: `/${locale}/content`,
			languages: Object.fromEntries(
				contentLocales.map((language) => [language, `/${language}/content`]),
			),
		},
	};
}

export default async function ContentPage({
	params,
}: PageProps<"/[locale]/content">) {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	const t = messages[locale];
	return (
		<section className="w-full min-w-0 py-12">
			<h1 className="thought-title text-5xl sm:text-6xl">{t.content}</h1>
			<p className="mt-8 border-y border-foreground/10 py-8 text-sm text-foreground/50">
				{t.noContent}
			</p>
		</section>
	);
}
