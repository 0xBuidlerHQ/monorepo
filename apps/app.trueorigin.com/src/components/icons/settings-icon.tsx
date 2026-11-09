import type { SVGProps } from "react";

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="m9.5 3-.6 2.4-1.5.9L5 5.6 2.5 9.9l1.8 1.7v1.8l-1.8 1.7L5 19.4l2.4-.7 1.5.9.6 2.4h5l.6-2.4 1.5-.9 2.4.7 2.5-4.3-1.8-1.7v-1.8l1.8-1.7L19 5.6l-2.4.7-1.5-.9L14.5 3z" />
			<circle cx="12" cy="12.5" r="3" />
		</svg>
	);
}
