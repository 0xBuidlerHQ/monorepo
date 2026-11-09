import type { SVGProps } from "react";

export function VerifyIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<path d="m16 3 11 4v9c0 6-6 11-11 14C11 27 5 22 5 16V7Z" fill="#153a32" stroke="#6ee7b7" strokeWidth="1.3" strokeLinejoin="round" />
			<path d="m16 7 7 2.5V16c0 4-4 8-7 10-3-2-7-6-7-10V9.5Z" fill="#34d399" />
			<path d="m12 16 3 3 5-6" stroke="#052e23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
