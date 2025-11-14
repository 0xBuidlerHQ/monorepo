import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H3, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { getAllPosts } from "@server/meditations";
import { PlusIcon } from "lucide-react";

export const dynamic = "force-static";

const Page = () => {
	const posts = getAllPosts();

	return (
		<Container>
			<Box className="flex flex-col gap-6">
				<Box className="flex flex-col">
					{posts.map((p, index) => (
						<Box key={p.slug}>
							<ButtonBase href={`${PAGES.meditations}/${p.slug}`}>
								<Box className="flex flex-col">
									<Box className="flex items-baseline gap-1">
										<PlusIcon className="size-4 group-hover:text-red-500" />
										<H3 className="font-bold group-hover:text-red-500">{p.title}</H3>
									</Box>

									<Box className="flex gap-1">
										<H6 className="text-accent">#{index}</H6>
										<H6 className="text-accent">-</H6>
										<H6 className="text-accent">{p.date.toDateString()}</H6>
									</Box>
								</Box>
							</ButtonBase>

							{index !== posts.length - 1 && <Box className="bg-muted h-[1px] my-2" />}
						</Box>
					))}
				</Box>
			</Box>
		</Container>
	);
};

export default Page;
