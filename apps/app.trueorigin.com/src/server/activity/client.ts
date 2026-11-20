import "server-only";
import { ApiError, apiJson } from "@0xhq/api-client";
import { isPublicActivityId } from "@0xhq/api-client/activity";
import { itemUniverseLabel } from "@0xhq/api-client/passport-item";
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
			universe: event.passport?.item
				? itemUniverseLabel(event.passport.item.universe)
				: (event.universe ?? null),
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
	if (!isPublicActivityId(eventId)) return null;
	try {
		const event = await apiJson<AssetActivity>(
			"customer",
			"public:activity",
			`/v1/activity/${encodeURIComponent(eventId)}`,
		);
		return {
			...event,
			universe: event.passport?.item
				? itemUniverseLabel(event.passport.item.universe)
				: (event.universe ?? null),
		};
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) return null;
		throw error;
	}
});
