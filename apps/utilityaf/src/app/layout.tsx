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
import { Background } from "@client/components/background";
import { Footer } from "@client/layouts/footer";
import { Header } from "@client/layouts/header";
import { Providers } from "@client/providers";
import type { PropsWithChildren } from "react";

export { metadata } from "./metadata";

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
				<Background />

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
