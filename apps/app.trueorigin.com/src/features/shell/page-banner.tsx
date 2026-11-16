"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import type { StaticImageData } from "next/image";
import { RevealImage } from "@/components/ui/reveal-image";

export function PageBanner({ title, image, titleId }: { title: string; image: string | StaticImageData; titleId: string }) {
	const reducedMotion = useReducedMotion();
	const targetX = useMotionValue(0);
	const targetY = useMotionValue(0);
	const x = useSpring(targetX, { stiffness: 120, damping: 24, mass: 0.3 });
	const y = useSpring(targetY, { stiffness: 120, damping: 24, mass: 0.3 });
	function moveImage(event: PointerEvent<HTMLElement>) {
		if (reducedMotion || event.pointerType !== "mouse") return;
		const bounds = event.currentTarget.getBoundingClientRect();
		targetX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
		targetY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
	}
	function resetImage() { targetX.set(0); targetY.set(0); }
	return (
		<header onPointerMove={moveImage} onPointerLeave={resetImage} className="relative isolate flex h-40 items-center overflow-hidden rounded-xl sm:h-[300px]">
			<motion.div aria-hidden="true" className="pointer-events-none absolute -inset-2" style={{ x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }}><RevealImage src={image} alt="" fill sizes="(min-width: 640px) calc(100vw - 96px), calc(100vw - 48px)" preload className="object-cover object-center" /></motion.div>
			<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />
			<h1 id={titleId} className="relative z-10 px-6 text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white sm:px-10">{title}</h1>
		</header>
	);
}
