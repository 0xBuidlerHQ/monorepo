import type { ReactNode } from "react";

export function PageContainer({
	as: Tag = "div",
	children,
	className = "",
	ariaLabel,
}: {
	as?: "div" | "main" | "nav";
	children: ReactNode;
	className?: string;
	ariaLabel?: string;
}) {
	return (
		<Tag
			aria-label={ariaLabel}
			className={`mx-auto w-full min-w-0 max-w-4xl border-x border-foreground/10 px-6 ${className}`}
		>
			{children}
		</Tag>
	);
}
