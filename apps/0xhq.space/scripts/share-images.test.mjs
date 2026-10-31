import assert from "node:assert/strict";
import test from "node:test";
import { shareImageSize } from "../src/lib/site.ts";

const baseUrl = process.env.SHARE_IMAGE_BASE_URL || "http://127.0.0.1:3000";

async function fetchPng(path) {
	const response = await fetch(new URL(path, baseUrl), {
		signal: AbortSignal.timeout(30_000),
	});
	assert.equal(response.status, 200, path);
	assert.match(response.headers.get("content-type") ?? "", /^image\/png/, path);
	const png = Buffer.from(await response.arrayBuffer());
	assert.deepEqual(png.subarray(0, 8), Buffer.from("89504e470d0a1a0a", "hex"));
	assert.equal(png.readUInt32BE(16), shareImageSize.width);
	assert.equal(png.readUInt32BE(20), shareImageSize.height);
	assert.equal(png.subarray(-8, -4).toString("ascii"), "IEND");
	return png;
}

// Run against next dev as well as next start: the image renderer handles
// nested React components differently between development and production.
for (const article of [
	"/en/learn/blockchain-101",
	"/fr/learn/ethereum-101",
	"/es/ideas/idea-00",
	"/en/thoughts/hello-world",
]) {
	test(`${article} serves a complete PNG share card`, async () => {
		await fetchPng(`${article}/share-image`);
	});
}

test("other page and unknown article image URLs reuse the default PNG", async () => {
	const fallback = await fetchPng("/share-image.png");
	for (const path of [
		"/share-image",
		"/en/share-image",
		"/fr/glossary/share-image",
		"/en/learn/share-image",
		"/en/learn/unwritten-article/share-image",
		"/en/unwritten/nested/page/share-image",
	]) {
		assert.deepEqual(await fetchPng(path), fallback, path);
	}
});

test("page metadata inherits the default image and articles override it", async () => {
	for (const path of ["/en", "/fr/glossary", "/en/learn"]) {
		const html = await (await fetch(new URL(path, baseUrl))).text();
		const tags = html.match(/<meta\b[^>]*>/g) ?? [];
		for (const field of ["og:image", "twitter:image"]) {
			assert.ok(
				tags.some(
					(tag) =>
						tag.includes(`="${field}"`) && tag.includes("/share-image.png"),
				),
				`${path}: ${field}`,
			);
		}
	}
	const articleHtml = await (
		await fetch(new URL("/en/learn/blockchain-101", baseUrl))
	).text();
	assert.ok(articleHtml.includes("/en/learn/blockchain-101/share-image"));
	assert.ok(!articleHtml.includes("/share-image.png"));
	const missingHtml = await (
		await fetch(new URL("/en/unwritten", baseUrl))
	).text();
	assert.ok(missingHtml.includes("NEXT_HTTP_ERROR_FALLBACK;404"));
	assert.ok(missingHtml.includes("noindex"));
});
