"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ImageProps } from "next/image";
import { RevealImage } from "@/components/ui/reveal-image";
import Link from "next/link";
import type { ReactNode } from "react";

const MotionLink = motion.create(Link);
const defaultSizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export function ExploreCard({ name, brand, brandMono = false, href, image, alt, sizes = defaultSizes, placeholder, description, imageLayout = "square", headingAs: Heading = "h3" }: {
	name: string;
	brand: string;
	brandMono?: boolean;
	href: string;
	image?: ImageProps["src"];
	alt: string;
	placeholder?: ReactNode;
	description?: string;
	imageLayout?: "square" | "portrait";
	sizes?: string;
	headingAs?: "h3" | "h4";
}) {
	const reducedMotion = useReducedMotion();
	return (
		<MotionLink href={href} scroll={false} initial="rest" animate="rest" whileHover="active" whileFocus="active" whileTap={reducedMotion ? undefined : { scale: 0.99 }}
			variants={{ rest: { opacity: 1, y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" }, active: { opacity: 1, y: reducedMotion ? 0 : -3, boxShadow: "0 18px 36px rgba(0,0,0,0.3)" } }}
			transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
			className={`relative isolate flex flex-col overflow-hidden bg-[#1c1c1c] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${imageLayout === "portrait" ? "rounded-2xl p-3" : "rounded-[28px] p-5"}`}>
			<motion.span aria-hidden="true" className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80"
				variants={{ rest: { x: 0, y: 0, backgroundColor: "rgba(255,255,255,0.1)" }, active: { x: 0, y: 0, backgroundColor: "rgba(255,255,255,0.2)" } }}>
				<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
			</motion.span>
			<div className={imageLayout === "portrait" ? "relative aspect-[600/825] w-full" : "relative mt-5 aspect-square w-full"}>
				{image && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 blur-2xl"
					variants={{ rest: { opacity: 0.25, scale: 1.1 }, active: { opacity: 0.85, scale: 1.1 } }}
					transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}>
					<RevealImage src={image} alt="" fill sizes={sizes} loading="lazy" decoding="async" className="object-contain" />
				</motion.div>}
				{image ? <RevealImage src={image} alt={alt} fill sizes={sizes} loading="lazy" decoding="async" className={imageLayout === "portrait" || name === "Yu-Gi-Oh!" ? "object-contain" : "object-contain p-2"} /> : <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">{placeholder ?? <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="size-[58%] text-white/[0.045]"><circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" /><path d="M10 50h28m24 0h28" stroke="currentColor" strokeWidth="2" /><circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="2" /></svg>}</div>}
			</div>
			<div className={`relative flex items-end justify-between gap-3 pt-4 ${imageLayout === "portrait" ? "px-2 pb-2" : ""}`}>
				<div className="min-w-0">
					{!brandMono && <p className="text-xs leading-tight text-white/65">{brand}</p>}
					<Heading className="mt-1 text-lg font-medium leading-tight tracking-[-0.035em]">{name}</Heading>
					{description && <p className="mt-2 text-xs leading-5 text-white/40">{description}</p>}
				</div>
				{brandMono && <p className="shrink-0 font-mono text-xs leading-tight text-white/65">{brand}</p>}
			</div>
		</MotionLink>
	);
}
