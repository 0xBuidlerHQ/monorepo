import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { type ContentLocale, contentLocales } from "./locales.ts";

export const hairlineFigures = [
	"collectible-identity",
	"collectible-vision",
	"collectible-process",
	"collectible-pillars",
	"collectible-grading",
	"collectible-provenance",
	"collectible-community",
	"collectible-ownership",
	"collectible-passport",
	"collectible-hub",
	"collectible-ecosystem",
	"collectible-business",
	"collectible-standard",
	"collectible-expansion",
	"collectible-network",
	"collectible-ambition",
	"collectible-names",

	"oracle-data",
	"oracle-boundary",
	"oracle-sources",
	"oracle-report",
	"oracle-freshness",
	"oracle-loan",
	"oracle-trust",

	"wallet-access",
	"wallet-account",
	"wallet-connection",
	"wallet-signature",
	"wallet-permissions",
	"wallet-recovery",
	"wallet-custody",
	"wallet-authority",

	"layer2-networks",
	"layer2-capacity",
	"layer2-rollup",
	"layer2-balances",
	"layer2-bridge",
	"layer2-versions",
	"layer2-settlement",

	"defi-allocation",
	"defi-staking",
	"defi-project",
	"stablecoin-value",
	"stablecoin-peg",
	"stablecoin-reserves",
	"stablecoin-arbitrage",
	"stablecoin-models",
	"stablecoin-depeg",
	"stablecoin-together",

	"defi-network",
	"defi-protocol",
	"defi-swap",
	"defi-permission",
	"defi-lending",
	"defi-liquidation",
	"defi-returns",
	"defi-together",

	"blockchain-history",
	"blockchain-record",
	"blockchain-signature",
	"blockchain-rules",
	"blockchain-hashes",
	"blockchain-consensus",
	"blockchain-lifecycle",
	"blockchain-layers",
	"blockchain-together",

	"ethereum-network",
	"ethereum-program",
	"ethereum-ether",
	"ethereum-tokens",
	"ethereum-exchange",
	"ethereum-gas",
	"ethereum-fees",
	"ethereum-settlement",

	"branches",
	"terminal",
	"padlock",
	"format",
	"rebuild",
	"settle",
	"relay",
	"exploded",
	"hub",
] as const;

