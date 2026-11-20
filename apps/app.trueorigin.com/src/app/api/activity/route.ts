import { ApiError } from "@0xhq/api-client";
import { activityKinds, type ActivityKind } from "@0xhq/api-client/types";
import { publicActivity } from "@/server/activity/client";

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams;
	const kind = params.get("kind") ?? "all",
		cursor = params.get("cursor") ?? "";
	if (!activityKinds.includes(kind as ActivityKind) || cursor.length > 32)
		return Response.json({ error: "Invalid activity query." }, { status: 400 });
	try {
		return Response.json(
			await publicActivity({ kind: kind as ActivityKind, cursor }),
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		return Response.json(
			{ error: "Activity is temporarily unavailable." },
			{
				status: error instanceof ApiError ? error.status : 503,
				headers: { "Cache-Control": "no-store" },
			},
		);
	}
}
