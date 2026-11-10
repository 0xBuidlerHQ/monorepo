"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
import { LoginButton } from "@/features/account/login-button";
import { ResearchPanel } from "@/features/navigation/research-panel";

const MotionLink = motion.create(Link);

export function AppHeader() {
	const reducedMotion = useReducedMotion();
	return (
		<header data-app-header className="fixed inset-x-0 top-0 z-20 flex h-[var(--app-header-height)] items-center justify-between gap-4 bg-[#141414]/80 px-6 py-3 backdrop-blur-xl sm:px-12">
			<div className="flex min-w-0 items-center gap-3 sm:gap-5"><MotionLink href="/explore" whileTap={reducedMotion ? undefined : { scale: 0.94 }} aria-label="TrueOrigins Explore" className="flex min-w-0 items-center gap-2.5 text-white">
				<TrueOriginsMark className="h-8 w-7 shrink-0" />
			</MotionLink><ResearchPanel /></div>
			<Suspense fallback={<div role="status" aria-label="Loading account" className="h-12 w-[184px] shrink-0 rounded-full bg-[#f0f0ed]" />}><LoginButton /></Suspense>
		</header>
	);
}
