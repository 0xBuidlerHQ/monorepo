import "server-only";
import { passkeyAccountAddress } from "@0xhq/contracts.trueorigin.com/rpc";
import { createHash } from "node:crypto";
import { apiJson, apiRequest } from "@0xhq/api-client";
import type { Submission } from "@0xhq/api-client/types";
import { requireAccountIdentity } from "@/server/auth/session";

export async function submissionIdentity() {
	const identity = await requireAccountIdentity();
	return createHash("sha256").update(`${identity.rpId}:${identity.id}`).digest("hex");
}
export async function mySubmissions() { return apiJson<Submission[]>("customer", await submissionIdentity(), "/v1/submissions"); }
export async function mySubmissionPhoto(id: string, side: string) {
	return apiRequest("customer", await submissionIdentity(), `/v1/submissions/${encodeURIComponent(id)}/photos/${encodeURIComponent(side)}`);
}

export async function submissionWalletAddress() {
	return passkeyAccountAddress(await requireAccountIdentity());
}
