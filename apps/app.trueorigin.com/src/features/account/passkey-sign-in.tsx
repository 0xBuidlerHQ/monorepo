"use client";

import { useState } from "react";
import { useAccount } from "@/features/account/account-provider";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { beginPasskeyRegistration, beginPasskeyAuthentication, finishPasskeyRegistration, finishPasskeyAuthentication } from "@/actions/account";

export function PasskeySignIn({ intent = "account" }: { intent?: "account" | "submission" }) {
	const { refreshIdentity } = useAccount();
	const [pending, setPending] = useState(false), [error, setError] = useState("");
	async function connect(register: boolean) {
		setPending(true); setError("");
		try {
			if (register) {
				const start = await beginPasskeyRegistration(); if (!start.ok) throw new Error(start.error);
				const response = await startRegistration({ optionsJSON: start.data });
				const result = await finishPasskeyRegistration(response); if (!result.ok) throw new Error(result.error);
			} else {
				const start = await beginPasskeyAuthentication(); if (!start.ok) throw new Error(start.error);
				const response = await startAuthentication({ optionsJSON: start.data });
				const result = await finishPasskeyAuthentication(response); if (!result.ok) throw new Error(result.error);
			}
			await refreshIdentity();
		} catch (cause) { setError(cause instanceof Error && cause.name !== "NotAllowedError" ? cause.message : "Sign-in was cancelled. Try again when you’re ready."); }
		finally { setPending(false); }
	}
	return <div className={intent === "submission" ? "mt-10 max-w-xl rounded-[28px] bg-[#1c1c1c] p-7 sm:p-9" : "flex flex-1 flex-col pb-4 pt-10"}>
		<div className="mb-7 grid size-14 place-items-center rounded-2xl bg-white/[0.05] text-white/65"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-6"><circle cx="8" cy="9" r="4" /><path d="m11 12 9 9m-5-5 3-3m-6 0 3-3" /></svg></div>
		<h2 className="text-[40px] font-medium leading-[1.05] tracking-[-0.06em]">{intent === "submission" ? "Start with your account." : <>Make yourself<br />at home.</>}</h2>
		<p className="mt-4 max-w-xs text-sm leading-6 text-white/40">{intent === "submission" ? "Sign in to submit an item and follow its progress. No transaction is needed." : "Your collection and its next chapter, all in one place."}</p>
		<div className="mt-9"><button type="button" disabled={pending} onClick={() => void connect(false)} className="flex h-13 w-full cursor-pointer items-center justify-between rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/85 disabled:cursor-wait disabled:opacity-50"><span>{pending ? "Connecting…" : "Sign in with a passkey"}</span><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M3 10h14m-5-5 5 5-5 5" /></svg></button><div className="mt-5 flex items-center justify-center gap-2 text-xs"><span className="text-white/30">New here?</span><button type="button" disabled={pending} onClick={() => void connect(true)} className="cursor-pointer text-white/75 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-50">Create an account</button></div></div>
		{error && <p role="alert" className="mt-5 text-sm leading-6 text-red-300">{error}</p>}
		<p className="mt-auto pt-12 text-[11px] leading-6 text-white/25">Protected with a passkey. No password to remember.</p>
	</div>;
}
