import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_0, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import type { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
	return (
		<>
			<Container className="py-10 flex flex-col gap-0">
				<H1_0 className="font-black font-montserrat text-center">MEDITATIONS.</H1_0>

				<H4 className="text-center text-accent font-medium font-montserrat">
					When thinking isn’t enough, it’s time to write.
				</H4>

				<Box className="grow" />
				<Box className="h-[2px] bg-muted mt-10" />
			</Container>

			{props.children}
		</>
	);
};

export default Layout;
