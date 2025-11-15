"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { motion } from "motion/react";

function GradientBackground({
	className,
	transition = { duration: 10, ease: "easeInOut", repeat: Infinity },
	...props
}: any) {
	return (
		<motion.div
			data-slot="gradient-background"
			className={cn(
				"size-full bg-gradient-to-br from-muted/10 to-background bg-[length:400%_400%]",
				className,
			)}
			animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
			transition={transition}
			{...props}
		/>
	);
}

export { GradientBackground };
