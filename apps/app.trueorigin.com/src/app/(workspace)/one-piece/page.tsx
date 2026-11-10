import { UniverseTitle } from "@/features/reference/universe-title";
import { RevealImage as Image } from "@/components/ui/reveal-image";

export const metadata = { title: "One Piece" };

export default function Page() {
	return (
		<section aria-labelledby="one-piece-title">
			<UniverseTitle name="One Piece" titleId="one-piece-title">
				<Image src="/onepiece.png" alt="One Piece" width={120} height={120} className="size-[clamp(48px,9vw,120px)] shrink-0 object-contain" />
			</UniverseTitle>
			<p className="mt-10 max-w-md text-sm leading-6 text-white/45">The One Piece catalog is coming later.</p>
		</section>
	);
}
