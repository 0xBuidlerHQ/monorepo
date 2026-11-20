"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
import { LoginButton } from "@/features/account/login-button";

const MotionLink = motion.create(Link);

export function AppHeader() {
	const reducedMotion = useReducedMotion();
	return (
		<header data-app-header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex h-[var(--app-header-height)] items-center justify-between gap-4 px-[var(--app-gutter)] text-[#dedede]">
			<MotionLink href="/explore" whileTap={reducedMotion ? undefined : { scale: 0.94 }} aria-label="TrueOrigins Explore" className="pointer-events-auto flex shrink-0 items-center gap-2 text-sm font-medium tracking-tight text-inherit transition-colors hover:text-white">
				<span aria-hidden="true">true</span>
				<TrueOriginsMark className="h-7 w-6 shrink-0" />
				<span aria-hidden="true">origin</span>
			</MotionLink>
			<div className="pointer-events-auto"><Suspense fallback={<div role="status" aria-label="Loading account" className="h-9 w-40 shrink-0 rounded-full bg-[#161616]" />}><LoginButton /></Suspense></div>
		</header>
	);
}
