"use client";

import { EthereumLogo } from "@0xbuidlerhq/assets/crypto/ethereum/Logo";
import { Format } from "@0xbuidlerhq/core";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H4, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import type React from "react";
import {
	Area,
	AreaChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatEther } from "viem";

export interface RewardEvent {
	apr: string;
	block: string;
	blockTime: string;
	id: string;
	logIndex: string;
	totalPooledEtherAfter: string;
	totalPooledEtherBefore: string;
	totalSharesAfter: string;
	totalSharesBefore: string;
	epochDays: string;
	epochFullDays: string;
	type: "reward";
	reportShares: string;
	balance: string;
	rewards: string;
	change: string;
	currencyChange: string;
}

// ------- Helpers for ETH formatting ------- //

const toEtherNumber = (value: string): number => {
	try {
		// Try treating it as wei
		return Number(formatEther(BigInt(value)));
	} catch {
		// Fallback if it's already a decimal string
		return Number(value);
	}
};

const formatEthDisplay = (value: number, maximumFractionDigits = 2): string => {
	if (!Number.isFinite(value)) return "-";
	return new Intl.NumberFormat(undefined, {
		maximumFractionDigits,
	}).format(value);
};

const formatTotalPooledValue = (rawWei: string): string => {
	try {
		// Use shared formatter to keep consistency with the rest of the app
		return Format.FormatBeauty(BigInt(rawWei));
	} catch {
		// Fallback to the local formatter if the bigint parse fails
		return formatEthDisplay(toEtherNumber(rawWei));
	}
};

const seriesColors = {
	apr: { stroke: "#60a5fa", textClass: "text-blue-400" },
	rewardsEth: { stroke: "#22c55e", textClass: "text-green-500" },
	totalPooledEth: { stroke: "#a5b4fc", textClass: "text-indigo-200" },
	userBalance: { stroke: "#ffffff", textClass: "text-white" },
	poolSharePercent: { stroke: "#f472b6", textClass: "text-pink-400" },
} as const;

const formatFullDate = (timestamp: number) =>
	new Date(timestamp).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

const EthValue = ({
	value,
	textClass,
	maxFractionDigits = 2,
}: {
	value: number | string;
	textClass: string;
	maxFractionDigits?: number;
}) => {
	const text = typeof value === "string" ? value : formatEthDisplay(value, maxFractionDigits);

	return (
		<Box className="flex items-center gap-1">
			<H5 className={textClass}>{text}</H5>
			<EthereumLogo className="size-4" />
		</Box>
	);
};

// ------- Chart data type ------- //

type ChartPoint = {
	timestamp: number;
	date: string;
	apr: number;
	rewardsEth: number;
	rewardsUsd: number;
	totalPooledEth: number;
	userBalance: number;
	poolSharePercent: number;
	raw: RewardEvent;
};

// ------- Custom tooltip ------- //

type TooltipProps = {
	active?: boolean;
	payload?: any[];
	label?: string;
};

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
	if (!active || !payload || payload.length === 0) return null;

	const data = payload[0].payload as ChartPoint;
	const dateLabel = formatFullDate(data.timestamp);

	return (
		<Box className="min-w-[220px] max-w-[280px] bg-muted/50 rounded backdrop-blur-xs p-4 text-xs rounded">
			<H4 className="font-semibold">{dateLabel}</H4>

			<Box className="my-2 border-t border-white/10" />

			<Box className="grid gap-1">
				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Rewards:&nbsp;</H6>

					<EthValue
						textClass={seriesColors.rewardsEth.textClass}
						value={data.rewardsEth}
						maxFractionDigits={8}
					/>
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Rewards value:&nbsp;</H6>

					<H5 className={seriesColors.rewardsEth.textClass}>${data.rewardsUsd.toFixed(2)}</H5>
				</Box>

				<Box className="my-2 border-t border-white/10" />

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">APR:&nbsp;</H6>

					<H5 className={seriesColors.apr.textClass}>{data.apr.toFixed(2)}%</H5>
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Total pooled:&nbsp;</H6>

					<EthValue
						textClass={seriesColors.totalPooledEth.textClass}
						value={formatTotalPooledValue(data.raw.totalPooledEtherAfter)}
					/>
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">User balance:&nbsp;</H6>

					<EthValue textClass={seriesColors.userBalance.textClass} value={data.userBalance} />
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Pool share:&nbsp;</H6>

					<H5 className={seriesColors.poolSharePercent.textClass}>
						{data.poolSharePercent.toFixed(4)}%
					</H5>
				</Box>
			</Box>

			<Box className="my-2 border-t border-white/10" />

			<Box className="text-[11px] text-white/70">
				<H6>Block: {data.raw.block}</H6>
				<H6>Epoch day: {data.raw.epochDays}</H6>
				<H6>Epoch full days: {data.raw.epochFullDays}</H6>
			</Box>
		</Box>
	);
};

