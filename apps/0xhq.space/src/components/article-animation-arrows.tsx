"use client";

import { type RefObject, useEffect, useId, useState } from "react";

type Connector = { id: string; path: string; opacity: number };

export function ArticleAnimationArrows({
	container,
}: {
	container: RefObject<HTMLDivElement | null>;
}) {
	const markerId = useId();
	const [connectors, setConnectors] = useState<Connector[]>([]);

	useEffect(() => {
		const article = container.current;
		if (!article) return;
		const figures = Array.from(
			article.querySelectorAll<HTMLElement>("[data-section-animation]"),
		);
		if (!figures.length) return;
		let frame = 0;
		function measure() {
			if (!article) return;
			if (window.innerWidth < 1280) {
				setConnectors([]);
				return;
			}
			const origin = article.getBoundingClientRect();
			const sectionBounds = figures.map((figure) =>
				figure.getBoundingClientRect(),
			);
			for (const [index, figure] of figures.entries()) {
				const end = sectionBounds[index + 1]?.top ?? origin.bottom;
				const availableHeight = Math.max(
					0,
					end - sectionBounds[index].top - 24,
				);
				const height = `${availableHeight}px`;
				const illustration = figure.querySelector("figure");
				const caption = illustration?.querySelector("figcaption");
				if (illustration) {
					// Keep captions readable; fit only the 5:4 drawing into the remaining
					// section height instead of inserting space into the article text.
					const gap = caption
						? Number.parseFloat(getComputedStyle(illustration).rowGap) || 0
						: 0;
					const drawingWidth = `${Math.max(0, availableHeight - (caption?.getBoundingClientRect().height ?? 0) - gap) * 1.25}px`;
					if (
						figure.style.getPropertyValue("--animation-drawing-width") !==
						drawingWidth
					)
						figure.style.setProperty("--animation-drawing-width", drawingWidth);
				}
				if (
					figure.style.getPropertyValue("--animation-section-height") !== height
				)
					figure.style.setProperty("--animation-section-height", height);
			}
			const bounds = figures.map((figure) =>
				(figure.querySelector("figure") ?? figure).getBoundingClientRect(),
			);
			setConnectors(
				bounds.slice(0, -1).flatMap((from, index): Connector[] => {
					const to = bounds[index + 1];
					const x = from.x + from.width / 2 - origin.x;
					const nextX = to.x + to.width / 2 - origin.x;
					const start = from.bottom - origin.y + 16;
					const end = to.top - origin.y - 16;
					const middle = (start + end) / 2;
					const space = end - start;
					// Fade out as the sticky figures approach; never route sideways
					// through an illustration or reverse the arrow to fill a gap.
					if (space <= 32) return [];
					return [
						{
							id: figures[index].dataset.sectionAnimation ?? String(index),
							path: `M ${x} ${start} C ${x} ${middle}, ${nextX} ${middle}, ${nextX} ${end}`,
							opacity: Math.min(1, (space - 32) / 48),
						},
					];
				}),
			);
		}
		function scheduleMeasure() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		}
		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(article);
		for (const figure of figures) {
			const drawing = figure.querySelector("figure");
			if (drawing) observer.observe(drawing);
		}
		window.addEventListener("resize", scheduleMeasure);
		window.addEventListener("scroll", scheduleMeasure, { passive: true });
		scheduleMeasure();
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", scheduleMeasure);
			window.removeEventListener("scroll", scheduleMeasure);
			cancelAnimationFrame(frame);
		};
	}, [container]);

	if (!connectors.length) return null;

	return (
		<svg
			aria-hidden="true"
			data-animation-arrows
			className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-foreground/25 min-[1280px]:block"
		>
			<defs>
				<marker
					id={markerId}
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="8"
					markerHeight="8"
					orient="auto"
				>
					<path d="M 1 1 L 7 4 L 1 7" fill="none" stroke="currentColor" />
				</marker>
			</defs>
			{connectors.map(({ id, path, opacity }) => (
				<path
					key={id}
					data-connector-from={id}
					opacity={opacity}
					d={path}
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					markerEnd={`url(#${markerId})`}
				/>
			))}
		</svg>
	);
}
