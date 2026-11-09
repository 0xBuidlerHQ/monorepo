import type { SVGProps } from "react";

export function MagicIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<path
				d="m3 8 7 8L9 4l5 10 2-13 2 13 5-10-1 12 7-8-4 17-6 5h-6l-6-5Z"
				fill="#f97316"
			/>
			<path d="m11 22 5-8 5 8-3 6h-4Z" fill="#fcd34d" />
		</svg>
	);
}
