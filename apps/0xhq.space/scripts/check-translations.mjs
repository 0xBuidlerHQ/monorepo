import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { contentLocales } from "../src/lib/locales.ts";

const content = path.resolve(
	process.argv[2] ?? path.join(import.meta.dirname, "../content"),
);
let failed = false;
let checked = 0;
function visit(directory) {
	for (const item of readdirSync(directory, { withFileTypes: true })) {
		const filename = path.join(directory, item.name);
		if (item.isDirectory()) {
			visit(filename);
			continue;
		}
		if (
			!contentLocales
				.filter((locale) => locale !== "en")
				.some((locale) => item.name === `${locale}.md`)
		)
			continue;
		const source = path.join(directory, "en.md");
		const { data } = matter(readFileSync(filename, "utf8"));
		checked++;
		if (!existsSync(source)) {
			console.error(`Missing English source: ${filename}`);
			failed = true;
			continue;
		}
		const revision = createHash("sha256")
			.update(readFileSync(source))
			.digest("hex");
		if (data.sourceRevision !== revision) {
			console.error(
				`Needs translation review: ${path.relative(content, filename)}\n  After reviewing the English changes, set sourceRevision: ${revision}`,
			);
			failed = true;
		}
	}
}
visit(content);
console.log(`Checked ${checked} translation(s).`);
if (failed) process.exitCode = 1;
