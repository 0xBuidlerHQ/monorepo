"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import type { ComponentProps } from "react";

type ComboboxProps = {
	items: string[];
	value?: string;
	onChange?: (value: string) => void;
	searching?: string;
	className?: string;
} & ComponentProps<typeof Box>;

const Combobox = ({
	items,
	value,
	onChange,
	className,
}: ComboboxProps) => {
	return (
		<Box className={cn("relative", className)}>
			<select
				className="min-w-[140px] rounded-xl border border-muted bg-card px-3 py-2 text-sm outline-none transition hover:border-foreground/40 focus:border-accent"
				value={value}
				onChange={(event) => onChange?.(event.target.value)}
			>
				{items.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</select>
		</Box>
	);
};

export { Combobox };
