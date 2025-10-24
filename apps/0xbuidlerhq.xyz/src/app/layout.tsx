import "@0xbuidlerhq/ui/globals.css";

import "./system.css";

import {
	inter,
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
import { Footer } from "@client/footer";
import { Header } from "@client/header";
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
					"font-inter",
					"overscroll-contain",
					"tracking-tighter",
					workSans.variable,
					notoSerif.variable,
					notoSans.variable,
					notoSansDisplay.variable,
					notoSansMono.variable,
					notoSansYi.variable,
					montserrat.variable,
					inter.variable,
				)}
			>
				<Providers>
					<main className="grow flex flex-col min-h-[100dvh]">
						<Header />

						<Box className="flex grow min-h-0">
							<Box className="grow">{children}</Box>
						</Box>

						<Footer />
					</main>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
