"use client";

import { type ComponentProps, type ReactNode, useId } from "react";
import { CloseIcon } from "@/components/icons/close-icon";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/config/utils";

type SideDrawerProps = Omit<
	ComponentProps<typeof Drawer>,
	"children" | "swipeDirection"
> & {
	side?: "left" | "right";
	theme?: "dark" | "light";
	title: string;
	trigger: ReactNode;
	triggerLabel?: string;
	triggerClassName?: string;
	description?: ReactNode;
	children?: ReactNode;
	className?: string;
};

export function SideDrawer({
	side = "right",
	theme = "dark",
	title,
	trigger,
	triggerLabel = title,
	triggerClassName,
	description,
	children,
	className,
	...props
}: SideDrawerProps) {
	const descriptionId = useId();
	return (
		<Drawer swipeDirection={side} {...props}>
			<DrawerTrigger
				aria-label={triggerLabel}
				title={triggerLabel}
				className={cn(
					"cursor-pointer transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-accent",
					triggerClassName,
				)}
			>
				{trigger}
			</DrawerTrigger>
			<DrawerContent
				aria-describedby={description ? descriptionId : undefined}
				className={cn(
					"[--cell:var(--app-cell)] data-[swipe-direction=left]:rounded-none data-[swipe-direction=right]:rounded-none",
					theme === "light" ? "border-white/60 bg-[#e4f2f9] text-[#203c4b] [color-scheme:light]" : "border-white/20 bg-black text-white [color-scheme:dark]",
					className,
				)}
			>
				<DrawerHeader className={cn("relative shrink-0 flex-row items-center justify-between gap-0 p-0 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px md:gap-0", theme === "light" ? "h-20 after:bg-black/5" : "h-[var(--cell)] after:bg-white/20")}>
					<DrawerTitle className={theme === "light" ? "px-6 text-base font-medium tracking-tight" : "px-4 font-mono text-xs"}>
						{title}
					</DrawerTitle>
					<DrawerClose
						aria-label={`Close ${title.toLowerCase()}`}
						className={cn(
							"grid shrink-0 cursor-pointer place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4",
							side === "left"
								? "order-first border-r"
								: "border-l",
							theme === "light" ? "mx-5 size-9 rounded-full border-none bg-white/50 text-[#587382] hover:bg-white/80 focus-visible:outline-[#203c4b]" : "size-[var(--cell)] border-white/20 text-brand-accent hover:bg-white/5 focus-visible:outline-brand-accent",
						)}
					>
						<CloseIcon className={theme === "light" ? "size-4" : "size-[calc(var(--cell)*0.5)]"} />
					</DrawerClose>
				</DrawerHeader>
				{(description || children) && (
					<div className="flex flex-col gap-5 overflow-y-auto p-5">
						{description && (
							<DrawerDescription
								id={descriptionId}
								className={cn("text-sm leading-relaxed", theme === "light" ? "text-black/60" : "text-white/60")}
							>
								{description}
							</DrawerDescription>
						)}
						{children}
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}
