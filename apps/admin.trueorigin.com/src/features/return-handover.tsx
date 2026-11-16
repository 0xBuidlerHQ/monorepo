"use client";

import { useActionState, useState } from "react";
import type { Submission } from "@0xhq/api-client/types";
import { handoverMethods, handoverSummary, type HandoverMethod } from "@0xhq/api-client/handovers";
import { recordReturn } from "@/actions/staff";

export function ReturnHandoverForm({ submission }: { submission: Submission }) {
	const [state, action, pending] = useActionState(recordReturn, {});
	const [method, setMethod] = useState<HandoverMethod>("in_person");
	const handover = submission.returnHandover;
	if (!submission.history.some(event => event.status === "received")) return null;
	if (handover) return <section className="mt-6 rounded-2xl bg-white/[0.04] p-5"><h3 className="text-sm font-medium">{handover.status === "received" ? "Physical item received by owner" : "Waiting for receipt confirmation"}</h3><p className="mt-3 text-xs text-white/55">{handoverMethods[handover.method].label} · {handoverSummary(handover)}</p><p className="mt-2 text-xs text-white/40">{handover.receivedAt ? `Owner confirmed ${new Date(handover.receivedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC` : "The owner can confirm receipt in their submissions."}</p><p className="mt-3 text-[11px] leading-5 text-white/35">NFT issuance is tracked separately.</p></section>;
	const definition = handoverMethods[method];
	return <section className="mt-6 border-t border-white/10 pt-6">
		<h3 className="text-lg font-medium">Return the physical item</h3>
		<p className="mt-2 text-xs leading-6 text-white/45">Choose how the item is being returned. Details stay private to staff and the owner.</p>
		<form action={action} className="mt-5 space-y-4">
			<input type="hidden" name="id" value={submission.id} /><input type="hidden" name="version" value={submission.version} /><input type="hidden" name="method" value={method} />
			<fieldset disabled={pending} className="grid grid-cols-2 gap-3"><legend className="mb-3 text-xs text-white/50">Handover method</legend>{(Object.keys(handoverMethods) as HandoverMethod[]).map(key => <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-2xl p-4 text-sm transition-colors ${method === key ? "bg-white/10 text-white" : "bg-black/15 text-white/45"}`}><input type="radio" name="handoverMethod" value={key} checked={method === key} onChange={() => setMethod(key)} className="accent-white" />{handoverMethods[key].label}</label>)}</fieldset>
			<p className="text-xs leading-6 text-white/45">{definition.description}</p>
			<div key={method} className="space-y-4">{definition.fields.map(field => <label key={field.name} className="block text-xs text-white/50">{field.label}{!field.required && <span className="ml-2 text-white/25">Optional</span>}<input name={field.name} required={field.required} maxLength={field.maxLength} disabled={pending} className="mt-2 h-11 w-full rounded-xl bg-black/20 px-4 text-sm text-white" /></label>)}</div>
			<p className="text-[11px] leading-5 text-white/35">{method === "in_person" ? "Record this after handing the item to the owner." : "Record this after giving the parcel to the carrier."} The owner confirms receipt separately.</p>
			{state.error && <p role="alert" className="text-xs text-red-300">{state.error}</p>}
			<button disabled={pending} type="submit" className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm text-black disabled:opacity-50">{pending ? "Recording…" : definition.recordLabel}</button>
		</form>
	</section>;
}
