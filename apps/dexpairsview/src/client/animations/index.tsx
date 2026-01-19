import { motion } from "motion/react";
import type { ComponentProps } from "react";

type MotionDivProps = ComponentProps<typeof motion.div>;

const cardVariants: MotionDivProps = {
	variants: {
		hidden: { opacity: 0, x: 10, y: 10, scale: 0.98 },
		visible: { opacity: 1, x: 0, y: 0, scale: 1 },
	},
};

const staggerContainer: MotionDivProps = {
	layout: true,
	initial: "hidden",
	animate: "show",
	variants: {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	},
};

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

const makeAnimated = (defaultProps: MotionDivProps) => (props: MotionDivProps) => (
	<motion.div {...defaultProps} {...props} />
);

const AnimatedStaggerContainer = makeAnimated(staggerContainer);
const AnimatedStaggerItem = makeAnimated(staggerItem);
const AnimatedSection = AnimatedStaggerItem;
const AnimatedCard = makeAnimated(cardVariants);

export {
	AnimatedCard,
	AnimatedSection,
	AnimatedStaggerContainer,
	AnimatedStaggerItem,
	cardVariants,
	staggerContainer,
};
