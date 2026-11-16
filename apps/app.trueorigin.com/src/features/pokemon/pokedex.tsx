"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import data from "./pokedex.json";
import { ExploreCard } from "@/features/reference/explore-card";
import { PokedexSearchField, usePokedexSearch } from "./pokedex-search";
import { GenerationSelector } from "./generation-selector";
import { FilterPanel } from "@/components/ui/filter-panel";
import { pokemonArtwork } from "./artwork";

function normalize(value: string) {
	return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9♀♂]/g, "");
}

const pageSize = 48;

export function Pokedex({ initialQuery = "", embedded = false, queryFromLocation = false, artwork = pokemonArtwork }: {
	initialQuery?: string;
	queryFromLocation?: boolean;
	embedded?: boolean;
	artwork?: Record<number, string>;
}) {
	const Heading = embedded ? "h2" : "h1";
	const GroupHeading = embedded ? "h3" : "h2";
	const sharedSearch = usePokedexSearch();
	const [localQuery, setLocalQuery] = useState(initialQuery);
	const query = sharedSearch?.query ?? localQuery;
	const setQuery = sharedSearch?.setQuery ?? setLocalQuery;
	useEffect(() => { setLimit(pageSize); }, [query]);
	useEffect(() => {
		if (!queryFromLocation) return;
		const requested = new URLSearchParams(window.location.search).get("q");
		if (requested) setQuery(requested);
	}, [queryFromLocation]);
	const [generation, setGeneration] = useState("1");
	const [limit, setLimit] = useState(pageSize);
	const titleId = useId();
	const search = normalize(query);
	const visible = data.pokemon.filter((pokemon) =>
		(generation === "all" || pokemon.generation === Number(generation)) &&
		(normalize(pokemon.name).includes(search) || (search !== "" && String(pokemon.id).padStart(4, "0").includes(search))),
	);
	const displayed = visible.slice(0, limit);

	return (
		<section aria-labelledby={titleId} className={`w-full min-w-0 ${embedded ? "" : "px-2 py-8 sm:px-6"}`}>
			{!embedded && <Link href="/explore/pokemon" className="mb-6 inline-block text-sm text-white/50 hover:text-white">← Explore / Pokémon</Link>}
			<Heading id={titleId} className="sr-only">Pokédex</Heading>
			<div className="space-y-4">
				{!sharedSearch && <PokedexSearchField query={query} setQuery={setQuery} />}
				<FilterPanel resultCount={visible.length} canReset={generation !== "all" || Boolean(query)} onReset={() => { setGeneration("all"); setQuery(""); setLimit(pageSize); }}>
					<GenerationSelector value={generation} onChange={value => { setGeneration(value); setLimit(pageSize); }} />
				</FilterPanel>
			</div>
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
					<section key={item.id} aria-labelledby={`${titleId}-generation-${item.id}`} className="mt-6">
						<div className="mb-4 flex items-center gap-4">
							<GroupHeading id={`${titleId}-generation-${item.id}`} className="text-sm font-medium text-white/80">{item.name}</GroupHeading>
							<div className="h-px flex-1 bg-white/5" />
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
