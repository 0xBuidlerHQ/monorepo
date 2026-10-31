import Link from "next/link";
import type { ContentEntry } from "@/lib/content";
import { localeRegions } from "@/lib/locales";
import { TitleText } from "./title-text";

export function ArticleList({
	entries,
	basePath,
	emptyMessage,
}: {
	entries: ContentEntry[];
	basePath: string;
	emptyMessage: string;
}) {
	if (!entries.length) {
		return (
			<p className="mt-8 border-y border-foreground/10 py-8 text-sm text-foreground/50">
				{emptyMessage}
			</p>
		);
	}

	return (
		<ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
			{entries.map((entry) => (
				<li key={entry.slug}>
					<Link
						href={`${basePath}/${entry.slug}`}
						className="group relative flex items-center gap-4 px-3 py-6 transition-colors before:absolute before:inset-y-5 before:left-0 before:w-0.5 before:bg-red-600 before:opacity-0 hover:bg-foreground/[0.03] hover:before:opacity-100 focus-visible:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
					>
						<div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
							{entry.date && (
								<time
									dateTime={entry.date}
									className="shrink-0 font-mono text-[11px] leading-5 text-foreground/45 sm:w-28"
								>
									{new Intl.DateTimeFormat(
										localeRegions[entry.locale ?? "en"],
										{
											day: "2-digit",
											month: "short",
											year: "numeric",
											timeZone: "UTC",
										},
									).format(new Date(entry.date))}
								</time>
							)}
							<h2 className="min-w-0 break-words text-xl font-medium leading-snug tracking-tight text-foreground/85 transition-colors group-hover:text-foreground sm:text-2xl">
								<TitleText>{entry.title}</TitleText>
							</h2>
						</div>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="size-4 shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-red-600 group-focus-visible:text-red-600 motion-reduce:transform-none motion-reduce:transition-none"
						>
							<path d="M7 17 17 7M7 7h10v10" />
						</svg>
					</Link>
				</li>
			))}
		</ul>
	);
}
