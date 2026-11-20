import { VerifyForm } from "@/features/passports/verify-form";
import { LoadingStatus } from "@/features/shell/loading-skeleton";
import { PageLayout } from "@/features/shell/page-layout";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { certifiers } from "@0xhq/api-client/types";
import { findPublicPassport } from "@/server/passports/client";
import { passportIdFromInput } from "@/features/passports/lookup";

export const metadata = { title: "Verify" };
type Search = { q?: string; certifier?: string };
async function VerifyContent({ searchParams }: { searchParams: Promise<Search> }) {
	const params = await searchParams;
	const query = typeof params.q === "string" ? params.q.trim().slice(0, 2048) : "";
	const certifier = certifiers.find(entry => entry.id === params.certifier)?.id ?? "PSA";
	if (!query) return null;
	const itemId = passportIdFromInput(query);
	if (itemId) redirect(`/registry/${itemId}`);
	let message = "", unavailable = false;
	if (!/^[A-Z0-9-]{3,40}$/i.test(query) || (certifier === "PSA" && !/^\d{6,16}$/.test(query))) message = "Enter a valid certification number, full TrueOrigin item ID, or passport link.";
	else {
		let passport: Awaited<ReturnType<typeof findPublicPassport>> = null;
		try { passport = await findPublicPassport(certifier, query.toUpperCase()); }
		catch { unavailable = true; message = "The registry could not be reached. Please try again shortly."; }
		if (passport) redirect(`/registry/${passport.itemId}`);
		if (!unavailable) message = "No issued TrueOrigin passport matches this certification number. Check the certifier and number, or try a passport link.";
	}
	return <div role="status" className="mt-5 max-w-3xl rounded-2xl border border-white/10 p-6"><h2 className="text-lg font-medium tracking-tight">{unavailable ? "Verification unavailable" : "No passport found"}</h2><p className="mt-3 text-sm leading-6 text-white/50">{message}</p><p className="mt-3 text-xs leading-6 text-white/35">This is not a verdict on the physical item’s authenticity. Only issued passports are publicly searchable.</p></div>;
}
export default function VerifyPage({ searchParams }: { searchParams: Promise<Search> }) {
	return <PageLayout title="Verify"><VerifyForm /><Suspense fallback={<div className="mt-5"><LoadingStatus>Checking passport…</LoadingStatus></div>}><VerifyContent searchParams={searchParams} /></Suspense></PageLayout>;
}
