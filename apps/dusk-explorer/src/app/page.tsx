"use client";

import { H1, H4, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";

import { Page } from "@components/layouts/page";
import { Button } from "@web-playground/ui/shadcn/components/button";
import { Card } from "@web-playground/ui/shadcn/components/card";
import { Separator } from "@web-playground/ui/shadcn/components/separator";
import { Box } from "@web-playground/ui/system/base/box";
import { DataTable } from "@web-playground/ui/system/table";
import {
	ArrowLeftRight,
	Container as ContainerIcon,
	Gauge,
	Globe,
	MoveRight,
	Network,
} from "lucide-react";
import Link from "next/link";
import { BLOCKS } from "src/app/blocks/metadata";
import { TRANSACTIONS } from "src/app/transactions/metadata";
import { useLatestBlocks, useLatestTxs } from "src/utils";

const Dashboard = () => {
	// const chartdata = useChart();
	const { data: dataLatestBlocks, header: headerLatestBlocks } = useLatestBlocks();
	const { data: dataLatestTxs, header: headerLatestTxs } = useLatestTxs();

	return (
		<Page title="Dashboard">
			<Card className="flex flex-col space-x-5 p-2 md:flex-row">
				<div className="flex grow flex-col">
					<div className="flex gap-2 p-2">
						<ArrowLeftRight className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">Price</H5>
							<H4>$0,13</H4>
						</div>
					</div>

					<Separator className="my-2" />

					<div className="flex gap-2 p-2">
						<Globe className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">MarketCap</H5>
							<H4>$293,199,950,773.00</H4>
						</div>
					</div>

					<Separator className="my-2 block md:hidden" />
				</div>

				<Separator orientation="vertical" className="h-auto" />

				<div className="flex grow flex-col">
					<div className="flex gap-2 p-2">
						<Gauge className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">Circulating Supply</H5>
							<H4>421,164,409</H4>
						</div>
					</div>

					<Separator className="my-2" />

					<div className="flex gap-2 p-2">
						<ContainerIcon className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">Latest Block</H5>
							<H4>#256</H4>
						</div>
					</div>
				</div>

				<Separator orientation="vertical" className="h-auto" />

				<div className="flex grow flex-col">
					<div className="flex gap-2 p-2">
						<Gauge className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">Transactions</H5>
							<H4>2,220.48 M</H4>
						</div>
					</div>

					<Separator className="my-2" />

					<div className="flex gap-2 p-2">
						<Network className="w-8 md:w-4" />
						<div>
							<H5 className="block pt-[1px] text-muted-foreground">Validators</H5>
							<H4>23</H4>
						</div>
					</div>
				</div>

				<Separator orientation="vertical" className="h-auto" />

				<div className="animate-fade flex flex-col p-2 md:w-96">
					<div className="flex items-center gap-1 pb-[5px] text-muted-foreground">
						<H5>Activity</H5>
						<H6>(Txs in the last 14 days)</H6>
					</div>

					{/* <AreaChart
						className="h-full animate-long-fadeIn"
						data={chartdata}
						index="date"
						showLegend={false}
						showYAxis={false}
						showXAxis={false}
						showGridLines={false}
						autoMinValue={true}
						categories={["Price"]}
						colors={["slate"]}
						yAxisWidth={40}
					/> */}
				</div>
			</Card>

			<Box className="h-12" />

			<div className="grid grid-cols-8 gap-y-16 sm:gap-x-16">
				<div className="col-span-full lg:col-span-4 space-y-4">
					<div className="flex justify-between">
						<H1 className="font-bold tracking-tight">Latest Blocks</H1>
						<div className="flex place-self-end">
							<Button
								asChild
								variant="ghost"
								className="group m-0 mr-4 h-auto gap-2 p-0 hover:bg-transparent"
							>
								<Link href={BLOCKS.href}>
									<H5>View all</H5>
									<MoveRight className="h-4 w-4 transform self-center transition duration-700 group-hover:translate-x-2" />
								</Link>
							</Button>
						</div>
					</div>

					<DataTable columns={headerLatestBlocks} data={dataLatestBlocks} />
				</div>

				<div className="col-span-full lg:col-span-4 space-y-4">
					<div className="flex justify-between">
						<H1 className="font-bold tracking-tight">Latest Transactions</H1>
						<div className="flex place-self-end">
							<Button
								asChild
								variant="ghost"
								className="group m-0 mr-4 h-auto gap-2 p-0 hover:bg-transparent"
							>
								<Link href={TRANSACTIONS.href}>
									<H5>View all</H5>
									<MoveRight className="h-4 w-4 transform self-center transition duration-700 group-hover:translate-x-2" />
								</Link>
							</Button>
						</div>
					</div>

					<DataTable columns={headerLatestTxs} data={dataLatestTxs} />
				</div>
			</div>
		</Page>
	);
};

export default Dashboard;
