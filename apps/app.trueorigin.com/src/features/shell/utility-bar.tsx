"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { PageBreadcrumbs } from "@/features/navigation/page-breadcrumbs";
import { ResearchPanel } from "@/features/navigation/research-panel";
import { LoginButton } from "@/features/account/login-button";
import {
	navigationItems,
	isNavigationActive,
} from "@/features/navigation/navigation-items";

function HeaderLinks({ pathname }: { pathname: string }) {
	return (
		<nav
			aria-label="Header navigation"
			className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{navigationItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					scroll={false}
					aria-current={
						isNavigationActive(item.href, pathname) ? "page" : undefined
					}
					className={`inline-flex h-[30px] shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-white/[0.07] px-3 text-[11px] transition-colors last:border-r-0 hover:text-white ${isNavigationActive(item.href, pathname) ? "text-white" : "text-[#969696]"}`}
				>
					<NavigationIcon name={item.icon} className="size-3.5 shrink-0" />
					{item.name}
				</Link>
			))}
		</nav>
	);
}
function ActiveHeaderLinks() {
	return <HeaderLinks pathname={usePathname()} />;
}
export function UtilityBar() {
	return (
		<header
			data-utility-bar
			style={{ viewTransitionName: "app-header" }}
			className="fixed inset-x-0 top-0 z-40 flex flex-col border-y border-[#292929] bg-[var(--background)] pt-[env(safe-area-inset-top)] text-[#dedede]"
		>
			<div className="flex h-[30px] items-center">
				<Link
					href="/explore"
					aria-label="TrueOrigin Explore"
					className="grid h-[30px] w-10 shrink-0 place-items-center border-r border-white/[0.07] text-white/80 transition-colors hover:text-white"
				>
					<TrueOriginsMark className="size-[18px]" />
				</Link>
				<Suspense fallback={<HeaderLinks pathname="" />}>
					<ActiveHeaderLinks />
				</Suspense>
				<div className="ml-auto flex h-[30px] shrink-0 items-center border-l border-white/[0.07] bg-[var(--background)]">
					<ResearchPanel compact />
					<Suspense
						fallback={
							<div
								role="status"
								aria-label="Loading account"
								className="h-[30px] w-24 bg-white/[0.03]"
							/>
						}
					>
						<LoginButton small />
					</Suspense>
				</div>
			</div>
			<Suspense
				fallback={
					<div
						aria-hidden="true"
						className="h-7 shrink-0 border-t border-white/[0.06]"
					/>
				}
			>
				<PageBreadcrumbs />
			</Suspense>
		</header>
	);
}
