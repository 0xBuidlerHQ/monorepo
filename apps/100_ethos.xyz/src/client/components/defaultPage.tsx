import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H6 } from "@0xbuidlerhq/ui/system/base/typography";

interface PropsDefaultPage extends React.HTMLAttributes<HTMLElement> {
	label: string;
}

interface DottedBackgroundProps {
	dotSize?: number;
	dotSpacing?: number;
}

const Background: React.FC<DottedBackgroundProps> = ({ dotSize = 1, dotSpacing = 20 }) => {
	return (
		<Box
			className="absolute inset-px z-0 pointer-events-none"
			style={{
				backgroundImage: `radial-gradient(circle, rgba(1, 1, 1, 0.05) ${dotSize}px, transparent ${dotSize}px)`,
				backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
			}}
		/>
	);
};

export { Background };

const DefaultPage = (props: PropsDefaultPage) => {
	const { label, children } = props;

	return (
		<Box className="relative border-x border-accent grow px-[1px]">
			<Background />

			<Box className="pr-2 pt-2 absolute right-0">
				<H6 className="font-bold tracking-tighter font-work-sans text-[10px]!">[ /{label} ]</H6>
			</Box>

			{children}
		</Box>
	);
};

export { DefaultPage };
