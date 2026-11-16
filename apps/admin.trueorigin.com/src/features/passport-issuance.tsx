"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@0xhq/api-client/types";
import { issuePassport } from "@/actions/staff";

export function PassportIssuanceForm({ submission }: { submission: Submission }) {
	const router = useRouter();
	const [state, action, pending] = useActionState(issuePassport, {});
	const passport = submission.passport;
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
			<label className="block text-xs text-white/50">Item name<input name="title" required maxLength={200} defaultValue={passport?.title ?? submission.title} className="mt-2 h-11 w-full rounded-xl bg-black/20 px-4 text-sm text-white" placeholder="e.g. Charizard — Base Set" /></label>
			<label className="block text-xs text-white/50">Grade<input name="grade" maxLength={40} defaultValue={passport?.grade ?? submission.grade} className="mt-2 h-11 w-full rounded-xl bg-black/20 px-4 text-sm text-white" /></label>
			<p className="break-all font-mono text-[10px] text-white/40">To: {submission.recipientAddress}</p>
			{passport?.error && <p role="alert" className="text-xs text-red-300">{passport.error}</p>}
			<button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm text-black disabled:opacity-50">{pending ? "Starting…" : passport ? "Retry issuance" : "Issue passport"}</button>
		</form>}
		{state.error && <p role="alert" className="mt-4 text-sm text-red-300">{state.error}</p>}
		{state.message && !inProgress && <p role="status" className="mt-4 text-xs text-white/50">{state.message}</p>}
	</section>;
}
