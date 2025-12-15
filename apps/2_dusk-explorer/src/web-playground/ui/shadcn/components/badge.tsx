"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
	children: ReactNode;
	className?: string;
};

const Badge = ({ children, className }: BadgeProps) => {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border border-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
				className,
			)}
		>
			{children}
		</span>
	);
};

export { Badge };
