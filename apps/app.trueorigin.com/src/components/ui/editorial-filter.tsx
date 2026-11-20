"use client";

import { useId, type ReactNode } from "react";

type FilterOption = { value: string; label: string; icon?: ReactNode };
export type EditorialFilterProps = {
	label: string;
	options: readonly FilterOption[];
	value: string;
	onChange: (value: string) => void;
	variant?: "editorial" | "visual";
};

export function EditorialFilter({
	label,
	options,
	value,
	onChange,
	variant = "editorial",
}: EditorialFilterProps) {
	const labelId = useId();
	const visual = variant === "visual";
	return (
		<div
			className={
				visual
					? "min-w-0"
					: "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6"
			}
		>
			<p
				id={labelId}
				className={
					visual
						? "mb-2 text-[11px] text-white/40"
						: "shrink-0 text-[11px] text-white/40 sm:w-20"
				}
			>
				{label}
			</p>
			<div
				className={visual ? "min-w-0" : "min-w-0 overflow-x-auto pb-1 sm:pb-0"}
			>
				<div
					role="group"
					aria-labelledby={labelId}
					className={
						visual
							? "flex flex-wrap items-center gap-2"
							: "flex w-max items-center gap-5"
					}
				>
					{options.map((option, index) => {
						const active = value === option.value;
						return (
							<button
								key={option.value}
								type="button"
								aria-pressed={active}
								title={option.label}
								aria-label={option.label}
								onClick={() => onChange(option.value)}
								className={
									visual
										? `inline-flex h-11 min-w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? "border-white bg-white/15 text-white" : "border-white/10 bg-[#171717] text-white/50 hover:border-white/25 hover:text-white"}`
										: `flex shrink-0 cursor-pointer items-baseline gap-2 py-2 text-sm transition-colors duration-200 ${active ? "text-white" : "text-white/30 hover:text-white/75"}`
								}
							>
								{visual ? (
									option.icon && (
										<span className="grid size-7 place-items-center [&>img]:max-h-7 [&>img]:max-w-7">
											{option.icon}
										</span>
									)
								) : (
									<span
										aria-hidden="true"
										className="font-mono text-[9px] opacity-40"
									>
										{String(index).padStart(2, "0")}
									</span>
								)}
								<span className={visual && option.icon ? "sr-only" : undefined}>
									{option.label}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
