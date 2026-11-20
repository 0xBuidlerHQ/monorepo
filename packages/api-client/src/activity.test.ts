import assert from "node:assert/strict";
import { test } from "node:test";
import { parseActivityId } from "./activity.ts";

test("event IDs identify a chain transaction and log without ambiguity", () => {
	const hash = `0x${"a".repeat(64)}`;
	assert.deepEqual(parseActivityId(`31337:${hash}:0`), {
		chainId: 31337,
		transactionHash: hash,
		logIndex: 0,
	});
	for (const id of [
		`1:${hash}:0`,
		`31337:${hash}:-1`,
		`31337:${hash}:01`,
		`31337:${hash}:2147483648`,
		"invalid",
		`31337:${hash}:0/extra`,
	])
		assert.equal(parseActivityId(id), null);
});
