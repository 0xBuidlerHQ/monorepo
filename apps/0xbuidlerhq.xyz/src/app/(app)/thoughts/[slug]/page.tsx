import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_0, H1_6, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { getAllSlugs, getPost } from "@server/thoughts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamicParams = false;

export async function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
	const post = getPost(params.slug);
	if (!post) return notFound();

	const { frontmatter, content } = post;

	return (
		<Box className="mt-10 relative flex flex-col gap-6">
			<Box>
				<H1_6 className="text-accent rounded font-black mb-10">THOUGHTS</H1_6>
				<H1_0 className="font-bold">{frontmatter.title}</H1_0>
				<H4 className="text-accent">
					{frontmatter.date.toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</H4>
			</Box>

			<article className="prose bg-muted p-4 max-w-none">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
			</article>
		</Box>
	);
}
