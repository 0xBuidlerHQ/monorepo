import type { SVGProps } from "react";

const ZKsyncLogo = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" xmlSpace="preserve" {...props}>
		<title>ZKsync Logo</title>
		<path
			style={{
				fillRule: "evenodd",
				clipRule: "evenodd",
			}}
			d="M0 0h400v400H0z"
		/>
		<path
			d="m316 199-66.7-66.4v48.6l-66.2 48.7h66.2v35.5zm-235 0 66.7 66.4v-48.3l66.2-49.1h-66.2v-35.5z"
			style={{
				fillRule: "evenodd",
				clipRule: "evenodd",
				fill: "#fff",
			}}
		/>
	</svg>
);

export { ZKsyncLogo };
