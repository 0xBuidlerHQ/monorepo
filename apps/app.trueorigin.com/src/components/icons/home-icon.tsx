import type { SVGProps } from "react";

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<rect x="4" y="4" width="10" height="14" rx="2.5" fill="#ffffff" stroke="#ffffff" strokeWidth="1.2" />
			<rect x="18" y="4" width="10" height="8" rx="2.5" fill="#333333" stroke="#ffffff" strokeWidth="1.2" />
			<rect x="4" y="22" width="10" height="6" rx="2.5" fill="#333333" stroke="#ffffff" strokeWidth="1.2" />
			<rect x="18" y="16" width="10" height="12" rx="2.5" fill="#777777" stroke="#ffffff" strokeWidth="1.2" />
		</svg>
	);
}
