import "@ethos/ui/globals.css";
import "./system.css";

import { notoSans, notoSansMono } from "@ethos/ui/fonts";
import { cn } from "@ethos/ui/shadcn/lib/utils";
import { DottedBackground } from "@ethos/ui/system/background/dotted";
import { Box } from "@ethos/ui/system/base/box";
import type { PropsWithChildren } from "react";
import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";

import { Providers } from "@/providers";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"antialiased",
					"bg-background",
					"font-noto-sans-display",
					notoSans.variable,
					notoSansMono.variable,
				)}
			>
				<Providers>
					<DottedBackground>
						<Box className="flex flex-col min-h-[100dvh]">
							<Header />
							<main className="grow">{children}</main>
							<Footer />
						</Box>
					</DottedBackground>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
