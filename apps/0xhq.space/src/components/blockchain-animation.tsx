"use client";

import {
	branches,
	exploded,
	type Figure,
	format,
	hub,
	padlock,
	rebuild,
	relay,
	settle,
	terminal,
} from "@lucasmarkes/hairline";
import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, useLayoutEffect, useRef } from "react";
import type { HairlineFigure } from "@/lib/content";

import { blockchainDrawings } from "./blockchain-drawings";
import { collectibleDrawings } from "./collectible-drawings";
import { defiDrawings } from "./defi-drawings";
import { ethereumDrawings } from "./ethereum-drawings";
import { layer2Drawings } from "./layer-2-drawings";
import { oracleDrawings } from "./oracle-drawings";
import { stablecoinDrawings } from "./stablecoin-drawings";
import { walletDrawings } from "./wallet-drawings";

const drawings = {
	...collectibleDrawings,
	...oracleDrawings,
	...walletDrawings,
	...layer2Drawings,
	...stablecoinDrawings,
	...defiDrawings,
	...blockchainDrawings,
	...ethereumDrawings,
	branches,
	terminal,
	padlock,
	format,
	rebuild,
	settle,
	relay,
	exploded,
	hub,
};

type DrawingInstance = {
	node: HTMLDivElement;
	engine: Figure;
	owners: Set<symbol>;
	playing: boolean;
	disposal?: ReturnType<typeof setTimeout>;
};

// Route changes replace article components. Retain the engine briefly so the
// translated article can adopt it without rebuilding its SVG or playback state.
const instances = new Map<string, DrawingInstance>();

const drawingStyle = {
	"--hairline-plate": "var(--background)",
	"--hairline-hi": "var(--foreground)",
	"--hairline-edge": "color-mix(in srgb, var(--foreground) 55%, transparent)",
	"--hairline-mid": "color-mix(in srgb, var(--foreground) 35%, transparent)",
	"--hairline-lo": "color-mix(in srgb, var(--foreground) 18%, transparent)",
} as CSSProperties;

export function BlockchainAnimation({
	figureName,
	animationId,
	caption,
	placement = "inline",
	showCaption = true,
}: {
	figureName: HairlineFigure;
	animationId: string;
	caption: string;
	placement?: "inline" | "section" | "glossary";
	showCaption?: boolean;
}) {
	const reducedMotion = useReducedMotion();
	const figure = useRef<HTMLElement>(null);
	const drawing = useRef<HTMLDivElement>(null);
	const key = `${animationId}:${figureName}`;

	useLayoutEffect(() => {
		if (!drawing.current || !figure.current) return;
		let cached = instances.get(key);
		if (!cached) {
			const node = document.createElement("div");
			node.style.aspectRatio = "5 / 4";
			node.style.width = "100%";
			cached = {
				node,
				engine: drawings[figureName](node, { intensity: 0.35, play: false }),
				owners: new Set(),
				playing: false,
			};
			instances.set(key, cached);
		}
		const current = cached;
		const owner = Symbol();
		clearTimeout(current.disposal);
		current.owners.add(owner);
		drawing.current.appendChild(current.node);
		const element = figure.current;
		element.dataset.playing = String(current.playing);
		const motionPreference = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let visible = false;
		function updatePlayback() {
			// An outgoing language may still be mounted while its replacement adopts
			// the drawing. Only the current host controls playback.
			if (current.node.parentElement !== element.firstElementChild) return;
			const playing = visible && !motionPreference.matches;
			if (current.playing !== playing) {
				current.playing = playing;
				current.engine.update({ play: playing });
			}
			element.dataset.playing = String(playing);
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				updatePlayback();
			},
			{ threshold: 0 },
		);
		observer.observe(element);
		motionPreference.addEventListener("change", updatePlayback);
		return () => {
			observer.disconnect();
			motionPreference.removeEventListener("change", updatePlayback);
			current.owners.delete(owner);
			if (current.owners.size) return;
			current.disposal = setTimeout(() => {
				current.engine.destroy();
				current.node.remove();
				instances.delete(key);
			}, 1000);
		};
	}, [key, figureName]);

	useLayoutEffect(() => {
		instances.get(key)?.engine.update({ label: caption });
	}, [caption, key]);

	return (
		<motion.figure
			ref={figure}
			initial={reducedMotion ? false : { opacity: 0, y: 8 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: false, amount: 0.05 }}
			transition={{
				duration: reducedMotion ? 0 : 0.6,
				ease: [0.32, 0.72, 0, 1],
			}}
			data-figure={figureName}
			className={`blockchain-illustration not-prose ${placement !== "inline" ? "my-5 flex flex-col items-center gap-4 min-[1280px]:m-0 min-[1280px]:flex-col min-[1280px]:gap-4" : "my-5 flex flex-col items-center gap-4"}`}
		>
			<div
				ref={drawing}
				style={{ ...drawingStyle, aspectRatio: "5 / 4" }}
				className={
					placement === "glossary"
						? "glossary-drawing shrink-0"
						: placement === "section"
							? "w-48 sm:w-56 shrink-0 min-[1280px]:w-full min-[1280px]:max-w-[var(--animation-drawing-width,100%)]"
							: "w-48 shrink-0 sm:w-56"
				}
			/>

			{showCaption && (
				<figcaption
					className={`font-sans text-center leading-relaxed text-foreground/60 ${placement !== "inline" ? "max-w-64 text-[13px] min-[1280px]:w-full min-[1280px]:text-center min-[1280px]:text-xs" : "max-w-64 text-[13px]"}`}
				>
					{caption}
				</figcaption>
			)}
		</motion.figure>
	);
}
