import { ApiError } from "@0xhq/api-client";
import { publicPassportAsset } from "@/server/passports/client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; asset: string }> }) {
	const { id, asset } = await params;
	if (!/^0x[0-9a-f]{64}$/i.test(id) || (asset !== "image" && asset !== "metadata")) return Response.json({ error: "Passport asset not found." }, { status: 404 });
	try {
		const result = await publicPassportAsset(id, asset);
		return new Response(result.body, { headers: { "Content-Type": asset === "image" ? "image/svg+xml" : "application/json", "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'" } });
	} catch (error) { return Response.json({ error: "The passport archive is unavailable." }, { status: error instanceof ApiError ? error.status : 503 }); }
}
