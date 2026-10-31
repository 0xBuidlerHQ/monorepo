import { notFound } from "next/navigation";
import { SiteDocument } from "@/components/site-document";
import { contentLocales, isContentLocale } from "@/lib/locales";
export { metadata } from "@/components/site-document";
export function generateStaticParams() {
	return contentLocales.map((locale) => ({ locale }));
}
export default async function LocalizedLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	if (!isContentLocale(locale)) notFound();
	return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
