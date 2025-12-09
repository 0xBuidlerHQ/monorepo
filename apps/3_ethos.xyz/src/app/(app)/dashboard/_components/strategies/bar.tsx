import type React from "react";

interface BarPlaceholderProps {
	value: number; // can be < -1 or > 1
}

const BarPlaceholder: React.FC<BarPlaceholderProps> = ({ value }) => {
	const isPositive = value >= 0;
	const absValue = Math.abs(value);

	// Fonction pour calculer la largeur visuelle 0..50
	const getVisualWidth = (val: number) => {
		if (val <= 0.1) {
			return (val / 0.1) * 25; // linéaire : 0→0%, 0.1→25%
		}
		const excess = val - 0.1; // portion au-dessus de 0.1
		const maxExcess = 0.9;
		const normalized = Math.min(excess / maxExcess, 1); // clamp 0..1
		const scaledExcess = (25 * (1 - Math.exp(-normalized * 4))) / (1 - Math.exp(-4));
		return 25 + scaledExcess; // 0.1→25, 1→50
	};

	// Première barre (max -1..1)
	const mainWidth = Math.min(getVisualWidth(Math.min(absValue, 1)), 50);

	// Excédent au-dessus de 1 → seconde barre bleue
	const overflow = absValue > 1 ? absValue - 1 : 0;
	const overflowWidth = overflow > 0 ? getVisualWidth(Math.min(overflow, 1)) : 0;

	return (
		<div className="relative w-full h-1 bg-muted rounded-md overflow-hidden">
			{/* Première barre (rouge/verte) */}
			{value !== 0 && (
				<div
					className={`absolute rounded top-0 h-full ${isPositive ? "bg-green-400" : "bg-red-400"}`}
					style={{
						left: isPositive ? "50%" : undefined,
						right: !isPositive ? "50%" : undefined,
						width: `${mainWidth}%`,
					}}
				/>
			)}

			{/* Seconde barre (bleue si overflow) */}
			{overflow > 0 && (
				<div
					className="absolute rounded left-0 bg-blue-500 opacity-80 h-full"
					style={{
						left: isPositive ? "50%" : undefined,
						right: !isPositive ? "50%" : undefined,
						width: `${overflowWidth}%`,
					}}
				/>
			)}
		</div>
	);
};

export { BarPlaceholder };
