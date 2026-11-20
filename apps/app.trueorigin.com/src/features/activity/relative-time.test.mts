import assert from "node:assert/strict";
import { test } from "node:test";
import { relativeActivityTime } from "./relative-time.ts";

test("activity times transition between relative units", () => {
	const now = Date.parse("2026-11-19T12:00:00Z");
	for (const [seconds, expected] of [
		[-5, "Just now"],
		[59, "Just now"],
		[60, "1 min ago"],
		[120, "2 min ago"],
		[3599, "59 min ago"],
		[3600, "1 hr ago"],
		[86400, "1 day ago"],
		[172800, "2 days ago"],
		[2592000, "1 month ago"],
		[31536000, "1 year ago"],
	] as const) {
		assert.equal(
			relativeActivityTime(new Date(now - seconds * 1000).toISOString(), now),
			expected,
		);
	}
});
