"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { PAGES } from "@config/pages";
import { Terminal } from "lucide-react";
import { usePathname } from "next/navigation";

const HeaderItem = (props: { title: string; href: string; external?: boolean }) => {
	const pathname = usePathname();
	const isPageActive = pathname.includes(props.title.toLowerCase());

	return (
		<ButtonBase href={props.href} external={props.external}>
			<H5
				className={cn(
					"font-medium hover:bg-black hover:text-white cursor-pointer transition-all px-0.5 hover:px-2 hover:font-bold duration-300",
					isPageActive && "bg-black text-white px-2 font-bold",
				)}
			>
				{props.title}
			</H5>
		</ButtonBase>
	);
};

const HeaderItems = () => {
	return (
		<Box className="flex justify-center gap-4">
			<HeaderItem title="About" href={PAGES.about} />
			<HeaderItem title="Thoughts" href={PAGES.thoughts} />
		</Box>
	);
};

const Header = () => {
	return (
		<HeaderPrimitive>
			<Box className="flex items-center gap-4 py-1">
				<Terminal className="size-4" />
				<HeaderItems />
			</Box>
		</HeaderPrimitive>
	);
};

export { Header };
