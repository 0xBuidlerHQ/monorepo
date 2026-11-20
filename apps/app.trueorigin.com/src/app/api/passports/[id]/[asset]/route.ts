import { ApiError } from "@0xhq/api-client";
import { publicPassportAsset } from "@/server/passports/client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; asset: string }> }) {
	const { id, asset } = await params;
	if (!/^0x[0-9a-f]{64}$/i.test(id) || (asset !== "image" && asset !== "metadata")) return Response.json({ error: "Passport asset not found." }, { status: 404 });
	try {
		const result = await publicPassportAsset(id, asset);
		const contentType = result.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
		if (!contentType || (asset === "image" ? !["image/svg+xml", "image/webp", "image/png", "image/jpeg"].includes(contentType) : contentType !== "application/json")) return Response.json({ error: "The passport asset has an unsupported format." }, { status: 503 });
		return new Response(result.body, { headers: { "Content-Type": contentType, "Cache-Control": process.env.NODE_ENV === "development" ? "no-store" : "public, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'" } });
	} catch (error) { return Response.json({ error: "The passport archive is unavailable." }, { status: error instanceof ApiError ? error.status : 503 }); }
}
