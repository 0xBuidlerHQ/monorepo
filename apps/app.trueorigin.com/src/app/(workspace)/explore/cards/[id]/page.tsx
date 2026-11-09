import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { catalogHref, catalogLanguage, type CatalogLanguage } from "@/features/reference/catalog-language";
import { CatalogLanguageSelector } from "@/features/reference/catalog-language-selector";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import { ContentSurface } from "@/features/shell/content-surface";
import { formatCardNumber } from "@/features/reference/card-number";
import { setPageHref } from "@/features/reference/set-relationships";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { gradedItems } from "@/features/items/catalog";
import { CardArtworkViewer } from "@/features/reference/card-artwork-viewer";
import { pokemonArtwork } from "@/features/pokemon/artwork";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { setArtwork } from "@/features/reference/set-artwork";
import { findPokemon, findReferenceCard, findReferenceSet, searchReferenceCards, type ReferenceCard } from "@/features/reference/catalog";
import { ExploreCard } from "@/features/reference/explore-card";

export async function generateMetadata({ params, searchParams }: Props) {
	const language = catalogLanguage((await searchParams).lang);
	const card = findReferenceCard((await params).id, language);
	const set = card ? findReferenceSet(card.setId, language) : undefined;
	return { title: card ? `${card.name} · ${set?.name ?? "Pokémon"} #${card.number}` : "Card not found" };
}
export function generateStaticParams() { return [{ id: "base1-4" }]; }
type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }> };

