"use client";

import { Menu } from "@base-ui/react/menu";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Suspense, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationIcon } from "@/components/icons/navigation-icon";

import { navigationItems as destinations, isNavigationActive as isActive } from "./navigation-items";

const mobilePrimary = new Set(["Explore", "Feed", "Registry", "Trading", "Collections"]);

const spring = { stiffness: 360, damping: 26, mass: 0.6 };

function DockItem({ name, icon, href, active, mobileHidden }: (typeof destinations)[number] & { active: boolean; mobileHidden: boolean }) {
 const reducedMotion = useReducedMotion();
 return (
  <Link href={href} scroll={false} aria-label={name} aria-current={active ? "page" : undefined}
   className={`relative h-10 min-w-0 items-center justify-center rounded-full outline-offset-2 transition-colors hover:z-10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-black lg:h-12 ${mobileHidden ? "hidden lg:flex" : "flex"} ${active ? "text-white" : "text-black hover:text-black/65"}`}>
   <motion.div className="relative grid size-full place-items-center rounded-full" whileTap={reducedMotion ? undefined : { scale: 0.95 }}>
    {active && <motion.span layoutId="active-page" className="absolute inset-0 rounded-full bg-black shadow-[0_1px_6px_rgba(32,60,75,0.05)]" transition={reducedMotion ? { duration: 0 } : spring} />}
    <NavigationIcon name={icon} className="relative z-10 size-5 shrink-0 lg:size-6" />
   </motion.div>
  </Link>
 );
}

export function BottomNavigation() {
 return <Suspense fallback={<NavigationDock pathname="" />}><ActiveNavigationDock /></Suspense>;
}
function ActiveNavigationDock() {
 return <NavigationDock pathname={usePathname()} />;
}
function MoreNavigation({ pathname }: { pathname: string }) {
 const secondary = destinations.filter(item => !mobilePrimary.has(item.name));
 const active = secondary.some(item => isActive(item.href, pathname));
 return <Menu.Root><Menu.Trigger aria-label="More pages" className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors lg:hidden ${active ? "bg-black text-white" : "text-black hover:bg-black/10"}`}>
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>
 </Menu.Trigger><Menu.Portal><Menu.Positioner side="top" align="end" sideOffset={16} collisionPadding={12} className="z-[105]"><Menu.Popup className="w-56 origin-[var(--transform-origin)] rounded-[24px] bg-[#f0f0ed]/95 p-2 text-[#171717] shadow-[0_12px_40px_#00000040] backdrop-blur-2xl transition-[opacity,transform] duration-150 data-starting-style:translate-y-2 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none">
  {secondary.map(item => <Menu.Item key={item.href} render={<Link href={item.href} scroll={false} />} aria-current={isActive(item.href, pathname) ? "page" : undefined} className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors data-highlighted:bg-black/5 ${isActive(item.href, pathname) ? "font-medium" : "text-black/65"}`}><NavigationIcon name={item.icon} className="size-5" />{item.name}</Menu.Item>)}
 </Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root>;
}
function NavigationDock({ pathname }: { pathname: string }) {
 const groupId = useId();
 return (
  <LayoutGroup id={groupId}>
   <nav aria-label="Main navigation" style={{ viewTransitionName: "navigation-dock" }}
    className="fixed bottom-[calc(2.75rem+env(safe-area-inset-bottom))] left-1/2 z-[100] isolate flex w-[calc(100%-1.5rem)] max-w-[640px] -translate-x-1/2 items-center rounded-full bg-white/55 p-1 shadow-[0_8px_40px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl backdrop-saturate-150 lg:w-auto">
    <div className="grid min-w-0 flex-1 grid-cols-5 lg:w-[468px] lg:flex-none lg:grid-cols-9 lg:gap-1">{destinations.map(destination => <DockItem key={destination.href} {...destination} active={isActive(destination.href, pathname)} mobileHidden={!mobilePrimary.has(destination.name)} />)}</div>
    <MoreNavigation pathname={pathname} />
   </nav>
  </LayoutGroup>
 );
}
