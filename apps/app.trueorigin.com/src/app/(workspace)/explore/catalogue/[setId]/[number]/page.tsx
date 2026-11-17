import { Suspense } from "react";
import { PrintingCardsSkeleton } from "@/features/pokemon/printing-cards-skeleton";
import { cardDetailGrid } from "@/features/shell/detail-layout";
import { getCardPrintings } from "@/features/pokemon/card-printings";
import { CardPrintingSelector } from "@/features/pokemon/card-printing-selector";
import { cardPageHref } from "@/features/reference/set-relationships";
import { RaritySymbol } from "@/features/pokemon/rarity-symbol";
import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { catalogHref, catalogLanguage, type CatalogLanguage } from "@/features/reference/catalog-language";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import { ContentSurface } from "@/features/shell/content-surface";
import { formatCardNumber } from "@/features/reference/card-number";
import { RevealImage as Image } from "@/components/ui/reveal-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { CardArtworkViewer } from "@/features/reference/card-artwork-viewer";
import { pokemonArtwork } from "@/features/pokemon/artwork";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { findPokemon, findReferenceCardByNumber, findReferenceSet, referenceCards, searchReferenceCards, type ReferenceCard } from "@/features/reference/catalog";
import { ExploreCard } from "@/features/reference/explore-card";

export async function generateMetadata({ params }: Props) {
	const language = catalogLanguage(undefined);
	const { setId, number: cardNumber } = await params;
	const card = findReferenceCardByNumber(setId, cardNumber, language);
	const set = card ? findReferenceSet(card.setId, language) : undefined;
	return { title: card ? `${card.name} · ${set?.name ?? "Pokémon"} #${card.number}` : "Card not found" };
}
export function generateStaticParams() { return referenceCards.map(card => ({setId:card.setId,number:card.number})); }
type Props = { params: Promise<{ setId: string; number: string }>; searchParams: Promise<{ lang?: string; printing?: string }> };

