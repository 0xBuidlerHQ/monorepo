import { type MotionDivProps, makeAnimated } from "@utils/index";

const staggerItem: MotionDivProps = {
	layout: true,
	variants: {
		hidden: { opacity: 0, y: 20, x: 0 },
		show: { opacity: 1, y: 0, x: 0 },
	},
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

const AnimatedStaggerItem = makeAnimated(staggerItem);

export { AnimatedStaggerItem };
