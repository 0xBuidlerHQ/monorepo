import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { ButtonBase } from "@0xbuidlerhq/ui/system/buttons/ButtonBase";
import { PAGES } from "@config/pages";
import { MoveLeft } from "lucide-react";
import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Box className="mt-10" />

			<Container>
				<ButtonBase href={PAGES.home}>
					<Box className="inline-flex gap-2 group-hover:ml-2 transition-all">
						<MoveLeft />
						<H4>See all.</H4>
					</Box>
				</ButtonBase>
			</Container>

			<Box className="">{children}</Box>
		</>
	);
};

export default Layout;
