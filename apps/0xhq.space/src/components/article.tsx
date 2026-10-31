import { type ReactNode, Suspense } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeArticleHeadings } from "@/lib/article-headings";
import type { ContentEntry, HairlineFigure } from "@/lib/content";
import { formatPublicationDate } from "@/lib/dates";
import { messages } from "@/lib/messages";
import { ArticleOutline } from "./article-outline";
import { BlockchainAnimation } from "./blockchain-animation";
import { UiText } from "./locale-provider";
import { TitleText } from "./title-text";

const headingSizes = {
	h1: "text-4xl",
	h2: "text-3xl",
	h3: "text-2xl",
	h4: "text-xl",
	h5: "text-lg",
	h6: "text-base",
};

function ArticleHeading({
	as: Tag,
	title = false,
	id,
	outline = false,
	children,
}: {
	as: keyof typeof headingSizes;
	title?: boolean;
	id?: string;
	outline?: boolean;
	children: ReactNode;
}) {
	return (
		<Tag
			id={id}
			data-toc-heading={outline ? "" : undefined}
			className={`not-prose article-heading scroll-mt-8 font-sans font-semibold leading-tight tracking-tight text-balance text-foreground ${title ? "m-0 text-5xl sm:text-6xl" : `mt-[1.6em] mb-[0.65em] ${headingSizes[Tag]}`}`}
		>
			{title ? <TitleText>{children}</TitleText> : children}
		</Tag>
	);
}

const markdownComponents: Components = {
	a: ({ children, href, title }) =>
		href &&
		(href.startsWith("#") ||
			(href.startsWith("/") && !href.startsWith("//"))) ? (
			<a href={href} title={title}>
				{children}
			</a>
		) : (
			children
		),
	h1: ({ children }) => <ArticleHeading as="h1">{children}</ArticleHeading>,
	h2: ({ children }) => <ArticleHeading as="h2">{children}</ArticleHeading>,
	h3: ({ children }) => <ArticleHeading as="h3">{children}</ArticleHeading>,
	h4: ({ children }) => <ArticleHeading as="h4">{children}</ArticleHeading>,
	h5: ({ children }) => <ArticleHeading as="h5">{children}</ArticleHeading>,
	h6: ({ children }) => <ArticleHeading as="h6">{children}</ArticleHeading>,
};

export function ReferenceContent({
	content,
	figures = {},
}: {
	content: string;
	figures?: Record<string, HairlineFigure>;
}) {
	return (
		<div className="prose prose-zinc thought-prose max-w-none break-words font-sans dark:prose-invert prose-pre:overflow-x-auto">
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					...markdownComponents,
					h1: ({ children }) => (
						<header className="not-prose mb-6">
							<ArticleHeading as="h1" title>
								{children}
							</ArticleHeading>
						</header>
					),
					h2: ({ children }) => {
						const text = String(children);
						const explicit = text.match(/\s+\{#([a-z0-9-]+)\}$/);
						const label = explicit ? text.slice(0, explicit.index) : children;
						const id =
							explicit?.[1] ??
							String(children)
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, "-")
								.replace(/^-|-$/g, "");
						return (
							<div className="relative flex items-center gap-4 min-[1280px]:block">
								<div className="min-w-0 flex-1">
									<ArticleHeading as="h2" id={id} outline>
										<a
											href={`#${id}`}
											className="no-underline hover:underline underline-offset-4"
										>
											{label}
										</a>
									</ArticleHeading>
								</div>
								{figures[id] && (
									<div
										data-section-animation={id}
										className="shrink-0 min-[1280px]:absolute min-[1280px]:top-0 min-[1280px]:right-[calc(100%+1rem)] min-[1280px]:h-[var(--animation-section-height)] min-[1280px]:w-[clamp(8rem,calc(50vw_-_28.5rem),32rem)]"
									>
										<div className="min-[1280px]:sticky min-[1280px]:top-8">
											<BlockchainAnimation
												figureName={figures[id]}
												animationId={`glossary:${id}`}
												caption=""
												placement="glossary"
												showCaption={false}
											/>
										</div>
									</div>
								)}
							</div>
						);
					},
				}}
			>
				{content}
			</Markdown>
		</div>
	);
}

