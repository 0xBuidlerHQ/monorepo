import type { SVGProps } from "react";

export function CollectionIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" {...props}>
			<rect x="5" y="10" width="22" height="18" rx="2.5" fill="#713c21" stroke="#ffad70" strokeWidth="1.2" />
			<rect x="3" y="5" width="26" height="7" rx="2" fill="#ff5f00" stroke="#ffad70" strokeWidth="1.2" />
			<rect x="11" y="17" width="10" height="5" rx="1" fill="#fff0d8" />
		</svg>
	);
}
