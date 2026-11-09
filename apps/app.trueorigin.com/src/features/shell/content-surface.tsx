import type { ReactNode } from "react";

export function ContentSurface({ as: Element = "div", children, className, id, "aria-labelledby": labelledBy, "aria-label": label }: {
	as?: "div" | "header" | "section" | "nav";
	children: ReactNode;
	className?: string;
	id?: string;
	"aria-labelledby"?: string;
	"aria-label"?: string;
}) {
	return <Element id={id} className={className} aria-labelledby={labelledBy} aria-label={label}>{children}</Element>;
}
