"use client";

import { animate, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { Suspense, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
 const contentRef = useRef<HTMLDivElement>(null);
 return <div ref={contentRef} data-page-transition><Suspense fallback={null}><PageFade contentRef={contentRef} /></Suspense>{children}</div>;
}

function PageFade({ contentRef }: { contentRef: RefObject<HTMLDivElement | null> }) {
 const pathname = usePathname();
 const reducedMotion = useReducedMotion();
 const previousPath = useRef(pathname);
 useLayoutEffect(() => {
  if (previousPath.current === pathname) return;
  previousPath.current = pathname;
  const content = contentRef.current;
  if (!content || reducedMotion) return;
  // Fade only the live page content. Browser snapshots disable hit-testing on
  // captured navigation, even though the dock is outside the page boundary.
  const playback = animate(content, { opacity: [0, 1] }, { duration: 0.28, ease: [0.22, 1, 0.36, 1] });
  return () => { playback.stop(); content.style.opacity = ""; };
 }, [pathname, reducedMotion, contentRef]);
 return null;
}
