import { ActivityFilters } from "./activity-filters";
export function ActivitySkeleton({ toolbar = false }: { toolbar?: boolean }) {
	return (
		<div role="status" aria-busy="true" aria-label="Loading asset activity">
			{toolbar && (
				<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
					<ActivityFilters />
				</div>
			)}
			<div
				aria-hidden="true"
				className="overflow-x-auto border-t border-white/[0.07]"
			>
				{[0, 1, 2, 3, 4].map((index) => (
					<div
						key={index}
						className="grid min-w-[1260px] grid-cols-[6rem_8.5rem_5rem_6.5rem_3rem_6.5rem_6.5rem_6.5rem_6.5rem_5rem_2rem] items-center justify-between gap-x-4 border-b border-white/[0.05] px-4 py-2"
					>
						<div className="h-6 w-16 rounded-md bg-white/[0.04]" />
						<div className="flex min-w-0 items-center gap-2">
							<div className="size-7 shrink-0 rounded bg-white/[0.04]" />
							<div className="h-3 w-32 max-w-full rounded bg-white/[0.04]" />
						</div>
						<div className="h-3 w-16 rounded bg-white/[0.03]" />
						<div className="h-3 w-24 rounded bg-white/[0.03]" />
						<div className="h-5 w-8 rounded bg-white/[0.03]" />
						<div className="h-3 w-24 rounded bg-white/[0.03]" />
						<div className="h-3 w-20 rounded bg-white/[0.03]" />
						<div className="h-3 w-20 rounded bg-white/[0.03]" />
						<div className="h-3 w-24 rounded bg-white/[0.03]" />
						<div className="h-3 w-28 rounded bg-white/[0.03]" />
						<div className="size-7 rounded-md bg-white/[0.03]" />
					</div>
				))}
			</div>
		</div>
	);
}
