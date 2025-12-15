"use client";

import { animated, useSpring } from "@react-spring/web";
import { Children, useLayoutEffect, useRef, useState } from "react";

const HoverGrid = ({ children, columns = 4 }) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	// Spring for geometry: position + size
	const [rectStyle, rectApi] = useSpring(() => ({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		config: { tension: 200, friction: 30 },
	}));

	// Spring for opacity
	const [opacityStyle, opacityApi] = useSpring(() => ({
		opacity: 0,
		config: { tension: 200, friction: 30 },
	}));

	const childRefs = useRef<HTMLDivElement[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (hoveredIndex === null) {
			// Fade out only, geometry stays in place
			rectApi.stop();
			opacityApi.start({ opacity: 0 });
			return;
		}

		const child = childRefs.current[hoveredIndex];
		if (child) {
			const target = {
				left: child.offsetLeft,
				top: child.offsetTop,
				width: child.offsetWidth,
				height: child.offsetHeight,
			};

			const isVisible = opacityStyle.opacity.get() > 0.01;

			if (!isVisible) {
				// First appearance: snap geometry, fade in
				rectApi.set(target);
				opacityApi.start({ opacity: 1 });
			} else {
				// Already visible: animate geometry smoothly, keep opacity
				rectApi.start(target);
				opacityApi.start({ opacity: 1 });
			}
		}
	}, [hoveredIndex, rectApi, opacityApi, opacityStyle.opacity]);

	return (
		<div
			ref={parentRef}
			className="relative grid gap-6" // parent radius
			style={{
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
			}}
		>
			{/* Hover indicator */}
			<animated.div
				className="absolute scale-105 pointer-events-none -z-100 bg-accent/25 rounded-lg"
				style={{ ...rectStyle, ...opacityStyle }}
			/>

			{/* Children with hover handlers */}
			{Children.map(children, (child, index) => (
				<div
					ref={(el) => {
						if (el) childRefs.current[index] = el;
					}}
					onMouseEnter={() => setHoveredIndex(index)}
					onMouseLeave={() => setHoveredIndex(null)}
					className="relative"
				>
					{child}
				</div>
			))}
		</div>
	);
};

export { HoverGrid };
