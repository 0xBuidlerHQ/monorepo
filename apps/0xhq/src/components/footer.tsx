"use client";

import { links } from "@/config/links";
import { messages } from "@/lib/messages";
import { useLocale } from "./locale-provider";
import { PageContainer } from "./page-container";

const icons = {
	x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z",
	github:
		"M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.725-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.922.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z",
};

export function Footer() {
	const t = messages[useLocale()];
	const labels = {
		x: t.xLabel,
		github: t.githubLabel,
		spotify: t.spotifyLabel,
	};
	return (
		<footer className="shrink-0 border-t border-foreground/10">
			<PageContainer className="flex items-center justify-between py-6 font-mono text-xs text-foreground/60">
				<div className="flex items-center gap-3">
					{(["x", "github", "spotify"] as const).map((profile) => (
						<a
							key={profile}
							href={links[profile]}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex p-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
						>
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								className="size-4"
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
							<span className="sr-only">{labels[profile]}</span>
						</a>
					))}
				</div>
				<span>2026</span>
			</PageContainer>
		</footer>
	);
}
