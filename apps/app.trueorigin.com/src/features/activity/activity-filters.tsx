"use client";

import type { ActivityKind } from "@0xhq/api-client/types";
const dotColors: Record<ActivityKind, string> = { all: "bg-current", issued: "bg-emerald-400", transfer: "bg-zinc-400", sale: "bg-rose-400", listing: "bg-indigo-400" };

const filters: { kind: ActivityKind; label: string }[] = [
	{ kind: "all", label: "All" },
	{ kind: "issued", label: "Created" },
	{ kind: "transfer", label: "Transfers" },
];
export function ActivityFilters({
	value = "all",
	onChange,
}: {
	value?: ActivityKind;
	onChange?: (kind: ActivityKind) => void;
}) {
	return (
		<fieldset
			disabled={!onChange}
			className="flex flex-wrap gap-1"
			aria-label="Activity filters"
		>
			{filters.map((filter) => (
				<button
					key={filter.kind}
					type="button"
					aria-pressed={value === filter.kind}
					onClick={() => onChange?.(filter.kind)}
					className={`relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-white ${onChange ? "cursor-pointer" : "cursor-default"} ${value === filter.kind ? "bg-white text-black" : "text-white/55 enabled:hover:text-white"}`}
				>
					<span
						aria-hidden="true"
						className={`size-2 shrink-0 rounded-full ${filter.kind === "all" && value === "all" ? "bg-black" : dotColors[filter.kind]}`}
					/>
					{filter.label}
				</button>
			))}
		</fieldset>
	);
}
