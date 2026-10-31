import { ArticleList } from "@/components/article-list";
import type { Thought } from "@/lib/thoughts";

export function ThoughtList({ thoughts }: { thoughts: Thought[] }) {
	return (
		<ArticleList
			entries={thoughts}
			basePath="/thoughts"
			emptyMessage="No thoughts yet."
		/>
	);
}
