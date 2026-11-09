"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationIcon } from "@/components/icons/navigation-icon";
import { OriginLogo } from "@/components/origin-logo";
import { collections, navigationItems } from "./collections";

const sidebarItems = navigationItems.filter((item) => !collections.some((game) => game.href === item.href));

export function Sidebar() {
 const pathname = usePathname();
 return (
  <aside aria-label="Main navigation" className="fixed inset-y-0 left-0 z-20 flex w-20 flex-col border-r border-[#203c4b]/10 bg-brand-cyan md:w-56">
   <Link href="/" aria-label="TrueOrigin Home" className="flex h-24 shrink-0 items-center justify-center gap-3 outline-offset-[-6px] md:justify-start md:px-7">
    <OriginLogo className="size-7 shrink-0" />
    <span className="hidden text-[18px] font-medium tracking-[-0.05em] text-[#203c4b] md:block">TrueOrigin<span className="text-brand-accent">.</span></span>
   </Link>
   <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-8 md:px-5">
    {sidebarItems.map(({ name, href }) => {
     const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) || (href === "/explore" && pathname.startsWith("/items/"));
     return <Link key={href} href={href} aria-label={name} title={name} aria-current={active ? "page" : undefined} className="group relative flex h-11 items-center justify-center gap-3 rounded-md px-3 text-[#203c4b]/55 transition-colors duration-150 hover:bg-white/20 hover:text-[#203c4b] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#203c4b] aria-[current=page]:text-[#203c4b] aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-3 aria-[current=page]:before:-left-3 aria-[current=page]:before:w-0.5 aria-[current=page]:before:bg-brand-accent motion-reduce:transition-none md:justify-start md:aria-[current=page]:before:-left-5">
      <NavigationIcon name={name} />
      <span className="hidden min-w-0 flex-1 text-[13px] tracking-[-0.01em] md:block">{name}</span>
     </Link>;
    })}
   </nav>
   <Link href="/" aria-label="Back to TrueOrigin website" title="Back to website" className="mx-3 mb-6 flex h-11 shrink-0 items-center justify-center gap-3 px-3 text-[#203c4b]/40 transition-colors hover:text-[#203c4b] md:mx-5 md:justify-start">
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[18px] shrink-0"><path d="M11 4h5v5m0-5-8 8" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3" strokeLinecap="round" /></svg>
    <span className="hidden text-xs md:block">Back to website</span>
   </Link>
  </aside>
 );
}
