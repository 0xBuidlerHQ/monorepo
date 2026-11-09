import { ContentSurface } from "@/features/shell/content-surface";
import { ExploreCard } from "@/features/reference/explore-card";
import { ExploreHero } from "@/features/reference/explore-hero";

export const metadata = { title: "Explore" };

export default function ExplorePage() {
	return (
		<section aria-labelledby="explore-title">
			<ExploreHero />
			<ContentSurface className="mb-7 mt-10 flex flex-wrap items-end justify-between gap-4 sm:mt-12">
				<div>
					<p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">The catalog</p>
					<h2 className="text-3xl font-medium tracking-[-0.045em] sm:text-4xl">Find your next obsession.</h2>
				</div>
				<p className="max-w-64 text-sm leading-6 text-white/45">Objects worth knowing. Start with a category and follow your curiosity.</p>
			</ContentSurface>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{[
					{ name: "Pokémon", brand: "The Pokémon Company", href: "/explore/pokemon", image: "/pika.png", alt: "Pikachu" },
				].map((game) => (
					<ExploreCard key={game.name} {...game} />
				))}
			</div>
		</section>
	);
}
