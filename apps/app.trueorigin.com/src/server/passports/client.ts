import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { apiJson, apiRequest, ApiError } from "@0xhq/api-client";
import type { PublicPassport, PublicPassportDetail } from "@0xhq/api-client/types";

const subject = "public:passports";
export const getPublicPassport = cache(async (id: string) => {
	await connection();
	if (!/^0x[0-9a-f]{64}$/i.test(id)) return null;
	try { return await apiJson<PublicPassportDetail>("customer", subject, `/v1/passports/${id.toLowerCase()}`); }
	catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
});
export async function publicPassports() {
	await connection();
	return apiJson<PublicPassport[]>("customer", subject, "/v1/passports/public");
}
export async function findPublicPassport(certifier: string, number: string) {
	await connection();
	try { return await apiJson<PublicPassport>("customer", subject, `/v1/passports/lookup?${new URLSearchParams({ certifier, number })}`); }
	catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}
export async function publicPassportAsset(id: string, asset: "image" | "metadata") {
	return apiRequest("customer", subject, `/v1/passports/${id.toLowerCase()}/${asset}`);
}
