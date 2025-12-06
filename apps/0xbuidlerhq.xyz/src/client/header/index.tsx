"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H4, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { usePathname } from "next/navigation";

const HeaderItem = (props: { title: string; href: string; external?: boolean }) => {
	const pathname = usePathname();
	const isPageActive = pathname.includes(props.href.toLowerCase());

	return (
		<ButtonBase href={props.href} external={props.external}>
			<H4
				className={cn(
					"hover:underline font-montserrat font-medium cursor-pointer transition-all duration-300 underline-offset-2 text-accent",
					isPageActive && "text-foreground underline underline-offset-4",
				)}
			>
				{props.title}
			</H4>
		</ButtonBase>
	);
};

const HeaderItems = () => {
	return (
		<Box className="flex justify-center gap-2 items-center">
			<HeaderItem title="projects." href={PAGES.projects} />
			<H6 className="text-muted-foreground px-1 rounded">{"//"}</H6>
			<HeaderItem title="meditations." href={PAGES.meditations} />
			<H6 className="text-muted-foreground px-1 rounded">{"//"}</H6>
			<HeaderItem title="music." href={PAGES.music} />
		</Box>
	);
};

const Header = () => {
	return (
		<Box className="flex flex-col gap-2 py-2">
			<Container>
				<Box className="flex justify-between">
					<H4 className="font-montserrat font-bold">MAXIME AUBANEL</H4>
					<H4 className="grayscale-0">🌞</H4>
				</Box>
			</Container>

			<Box className="border-b-[2px] border-muted" />

			<Container>
				<Box className="flex items-center gap-4 py-1">
					<HeaderItems />
				</Box>
			</Container>
		</Box>
	);
};

export { Header };
