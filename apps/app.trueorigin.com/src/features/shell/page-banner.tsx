import { ContentSurface } from "@/features/shell/content-surface";
import Image from "next/image";

export function PageBanner({ title, image, titleId }: { title: string; image: string; titleId: string }) {
	return (
		<ContentSurface as="header" className="relative isolate flex h-40 items-center overflow-hidden rounded-xl bg-[#123c80] sm:h-[300px]">
			<Image src={image} alt="" fill sizes="100vw" preload className="object-cover object-center" />
			<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />
			<h1 id={titleId} className="relative z-10 px-6 text-[clamp(48px,9vw,120px)] font-medium leading-none tracking-[-0.065em] text-white sm:px-10">{title}</h1>
		</ContentSurface>
	);
}
