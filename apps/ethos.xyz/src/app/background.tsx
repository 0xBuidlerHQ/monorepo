"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";

interface BackgroundProps {
	dotSize?: number;
	dotSpacing?: number;
}

const Background: React.FC<BackgroundProps> = ({ dotSize = 1, dotSpacing = 20 }) => {
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
