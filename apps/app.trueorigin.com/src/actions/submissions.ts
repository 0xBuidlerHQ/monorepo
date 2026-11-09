"use server";

import { apiJson, ApiError } from "@0xhq/api-client";
import type { Submission } from "@0xhq/api-client/types";
import { revalidatePath } from "next/cache";
import { requireTrustedOrigin } from "@/server/auth/session";
import { AccountError } from "@/server/auth/errors";
import { submissionIdentity, submissionWalletAddress } from "@/server/submissions/client";

export type SubmissionActionState = { error?: string; reference?: string };
export async function createSubmission(_previous: SubmissionActionState, form: FormData): Promise<SubmissionActionState> {
	try {
		await requireTrustedOrigin();
		const subject = await submissionIdentity();
		const input = Object.fromEntries(["requestId", "gradingCompany", "certificationNumber", "contactEmail"].map((key) => [key, form.get(key) ?? ""]));
		let submission = await apiJson<Submission>("customer", subject, "/v1/submissions", { method: "POST", json: { ...input, notes: "", recipientAddress: await submissionWalletAddress() } });
		if (["cancelled", "rejected"].includes(submission.status)) return { error: "This request was closed. Refresh to start a new request." };
		if (submission.status === "draft") {
			submission = await apiJson<Submission>("customer", subject, `/v1/submissions/${submission.id}/submit`, { method: "POST" });
		}
		revalidatePath("/submit");
		return { reference: submission.reference };
	} catch (error) {
		if (error instanceof ApiError || error instanceof AccountError) return { error: error.message };
		console.error("Submission service unavailable:", error instanceof Error ? error.name : "Unknown error");
		return { error: "We couldn’t save the request. Your draft may have been saved; retry to continue it." };
	}
}
