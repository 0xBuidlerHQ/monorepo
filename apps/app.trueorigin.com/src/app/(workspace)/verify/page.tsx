import { PageLayout } from "@/features/shell/page-layout";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { certifiers } from "@0xhq/api-client/types";
import { findPublicPassport } from "@/server/passports/client";
import { passportIdFromInput } from "@/features/passports/lookup";

export const metadata = { title: "Verify" };
type Search = { q?: string; certifier?: string };
function VerifyForm({ query = "", certifier = "PSA" }: { query?: string; certifier?: string }) {
	return <form action="/verify" className="max-w-3xl rounded-[28px] bg-[var(--surface)] p-5 sm:p-7">
		<div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
			<label className="text-xs text-white/45">Certifier<span className="relative mt-2 block"><select name="certifier" defaultValue={certifier} className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-black/20 pl-4 pr-10 text-sm text-white/80">{certifiers.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" className="pointer-events-none absolute right-4 top-4 size-4"><path d="m6 8 4 4 4-4" /></svg></span></label>
			<label className="text-xs text-white/45">Passport link, item ID, or certification number<input name="q" required maxLength={2048} defaultValue={query} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Paste a passport link or enter a number" className="mt-2 h-12 w-full rounded-xl bg-black/20 px-4 text-sm text-white placeholder:text-white/25" /></label>
		</div>
		<div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="max-w-sm text-[11px] leading-5 text-white/35">The certifier is used for number searches. You do not need an account to check a passport.</p><button type="submit" className="inline-flex h-11 cursor-pointer items-center gap-4 rounded-full bg-[#f0f0ed] px-5 text-sm font-medium text-[#171717] transition-colors hover:bg-white">Verify passport <span aria-hidden="true">↗</span></button></div>
	</form>;
}
async function VerifyContent({ searchParams }: { searchParams: Promise<Search> }) {
	const params = await searchParams;
	const query = typeof params.q === "string" ? params.q.trim().slice(0, 2048) : "";
	const certifier = certifiers.find(entry => entry.id === params.certifier)?.id ?? "PSA";
	if (!query) return <VerifyForm certifier={certifier} />;
	const itemId = passportIdFromInput(query);
	if (itemId) redirect(`/items/${itemId}`);
	let message = "", unavailable = false;
	if (!/^[A-Z0-9-]{3,40}$/i.test(query) || (certifier === "PSA" && !/^\d{6,16}$/.test(query))) message = "Enter a valid certification number, full TrueOrigin item ID, or passport link.";
	else {
		let passport: Awaited<ReturnType<typeof findPublicPassport>> = null;
		try { passport = await findPublicPassport(certifier, query.toUpperCase()); }
		catch { unavailable = true; message = "The registry could not be reached. Please try again shortly."; }
		if (passport) redirect(`/items/${passport.itemId}`);
		if (!unavailable) message = "No issued TrueOrigin passport matches this certification number. Check the certifier and number, or try a passport link.";
	}
	return <><VerifyForm query={query} certifier={certifier} /><div role="status" className="mt-5 max-w-3xl rounded-2xl border border-white/10 p-6"><h2 className="text-lg font-medium tracking-tight">{unavailable ? "Verification unavailable" : "No passport found"}</h2><p className="mt-3 text-sm leading-6 text-white/50">{message}</p><p className="mt-3 text-xs leading-6 text-white/35">This is not a verdict on the physical item’s authenticity. Only issued passports are publicly searchable.</p></div></>;
}
export default function VerifyPage({ searchParams }: { searchParams: Promise<Search> }) {
	return <PageLayout title="Verify"><Suspense fallback={<VerifyForm />}><VerifyContent searchParams={searchParams} /></Suspense></PageLayout>;
}