function RelatedCards({ cards, language }: { cards: ReferenceCard[]; language: CatalogLanguage }) {
	return <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{cards.map((card) => {
		const set = findReferenceSet(card.setId, language);
		return <li key={card.id}><ExploreCard name={card.name} brand={set?.name ?? "Pokémon TCG"} href={catalogHref(`/explore/cards/${card.id}`, language)} alt={card.name} image={getCardArtwork(card.id, language)?.src} imageLayout="portrait" placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} description={`${formatCardNumber(card, set?.printedTotal)} · ${card.rarity ?? card.supertype}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" /></li>;
	})}</ul>;
}

async function CardProfile({ params, searchParams }: Props) {
	const language = catalogLanguage((await searchParams).lang);
	const card = findReferenceCard((await params).id, language);
	if (!card) notFound();
	const set = findReferenceSet(card.setId, language);
	if (!set) notFound();
	const image = getCardArtwork(card.id, language);
	const artworkProvider = image?.source.includes("tradon.fr") ? { name: "Tradon", url: `https://tradon.fr/cards/me055-mew-${card.number.toLowerCase()}-fr` } : image?.source.includes("scrydex.com") ? { name: "Scrydex", url: "https://scrydex.com/" } : { name: "TCGdex", url: "https://tcgdex.dev/" };
	const logo = setArtwork[set.id];
	const number = formatCardNumber(card, set.printedTotal);
	const pokemon = card.pokemonIds.flatMap((id) => { const entry = findPokemon(String(id)); return entry ? [entry] : []; });
	const setCards = searchReferenceCards("", { setId: set.id, language }).sort((a, b) => a.number.localeCompare(b.number, "en", { numeric: true }));
	const position = setCards.findIndex((entry) => entry.id === card.id);
	const previous = setCards[position - 1];
	const next = setCards[position + 1];
	const related = card.pokemonIds.length > 0 ? searchReferenceCards("", { pokemonId: card.pokemonIds[0], language }).filter((entry) => entry.id !== card.id).slice(0, 5) : [];
	const moreFromSet = setCards.filter((entry) => entry.id !== card.id).slice(0, 5);
	const previews = gradedItems.filter((item) => item.referenceId === card.id && item.preview);
	const release = set.releaseDate ? (() => { const [year, month, day] = set.releaseDate.split(/[/-]/).map(Number); return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day))); })() : null;
	const details = [
		{ label: "Card number", value: number },
		{ label: "Rarity", value: card.rarity },
		{ label: "Illustrator", value: card.artist },
		{ label: "Language", value: language === "fr" ? "Français" : "English" },
		{ label: "Card type", value: card.supertype },
		{ label: "Subtype", value: card.subtypes.join(" · ") },
		{ label: "Energy type", value: card.types.join(" · ") },
		{ label: "HP", value: card.hp },
		{ label: "Evolves from", value: card.evolvesFrom },
		{ label: "Release date", value: release },
	].filter((attribute) => attribute.value);
	return (
		<article aria-labelledby="card-title">
			<nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/45">
				<Link href="/explore" className="hover:text-white">Explore</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon", language)} className="hover:text-white">Pokémon</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon?category=cards", language)} className="hover:text-white">Cards</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref(setPageHref(set.id), language)} className="hover:text-white">{set.name}</Link><span aria-hidden="true">/</span>
				<span aria-current="page" className="text-white/80">{card.name}</span>
			</nav>
			<div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
				<div className="lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
					{image ? <CardArtworkViewer src={image.src} name={card.name} number={number} /> : <div className="flex aspect-[600/825] flex-col items-center justify-center gap-5 rounded-[28px] bg-[#1c1c1c] text-white/25"><span className="[&>svg]:size-20"><CatalogCategoryIcon category="cards" /></span><p className="text-xs">Artwork not available yet</p></div>}
				</div>
				<ContentSurface className="min-w-0 py-2">
					<header>
						<CatalogLanguageSelector />
						<div className="flex flex-wrap items-center gap-3 text-xs text-white/45"><Link href={catalogHref(setPageHref(set.id), language)} className="hover:text-white">{set.name}</Link><span className="text-white/20">/</span><span className="font-mono">#{number}</span></div>
						<h1 id="card-title" className="mt-5 break-words text-[clamp(44px,5.5vw,88px)] font-medium leading-none tracking-[-0.065em]">{card.name}</h1>
						<div className="mt-5 flex flex-wrap items-center gap-2">{[card.rarity, card.supertype, ...card.types].filter((value): value is string => !!value).map((value) => <span key={value} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/65">{value}</span>)}</div>
					</header>
					<Link href={catalogHref(setPageHref(set.id), language)} className="mt-8 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.07]">
						{logo && <Image src={logo.src} alt="" width={88} height={56} className="h-14 w-22 shrink-0 object-contain" />}
						<div className="min-w-0"><p className="text-[11px] text-white/40">{set.series}</p><p className="mt-1 text-base font-medium">{set.name}</p></div><span aria-hidden="true" className="ml-auto text-white/40">↗</span>
					</Link>
					<section aria-labelledby="card-information-title" className="mt-8">
						<h2 id="card-information-title" className="text-xs font-medium text-white/40">The details</h2>
						<dl className="mt-4 grid grid-cols-2 gap-x-6">{details.map((detail) => <div key={detail.label} className="border-b border-white/[0.07] py-3.5"><dt className="text-[11px] text-white/40">{detail.label}</dt><dd className={`mt-1.5 text-sm text-white/80 ${detail.label === "Card number" ? "font-mono" : ""}`}>{detail.value}</dd></div>)}</dl>
					</section>
					{pokemon.length > 0 && <nav aria-label="Featured Pokémon" className="mt-7 flex flex-wrap gap-3">{pokemon.map((entry) => <Link key={entry.id} href={catalogHref(`/explore/pokemon/${entry.id}`, language)} className="flex items-center gap-3 rounded-2xl bg-white/[0.035] px-4 py-3 transition-colors hover:bg-white/[0.07]">
						{pokemonArtwork[entry.id] && <Image src={pokemonArtwork[entry.id]} alt="" width={40} height={40} className="size-10 object-contain" />}
						<div><p className="text-[10px] text-white/35">Meet the Pokémon</p><p className="mt-0.5 text-sm text-white/80">{entry.name}</p></div><span aria-hidden="true" className="ml-3 text-white/35">↗</span>
					</Link>)}</nav>}
				</ContentSurface>
			</div>
			<ContentSurface as="section" aria-labelledby="ownership-title" className="mt-12 rounded-[28px] bg-[#1b1b1b] p-6 sm:p-8">
				<div className="mb-6 flex items-center gap-3"><span className="size-1.5 rounded-full bg-white/25" /><h2 id="ownership-title" className="text-xs text-white/45">This card on TrueOrigins</h2></div>
				<div className="grid gap-8 md:grid-cols-2 md:gap-12">
					<section aria-labelledby="market-title">
						<div className="flex items-center gap-3"><h3 id="market-title" className="text-lg font-medium tracking-tight">Market</h3><span className="rounded-full bg-white/5 px-2.5 py-1 text-[9px] text-white/35">Coming soon</span></div>
						<p className="mt-3 max-w-md text-sm leading-6 text-white/45">Prices by edition, finish, and condition will appear here once market data is connected.</p>
						<Link href="/trading" className="mt-4 inline-block text-xs text-white/65 hover:text-white">Explore trading <span aria-hidden="true" className="ml-2">↗</span></Link>
					</section>
					<section aria-labelledby="copies-title">
						<div className="flex items-center gap-3"><h3 id="copies-title" className="text-lg font-medium tracking-tight">Registered copies</h3><span className="font-mono text-xs text-white/30">0</span></div>
						<p className="mt-3 max-w-md text-sm leading-6 text-white/45">No copies registered yet. Each will have its own photos, authentication record, and ownership history.</p>
						{previews.map((item) => <Link key={item.id} href={`/items/${item.id}`} className="mt-4 inline-block text-xs text-white/65 hover:text-white">Example passport · Preview only <span aria-hidden="true" className="ml-2">↗</span></Link>)}
					</section>
				</div>
			</ContentSurface>
			{related.length > 0 && <section aria-labelledby="related-title" className="mt-12"><header className="mb-5 flex flex-wrap items-end justify-between gap-4"><h2 id="related-title" className="text-2xl font-medium tracking-[-0.04em]">More {pokemon[0]?.name ?? card.name} cards</h2>{pokemon[0] && <Link href={catalogHref(`/explore/pokemon/${pokemon[0].id}#pokemon-cards`, language)} className="text-xs text-white/45 hover:text-white">View all ↗</Link>}</header><RelatedCards cards={related} language={language} /></section>}
			{moreFromSet.length > 0 && <section aria-labelledby="set-cards-title" className="mt-12"><header className="mb-5 flex flex-wrap items-end justify-between gap-4"><h2 id="set-cards-title" className="text-2xl font-medium tracking-[-0.04em]">More from {set.name}</h2><Link href={catalogHref(`${setPageHref(set.id)}#checklist`, language)} className="text-xs text-white/45 hover:text-white">View the set ↗</Link></header><RelatedCards cards={moreFromSet} language={language} /></section>}
			<nav aria-label="Previous and next cards in this set" className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
				<div>{previous && <Link href={catalogHref(`/explore/cards/${previous.id}`, language)} className="text-sm text-white/65 hover:text-white"><span className="mb-2 block text-xs text-white/30">← Previous in {set.name}</span>{previous.name} <span className="ml-2 font-mono text-xs text-white/35">#{previous.number}</span></Link>}</div>
				<div className="text-right">{next && <Link href={catalogHref(`/explore/cards/${next.id}`, language)} className="text-sm text-white/65 hover:text-white"><span className="mb-2 block text-xs text-white/30">Next in {set.name} →</span>{next.name} <span className="ml-2 font-mono text-xs text-white/35">#{next.number}</span></Link>}</div>
			</nav>
			<p className="mt-8 text-[10px] text-white/30">Card data: <a href={language === "fr" ? "https://tcgdex.dev/" : "https://github.com/PokemonTCG/pokemon-tcg-data"} target="_blank" rel="noreferrer" className="hover:text-white">{language === "fr" ? "TCGdex" : "Pokémon TCG Data"}</a>{image && <> · Artwork: <a href={artworkProvider.url} target="_blank" rel="noreferrer" className="hover:text-white">{artworkProvider.name}</a></>}</p>
		</article>
	);
}

export default function Page(props: Props) {
	return <LoadingBoundary fallback={<PageSkeleton variant="card" />}><CardProfile {...props} /></LoadingBoundary>;
}
