"use client";

import { Format } from "@0xbuidlerhq/core";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_4, H1_6, H4, H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { RewardChart } from "@app/chart";
import { RewardsTable } from "@app/table";
import { useLidoRewards } from "@client/hooks/useLidoRewards";
import { useWeb3 } from "@client/providers/web3";

type DashboardHeaderItemProps = {
	title: string;
	value: string;
	className?: string;
};
const DashboardHeaderItem = (props: DashboardHeaderItemProps) => {
	const { title, value, className } = props;

	return (
		<Box className="flex flex-col">
			<H4 className="text-muted-foreground font-montserrat font-medium">{title}</H4>
			<H1_4 className={cn("tracking-tighter", className)}>{value}</H1_4>
		</Box>
	);
};

const DashboardHeader = () => {
	const { eoa } = useWeb3();

	const { lidoRewards } = useLidoRewards({ address: eoa.address! });

	const a = lidoRewards?.events[0].balance;
	const b = lidoRewards?.totals.ethRewards;
	const c = lidoRewards?.averageApr / 100;

	return (
		<Box className="flex justify-between">
			<DashboardHeaderItem
				title="stETH balance"
				value={Format.FormatBeauty(a)}
				className="text-rose-400"
			/>
			<DashboardHeaderItem
				title="stETH rewarded"
				value={Format.FormatBeauty(b)}
				className="text-violet-400"
			/>
			<DashboardHeaderItem
				title="Average APR*"
				value={Format.FormatPercent.format(c)}
				className="text-emerald-400"
			/>
		</Box>
	);
};

const DashboardChart = () => {
	const { eoa } = useWeb3();

	const { lidoRewards } = useLidoRewards({ address: eoa.address! });

	return <RewardChart events={lidoRewards?.events.toReversed() ?? []} />;
};

const DashboardTable = () => {
	const { eoa } = useWeb3();

	const { lidoRewards } = useLidoRewards({ address: eoa.address! });

	return <RewardsTable events={lidoRewards?.events.toReversed() ?? []} />;
};

const Page = () => {
	return (
		<Box className="mt-20">
			<Box className="flex flex-col gap-20">
				<Container className="flex flex-col gap-10">
					<Box>
						<H1_6 className="font-bold font-syne">overview</H1_6>
						<H5 className="text-muted-foreground">
							Live snapshot of your stETH balance, total rewards, and average APR.
						</H5>
					</Box>

					<DashboardHeader />
				</Container>

				<Box className="flex flex-col gap-4">
					<Container>
						<Box>
							<H1_6 className="font-bold font-syne">chart</H1_6>
							<H5 className="text-muted-foreground">
								Track rewards, APR, pool growth, and your balance over time.
							</H5>
						</Box>
					</Container>

					<DashboardChart />
				</Box>

				<Container className="flex flex-col gap-4">
					<Box>
						<H1_6 className="font-bold font-syne">table</H1_6>
						<H5 className="text-muted-foreground">
							Detailed reward events with APR, earned ETH/USD, pool size, and your share.
						</H5>
					</Box>
					<DashboardTable />
				</Container>
			</Box>
		</Box>
	);
};

export default Page;
