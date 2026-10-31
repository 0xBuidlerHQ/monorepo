import { articleDescription } from "@/lib/article-seo";
import type { ContentEntry } from "@/lib/content";
import { formatPublicationDate } from "@/lib/dates";
import { messages } from "@/lib/messages";
import { site } from "@/lib/site";
import { renderTitleText } from "./title-text";

// Match globals.css's dark palette and the site's Tailwind red-600 accent.
const colors = {
	background: "#18181b",
	foreground: "#ededed",
	muted: "rgba(237,237,237,0.65)",
	faint: "rgba(237,237,237,0.45)",
	red: "#e7000b",
};

export function ArticleShareCard({ entry }: { entry?: ContentEntry }) {
	const title = entry?.title ?? `[ ${site.name} ]`;
	const description = entry ? articleDescription(entry) : site.description;
	const locale = entry?.locale ?? "en";
	const t = messages[locale];
	const readingMinutes = entry
		? Math.max(1, Math.ceil(entry.content.trim().split(/\s+/).length / 220))
		: undefined;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				padding: "32px 88px",
				gap: 24,
				background: colors.background,
				color: colors.foreground,
				fontFamily: "Geist",
				fontWeight: 400,
			}}
		>
			{entry && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10,
						fontFamily: "Geist Mono",
						fontSize: 13,
						color: colors.faint,
					}}
				>
					{entry.date && (
						<>
							<span>{formatPublicationDate(entry.date, locale)}</span>
							<span style={{ color: colors.red }}>·</span>
						</>
					)}
					<span>
						{readingMinutes} {t.minRead}
					</span>
				</div>
			)}
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					alignItems: "baseline",
					columnGap: 12,
					rowGap: 4,
					fontSize: title.length > 80 ? 44 : title.length > 45 ? 56 : 72,
					fontWeight: 600,
					letterSpacing: -2,
					lineHeight: 1.15,
				}}
			>
				{renderTitleText(title, "dark")}
			</div>
			<div
				style={{
					display: "flex",
					fontSize: 25,
					lineHeight: 1.45,
					color: colors.muted,
				}}
			>
				{description}
			</div>
		</div>
	);
}
