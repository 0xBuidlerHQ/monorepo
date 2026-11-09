import type { SVGProps } from "react";

export function YugiohIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<path d="M3 7h26L16 29Z" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M7 7V3h18v4M8 11h16M11 21l5-4 5 4M16 22v5" stroke="#854d0e" strokeWidth="1.5" strokeLinejoin="round" />
			<path d="M9 15s3-4 7-4 7 4 7 4-3 4-7 4-7-4-7-4Z" fill="#fef08a" stroke="#422006" strokeWidth="1.2" />
			<circle cx="16" cy="15" r="2.5" fill="#422006" />
		</svg>
	);
}
