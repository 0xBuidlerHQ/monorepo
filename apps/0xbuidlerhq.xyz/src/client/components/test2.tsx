"use client";

import React from "react";

function ResponsiveText({
	text,
	duration = 300,
	animation = "default", // "default" | "center"
	className = "",
	rightPadding = 0, // used ONLY for measurement safety, not visual padding
}) {
	const containerRef = React.useRef(null);
	const measureRef = React.useRef(null);

	const [fontSize, setFontSize] = React.useState(1);
	const [scale, setScale] = React.useState(1); // used for "center" animation

	React.useEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;

		if (!container || !measure) return;

		const fit = () => {
			const parentWidth = container.clientWidth;
			if (!parentWidth) return;

			// effective width = real width minus safety margin on the right
			const effectiveWidth = Math.max(0, parentWidth - rightPadding);
			if (!effectiveWidth) return;

			measure.style.whiteSpace = "nowrap";

			let low = 1;
			let high = effectiveWidth; // safe upper bound
			let best = 1;

			// binary search for max font size that fits within effectiveWidth
			while (low <= high) {
				const mid = Math.floor((low + high) / 2);
				measure.style.fontSize = mid + "px";

				const textWidth = measure.scrollWidth;

				if (textWidth <= effectiveWidth) {
					best = mid;
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

			const finalSize = Math.max(1, best - 1); // tiny breathing room

			// trigger smooth font-size / line-height transition
			setFontSize((prev) => (prev === finalSize ? prev : finalSize));

			// handle the scale animation depending on mode
			if (animation === "center") {
				setScale(0.01); // tiny, but not 0 to avoid issues
				requestAnimationFrame(() => {
					setScale(1);
				});
			} else {
				setScale(1);
			}
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
	}, [text, animation, duration, rightPadding]);

	const transition = `${duration}ms ease-out`;

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
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

			{/* visible text, animated */}
			<span
				style={{
					whiteSpace: "nowrap",
					display: "inline-block",
					overflow: "hidden",
					fontSize: `${fontSize}px`,
					lineHeight: `${fontSize}px`,
					// no paddingRight here anymore – spacing is stable
					transform: animation === "center" ? `scale(${scale})` : "scale(1)",
					transformOrigin: animation === "center" ? "center center" : "left bottom",
					transition: `
            font-size ${transition},
            line-height ${transition},
            transform ${transition}
          `,
				}}
				className={className}
			>
				{text}
			</span>
		</div>
	);
}

export default ResponsiveText;
