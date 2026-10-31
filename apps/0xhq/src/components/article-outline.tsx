"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { messages } from "@/lib/messages";
import { ArticleAnimationArrows } from "./article-animation-arrows";
import { useLocale } from "./locale-provider";

type Section = { id: string; label: string; level: number };

export function ArticleOutline({
	children,
	side = "right",
	mobileNavigation = false,
	arrows = true,
}: {
	children: ReactNode;
	side?: "left" | "right";
	mobileNavigation?: boolean;
	arrows?: boolean;
}) {
	const t = messages[useLocale()];
	const container = useRef<HTMLDivElement>(null);
	const navigation = useRef<HTMLElement>(null);
	const list = useRef<HTMLUListElement>(null);
	const indicator = useRef<HTMLSpanElement>(null);
	const [sections, setSections] = useState<Section[]>([]);
	const [active, setActive] = useState("");

	useEffect(() => {
		const headings = Array.from(
			container.current?.querySelectorAll<HTMLElement>("[data-toc-heading]") ??
				[],
		);
		setSections(
			headings.map((heading) => ({
				id: heading.id,
				label: heading.textContent ?? "",
				level: Number(heading.tagName.slice(1)),
			})),
		);
	}, []);

	useEffect(() => {
		if (!sections.length) return;
		const headings = sections.map((section) =>
			container.current?.querySelector<HTMLElement>(`[id="${section.id}"]`),
		);
		const links = Array.from(
			list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
		);
		let frame = 0;
		let previous = "";
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

		function updatePosition() {
			const nav = navigation.current;
			const rail = list.current;
			const marker = indicator.current;
			const readingLine = 120;
			let index = 0;
			for (let i = 0; i < headings.length; i++) {
				if (
					(headings[i]?.getBoundingClientRect().top ?? Infinity) <= readingLine
				)
					index = i;
			}
			const atEnd =
				window.scrollY + window.innerHeight >=
				document.documentElement.scrollHeight - 2;
			if (atEnd) index = headings.length - 1;
			const id = sections[index].id;
			setActive(id);
			if (!nav || !rail || !marker || !links.length) return;
			const headingTop =
				headings[index]?.getBoundingClientRect().top ?? readingLine;
			const nextTop =
				headings[index + 1]?.getBoundingClientRect().top ??
				container.current?.getBoundingClientRect().bottom ??
				readingLine;
			const progress = atEnd
				? 1
				: Math.max(
						0,
						Math.min(
							1,
							(readingLine - headingTop) / Math.max(1, nextTop - headingTop),
						),
					);
			const link = links[index];
			const nextLink = links[index + 1];
			const railTop = rail.getBoundingClientRect().top;
			const start = link.getBoundingClientRect().top - railTop;
			const finish = nextLink
				? nextLink.getBoundingClientRect().top - railTop
				: start + link.offsetHeight - 16;
			marker.style.transform = `translateY(${start + (finish - start) * progress}px)`;
			marker.style.opacity = "1";
			if (previous !== id) {
				previous = id;
				const bounds = nav.getBoundingClientRect();
				const item = link.getBoundingClientRect();
				if (item.top < bounds.top + 32 || item.bottom > bounds.bottom - 16) {
					nav.scrollTo({
						top:
							nav.scrollTop +
							item.top -
							bounds.top -
							nav.clientHeight / 2 +
							item.height / 2,
						behavior: reducedMotion.matches ? "instant" : "smooth",
					});
				}
			}
		}
		function scheduleUpdate() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updatePosition);
		}
		updatePosition();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		const resizeObserver = new ResizeObserver(scheduleUpdate);
		if (container.current) resizeObserver.observe(container.current);
		if (list.current) resizeObserver.observe(list.current);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			resizeObserver.disconnect();
		};
	}, [sections]);

	return (
		<div ref={container} className="relative w-full min-w-0">
			{mobileNavigation && sections.length > 1 && (
				<details className="mb-8 rounded border border-foreground/10 px-4 py-3 min-[1280px]:hidden">
					<summary className="cursor-pointer text-sm font-medium">
						{t.onThisPage}
					</summary>
					<nav aria-label={t.toc} className="mt-3 max-h-64 overflow-y-auto">
						<ul className="grid gap-2 sm:grid-cols-2">
							{sections.map((section) => (
								<li key={section.id}>
									<a
										href={`#${section.id}`}
										className="block text-sm text-foreground/60 hover:text-foreground"
										onClick={(event) => {
											event.currentTarget
												.closest("details")
												?.removeAttribute("open");
										}}
									>
										{section.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</details>
			)}
			{children}
			{arrows && <ArticleAnimationArrows container={container} />}
			{sections.length > 1 && (
				<aside
					className={`absolute inset-y-0 ${side === "left" ? "right-[calc(100%+2rem)]" : "left-[calc(100%+2.5rem)]"} hidden w-44 min-[1280px]:block`}
				>
					<nav
						ref={navigation}
						aria-label={t.toc}
						className="sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto"
					>
						<p className="mb-2.5 pl-3 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/35">
							{t.onThisPage}
						</p>
						<ul
							ref={list}
							className="relative border-l border-foreground/10 text-[11px] leading-4"
						>
							<li
								aria-hidden="true"
								className="absolute inset-x-0 top-0 list-none"
							>
								<span
									ref={indicator}
									aria-hidden="true"
									className="pointer-events-none absolute -left-px top-0 h-4 w-px bg-red-600 opacity-0 transition-transform duration-150 ease-out motion-reduce:transition-none"
								/>
							</li>
							{sections.map((section) => (
								<li
									key={section.id}
									className={section.level === 3 ? "pl-3" : ""}
								>
									<a
										href={`#${section.id}`}
										aria-current={
											active === section.id ? "location" : undefined
										}
										className={`-ml-px block border-l py-1 pl-3 pr-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${active === section.id ? "border-transparent font-medium text-foreground/90" : "border-transparent text-foreground/45 hover:border-foreground/25"}`}
									>
										{section.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</aside>
			)}
		</div>
	);
}