export function ArticleLayout({ children }: { children: ReactNode }) {
	return (
		<article className="w-full min-w-0 py-12">
			<Suspense fallback={<ArticleSkeleton />}>{children}</Suspense>
		</article>
	);
}

export function ArticleContent({ entry }: { entry: ContentEntry }) {
	function animationsAt(id: string | undefined) {
		return entry.animations
			?.filter((animation) => animation.afterHeading === id)
			.map((animation) => (
				<div
					key={animation.figure}
					data-section-animation={id}
					className="min-[1280px]:absolute min-[1280px]:h-[var(--animation-section-height)] min-[1280px]:top-0 min-[1280px]:right-[calc(100%+1rem)] min-[1280px]:w-[clamp(11.5rem,calc(50vw_-_28.5rem),32rem)]"
				>
					<div className="min-[1280px]:sticky min-[1280px]:top-8">
						<BlockchainAnimation
							figureName={animation.figure}
							animationId={`${entry.slug}:${entry.animations?.indexOf(animation)}`}
							caption={animation.caption}
							placement="section"
						/>
					</div>
				</div>
			));
	}

	function outlineHeading(as: "h2" | "h3"): Components["h2"] {
		return ({ children, id }) => (
			<div className="relative">
				<ArticleHeading as={as} id={id} outline>
					{children}
				</ArticleHeading>
				{animationsAt(id)}
			</div>
		);
	}

	const readingMinutes = Math.max(
		1,
		Math.ceil(entry.content.trim().split(/\s+/).length / 220),
	);

	return (
		<ArticleOutline key={entry.slug}>
			<div
				lang={entry.locale ?? "en"}
				className="prose prose-zinc thought-prose max-w-none break-words font-sans dark:prose-invert prose-pre:overflow-x-auto"
			>
				<Markdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeArticleHeadings]}
					components={{
						...markdownComponents,
						h2: outlineHeading("h2"),
						h3: outlineHeading("h3"),
						h1: ({ children, node }) =>
							node?.position?.start.line === 1 ? (
								<header className="not-prose mb-6">
									<div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] leading-5 text-foreground/45">
										{entry.date && (
											<>
												<time dateTime={entry.date}>
													{formatPublicationDate(entry.date, entry.locale)}
												</time>
												<span aria-hidden="true" className="text-red-600/70">
													·
												</span>
											</>
										)}
										<span>
											{readingMinutes} {messages[entry.locale ?? "en"].minRead}
										</span>
									</div>
									<div className="relative">
										<ArticleHeading as="h1" id="article-title" title>
											{children}
										</ArticleHeading>
										{animationsAt("article-title")}
									</div>
									{entry.description && (
										<p className="mt-5 text-lg leading-relaxed text-foreground/65">
											{entry.description}
										</p>
									)}
								</header>
							) : (
								<ArticleHeading as="h1">{children}</ArticleHeading>
							),
					}}
				>
					{entry.content}
				</Markdown>
			</div>
		</ArticleOutline>
	);
}

function ArticleSkeleton() {
	return (
		<div role="status" className="animate-pulse motion-reduce:animate-none">
			<span className="sr-only">
				<UiText name="loadingArticle" />
			</span>
			<div aria-hidden="true" className="space-y-4">
				<div className="h-14 w-3/4 rounded bg-current/10" />
				<div className="h-5 w-1/2 rounded bg-current/10" />
				<div className="space-y-3 pt-6">
					<div className="h-4 rounded bg-current/10" />
					<div className="h-4 rounded bg-current/10" />
					<div className="h-4 w-2/3 rounded bg-current/10" />
				</div>
			</div>
		</div>
	);
}
