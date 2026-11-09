"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function NavigationScroll() {
	const pathname = usePathname();
	const previousPath = useRef(pathname);

	useEffect(() => {
		// Let the browser and Next restore scroll when navigating back or forward.
		function restoreHistory() {
			previousPath.current = window.location.pathname;
		}
		window.addEventListener("popstate", restoreHistory);
		return () => window.removeEventListener("popstate", restoreHistory);
	}, []);

	useEffect(() => {
		if (previousPath.current === pathname) return;
		previousPath.current = pathname;
		// Explicit section links retain their destination; query-only filters stay put.
		if (window.location.hash) return;
		const frame = requestAnimationFrame(() => {
			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? "instant" : "smooth" });
		});
		return () => cancelAnimationFrame(frame);
	}, [pathname]);

	return null;
}
