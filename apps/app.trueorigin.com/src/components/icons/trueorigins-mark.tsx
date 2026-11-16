import type { SVGProps } from "react";

export function TrueOriginsMark(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" {...props}>
			<path d="m24 3 5 16 16 5-16 5-5 16-5-16-16-5 16-5Z" fill="currentColor" />
		</svg>
	);
}
