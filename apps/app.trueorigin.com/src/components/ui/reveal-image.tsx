"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

export function RevealImage({ src, className = "", ...props }: Omit<ImageProps, "onLoad" | "placeholder">) {
	// Static imports can be re-created during navigation without changing the image.
	const source = typeof src === "string" ? src : "default" in src ? src.default.src : src.src;
	const imageRef = useRef<HTMLImageElement>(null);
	const [loadedSource, setLoadedSource] = useState<string | null>(null);
	const loaded = loadedSource === source;

	useEffect(() => {
		const image = imageRef.current;
		if (!image?.complete || !image.naturalWidth) return;
		let active = true;
		// A cached or restored image may not emit another load event.
		void image.decode().catch(() => {}).then(() => {
			if (active && imageRef.current === image) setLoadedSource(source);
		});
		return () => { active = false; };
	}, [source]);

	return <Image {...props} ref={imageRef} src={src} onLoad={() => setLoadedSource(source)} className={`${className} transition-opacity duration-500 ease-out motion-reduce:transition-none`} style={{ ...props.style, opacity: loaded ? props.style?.opacity : 0, transitionProperty: "opacity, transform, filter" }} />;
}
