"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrueOriginsMark } from "@/components/icons/trueorigins-mark";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { PageBreadcrumbs } from "@/features/navigation/page-breadcrumbs";
import { ResearchPanel } from "@/features/navigation/research-panel";
import { LoginButton } from "@/features/account/login-button";
import { primaryNavigationItems, isNavigationActive } from "@/features/navigation/navigation-items";

function HeaderLinks({ pathname, actions = false }: { pathname: string; actions?: boolean }) {
 const items = primaryNavigationItems.filter(item => ["/submit", "/verify"].includes(item.href) === actions)
  .sort((a, b) => actions ? Number(b.href === "/verify") - Number(a.href === "/verify") : 0);
 return <nav aria-label={actions ? "Item actions" : "Header navigation"}
  className={actions ? "flex shrink-0 items-center gap-1 pr-1 xl:gap-2 xl:pr-2" : "flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}>
  {items.map(item => <Link key={item.href} href={item.href} scroll={false} aria-current={isNavigationActive(item.href, pathname) ? "page" : undefined}
   className={actions
    ? `inline-flex h-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-1.5 text-xs font-medium transition-colors duration-200 lg:px-3 ${item.href === "/verify" ? "border-white bg-white text-[#141414] hover:border-[#dedede] hover:bg-[#dedede]" : "border-white/25 bg-transparent text-white/85 hover:border-white/45 hover:bg-white/[0.07] hover:text-white"}`
    : `relative inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-white/[0.07] px-3 text-[11px] transition-colors hover:text-white ${isNavigationActive(item.href, pathname) ? "text-white" : "text-[#969696]"}`}>
   <NavigationIcon name={item.icon} className={actions ? "size-[18px] shrink-0" : "size-3.5 shrink-0"} />
   <span className={actions ? "sr-only lg:not-sr-only" : undefined}>{item.href === "/verify" ? "Trace" : item.name}</span>
  </Link>)}
 </nav>;
}
function ActiveHeaderLinks({ actions = false }: { actions?: boolean }) {
 return <HeaderLinks pathname={usePathname()} actions={actions} />;
}

export function UtilityBar() {
 return <header data-utility-bar className="fixed inset-x-0 top-0 z-40 flex flex-col border-y border-[#292929] bg-[var(--background)] pt-[env(safe-area-inset-top)] text-[#dedede]">
  <div className="grid grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] grid-rows-[1.75rem_1.75rem] items-center sm:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)]">
   <div aria-hidden="true" className="pointer-events-none col-span-3 col-start-1 row-start-2 h-px self-start bg-white/15" />
   <div className="col-start-1 row-start-1 flex min-w-0 items-center">
    <Suspense fallback={<HeaderLinks pathname="" />}><ActiveHeaderLinks /></Suspense>
   </div>
   <div role="img" aria-label="TrueOrigin" data-centered-header-logo className="pointer-events-none relative col-start-2 row-span-2 row-start-1 flex h-full w-full select-none items-center justify-center gap-2 bg-[var(--background)] px-3 text-sm font-medium tracking-tight text-white/90">
    <span aria-hidden="true" className="font-sans text-base font-semibold tracking-[-0.05em]"><span className="text-white [text-shadow:0_0_6px_rgba(255,255,255,0.45)]">t</span>rue</span>
    <TrueOriginsMark className="size-6 shrink-0 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.35)] sm:size-7" />
    <span aria-hidden="true" className="font-sans text-base font-semibold tracking-[-0.05em]">origi<span className="text-white [text-shadow:0_0_6px_rgba(255,255,255,0.45)]">n</span></span>
   </div>
   <div className="col-start-3 row-span-2 row-start-1 flex h-full min-w-0 items-center justify-end pr-1 sm:pr-2 xl:pr-3 [&_[data-header-search]]:h-8 [&_[data-header-search]]:rounded-lg [&_[data-header-search]]:border-transparent [&_[data-header-search]>span:nth-child(2)]:hidden [&_[data-header-search]>kbd]:hidden xl:[&_[data-header-search]>span:nth-child(2)]:block xl:[&_[data-header-search]>kbd]:inline-flex [&_[data-header-account]]:h-8 [&_[data-header-account]]:rounded-lg [&_[data-header-account]]:border-transparent [&_[data-header-account]]:w-8 [&_[data-header-account]]:px-0">
    <div className="relative flex h-full shrink-0 items-center gap-1 bg-[var(--background)] sm:gap-2">
    <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/[0.12]" />
    <Suspense fallback={<HeaderLinks pathname="" actions />}><ActiveHeaderLinks actions /></Suspense>
    <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/[0.12]" />
    <ResearchPanel compact />
    <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/[0.12]" />
    <Suspense fallback={<div role="status" aria-label="Loading account" className="h-8 w-8" />}><LoginButton small /></Suspense>
    </div>
   </div>
   <div className="col-start-1 row-start-2 min-w-0"><Suspense fallback={<div aria-hidden="true" className="h-7 shrink-0" />}><PageBreadcrumbs /></Suspense></div>
  </div>
 </header>;
}
