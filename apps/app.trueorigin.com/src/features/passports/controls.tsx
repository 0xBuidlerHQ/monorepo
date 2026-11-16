"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useAccount } from "@/features/account/account-provider";
import { useRouter } from "next/navigation";

export function CopyValue({ value, label }: { value: string; label: string }) {
	const [copied, setCopied] = useState(false), [error, setError] = useState(false);
	useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(timer); }, [copied]);
	async function copy() { try { await navigator.clipboard.writeText(value); setCopied(true); setError(false); } catch { setError(true); } }
	return <span className="inline-flex shrink-0 flex-col items-end"><button type="button" aria-label={copied ? `${label} copied` : `Copy ${label}`} onClick={() => void copy()} className="grid size-8 cursor-pointer place-items-center rounded-full bg-white/5 text-white/45 transition-colors hover:bg-white/10 hover:text-white"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">{copied ? <path d="m4 10 4 4 8-8" /> : <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2" /></>}</svg></button><span role="status" className={error ? "mt-1 text-[10px] text-orange-200" : "sr-only"}>{error ? "Copy unavailable" : copied ? "Copied" : ""}</span></span>;
}
export function RecheckPassport() {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	return <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className="inline-flex h-10 cursor-pointer items-center rounded-full bg-white/[0.06] px-4 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-50">{pending ? "Checking…" : "Check again"}</button>;
}

export function TransferPassport({ itemId, owner }: { itemId: string; owner: string | null }) {
 const { connection } = useAccount();
 if (!owner || !connection || owner.toLowerCase() !== connection.account.address.toLowerCase()) return null;
 return <Link href={`/transfers?item=${itemId}`} className="mt-5 inline-flex cursor-pointer rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Transfer ↗</Link>;
}
