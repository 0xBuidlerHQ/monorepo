"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@0xhq/api-client/types";
import { itemUniverseLabel, itemSchemas, getItemSchema, parsePassportItem, itemDisplayTitle, type PassportItem } from "@0xhq/api-client/passport-item";
import { issuePassport } from "@/actions/staff";

export function PassportIssuanceForm({ submission }: { submission: Submission }) {
	const router = useRouter();
	const [state, action, pending] = useActionState(issuePassport, {});
	const passport = submission.passport;
 const [item, setItem] = useState<PassportItem>(passport?.item ?? { type: "card", schemaVersion: 1, universe: "pokemon", attributes: { subject: "", set: "", number: "", total: "" } });
 const schema = getItemSchema(item);
 let preview = "Complete the item details";
 try { preview = itemDisplayTitle(parsePassportItem(item)); } catch { /* Keep the preview pending until required fields are complete. */ }
 const inputClass = "mt-2 h-11 w-full rounded-xl bg-black/20 px-4 text-sm text-white";
	const inProgress = passport && !["confirmed", "failed"].includes(passport.status);
	useEffect(() => {
		if (passport?.status === "confirmed" || (!inProgress && !state.message)) return;
		const timer = setInterval(() => router.refresh(), 3000);
		return () => clearInterval(timer);
	}, [inProgress, state.message, passport?.status, router]);
	if (passport?.status === "confirmed") return <section className="mt-6 rounded-2xl bg-white/[0.04] p-5"><h3 className="text-sm font-medium">Passport issued</h3><p className="mt-2 text-xs text-white/50">Minted to the owner on the local development chain.</p><dl className="mt-4 space-y-3 break-all font-mono text-[11px] text-white/60"><div><dt className="text-white/30">Token</dt><dd>#{passport.tokenId}</dd></div><div><dt className="text-white/30">Contract</dt><dd>{passport.contractAddress}</dd></div><div><dt className="text-white/30">Transaction</dt><dd>{passport.transactionHash}</dd></div><div><dt className="text-white/30">Metadata</dt><dd>{passport.metadataURI}</dd></div></dl></section>;
	return <section className="mt-6 border-t border-white/10 pt-6"><h3 className="text-lg font-medium">Issue passport</h3><p className="mt-2 text-xs leading-6 text-white/45">The inspection is approved. Public item details are backed up before minting directly to the receiving wallet. Local development chain only.</p>
		{inProgress ? <div role="status" className="mt-5 rounded-2xl bg-white/5 p-4"><p className="text-sm">{passport.status === "queued" ? "Preparing metadata and backups…" : "Waiting for transaction confirmation…"}</p>{passport.transactionHash && <p className="mt-2 break-all font-mono text-[10px] text-white/40">{passport.transactionHash}</p>}{passport.error && <p className="mt-3 text-xs leading-6 text-orange-200">{passport.error}</p>}</div> : <form action={action} className="mt-5 space-y-4">
			<input type="hidden" name="id" value={submission.id} /><input type="hidden" name="version" value={submission.version} />

   <fieldset disabled={!!passport} className="grid gap-4 sm:grid-cols-2">
    <label className="block text-xs text-white/50">Item type<select name="itemType" value={`${item.type}:${item.schemaVersion}`} onChange={event => {
     const selected = itemSchemas.find(entry => `${entry.type}:${entry.version}` === event.target.value);
     if (selected) setItem({ type: selected.type, schemaVersion: selected.version, universe: selected.universes.includes(item.universe) ? item.universe : selected.universes[0], attributes: {} });
    }} className={inputClass}>{itemSchemas.map(entry => <option key={`${entry.type}:${entry.version}`} value={`${entry.type}:${entry.version}`}>{entry.label}</option>)}</select></label>
    <label className="block text-xs text-white/50">Universe<select name="universe" value={item.universe} onChange={event => setItem({ ...item, universe: event.target.value })} className={inputClass}>{schema?.universes.map(id => <option key={id} value={id}>{itemUniverseLabel(id)}</option>)}</select></label>
    {schema?.fields.map(field => <label key={field.key} className="block text-xs text-white/50">{field.label}{field.unit ? ` (${field.unit})` : ""}
     <input name={field.key} type={field.type === "boolean" ? "checkbox" : field.type === "number" ? "number" : "text"} required={field.type !== "boolean" && !passport && field.required} maxLength={field.maxLength} placeholder={field.placeholder} value={field.type === "boolean" ? undefined : String(item.attributes[field.key] ?? "")} checked={field.type === "boolean" ? Boolean(item.attributes[field.key]) : undefined} onChange={event => setItem({ ...item, attributes: { ...item.attributes, [field.key]: field.type === "boolean" ? event.target.checked : field.type === "number" ? event.target.valueAsNumber : event.target.value } })} className={field.type === "boolean" ? "mt-2 block size-4 accent-white" : inputClass} />
    </label>)}
   </fieldset>
   <p className="text-xs text-white/60">Display title: <span className="font-medium text-white">{passport?.title ?? preview}</span></p>
			<label className="block text-xs text-white/50">Grade<input name="grade" maxLength={40} defaultValue={passport?.grade ?? submission.grade} className="mt-2 h-11 w-full rounded-xl bg-black/20 px-4 text-sm text-white" /></label>
			<p className="break-all font-mono text-[10px] text-white/40">To: {submission.recipientAddress}</p>
			{passport?.error && <p role="alert" className="text-xs text-red-300">{passport.error}</p>}
			<button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm text-black disabled:opacity-50">{pending ? "Starting…" : passport ? "Retry issuance" : "Issue passport"}</button>
		</form>}
		{state.error && <p role="alert" className="mt-4 text-sm text-red-300">{state.error}</p>}
		{state.message && !inProgress && <p role="status" className="mt-4 text-xs text-white/50">{state.message}</p>}
	</section>;
}
