"use client";

import { useEffect, useState } from "react";
import { newsletterMessages } from "@/lib/newsletter-messages";
import { useLocale } from "./locale-provider";
import { NewsletterForm } from "./newsletter-form";
import { PageContainer } from "./page-container";
import { SocialLinks } from "./social-links";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DrawerVirtualKeyboardProvider,
} from "./ui/drawer";

export function SubscribeButton() {
	const t = newsletterMessages[useLocale()];
	const [headerHeight, setHeaderHeight] = useState(0);
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const measure = () =>
			setHeaderHeight(header.getBoundingClientRect().height);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(header);
		return () => observer.disconnect();
	}, []);
	return (
		<Drawer showSwipeHandle>
			<DrawerTrigger
				type="button"
				className="site-subscribe-button group flex cursor-pointer items-center justify-between gap-2 rounded-full border border-black/15 bg-white px-6 py-2 text-xs font-medium text-black transition-colors hover:bg-zinc-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black"
			>
				<span>{t.subscribe}</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
				>
					<path d="M7 17 17 7M7 7h10v10" />
				</svg>
			</DrawerTrigger>
			<DrawerVirtualKeyboardProvider>
				<DrawerContent
					style={{
						height: `max(0px, calc(100dvh - ${headerHeight}px - 25px))`,
						maxHeight: `max(0px, calc(100dvh - ${headerHeight}px - 25px))`,
					}}
					className="w-full max-w-none border-foreground/10 shadow-2xl data-[swipe-direction=down]:rounded-none"
				>
					<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
						<div className="flex min-h-full flex-col">
							<PageContainer className="relative flex-1 py-12">
								<DrawerHeader className="gap-3 p-0 pr-10 text-left md:gap-3 group-data-[swipe-axis=y]/drawer-popup:text-left">
									<DrawerTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
										{t.title}
									</DrawerTitle>
								</DrawerHeader>
								<p className="mt-6 mb-4 text-sm text-foreground/60">
									{t.socials}
								</p>
								<SocialLinks showLabels />
								<DrawerClose className="absolute top-6 right-6 flex size-8 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
									<svg
										aria-hidden="true"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										className="size-4"
									>
										<path d="m6 6 12 12M18 6 6 18" />
									</svg>
									<span className="sr-only">{t.close}</span>
								</DrawerClose>
							</PageContainer>
							<div className="mt-auto border-t border-foreground/10">
								<PageContainer className="pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
									<h3 className="text-lg font-medium tracking-tight">
										{t.subscribe}
									</h3>
									<DrawerDescription className="mt-2 max-w-xl text-sm leading-relaxed text-pretty">
										{t.description}
									</DrawerDescription>
									<NewsletterForm />
								</PageContainer>
							</div>
						</div>
					</div>
				</DrawerContent>
			</DrawerVirtualKeyboardProvider>
		</Drawer>
	);
}
