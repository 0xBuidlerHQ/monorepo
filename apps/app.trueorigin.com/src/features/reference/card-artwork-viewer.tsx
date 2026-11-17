"use client";

import { cardArtworkFrame } from "@/features/shell/detail-layout";

import { RevealImage as Image } from "@/components/ui/reveal-image";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

export function CardArtworkViewer({ src, name, number }: { src: string; name: string; number: string }) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState(false);
	const reducedMotion = useReducedMotion();
	function openArtwork() {
		dialog.current?.showModal();
		setOpen(true);
	}
	return (
		<>
			<div className="relative">
				<motion.button whileTap={reducedMotion ? undefined : { scale: 0.97 }} type="button" onClick={openArtwork} aria-label={`Enlarge ${name} artwork`} className={`${cardArtworkFrame} group cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white`}>
					<Image src={src} alt={`${name}, card ${number}`} fill preload sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain drop-shadow-[0_20px_30px_#00000070]" />
				</motion.button>
			</div>
			<dialog ref={dialog} onClose={() => setOpen(false)} aria-label={`${name} artwork`} className="fixed inset-0 m-auto h-[min(90dvh,950px)] max-h-none w-[min(90vw,690px)] max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-xl">
				<form method="dialog" className="absolute right-0 top-0 z-10"><motion.button whileTap={reducedMotion ? undefined : { scale: 0.97 }} type="submit" aria-label="Close artwork viewer" className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#292929] text-white/70 hover:text-white"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><path d="m6 6 12 12M6 18 18 6" /></svg></motion.button></form>
				<motion.div initial={false} animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reducedMotion ? 1 : 0.97 }} transition={{ duration: reducedMotion ? 0 : 0.22 }} className="relative h-full w-full px-5 py-12"><Image src={src} alt={`${name}, card ${number}`} fill sizes="(min-width: 768px) 600px, 90vw" className="object-contain p-10" /></motion.div>
			</dialog>
		</>
	);
}
