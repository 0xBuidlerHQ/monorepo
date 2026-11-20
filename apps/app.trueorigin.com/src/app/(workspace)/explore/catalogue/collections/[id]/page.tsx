import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { SetHeader } from "@/features/reference/set-header";
import { PageSkeleton } from "@/features/shell/loading-skeleton";
import Link from "next/link";
import { setArtwork } from "@/features/reference/set-artwork";
import { notFound, redirect } from "next/navigation";
import { findReferenceSet, searchReferenceCards, getReferenceSets } from "@/features/reference/catalog";
import { cardCollectionId, cardPageHref } from "@/features/reference/set-relationships";
import { ExploreCard } from "@/features/reference/explore-card";
import { getCardArtwork } from "@/features/reference/card-artwork";
import { SetChecklist } from "@/features/pokemon/set-checklist";

export async function generateMetadata({ params }: Props) {
	const set = findReferenceSet((await params).id, catalogLanguage(undefined));
	return { title: (await params).id === "misc" ? "Misc · Pokémon Cards" : set ? `${set.name} · Pokémon` : "Collection not found" };
}
export function generateStaticParams() { return [{ id: "base-set" }]; }
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function SetProfile(props: Props) {
	const { id } = await props.params;
	if (id === "me55c") {
		const params = await props.searchParams;
		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) if (typeof value === "string" && key !== "page") query.set(key, value);
		query.set("section", "classic");
		redirect(`/explore/catalogue/collections/me55?${query.toString()}`);
	}
	const language = catalogLanguage(undefined);
    if (id === "misc") {
        const sets = getReferenceSets(language);
        const cards = searchReferenceCards("", { language }).filter(card => cardCollectionId(card.setId, sets) === "misc");
        return <article><SetHeader name="Misc" /><p className="mt-5 text-sm text-white/45">Cards without a named set or collection.</p>{cards.length ? <ul id="checklist" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{cards.map(card => <li key={card.id}><ExploreCard name={card.name} brand="Misc" href={catalogHref(cardPageHref(card), language)} alt={card.name} image={getCardArtwork(card.id, language)?.src} imageLayout="portrait" /></li>)}</ul> : <p id="checklist" className="mt-10 rounded-2xl bg-white/[0.03] px-6 py-12 text-sm text-white/40">No cards have been added here yet.</p>}<Link className="mt-8 inline-block text-sm text-white/55 hover:text-white" href={catalogHref("/explore/pokemon", language)}>← Browse card collections</Link></article>;
    }
	const set = findReferenceSet(id, language);
	if (!set) notFound();
	const mainCards = searchReferenceCards("", { setId: set.id, language });
	const classicCards = set.id === "me55" ? searchReferenceCards("", { setId: "me55c", language }) : [];
	const allCards = [...mainCards, ...classicCards];
	const sections = set.id === "me55" ? [
		{ id: "main", name: "Main Set", setId: "me55", printedTotal: set.printedTotal },
		{ id: "classic", name: "Classic Collection", setId: "me55c", printedTotal: null },
	] : undefined;

	return (
		<article aria-labelledby="set-title">
			<SetHeader name={set.name} logo={setArtwork[set.id]?.src} releaseDate={set.releaseDate} series={set.series} language={language === "fr" ? "Français" : "English"} cardCount={allCards.length} />

				<SetChecklist set={set} cards={allCards} sections={sections} />
			<footer className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6"><Link href={catalogHref("/explore/pokemon", language)} className="text-sm text-white/55 hover:text-white">← Browse card collections</Link></footer>
		</article>
	);
}

export default function Page(props: Props) {
	return <LoadingBoundary fallback={<PageSkeleton variant="set" />}><SetProfile {...props} /></LoadingBoundary>;
}
