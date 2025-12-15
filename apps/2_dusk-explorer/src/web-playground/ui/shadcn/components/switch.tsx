"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import type { ComponentProps } from "react";

type SwitchProps = {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	id?: string;
} & ComponentProps<"button">;

const Switch = ({ checked = false, onCheckedChange, className, ...props }: SwitchProps) => {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			className={cn(
				"relative h-6 w-11 rounded-full border border-muted bg-card transition",
				checked ? "bg-accent" : "bg-muted",
				className,
			)}
			onClick={() => onCheckedChange?.(!checked)}
			{...props}
		>
			<span
				className={cn(
					"absolute left-1 top-1 h-4 w-4 rounded-full bg-background transition",
					checked && "translate-x-5",
				)}
			/>
		</button>
	);
};

export { Switch };
