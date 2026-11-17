"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

export function RevealImage({ src, className = "", ...props }: Omit<ImageProps, "onLoad" | "placeholder">) {
	// Static imports can be re-created during navigation without changing the image.
	const source = typeof src === "string" ? src : "default" in src ? src.default.src : src.src;
	const imageRef = useRef<HTMLImageElement>(null);
	const [loadedSource, setLoadedSource] = useState<string | null>(props.preload ? source : null);
	const loaded = loadedSource === source;

	useLayoutEffect(() => {
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth) setLoadedSource(source);
    }, [source]);

	return <Image {...props} ref={imageRef} src={src} onLoad={() => setLoadedSource(source)} className={`${className} transition-opacity duration-500 ease-out motion-reduce:transition-none`} style={{ ...props.style, opacity: loaded ? props.style?.opacity : 0, transitionProperty: "opacity, transform, filter" }} />;
}
