import type { SVGProps } from "react";

export function TransfersIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<path d="M8 11h16m-4-4 4 4-4 4" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M24 21H8m4-4-4 4 4 4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
