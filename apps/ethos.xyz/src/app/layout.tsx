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
import { Footer } from "@client/fragments/footer";
import { Header } from "@client/fragments/header";
import { Globals } from "@client/globals";
import { Providers } from "@client/providers";
import type { PropsWithChildren } from "react";

interface DottedBackgroundProps {
	dotSize?: number;
	dotSpacing?: number;
}

const Background: React.FC<DottedBackgroundProps> = ({ dotSize = 1, dotSpacing = 20 }) => {
	return (
		<Box
			className="absolute inset-px z-0 pointer-events-none"
			style={{
				backgroundImage: `radial-gradient(circle, rgba(1, 1, 1, 0.05) ${dotSize}px, transparent ${dotSize}px)`,
				backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
			}}
		/>
	);
};

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
						{/* <Annoucement /> */}

						<main className="flex flex-col grow">
							<Header />

							<Container className="flex grow">
								<Box className="relative border-x border-accent grow px-[1px]">
									<Background />

									<Box>{children}</Box>
								</Box>
							</Container>
						</main>

						<Footer />
					</Box>
				</Providers>
			</body>
		</html>
	);
};

export default Layout;
