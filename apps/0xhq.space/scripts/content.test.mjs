import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getEntries } from "../src/lib/content.ts";
import { contentLocales } from "../src/lib/locales.ts";

const checkScript = path.resolve(import.meta.dirname, "check-translations.mjs");

function withArticle(run) {
	const original = process.cwd();
	const temporary = mkdtempSync(path.join(os.tmpdir(), "0xhq-content-"));
	const directory = path.join(temporary, "content/learn/example");
	mkdirSync(directory, { recursive: true });
	const writeMeta = (metadata) =>
		writeFileSync(path.join(directory, "meta.json"), JSON.stringify(metadata));
	const writeLanguage = (locale, header = "") =>
		writeFileSync(
			path.join(directory, `${locale}.md`),
			`---\ntitle: ${locale === "fr" ? "Exemple" : "Example"}\n${header}---\n\n${locale === "fr" ? "Texte français." : "English body."}`,
		);
	const metadata = { date: "2026-10-25", tags: ["tech"], draft: false };
	writeMeta(metadata);
	writeLanguage("en");
	try {
		process.chdir(temporary);
		run({ directory, writeMeta, writeLanguage, metadata });
	} finally {
		process.chdir(original);
		rmSync(temporary, { recursive: true, force: true });
	}
}

test("metadata is shared between languages and updates both versions", () =>
	withArticle(({ writeMeta, writeLanguage, metadata }) => {
		assert.deepEqual(getEntries("learn", "fr"), []);
		for (const locale of contentLocales.filter((locale) => locale !== "en"))
			writeLanguage(locale);
		assert.equal(getEntries("learn")[0].slug, "example");
		writeMeta({
			...metadata,
			slug: "custom-url",
			date: "2026-10-31",
			tags: ["building", "tech", "tech"],
		});
		for (const locale of contentLocales) {
			const entry = getEntries("learn", locale)[0];
			assert.equal(entry.slug, "custom-url");
			assert.equal(entry.date, "2026-10-31");
			assert.deepEqual(entry.tags, ["building", "tech"]);
			assert.equal(entry.locale, locale);
		}
		assert.equal(
			getEntries("learn", "fr")[0].content,
			"# Exemple\n\nTexte français.",
		);
		assert.equal(getEntries("learn")[0].title, "Example");
	}));

test("shared drafts hide all languages; language drafts are independent", () =>
	withArticle(({ writeMeta, writeLanguage, metadata }) => {
		writeLanguage("fr", "draft: true\n");
		assert.equal(getEntries("learn").length, 1);
		assert.deepEqual(getEntries("learn", "fr"), []);
		writeLanguage("fr", "draft: false\n");
		writeLanguage("en", "draft: true\n");
		assert.deepEqual(getEntries("learn"), []);
		assert.equal(getEntries("learn", "fr").length, 1);
		writeMeta({ draft: true });
		assert.deepEqual(getEntries("learn"), []);
		assert.deepEqual(getEntries("learn", "fr"), []);
		writeMeta({ ...metadata, draft: false });
		assert.equal(getEntries("learn", "fr").length, 1);
	}));

test("invalid shared metadata and duplicate front-matter fields are rejected", () =>
	withArticle(({ directory, writeMeta, writeLanguage, metadata }) => {
		for (const date of ["2026-02-30", "bad-date", undefined]) {
			writeMeta({ ...metadata, date });
			assert.throws(() => getEntries("learn"), /valid date/);
		}
		writeMeta({ ...metadata, draft: "false" });
		assert.throws(() => getEntries("learn"), /draft must be/);
		writeMeta({ ...metadata, tags: [12] });
		assert.throws(() => getEntries("learn"), /tags must be/);
		writeMeta(metadata);
		writeLanguage("fr", "slug: different\n");
		assert.throws(() => getEntries("learn", "fr"), /slug belongs in meta.json/);
		writeFileSync(path.join(directory, "meta.json"), "null");
		assert.throws(() => getEntries("learn"), /JSON object/);
		writeFileSync(path.join(directory, "meta.json"), "{");
		assert.throws(() => getEntries("learn"), /invalid JSON/);
	}));

