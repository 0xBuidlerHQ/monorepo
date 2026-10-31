"use client";

import { links } from "@/config/links";
import { messages } from "@/lib/messages";
import { useLocale } from "./locale-provider";

const icons = {
	youtube:
		"M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
	x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z",
	github:
		"M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.725-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.922.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z",
};

const names = {
	x: "X",
	github: "GitHub",
	spotify: "Spotify",
	youtube: "YouTube",
};

const cardStyles = {
	x: "hover:border-foreground/30 hover:bg-foreground/[0.06]",
	github:
		"hover:border-violet-500/30 hover:bg-violet-500/[0.06] [&>svg:first-child]:text-violet-500",
	spotify:
		"hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] [&>svg:first-child]:text-emerald-500",
	youtube:
		"hover:border-red-500/30 hover:bg-red-500/[0.06] [&>svg:first-child]:text-red-500",
};

export function SocialLinks({ showLabels = false }: { showLabels?: boolean }) {
	const t = messages[useLocale()];
	const labels = {
		x: t.xLabel,
		github: t.githubLabel,
		spotify: t.spotifyLabel,
		youtube: t.youtubeLabel,
	};
	return (
		<div
			className={
				showLabels
					? "grid grid-cols-2 gap-3 sm:grid-cols-4"
					: "flex items-center gap-3"
			}
		>
			{(["x", "github", "spotify", "youtube"] as const).map((profile) => (
				<a
					key={profile}
					href={links[profile]}
					target="_blank"
					rel="noopener noreferrer"
					className={`inline-flex items-center gap-3 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 ${showLabels ? "group relative aspect-square flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-b from-foreground/[0.04] to-transparent px-4 py-8 text-center text-sm font-medium text-foreground/75 transition-[translate,color,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0" : "p-1"} ${showLabels ? cardStyles[profile] : ""}`}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						className={
							showLabels
								? "absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 shrink-0 transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:size-16"
								: "size-4 shrink-0"
						}
						fill="currentColor"
					>
						{profile === "spotify" ? (
							<>
								<circle cx="12" cy="12" r="12" />
								<path
									d="M 5.5 8.7 Q 12 6.5 18.5 10 M 6.3 12 Q 12 10.1 17.5 13 M 7 15.2 Q 12 13.8 16.5 16"
									fill="none"
									stroke="var(--background)"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
							</>
						) : (
							<path d={icons[profile]} />
						)}
					</svg>
					{showLabels && (
						<>
							<span aria-hidden="true" className="absolute inset-x-4 bottom-3">
								{names[profile]}
							</span>
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="absolute top-4 right-4 size-5 text-foreground/35 transition-[translate,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground/75 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
							>
								<path d="M7 17 17 7M7 7h10v10" />
							</svg>
						</>
					)}
					<span className="sr-only">{labels[profile]}</span>
				</a>
			))}
		</div>
	);
}
