"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { certifiers, type Certifier } from "@0xhq/api-client/types";
import { createSubmission } from "@/actions/submissions";

const inputClass = "h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40";
export function SubmissionForm({ requestId }: { requestId: string }) {
	const [state, action, pending] = useActionState(createSubmission, {});
	const stableRequestId = useRef(requestId);
	const [certifier, setCertifier] = useState<Certifier>("PSA");
	if (state.reference) return <div role="status" className="rounded-[28px] bg-[#1c1c1c] p-7 sm:p-9"><span className="text-xs text-white/40">Request received</span><h2 className="mt-3 text-3xl font-medium tracking-tight">You’re on the list.</h2><p className="mt-4 font-mono text-sm text-white/70">{state.reference}</p><p className="mt-4 max-w-md text-sm leading-6 text-white/50">We’ll review your request first. Please wait for acceptance and shipping instructions before sending your item.</p><a href="/submit" className="mt-6 inline-block rounded-full border border-white/15 px-5 py-3 text-sm text-white/70">Submit another item</a></div>;
	return <form action={action} onSubmit={(event) => { event.preventDefault(); if (pending) return; const data = new FormData(event.currentTarget); startTransition(() => action(data)); }} className="rounded-[28px] bg-[#1c1c1c] p-6 sm:p-8">
		<input type="hidden" name="requestId" value={stableRequestId.current} />
		<div className="flex items-center justify-between gap-3"><h2 className="text-xl font-medium tracking-tight">Your item</h2><span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/40">Cards</span></div>
		<div className="mt-6 grid gap-5 sm:grid-cols-2">
			<label className="text-xs text-white/55">Certifier<span className="relative mt-2 block"><select name="gradingCompany" value={certifier} onChange={(event) => setCertifier(event.target.value as Certifier)} className={`${inputClass} cursor-pointer appearance-none bg-[#171717] pr-11`}>{certifiers.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/45"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></label>
			<label className="text-xs text-white/55">Certification ID<input name="certificationNumber" required inputMode={certifier === "PSA" ? "numeric" : "text"} pattern={certifier === "PSA" ? "[0-9]{6,16}" : "[A-Za-z0-9-]{3,40}"} maxLength={40} placeholder="ID on the certification label" className={`mt-2 ${inputClass}`} /></label>
			<label className="text-xs text-white/55 sm:col-span-2">Contact email<input name="contactEmail" required type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" className={`mt-2 ${inputClass}`} /></label>
		</div>
		{state.error && <p role="alert" className="mt-5 text-sm text-red-300">{state.error}</p>}
		<button type="submit" disabled={pending} className="mt-6 inline-flex cursor-pointer items-center gap-6 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50">{pending ? "Saving your request…" : "Submit request"}<span aria-hidden="true">↗</span></button>
	</form>;
}
