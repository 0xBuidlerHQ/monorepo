"use client";

import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { PAGES } from "@config/pages";
import { Terminal } from "lucide-react";
import { usePathname } from "next/navigation";

const HeaderItem = (props: { title: string; href: string; external?: boolean }) => {
	const pathname = usePathname();
	const isPageActive = pathname.includes(props.href.toLowerCase());

	return (
		<ButtonBase href={props.href} external={props.external}>
			<H4
				className={cn(
					"font-medium hover:underline cursor-pointer transition-all px-0.5 duration-300 underline-offset-2",
					isPageActive && "bg-red-500 text-white px-2 font-bold",
				)}
			>
				{props.title}
			</H4>
		</ButtonBase>
	);
};

const HeaderItems = () => {
	return (
		<Box className="flex justify-center gap-4">
			<HeaderItem title="Meditations." href={PAGES.meditations} />
		</Box>
	);
};

const Header = () => {
	return (
		<HeaderPrimitive>
			<Box className="flex items-center gap-4 py-1">
				<Terminal className="size-5" />
				<HeaderItems />
			</Box>
		</HeaderPrimitive>
	);
};

export { Header };
