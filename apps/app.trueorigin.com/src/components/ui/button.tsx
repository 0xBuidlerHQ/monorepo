"use client";

import type { ComponentProps } from "react";
import { cn } from "@/config/utils";

export function Button({
	variant = "outline",
	type = "button",
	className,
	...props
}: ComponentProps<"button"> & { variant?: "primary" | "outline" }) {
	return (
		<button
			type={type}
			className={cn(
				"cursor-pointer border px-4 py-3 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50",
				variant === "primary"
					? "border-brand-accent bg-brand-accent text-black hover:brightness-110"
					: "border-white/20 hover:border-brand-accent",
				className,
			)}
			{...props}
		/>
	);
}
