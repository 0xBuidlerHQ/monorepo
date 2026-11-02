"use client";

import { motion, useIsPresent, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./hairline-drawing.module.css";

export type HairlineScene =
	| "sketchbook"
	| "workbench"
	| "ideas"
	| "learn"
	| "curated"
	| "glossary"
	| "content";

export function HairlineDrawing({ scene }: { scene: HairlineScene }) {
	const [ready, setReady] = useState(false);
	const reducedMotion = useReducedMotion();
	const isPresent = useIsPresent();
	const stage = useRef<HTMLDivElement>(null);
	const interaction = useRef<{
		move(point: [number, number]): void;
		leave(): void;
	} | null>(null);
	const canvasHeight = useRef(800);
	useEffect(() => {
		if (!isPresent) interaction.current?.leave();
	}, [isPresent]);

	useEffect(() => {
		let disposed = false;
		let destroy: (() => void) | undefined;
		const element = stage.current;
		if (!element) return;
		let lastHeight = 0;
		const resize = new ResizeObserver(async ([entry]) => {
			const { width, height } = entry.contentRect;
			if (width <= 0 || height <= 0) return;
			const nextHeight = Math.round((height / width) * 400);
			if (nextHeight === lastHeight) return;
			lastHeight = nextHeight;
			const { mountPortraitStudio } = await import("@/lib/portrait-studio");
			if (disposed || nextHeight !== lastHeight) return;
			destroy?.();
			canvasHeight.current = nextHeight;
			const figure = mountPortraitStudio(element, nextHeight, scene);
			interaction.current = figure;
			destroy = figure.destroy;
			setReady(true);
		});
		resize.observe(element);
		return () => {
			disposed = true;
			resize.disconnect();
			interaction.current = null;
			destroy?.();
		};
	}, [scene]);

	return (
		<motion.div
			ref={stage}
			initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
			animate={{ opacity: ready ? 1 : 0, y: 0 }}
			exit={{
				opacity: 0,
				y: reducedMotion ? 0 : -4,
				transition: { duration: reducedMotion ? 0 : 0.2 },
			}}
			transition={{
				duration: reducedMotion ? 0 : 0.6,
				ease: [0.32, 0.72, 0, 1],
			}}
			style={{ pointerEvents: isPresent ? "auto" : "none" }}
			className={styles.scene}
			data-hairline={scene}
			data-portrait
			onPointerMove={(event) => {
				if (!isPresent) return;
				const bounds = event.currentTarget.getBoundingClientRect();
				interaction.current?.move([
					((event.clientX - bounds.left) / bounds.width) * 400,
					((event.clientY - bounds.top) / bounds.height) * canvasHeight.current,
				]);
			}}
			onPointerLeave={() => interaction.current?.leave()}
		/>
	);
}
