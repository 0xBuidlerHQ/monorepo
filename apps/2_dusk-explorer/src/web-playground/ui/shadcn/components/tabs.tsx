"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import React, { createContext, useContext, useState } from "react";

type TabsContextValue = {
	value: string;
	setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsProps = {
	defaultValue: string;
	value?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
	className?: string;
};

const Tabs = ({ defaultValue, value, onValueChange, children, className }: TabsProps) => {
	const [internal, setInternal] = useState(defaultValue);
	const current = value ?? internal;

	const setValue = (next: string) => {
		if (!value) {
			setInternal(next);
		}
		onValueChange?.(next);
	};

	return (
		<TabsContext.Provider value={{ value: current, setValue }}>
			<div className={cn("flex w-full flex-col gap-2", className)}>{children}</div>
		</TabsContext.Provider>
	);
};

const TabsList = ({
	children,
	className,
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex items-center gap-2 rounded-xl bg-muted p-1", className)}>
		{children}
	</div>
);

const TabsTrigger = ({
	value,
	children,
	className,
}: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

	const active = ctx.value === value;

	return (
		<button
			type="button"
			onClick={() => ctx.setValue(value)}
			className={cn(
				"rounded-lg px-3 py-1.5 text-sm font-semibold transition",
				active ? "bg-background shadow" : "text-muted-foreground hover:bg-background/60",
				className,
			)}
		>
			{children}
		</button>
	);
};

const TabsContent = ({
	value,
	children,
	className,
}: { value: string } & React.HTMLAttributes<HTMLDivElement>) => {
	const ctx = useContext(TabsContext);
	if (!ctx) throw new Error("TabsContent must be used within Tabs");

	if (ctx.value !== value) return null;

	return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
