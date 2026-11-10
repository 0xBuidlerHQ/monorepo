import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { CatalogLanguageSelector } from "@/features/reference/catalog-language-selector";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import { ContentSurface } from "@/features/shell/content-surface";
import { formatCardNumber } from "@/features/reference/card-number";
import { setPageHref } from "@/features/reference/set-relationships";
import { RevealImage as Image } from "@/components/ui/reveal-image";
import { LiveCatalogSearch } from "@/features/reference/live-catalog-search";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EvolutionFamily } from "@/features/pokemon/evolution-family";
import { pokemonArtwork } from "@/features/pokemon/artwork";
import { findPokemonProfile } from "@/features/pokemon/profiles";
import { findPokemon, findReferenceSet, paginate, searchReferenceCards } from "@/features/reference/catalog";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { ExploreCard } from "@/features/reference/explore-card";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";

export async function generateMetadata({ params }: Props) {
	const pokemon = findPokemon((await params).id);
	return { title: pokemon ? `${pokemon.name} · Pokédex` : "Pokémon not found" };
}
export function generateStaticParams() { return [{ id: "6" }]; }
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string; q?: string; page?: string }> };

async function PokemonProfile(props: Props) {
	const [{ id }, params] = await Promise.all([props.params, props.searchParams]);
	const language = catalogLanguage(params.lang);
	const pokemon = findPokemon(id);
	if (!pokemon) notFound();
	const profile = findPokemonProfile(pokemon.id);
	const image = pokemonArtwork[pokemon.id];
	const query = typeof params.q === "string" ? params.q : "";
	const appearances = searchReferenceCards("", { pokemonId: pokemon.id, language });
	const result = paginate(query ? searchReferenceCards(query, { pokemonId: pokemon.id, language }) : appearances, params.page);
	const setCount = new Set(appearances.map((card) => card.setId)).size;
	const previous = findPokemon(String(pokemon.id - 1));
	const next = findPokemon(String(pokemon.id + 1));
	const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][pokemon.generation - 1];
	const number = `#${String(pokemon.id).padStart(4, "0")}`;
	return (
		<article aria-labelledby="pokemon-profile-title">
			<nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/45">
				<Link href="/explore" className="hover:text-white">Explore</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon", language)} className="hover:text-white">Pokémon</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon?category=pokedex", language)} className="hover:text-white">Pokédex</Link><span aria-hidden="true">/</span>
				<span aria-current="page" className="text-white/80">{pokemon.name}</span>
			</nav>
			<ContentSurface as="header" className="relative isolate mt-6 grid overflow-hidden rounded-[32px] bg-[#1c1c1c] md:grid-cols-2">
				<div className="relative z-10 flex flex-col items-start justify-center p-7 sm:p-10 lg:p-12">
					<p className="font-mono text-xs text-white/40">{number}<span className="mx-3 text-white/20">/</span>Generation {roman}</p>
					<h1 id="pokemon-profile-title" className="mt-6 break-words text-[clamp(40px,6vw,88px)] font-medium leading-none tracking-[-0.065em]">{pokemon.name}</h1>
					{profile?.genus && <p className="mt-3 text-sm text-white/45">{profile.genus}</p>}
					{profile && <div className="mt-5 flex flex-wrap gap-2">{profile.types.map((type) => <span key={type} className="rounded-full bg-white/[0.07] px-4 py-1.5 text-xs text-white/75">{type}</span>)}</div>}
					{profile?.description && <p className="mt-6 max-w-md text-sm leading-7 text-white/60">{profile.description}</p>}
					<div className="mt-8 flex flex-wrap gap-3">
						<a href="#pokemon-cards" className="rounded-full bg-white px-5 py-3 text-sm text-black transition-colors hover:bg-white/85">Explore cards <span aria-hidden="true" className="ml-3">↓</span></a>
						<a href="#evolutions" className="rounded-full bg-white/5 px-5 py-3 text-sm text-white/70 transition-colors hover:bg-white/10">Evolution family</a>
					</div>
				</div>
				<div className="relative mx-6 mb-6 aspect-square min-w-0 md:m-6 lg:m-8">
					<Image src={image} alt="" aria-hidden="true" fill sizes="(min-width: 768px) 45vw, 90vw" className="pointer-events-none scale-90 object-contain opacity-25 blur-3xl" />
					<Image src={image} alt={pokemon.name} fill preload sizes="(min-width: 768px) 45vw, 90vw" className="object-contain p-6 sm:p-10" />
				</div>
			</ContentSurface>
			<dl className="my-8 grid grid-cols-2 gap-y-6 rounded-3xl bg-white/[0.025] py-6 sm:grid-cols-4">
				{[
					{ label: "Height", value: profile ? `${profile.heightMeters} m` : "—" },
					{ label: "Weight", value: profile ? `${profile.weightKg} kg` : "—" },
					{ label: "Card appearances", value: appearances.length.toLocaleString("en-US") },
					{ label: "Sets featuring this Pokémon", value: String(setCount) },
				].map((fact) => <div key={fact.label} className="px-6 sm:px-8"><dt className="text-xs text-white/40">{fact.label}</dt><dd className="mt-2 text-xl tracking-tight">{fact.value}</dd></div>)}
			</dl>
			<div id="evolutions" className="scroll-mt-[calc(var(--app-header-height)+1rem)]"><EvolutionFamily pokemonId={pokemon.id} /></div>
			<section id="pokemon-cards" aria-labelledby="pokemon-cards-title" className="mt-10 scroll-mt-[calc(var(--app-header-height)+1rem)]">
				<header className="mb-6 flex flex-wrap items-end justify-between gap-5">
					<div><h2 id="pokemon-cards-title" className="text-3xl font-medium tracking-[-0.045em]">{pokemon.name} in cards</h2><p className="mt-2 text-sm text-white/45">{result.total.toLocaleString("en-US")} {language === "fr" ? "French" : "English"} card references{query ? ` matching “${query}”` : " across sets and editions"}.</p></div>
					<div className="flex flex-wrap items-center gap-3"><CatalogLanguageSelector /><LiveCatalogSearch key={pokemon.id} query={query} placeholder="Search cards or sets…" /></div>
				</header>
				{result.items.length > 0 ? <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{result.items.map((card) => {
					const set = findReferenceSet(card.setId, language);
					return <li key={card.id}><ExploreCard name={card.name} brand={set?.name ?? "Pokémon TCG"} href={catalogHref(`/explore/cards/${card.id}`, language)} alt={card.name} imageLayout="portrait" image={getCardArtwork(card.id, language)?.src} placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} description={`${formatCardNumber(card, set?.printedTotal)} · ${card.rarity ?? card.supertype}`} />{set && <Link href={catalogHref(setPageHref(set.id), language)} className="mt-3 inline-block px-2 text-xs text-white/45 hover:text-white">Browse set ↗<span className="sr-only">: {set.name}</span></Link>}</li>;
				})}</ul> : <div className="rounded-3xl bg-white/[0.025] px-6 py-12 text-center text-sm text-white/50">{query ? "No matching cards. Try another name or set." : "No cards in the current catalog yet."}</div>}
				{result.total > 0 && <nav aria-label="Card pages" className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white/45"><span>Page {result.page} of {result.pages}</span><div className="flex gap-3">{[result.page - 1, result.page + 1].filter((page) => page >= 1 && page <= result.pages).map((page) => <Link key={page} href={`/explore/pokemon/${pokemon.id}?${new URLSearchParams({ lang: language, q: query, page: String(page) })}#pokemon-cards`} className="rounded-full border border-white/15 px-5 py-2.5 hover:bg-white/5 hover:text-white">{page < result.page ? "← Previous" : "Next →"}</Link>)}</div></nav>}
			</section>
			<nav aria-label="Previous and next Pokémon" className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
				<div>{previous && <Link href={catalogHref(`/explore/pokemon/${previous.id}`, language)} className="text-sm text-white/60 hover:text-white"><span className="mb-2 block text-xs text-white/30">← Previous Pokémon</span>{previous.name}</Link>}</div>
				<div className="text-right">{next && <Link href={catalogHref(`/explore/pokemon/${next.id}`, language)} className="text-sm text-white/60 hover:text-white"><span className="mb-2 block text-xs text-white/30">Next Pokémon →</span>{next.name}</Link>}</div>
			</nav>
			<p className="mt-8 text-[10px] text-white/30">Species data: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="hover:text-white">PokéAPI</a> · Card references: <a href="https://github.com/PokemonTCG/pokemon-tcg-data" target="_blank" rel="noreferrer" className="hover:text-white">Pokémon TCG Data</a></p>
		</article>
	);
}

export default function Page(props: Props) {
	return <LoadingBoundary fallback={<PageSkeleton variant="pokemon" />}><PokemonProfile {...props} /></LoadingBoundary>;
}
