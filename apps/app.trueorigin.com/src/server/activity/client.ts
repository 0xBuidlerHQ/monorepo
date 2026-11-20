import "server-only";
import { ApiError, apiJson } from "@0xhq/api-client";
import { parseActivityId } from "@0xhq/api-client/activity";
import { itemCategoryLabel } from "@0xhq/api-client/passport-item";
import type {
	ActivityPage,
	ActivityQuery,
	AssetActivity,
} from "@0xhq/api-client/types";
import { connection } from "next/server";
import { cache } from "react";

export async function publicActivity(query: ActivityQuery = {}) {
	await connection();
	const params = new URLSearchParams({
		kind: query.kind ?? "all",
		limit: String(query.limit ?? 30),
	});
	if (query.cursor) params.set("cursor", query.cursor);
	const page = await apiJson<ActivityPage>(
		"customer",
		"public:activity",
		`/v1/activity?${params}`,
	);
	return {
		...page,
		events: page.events.map((event) => ({
			...event,
			category: event.passport?.item
				? itemCategoryLabel(event.passport.item.category)
				: (event.category ?? null),
		})),
	};
}

export const getActivityEvent = cache(async (id: string) => {
	await connection();
	let eventId: string;
	try {
		eventId = decodeURIComponent(id);
	} catch {
		return null;
	}
	if (!parseActivityId(eventId)) return null;
	try {
		const event = await apiJson<AssetActivity>(
			"customer",
			"public:activity",
			`/v1/activity/${encodeURIComponent(eventId)}`,
		);
		return {
			...event,
			category: event.passport?.item
				? itemCategoryLabel(event.passport.item.category)
				: (event.category ?? null),
		};
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) return null;
		throw error;
	}
});
