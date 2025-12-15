"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import React, { createContext, useContext, useState } from "react";

type SelectContextValue = {
	value: string;
	setValue: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
};

const SelectContext = createContext<SelectContextValue | null>(null);

type SelectProps = {
	defaultValue?: string;
	value?: string;
	disabled?: boolean;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
};

const Select = ({ defaultValue = "", value, onValueChange, disabled, children }: SelectProps) => {
	const [internal, setInternal] = useState(defaultValue);
	const current = value ?? internal;

	const setValue = (next: string) => {
		if (!value) setInternal(next);
		onValueChange?.(next);
	};

	return (
		<SelectContext.Provider value={{ value: current, setValue, disabled }}>
			<div className="relative inline-flex w-full max-w-sm flex-col gap-2">{children}</div>
		</SelectContext.Provider>
	);
};

const SelectTrigger = ({
	children,
	className,
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"flex min-w-[200px] items-center justify-between rounded-xl border border-muted bg-card px-3 py-2 text-sm",
				className,
			)}
		>
			{children}
		</div>
	);
};

const SelectValue = ({
	placeholder,
}: {
	placeholder?: string;
}) => {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new Error("SelectValue must be used within Select");

	return <span className="text-sm">{ctx.value || placeholder || ""}</span>;
};

const SelectContent = ({
	children,
	className,
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={cn("flex flex-col gap-1 rounded-xl border border-muted bg-card p-2", className)}>
			{children}
		</div>
	);
};

const SelectGroup = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
	return <div className="flex flex-col gap-1">{children}</div>;
};

const SelectItem = ({
	value,
	children,
	className,
}: { value: string } & React.HTMLAttributes<HTMLButtonElement>) => {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new Error("SelectItem must be used within Select");

	const active = ctx.value === value;

	return (
		<button
			type="button"
			className={cn(
				"flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
				active ? "bg-muted" : "hover:bg-muted/70",
				className,
			)}
			disabled={ctx.disabled}
			onClick={() => ctx.setValue(value)}
		>
			{children}
		</button>
	);
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem };
