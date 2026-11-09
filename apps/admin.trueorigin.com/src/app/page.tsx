import Image from "next/image";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ApiError } from "@0xhq/api-client";
import { statusLabels, type Submission } from "@0xhq/api-client/types";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
import { site } from "@/config/site";
import { staffCookie, staffJson } from "@/server/api";
import { staffLogout } from "@/actions/staff";
import { StaffLogin } from "@/features/staff-login";
import { SubmissionReview } from "@/features/submission-review";

export const metadata = { title: "Submissions" };

async function Workspace() {
	if (!(await cookies()).get(staffCookie)?.value) return <StaffLogin />;
	let submissions: Submission[];
	try { submissions = await staffJson<Submission[]>("/v1/submissions"); }
	catch (error) { return error instanceof ApiError && error.status === 401 ? <StaffLogin /> : <p role="alert" className="mt-8 text-sm text-white/50">The submission service is temporarily unavailable.</p>; }
	return <><div className="mt-8 flex items-center justify-between gap-4"><p className="text-sm text-white/40">{submissions.length} submission{submissions.length === 1 ? "" : "s"}</p><form action={staffLogout}><button type="submit" className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-xs text-white/50">Sign out</button></form></div>
		{!submissions.length ? <div className="mt-5 rounded-3xl bg-[#1c1c1c] p-9"><h2 className="text-xl font-medium">Your review queue is clear.</h2><p className="mt-3 text-sm text-white/45">Completed submission requests will appear here. Customers’ unfinished drafts remain private.</p></div> : <ul className="mt-5 space-y-4">{submissions.map((submission) => <li key={submission.id}><details className="rounded-3xl bg-[#1c1c1c] p-6 sm:p-8"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4"><div><p className="font-mono text-[10px] text-white/35">{submission.reference}</p><h2 className="mt-2 text-xl font-medium tracking-tight">{submission.title || `${submission.gradingCompany} · ${submission.certificationNumber}`}</h2><p className="mt-2 text-xs text-white/45">{submission.gradingCompany} {submission.certificationNumber}{submission.grade ? ` · ${submission.grade}` : ""}</p></div><span className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/65">{statusLabels[submission.status]}</span></summary>
			{submission.photos.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2">{submission.photos.map((photo) => <a key={photo.side} href={`/api/submissions/${submission.id}/photos/${photo.side}`} target="_blank" rel="noreferrer" className="block rounded-2xl bg-black/20 p-4"><p className="mb-3 text-xs capitalize text-white/40">{photo.side}</p><Image unoptimized src={`/api/submissions/${submission.id}/photos/${photo.side}`} alt={`${submission.title}, slab ${photo.side}`} loading="lazy" width={600} height={825} className="mx-auto max-h-96 w-full object-contain" /></a>)}</div>}
			<dl className="mt-6 grid gap-4 text-xs sm:grid-cols-2"><div><dt className="text-white/35">Contact</dt><dd className="mt-2 break-all text-white/70">{submission.contactEmail}</dd></div><div><dt className="text-white/35">Receiving wallet</dt><dd className="mt-2 break-all font-mono text-white/60">{submission.recipientAddress || "Not provided yet"}</dd></div></dl>{submission.notes && <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-white/50">{submission.notes}</p>}
			<ol className="mt-6 space-y-3 border-t border-white/10 pt-5">{submission.history.map((event) => <li key={event.id} className="text-xs"><p className="text-white/60">{statusLabels[event.status]} <span className="ml-2 text-white/25">{new Date(event.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</span></p>{event.note && <p className="mt-1.5 text-white/40">{event.note}</p>}</li>)}</ol><SubmissionReview key={submission.version} submission={submission} />
		</details></li>)}</ul>}
	</>;
}

export default function AdminPage() {
	return <div className="min-h-dvh"><header className="flex h-16 items-center justify-between gap-4 border-b border-white/10 px-6 sm:px-12"><div className="flex items-center gap-3"><TrueOriginsMark className="h-8 w-7" /><span className="text-sm font-medium tracking-tight">TrueOrigin <span className="ml-2 text-white/35">Admin</span></span></div><a href={site.appUrl} className="rounded-full px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white">Open app ↗</a></header><main className="mx-auto max-w-7xl px-6 py-12 sm:px-12 sm:py-16"><p className="text-xs text-white/40">Operations workspace</p><h1 className="mt-4 text-[clamp(48px,7vw,88px)] font-medium leading-none tracking-[-0.065em]">Submissions</h1><p className="mt-5 max-w-md text-sm leading-6 text-white/50">Receive requests. Inspect objects. Record each decision.</p><Suspense fallback={<div role="status" aria-busy="true" aria-label="Loading submissions" className="mt-8 h-40 rounded-3xl bg-white/[0.025]" />}><Workspace /></Suspense></main></div>;
}
