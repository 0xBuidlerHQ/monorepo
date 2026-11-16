import { ApiError } from "@0xhq/api-client";
import { AccountError } from "@/server/auth/errors";
import { mySubmissions } from "@/server/submissions/client";

export async function GET() {
	try { return Response.json(await mySubmissions(), { headers: { "Cache-Control": "private, no-store" } }); }
	catch (error) { return Response.json({ error: "Submission updates are unavailable." }, { status: error instanceof ApiError ? error.status : error instanceof AccountError ? 401 : 503, headers: { "Cache-Control": "private, no-store" } }); }
}
