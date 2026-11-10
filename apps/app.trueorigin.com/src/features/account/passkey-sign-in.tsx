"use client";

import { useState } from "react";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
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
	return <div className={intent === "submission" ? "mt-10 max-w-xl rounded-[28px] bg-[#1c1c1c] p-7 sm:p-9" : "flex flex-1 flex-col pb-2 pt-8"}>
		<div className={intent === "submission" ? "mb-8" : "flex flex-1 flex-col items-center justify-center pb-12 pt-6 text-center"}>
			<div className="mb-7 grid size-20 place-items-center rounded-full bg-white/[0.035] text-white"><TrueOriginsMark className="h-10 w-9" /></div>
			<h2 className="text-[34px] font-medium leading-[1.12] tracking-[-0.05em]">{intent === "submission" ? "Before you submit." : <>Welcome to<br />TrueOrigin.</>}</h2>
			<p className="mt-4 max-w-[260px] text-sm leading-6 text-white/45">{intent === "submission" ? "Sign in to submit your item and follow its progress." : "Your collection, submissions, and transfers. All in one place."}</p>
		</div>
		<div className="mt-auto pb-4 pt-6">
			<button type="button" disabled={pending} onClick={() => void connect(false)} className="group flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#f0f0ed] px-5 text-sm font-medium text-[#171717] transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-50"><span>{pending ? "Connecting…" : "Sign in"}</span><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"><path d="M3 10h14m-5-5 5 5-5 5" /></svg></button>
			<div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs"><span className="text-white/35">First time here?</span><button type="button" disabled={pending} onClick={() => void connect(true)} className="cursor-pointer py-2 font-medium text-white/80 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-50">Create an account</button></div>
		</div>
		{error && <p role="alert" className="mt-5 text-sm leading-6 text-red-300">{error}</p>}
	</div>;
}