test("source revision check fails when the English source changes", () => {
	const temporary = mkdtempSync(path.join(os.tmpdir(), "0xhq-revisions-"));
	try {
		const source = "English source.";
		const revision = createHash("sha256").update(source).digest("hex");
		writeFileSync(path.join(temporary, "en.md"), source);
		writeFileSync(
			path.join(temporary, "fr.md"),
			`---\nsourceRevision: ${revision}\n---\nTraduction.`,
		);
		const run = () =>
			spawnSync(process.execPath, [checkScript, temporary], {
				encoding: "utf8",
			});
		assert.equal(run().status, 0);
		writeFileSync(path.join(temporary, "en.md"), "Updated English source.");
		const stale = run();
		assert.equal(stale.status, 1);
		assert.match(stale.stderr, /Needs translation review/);
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
});

test("SEO descriptions and image alt text are localized; cover images and updates are shared", () =>
	withArticle(({ writeMeta, writeLanguage, metadata }) => {
		writeMeta({
			...metadata,
			image: "/images/example.jpg",
			updated: "2026-10-30",
		});
		writeLanguage(
			"en",
			"description: An English summary.\nimageAlt: The English image label.\n",
		);
		writeLanguage(
			"fr",
			"description: Un résumé français.\nimageAlt: La légende française.\n",
		);
		const english = getEntries("learn", "en")[0];
		const french = getEntries("learn", "fr")[0];
		assert.equal(english.description, "An English summary.");
		assert.equal(french.description, "Un résumé français.");
		assert.equal(french.imageAlt, "La légende française.");
		assert.equal(english.image, "/images/example.jpg");
		assert.equal(french.image, english.image);
		assert.equal(french.updated, "2026-10-30");
		writeLanguage("fr", "description: [not, text]\n");
		assert.throws(
			() => getEntries("learn", "fr"),
			/description must be a string/,
		);
	}));

test("invalid SEO images and modified dates are rejected", () =>
	withArticle(({ writeMeta, writeLanguage, metadata }) => {
		for (const image of [
			"//example.com/image.png",
			"/\\example.com/image.jpg",
			"/../image.png",
			"/image.svg",
			"https://example.com/image.jpg",
		]) {
			writeMeta({ ...metadata, image });
			assert.throws(() => getEntries("learn"), /image must be a local/);
		}
		for (const updated of ["2026-02-30", "2026-10-24", "not-a-date"]) {
			writeMeta({ ...metadata, updated });
			assert.throws(() => getEntries("learn"), /updated must be a valid/);
		}
		writeMeta(metadata);
		writeLanguage("en", "image: /cover.jpg\n");
		assert.throws(() => getEntries("learn"), /image belongs in meta.json/);
	}));

test("interface dictionaries have matching keys and dates use the selected locale", async () => {
	const { messages } = await import("../src/lib/messages.ts");
	const { formatPublicationDate } = await import("../src/lib/dates.ts");
	for (const locale of contentLocales) {
		assert.deepEqual(
			Object.keys(messages.en).sort(),
			Object.keys(messages[locale]).sort(),
		);
	}
	assert.equal(messages.fr.learn, "Apprendre");
	assert.equal(
		formatPublicationDate("2026-10-25", "es"),
		"25 de octubre de 2026",
	);
	assert.equal(
		formatPublicationDate("2026-10-25", "pt"),
		"25 de outubro de 2026",
	);
	assert.equal(formatPublicationDate("2026-10-25", "fr"), "25 octobre 2026");
	assert.equal(formatPublicationDate("2026-10-25", "en"), "25 October 2026");
});

test("Learn articles and glossaries link to published content in every language", () => {
	const entriesByLocale = Object.fromEntries(
		contentLocales.map((locale) => [locale, getEntries("learn", locale)]),
	);
	const slugsByLocale = Object.fromEntries(
		Object.entries(entriesByLocale).map(([locale, entries]) => [
			locale,
			new Set(entries.map((entry) => entry.slug)),
		]),
	);
	const glossaries = Object.fromEntries(
		contentLocales.map((locale) => [
			locale,
			readFileSync(
				path.resolve(import.meta.dirname, `../content/glossary/${locale}.md`),
				"utf8",
			),
		]),
	);
	const termsByLocale = Object.fromEntries(
		Object.entries(glossaries).map(([locale, content]) => [
			locale,
			new Set(
				[...content.matchAll(/^## (.+)$/gm)].map((match) => {
					const explicit = match[1].match(/\{#([a-z0-9-]+)\}$/);
					return (
						explicit?.[1] ??
						match[1]
							.toLowerCase()
							.replace(/[^a-z0-9]+/g, "-")
							.replace(/^-|-$/g, "")
					);
				}),
			),
		]),
	);
	for (const locale of contentLocales) {
		assert(entriesByLocale[locale].length > 0);
		const documents = [
			...entriesByLocale[locale].map((entry) => ({
				name: entry.slug,
				content: entry.content,
			})),
			{ name: "glossary", content: glossaries[locale] },
		];
		for (const document of documents) {
			for (const match of document.content.matchAll(
				/\]\(\/(en|fr|es|pt)\/learn\/([^#)]+)(?:#[^)]*)?\)/g,
			)) {
				assert(
					slugsByLocale[match[1]].has(match[2]),
					`${locale}/${document.name}: missing article ${match[2]}`,
				);
			}
			for (const match of document.content.matchAll(
				/\]\(\/(en|fr|es|pt)\/glossary#([^)]+)\)/g,
			)) {
				assert(
					termsByLocale[match[1]].has(match[2]),
					`${locale}/${document.name}: missing glossary term ${match[2]}`,
				);
			}
		}
	}
});

test("every published source has translations and animation targets in all languages", () => {
	const slug = (text) =>
		text
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	for (const collection of ["learn", "ideas", "thoughts"]) {
		const sources = getEntries(collection, "en");
		for (const locale of contentLocales) {
			const entries = getEntries(collection, locale);
			assert.deepEqual(
				entries.map((entry) => entry.slug).sort(),
				sources.map((entry) => entry.slug).sort(),
			);
			for (const entry of entries) {
				const headings = new Set([
					"article-title",
					...[...entry.content.matchAll(/^###? (.+)$/gm)].map((match) =>
						slug(match[1]),
					),
				]);
				for (const animation of entry.animations ?? []) {
					assert(
						headings.has(animation.afterHeading),
						`${locale}/${entry.slug}: animation targets missing heading ${animation.afterHeading}`,
					);
					assert(animation.caption.length > 0);
				}
				const source = sources.find((source) => source.slug === entry.slug);
				assert.equal(
					(entry.animations ?? []).length,
					(source.animations ?? []).length,
				);
				for (const match of entry.content.matchAll(/\]\(\/(en|fr|es|pt)\//g)) {
					assert.equal(
						match[1],
						locale,
						`${locale}/${entry.slug}: link crosses languages`,
					);
				}
			}
		}
	}
});
