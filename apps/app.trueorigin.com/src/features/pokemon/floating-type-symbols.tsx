"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const symbols = ["grass", "fire", "water", "lightning", "psychic", "fighting", "colorless"];
const orbitTransition = { duration: 90, repeat: Infinity, ease: "linear" as const };

export function FloatingTypeSymbols() {
 const reducedMotion = useReducedMotion();
 return <div aria-hidden="true" className="pointer-events-none relative ml-4 hidden shrink-0 items-center justify-center opacity-70 sm:flex">
  <motion.div initial={false} animate={{ rotate: reducedMotion ? 0 : [0, 360] }} transition={reducedMotion ? { duration: 0 } : orbitTransition} className="relative size-[clamp(64px,8vw,112px)]">
   {symbols.map((type, index) => {
    const angle = index / symbols.length * Math.PI * 2 - Math.PI / 2;
    return <span key={type} style={{ left: `${(50 + Math.cos(angle) * 38).toFixed(4)}%`, top: `${(50 + Math.sin(angle) * 38).toFixed(4)}%` }} className="absolute size-4 -translate-x-1/2 -translate-y-1/2 lg:size-6">
     <motion.span initial={false} animate={{ rotate: reducedMotion ? 0 : [0, -360] }} transition={reducedMotion ? { duration: 0 } : orbitTransition} className="block size-full">
      <Image src={`/images/tcg-types/${type}.png`} alt="" width={24} height={24} className="size-full object-contain" />
     </motion.span>
    </span>;
   })}
  </motion.div>
 </div>;
}
