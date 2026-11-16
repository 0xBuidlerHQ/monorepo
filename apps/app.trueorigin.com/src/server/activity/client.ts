import "server-only";
import { connection } from "next/server";
import { apiJson } from "@0xhq/api-client";
import type { ActivityPage, ActivityQuery } from "@0xhq/api-client/types";

export async function publicActivity(query: ActivityQuery = {}) {
	await connection();
	const params = new URLSearchParams({
		kind: query.kind ?? "all",
		limit: String(query.limit ?? 30),
	});
	if (query.cursor) params.set("cursor", query.cursor);
	return apiJson<ActivityPage>(
		"customer",
		"public:activity",
		`/v1/activity?${params}`,
	);
}
