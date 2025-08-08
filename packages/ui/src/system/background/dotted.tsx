interface DottedBackgroundProps {
	children: React.ReactNode;
	dotSize?: number;
	dotSpacing?: number;
}

const DottedBackground: React.FC<DottedBackgroundProps> = ({
	children,
	dotSize = 1,
	dotSpacing = 20,
}) => {
	return (
		<div
			className="min-h-screen w-full bg-background"
			style={{
				backgroundImage: `radial-gradient(circle, var(--muted) ${dotSize}px, transparent ${dotSize}px)`,
				backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
			}}
		>
			{children}
		</div>
	);
};

export { DottedBackground };
