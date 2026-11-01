"use client";

import Image from "next/image";
import { useState } from "react";
import type { CuratedProduct } from "@/lib/curated";

export function ProductImage({
	image,
	alt,
}: {
	image: CuratedProduct["image"];
	alt: string;
}) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Image
			src={image.src}
			width={image.width}
			height={image.height}
			alt={alt}
			sizes="(min-width: 1024px) 272px, (min-width: 896px) 415px, (min-width: 640px) calc((100vw - 64px) / 2), calc(100vw - 48px)"
			onLoad={() => setLoaded(true)}
			onError={() => setLoaded(true)}
			className={`absolute left-[12%] top-[10%] h-[68%] w-[76%] object-contain transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105 motion-reduce:scale-100 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"} ${image.blendWithBackground ? "mix-blend-multiply" : ""}`}
		/>
	);
}
