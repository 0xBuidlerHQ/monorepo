import { blo } from "blo";
import Image from "next/image";

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
