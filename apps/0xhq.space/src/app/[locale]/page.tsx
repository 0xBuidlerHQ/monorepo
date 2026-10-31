import { notFound } from "next/navigation";
import { Suspense } from "react";
import { contentLocales, isContentLocale } from "@/lib/locales";
export function generateStaticParams() {
	return contentLocales.map((locale) => ({ locale }));
}
async function Home({ params }: PageProps<"/[locale]">) {
	if (!isContentLocale((await params).locale)) notFound();
	return null;
}
export default function LocalizedHome(props: PageProps<"/[locale]">) {
	return (
		<Suspense fallback={null}>
			<Home {...props} />
		</Suspense>
	);
}
