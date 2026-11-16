export function FeedSkeleton() {
	return (
		<div
			role="status"
			aria-label="Loading asset activity"
			className="divide-y divide-white/[0.06] border-y border-white/[0.06]"
		>
			{[0, 1, 2, 3, 4].map((index) => (
				<div key={index} className="flex items-center gap-4 py-5">
					<div className="h-[72px] w-14 shrink-0 rounded-xl bg-white/[0.04]" />
					<div className="flex-1 space-y-3">
						<div className="h-3 w-24 rounded bg-white/[0.04]" />
						<div className="h-4 w-40 max-w-full rounded bg-white/[0.04]" />
						<div className="h-2 w-28 rounded bg-white/[0.025]" />
					</div>
					<div className="hidden h-3 w-20 rounded bg-white/[0.03] sm:block" />
				</div>
			))}
		</div>
	);
}
