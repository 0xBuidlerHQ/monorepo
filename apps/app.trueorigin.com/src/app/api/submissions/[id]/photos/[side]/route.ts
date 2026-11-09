import { ApiError } from "@0xhq/api-client";
import { AccountError } from "@/server/auth/errors";
import { mySubmissionPhoto } from "@/server/submissions/client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; side: string }> }) {
	try {
		const { id, side } = await params;
		if (!["front", "back"].includes(side) || !/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
		const response = await mySubmissionPhoto(id, side);
		return new Response(response.body, { headers: { "Content-Type": response.headers.get("content-type") ?? "application/octet-stream", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
	} catch (error) { return new Response(null, { status: error instanceof ApiError || error instanceof AccountError ? error.status : 503 }); }
}
