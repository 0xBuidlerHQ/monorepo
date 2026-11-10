"use client";

import { Command } from "cmdk";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export function ResearchPanel() {
 const reducedMotion = useReducedMotion();
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState("");
 function changeOpen(next: boolean) {
  setOpen(next);
  if (!next) setQuery("");
 }
 useEffect(() => {
  function onKeyDown(event: KeyboardEvent) {
   if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.isComposing && !event.repeat) {
    event.preventDefault();
    setOpen((previous) => !previous);
    setQuery("");
   }
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
 }, []);
 return <Drawer open={open} onOpenChange={changeOpen} swipeDirection="down">
  <DrawerTrigger aria-label="Open search (Command K or Control K)" render={<motion.button whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} />} className="group flex h-12 w-12 shrink-0 cursor-pointer items-center gap-3 rounded-full bg-[#222222] p-1.5 text-white/65 shadow-[0_3px_12px_#00000018,inset_0_1px_0_#ffffff08] transition-[background-color,box-shadow] duration-200 hover:bg-[#2a2a2a] hover:shadow-[0_4px_20px_#00000026,inset_0_1px_0_#ffffff0c] data-popup-open:bg-[#2a2a2a] motion-reduce:transition-none sm:w-64 sm:pr-3">
   <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.035] text-white/55 transition-colors group-hover:text-white/85"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-[19px]"><circle cx="10.75" cy="10.75" r="6.25" /><path d="m15.5 15.5 4 4" /></svg></span>
   <span className="hidden flex-1 text-left text-[13px] font-medium tracking-[-0.025em] sm:block">Search anything</span>
   <kbd className="hidden h-7 items-center gap-1 rounded-lg bg-white/[0.045] px-2 font-sans text-[10px] leading-none text-white/35 sm:inline-flex"><span className="text-xs">⌘</span>K</kbd>
  </DrawerTrigger>
  <DrawerContent style={{ height: "min(65dvh, calc(100dvh - var(--app-header-height)))", maxHeight: "calc(100dvh - var(--app-header-height))" }} className="border-white/15 bg-[#111] text-white [--drawer-bleed-background:#111] [color-scheme:dark] data-[swipe-direction=down]:rounded-t-2xl">
   <DrawerTitle className="sr-only">Search TrueOrigins</DrawerTitle>
   <DrawerDescription className="sr-only">Search panel.</DrawerDescription>
   <Command label="Search TrueOrigins" className="flex min-h-0 flex-1 flex-col" vimBindings={false}>
    <Command.Input value={query} onValueChange={setQuery} placeholder="Search…" aria-label="Search" className="h-16 shrink-0 border-b border-white/10 bg-transparent px-6 text-base text-white outline-none placeholder:text-white/35 sm:px-10" />
    <Command.List className="min-h-0 flex-1 overflow-y-auto" />
   </Command>
  </DrawerContent>
 </Drawer>;
}
