"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiJson, ApiError } from "@0xhq/api-client";
import { staffCookie, staffJson, trustedAdminOrigin } from "@/server/api";

export type StaffFormState = { error?: string; message?: string };
export async function staffLogin(_previous: StaffFormState, form: FormData): Promise<StaffFormState> {
	try {
		await trustedAdminOrigin();
		const password = form.get("password");
		if (typeof password !== "string" || !password || password.length > 256) return { error: "Enter your staff password." };
		const session = await apiJson<{ token: string; expires: number }>("admin", "staff", "/v1/staff/login", { method: "POST", json: { password } });
		(await cookies()).set(staffCookie, session.token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", expires: new Date(session.expires) });
	} catch (error) { return { error: error instanceof ApiError ? error.message : "Sign-in is temporarily unavailable." }; }
	redirect("/");
}
export async function staffLogout() {
	await trustedAdminOrigin();
	try { await staffJson("/v1/staff/logout", { method: "POST" }); } catch { /* Clear the browser session even if the API is unavailable. */ }
	(await cookies()).delete(staffCookie); redirect("/");
}
export async function updateSubmission(_previous: StaffFormState, form: FormData): Promise<StaffFormState> {
	try {
		await trustedAdminOrigin();
		const id = form.get("id"); if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id)) return { error: "Invalid submission." };
		await staffJson(`/v1/submissions/${id}/status`, { method: "PATCH", json: { status: form.get("status"), version: Number(form.get("version")), note: form.get("note") ?? "" } });
		revalidatePath("/"); return { message: "Submission updated." };
	} catch (error) { return { error: error instanceof ApiError ? error.message : "The update could not be saved. Please try again." }; }
}
