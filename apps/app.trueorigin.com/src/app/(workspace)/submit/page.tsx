import { Suspense } from "react";
import { randomUUID } from "node:crypto";
import { statusLabels, type Submission } from "@0xhq/api-client/types";
import { sessionIdentity } from "@/server/auth/session";
import { mySubmissions } from "@/server/submissions/client";
import { SubmissionForm } from "@/features/submissions/submission-form";
import { PasskeySignIn } from "@/features/account/passkey-sign-in";

export const metadata = { title: "Submit" };

async function SubmissionContent() {
	if (!await sessionIdentity()) return <PasskeySignIn intent="submission" />;
	let submissions: Submission[];
	try { submissions = await mySubmissions(); }
	catch { return <p role="alert" className="mt-10 rounded-2xl bg-white/5 p-6 text-sm text-white/60">Submissions are temporarily unavailable. Please try again shortly.</p>; }
	return <>
		<div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"><SubmissionForm requestId={randomUUID()} /><aside className="px-1 py-3"><h2 className="text-sm font-medium text-white/70">What happens next</h2><ol className="mt-6 space-y-6">{[{ title: "We review your request", text: "We check the details before arranging an inspection." }, { title: "You send the item", text: "Wait for acceptance and shipping instructions." }, { title: "Inspection, then passport", text: "After approval, passport issuance and the return of your item are arranged separately." }].map((step, index) => <li key={step.title} className="flex gap-4"><span className="mt-0.5 font-mono text-xs text-white/25">0{index + 1}</span><div><h3 className="text-sm text-white/75">{step.title}</h3><p className="mt-2 text-xs leading-6 text-white/40">{step.text}</p></div></li>)}</ol></aside></div>
		<section className="mt-12" aria-labelledby="your-submissions"><h2 id="your-submissions" className="text-2xl font-medium tracking-tight">Your submissions</h2>{!submissions.length ? <p className="mt-4 text-sm text-white/40">Your requests and their progress will appear here.</p> : <ul className="mt-5 space-y-3">{submissions.map((submission) => <li key={submission.id}><details className="group rounded-2xl bg-[#1c1c1c] p-5"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-white/85">{submission.title || `${submission.gradingCompany} · ${submission.certificationNumber}`}</p><p className="mt-1.5 font-mono text-[10px] text-white/35">{submission.reference} · {submission.gradingCompany} {submission.certificationNumber}</p></div><span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/65">{statusLabels[submission.status]}</span></summary><ol className="mt-5 space-y-4 border-t border-white/10 pt-5">{submission.history.map((event) => <li key={event.id} className="text-xs"><p className="text-white/70">{statusLabels[event.status]} <span className="ml-2 text-white/30">{new Date(event.createdAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}</span></p>{event.note && <p className="mt-2 text-white/45">{event.note}</p>}</li>)}</ol></details></li>)}</ul>}</section>
	</>;
}

export default function SubmitPage() {
	return <section><h1 className="text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em]">Submit</h1><p className="mt-5 max-w-xl text-sm leading-6 text-white/50">Start your item’s passport. Send a request before sending the object.</p><Suspense fallback={<div role="status" aria-label="Loading submissions" aria-busy="true" className="mt-10 h-64 rounded-[28px] bg-white/[0.025]" />}><SubmissionContent /></Suspense></section>;
}
