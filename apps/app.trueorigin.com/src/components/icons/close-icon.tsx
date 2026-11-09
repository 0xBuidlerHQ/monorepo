import type { SVGProps } from "react";

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...props}
		>
			<path d="m6 6 12 12M18 6 6 18" />
		</svg>
	);
}