function RelatedCards({ cards, language }: { cards: ReferenceCard[]; language: CatalogLanguage }) {
	return <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{cards.map((card) => {
		const set = findReferenceSet(card.setId, language);
		return <li key={card.id}><ExploreCard name={card.name} brand={set?.name ?? "Pokémon TCG"} href={catalogHref(cardPageHref(card), language)} alt={card.name} image={getCardArtwork(card.id, language)?.src} imageLayout="portrait" placeholder={<span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category="cards" /></span>} description={`${formatCardNumber(card, set?.printedTotal)} · ${card.rarity ?? card.supertype}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" /></li>;
	})}</ul>;
}

async function CardProfile({ params }: Props) {
	const language = catalogLanguage(undefined);
	const { setId, number: cardNumber } = await params;
	const card = findReferenceCardByNumber(setId, cardNumber, language);
	if (!card) notFound();
	const knownSet = findReferenceSet(card.setId, language);
	const set = knownSet ?? { id: "misc", name: "Misc", series: "Other cards", printedTotal: 0, releaseDate: null };
	const image = getCardArtwork(card.id, language);
	const printings = getCardPrintings(card.setId, card.number, language);
	const number = formatCardNumber(card, set.printedTotal);
	const pokemon = card.pokemonIds.flatMap((id) => { const entry = findPokemon(String(id)); return entry ? [entry] : []; });
	const related = card.pokemonIds.length > 0 ? searchReferenceCards("", { pokemonId: card.pokemonIds[0], language }).filter((entry) => entry.id !== card.id).slice(0, 5) : [];
	const release = set.releaseDate ? (() => { const [year, month, day] = set.releaseDate.split(/[/-]/).map(Number); return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day))); })() : null;
	const details = [
		{ label: "Card number", value: number },
		{ label: "Rarity", value: card.rarity },
		{ label: "Illustrator", value: card.artist },
		{ label: "Language", value: language === "fr" ? "Français" : "English" },
		{ label: "Card type", value: card.supertype },
		{ label: "Subtype", value: card.subtypes.join(" · ") },
		{ label: "Energy type", value: card.types.join(" · ") },
		{ label: "Release date", value: release },
	].filter((attribute) => attribute.value);
	return (
		<article aria-labelledby="card-title">
			<div className={cardDetailGrid}>
				<div className="lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
					{image ? <CardArtworkViewer src={image.src} name={card.name} number={number} /> : <div className="flex aspect-[600/825] flex-col items-center justify-center gap-5 rounded-[28px] bg-[#1c1c1c] text-white/25"><span className="[&>svg]:size-20"><CatalogCategoryIcon category="cards" /></span><p className="text-xs">Artwork not available yet</p></div>}
				</div>
                <ContentSurface className="min-w-0 lg:py-3">
                    <header>
                        <div className="flex items-center justify-between gap-4">
                            <h1 id="card-title" className="min-w-0 break-words font-serif text-[clamp(56px,7vw,112px)] font-normal leading-[0.95] tracking-[-0.055em]">{card.name}</h1>
                            {pokemon[0] && pokemonArtwork[pokemon[0].id] && <Link href={catalogHref(`/explore/pokemon/${pokemon[0].id}`, language)} aria-label={`View ${pokemon[0].name} in the Pokédex`} className="shrink-0"><Image src={pokemonArtwork[pokemon[0].id]} alt="" width={96} height={96} className="size-16 object-contain sm:size-24" /></Link>}
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                            {card.types.map(type => <span key={type} className="inline-flex items-center gap-2.5 text-sm text-white/85"><Image src={`/images/tcg-types/${type.toLowerCase()}.png`} alt="" width={32} height={32} className="size-8 object-contain" />{type}</span>)}
                            {card.rarity && <span className="inline-flex items-center gap-2.5 text-sm text-white/85"><span className="inline-flex items-center text-white [&>svg]:size-6"><RaritySymbol rarity={card.rarity} /></span>{card.rarity}</span>}
                        </div>
                    </header>
                    <section aria-labelledby="card-information-title" className="mt-8">
                        <h2 id="card-information-title" className="sr-only">Card details</h2>
                        <dl className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/45">
                            {details.filter(detail => !["Rarity", "Card type", "Subtype", "Energy type", "HP"].includes(detail.label)).sort((a, b) => ["Release date", "Illustrator", "Evolves from", "Card number", "Language"].indexOf(a.label) - ["Release date", "Illustrator", "Evolves from", "Card number", "Language"].indexOf(b.label)).map((detail, index) => <div key={detail.label} className="inline-flex items-center gap-3">
                                {index > 0 && <span aria-hidden="true" className="text-white/20">·</span>}
                                <dt className="sr-only">{detail.label}</dt><dd>{detail.value}</dd>
                            </div>)}
                        </dl>
                    </section>
                    {printings.length > 0 && <Suspense fallback={<PrintingCardsSkeleton count={printings.length} />}><CardPrintingSelector printings={printings} image={image?.src} cardName={card.name} types={card.types} number={number} /></Suspense>}
            {pokemon.length > 0 && <section aria-labelledby="related-title" className="mt-7 border-t border-white/[0.08] pt-6">
                <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <h2 id="related-title" className="text-xs text-white/65">Other cards</h2>
                    {related.length > 0 && <Link href={catalogHref(`/explore/pokemon/${pokemon[0].id}#pokemon-cards`, language)} className="text-xs text-white/45 hover:text-white">View all ↗</Link>}
                </header>
                {related.length > 0 && <RelatedCards cards={related} language={language} />}
            </section>}
                    {pokemon.length > 0 && <section aria-label="Pokédex and evolutions" className="mt-9 border-t border-white/[0.08] pt-6">
                        {pokemon.map(entry => {
                            const stages = [
                                { pokemon: entry, label: "Pokédex" },
                            ];
                            return <nav key={entry.id} aria-label={`${entry.name} evolution stages`} className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                                {stages.map(stage => <div key={stage.pokemon.id} className="min-w-0">
                                    <p className="mb-4 text-xs text-white/65">{stage.label}</p>
                                    <ExploreCard name={stage.pokemon.name} brand={`#${String(stage.pokemon.id).padStart(4, "0")}`} brandMono href={catalogHref(`/explore/pokemon/${stage.pokemon.id}`, language)} image={pokemonArtwork[stage.pokemon.id]} alt={stage.pokemon.name} sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 24vw, 50vw" />
                                </div>)}
                            </nav>;
                        })}
                    </section>}


                </ContentSurface>
			</div>




		</article>
	);
}

export default function Page(props: Props) {
	return <LoadingBoundary fallback={<PageSkeleton variant="card" />}><CardProfile {...props} /></LoadingBoundary>;
}
