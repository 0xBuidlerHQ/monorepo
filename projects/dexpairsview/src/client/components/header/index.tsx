"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_1 } from "@0xbuidlerhq/ui/system/base/typography";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";

const Header = () => {
	return (
		<HeaderPrimitive className="py-4 font-montserrat">
			<Box>
				<H1_1 className="font-bold">Dex Pairs View</H1_1>
			</Box>
		</HeaderPrimitive>
	);
};

export { Header };
