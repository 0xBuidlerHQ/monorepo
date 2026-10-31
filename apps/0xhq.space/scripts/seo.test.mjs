import assert from "node:assert/strict";
import test from "node:test";
import {
	articleDescription,
	articleImage,
	articleMetadata,
	articleStructuredData,
	serializeJsonLd,
} from "../src/lib/article-seo.ts";

const entry = {
	slug: "example",
	title: "[ Blockchain ] 101",
	content:
		"# [ Blockchain ] 101\n\nA **clear** introduction with [a reference](/en/glossary).\n\n![Image](/cover.jpg)",
	locale: "en",
	date: "2026-10-25",
};

test("articles without an editorial description get a plain-text excerpt", () => {
	assert.equal(
		articleDescription(entry),
		"A clear introduction with a reference.",
	);
	const long = articleDescription({
		...entry,
		content: `# Heading\n\n${"Useful information. ".repeat(20)}`,
	});
	assert.ok(long.length <= 160);
	assert.ok(long.endsWith("…"));
	assert.equal(
		articleDescription({ ...entry, description: "An editorial summary." }),
		"An editorial summary.",
	);
});

test("article metadata and structured data agree on identity, image, language, and dates", () => {
	const french = {
		...entry,
		locale: "fr",
		updated: "2026-10-30",
		description: "Un résumé français.",
	};
	const metadata = articleMetadata(french, "learn", {
		canonical: "/fr/learn/example",
	});
	const schema = articleStructuredData(french, "learn");
	assert.equal(metadata.title, "Blockchain 101 | 0xhq.space");
	assert.equal(metadata.description, french.description);
	assert.equal(metadata.openGraph.locale, "fr_FR");
	assert.equal(metadata.twitter.card, "summary_large_image");
	assert.equal(schema.inLanguage, "fr-FR");
	assert.equal(schema.datePublished, entry.date);
	assert.equal(schema.dateModified, french.updated);
	assert.equal(schema.url, metadata.openGraph.url);
	assert.equal(schema.image[0], metadata.openGraph.images[0].url);
	assert.equal(schema.image[0], metadata.twitter.images[0].url);
	assert.ok(schema.image[0].endsWith("/fr/learn/example/share-image"));
	assert.equal(schema.author.name, "Maxime");
});

test("a custom article image replaces the generated card in all metadata", () => {
	const custom = {
		...entry,
		image: "/images/example.jpg",
		imageAlt: "An illustrated example.",
	};
	const image = articleImage(custom, "learn");
	const schema = articleStructuredData(custom, "learn");
	assert.ok(image.url.endsWith("/images/example.jpg"));
	assert.equal(image.alt, custom.imageAlt);
	assert.equal(image.width, undefined);
	assert.equal(schema.image[0], image.url);
});

test("JSON-LD cannot close its script element with article text", () => {
	const malicious = {
		...entry,
		description: '</script><script>alert("x")</script>',
	};
	const schema = articleStructuredData(malicious, "thoughts");
	const serialized = serializeJsonLd(schema);
	assert.ok(!serialized.includes("<"));
	assert.deepEqual(JSON.parse(serialized), JSON.parse(JSON.stringify(schema)));
	assert.equal(schema["@type"], "BlogPosting");
});
