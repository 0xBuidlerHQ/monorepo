import assert from "node:assert/strict";
import { test } from "node:test";
import { isPublicActivityId } from "./activity.ts";

test("event IDs use the prefix-free canonical format", () => {
	const id = "0afXGWv-XD2S1zW4dVq31Q";
	assert.equal(isPublicActivityId(id), true);
	assert.equal(isPublicActivityId(`evt_${"A".repeat(18)}`), true);
	for (const value of [
		"invalid",
		"evt_",
		`evt_${id}`,
		`31337:0x${"a".repeat(64)}:0`,
		`${"A".repeat(21)}B`,
		"A".repeat(23),
		`${id}/path`,
	])
		assert.equal(isPublicActivityId(value), false);
});
