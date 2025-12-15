import type { HTMLMotionProps, Transition, Variant } from "motion/react";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const transition: Transition = { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.99] };

const sectionVariants: Record<"hidden" | "visible", Variant> = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition },
};

const staggerContainer = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.05,
		},
	},
};

const cardVariants: Record<"hidden" | "visible", Variant> = {
	hidden: { opacity: 0, y: 16, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1, transition },
};

type MotionElement = keyof typeof motion;
type MotionProps<T extends MotionElement> = ComponentProps<(typeof motion)[T]>;

type WithAs<T extends MotionElement> = { as?: T } & MotionProps<T>;

const makeAnimated =
	<TDefault extends MotionElement>(
		variants: Variant | Record<string, Variant>,
		fallback: TDefault,
	) =>
	// eslint-disable-next-line react/display-name
	<T extends MotionElement = TDefault>({ as, ...props }: WithAs<T>) => {
		const Comp = (motion as Record<string, any>)[as ?? fallback];
		return <Comp variants={variants} {...props} />;
	};

const AnimatedStagger = makeAnimated(staggerContainer, "div");
const AnimatedSection = makeAnimated(sectionVariants, "div");
const AnimatedCard = makeAnimated(cardVariants, "div");

type MotionDivProps = HTMLMotionProps<"div">;

const ViewSwitch = (props: MotionDivProps) => (
	<motion.div
		initial="initial"
		animate="animate"
		exit="exit"
		variants={{
			initial: { opacity: 0, y: 16 },
			animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
			exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
		}}
		{...props}
	/>
);

export {
	AnimatedCard,
	AnimatedSection,
	AnimatedStagger,
	ViewSwitch,
	cardVariants,
	sectionVariants,
	staggerContainer,
};
