"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { PAGES } from "@config/pages";
import { usePathname } from "next/navigation";

const HeaderItem = (props: { title: string; href: string; external?: boolean }) => {
	const pathname = usePathname();
	const isPageActive = pathname.includes(props.href.toLowerCase());

	return (
		<ButtonBase href={props.href} external={props.external}>
			<H4
				className={cn(
					"font-regular hover:underline cursor-pointer transition-all duration-300 underline-offset-2 text-accent",
					isPageActive && "font-bold text-foreground",
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
			{/* <HeaderItem title="/projects." href={PAGES.projects} /> */}
			<HeaderItem title="/meditations." href={PAGES.meditations} />
		</Box>
	);
};

const Header = () => {
	return (
		<HeaderPrimitive className="flex flex-col gap-2 py-2">
			<H4 className="uppercase font-montserrat font-black">. Maxime Aubanel .</H4>

			<Box className="border-b-[2px] border-muted" />

			<Box className="flex items-center gap-4 py-1">
				<HeaderItems />
			</Box>

			<Box className="border-b-[2px] border-muted" />
		</HeaderPrimitive>
	);
};

export { Header };
