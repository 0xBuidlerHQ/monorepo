import Link from "next/link";
import { collections } from "@/features/navigation/collections";

export const metadata = { title: "Explore · Cards" };

export default function CardsPage() {
 return <section aria-labelledby="cards-title" className="w-full min-w-0 self-stretch bg-[#080808]">
 <header className="border-b border-white/10 px-6 py-10 sm:px-10"><Link href="/explore" className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">← Explore</Link><h1 id="cards-title" className="mt-6 text-5xl font-medium tracking-[-0.05em] sm:text-6xl">Cards</h1><p className="mt-4 text-sm text-white/45">Choose a game to explore its catalog.</p></header>
 <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-10">{collections.map(({ name, icon: Icon, href }) => name === "Pokemon" ? <Link key={name} href={href} className="group flex min-h-44 flex-col justify-between border border-white/20 bg-white/[0.02] p-6 hover:border-brand-accent/50 focus-visible:outline-2 focus-visible:outline-brand-accent"><div className="flex justify-between"><Icon className="size-12" /><span className="text-xs text-brand-accent">Explore ↗</span></div><div className="mt-6"><h2 className="text-2xl tracking-tight">Pokémon</h2><p className="mt-2 text-xs text-white/40">Browse by Pokémon, set, or card.</p></div></Link> : <div key={name} className="flex min-h-44 flex-col justify-between border border-white/[0.07] p-6"><div className="flex justify-between"><Icon className="size-12 opacity-40" /><span className="font-mono text-[9px] text-white/25">Coming later</span></div><h2 className="mt-6 text-2xl tracking-tight text-white/35">{name}</h2></div>)}</div>
 </section>;
}
