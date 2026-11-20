import type { SVGProps } from "react";
import { TrueOriginsMark } from "./trueorigins-mark";

export function PassportMark(props: SVGProps<SVGSVGElement>) {
	return (
		<svg aria-hidden="true" viewBox="0 0 112 120" fill="none" {...props}>
			<g transform="rotate(-9 56 60)">
				<rect
					x="24"
					y="14"
					width="70"
					height="96"
					rx="10"
					fill="currentColor"
					fillOpacity="0.08"
				/>
				<path
					d="M29 101h57v5H29a7 7 0 0 1-7-7V25h7"
					fill="#151515"
					stroke="currentColor"
					strokeOpacity="0.35"
				/>
				<path
					d="M30 103h52m-49 3h47"
					stroke="currentColor"
					strokeOpacity="0.25"
				/>
				<path
					d="M28 9h53a8 8 0 0 1 8 8v81H28a10 10 0 0 0-10 8V19A10 10 0 0 1 28 9Z"
					fill="currentColor"
				/>
				<path d="M28 10v87" stroke="#151515" strokeOpacity="0.2" />
				<path
					d="M22 20v69"
					stroke="white"
					strokeOpacity="0.25"
					strokeLinecap="round"
				/>
				<rect
					x="36"
					y="20"
					width="45"
					height="66"
					rx="4"
					stroke="#151515"
					strokeOpacity="0.12"
				/>
				<circle
					cx="58.5"
					cy="47"
					r="18"
					stroke="#151515"
					strokeOpacity="0.22"
					strokeWidth="0.8"
				/>
				<TrueOriginsMark
					x="42.5"
					y="31"
					width="32"
					height="32"
					className="text-[#151515]"
				/>
				<path
					d="M47 74h23m-18 5h13"
					stroke="#151515"
					strokeOpacity="0.5"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<path d="M28 98h61" stroke="#151515" strokeOpacity="0.15" />
			</g>
		</svg>
	);
}
