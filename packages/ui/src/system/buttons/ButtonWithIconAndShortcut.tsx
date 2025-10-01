import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

const getColorClasses = (color: string) => {
	const colorMap = {
		cyan: {
			bg: "bg-cyan-500/10",
			border: "border-cyan-500/30",
			text: "text-cyan-400",
			hover: "hover:bg-cyan-500/15 hover:border-cyan-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(0,212,255,0.3)]",
		},
		purple: {
			bg: "bg-purple-500/10",
			border: "border-purple-500/30",
			text: "text-purple-500",
			hover: "hover:bg-purple-500/15 hover:border-purple-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(139,92,246,0.3)]",
		},
		green: {
			bg: "bg-green-500/10",
			border: "border-green-500/30",
			text: "text-green-500",
			hover: "hover:bg-green-500/15 hover:border-green-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(6,255,165,0.3)]",
		},
		orange: {
			bg: "bg-orange-500/10",
			border: "border-orange-500/30",
			text: "text-orange-500",
			hover: "hover:bg-orange-500/15 hover:border-orange-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(255,165,0,0.3)]",
		},
		pink: {
			bg: "bg-pink-500/10",
			border: "border-pink-500/30",
			text: "text-pink-500",
			hover: "hover:bg-pink-500/15 hover:border-pink-400/50",
			glow: "hover:shadow-[0_0_20px_rgba(255,0,128,0.3)]",
		},
		blue: {
			bg: "bg-blue-500/10",
			border: "border-blue-500/30",
			text: "text-blue-500",
			hover: "hover:bg-blue-500/15 hover:border-blue-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(59,130,246,0.3)]",
		},
		yellow: {
			bg: "bg-yellow-500/10",
			border: "border-yellow-500/30",
			text: "text-yellow-500",
			hover: "hover:bg-yellow-500/15 hover:border-yellow-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(255,217,61,0.3)]",
		},
		slate: {
			bg: "bg-slate-500/10",
			border: "border-slate-500/30",
			text: "text-slate-500",
			hover: "hover:bg-slate-500/15 hover:border-slate-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(148,163,184,0.3)]",
		},
		gray: {
			bg: "bg-gray-500/10",
			border: "border-gray-500/30",
			text: "text-gray-500",
			hover: "hover:bg-gray-500/15 hover:border-gray-400/50",
			glow: "hover:shadow-[0_0_5px_rgba(148,163,184,0.3)]",
		},
		black: {
			bg: "bg-black dark:invert",
			border: "border-white/50",
			text: "text-white",
			hover: "hover:bg-black/80 hover:border-white/50",
			glow: "hover:shadow-[0_0_5px_rgba(148,163,184,0.3)]",
		},
	};

	return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
};

type ButtonWithIconAndShortcutProps = {
	Icon: LucideIcon;
	label: string;
	shortcut: string;
	color: string;
} & ComponentProps<typeof ButtonBase>;
const ButtonWithIconAndShortcut = (props: ButtonWithIconAndShortcutProps) => {
	const { Icon, label, shortcut, color, href, onClick } = props;

	const classes = getColorClasses(color);

	return (
		<ButtonBase href={href} onClick={onClick}>
			<Box
				className={cn(
					"transition-all duration-500 cursor-pointer px-2 py-1 rounded flex items-center gap-2 font-semibold border border-accent",
					classes.bg,
					classes.border,
					classes.text,
					classes.hover,
					classes.glow,
				)}
			>
				<Icon className="size-3" />
				<H6 className="font-work-sans text-[11px]!">{label}</H6>
				<H6
					className={cn(
						"border border-accent text-[11px]! h-4 min-w-4 rounded-[2px] flex items-center justify-center",
						classes.border,
					)}
				>
					{shortcut}
				</H6>
			</Box>
		</ButtonBase>
	);
};

export { ButtonWithIconAndShortcut };
