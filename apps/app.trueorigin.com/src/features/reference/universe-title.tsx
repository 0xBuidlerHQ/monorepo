import { ContentSurface } from "@/features/shell/content-surface";
import Link from "next/link";
import type { ReactNode } from "react";

export function UniverseTitle({ name, titleId, children }: { name: string; titleId: string; children?: ReactNode }) {
	return (
		<ContentSurface as="nav" aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] sm:gap-x-5">
			<Link href="/explore" className="text-white/50 transition-colors hover:text-white">Explore</Link>
			<span aria-hidden="true" className="text-white/30">/</span>
			<h1 id={titleId} aria-current="page" className="text-white">{name}</h1>
			{children}
		</ContentSurface>
	);
}
