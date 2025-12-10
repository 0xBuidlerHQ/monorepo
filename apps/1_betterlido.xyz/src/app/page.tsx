"use client";

import { Format } from "@0xbuidlerhq/core";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_5, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { RewardChart } from "@app/chart";
import { useLidoRewards } from "@client/hooks/useLidoRewards";
import { useWeb3 } from "@client/providers/web3";

type DashboardHeaderItemProps = {
	title: string;
	value: string;
};
const DashboardHeaderItem = (props: DashboardHeaderItemProps) => {
	const { title, value } = props;

	return (
		<Box className="flex flex-col">
			<H4 className="text-muted-foreground px-2">{title}</H4>
			<H1_5 className="font-space-grotesk">{value}</H1_5>
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
			<DashboardHeaderItem title="stETH balance" value={Format.FormatBeauty(a)} />
			<DashboardHeaderItem title="stETH rewarded" value={Format.FormatBeauty(b)} />
			<DashboardHeaderItem title="Average APR*" value={Format.FormatPercent.format(c)} />
		</Box>
	);
};

const DashboardChart = () => {
	const { eoa } = useWeb3();

	const { lidoRewards } = useLidoRewards({ address: eoa.address! });

	return (
		<Box>
			<RewardChart events={lidoRewards?.events.toReversed() ?? []} />
		</Box>
	);
};

const Page = () => {
	return (
		<Container className="mt-20">
			<DashboardHeader />
			<DashboardChart />
		</Container>
	);
};

export default Page;
