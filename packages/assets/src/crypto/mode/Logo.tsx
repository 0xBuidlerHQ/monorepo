import type { SVGProps } from "react";

const ModeLogo = (props: SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<title>Mode Logo</title>

		<circle cx={128} cy={128} r={128} fill="#DFFE00" />
		<path
			d="M203.881 195.4h-29.649v-67.29l11.872-38.375-8.412-2.993L139.215 195.4h-22.549L78.188 86.742l-8.41 2.993 11.87 38.375v67.29H52v-135h44.144l27.382 77.288v22.69h8.948v-22.69L159.856 60.4H204v135z"
			fill="#000"
		/>
	</svg>
);

export { ModeLogo };
