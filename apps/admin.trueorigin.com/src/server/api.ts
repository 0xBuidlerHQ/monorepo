import "server-only";
import { cookies, headers } from "next/headers";
import { apiJson, apiRequest, ApiError } from "@0xhq/api-client";
import { site } from "@/config/site";

export const staffCookie = "trueorigin-staff-session";
export async function trustedAdminOrigin() {
	const origin = process.env.ADMIN_ORIGIN ?? (process.env.NODE_ENV === "production" ? site.url : "http://localhost:3002");
	if ((await headers()).get("origin") !== origin) throw new ApiError("Origin not allowed.", 403);
}
export async function staffSessionToken() {
	if (process.env.NODE_ENV === "development") {
		const host = (await headers()).get("host");
		if (host !== "localhost:3002" && host !== "127.0.0.1:3002") throw new ApiError("Local admin access only.", 401);
		return "";
	}
	const token = (await cookies()).get(staffCookie)?.value;
	if (!token) throw new ApiError("Staff sign-in required.", 401);
	return token;
}
export async function staffJson<T>(path: string, options: { method?: string; json?: unknown } = {}) {
	return apiJson<T>("admin", "staff", path, { ...options, token: await staffSessionToken() });
}
export async function staffPhoto(id: string, side: string) {
	return apiRequest("admin", "staff", `/v1/submissions/${encodeURIComponent(id)}/photos/${encodeURIComponent(side)}`, { token: await staffSessionToken() });
}
