"use client";

import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isContentLocale } from "@/lib/locales";
import { HairlineDrawing, type HairlineScene } from "./hairline-drawing";
import styles from "./side-drawings.module.css";

const pageDrawings = {
	"/": "curated",
	"/thoughts": "sketchbook",
	"/ideas": "ideas",
	"/learn": "learn",
	"/curated": "curated",
	"/content": "content",
	"/glossary": "glossary",
} as const satisfies Record<string, HairlineScene>;

export function SideDrawings() {
	const segments = usePathname().split("/").filter(Boolean);
	if (segments[0] && isContentLocale(segments[0])) segments.shift();
	const path = `/${segments.join("/")}`;
	const scene = pageDrawings[path as keyof typeof pageDrawings];
	const drawings = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const main = document.querySelector("main");
		if (!main) return;
		const header = document.querySelector(".site-header");
		const align = () => {
			drawings.current?.style.setProperty(
				"--content-bottom",
				`${main.getBoundingClientRect().bottom + window.scrollY}px`,
			);
			const title = main.querySelector("h1");
			if (!title) return;
			const bounds = title.getBoundingClientRect();
			drawings.current?.style.setProperty(
				"--header-bottom",
				`${(header?.getBoundingClientRect().bottom ?? 0) + window.scrollY}px`,
			);
			// Use the title's document position so scrolling does not move the drawing.
			drawings.current?.style.setProperty(
				"--title-center",
				`${bounds.top + window.scrollY + bounds.height / 2}px`,
			);
		};
		const resize = new ResizeObserver(align);
		resize.observe(main);
		if (header) resize.observe(header);
		const mutations = new MutationObserver(align);
		mutations.observe(main, { childList: true, subtree: true });
		align();
		return () => {
			resize.disconnect();
			mutations.disconnect();
		};
	}, []);

	return (
		<div
			ref={drawings}
			className={styles.drawings}
			data-portrait
			aria-hidden="true"
		>
			<div className={styles.leftBackground} />
			<div className={styles.rightBackground} />
			<div className={`${styles.drawing} ${styles.left}`}>
				<AnimatePresence mode="wait">
					{scene && <HairlineDrawing key={path} scene={scene} />}
				</AnimatePresence>
			</div>
		</div>
	);
}
