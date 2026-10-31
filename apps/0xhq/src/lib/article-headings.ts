type HtmlNode = {
	type: string;
	tagName?: string;
	value?: string;
	children?: HtmlNode[];
	properties?: Record<string, unknown>;
};

function textContent(node: HtmlNode): string {
	return node.value ?? node.children?.map(textContent).join("") ?? "";
}

export function rehypeArticleHeadings() {
	return (tree: HtmlNode) => {
		const usedIds = new Set<string>();

		function visit(node: HtmlNode) {
			if (node.tagName === "h2" || node.tagName === "h3") {
				const slug =
					textContent(node)
						.normalize("NFKD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/^-|-$/g, "") || "section";
				let id = slug;
				let suffix = 1;
				while (usedIds.has(id)) id = `${slug}-${suffix++}`;
				usedIds.add(id);
				node.properties = { ...node.properties, id };
			}
			for (const child of node.children ?? []) visit(child);
		}

		visit(tree);
	};
}
