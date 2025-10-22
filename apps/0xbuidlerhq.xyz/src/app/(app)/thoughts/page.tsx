import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_6 } from "@0xbuidlerhq/ui/system/base/typography";
import { PAGES } from "@config/pages";
import { getAllPosts } from "@server/thoughts";
import Link from "next/link";

export const dynamic = "force-static";

const Page = () => {
	const posts = getAllPosts();

	return (
		<Box className="mt-10 relative">
			<H1_6 className="text-accent rounded font-black mb-10">THOUGHTS</H1_6>

			{posts.map((p) => (
				<li key={p.slug}>
					<Link href={`${PAGES.thoughts}/${p.slug}`}>{p.title || p.slug}</Link>
					{p.date && (
						<>
							{" "}
							— <time dateTime={p.date.toDateString()}>{p.date.toLocaleString()}</time>
						</>
					)}
				</li>
			))}
		</Box>
	);
};

export default Page;
