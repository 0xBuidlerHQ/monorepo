"use client";

import { useEffect, useState } from "react";

const shorten = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
export function IdentifierCopy({
	value,
	label,
	display,
}: {
	value: string;
	label: string;
	display?: string;
}) {
	const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
	useEffect(() => {
		if (status === "idle") return;
		const timer = setTimeout(() => setStatus("idle"), 1800);
		return () => clearTimeout(timer);
	}, [status]);
	return (
		<button
			type="button"
			title={value}
			aria-label={`Copy ${label}`}
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(value);
					setStatus("copied");
				} catch {
					setStatus("error");
				}
			}}
			className="group/copy relative z-20 flex cursor-pointer items-center gap-2 justify-self-start whitespace-nowrap rounded px-1 py-1 font-mono text-[11px] text-white/45 transition-colors duration-150 hover:bg-white/[0.04] hover:text-white/85 focus-visible:text-white/85 focus-visible:outline-2 focus-visible:outline-white"
		>
			<span role="status">
				{status === "copied"
					? "Copied ✓"
					: status === "error"
						? "Copy failed"
						: (display ?? (value.length > 10 ? shorten(value) : value))}
			</span>
			{status === "idle" && (
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					className="size-3 shrink-0 text-white/45 opacity-0 transition-opacity duration-150 group-hover/copy:opacity-100 group-focus-visible/copy:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-60"
				>
					<rect x="6" y="6" width="7" height="7" rx="1" />
					<path d="M10 6V3H3v7h3" />
				</svg>
			)}
		</button>
	);
}
