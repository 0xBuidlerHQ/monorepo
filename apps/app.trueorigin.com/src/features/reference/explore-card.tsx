"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { RevealImage } from "@/components/ui/reveal-image";
import Link from "next/link";
import type { ReactNode } from "react";

const MotionLink = motion.create(Link);
const defaultSizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export function ExploreCard({ name, nameTitle, brand, brandMono = false, expressive = false, href, image, alt, sizes = defaultSizes, placeholder, description, nameAdornment, inlineMetadata = false, imageLayout = "square", unoptimized = false, headingAs: Heading = "h3" }: {
	unoptimized?: boolean;
	name: string;
 nameTitle?: string;
	brand: ReactNode;
	brandMono?: boolean;
	expressive?: boolean;
	href: string;
	image?: ImageProps["src"];
	alt: string;
	placeholder?: ReactNode;
	description?: ReactNode;
	nameAdornment?: ReactNode;
	inlineMetadata?: boolean;
	imageLayout?: "square" | "portrait";
	sizes?: string;
	headingAs?: "h3" | "h4";
}) {
	const reducedMotion = useReducedMotion();
	return (
		<MotionLink data-explore-universe={expressive ? name : undefined} href={href} prefetch={expressive ? undefined : false} scroll={false} initial="rest" animate="rest" whileHover="active" whileFocus="active" whileTap={reducedMotion ? undefined : { scale: 0.99 }}
			variants={{ rest: { opacity: 1, y: 0 }, active: { opacity: 1, y: reducedMotion ? 0 : -3 } }}
			transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
			className={`group relative isolate flex flex-col ${expressive ? "overflow-visible" : "overflow-hidden"} ${inlineMetadata ? "bg-gradient-to-b from-[#262626] to-[#191919] ring-1 ring-inset ring-white/[0.03] transition-[box-shadow] duration-300 hover:ring-white/[0.07] hover:shadow-[0_12px_28px_#00000045]" : "bg-[var(--surface)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.3)]"} text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${inlineMetadata ? "rounded-[14px] p-1.5" : imageLayout === "portrait" ? "rounded-2xl p-3" : "rounded-[28px] p-5"}`}>
			{!inlineMetadata && <motion.span aria-hidden="true" className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80"
				variants={{ rest: { x: 0, y: 0, backgroundColor: "rgba(255,255,255,0.1)" }, active: { x: 0, y: 0, backgroundColor: "rgba(255,255,255,0.2)" } }}>
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
			</motion.span>}
			<motion.div variants={{ rest: { y: 0 }, active: { y: expressive && !reducedMotion ? -6 : 0 } }} transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} className={imageLayout === "portrait" ? "relative aspect-[600/825] w-full" : expressive ? "relative -mt-12 aspect-square w-full" : "relative mt-5 aspect-square w-full"}>
				{expressive && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-5 rounded-full bg-[#f5d44d]/25 blur-3xl" variants={{ rest: { opacity: 0.2, scale: 0.85 }, active: { opacity: 0.75, scale: reducedMotion ? 0.85 : 1.05 } }} transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }} />}
				{image && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 blur-2xl"
					variants={{ rest: { opacity: 0, scale: 1.1 }, active: { opacity: inlineMetadata ? 0.25 : 0.85, scale: 1.1 } }}
					transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}>
					<Image unoptimized={unoptimized} src={image} alt="" fill sizes="96px" loading="lazy" decoding="async" className="object-contain" />
				</motion.div>}
				{image ? <RevealImage unoptimized={unoptimized} src={image} alt={alt} fill sizes={sizes} loading="lazy" decoding="async" className={inlineMetadata ? "rounded-[9px] object-contain" : imageLayout === "portrait" || name === "Yu-Gi-Oh!" ? "object-contain" : "object-contain p-2"} /> : <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">{placeholder ?? <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="size-[58%] text-white/[0.045]"><circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" /><path d="M10 50h28m24 0h28" stroke="currentColor" strokeWidth="2" /><circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="2" /></svg>}</div>}
			</motion.div>
			{inlineMetadata ? <div className="relative mt-1.5 flex min-h-9 min-w-0 items-center gap-1.5 px-1.5">
                <Heading title={nameTitle ?? name} className="min-w-0 truncate text-[14px] font-medium leading-5 tracking-[-0.02em] text-white/85 transition-colors group-hover:text-white">{name}</Heading>
                {nameAdornment && <span className="inline-flex shrink-0 items-center gap-1">{nameAdornment}</span>}
                {description && <span className="inline-flex shrink-0 items-center text-xs text-white/40">{description}</span>}
                <span className="ml-auto shrink-0 font-mono text-[10px] leading-5 tabular-nums text-white/35 transition-colors group-hover:text-white/60">{brand}</span>
            </div> : (
			<div className={`relative flex items-end justify-between gap-3 pt-4 ${imageLayout === "portrait" ? "px-2 pb-2" : ""}`}>
				<div className="min-w-0">
					{!brandMono && <p className={expressive ? "text-[11px] leading-tight text-white/40" : "text-xs leading-tight text-white/65"}>{brand}</p>}
					<Heading title={nameTitle ?? name} className="mt-1 text-lg font-medium leading-tight tracking-[-0.035em]">{name}{nameAdornment && <span className="ml-2 inline-flex items-center gap-1 align-middle">{nameAdornment}</span>}</Heading>
					{description && <p className="mt-2 text-xs leading-5 text-white/40">{description}</p>}
				</div>
				{brandMono && <p className="shrink-0 font-mono text-xs leading-tight text-white/65">{brand}</p>}
			</div>
			)}
		</MotionLink>
	);
}
