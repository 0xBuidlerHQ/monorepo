"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_2 } from "@0xbuidlerhq/ui/system/base/typography";
import { Header as HeaderPrimitive } from "@0xbuidlerhq/ui/system/layouts/header";
import { ConnectButton } from "@client/connectButton/component";

const Header = () => {
	return (
		<HeaderPrimitive>
			<Box className="flex items-center justify-between">
				<H1_2 className="font-space-grotesk">BETTERLIDO</H1_2>
				<ConnectButton />
			</Box>
		</HeaderPrimitive>
	);
};

export { Header };
