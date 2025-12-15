"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

const NavigationMenu = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => {
	return <nav className={cn("relative flex items-center", className)}>{children}</nav>;
};

const NavigationMenuList = ({ children, className }: React.HTMLAttributes<HTMLUListElement>) => {
	return <ul className={cn("flex items-center gap-2", className)}>{children}</ul>;
};

const NavigationMenuItem = ({
	children,
	className,
}: React.HTMLAttributes<HTMLLIElement>) => {
	return <li className={cn("group relative", className)}>{children}</li>;
};

const NavigationMenuTrigger = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
		<button
			type="button"
			className={cn(
				navigationMenuTriggerStyle(),
				"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-muted",
				className,
			)}
			{...props}
		>
			{children}
		</button>
);

const NavigationMenuContent = ({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"pointer-events-none absolute left-0 top-full mt-2 min-w-[200px] rounded-2xl border border-muted bg-background p-4 opacity-0 shadow-lg transition duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

const NavigationMenuLink = forwardRef<
	HTMLAnchorElement,
	React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
	<Link
		ref={ref as any}
		className={cn(
			"inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-muted",
			className,
		)}
		{...props}
	>
		{children}
	</Link>
));
NavigationMenuLink.displayName = "NavigationMenuLink";

const navigationMenuTriggerStyle = () =>
	"inline-flex items-center gap-1 rounded-lg bg-transparent px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted data-[state=open]:text-foreground";

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuContent,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
};
