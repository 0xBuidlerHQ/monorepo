import { LoadingBoundary } from "@/features/shell/loading-boundary";
import { catalogHref, catalogLanguage } from "@/features/reference/catalog-language";
import { SetHeader } from "@/features/reference/set-header";
import { CatalogSkeleton, PageSkeleton } from "@/features/shell/loading-skeleton";
import Link from "next/link";
import { setArtwork } from "@/features/reference/set-artwork";
import { notFound, redirect } from "next/navigation";
import { findReferenceSet, searchReferenceCards } from "@/features/reference/catalog";
import { SetChecklist } from "@/features/pokemon/set-checklist";

export async function generateMetadata({ params, searchParams }: Props) {
	const set = findReferenceSet((await params).id, catalogLanguage((await searchParams).lang));
	return { title: set ? `${set.name} · Pokémon` : "Set not found" };
}
export function generateStaticParams() { return [{ id: "base1" }]; }
type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

function releaseDate(value: string | null) {
	if (!value) return "Not recorded";
	const [year, month, day] = value.split(/[/-]/).map(Number);
	if (!year || !month || !day) return value;
	return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

async function SetProfile(props: Props) {
	const { id } = await props.params;
	if (id === "me55c") {
		const params = await props.searchParams;
		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) if (typeof value === "string" && key !== "page") query.set(key, value);
		query.set("section", "classic");
		redirect(`/explore/sets/me55?${query.toString()}`);
	}
	const language = catalogLanguage((await props.searchParams).lang);
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
			<nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/45">
				<Link href="/explore" className="hover:text-white">Explore</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon", language)} className="hover:text-white">Pokémon</Link><span aria-hidden="true">/</span>
				<Link href={catalogHref("/explore/pokemon?category=sets", language)} className="hover:text-white">Sets</Link><span aria-hidden="true">/</span>
				<span aria-current="page" className="text-white/80">{set.name}</span>
			</nav>
			<SetHeader name={set.name} logo={setArtwork[set.id]?.src} facts={[
				{ label: "Released", value: releaseDate(set.releaseDate) },
				{ label: "Series", value: set.series },
				{ label: "Language", value: language === "fr" ? "Français" : "English" },
			]} />

			<LoadingBoundary fallback={<CatalogSkeleton variant="checklist" />}>
				<SetChecklist set={set} cards={allCards} sections={sections} />
			</LoadingBoundary>
			<footer className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6"><Link href={catalogHref("/explore/pokemon?category=sets", language)} className="text-sm text-white/55 hover:text-white">← Browse all sets</Link><a href={language === "fr" ? "https://tcgdex.dev/" : "https://github.com/PokemonTCG/pokemon-tcg-data"} target="_blank" rel="noreferrer" className="text-[10px] text-white/30 hover:text-white">Reference data: {language === "fr" ? "TCGdex" : "Pokémon TCG Data"} ↗</a></footer>
		</article>
	);
}

export default function Page(props: Props) {
	return <LoadingBoundary fallback={<PageSkeleton variant="set" />}><SetProfile {...props} /></LoadingBoundary>;
}
