import type { SVGProps } from "react";

export function TrueOriginsMark(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
			<path d="M8 4h20v4h-8v15h-4V8H8V4Z" fill="currentColor" />
			<path d="M9.5 12a12 12 0 1 0 17 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
		</svg>
	);
}
