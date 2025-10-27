import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_0, H1_6, H4, H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { getAllSlugs, getPost } from "@server/thoughts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamicParams = false;

export function generateStaticParams() {
	return getAllSlugs().map((slug: string) => ({ slug }));
}

// ⬇️ Make component async and await params
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const post = getPost(slug);
	if (!post) {
		notFound(); // no need to return; this throws
	}

	const { frontmatter, content } = post;

	return (
		<Container>
			<Box className="mt-10 relative flex flex-col gap-6">
				<H1_6 className="text-accent rounded font-black">THOUGHTS</H1_6>

				<Box>
					<H1_0 className="font-extrabold">{frontmatter.title}</H1_0>
					<H5 className="font-bold text-black/90">{frontmatter.subtitle}</H5>
					<H5 className="text-accent italic">
						{new Date(frontmatter.date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</H5>
				</Box>

				<Box className="p-[2px] bg-muted/30">
					<Box className="p-[2px] bg-muted/60">
						<article className="prose px-2 py-4 max-w-none bg-muted">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
						</article>
					</Box>
				</Box>

				<H4 className="font-bold text-black/90 text-center">{frontmatter.subtitle}</H4>
			</Box>
		</Container>
	);
}
