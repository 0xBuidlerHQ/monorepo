import "@ethos/ui/globals.css";
import "./system.css";

import { geist, geistMono, inter } from "@ethos/ui/fonts";
import { cn } from "@ethos/ui/shadcn/lib/utils";
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
					"font-inter",
					inter.variable,
					geistMono.variable,
					geist.variable,
				)}
			>
				<Providers>
					<Box className="flex flex-col min-h-[100dvh]">
						<Header />
						<main className="grow">{children}</main>
						<Footer />
					</Box>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
