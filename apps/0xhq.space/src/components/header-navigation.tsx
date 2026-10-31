"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteNavigation } from "@/config/navigation";

import {
	type ContentLocale,
	contentLocales,
	isContentLocale,
	languageCodes,
	languageLabelKeys,
} from "@/lib/locales";

import { messages } from "@/lib/messages";

export function HeaderNavigation({
	languageRoutes,
}: {
	languageRoutes: Record<string, ContentLocale[]>;
}) {
	const currentPath = usePathname();
	const router = useRouter();
	const segment = currentPath.split("/")[1];
	const locale = isContentLocale(segment) ? segment : "en";
	const t = messages[locale];
	const pathname =
		(isContentLocale(segment)
			? currentPath.slice(segment.length + 1)
			: currentPath) || "/";
	const available = languageRoutes[pathname] ?? [locale];

	return (
		<div className="site-navigation flex w-full flex-wrap items-center gap-2 sm:gap-4">
			<div className="site-navigation-links">
				{siteNavigation.map(({ href, label }) => {
					const active =
						pathname === href ||
						(href !== "/" && pathname.startsWith(`${href}/`));
					return (
						<Link
							key={href}
							href={`/${locale}${href === "/" ? "" : href}`}
							aria-current={active ? "page" : undefined}
							className={`site-navigation-link ${href === "/glossary" ? "ml-auto " : ""}px-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${active ? "bg-red-600 text-white" : "hover:bg-foreground/5"}`}
						>
							{t[label]}
						</Link>
					);
				})}
			</div>
			<fieldset
				aria-label={t.language}
				className="site-language-switcher flex shrink-0 items-center gap-1 border-l border-foreground/10 pl-2 sm:pl-4 font-mono text-[10px]"
			>
				{contentLocales.map((language, index) => (
					<span key={language} className="flex items-center gap-1">
						{index > 0 && (
							<span
								aria-hidden="true"
								className="site-language-separator text-foreground/25"
							>
								/
							</span>
						)}
						<button
							type="button"
							aria-label={t[languageLabelKeys[language]]}
							aria-pressed={language === locale}
							disabled={!available.includes(language)}
							title={
								available.includes(language)
									? undefined
									: t.translationUnavailable
							}
							onClick={() => {
								if (language === locale) return;
								const hash =
									pathname === "/glossary" ? window.location.hash : "";
								router.push(
									`/${language}${pathname === "/" ? "" : pathname}${hash}`,
								);
							}}
							className={`site-language-button cursor-pointer px-[2px] transition-colors duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-25 ${language === locale ? "bg-white text-red-600 enabled:hover:bg-white/90" : "text-foreground/50 enabled:hover:bg-foreground/10 enabled:hover:text-foreground"}`}
						>
							{languageCodes[language]}
						</button>
					</span>
				))}
			</fieldset>
		</div>
	);
}
