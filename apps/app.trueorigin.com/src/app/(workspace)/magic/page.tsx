import { UniverseTitle } from "@/features/reference/universe-title";
import { MagicIcon } from "@/components/icons/magic-icon";

export const metadata = { title: "Magic" };

export default function Page() {
	return (
		<section aria-labelledby="magic-title">
			<UniverseTitle name="Magic" titleId="magic-title">
				<MagicIcon className="size-[clamp(48px,9vw,120px)] shrink-0" />
			</UniverseTitle>
			<p className="mt-10 max-w-md text-sm leading-6 text-white/45">The Magic catalog is coming later.</p>
		</section>
	);
}
