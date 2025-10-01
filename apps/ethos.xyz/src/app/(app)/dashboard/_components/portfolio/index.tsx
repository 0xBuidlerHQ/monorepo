"use client";

import { Format } from "@0xbuidlerhq/core/index";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { DashboardSection } from "@app/(app)/dashboard/_components/_shared/section";
import { DashboardChart } from "@app/(app)/dashboard/_components/portfolio/chart";
import {
	Activity,
	ChartSpline,
	HandCoins,
	Landmark,
	type LucideIcon,
	ShieldPlus,
	Wallet,
} from "lucide-react";
import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren & {
	label: string;
	Icon: LucideIcon;
};
const Card = ({ label, Icon, children }: CardProps) => {
	return (
		<Box className="relative outline outline-accent/40 p-4 bg-muted/40 h-full w-full">
			<Box className="flex flex-col gap-6">
				<Box className="flex justify-between items-center gap-8">
					<H6 className="font-medium font-work-sans text-muted-foreground">{label}</H6>

					<Icon className="size-4 text-muted-foreground/70" />
				</Box>

				{children}
			</Box>

			<Box className="absolute top-[-0.5px] left-[-0.5px] -translate-1/2">
				<div className="relative w-3 h-3">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-t from-muted to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-l from-muted to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute top-[-0.5px] right-[-0.5px] translate-x-1/2 -translate-y-1/2">
				<div className="relative w-3 h-3">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-t from-muted to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-r from-muted to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute bottom-[-0.5px] right-[-0.5px] translate-1/2">
				<div className="relative w-3 h-3">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-b from-muted to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-r from-muted to-accent rounded-full"></div>
					</div>
				</div>
			</Box>

			<Box className="absolute bottom-[-0.5px] left-[-0.5px] -translate-x-1/2 translate-y-1/2">
				<div className="relative w-3 h-3">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[1px] h-full bg-gradient-to-b from-muted to-accent rounded-full"></div>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-full h-[1px] bg-gradient-to-l from-muted to-accent rounded-full"></div>
					</div>
				</div>
			</Box>
		</Box>
	);
};

const Portfolio = () => {
	return (
		<DashboardSection title="PORTFOLIO" icon={Wallet}>
			<Box className="flex gap-10">
				<Box className="flex-1/3">
					<Box className="h-full w-full relative bg-transparent">
						<DashboardChart />
					</Box>
				</Box>

				<Box className="flex-1/3">
					<Box className="flex-1 h-full">
						<Card label="OVERVIEW" Icon={Landmark}>
							<Box className="flex flex-col gap-2">
								<Box className="flex flex-col gap-2">
									<H1 className="font- text-4xl! font-numbers font-semibold bg-gradient-to-b from-black via-slate-800 to-slate-700 inline-block text-transparent bg-clip-text dark:invert">
										{Format.FormatUSD.classic(1034040)}
									</H1>
								</Box>
							</Box>
						</Card>
					</Box>
				</Box>
			</Box>

			<Box className="flex gap-10">
				<Box className="flex-1">
					<Card label="TOTAL EARNINGS" Icon={HandCoins}>
						<H1 className="font-medium bg-gradient-to-b from-black via-slate-800 to-slate-700 inline-block text-transparent bg-clip-text dark:invert">
							{Format.FormatUSD.classic(10)}
						</H1>
					</Card>
				</Box>

				<Box className="flex-1">
					<Card label="GLOBAL APR" Icon={ChartSpline}>
						<H1 className="font-medium bg-gradient-to-b from-black via-slate-800 to-slate-700 inline-block text-transparent bg-clip-text dark:invert">
							{Format.FormatPercent.format(0.1)}
						</H1>
					</Card>
				</Box>

				<Box className="flex-1">
					<Card label="ACTIVE STRATEGIES" Icon={Activity}>
						<H1 className="font-medium bg-gradient-to-b from-black via-slate-800 to-slate-700 inline-block text-transparent bg-clip-text dark:invert">
							1
						</H1>
					</Card>
				</Box>

				<Box className="flex-1">
					<Card label="GLOBAL RISK" Icon={ShieldPlus}>
						<H1 className="font-medium bg-gradient-to-b from-black via-slate-800 to-slate-700 inline-block text-transparent bg-clip-text dark:invert">
							MEDIUM
						</H1>
					</Card>
				</Box>
			</Box>
		</DashboardSection>
	);
};

export { Portfolio };
