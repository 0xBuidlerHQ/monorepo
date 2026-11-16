"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

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

	useLayoutEffect(() => {
		if (previousPath.current === pathname) return;
		previousPath.current = pathname;
		// Explicit section links retain their destination; query-only filters stay put.
		if (window.location.hash) return;
		// Reset before the destination is painted/captured; smooth scrolling here races
		// the route crossfade and reveals the new page at the old page's scroll offset.
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [pathname]);

	return null;
}
