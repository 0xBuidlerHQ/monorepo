"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { useAccount } from "./account-provider";
import { AccountIcon } from "./account-icon";

export function AccountOverview({ onNavigate }: { onNavigate: () => void }) {
	const { connection, disconnect } = useAccount();
	const address = connection?.account.address;
	const [copied, setCopied] = useState(false), [copyError, setCopyError] = useState("");
	useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(timer); }, [copied]);
	async function copyAddress() {
		if (!address) return;
		try { await navigator.clipboard.writeText(address); setCopied(true); setCopyError(""); }
		catch { setCopyError("Couldn’t copy the address. Please try again."); }
	}
	return <div className="flex min-h-0 flex-1 flex-col">
		<div className="pb-8 pt-6"><div className="mb-6 grid size-18 place-items-center overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/10">{address ? <AccountIcon address={address} size={72} /> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-8 text-white/60"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></svg>}</div><h2 className="text-4xl font-medium leading-none tracking-[-0.06em]">Your account.</h2><p className="mt-3 text-sm text-white/40">A place for everything that’s yours.</p><div className="mt-5 inline-flex items-center gap-2 text-[11px] text-white/50"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-3.5"><path d="m10 2 6 2.5v5c0 3-3 5.5-6 7.5-3-2-6-4.5-6-7.5v-5L10 2Z" /><path d="m7 9 2 2 4-4" /></svg>Protected by your passkey</div></div>
		{address && <div className="mb-7 rounded-2xl bg-white/[0.04] p-4"><p className="text-[10px] text-white/35">Wallet address</p><button type="button" onClick={() => void copyAddress()} aria-label={copied ? "Address copied" : "Copy wallet address"} className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3 rounded text-left focus-visible:outline-2 focus-visible:outline-white"><span className="font-mono text-sm text-white/75">{address.slice(0, 8)}…{address.slice(-6)}</span><span className="text-[11px] text-white/40">{copied ? "Copied ✓" : "Copy"}</span></button>{copyError && <p role="alert" className="mt-2 text-xs text-red-300">{copyError}</p>}</div>}
		<nav aria-label="Account navigation" className="space-y-2">{[{ name: "Collection", icon: "My Collection", href: "/collection", description: "Your objects, together" }, { name: "Submissions", icon: "Submit", href: "/submit", description: "Requests and their progress" }].map((item) => <Link key={item.href} href={item.href} onClick={onNavigate} className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-white"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white/65"><NavigationIcon name={item.icon} className="size-5" /></span><div className="flex-1"><p className="text-sm text-white/85">{item.name}</p><p className="mt-1 text-[11px] text-white/35">{item.description}</p></div><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-4 text-white/30 transition-colors group-hover:text-white/70"><path d="m7 4 6 6-6 6" /></svg></Link>)}</nav>
		<div className="mt-auto border-t border-white/[0.07] pt-6"><button type="button" onClick={() => void disconnect()} className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80 focus-visible:outline-2 focus-visible:outline-white"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M9 4H5v16h4m5-12 4 4-4 4m-5-4h13" /></svg>Log out</button></div>
	</div>;
}
