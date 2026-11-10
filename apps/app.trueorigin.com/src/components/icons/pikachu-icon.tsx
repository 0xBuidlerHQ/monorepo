import { RevealImage as Image } from "@/components/ui/reveal-image";

export function PikachuIcon({ className }: { className?: string }) {
	return (
		<Image
			src="/pika.png"
			alt=""
			width={48}
			height={48}
			className={className}
		/>
	);
}
