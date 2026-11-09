"use client";

import { ContentSurface } from "@/features/shell/content-surface";
import { useId, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import data from "./pokedex.json";
import { ExploreCard } from "@/features/reference/explore-card";
import { pokemonArtwork } from "./artwork";

function normalize(value: string) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9♀♂]/g, "");
}

const pageSize = 48;

export function Pokedex({ initialQuery = "", embedded = false, artwork = pokemonArtwork }: {
	initialQuery?: string;
	embedded?: boolean;
	artwork?: Record<number, string>;
}) {
	const Heading = embedded ? "h2" : "h1";
	const GroupHeading = embedded ? "h3" : "h2";
	const [query, setQuery] = useState(initialQuery);
	const [generation, setGeneration] = useState("1");
	const [limit, setLimit] = useState(pageSize);
	const searchId = useId();
	const titleId = useId();
	const generationGroup = useId();
	const reducedMotion = useReducedMotion();
	const search = normalize(query);
	const visible = data.pokemon.filter((pokemon) =>
		(generation === "all" || pokemon.generation === Number(generation)) &&
		(normalize(pokemon.name).includes(search) || (search !== "" && String(pokemon.id).padStart(4, "0").includes(search))),
	);
	const displayed = visible.slice(0, limit);

	return (
		<section aria-labelledby={titleId} className={`w-full min-w-0 ${embedded ? "" : "px-2 py-8 sm:px-6"}`}>
			{!embedded && <Link href="/explore/pokemon" className="mb-6 inline-block text-sm text-white/50 hover:text-white">← Explore / Pokémon</Link>}
			<ContentSurface className="rounded-[28px] bg-gradient-to-br from-[#202020] to-[#191919] p-5 shadow-[inset_0_1px_0_#ffffff06] sm:p-6">
				<header className="flex flex-wrap items-center justify-between gap-5">
					<div className="flex items-center gap-3">
						<span aria-hidden="true" className="flex size-10 items-center justify-center rounded-2xl bg-white/5 text-white/65"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-5"><circle cx="12" cy="12" r="9" /><path d="M3 12h6m6 0h6" /><circle cx="12" cy="12" r="3" /></svg></span>
						<Heading id={titleId} className="text-2xl font-medium tracking-[-0.045em] sm:text-[28px]">Pokédex</Heading>
						<p role="status" aria-label={`${visible.length.toLocaleString("en-US")} Pokémon${query ? ` matching ${query}` : ""}`} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] tabular-nums text-white/40">{visible.length.toLocaleString("en-US")}</p>
					</div>
					<div className="flex w-full items-center gap-3 rounded-2xl bg-black/20 px-4 ring-1 ring-white/[0.06] transition-[background-color,box-shadow] focus-within:bg-black/30 focus-within:ring-white/25 sm:w-80">
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-white/40"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
						<label htmlFor={searchId} className="sr-only">Search Pokémon by name or number</label>
						<input id={searchId} type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(pageSize); }} placeholder="Name or Pokédex number" className="h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-white/30" />
						{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setLimit(pageSize); }} className="flex size-6 cursor-pointer shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3"><path d="m4 4 8 8m0-8-8 8" /></svg></button>}
					</div>
				</header>
				<div className="mt-5">
					<LayoutGroup id={generationGroup}>
						<fieldset aria-label="Filter by generation" className="flex items-center gap-1 overflow-x-auto rounded-2xl bg-black/15 p-1.5">
							<legend className="sr-only">Generation</legend>
							{[{ id: "all", name: "All generations" }, ...data.generations.map((item) => ({ id: String(item.id), name: item.name.replace("Generation", "Gen") }))].map((item) => (
								<motion.button key={item.id} whileTap={reducedMotion ? undefined : { scale: 0.96 }} type="button" aria-pressed={generation === item.id} onClick={() => { setGeneration(item.id); setLimit(pageSize); }} className={`relative isolate cursor-pointer shrink-0 rounded-xl px-3.5 py-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-white ${generation === item.id ? "text-black" : "text-white/45 hover:bg-white/[0.03] hover:text-white"}`}>
									{generation === item.id && <motion.span layoutId="generation-selection" className="absolute inset-0 -z-10 rounded-xl bg-[#eeeeeb] shadow-sm" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}
									{item.name}
								</motion.button>
							))}
						</fieldset>
					</LayoutGroup>
				</div>
			</ContentSurface>
			{visible.length === 0 ? (
				<div className="my-8 rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
					<p className="text-lg">No Pokémon found</p>
					<p className="mt-2 text-sm text-white/45">Try another name, number, or generation.</p>
					<button type="button" onClick={() => { setQuery(""); setGeneration("all"); setLimit(pageSize); }} className="mt-5 cursor-pointer rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/15">Clear filters</button>
				</div>
			) : data.generations.map((item) => {
				const pokemon = displayed.filter((entry) => entry.generation === item.id);
				if (!pokemon.length) return null;
				const total = visible.filter((entry) => entry.generation === item.id).length;
				return (
					<section key={item.id} aria-labelledby={`${titleId}-generation-${item.id}`} className="mt-8">
						<div className="mb-4 flex items-center gap-4">
							<GroupHeading id={`${titleId}-generation-${item.id}`} className="text-sm font-medium text-white/80">{item.name}</GroupHeading>
							<div className="h-px flex-1 bg-white/10" />
							<span className="text-xs text-white/35">{total} Pokémon</span>
						</div>
						<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
							{pokemon.map((entry) => (
								<li key={entry.id}>
									<ExploreCard
										name={entry.name}
										brand={`#${String(entry.id).padStart(4, "0")}`}
										brandMono
										href={`/explore/pokemon/${entry.id}`}
										image={artwork[entry.id]}
										alt={entry.name}
										headingAs={embedded ? "h4" : "h3"}
										sizes="(min-width: 1024px) 16.67vw, (min-width: 640px) 33vw, 50vw"
									/>
								</li>
							))}
						</ul>
					</section>
				);
			})}
			{visible.length > 0 && <div className="mt-10 flex flex-col items-center gap-4">
				<p className="text-xs text-white/35">Showing {displayed.length} of {visible.length.toLocaleString("en-US")}</p>
				{displayed.length < visible.length && <button type="button" onClick={() => setLimit((value) => value + pageSize)} className="cursor-pointer rounded-full border border-white/15 px-7 py-3 text-sm text-white/80 transition-colors hover:border-white/35 hover:bg-white/5">Discover more <span aria-hidden="true" className="ml-3">↓</span></button>}
			</div>}
		</section>
	);
}
