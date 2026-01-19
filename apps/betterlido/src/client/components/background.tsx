"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import type { PropsWithChildren } from "react";

const Background = ({ children }: PropsWithChildren) => {
	return (
		<Box className="relative min-h-[100dvh] overflow-hidden">
			{/* soft glows */}
			<Box className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/8 blur-3xl" />
			<Box className="pointer-events-none absolute right-[-120px] top-10 h-[360px] w-[360px] rounded-full bg-white/6 blur-3xl" />
			<Box className="pointer-events-none absolute bottom-[-160px] left-1/3 h-[360px] w-[360px] rounded-full bg-white/7 blur-3xl" />

			{/* subtle grid */}
			<Box className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,#ffffff0d,transparent_0)] [background-size:48px_48px]" />

			{/* dotted field */}
			<Box className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#ffffff18_1px,transparent_1px),radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px,32px_32px] [background-position:0_0,16px_16px]" />

			{/* vignette */}
			<Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(5,5,5,0.35)_80%,transparent_100%)]" />

			<Box className="relative">{children}</Box>
		</Box>
	);
};

export { Background };
