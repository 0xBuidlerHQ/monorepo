import { PageLayout } from "@/features/shell/page-layout";
import { ExploreCard } from "@/features/reference/explore-card";

export const metadata = { title: "Explore" };

export default function ExplorePage() {
	return <PageLayout title="Explore" className="explore-page">
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<ExploreCard expressive name="Pokémon" brand="The Pokémon Company" href="/explore/pokemon" image="/pika.png" alt="Pikachu" />
		</div>
	</PageLayout>;
}
