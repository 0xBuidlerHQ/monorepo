"use client";
import { useActionState } from "react";
import { statusLabels, staffTransitions, type Submission } from "@0xhq/api-client/types";
import { updateSubmission } from "@/actions/staff";

export function SubmissionReview({ submission }: { submission: Submission }) {
	const [state, action, pending] = useActionState(updateSubmission, {});
	const transitions = staffTransitions[submission.status] ?? [];
	if (!transitions.length) return <p className="mt-6 text-xs leading-6 text-white/40">{submission.status === "approved" ? "Inspection approved. Passport issuance and shipping will be connected separately." : "No further review actions are available."}</p>;
	return <form action={action} className="mt-6 border-t border-white/10 pt-6"><input type="hidden" name="id" value={submission.id} /><input type="hidden" name="version" value={submission.version} /><div className="grid gap-4 sm:grid-cols-[220px_1fr]"><label className="text-xs text-white/50">Next status<select name="status" className="mt-2 h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white/80">{transitions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label><label className="text-xs text-white/50">Message to owner<input name="note" maxLength={3000} placeholder="Required when rejecting a request" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-white/40" /></label></div>{state.error && <p role="alert" className="mt-4 text-sm text-red-300">{state.error}</p>}{state.message && <p role="status" className="mt-4 text-sm text-white/60">{state.message}</p>}<button disabled={pending} type="submit" className="mt-4 cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm text-black disabled:opacity-50">{pending ? "Saving…" : "Update submission"}</button></form>;
}
