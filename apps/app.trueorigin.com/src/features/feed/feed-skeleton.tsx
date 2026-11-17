import { ActivityFilters } from "./activity-filters";
export function FeedSkeleton({ toolbar = false }: { toolbar?: boolean }) {
	return (
		<div role="status" aria-busy="true" aria-label="Loading asset activity">
			{toolbar && (
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<ActivityFilters />
				</div>
			)}
			<div aria-hidden="true" className="border-t border-white/[0.07]">
				{[0, 1, 2, 3, 4].map((index) => (
					<div
						key={index}
						className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-white/[0.07] py-5 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-6"
					>
						<div className="h-[72px] w-14 rounded-xl bg-white/[0.04]" />
						<div className="space-y-3">
							<div className="h-3 w-24 rounded bg-white/[0.04]" />
							<div className="h-4 w-40 max-w-full rounded bg-white/[0.04]" />
							<div className="h-2 w-28 rounded bg-white/[0.025]" />
						</div>
						<div className="col-start-2 h-3 w-20 rounded bg-white/[0.03] sm:col-start-auto" />
					</div>
				))}
			</div>
		</div>
	);
}
