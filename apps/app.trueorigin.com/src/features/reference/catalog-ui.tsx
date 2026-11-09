import { formatCardNumber } from "@/features/reference/card-number";
import Image from "next/image";
import { LiveCatalogSearch } from "./live-catalog-search";
import Link from "next/link";
import { cardArtwork } from "./card-artwork";
import type { ReactNode } from "react";
import { findReferenceSet, type ReferenceCard } from "./catalog";

export const linkStyle = "border border-white/15 px-4 py-3 text-xs text-white/65 transition-colors hover:border-brand-accent hover:text-white focus-visible:outline-2 focus-visible:outline-brand-accent";

export function CatalogFrame({ title, description, children }: { title: string; description: string; children: ReactNode }) {
 return <section className="w-full min-w-0 self-stretch bg-[#080808]">
 <header className="border-b border-white/10 px-6 py-8 sm:px-9"><nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent"><Link href="/explore">Explore</Link><span aria-hidden="true">/</span><Link href="/explore/pokemon">Pokémon</Link><span aria-hidden="true">/</span><Link href="/explore/cards/pokemon">Cards</Link></nav><h1 className="mt-5 text-4xl font-medium tracking-[-0.05em]">{title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/45">{description}</p><nav aria-label="Catalog navigation" className="mt-6 flex flex-wrap gap-2"><Link href="/explore/cards/pokemon" className={linkStyle}>All Pokémon cards</Link><Link href="/explore/pokemon/pokedex" className={linkStyle}>By Pokémon</Link><Link href="/explore/sets" className={linkStyle}>By set</Link></nav></header>
 <div className="space-y-6 p-6 sm:p-9">{children}</div>
 </section>;
}

export function CatalogSearch({ query, placeholder = "Search cards or sets…" }: { query: string; placeholder?: string }) {
 return <LiveCatalogSearch query={query} placeholder={placeholder} />;
}

export function CardList({ cards }: { cards: ReferenceCard[] }) {
 if (!cards.length) return <p className="border border-white/10 p-6 text-sm leading-6 text-white/45">No matching cards in the current English catalog. Try another search.</p>;
 return <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => {
 const set = findReferenceSet(card.setId);
 return <li key={card.id}><Link href={`/explore/cards/${card.id}`} className="group flex h-full flex-col border border-white/10 bg-white/[0.015] p-5 hover:border-white/30 focus-visible:outline-2 focus-visible:outline-brand-accent">{cardArtwork[card.id] && <div className="relative mb-4 aspect-[600/825] w-full"><Image src={cardArtwork[card.id].src} alt={card.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain" /></div>}<p className="font-mono text-[9px] uppercase tracking-widest text-white/35">{set?.name} · {formatCardNumber(card, set?.printedTotal)}</p><h2 className="mt-3 text-lg tracking-tight text-white/85 group-hover:text-white">{card.name}</h2><p className="mt-2 text-xs text-white/40">{card.rarity ?? card.supertype} · English</p><span className="mt-6 text-xs text-white/50 group-hover:text-brand-accent">Card information ↗</span></Link></li>;
 })}</ul>;
}

export function Pagination({ page, pages, total, path, query }: { page: number; pages: number; total: number; path: string; query: string }) {
 const href = (next: number) => `${path}?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(next) })}`;
 return <nav aria-label="Results pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><p role="status" className="font-mono text-[10px] text-white/40">{total.toLocaleString("en-US")} results · Page {page} of {pages}</p><div className="flex gap-2">{page > 1 && <Link href={href(page - 1)} className={linkStyle}>← Previous</Link>}{page < pages && <Link href={href(page + 1)} className={linkStyle}>Next →</Link>}</div></nav>;
}
