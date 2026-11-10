"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useAccount } from "./account-provider";
import { AccountIcon } from "./account-icon";
import { AccountOverview } from "./account-overview";
import { PasskeySignIn } from "./passkey-sign-in";

export function LoginButton() {
	const [open, setOpen] = useState(false);
	const reducedMotion = useReducedMotion();
	const { identity, connection } = useAccount();
	const address = connection?.account.address;
	useEffect(() => { if (identity) setOpen(false); }, [identity]);
	return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
		<DrawerTrigger aria-label={identity ? "Open account" : "Sign in"} title={identity && address ? address : undefined} className="group inline-flex h-12 w-[184px] shrink-0 cursor-pointer items-center gap-2.5 rounded-full bg-[#f0f0ed] p-1.5 pr-2 text-[#171717] shadow-[0_3px_12px_#00000018,inset_0_1px_0_#ffffff] transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_4px_20px_#00000026] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait data-popup-open:bg-white motion-reduce:transition-none">
			<span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#202020] text-white ring-1 ring-black/[0.06]">{identity ? <AccountIcon address={`0x${BigInt(identity.pubX).toString(16).slice(-40).padStart(40, "0")}`} size={36} /> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[19px]"><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>}</span>
			<span className={`flex min-w-0 flex-1 flex-col gap-0.5 pr-1 text-left ${identity ? "" : "pl-1"}`}><span className="text-[13px] font-medium leading-tight tracking-[-0.025em]">{identity ? "My Account" : "Sign in"}</span>{identity && <span className="text-[10px] font-mono leading-tight text-black/45">{address ? `${address.slice(0, 5)}...${address.slice(-4)}` : "\u00a0"}</span>}</span>
			<span className="grid size-7 shrink-0 place-items-center rounded-full bg-black/[0.04] text-black/40 transition-colors group-hover:bg-black/[0.07] group-hover:text-black/70 motion-reduce:transition-none"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">{identity ? <path d="m6 4 4 4-4 4" /> : <path d="M3 8h10m-4-4 4 4-4 4" />}</svg></span>
		</DrawerTrigger>
		<DrawerContent underlay={<DrawerClose aria-label="Close account drawer" render={<motion.button initial={false} animate={{ left: -32, width: 80, x: open ? 0 : 32, opacity: open ? 1 : 0 }} whileHover={open ? { left: -40, width: 88 } : undefined} whileTap={reducedMotion ? undefined : { scaleX: 0.98 }} transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 24, x: { type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }} />} className="absolute inset-y-0 -left-8 w-20 cursor-pointer rounded-[24px] bg-white/10 text-white/60 hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><span className="absolute inset-y-0 left-0 grid w-8 place-items-center"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="m8 5 5 5-5 5" /></svg></span></DrawerClose>} style={{ height: "calc(100dvh - 1rem)", maxHeight: "calc(100dvh - 1rem)", width: "min(calc(100vw - 2rem), 420px)", top: "0.5rem", bottom: "0.5rem", right: "0.5rem" }} className="border-white/[0.07] bg-[#171717] text-white shadow-[-24px_0_80px_#00000030] [--drawer-bleed-background:#171717] [color-scheme:dark] data-[swipe-direction=right]:rounded-[28px] [--bleed:0px] data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+3rem+2px),0,0)]">
			<DrawerTitle className="sr-only">Account</DrawerTitle>
			<DrawerDescription className="sr-only">{identity ? "Manage your account and access your collection and submissions." : "Sign in or create your TrueOrigin account."}</DrawerDescription>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{identity ? <AccountOverview onNavigate={() => setOpen(false)} /> : <PasskeySignIn />}</div>
		</DrawerContent>
	</Drawer>;
}
