import { UniverseTitle } from "@/features/reference/universe-title";
import Image from "next/image";
import yugiohImage from "../../../../public/yugioh.png";

export const metadata = { title: "Yu-Gi-Oh!" };

export default function Page() {
	return (
		<section aria-labelledby="yugioh-title">
			<UniverseTitle name="Yu-Gi-Oh!" titleId="yugioh-title">
				<Image src={yugiohImage} alt="Yu-Gi-Oh!" width={120} height={120} className="size-[clamp(48px,9vw,120px)] shrink-0 object-contain" />
			</UniverseTitle>
			<p className="mt-10 max-w-md text-sm leading-6 text-white/45">The Yu-Gi-Oh! catalog is coming later.</p>
		</section>
	);
}
