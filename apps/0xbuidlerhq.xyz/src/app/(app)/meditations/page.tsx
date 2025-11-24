import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H2, H4, H5 } from "@0xbuidlerhq/ui/system/base/typography";
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
									<Box className="flex gap-1">
										<H5 className="text-accent">#{index}</H5>
										<H5 className="text-accent">-</H5>
										<H5 className="text-accent">{p.date.toDateString()}</H5>
									</Box>

									<Box className="flex items-baseline gap-1">
										<PlusIcon className="size-4 group-hover:text-red-500" />
										<H2 className="font-bold group-hover:text-red-500">{p.title}</H2>
									</Box>

									<Box className="flex items-baseline gap-1">
										<H4 className="text-accent">{p.subtitle}</H4>
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
