import { notFound } from "next/navigation";
import { getEntries } from "@/lib/content";
import { createShareImage } from "@/lib/share-image";
import {
	contentLocales,
	isContentLocale,
	isTranslatedCollection,
	translatedCollections,
} from "@/lib/locales";

export function generateStaticParams() {
	return contentLocales.flatMap((locale) =>
		translatedCollections.flatMap((collection) =>
			getEntries(collection, locale).map(({ slug }) => ({
				locale,
				collection,
				slug,
			})),
		),
	);
}

export async function GET(
	request: Request,
	{ params }: RouteContext<"/[locale]/[collection]/[slug]/share-image">,
) {
	const { locale, collection, slug } = await params;
	if (!isContentLocale(locale) || !isTranslatedCollection(collection))
		notFound();
	const entry = getEntries(collection, locale).find(
		(entry) => entry.slug === slug,
	);
	if (!entry)
		return Response.redirect(new URL("/share-image.png", request.url), 307);
	return createShareImage(entry);
}
