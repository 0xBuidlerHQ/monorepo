import { SubmissionProgress } from "@/features/submissions/submission-progress";
import { PageLayout } from "@/features/shell/page-layout";
import { Suspense } from "react";
import { randomUUID } from "node:crypto";
import type { Submission } from "@0xhq/api-client/types";
import { sessionIdentity } from "@/server/auth/session";
import { mySubmissions } from "@/server/submissions/client";
import { SubmissionForm } from "@/features/submissions/submission-form";
import { PasskeySignIn } from "@/features/account/passkey-sign-in";

export const metadata = { title: "Submit" };

async function SubmissionContent() {
	if (!await sessionIdentity()) return <PasskeySignIn intent="submission" />;
	let submissions: Submission[];
	try { submissions = await mySubmissions(); }
	catch { return <p role="alert" className="rounded-2xl bg-white/5 p-6 text-sm text-white/60">Submissions are temporarily unavailable. Please try again shortly.</p>; }
	return <>
		<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"><SubmissionForm requestId={randomUUID()} /><aside className="px-1 py-3"><h2 className="text-sm font-medium text-white/70">What happens next</h2><ol className="mt-6 space-y-6">{[{ title: "We review your request", text: "We check the details before arranging an inspection." }, { title: "You send the item", text: "Wait for acceptance and shipping instructions." }, { title: "Inspection, then passport", text: "After approval, passport issuance and the return of your item are arranged separately." }].map((step, index) => <li key={step.title} className="flex gap-4"><span className="mt-0.5 font-mono text-xs text-white/25">0{index + 1}</span><div><h3 className="text-sm text-white/75">{step.title}</h3><p className="mt-2 text-xs leading-6 text-white/40">{step.text}</p></div></li>)}</ol></aside></div>
		<SubmissionProgress initial={submissions} />
	</>;
}

export default function SubmitPage() {
	return <PageLayout title="Submit"><Suspense fallback={null}><SubmissionContent /></Suspense></PageLayout>;
}
