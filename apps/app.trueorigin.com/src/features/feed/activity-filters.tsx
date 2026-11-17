"use client";

import type { ActivityKind } from "@0xhq/api-client/types";
const filters: { kind: ActivityKind; label: string }[] = [
	{ kind: "all", label: "All activity" },
	{ kind: "sale", label: "Sales" },
	{ kind: "listing", label: "Listings" },
	{ kind: "transfer", label: "Transfers" },
	{ kind: "issued", label: "Issuance" },
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
					className={`rounded-full px-4 py-2.5 text-xs transition-colors ${onChange ? "cursor-pointer" : "cursor-default"} ${value === filter.kind ? "bg-white text-black" : "text-white/40 enabled:hover:bg-white/5 enabled:hover:text-white"}`}
				>
					{filter.label}
				</button>
			))}
		</fieldset>
	);
}
