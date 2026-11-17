export function PrintingCardsSkeleton({ count }: { count: number }) {
	return (
		<section
			aria-label="Loading card printings"
			aria-busy="true"
			className="mt-7 min-w-0 border-t border-white/[0.08] pt-6"
		>
			<div className="mb-4 flex items-center gap-2">
				<h2 className="text-xs text-white/65">Printings</h2>
				<span className="font-mono text-[10px] text-white/25">{count}</span>
			</div>
			<div aria-hidden="true" className="-mx-1 overflow-hidden px-1 pb-2 pt-1">
				<div className="grid auto-cols-[minmax(184px,1fr)] grid-flow-col gap-2">
					{Array.from({ length: count }, (_, index) => `printing-${index}`).map(
						(key) => (
							<div
								key={key}
								className="rounded-xl border border-white/[0.06] bg-[#1b1b1b] p-1.5"
							>
								<div className="aspect-[600/825] rounded-lg bg-white/[0.025]" />
								<div className="mt-1.5 flex min-h-9 items-center gap-2 px-1">
									<div className="h-3 w-1/2 rounded bg-white/5" />
									<div className="ml-auto h-2.5 w-8 rounded bg-white/5" />
								</div>
							</div>
						),
					)}
				</div>
			</div>
		</section>
	);
}
