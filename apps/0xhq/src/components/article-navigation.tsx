import Link from "next/link";
import { type ContentEntry, getEntries } from "@/lib/content";
import type { ContentLocale, TranslatedCollection } from "@/lib/locales";
import { messages } from "@/lib/messages";
import { TitleText } from "./title-text";

export function ArticleNavigation({
	entry,
	collection,
	locale,
}: {
	entry: ContentEntry;
	collection: TranslatedCollection;
	locale: ContentLocale;
}) {
	const entries = getEntries(collection, locale);
	const previous = entries.find(
		(candidate) =>
			candidate.slug === entry.previous && candidate.slug !== entry.slug,
	);
	const next = entries.find(
		(candidate) =>
			candidate.slug === entry.next && candidate.slug !== entry.slug,
	);
	if (!previous && !next) return null;
	const t = messages[locale];

	return (
		<nav
			aria-label={t.articleNavigation}
			className="mt-12 grid grid-cols-2 gap-3 sm:gap-4"
		>
			{(
				[
					{ direction: "previous", target: previous },
					{ direction: "next", target: next },
				] as const
			).map(({ direction, target }) => {
				if (!target) return null;
				const forward = direction === "next";
				return (
					<Link
						key={direction}
						href={`/${locale}/${collection}/${target.slug}`}
						rel={forward ? "next" : "prev"}
						className={`group flex min-w-0 flex-col gap-3 border border-foreground/10 px-3 py-4 transition-colors hover:border-foreground/25 hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:px-5 sm:py-5 ${forward ? "col-start-2 items-end text-right" : "col-start-1 items-start"}`}
					>
						<span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-foreground/45 transition-colors group-hover:text-foreground/75">
							{forward && t.nextArticle}
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={`size-4 shrink-0 transition-transform duration-200 motion-reduce:transform-none motion-reduce:transition-none ${forward ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"}`}
							>
								<path d="M19 12H5m6 6-6-6 6-6" />
							</svg>
							{!forward && t.previousArticle}
						</span>
						<span className="min-w-0 break-words text-sm font-medium leading-relaxed tracking-tight text-foreground/85 sm:text-base">
							<TitleText>{target.title}</TitleText>
						</span>
					</Link>
				);
			})}
		</nav>
	);
}
