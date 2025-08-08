import type { SVGProps } from "react";

const EthereumLogo = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1920" {...props}>
		<path d="M959.8 730.9 420 976.3l539.8 319.1 539.9-319.1z" opacity={0.6} />
		<path d="M420.2 976.3 960 1295.4V80.6z" opacity={0.45} />
		<path d="M960 80.6v1214.8l539.8-319.1z" opacity={0.8} />
		<path d="m420 1078.7 539.8 760.7v-441.8z" opacity={0.45} />
		<path d="M959.8 1397.6v441.8l540.2-760.7z" opacity={0.8} />
	</svg>
);

export { EthereumLogo };
