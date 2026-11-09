import type { SVGProps } from "react";

export function OnePieceIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<path d="m5 16 22 13M5 29l22-13" stroke="#fafaf9" strokeWidth="3" strokeLinecap="round" />
			<path d="M8 17a8 8 0 0 1 16 0v3l-4 3v4h-8v-4l-4-3Z" fill="#fafaf9" stroke="#171717" strokeWidth="1.2" strokeLinejoin="round" />
			<circle cx="12" cy="18" r="2.5" fill="#171717" />
			<circle cx="20" cy="18" r="2.5" fill="#171717" />
			<path d="m16 21-1.5 2h3ZM14 25v2m4-2v2" stroke="#171717" strokeWidth="1.2" strokeLinejoin="round" />
			<path d="M7 12V9a9 9 0 0 1 18 0v3" fill="#facc15" />
			<path d="M7 9h18v4H7Z" fill="#ef4444" />
			<ellipse cx="16" cy="13" rx="14" ry="3" fill="#facc15" stroke="#a16207" strokeWidth="1" />
		</svg>
	);
}
