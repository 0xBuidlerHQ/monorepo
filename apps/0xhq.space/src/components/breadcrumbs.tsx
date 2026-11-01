"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isTranslatedCollection } from "@/lib/locales";
import { formatTagLabel, messages } from "@/lib/messages";
import { useLocale } from "./locale-provider";

export function Breadcrumbs() {
	const locale = useLocale();
	const t = messages[locale];
	const segments = usePathname().split("/").filter(Boolean).slice(1);

	return (
		<nav aria-label={t.breadcrumb}>
			<ol className="flex flex-wrap items-center font-mono text-[11px] leading-5 text-foreground/45">
				<li>
					<Link
						href={`/${locale}`}
						aria-label={t.home}
						aria-current={!segments.length ? "page" : undefined}
						className="pr-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
					>
						/
					</Link>
				</li>
				{segments.map((segment, index) => {
					const path = `/${locale}/${segments.slice(0, index + 1).join("/")}`;
					const current = index === segments.length - 1;
					let label = segment;
					try {
						label = decodeURIComponent(segment);
						if (segments[index - 1] === "tags")
							label = formatTagLabel(label, locale);
						if (
							isTranslatedCollection(segment) ||
							segment === "curated" ||
							segment === "content" ||
							segment === "glossary" ||
							segment === "tags"
						)
							label = t[segment];
					} catch {
						/* Keep malformed segments readable. */
					}

					return (
						<li key={path} className="flex min-w-0 items-center">
							{index > 0 && (
								<span aria-hidden="true" className="px-1 text-foreground/25">
									/
								</span>
							)}
							<Link
								href={
									path.endsWith("/thoughts/tags") ? path.slice(0, -5) : path
								}
								aria-current={current ? "page" : undefined}
								className={`break-all transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${current ? "text-foreground/75" : ""}`}
							>
								{label.toLocaleLowerCase(locale)}
							</Link>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
