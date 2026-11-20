import type { ActivityKind } from "@0xhq/api-client/types";

const tones: Record<ActivityKind, string> = {
	all: "bg-white/[0.02] text-white/80",
	issued: "bg-emerald-400/[0.03] text-emerald-300",
	transfer: "bg-zinc-400/[0.03] text-zinc-400",
	sale: "bg-rose-400/[0.03] text-rose-300",
	listing: "bg-indigo-400/[0.03] text-indigo-300",
};
const labels = {
	issued: "Registered",
	transfer: "Transfer",
	sale: "Sale",
	listing: "Listing",
};
export function activityBadgeClass(kind: ActivityKind) {
	return `inline-grid h-[26px] shrink-0 grid-cols-[14px_1fr] items-center gap-1.5 justify-self-start whitespace-nowrap rounded-md bg-linear-to-b from-white/[0.008] to-transparent px-2 text-[11px] font-medium leading-none tracking-[-0.01em] ${tones[kind]}`;
}
export function ActivityBadge({
	kind,
}: {
	kind: Exclude<ActivityKind, "all">;
}) {
	return (
		<span
			className={activityBadgeClass(kind)}
			title={
				kind === "issued"
					? "Object registered and digital passport issued"
					: kind === "transfer"
						? "Passport ownership transferred"
						: labels[kind]
			}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="size-3.5 shrink-0"
			>
				{kind === "issued" ? (
					<>
						<rect
							x="5"
							y="3"
							width="15"
							height="18"
							rx="2"
							fill="currentColor"
							fillOpacity="0.08"
						/>
						<path d="M3 7h4M3 12h4M3 17h4M11 8h5m-5 4h5m-5 4h3" />
					</>
				) : kind === "transfer" ? (
					<path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4" />
				) : (
					<>
						<path
							d="M3 4h8l10 10-7 7L3 10Z"
							fill="currentColor"
							fillOpacity="0.08"
						/>
						<circle cx="7.5" cy="8" r="1" />
					</>
				)}
			</svg>
			<span>{labels[kind]}</span>
		</span>
	);
}
