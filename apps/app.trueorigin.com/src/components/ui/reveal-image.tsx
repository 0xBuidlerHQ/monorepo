"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function RevealImage({ src, className = "", ...props }: Omit<ImageProps, "onLoad" | "placeholder">) {
	const [loadedSource, setLoadedSource] = useState<ImageProps["src"] | null>(null);
	const loaded = loadedSource === src;
	return <Image {...props} src={src} onLoad={() => setLoadedSource(src)} className={`${className} transition-opacity duration-500 ease-out motion-reduce:transition-none`} style={{ ...props.style, opacity: loaded ? props.style?.opacity : 0, transitionProperty: "opacity, transform, filter" }} />;
}
