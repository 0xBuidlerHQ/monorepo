"use client";

import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";

const Floating = ({ children }: PropsWithChildren) => {
	const config = useMemo(() => {
		const rand = () => Math.random();

		return {
			ampX: 10 + rand() * 10, // px
			ampY: 10 + rand() * 10, // px
			rot: (rand() - 0.5) * 8, // degrees
			scaleAmp: 0.02 + rand() * 0.04,
			duration: 6 + rand() * 4, // seconds
		};
	}, []);

	return (
		<motion.div
			initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
			animate={{
				x: [0, config.ampX, -config.ampX, 0],
				y: [0, -config.ampY, config.ampY, 0],
				rotate: [0, config.rot, -config.rot, 0],
				scale: [1, 1 + config.scaleAmp, 1 - config.scaleAmp, 1],
			}}
			transition={{
				duration: config.duration,
				ease: "easeInOut",
				repeat: Infinity,
				repeatType: "mirror",
			}}
			style={{ willChange: "transform" }}
		>
			{children}
		</motion.div>
	);
};

export { Floating };
