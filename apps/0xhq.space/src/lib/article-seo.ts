import type { Metadata } from "next";
import type { ContentEntry } from "./content.ts";
import { type TranslatedCollection, localeRegions } from "./locales.ts";
import { absoluteUrl, shareImageSize, site } from "./site.ts";

export function articleTitle(title: string) {
	return title
		.replace(/\[\s*([^\]]+?)\s*\]/g, "$1")
		.replace(/\s+/g, " ")
		.trim();
}

export function articleDescription(entry: ContentEntry) {
	if (entry.description) return entry.description;
	const text = entry.content
		.replace(/^#{1,6}\s+.*$/gm, "")
		.replace(/```[\s\S]*?```/g, "")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]*>/g, "")
		.replace(/[\\*_`~|]/g, "")
		.replace(/\s+/g, " ")
		.trim();
	if (text.length <= 160) return text || articleTitle(entry.title);
	return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export function articlePath(
	entry: ContentEntry,
	collection: TranslatedCollection,
) {
	return `/${entry.locale ?? "en"}/${collection}/${entry.slug}`;
}

export function articleImage(
	entry: ContentEntry,
	collection: TranslatedCollection,
) {
	return {
		url: absoluteUrl(
			entry.image ?? `${articlePath(entry, collection)}/share-image`,
		),
		alt: entry.imageAlt ?? articleTitle(entry.title),
		...(!entry.image ? { ...shareImageSize, type: "image/png" } : {}),
	};
}

export function articleMetadata(
	entry: ContentEntry,
	collection: TranslatedCollection,
	alternates: Metadata["alternates"],
): Metadata {
	const title = articleTitle(entry.title);
	const description = articleDescription(entry);
	const image = articleImage(entry, collection);
	return {
		title: `${title} | ${site.name}`,
		description,
		authors: [
			{ name: site.author, url: absoluteUrl(`/${entry.locale ?? "en"}`) },
		],
		alternates,
		openGraph: {
			type: "article",
			siteName: site.name,
			title,
			description,
			url: absoluteUrl(articlePath(entry, collection)),
			images: [image],
			publishedTime: entry.date,
			modifiedTime: entry.updated,
			authors: [absoluteUrl(`/${entry.locale ?? "en"}`)],
			tags: entry.tags,
			locale: localeRegions[entry.locale ?? "en"].replace("-", "_"),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [{ url: image.url, alt: image.alt }],
		},
	};
}

export function articleStructuredData(
	entry: ContentEntry,
	collection: TranslatedCollection,
) {
	const url = absoluteUrl(articlePath(entry, collection));
	return {
		"@context": "https://schema.org",
		"@type": collection === "thoughts" ? "BlogPosting" : "Article",
		"@id": `${url}#article`,
		url,
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		headline: articleTitle(entry.title),
		description: articleDescription(entry),
		image: [articleImage(entry, collection).url],
		datePublished: entry.date,
		dateModified: entry.updated,
		inLanguage: localeRegions[entry.locale ?? "en"],
		author: {
			"@type": "Person",
			name: site.author,
			url: absoluteUrl(`/${entry.locale ?? "en"}`),
		},
	};
}

export function serializeJsonLd(value: unknown) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
