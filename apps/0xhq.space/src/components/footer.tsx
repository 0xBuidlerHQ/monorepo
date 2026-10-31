"use client";

import { PageContainer } from "./page-container";
import { SocialLinks } from "./social-links";

export function Footer() {
	return (
		<footer className="shrink-0 border-t border-foreground/10">
			<PageContainer className="flex items-center justify-between py-6 font-mono text-xs text-foreground/60">
				<SocialLinks />
				<span>2026</span>
			</PageContainer>
		</footer>
	);
}
