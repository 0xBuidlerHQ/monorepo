"use client";

import { catalogHref, type CatalogLanguage } from "@/features/reference/catalog-language";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { PokemonSectionSearch } from "./pokemon-section-search";
import { pokemonCategories } from "./categories";
import { useId } from "react";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";

const MotionLink = motion.create(Link);

export function PokemonCategoryNavigation({ categories, activeCategory, language = "en" }: {
	categories: { id: string; name: string }[];
	activeCategory: string;
	language?: CatalogLanguage;
}) {
	const groupId = useId();
	const reducedMotion = useReducedMotion();
	return (
		<LayoutGroup id={groupId}>
			<nav aria-label="Pokémon categories" className="flex min-w-0 gap-1 overflow-x-auto">
				{categories.map((entry) => {
					const active = entry.id === activeCategory;
					return (
						<MotionLink key={entry.id} whileTap={reducedMotion ? undefined : { scale: 0.96 }} href={catalogHref(`/explore/pokemon/${entry.id === "cards" ? "catalogue" : entry.id}`, language)} scroll={false} aria-current={active ? "page" : undefined}
							className={`relative isolate inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-white ${active ? "text-black" : "text-white/55 hover:text-white"}`}>
							{active && <motion.span layoutId="selected-category" className="absolute inset-0 -z-10 rounded-full bg-white" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32, mass: 0.8 }} />}
							<CatalogCategoryIcon category={entry.id} />
							{entry.name}
						</MotionLink>
					);
				})}
			</nav>
		</LayoutGroup>
	);
}

export function PokemonCategoryTabs() {
	const segment = useSelectedLayoutSegment();
	const active = segment === "pokedex" ? "pokedex" : segment === "sealed" ? "sealed" : "cards";
	return <div className="flex flex-wrap items-center justify-between gap-4 pb-3"><PokemonCategoryNavigation categories={pokemonCategories} activeCategory={active} /><div className="ml-auto w-full sm:w-auto"><PokemonSectionSearch category={active} /></div></div>;
}
