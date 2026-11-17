import { PassportGridSkeleton, LoadingStatus } from "@/features/shell/loading-skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { PageLayout } from "@/features/shell/page-layout";
import { PageHeaderLink } from "@/features/shell/page-header";
import { RevealImage } from "@/components/ui/reveal-image";
import { PasskeySignIn } from "@/features/account/passkey-sign-in";
import { sessionIdentity } from "@/server/auth/session";
import { myPassports } from "@/server/submissions/client";

export const metadata = { title: "Collection" };

async function CollectionContents() {
	if (!await sessionIdentity()) return <div className="max-w-sm"><PasskeySignIn /></div>;
	return <Suspense fallback={<PassportGridSkeleton collection />}><CollectionItems /></Suspense>;
}
async function CollectionItems() {
	let passports: Awaited<ReturnType<typeof myPassports>>;
	try { passports = await myPassports(); }
	catch { return <p role="alert" className="rounded-2xl bg-white/5 p-6 text-sm leading-6 text-white/60">Your collection is temporarily unavailable. Check the local API and chain, then reload.</p>; }
	if (!passports.length) return <div className="rounded-[28px] bg-[var(--surface)] px-6 py-14"><h2 className="text-xl font-medium tracking-tight">Your objects, together.</h2><p className="mt-3 max-w-md text-sm leading-6 text-white/45">Passports appear here after inspection approval and confirmed issuance to your wallet.</p></div>;
	return <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{passports.map(passport => <li key={`${passport.chainId}:${passport.contractAddress}:${passport.tokenId}`} className="overflow-hidden rounded-[28px] bg-[var(--surface)] p-4">
		<div className="relative aspect-[4/5] overflow-hidden rounded-2xl">{passport.imageURI && <RevealImage unoptimized src={`/api/passports/${passport.itemId}/image`} alt={passport.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain" />}</div>
		<div className="px-1 pb-2 pt-5"><p className="text-[10px] text-white/35">Local development · #{passport.tokenId}</p><h2 className="mt-2 text-lg font-medium tracking-tight">{passport.title}</h2><p className="mt-2 text-xs text-white/45">{passport.certifier} · {passport.certificationNumber}{passport.grade ? ` · ${passport.grade}` : ""}</p><p className="mt-3 break-all font-mono text-[9px] text-white/25">{passport.contractAddress}</p><Link href={`/items/${passport.itemId}`} className="mt-4 inline-block text-xs text-white/65 transition-colors hover:text-white">View passport ↗</Link><Link href={`/transfers?item=${passport.itemId}`} className="ml-5 inline-block text-xs text-white/65 hover:text-white">Transfer ↗</Link></div>
	</li>)}</ul>;
}

export default function CollectionPage() {
	return <PageLayout title="Collection" actions={<PageHeaderLink href="/submit">Add an item ↗</PageHeaderLink>}><Suspense fallback={<LoadingStatus>Checking your account…</LoadingStatus>}><CollectionContents /></Suspense></PageLayout>;
}
