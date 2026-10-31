import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { HeaderNavigation } from "@/components/header-navigation";
import { PageContainer } from "@/components/page-container";
import { SubscribeButton } from "@/components/subscribe-button";
import { contentLanguageRoutes } from "@/lib/translations";
import "@/app/globals.css";
import type { ReactNode } from "react";
import type { ContentLocale } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { LocaleProvider } from "./locale-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const sourceSerif = Source_Serif_4({
	variable: "--font-source-serif-4",
	subsets: ["latin"],
	style: ["normal", "italic"],
	axes: ["opsz"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
	preload: false,
});

export const metadata: Metadata = {
	title: "0xhq",
	description: "0xhq",
	icons: { icon: { url: "/logo.svg", type: "image/svg+xml", sizes: "any" } },
};

export function SiteDocument({
	children,
	locale,
}: {
	children: ReactNode;
	locale: ContentLocale;
}) {
	return (
		<html
			lang={locale}
			style={{ scrollbarGutter: "stable" }}
			className={`${geistSans.variable} ${sourceSerif.variable} ${geistMono.variable} antialiased bg-background`}
		>
			<body className="flex min-h-dvh flex-col font-sans leading-relaxed">
				<LocaleProvider locale={locale}>
					<header className="site-header shrink-0 border-b border-foreground/10">
						<div className="site-header-row">
							<PageContainer
								as="nav"
								ariaLabel={messages[locale].mainNavigation}
								className="site-header-navigation flex items-center text-xs font-medium"
							>
								<HeaderNavigation languageRoutes={contentLanguageRoutes()} />
							</PageContainer>
							<SubscribeButton />
						</div>
						<div className="border-t border-foreground/10">
							<PageContainer className="site-header-breadcrumbs">
								<Breadcrumbs />
							</PageContainer>
						</div>
					</header>
					<PageContainer as="main" className="flex flex-1">
						{children}
					</PageContainer>
					<Footer />
				</LocaleProvider>
			</body>
		</html>
	);
}
