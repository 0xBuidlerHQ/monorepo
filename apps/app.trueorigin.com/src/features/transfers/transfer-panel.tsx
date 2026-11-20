"use client";

import type { PublicPassport } from "@0xhq/api-client/types";
import { sendPassportTransfer, transferRecipient, waitPassportTransfer } from "@0xhq/trueorigin-sdk/transfers";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
type Hex = `0x${string}`;
import { useAccount } from "@/features/account/account-provider";
import { fundLocalTestAccount } from "@/actions/account";

type Pending = { hash: Hex; itemId: string; recipient: string; contractAddress: string; tokenId: string };
const field = "w-full rounded-2xl bg-white/5 px-5 py-4 text-sm text-white";
const button = "cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:cursor-wait disabled:opacity-40";
export function TransferPanel({ passports }: { passports: PublicPassport[] }) {
	const { connection, identity } = useAccount();
	const params = useSearchParams();
	const [itemId, setItemId] = useState(params.get("item") ?? passports[0]?.itemId ?? "");
	const [recipient, setRecipient] = useState("");
	const [review, setReview] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [pending, setPending] = useState<Pending | null>(null);
	const [confirmed, setConfirmed] = useState<{ hash: string; itemId: string } | null>(null);
	const lock = useRef(false);
	const storageKey = connection ? `trueorigin:transfer:31337:${connection.account.address.toLowerCase()}` : null;
	useEffect(() => {
		setPending(null); setReview(false); setConfirmed(null);
		if (!storageKey) return;
		try {
			const raw = localStorage.getItem(storageKey);
			if (!raw) return;
			const data = JSON.parse(raw) as Pending;
			if (data && /^0x[0-9a-f]{64}$/i.test(data.hash) && /^0x[0-9a-f]{64}$/i.test(data.itemId) && /^0x[0-9a-f]{40}$/i.test(data.recipient) && /^0x[0-9a-f]{40}$/i.test(data.contractAddress) && /^\d+$/.test(data.tokenId)) setPending(data);
		} catch { setError("Pending transfer storage is unavailable. Keep this page open while sending."); }
	}, [storageKey]);
	const selected = passports.find(passport => passport.itemId === itemId);
	async function check(value: Pending) {
		if (!connection || !storageKey) return;
		const result = await waitPassportTransfer(connection, value);
		if (!result.success) { localStorage.removeItem(storageKey); setPending(null); throw new Error("The transfer reverted. You can retry authorization."); }
		localStorage.removeItem(storageKey); setPending(null);
		setConfirmed({ hash: result.transactionHash, itemId: value.itemId }); setReview(false);
	}
	async function submit(resume = false) {
		if (lock.current || !connection || !storageKey) return;
		lock.current = true; setBusy(true); setError("");
		try {
			if (resume && pending) { await check(pending); return; }
			if (!selected || !review) return;
			// Verify durable pending storage before asking the user to sign.
			localStorage.setItem(storageKey, "null"); localStorage.removeItem(storageKey);
			const funded = await fundLocalTestAccount();
			if (!funded.ok) throw new Error(funded.error);
			const hash = await sendPassportTransfer(connection, { ...selected, recipient });
			const value = { hash, itemId: selected.itemId, recipient, contractAddress: selected.contractAddress, tokenId: selected.tokenId };
			setPending(value); localStorage.setItem(storageKey, JSON.stringify(value));
			await check(value);
		} catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to complete the transfer."); }
		finally { lock.current = false; setBusy(false); }
	}
	if (!identity) return <p className="text-sm text-white/50">Sign in to transfer a passport.</p>;
	return <div className="max-w-2xl rounded-[28px] bg-white/[0.035] p-6 sm:p-8">
		<p className="text-xs text-white/35">Local development network</p>
		<h2 className="mt-3 text-2xl font-medium tracking-tight">Send a passport.</h2>
		<p className="mt-3 text-sm leading-6 text-white/50">Choose an item and its receiving wallet, then review and confirm the transfer.</p>
		{confirmed ? <div role="status" className="mt-6 space-y-4"><p>Transfer confirmed.</p><p className="break-all font-mono text-xs text-white/50">{confirmed.hash}</p><Link className="inline-block text-sm underline" href={`/passports/${confirmed.itemId}`}>View passport ↗</Link><Link className="ml-5 text-sm underline" href="/activity">View activity ↗</Link></div> : pending ? <div className="mt-6 space-y-4"><p className="text-sm">A transfer has been submitted. Check its result before sending another.</p><p className="break-all font-mono text-xs text-white/40">{pending.hash}</p><button type="button" className={button} disabled={busy || !connection} onClick={() => void submit(true)}>{busy ? "Checking confirmation…" : "Check confirmation"}</button></div> : !passports.length ? <p className="mt-6 text-sm text-white/45">Your wallet has no passports to transfer.</p> : <form className="mt-7 space-y-5" onSubmit={event => { event.preventDefault(); if (review) { void submit(); return; } try { if (!connection || !selected) throw new Error("Wait for your wallet to connect."); setRecipient(transferRecipient(recipient.trim(), connection.account.address, selected.contractAddress)); setReview(true); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : "Check the receiving address."); } }}>
			{review ? <div className="space-y-4 text-sm"><p>{selected?.title} · #{selected?.tokenId}</p><p className="text-white/40">Receiving wallet</p><p className="break-all font-mono">{recipient}</p><p className="text-white/50">Check the full address with the recipient. Confirming asks you to authorize the transfer; a confirmed transfer cannot be undone by TrueOrigin.</p></div> : <><label className="block space-y-2 text-sm"><span>Passport</span><select className={field} value={itemId} onChange={event => setItemId(event.target.value)}>{passports.map(passport => <option className="bg-neutral-900" key={passport.itemId} value={passport.itemId}>{passport.title} · #{passport.tokenId}</option>)}</select></label><label className="block space-y-2 text-sm"><span>Receiving wallet</span><input className={field} required autoComplete="off" spellCheck={false} placeholder="0x…" value={recipient} onChange={event => setRecipient(event.target.value)} /></label></>}
			<div className="flex gap-4"><button className={button} disabled={busy || !connection} type="submit">{busy ? "Awaiting confirmation…" : review ? "Confirm transfer" : "Review transfer"}</button>{review && <button type="button" className="cursor-pointer text-sm text-white/50" disabled={busy} onClick={() => setReview(false)}>Back</button>}</div>
		</form>}
		{error && <p role="alert" className="mt-5 break-words text-sm text-red-300">{error}{pending && " The result is still unknown. Check confirmation again; no new transfer will be sent."}</p>}
	</div>;
}
