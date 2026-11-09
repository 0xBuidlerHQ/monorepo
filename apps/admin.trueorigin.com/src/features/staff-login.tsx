"use client";
import { useActionState } from "react";
import { staffLogin } from "@/actions/staff";

export function StaffLogin() {
	const [state, action, pending] = useActionState(staffLogin, {});
	return <form action={action} className="mt-10 max-w-md rounded-3xl bg-[#1c1c1c] p-7"><h2 className="text-xl font-medium tracking-tight">Staff sign-in</h2><p className="mt-3 text-sm leading-6 text-white/45">Access submission requests and inspection records.</p><label className="mt-6 block text-xs text-white/50">Password<input required name="password" type="password" maxLength={256} autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-white/40" /></label>{state.error && <p role="alert" className="mt-4 text-sm text-red-300">{state.error}</p>}<button disabled={pending} type="submit" className="mt-5 cursor-pointer rounded-full bg-white px-5 py-3 text-sm text-black disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button></form>;
}
