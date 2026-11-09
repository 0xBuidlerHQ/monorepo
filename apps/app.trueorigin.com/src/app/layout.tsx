import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
	display: "swap",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: { default: site.name, template: `%s | ${site.name}` },
	description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} scroll-smooth scroll-pt-7 motion-reduce:scroll-auto antialiased`}
		>
			<body
				id="top"
				className="m-0 flex min-h-svh flex-col bg-background font-sans text-foreground selection:bg-brand-red selection:text-brand-white [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-brand-red [&_a:focus-visible]:outline-offset-6"
			>
				{children}
			</body>
		</html>
	);
}
