"use client";

import type { ReactNode } from "react";
import { EditorialFilter, type EditorialFilterProps } from "./editorial-filter";

export function FilterPanel({
	children,
	filters,
	filterLayout = "rows",
	onReset,
	canReset,
	resultCount,
}: {
	children?: ReactNode;
	filters?: EditorialFilterProps[];
	filterLayout?: "rows" | "inline";
	onReset: () => void;
	canReset: boolean;
	resultCount?: number;
}) {
	return (
		<section
			aria-label="Filters"
			className="rounded-2xl bg-white/[0.025] px-5 sm:px-6"
		>
			<div className="flex h-14 items-center justify-between gap-4 border-b border-white/[0.06]">
				<div className="flex items-center gap-2.5">
					<svg
						aria-hidden="true"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.25"
						className="size-4 text-white/40"
					>
						<path d="M3 6h14M3 14h14" />
						<path d="M7 3v6m6 2v6" />
					</svg>
					<h2 className="text-xs font-medium text-white/80">Filters</h2>
					{resultCount !== undefined && (
						<span
							role="status"
							className="ml-1 font-mono text-[10px] tabular-nums text-white/30"
						>
							{resultCount.toLocaleString("en-US")} results
						</span>
					)}
				</div>
				<button
					type="button"
					onClick={onReset}
					disabled={!canReset}
					className="flex cursor-pointer items-center gap-1.5 text-[11px] text-white/40 transition-colors hover:text-white disabled:cursor-default disabled:opacity-30"
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.2"
						className="size-3"
					>
						<path d="M3 6a5 5 0 1 1-.2 3M3 2v4h4" />
					</svg>
					Reset
				</button>
			</div>
			<div className="py-3">
				{filters && (
					<div
						className={
							filterLayout === "inline"
								? "flex flex-wrap items-start gap-x-8 gap-y-5 py-1"
								: "space-y-2"
						}
					>
						{filters.map((filter) => (
							<EditorialFilter key={filter.label} {...filter} />
						))}
					</div>
				)}
				{children}
			</div>
		</section>
	);
}
