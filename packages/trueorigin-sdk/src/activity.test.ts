import assert from "node:assert/strict";
import { test } from "node:test";
import { createActivityId } from "./activity.ts";

test("public event IDs are stable, canonical and distinguish each action", () => {
	const hash = `0x${"a".repeat(64)}`;
	const id = createActivityId(31337, hash, 0);
	assert.equal(id, "0afXGWv-XD2S1zW4dVq31Q");
	assert.equal(createActivityId(31337, `0x${"A".repeat(64)}`, 0), id);
	assert.notEqual(createActivityId(31337, hash, 1), id);
	assert.notEqual(createActivityId(1, hash, 0), id);
	assert.notEqual(createActivityId(31337, `0x${"b".repeat(64)}`, 0), id);
	assert.equal(id.length, 22);
});
test("invalid event sources cannot generate IDs", () => {
	const hash = `0x${"a".repeat(64)}`;
	for (const [chain, tx, log] of [
		[0, hash, 0],
		[31337, "invalid", 0],
		[31337, hash, -1],
		[31337, hash, 0.5],
		[31337, hash, 2147483648],
	] as const)
		assert.throws(() => createActivityId(chain, tx, log));
});
