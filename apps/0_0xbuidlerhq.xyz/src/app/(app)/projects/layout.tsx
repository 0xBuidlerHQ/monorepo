"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_4, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import type { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
	return (
		<>
			<Container className="py-10 flex flex-col gap-1">
				<H1_4 className="font-black font-montserrat">PROJECTS.</H1_4>

				<H4 className="text-accent font-medium font-montserrat">
					When thinking isn’t enough, it’s time to create.
				</H4>

				<Box className="h-[1px] bg-muted mt-10" />
			</Container>

			{props.children}
		</>
	);
};

export default Layout;