export type HairlineFigure = (typeof hairlineFigures)[number];
export type ArticleAnimation = {
	figure: HairlineFigure;
	afterHeading: string;
	caption: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getArticleAnimations(
	value: unknown,
	locale: ContentLocale,
	filename: string,
): ArticleAnimation[] {
	if (value === undefined) return [];
	if (!Array.isArray(value))
		throw new Error(`${filename}: animations must be a list.`);

	return value.flatMap((animation, index): ArticleAnimation[] => {
		const field = `${filename}: animations[${index}]`;
		if (
			!isRecord(animation) ||
			!hairlineFigures.some((name) => name === animation.figure)
		)
			throw new Error(`${field} must name a supported Hairline figure.`);
		if (!isRecord(animation.afterHeading) || !isRecord(animation.caption))
			throw new Error(
				`${field}: afterHeading and caption must be objects keyed by locale.`,
			);

		for (const language of contentLocales) {
			const heading = animation.afterHeading[language];
			const caption = animation.caption[language];
			if (heading === undefined && caption === undefined) continue;
			if (
				typeof heading !== "string" ||
				!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(heading)
			)
				throw new Error(
					`${field}.afterHeading.${language} must be a heading anchor.`,
				);
			if (typeof caption !== "string" || !caption.trim())
				throw new Error(`${field}.caption.${language} must be non-empty text.`);
		}

		const afterHeading = animation.afterHeading[locale];
		const caption = animation.caption[locale];
		if (typeof afterHeading !== "string" || typeof caption !== "string")
			return [];
		return [
			{
				figure: animation.figure as HairlineFigure,
				afterHeading,
				caption: caption.trim(),
			},
		];
	});
}

export type ContentEntry = {
	slug: string;
	title: string;
	content: string;
	date?: string;
	tags?: string[];
	locale?: ContentLocale;
	previous?: string;
	next?: string;
	animations?: ArticleAnimation[];
};

function optionalText(value: unknown, field: string, filename: string) {
	if (value === undefined || value === null) return undefined;
	if (typeof value !== "string")
		throw new Error(`${filename}: ${field} must be a string.`);
	return value.trim() || undefined;
}

function validateDraft(value: unknown, filename: string) {
	if (value !== undefined && typeof value !== "boolean") {
		throw new Error(`${filename}: draft must be true or false.`);
	}
}

export function getEntries(
	collection: "thoughts" | "ideas" | "projects" | "learn",
	locale: ContentLocale = "en",
): ContentEntry[] {
	const directory = path.join(process.cwd(), "content", collection);
	const slugs = new Set<string>();
	if (!existsSync(directory)) return [];

	return readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.flatMap(({ name: basename }): ContentEntry[] => {
			const articleDirectory = path.join(directory, basename);
			const filename = path.join(articleDirectory, `${locale}.md`);
			if (!existsSync(filename)) return [];
			const metadataFile = path.join(articleDirectory, "meta.json");
			if (!existsSync(metadataFile))
				throw new Error(`${articleDirectory}: missing meta.json.`);
			let metadata: Record<string, unknown>;
			try {
				metadata = JSON.parse(readFileSync(metadataFile, "utf8"));
			} catch {
				throw new Error(`${metadataFile}: invalid JSON.`);
			}
			if (
				!metadata ||
				typeof metadata !== "object" ||
				Array.isArray(metadata)
			) {
				throw new Error(`${metadataFile}: metadata must be a JSON object.`);
			}
			validateDraft(metadata.draft, metadataFile);
			if (metadata.draft === true) return [];

			const { data, content } = matter(readFileSync(filename, "utf8"));
			for (const field of ["slug", "date", "tags", "animations"]) {
				if (field in data)
					throw new Error(`${filename}: ${field} belongs in meta.json.`);
			}
			validateDraft(data.draft, filename);
			if (data.draft === true) return [];
			if (
				locale !== "en" &&
				!existsSync(path.join(articleDirectory, "en.md"))
			) {
				throw new Error(`${filename}: missing English source.`);
			}

			const date = metadata.date;
			if (
				typeof date !== "string" ||
				!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
				!Number.isFinite(Date.parse(date)) ||
				new Date(date).toISOString().slice(0, 10) !== date
			) {
				throw new Error(
					`${metadataFile}: published articles need a valid date in YYYY-MM-DD format.`,
				);
			}
			if (
				metadata.tags !== undefined &&
				(!Array.isArray(metadata.tags) ||
					metadata.tags.some(
						(tag: unknown) => typeof tag !== "string" || !tag.trim(),
					))
			) {
				throw new Error(
					`${metadataFile}: tags must be a list of non-empty strings.`,
				);
			}
			const tags = [
				...new Set(
					((metadata.tags as string[] | undefined) ?? []).map((tag) =>
						tag.trim(),
					),
				),
			].sort();
			const previous = optionalText(
				metadata.previous,
				"previous",
				metadataFile,
			);
			const next = optionalText(metadata.next, "next", metadataFile);
			const animations = getArticleAnimations(
				metadata.animations,
				locale,
				metadataFile,
			);
			const slug =
				optionalText(metadata.slug, "slug", metadataFile) ??
				basename
					.normalize("NFKD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-|-$/g, "");
			if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
				throw new Error(
					`${metadataFile}: slug must use lowercase letters, numbers, and hyphens.`,
				);
			}
			if (slugs.has(slug))
				throw new Error(
					`${metadataFile}: duplicate URL /${locale}/${collection}/${slug}.`,
				);
			slugs.add(slug);

			const heading = content.match(/^\s*#\s+(.+?)[ \t]*(?:\r?\n|$)/);
			const title =
				optionalText(data.title, "title", filename) ??
				heading?.[1] ??
				basename.replace(/[-_]/g, " ");
			const body =
				heading?.[1] === title ? content.slice(heading[0].length) : content;
			return [
				{
					slug,
					locale,
					previous,
					next,
					animations,
					title,
					date,
					tags,
					content: `# ${title}\n\n${body.trimStart()}`,
				},
			];
		})
		.sort((a, b) => a.title.localeCompare(b.title));
}
