"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationIcon } from "@/components/icons/navigation-icon";

const destinations = [
	{ name: "Explore", icon: "Explore", href: "/explore" },
	{ name: "Registry", icon: "Registry", href: "/registry" },
	{ name: "Trading", icon: "Trading", href: "/trading" },
	{ name: "Submit", icon: "Submit", href: "/submit" },
	{ name: "Collections", icon: "My Collection", href: "/collection" },
	{ name: "Verify", icon: "Verify", href: "/verify" },
	{ name: "Transfers", icon: "Transfers", href: "/transfers" },
	{ name: "Scan", icon: "Scan", href: "/scan" },
];

const spring = { stiffness: 360, damping: 26, mass: 0.6 };

function DockItem({ name, icon, href, active }: (typeof destinations)[number] & { active: boolean }) {
 const reducedMotion = useReducedMotion();
 return (
  <Link href={href} scroll={false} style={{ color: active ? "#ffffff" : "#000000" }} aria-label={name} title={name} aria-current={active ? "page" : undefined}
   className="relative flex h-12 min-w-0 items-center justify-center rounded-full outline-offset-2 hover:z-10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-black sm:h-[52px]">
   <motion.div className="relative grid size-full place-items-center rounded-full" whileTap={reducedMotion ? undefined : { scale: 0.95 }}>
    {active && <motion.span layoutId="active-page" style={{ backgroundColor: "#000000" }} className="absolute inset-0 rounded-full shadow-[0_1px_6px_rgba(32,60,75,0.05)]" transition={reducedMotion ? { duration: 0 } : spring} />}
    <NavigationIcon name={icon} className="relative z-10 size-6 shrink-0 sm:size-7" />
   </motion.div>
  </Link>
 );
}

export function BottomNavigation() {
 const pathname = usePathname();
 const groupId = useId();
 return (
  <LayoutGroup id={groupId}>
   <nav aria-label="Main navigation" style={{ viewTransitionName: "navigation-dock" }}
    className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[100] isolate grid w-[calc(100%-1.5rem)] max-w-[480px] -translate-x-1/2 grid-cols-8 gap-0 rounded-full bg-white/85 p-1 shadow-[0_8px_32px_rgba(32,60,75,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl backdrop-saturate-150 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
    {destinations.map((destination) => {
     const active = pathname === destination.href || (destination.href !== "/" && pathname.startsWith(`${destination.href}/`)) || (destination.href === "/registry" && pathname.startsWith("/items/"));
     return <DockItem key={destination.href} {...destination} active={active} />;
    })}
   </nav>
  </LayoutGroup>
 );
}
