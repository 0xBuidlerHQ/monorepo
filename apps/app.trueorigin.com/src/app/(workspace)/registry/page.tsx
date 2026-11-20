import { PassportGridSkeleton } from "@/features/shell/loading-skeleton";
import { PageLayout } from "@/features/shell/page-layout";
import { PageHeaderLink } from "@/features/shell/page-header";
import Link from "next/link";
import { Suspense } from "react";
import { RevealImage } from "@/components/ui/reveal-image";
import { publicPassports } from "@/server/passports/client";

export const metadata = { title: "Registry" };
async function RegistryContents() {
	let passports: Awaited<ReturnType<typeof publicPassports>>;
	try { passports = await publicPassports(); }
	catch { return <p role="status" className="rounded-2xl bg-white/5 p-6 text-sm text-white/50">The registry is temporarily unavailable. Please try again shortly.</p>; }
	if (!passports.length) return <div className="rounded-[28px] bg-[var(--surface)] px-6 py-14"><h2 className="text-xl font-medium tracking-tight">No passports issued yet.</h2><p className="mt-3 max-w-md text-sm leading-6 text-white/45">Public passports appear here after inspection approval and confirmed issuance.</p></div>;
	return <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{passports.map(passport => <li key={passport.itemId}><Link href={`/registry/${passport.itemId}`} className="group block rounded-[28px] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-raised)]"><div className="relative aspect-[4/5] overflow-hidden rounded-2xl"><RevealImage unoptimized src={`/api/passports/${passport.itemId}/image`} alt={passport.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain" /></div><div className="px-1 pb-2 pt-5"><p className="text-[10px] text-white/35">Passport #{passport.tokenId} · Local development</p><h2 className="mt-2 text-lg font-medium tracking-tight">{passport.title}</h2><p className="mt-2 text-xs text-white/45">{passport.certifier} · {passport.certificationNumber}{passport.grade ? ` · ${passport.grade}` : ""}</p><span className="mt-4 inline-block text-xs text-white/60 group-hover:text-white">View passport ↗</span></div></Link></li>)}</ul>;
}
export default function RegistryPage() {
	return <PageLayout title="Registry" actions={<PageHeaderLink href="/verify">Verify a passport ↗</PageHeaderLink>}><Suspense fallback={<PassportGridSkeleton />}><RegistryContents /></Suspense></PageLayout>;
}
