export function OriginLogo({ className = "" }: { className?: string }) {
	return (
		<svg
			className={`text-brand-accent ${className}`}
			viewBox="0 0 32 32"
			aria-hidden="true"
			fill="none"
		>
			<path
				d="M16 2V30M2 16H30M6 6L26 26M6 26L26 6"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	);
}