const LegendContent = () => {
	const items = [
		{
			key: "apr",
			label: "APR (%)",
			dotClass: "bg-blue-400",
			textClass: seriesColors.apr.textClass,
		},
		{
			key: "rewardsEth",
			label: "Rewards (ETH)",
			dotClass: "bg-green-500",
			textClass: seriesColors.rewardsEth.textClass,
		},
		{
			key: "userBalance",
			label: "User balance (ETH)",
			dotClass: "bg-white",
			textClass: seriesColors.userBalance.textClass,
		},
		{
			key: "poolSharePercent",
			label: "Pool share (%)",
			dotClass: "bg-pink-400",
			textClass: seriesColors.poolSharePercent.textClass,
		},
		{
			key: "totalPooledEth",
			label: "Total pooled (ETH)",
			dotClass: "bg-indigo-200",
			textClass: seriesColors.totalPooledEth.textClass,
		},
	];

	return (
		<Box className="flex flex-wrap justify-end gap-3 text-xs text-white/80 mb-10 mr-10">
			{items.map((item) => (
				<Box key={item.key} className="flex items-center gap-2">
					<span className={`h-2 w-2 rounded-full ${item.dotClass}`} />
					<H6 className={item.textClass}>{item.label}</H6>
				</Box>
			))}
		</Box>
	);
};

// ------- Main chart component ------- //

export const RewardChart = ({ events }: { events: RewardEvent[] }) => {
	const chartData: ChartPoint[] = events.map((e) => {
		const timestamp = parseInt(e.blockTime, 10) * 1000;
		const dateLabel = new Date(timestamp).toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		});
		const totalPooledEth = toEtherNumber(e.totalPooledEtherAfter);
		const userBalance = toEtherNumber(e.balance);

		return {
			timestamp,
			date: dateLabel,
			apr: Number(e.apr),
			rewardsEth: toEtherNumber(e.rewards),
			rewardsUsd: Number(e.currencyChange),
			totalPooledEth,
			userBalance,
			poolSharePercent: totalPooledEth > 0 ? (userBalance / totalPooledEth) * 100 : 0,
			raw: e,
		};
	});

	return (
		<Box className="h-[500px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id="rewardsGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
							<stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="aprGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
							<stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
						</linearGradient>
					</defs>

					{/* <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" /> */}

					<XAxis
						dataKey="date"
						stroke="rgba(255,255,255,0.6)"
						tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
					/>

					<YAxis
						yAxisId="left"
						orientation="left"
						stroke="rgba(255,255,255,0.6)"
						tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
						tickFormatter={(value: number) => `${value}%`}
					/>

					{/* Dedicated axis for rewards so small values don't flatten against larger ETH numbers */}
					<YAxis yAxisId="rewards" hide domain={["auto", "auto"]} />

					{/* Separate axis for pool share so tiny percentages get their own scale */}
					<YAxis yAxisId="poolShare" hide domain={["auto", "auto"]} />

					<YAxis
						yAxisId="right"
						orientation="right"
						stroke="rgba(255,255,255,0.6)"
						tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
						tickFormatter={(value: number) => `${formatEthDisplay(value)} ETH`}
					/>

					<Tooltip content={<CustomTooltip />} />

					<Legend content={<LegendContent />} verticalAlign="top" align="right" />

					{/* Flashy white curve for user balance */}
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="userBalance"
						name="User balance (ETH)"
						stroke={seriesColors.userBalance.stroke}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>

					{/* Area for rewards (ETH) */}
					<Area
						yAxisId="rewards"
						type="monotone"
						dataKey="rewardsEth"
						name="Rewards (ETH)"
						stroke={seriesColors.rewardsEth.stroke}
						fill="url(#rewardsGradient)"
						strokeWidth={1}
						dot={false}
						activeDot={{ r: 4 }}
					/>

					{/* Line for APR (%) */}
					<Line
						yAxisId="left"
						type="monotone"
						dataKey="apr"
						name="APR (%)"
						stroke={seriesColors.apr.stroke}
						strokeWidth={1}
						dot={false}
						activeDot={{ r: 4 }}
					/>

					{/* Pool share percentage line */}
					<Line
						yAxisId="poolShare"
						type="monotone"
						dataKey="poolSharePercent"
						name="Pool share (%)"
						stroke={seriesColors.poolSharePercent.stroke}
						strokeWidth={1}
						dot={false}
						activeDot={{ r: 4 }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</Box>
	);
};
