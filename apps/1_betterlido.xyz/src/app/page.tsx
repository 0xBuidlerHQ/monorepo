"use client";

import { Format } from "@0xbuidlerhq/core";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_4, H1_5, H1_6, H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { RewardChart } from "@app/chart";
import { RewardsTable } from "@app/table";
import { AnimatedCard, AnimatedSection, AnimatedStagger, ViewSwitch } from "@client/animations";
import { ConnectButton } from "@client/connectButton/component";
import { useLidoRewards } from "@client/hooks/useLidoRewards";
import { useWeb3 } from "@client/providers/web3";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";

type DashboardHeaderItemProps = {
	title: string;
	value: string;
	className?: string;
	eth?: boolean;
};
const DashboardHeaderItem = (props: DashboardHeaderItemProps) => {
	const { title, value, className, eth } = props;

	return (
		<Box className="flex flex-col gap-2">
			<H5 className={"underline underline-offset-4 font-montserrat font-medium"}>{title}</H5>

			<Box className="flex items-baseline gap-2">
				<H1_4 className={cn("font-montserrat", className)}>{value}</H1_4>
				{eth && <H5 className={cn("font-syne font-bold", className)}>ETH</H5>}
			</Box>
		</Box>
	);
};

type LidoRewardsData = ReturnType<typeof useLidoRewards>["lidoRewards"];

const DashboardHeader = ({ lidoRewards }: { lidoRewards?: LidoRewardsData }) => {
	const a = lidoRewards?.events[0]?.balance;
	const b = lidoRewards?.totals.ethRewards;
	const c = lidoRewards?.averageApr ? Number(lidoRewards.averageApr) / 100 : undefined;
	const d = lidoRewards?.events[0]?.rewards;
	const e = lidoRewards?.totalItems;

	const headerItems = [
		{
			title: "stETH balance",
			value: Format.FormatBeauty(a),
			className: "text-amber-400",
			eth: true,
		},
		{
			title: "stETH rewarded",
			value: Format.FormatBeauty(b),
			className: "text-violet-400",
			eth: true,
		},
		{
			title: "Latest Rewards",
			value: Format.FormatBeauty(d),
			className: "text-rose-400",
			eth: true,
		},
		{
			title: "Payout count",
			value: String(e),
			className: "text-cyan-400",
			eth: false,
		},
		{
			title: "Average APR",
			value: Format.FormatPercent.format(c),
			className: "text-emerald-400",
			eth: false,
		},
	];

	return (
		<Box className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2">
			{headerItems.map((item) => (
				<AnimatedCard key={item.title}>
					<DashboardHeaderItem
						title={item.title}
						value={item.value}
						className={item.className}
						eth={item.eth}
					/>
				</AnimatedCard>
			))}
		</Box>
	);
};

const DashboardChart = ({ lidoRewards }: { lidoRewards?: LidoRewardsData }) => {
	return <RewardChart events={lidoRewards?.events.toReversed() ?? []} />;
};

const DashboardTable = ({ lidoRewards }: { lidoRewards?: LidoRewardsData }) => {
	return <RewardsTable events={lidoRewards?.events ?? []} />;
};

const Page = () => {
	const { eoa } = useWeb3();
	const isConnected = Boolean(eoa.address);
	const { lidoRewards, lidoRewardsIsPending } = useLidoRewards({
		address: eoa.address!,
	});

	return (
		<Box className="mt-10">
			<AnimatePresence mode="wait">
				{isConnected ? (
					lidoRewardsIsPending ? (
						<ViewSwitch key="loading">
							<Container className="flex flex-col items-center gap-6 text-center">
								<H1_5 className="font-bold font-syne">Crunching your data…</H1_5>
								<H5 className="text-muted-foreground max-w-xl">
									Hang tight while we fetch your stETH balance, rewards, and APR.
								</H5>
							</Container>
						</ViewSwitch>
					) : (
						<ViewSwitch key="connected">
							<AnimatedStagger initial="hidden" animate="visible" className="flex flex-col gap-20">
								<AnimatedSection>
									<Container className="flex flex-col gap-10">
										<AnimatedSection>
											<Box className="flex">
												<H1_6 className="font-bold font-syne">overview</H1_6>
												<Plus className="size-8" />
												<Box className="w-full flex items-center">
													<Box className="border-t w-full" />
												</Box>
												<Minus className="size-6" />
											</Box>
											<H5 className="text-muted-foreground">
												Live snapshot of your stETH balance, total rewards, and average APR.
											</H5>
										</AnimatedSection>

										<AnimatedStagger initial="hidden" animate="visible" className="flex">
											<DashboardHeader lidoRewards={lidoRewards} />
										</AnimatedStagger>
									</Container>
								</AnimatedSection>

								<AnimatedSection>
									<Box className="flex flex-col gap-10">
										<Container>
											<AnimatedSection>
												<Box className="flex">
													<H1_6 className="font-bold font-syne">chart</H1_6>
													<Plus className="size-8" />
													<Box className="w-full flex items-center">
														<Box className="border-t w-full" />
													</Box>
													<Minus className="size-6" />
												</Box>
												<H5 className="text-muted-foreground">
													Track rewards, APR, pool growth, and your balance over time.
												</H5>
											</AnimatedSection>
										</Container>

										<AnimatedCard>
											<DashboardChart lidoRewards={lidoRewards} />
										</AnimatedCard>
									</Box>
								</AnimatedSection>

								<AnimatedSection>
									<Container className="flex flex-col gap-10">
										<AnimatedSection>
											<Box className="flex">
												<H1_6 className="font-bold font-syne">table</H1_6>
												<Plus className="size-8" />
												<Box className="w-full flex items-center">
													<Box className="border-t w-full" />
												</Box>
												<Minus className="size-6" />
											</Box>
											<H5 className="text-muted-foreground">
												Detailed reward events with APR, earned ETH/USD, pool size, and your share.
											</H5>
										</AnimatedSection>
										<AnimatedCard>
											<DashboardTable lidoRewards={lidoRewards} />
										</AnimatedCard>
									</Container>
								</AnimatedSection>
							</AnimatedStagger>
						</ViewSwitch>
					)
				) : (
					<ViewSwitch key="disconnected">
						<Container className="flex flex-col items-center gap-6 text-center">
							<H1_5 className="font-bold font-syne">Connect your wallet</H1_5>
							<H5 className="text-muted-foreground max-w-xl">
								Link your wallet to view your stETH balance, rewards, and APR insights.
							</H5>
							<ConnectButton />
						</Container>
					</ViewSwitch>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default Page;
