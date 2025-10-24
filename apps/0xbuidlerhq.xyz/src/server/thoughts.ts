import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "thoughts");

export type PostMeta = {
	slug: string;
	title: string;
	date: Date;
	subtitle: string;
};

export function getAllSlugs(): string[] {
	return fs
		.readdirSync(POSTS_DIR)
		.filter((f) => f.endsWith(".md"))
		.map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string) {
	const fullPath = path.join(POSTS_DIR, `${slug}.md`);
	if (!fs.existsSync(fullPath)) return null;
	const raw = fs.readFileSync(fullPath, "utf8");
	const { data, content } = matter(raw);
	return {
		slug,
		frontmatter: data as { title: string; date: Date; subtitle: string },
		content,
	};
}

export function getAllPosts(): PostMeta[] {
	return getAllSlugs()
		.map((slug) => {
			const p = getPost(slug)!;
			return {
				slug,
				title: p.frontmatter.title,
				date: p.frontmatter.date,
				subtitle: p.frontmatter.subtitle,
			};
		})
		.sort((a, b) => (b.date || "").toString().localeCompare(a.date?.toString() || ""));
}
