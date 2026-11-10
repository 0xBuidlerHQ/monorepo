import { blo } from "blo";
import { RevealImage as Image } from "@/components/ui/reveal-image";

export function AccountIcon({
	address,
	size = 24,
}: {
	address: `0x${string}`;
	size?: number;
}) {
	return (
		<Image
			src={blo(address)}
			alt=""
			width={size}
			height={size}
			unoptimized
			className="shrink-0"
		/>
	);
}
