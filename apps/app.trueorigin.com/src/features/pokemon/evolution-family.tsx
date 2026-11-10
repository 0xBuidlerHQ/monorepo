import { ContentSurface } from "@/features/shell/content-surface";
import { RevealImage as Image } from "@/components/ui/reveal-image";
import Link from "next/link";
import { getEvolutionRelations, getEvolutionRoot } from "./evolutions";
import { pokemonArtwork } from "./artwork";

function EvolutionBranch({ id, name, selected }: { id: number; name: string; selected: number }) {
	const { children } = getEvolutionRelations(id);
	return (
		<li className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
			<Link href={`/explore/pokemon/${id}`} aria-current={id === selected ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-2xl border p-3 pr-5 transition-colors ${id === selected ? "border-white/35 bg-white/10" : "border-white/10 bg-white/[0.02] hover:bg-white/5"}`}>
				{pokemonArtwork[id] && <Image src={pokemonArtwork[id]} alt="" width={56} height={56} className="size-14 object-contain" />}
				<div><p className="font-mono text-[10px] text-white/40">#{String(id).padStart(4, "0")}</p><p className="mt-1 text-sm">{name}</p></div>
			</Link>
			{children.length > 0 && <>
				<span aria-hidden="true" className="ml-5 text-white/30 sm:ml-0">→</span>
				<ul aria-label={`${name} evolves into`} className="flex flex-col gap-3 border-l border-white/10 pl-5 sm:border-0 sm:pl-0">{children.map((child) => <EvolutionBranch key={child.id} id={child.id} name={child.name} selected={selected} />)}</ul>
			</>}
		</li>
	);
}

export function EvolutionFamily({ pokemonId }: { pokemonId: number }) {
	const root = getEvolutionRoot(pokemonId);
	if (!root) return null;
	const hasFamily = getEvolutionRelations(root.id).children.length > 0;
	return <ContentSurface as="section" aria-labelledby="evolution-family-title" className="rounded-3xl bg-[#181818] p-5 sm:p-7">
		<h2 id="evolution-family-title" className="mb-5 text-xl font-medium tracking-tight">Evolution family</h2>
		{!hasFamily && <p className="mb-4 text-sm text-white/45">No known evolutions.</p>}
		<div className="overflow-x-auto pb-2"><ul><EvolutionBranch id={root.id} name={root.name} selected={pokemonId} /></ul></div>
	</ContentSurface>;
}
