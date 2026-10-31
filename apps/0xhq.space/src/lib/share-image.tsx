import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ArticleShareCard } from "@/components/article-share-card";
import type { ContentEntry } from "./content";
import { shareImageSize } from "./site";

// Synchronous local font reads keep every image eligible for build-time rendering.
const geistRegular = readFileSync(
	path.join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf"),
);
const geistSemibold = readFileSync(
	path.join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf"),
);
const geistMono = readFileSync(
	path.join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf"),
);

export function createShareImage(entry?: ContentEntry) {
	return new ImageResponse(<ArticleShareCard entry={entry} />, {
		...shareImageSize,
		fonts: [
			{ name: "Geist", data: geistRegular, weight: 400, style: "normal" },
			{ name: "Geist", data: geistSemibold, weight: 600, style: "normal" },
			{ name: "Geist Mono", data: geistMono, weight: 400, style: "normal" },
		],
	});
}
