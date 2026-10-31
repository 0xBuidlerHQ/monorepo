import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { getEntries, type HairlineFigure, hairlineFigures } from "./content";
import {
	type ContentLocale,
	contentLocales,
	type TranslatedCollection,
} from "./locales";

export function articleLanguages(
	collection: TranslatedCollection,
	slug: string,
) {
	return contentLocales.flatMap((locale) =>
		getEntries(collection, locale).some((entry) => entry.slug === slug)
			? [{ locale, href: `/${locale}/${collection}/${slug}` }]
			: [],
	);
}

export function articleAlternates(
	collection: TranslatedCollection,
	slug: string,
	locale: ContentLocale,
): Metadata["alternates"] {
	const languages = Object.fromEntries(
		articleLanguages(collection, slug).map(({ locale, href }) => [
			locale,
			href,
		]),
	);
	return { canonical: `/${locale}/${collection}/${slug}`, languages };
}

export function getGlossary(locale: ContentLocale = "en") {
	const filename = path.join(
		process.cwd(),
		"content",
		"glossary",
		`${locale}.md`,
	);
	if (!existsSync(filename)) return undefined;
	const { data, content } = matter(readFileSync(filename, "utf8"));
	if (data.draft !== undefined && typeof data.draft !== "boolean") {
		throw new Error(`${filename}: draft must be true or false.`);
	}
	return data.draft === true ? undefined : content;
}

export function glossaryLanguages() {
	return contentLocales.flatMap((locale) =>
		getGlossary(locale) !== undefined
			? [{ locale, href: `/${locale}/glossary` }]
			: [],
	);
}

export function contentLanguageRoutes() {
	const routes: Record<string, ContentLocale[]> = {
		"/": [...contentLocales],
		"/learn": [...contentLocales],
		"/thoughts": [...contentLocales],
		"/ideas": [...contentLocales],
		"/about": [...contentLocales],
		"/glossary": glossaryLanguages().map(({ locale }) => locale),
	};
	for (const locale of contentLocales) {
		for (const collection of ["learn", "thoughts", "ideas"] as const) {
			for (const entry of getEntries(collection, locale)) {
				const key = `/${collection}/${entry.slug}`;
				routes[key] ??= [];
				routes[key].push(locale);
				if (collection === "thoughts") {
					for (const tag of entry.tags ?? []) {
						const tagKey = `/thoughts/tags/${encodeURIComponent(tag)}`;
						routes[tagKey] ??= [];
						if (!routes[tagKey].includes(locale)) routes[tagKey].push(locale);
					}
				}
			}
		}
	}
	return routes;
}

export function getGlossaryFigures(): Record<string, HairlineFigure> {
	const filename = path.join(process.cwd(), "content/glossary/meta.json");
	const metadata = JSON.parse(readFileSync(filename, "utf8"));
	const figures: Record<string, HairlineFigure> = {};
	for (const [id, figure] of Object.entries(metadata.animations)) {
		if (
			!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
			!hairlineFigures.some((name) => name === figure)
		)
			throw new Error(`${filename}: invalid glossary animation for ${id}.`);
		figures[id] = figure as HairlineFigure;
	}
	return figures;
}
