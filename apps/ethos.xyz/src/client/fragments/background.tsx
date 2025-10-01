import { Container } from "@0xbuidlerhq/ui/system/base/container";

interface DottedBackgroundProps {
	dotSize?: number;
	dotSpacing?: number;
}

const Background: React.FC<DottedBackgroundProps> = ({ dotSize = 1, dotSpacing = 20 }) => {
	return (
		<Container
			className="h-full z-0 absolute top-0 left-0 right-0 bottom-0 pointer-events-none bg-red-500"
			style={{
				backgroundImage: `radial-gradient(circle, rgba(1, 1, 1, 0.05) ${dotSize}px, transparent ${dotSize}px)`,
				backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
			}}
		/>
	);
};

export { Background };
