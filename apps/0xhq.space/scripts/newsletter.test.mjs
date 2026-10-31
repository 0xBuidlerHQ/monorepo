import assert from "node:assert/strict";
import test from "node:test";
import { contentLocales } from "../src/lib/locales.ts";
import { getNewsletterSignupUrl } from "../src/lib/newsletter.ts";
import { newsletterMessages } from "../src/lib/newsletter-messages.ts";

test("signup is hidden until a valid public Buttondown username is configured", () => {
	for (const value of [
		undefined,
		"",
		"  ",
		"https://buttondown.com/example",
		"../other",
		"example?redirect=elsewhere",
		"a/b",
		"user\nname",
	]) {
		assert.equal(getNewsletterSignupUrl(value), undefined);
	}
	assert.equal(
		getNewsletterSignupUrl("  maxime-news  "),
		"https://buttondown.com/api/emails/embed-subscribe/maxime-news",
	);
});

test("signup copy is complete in all four languages", () => {
	const keys = Object.keys(newsletterMessages.en).sort();
	for (const locale of contentLocales) {
		assert.deepEqual(Object.keys(newsletterMessages[locale]).sort(), keys);
		for (const text of Object.values(newsletterMessages[locale]))
			assert(text.trim().length > 0);
	}
});
