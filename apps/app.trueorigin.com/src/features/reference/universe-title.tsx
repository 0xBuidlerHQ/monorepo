import { FloatingTypeSymbols } from "@/features/pokemon/floating-type-symbols";
import type { ReactNode } from "react";
import { PageHeader } from "@/features/shell/page-header";

export function UniverseTitle({
	name,
	titleId,
	children,
}: {
	name: string;
	titleId: string;
	children?: ReactNode;
}) {
	return <div className="relative isolate"><PageHeader title={name} titleId={titleId} adornment={titleId === "pokemon-title" ? <FloatingTypeSymbols /> : undefined} actions={children} /></div>;
}
