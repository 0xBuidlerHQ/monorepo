import { Box } from "@0xbuidlerhq/ui/system/base/box";
import type { PropsWithChildren } from "react";

type HoverShinyEffectProps = PropsWithChildren & {};
const HoverShinyEffect = (props: HoverShinyEffectProps) => {
	const { children } = props;

	return (
		<Box className="relative overflow-hidden group">
			{children}

			<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/30 to-transparent -translate-x-full group-hover:translate-x-1/2 transition-transform duration-1000" />
		</Box>
	);
};

export { HoverShinyEffect };
