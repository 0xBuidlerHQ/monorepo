"use client";

import {
	Branches,
	Drawer,
	Exploded,
	Format,
	Hub,
	Keyboard,
	Laptop,
	Loupe,
	Phosphor,
	Query,
	Rebuild,
	Relay,
	Riffle,
	Stack,
	Terminal,
	Terrain,
} from "@lucasmarkes/hairline/react";
import { usePathname } from "next/navigation";
import { isContentLocale } from "@/lib/locales";
import styles from "./side-drawings.module.css";

const pageDrawings = {
	"/": [Terrain, Exploded],
	"/thoughts": [Keyboard, Terminal],
	"/ideas": [Phosphor, Branches],
	"/learn": [Rebuild, Stack],
	"/curated": [Riffle, Drawer],
	"/content": [Laptop, Format],
	"/glossary": [Loupe, Query],
} as const;

const articleDrawings = [
	Terrain,
	Exploded,
	Keyboard,
	Terminal,
	Phosphor,
	Branches,
	Rebuild,
	Stack,
	Riffle,
	Drawer,
	Laptop,
	Format,
	Loupe,
	Query,
	Hub,
	Relay,
] as const;

export function SideDrawings() {
	const segments = usePathname().split("/").filter(Boolean);
	if (segments[0] && isContentLocale(segments[0])) segments.shift();
	const path = `/${segments.join("/")}`;
	// Translations share artwork; each article gets a stable pair on navigation.
	const hash = Array.from(path).reduce(
		(value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
		0,
	);
	const [Left, Right] = pageDrawings[path as keyof typeof pageDrawings] ?? [
		articleDrawings[hash % articleDrawings.length],
		articleDrawings[
			((hash % articleDrawings.length) +
				1 +
				(Math.floor(hash / articleDrawings.length) %
					(articleDrawings.length - 1))) %
				articleDrawings.length
		],
	];
	return (
		<div className={styles.drawings} aria-hidden="true">
			<div className={`${styles.drawing} ${styles.left}`}>
				<Left key={`${path}-left`} theme="dark" intensity={0.35} play />
			</div>
			<div className={`${styles.drawing} ${styles.right}`}>
				<Right key={`${path}-right`} theme="dark" intensity={0.35} play />
			</div>
		</div>
	);
}
