"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { useAccount } from "./account-provider";
import { AccountIcon } from "./account-icon";

const shortcuts = [
	{ name: "My collection", icon: "My Collection", href: "/collection", description: "All your objects, together in one place.", color: "#ff6b24" },
	{ name: "Submissions", icon: "Submit", href: "/submit", description: "Submit an item and follow its progress.", color: "#4488ff" },
	{ name: "Transfers", icon: "Transfers", href: "/transfers", description: "Send and receive ownership of your objects.", color: "#c0b5ff" },
];

export function AccountOverview({ onNavigate }: { onNavigate: () => void }) {
	const { identity, connection, disconnect, error } = useAccount();
	const reducedMotion = useReducedMotion();
	const address = connection?.account.address;
	const avatar = identity ? `0x${BigInt(identity.pubX).toString(16).slice(-40).padStart(40, "0")}` as const : undefined;
	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState("");
	const [loggingOut, setLoggingOut] = useState(false);
	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);
	async function copyAddress() {
		if (!address) return;
		try { await navigator.clipboard.writeText(address); setCopied(true); setCopyError(""); }
		catch { setCopyError("Couldn’t copy the address. Please try again."); }
	}
	async function logOut() {
		setLoggingOut(true);
		try { await disconnect(); } finally { setLoggingOut(false); }
	}
	return <div className="flex min-h-0 flex-1 flex-col pb-1 pt-3">
		<div className="flex items-start justify-between">
			<div className="size-16 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">{avatar && <AccountIcon address={avatar} size={64} />}</div>
			<motion.button type="button" aria-label={loggingOut ? "Signing out" : "Sign out"} title="Sign out" disabled={loggingOut} onClick={() => void logOut()} whileTap={reducedMotion ? undefined : { scale: 0.92 }} className="grid size-10 cursor-pointer place-items-center rounded-full text-white/55 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-wait disabled:opacity-30"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="size-6"><path d="M12 3v9m-5-7a9 9 0 1 0 10 0" /></svg></motion.button>
		</div>
		<div className="mt-5 flex items-center gap-2">
			<p title={address} className="text-lg font-medium leading-tight tracking-[-0.025em]">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : error ? "Wallet unavailable" : "Loading wallet…"}</p>
			<button type="button" disabled={!address} aria-label={copied ? "Address copied" : "Copy wallet address"} onClick={() => void copyAddress()} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-default disabled:opacity-30"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="size-4">{copied ? <path d="m4 10 4 4 8-8" /> : <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2" /></>}</svg></button>
			<span role="status" className="sr-only">{copied ? "Address copied" : ""}</span>
		</div>
		{copyError && <p role="alert" className="mt-2 text-xs text-red-300">{copyError}</p>}
		<nav aria-label="Account navigation" className="mt-7 space-y-3">
			{shortcuts.map(item => <Link key={item.href} href={item.href} onClick={onNavigate} className="group block rounded-[26px] border border-white/[0.12] p-5 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.025]">
				<span style={{ color: item.color }} className="mb-3 block"><NavigationIcon name={item.icon} className="size-6" /></span>
				<span className="block text-[17px] font-medium tracking-[-0.025em]">{item.name}</span>
				<span className="mt-1 block text-sm leading-6 text-white/50">{item.description}</span>
			</Link>)}
		</nav>
		{error && <p role="alert" className="mt-4 text-xs leading-5 text-red-300">{error}</p>}
	</div>;
}
