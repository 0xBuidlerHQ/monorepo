import Image from "next/image";

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
