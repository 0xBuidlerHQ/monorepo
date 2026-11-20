"use client";

import { Accordion } from "@base-ui/react/accordion";
import type { ReactNode } from "react";

export function EventSections({ children }: { children: ReactNode }) {
	return (
		<Accordion.Root
			multiple
			defaultValue={["object", "event"]}
			className="mt-3"
		>
			{children}
		</Accordion.Root>
	);
}

export function EventSection({
	title,
	value,
	children,
}: {
	title: string;
	value: string;
	children: ReactNode;
}) {
	return (
		<Accordion.Item value={value} className="border-b border-white/[0.08]">
			<Accordion.Header>
				<Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm py-5 text-left text-xs text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white">
					{title}
					<svg
						aria-hidden="true"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
						className="size-3.5 text-white/40 transition-transform duration-250 group-data-[panel-open]:rotate-180 motion-reduce:transition-none"
					>
						<path d="m4 6 4 4 4-4" />
					</svg>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] duration-250 ease-out data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0 motion-reduce:transition-none">
				<div className="pb-5">{children}</div>
			</Accordion.Panel>
		</Accordion.Item>
	);
}
