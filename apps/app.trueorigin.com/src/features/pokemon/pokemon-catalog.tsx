import { CardCategoryNavigation } from "./card-category-navigation";
import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { ContentSurface } from "@/features/shell/content-surface";
import { formatCardNumber } from "@/features/reference/card-number";
import { setPageHref } from "@/features/reference/set-relationships";
import Link from "next/link";
import { cardCategories } from "./card-categories";
import { pokemonCategories as categories } from "./categories";
import { Pokedex } from "./pokedex";
import { setArtwork } from "@/features/reference/set-artwork";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { ExploreCard } from "@/features/reference/explore-card";
import { CatalogCategoryIcon } from "@/components/icons/catalog-category-icon";
import { CatalogToolbar } from "./catalog-toolbar";
import { findReferenceSet, normalizeSearch, paginate, getReferenceSets, searchReferenceCards } from "@/features/reference/catalog";


const upcoming: Record<string, { description: string; examples: string[] }> = {
	sealed: { description: "Explore Pokémon products in their original packaging.", examples: ["Booster packs", "Booster boxes", "Elite Trainer Boxes", "Collection boxes"] },
	"video-games": { description: "Explore the games, editions, and hardware of the Pokémon universe.", examples: ["Game releases", "Special editions", "Consoles"] },
	merchandise: { description: "Explore Pokémon beyond the cards and games.", examples: ["Figures", "Plushes", "Special releases"] },
};
type Params = { lang?: string; mode?: string; subcategory?: string; category?: string; q?: string; page?: string };
const path = "/explore/pokemon";

export async function PokemonCatalog({ searchParams }: { searchParams: Promise<Params> }) {
	const params = await searchParams;
	const language = catalogLanguage(params.lang);
	const referenceSets = getReferenceSets(language);
	const category = categories.find((entry) => entry.id === params.category) ?? categories[1];
	const query = typeof params.q === "string" ? params.q : "";
	const pending = upcoming[category.id];
	const cardCategory = cardCategories.find((entry) => entry.id === params.subcategory) ?? cardCategories[0];
	// Only assign catalogs where the source set metadata identifies the category.
	const promoSets = new Set(referenceSets.filter((set) => /black star promos|mcdonald/i.test(set.name)).map((set) => set.id));
	const supported = cardCategory.id === "all" || cardCategory.id === "promos";
	const cards = category.id === "cards" ? paginate(supported ? searchReferenceCards(query, { language }).filter((card) => (cardCategory.id !== "promos" || promoSets.has(card.setId))) : [], params.page) : null;
	const showSets = category.id === "sets";
	const sets = showSets ? referenceSets.filter((set) => set.id !== "me55c" && normalizeSearch(`${set.name} ${set.series}`).includes(normalizeSearch(query))) : [];
	const placeholder = (id: string) => <span className="text-white/[0.06] [&>svg]:size-16"><CatalogCategoryIcon category={id} /></span>;
	return (
		<div>
			<div>
				{category.id === "pokedex" && <Pokedex key={query} initialQuery={query} embedded />}
				{cards && <>
					<CatalogToolbar title="Cards" category="cards" count={cards.total} query={query} subcategory={cardCategory.id}>
						<CardCategoryNavigation active={cardCategory.id} query={query} language={language} />
					</CatalogToolbar>
					<p className="my-6 max-w-2xl text-sm leading-6 text-white/45">{cardCategory.description}</p>
					{(cards.items.length > 0 ? <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
						{cards.items.map((card) => {
							const set = findReferenceSet(card.setId, language);
							return <li key={card.id}><ExploreCard name={card.name} brand={set?.name ?? "Pokémon TCG"} href={catalogHref(`/explore/cards/${card.id}`, language)} alt={card.name} imageLayout="portrait" image={getCardArtwork(card.id, language)?.src} placeholder={placeholder("cards")} description={`${formatCardNumber(card, set?.printedTotal)} · ${card.rarity ?? card.supertype}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />{set && <Link href={catalogHref(setPageHref(set.id), language)} className="mt-3 inline-block px-2 text-xs text-white/45 transition-colors hover:text-white">Browse set ↗<span className="sr-only">: {set.name}</span></Link>}</li>;
						})}
					</ul> : <div className="rounded-3xl bg-[#1c1c1c] px-6 py-16 text-center"><h3 className="text-xl font-medium">{supported ? "No matching cards" : "Nothing here yet"}</h3><p className="mt-3 text-sm text-white/45">{supported ? "Try another search or card category." : "This category’s catalog hasn’t been added yet."}</p></div>)}
					{cards.total > 0 && <nav aria-label="Card pages" className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/45">
						<span>Page {cards.page} of {cards.pages} · {language === "fr" ? "French" : "English"} card references</span>
						<div className="flex gap-3">{[cards.page - 1, cards.page + 1].filter((page) => page >= 1 && page <= cards.pages).map((page) => <Link key={page} href={`${path}?${new URLSearchParams({ lang: language, category: "cards", subcategory: cardCategory.id, q: query, page: String(page) })}`} className="rounded-full border border-white/15 px-5 py-2.5 hover:bg-white/5 hover:text-white">{page < cards.page ? "← Previous" : "Next →"}</Link>)}</div>
					</nav>}
				</>}
				{showSets && <>
					<CatalogToolbar title="Sets" category="sets" count={sets.length} query={query} searchPlaceholder="Search sets or series…" />
					<p className="my-6 text-sm text-white/45">Browse a release to discover its individual cards. {language === "fr" ? "French" : "English"} catalog.</p>
					{sets.length > 0 ? <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
						{sets.map((set) => <li key={set.id}><ExploreCard name={set.name} brand={set.series} href={catalogHref(setPageHref(set.id), language)} alt={set.name} image={setArtwork[set.id]?.src} placeholder={placeholder("sets")} description={`${set.id === "me55" ? "191 cards" : set.printedTotal ? `${set.printedTotal} cards` : "Card count not recorded"}${set.releaseDate ? ` · ${set.releaseDate.slice(0, 4)}` : ""}`} sizes="(min-width: 1024px) 16.67vw, (min-width: 640px) 33vw, 50vw" /></li>)}
					</ul> : <p className="py-16 text-center text-sm text-white/45">No matching sets. Try another search.</p>}
					</>}
				{pending && <>
					<CatalogToolbar title={category.name} category={category.id} count={0}>
						<ul aria-label={`${category.name} categories`} className="flex min-w-max gap-1">{pending.examples.map((example) => <li key={example} className="px-3.5 py-2.5 text-xs text-white/45">{example}</li>)}</ul>
					</CatalogToolbar>
					<p className="my-6 text-sm leading-6 text-white/45">{pending.description}</p>
					<ContentSurface as="section" className="flex min-h-72 flex-col items-center justify-center rounded-[28px] bg-[#1c1c1c] p-8 text-center">
						<span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-white/5 text-white/30 [&>svg]:size-6"><CatalogCategoryIcon category={category.id} /></span>
						<h3 className="text-xl font-medium tracking-tight">More to discover, soon.</h3>
						<p className="mt-3 max-w-sm text-sm leading-6 text-white/45">The {category.name.toLowerCase()} catalog hasn’t been added yet.</p>
					</ContentSurface>
				</>}
			</div>
		</div>
	);
}
