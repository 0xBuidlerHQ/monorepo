"use client";

import { useEffect, useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useAccount } from "./account-provider";
import { AccountIcon } from "./account-icon";
import { AccountOverview } from "./account-overview";
import { PasskeySignIn } from "./passkey-sign-in";

export function LoginButton() {
	const [open, setOpen] = useState(false);
	const { identity, connection, phase } = useAccount();
	const address = connection?.account.address;
	useEffect(() => { if (identity) setOpen(false); }, [identity]);
	return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
		<DrawerTrigger disabled={phase === "restoring"} aria-label={identity ? "Open account" : "Log in"} title={identity && address ? address : undefined} className="group inline-flex h-12 shrink-0 cursor-pointer items-center gap-2.5 rounded-full bg-[#eeeeeb] p-2 pr-5 text-[#171717] shadow-[0_2px_8px_#00000014,inset_0_1px_0_#ffffff] ring-1 ring-white/10 transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_3px_12px_#00000024,inset_0_1px_0_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait data-popup-open:bg-white motion-reduce:transition-none">
			<span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-black/[0.05]">{identity && address ? <span className="overflow-hidden rounded-full"><AccountIcon address={address} size={32} /></span> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-[18px] text-black/65"><circle cx="12" cy="8" r="3.25" /><path d="M5.5 21v-1a6.5 6.5 0 0 1 13 0v1" /></svg>}{identity && <span className="absolute -bottom-0.5 -right-0.5 grid size-3 place-items-center rounded-full bg-[#171717] text-white ring-2 ring-[#eeeeeb]"><svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-2"><path d="m3 6 2 2 4-4" /></svg></span>}</span>
			<span className="text-sm font-medium tracking-[-0.02em]">{identity ? "Account" : "Log in"}</span>
			<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-black/35"><path d="m6 4 4 4-4 4" /></svg>
		</DrawerTrigger>
		<DrawerContent style={{ height: "100dvh", maxHeight: "100dvh", width: "min(100vw, 420px)" }} className="border-white/[0.07] bg-[#171717] text-white shadow-[-24px_0_80px_#00000030] [--drawer-bleed-background:#171717] [color-scheme:dark] data-[swipe-direction=right]:rounded-l-[28px]">
			<div className="flex items-center justify-between px-7 pb-2 pt-6"><DrawerTitle className="text-xs font-normal tracking-normal text-white/35">Account</DrawerTitle><DrawerClose aria-label="Close account" className="grid size-8 cursor-pointer place-items-center rounded-full bg-white/[0.04] text-white/45 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="size-4"><path d="m5 5 10 10M15 5 5 15" /></svg></DrawerClose></div>
			<DrawerDescription className="sr-only">{identity ? "Manage your account and access your collection and submissions." : "Sign in or create an account using a passkey."}</DrawerDescription>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{identity ? <AccountOverview onNavigate={() => setOpen(false)} /> : <PasskeySignIn />}</div>
		</DrawerContent>
	</Drawer>;
}
