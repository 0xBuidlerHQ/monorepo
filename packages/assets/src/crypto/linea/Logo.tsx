import type { SVGProps } from "react";

const LineaLogo = (props: SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 200 208" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<title>Linea Logo</title>

		<g clipPath="url(#a)" fill="#fff">
			<path d="M132.369 155.99H49.7V68.885h18.915v70.224h63.754zm0-70.232c9.318 0 16.872-7.554 16.872-16.872 0-9.319-7.554-16.872-16.872-16.872-9.319 0-16.872 7.553-16.872 16.872s7.553 16.872 16.872 16.872" />
		</g>

		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M49.7 52.014h99.541v103.977H49.7z" />
			</clipPath>
		</defs>
	</svg>
);

export { LineaLogo };
