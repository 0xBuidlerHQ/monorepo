"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { statusLabels, type Submission } from "@0xhq/api-client/types";
import { handoverMethods, handoverSummary } from "@0xhq/api-client/handovers";
import { confirmReturn } from "@/actions/submissions";

function ReceiptConfirmation({ submission }: { submission: Submission }) {
	const [state, action, pending] = useActionState(confirmReturn, {});
	return <form action={action} className="mt-4"><input type="hidden" name="id" value={submission.id} /><input type="hidden" name="version" value={submission.version} /><label className="flex items-start gap-2 text-xs leading-5 text-white/55"><input type="checkbox" required className="mt-1 accent-white" />I have received the physical item.</label><button type="submit" disabled={pending} className="mt-3 cursor-pointer rounded-full bg-white px-4 py-2.5 text-xs text-black disabled:opacity-50">{pending ? "Confirming…" : "Confirm receipt"}</button>{state.error && <p role="alert" className="mt-3 text-xs text-red-300">{state.error}</p>}{state.message && <p role="status" className="mt-3 text-xs text-white/50">{state.message}</p>}</form>;
}
export function SubmissionProgress({ initial }: { initial: Submission[] }) {
	const [submissions, setSubmissions] = useState(initial);
	const [error, setError] = useState(false);
	useEffect(() => { setSubmissions(initial); }, [initial]);
	useEffect(() => {
		let controller: AbortController | undefined;
		const timer = setInterval(() => {
			if (document.hidden) return;
			controller?.abort(); controller = new AbortController(); const signal = controller.signal;
			void fetch("/api/submissions", { cache: "no-store", signal }).then(async response => { if (!response.ok) throw new Error("Unavailable"); const records = await response.json() as Submission[]; if (!signal.aborted) { setSubmissions(records); setError(false); } }).catch(() => { if (!signal.aborted) setError(true); });
		}, 5000);
		return () => { clearInterval(timer); controller?.abort(); };
	}, []);
	return <section className="mt-12" aria-labelledby="your-submissions"><h2 id="your-submissions" className="text-2xl font-medium tracking-tight">Your submissions</h2>{error && <p role="status" className="mt-3 text-xs text-amber-200/70">Updates are temporarily unavailable. Showing the last loaded progress.</p>}{!submissions.length ? <p className="mt-4 text-sm text-white/40">Your requests and their progress will appear here.</p> : <ul className="mt-5 space-y-3">{submissions.map(submission => <li key={submission.id}><details className="rounded-2xl bg-[#1c1c1c] p-5"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-white/85">{submission.title || `${submission.gradingCompany} · ${submission.certificationNumber}`}</p><p className="mt-1.5 font-mono text-[10px] text-white/35">{submission.reference}</p></div><span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/65">{statusLabels[submission.status]}</span></summary>
		<div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2"><section className="rounded-xl bg-black/10 p-4"><h3 className="text-xs font-medium text-white/70">Digital passport</h3><p className="mt-2 text-xs text-white/45">{submission.passport?.status === "confirmed" ? "Issued to your wallet." : submission.passport?.status === "failed" ? "Issuance needs attention from TrueOrigin." : submission.passport ? "Issuance is in progress." : "Issued after inspection approval."}</p>{submission.passport?.status === "confirmed" && <Link href={`/passports/${submission.passport.itemId}`} className="mt-3 inline-block text-xs text-white/80">View passport ↗</Link>}</section><section className="rounded-xl bg-black/10 p-4"><h3 className="text-xs font-medium text-white/70">Physical item</h3><p className="mt-2 text-xs text-white/45">{submission.returnHandover?.status === "received" ? "Receipt confirmed by you." : submission.returnHandover ? handoverMethods[submission.returnHandover.method].waitingLabel : "Return details will appear after inspection."}</p>{submission.returnHandover && <p className="mt-3 break-all text-xs text-white/50">{handoverMethods[submission.returnHandover.method].label} · {handoverSummary(submission.returnHandover)}</p>}{submission.returnHandover?.status === "awaiting_receipt" && <ReceiptConfirmation submission={submission} />}</section></div>
		<ol className="mt-5 space-y-3 border-t border-white/10 pt-4">{submission.history.map(event => <li key={event.id} className="text-xs"><p className="text-white/65">{statusLabels[event.status]} <time className="ml-2 text-white/30" dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}</time></p>{event.note && <p className="mt-1 text-white/40">{event.note}</p>}</li>)}</ol>
		{submission.returnHandover?.status === "received" && submission.passport?.status === "confirmed" && <Link href={`/transfers?item=${submission.passport.itemId}`} className="mt-5 inline-block text-xs text-white/80">Transfer this passport ↗</Link>}
	</details></li>)}</ul>}</section>;
}
