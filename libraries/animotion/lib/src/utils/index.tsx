import { motion } from "motion/react";
import type { ComponentProps } from "react";

type MotionDivProps = ComponentProps<typeof motion.div>;

const makeAnimated = (defaultProps: MotionDivProps) => (props: MotionDivProps) => (
	<motion.div {...defaultProps} {...props} />
);

export { makeAnimated, type MotionDivProps };
