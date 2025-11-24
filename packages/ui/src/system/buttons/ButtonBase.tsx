"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import type { MouseEventHandler } from "react";

interface ButtonBaseProps extends React.HTMLAttributes<HTMLButtonElement> {
	href?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	external?: boolean;
	disabled?: boolean;
}

const ButtonBase = (props: ButtonBaseProps) => {
	const { children, onClick, href, className, external, disabled } = props;

	if (disabled) return <div className={cn("group relative", className)}>{children}</div>;

	if (onClick)
		return (
			<button
				type="button"
				className={cn("group relative hover:cursor-pointer", className)}
				onClick={onClick}
			>
				{children}
			</button>
		);

	return (
		<a
			//
			target={external ? "_blank" : undefined}
			href={href ?? "https://google.com"}
		>
			<Box className={cn("group relative hover:cursor-pointer", className)}>{children}</Box>
		</a>
	);
};

export { ButtonBase };
