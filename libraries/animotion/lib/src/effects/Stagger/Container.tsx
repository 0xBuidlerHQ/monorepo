import { type MotionDivProps, makeAnimated } from "@utils/index";

const staggerContainer: MotionDivProps = {
	layout: true,
	initial: "hidden",
	animate: "show",
	variants: {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.05,
			},
		},
	},
};

const AnimatedStaggerContainer = makeAnimated(staggerContainer);

export { AnimatedStaggerContainer };
