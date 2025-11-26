"use client";

import React from "react";

function ResponsiveText({ text }) {
	const containerRef = React.useRef(null);
	const measureRef = React.useRef(null);
	const visibleRef = React.useRef(null);

	React.useLayoutEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;
		const visible = visibleRef.current;

		if (!container || !measure || !visible) return;

		const fit = () => {
			const parentWidth = container.clientWidth;
			if (!parentWidth) return;

			// prepare measuring span
			measure.style.whiteSpace = "nowrap";
			measure.style.fontSize = "10px"; // some base size to start from

			// binary search for max font size that fits
			let low = 1;
			let high = parentWidth; // safe upper bound
			let best = 1;

			while (low <= high) {
				const mid = Math.floor((low + high) / 2);
				measure.style.fontSize = mid + "px";

				const textWidth = measure.scrollWidth;

				if (textWidth <= parentWidth) {
					best = mid;
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

			const finalSize = Math.max(1, best - 1); // tiny breathing room

			// apply both font-size and line-height to match
			visible.style.fontSize = finalSize + "px";
			visible.style.lineHeight = finalSize + "px"; // <- line height fits the letters
		};

		fit();

		let ro;
		if (typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(fit);
			ro.observe(container);
		} else {
			window.addEventListener("resize", fit);
		}

		return () => {
			if (ro) ro.disconnect();
			else window.removeEventListener("resize", fit);
		};
	}, [text]);

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				display: "flex",
				alignItems: "center",
			}}
		>
			{/* hidden measuring span */}
			<span
				ref={measureRef}
				style={{
					position: "absolute",
					visibility: "hidden",
					whiteSpace: "nowrap",
					pointerEvents: "none",
				}}
			>
				{text}
			</span>

			{/* visible text (no default fontSize set) */}
			<span
				ref={visibleRef}
				style={{
					whiteSpace: "nowrap",
					display: "inline-block",
					backgroundColor: "red", // debug
					overflow: "hidden",
				}}
			>
				{text}
			</span>
		</div>
	);
}

export default ResponsiveText;
