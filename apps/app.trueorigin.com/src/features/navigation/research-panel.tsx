"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export function ResearchPanel() {
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
  <DrawerTrigger aria-label="Open search (Command K or Control K)" className="flex h-12 w-12 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#242424]/90 p-2 text-white/75 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[400px]:w-36 min-[400px]:pr-4 sm:w-64">
   <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/65"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-[18px]"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span>
   <span className="hidden flex-1 text-left text-sm font-medium min-[400px]:block">Search</span><kbd className="hidden font-mono text-[11px] text-white/35 sm:block">⌘ K</kbd>
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
