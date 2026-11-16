"use client";

import { addTransitionType, startTransition } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RevealImage } from "@/components/ui/reveal-image";
import { RaritySymbol } from "./rarity-symbol";
import type { CardPrinting } from "./card-printings";

export function CardPrintingSelector({ printings, image, cardName, types, number }: { printings: readonly CardPrinting[]; image?: string; cardName: string; types: string[]; number: string }) {
 const params = useSearchParams();
 const reducedMotion = useReducedMotion();
 const selected = printings.find(printing => printing.id === params.get("printing"));
 function select(id?: string) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("printing",id); else url.searchParams.delete("printing");
  startTransition(() => {
   addTransitionType("catalog-filter");
   window.history.pushState(null,"",url.pathname + url.search + url.hash);
  });
 }
 return <section aria-label="Card printings" className="mt-7 min-w-0 border-t border-white/[0.08] pt-6">
  <div className="mb-4 flex items-center justify-between gap-4">
   <h2 className="text-xs text-white/65">Printings <span className="ml-2 font-mono text-[10px] text-white/25">{printings.length}</span></h2>
   {selected && <button type="button" onClick={() => select()} className="cursor-pointer text-[11px] text-white/35 hover:text-white">All printings</button>}
  </div>
  <div className="-mx-1 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
   <div className="grid auto-cols-[minmax(184px,1fr)] grid-flow-col gap-2">
    {printings.map(printing => {
     const active = selected?.id === printing.id;
     return <motion.button key={printing.id} type="button" aria-pressed={active} onClick={() => select(printing.id)} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ type:"spring", stiffness:350, damping:28 }} className={`group relative isolate flex cursor-pointer flex-col items-start overflow-hidden rounded-xl border p-1.5 text-left transition-colors ${active ? "border-white/25 bg-[#242424]" : "border-white/[0.06] bg-[#1b1b1b] hover:border-white/15 hover:bg-[#202020]"}`}>
      <span className="relative block aspect-[600/825] w-full overflow-hidden rounded-lg">
       {image && <RevealImage src={image} alt={cardName} fill sizes="(min-width: 1024px) 160px, 32vw" className="object-contain" />}
       {active && <span aria-hidden="true" className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-white text-black shadow-md"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3"><path d="m3 8 3 3 7-7" /></svg></span>}
      </span>
      <span className="mt-1.5 flex min-h-9 w-full min-w-0 items-center gap-1.5 px-1">
       <span title={printing.name} className={`min-w-0 truncate text-xs font-medium leading-5 ${active ? "text-white" : "text-white/70"}`}>{printing.name}</span>
       {types.map(type => <Image key={type} src={`/images/tcg-types/${type.toLowerCase()}.png`} alt={`${type} type`} width={16} height={16} className="size-4 shrink-0 object-contain" />)}
       {printing.rarity && <span title={`${printing.rarity} · ${printing.finish}`} className="inline-flex shrink-0"><RaritySymbol rarity={printing.rarity} /><span className="sr-only">{printing.rarity} · {printing.finish}</span></span>}
       <span className="ml-auto shrink-0 font-mono text-[9px] leading-5 tabular-nums text-white/40">#{number}</span>
      </span>
     </motion.button>;
    })}
   </div>
  </div>

 </section>;
}
