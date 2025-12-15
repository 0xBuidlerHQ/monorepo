import "@0xbuidlerhq/ui/globals.css";

import "./system.css";

import {
	montserrat,
	notoSans,
	notoSansDisplay,
	notoSansMono,
	notoSansYi,
	notoSerif,
	workSans,
} from "@0xbuidlerhq/ui/fonts";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { Background } from "@app/background";
import { Footer } from "@client/fragments/footer";
import { Header } from "@client/fragments/header";
import { Globals } from "@client/globals";
import { Providers } from "@client/providers";
import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"relative",
					"antialiased",
					"bg-background",
					"text-foreground",
					"font-noto-sans",
					"overscroll-contain",
					workSans.variable,
					notoSerif.variable,
					notoSans.variable,
					notoSansDisplay.variable,
					notoSansMono.variable,
					notoSansYi.variable,
					montserrat.variable,
				)}
			>
				<Providers>
					<Globals />

					<Box className="grow flex flex-col min-h-[100dvh]">
						<main className="flex flex-col grow">
							<Header />

							<Container className="flex grow min-h-0">
								<Box className="relative border-x border-accent grow px-[1px]">
									<Background />

									<Box className="grow">{children}</Box>
								</Box>
							</Container>

							<Footer />
						</main>
					</Box>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
