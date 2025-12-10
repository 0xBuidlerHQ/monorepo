"use client";

import type React from "react";
import { useCallback, useLayoutEffect, useRef } from "react";

type FitTextToContainerProps = {
	text: string;
};

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 1000;
const FONT_PRECISION = 0.1; // px

const FitTextToContainer: React.FC<FitTextToContainerProps> = ({ text }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const textRef = useRef<HTMLDivElement | null>(null);

	const fitText = useCallback(() => {
		const container = containerRef.current;
		const textEl = textRef.current;
		if (!container || !textEl) return;

		// Reset to a large known size for consistent measurement
		textEl.style.fontSize = `${MAX_FONT_SIZE}px`;

		let low = MIN_FONT_SIZE;
		let high = MAX_FONT_SIZE;

		while (high - low > FONT_PRECISION) {
			const mid = (low + high) / 2;
			textEl.style.fontSize = `${mid}px`;

			const fitsWidth = textEl.scrollWidth <= container.clientWidth;

			if (fitsWidth) {
				low = mid; // can go bigger
			} else {
				high = mid; // too big, shrink
			}
		}

		textEl.style.fontSize = `${low}px`;
	}, [text]);

	useLayoutEffect(() => {
		fitText();
	}, [fitText]);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(() => fitText());

		observer.observe(container);
		return () => observer.disconnect();
	}, [fitText]);

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				overflowX: "hidden",
				overflowY: "visible", // prevent clipping descenders
				boxSizing: "border-box",
			}}
		>
			<div
				ref={textRef}
				style={{
					display: "inline-block",
					whiteSpace: "nowrap",
					lineHeight: "normal",
				}}
			>
				{text}
			</div>
		</div>
	);
};

export default FitTextToContainer;
