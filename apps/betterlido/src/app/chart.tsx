"use client";

import { Format } from "@0xbuidlerhq/core";
import { Switch } from "@0xbuidlerhq/ui/shadcn/components/switch";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H4, H6, H7 } from "@0xbuidlerhq/ui/system/base/typography";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	type DotProps,
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
	userBalance: { stroke: "#fbbf24", textClass: "text-amber-400" },
	apr: { stroke: "#60a5fa", textClass: "text-blue-400" },
	rewardsEth: { stroke: "#22c55e", textClass: "text-green-500" },
	totalPooledEth: { stroke: "#a5b4fc", textClass: "text-indigo-200" },
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
	maxFractionDigits = 3,
}: {
	value: number | string;
	textClass: string;
	maxFractionDigits?: number;
}) => {
	const text = typeof value === "string" ? value : formatEthDisplay(value, maxFractionDigits);

	return (
		<Box className="flex items-baseline gap-1">
			<H6 className={textClass}>{text}</H6>
			<H7 className={cn("font-syne font-bold")}>ETH</H7>
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
	plusCount: number;
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
		<Box className="min-w-[220px] max-w-[280px] bg-muted/90 rounded-xl backdrop-blur-xs py-4 px-4 text-xs border border-accent">
			<H4 className="font-semibold">{dateLabel}</H4>

			<Box className="my-2 border-t border-white/10" />

			<Box className="grid gap-0">
				<Box className="flex items-center">
					<H6 className="text-muted-foreground">User balance:&nbsp;</H6>

					<EthValue textClass={seriesColors.userBalance.textClass} value={data.userBalance} />
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">APR:&nbsp;</H6>

					<H6 className={seriesColors.apr.textClass}>{data.apr.toFixed(2)}%</H6>
				</Box>

				<Box className="my-2 border-t border-white/10" />

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

					<H6 className={seriesColors.rewardsEth.textClass}>${data.rewardsUsd.toFixed(2)}</H6>
				</Box>

				<Box className="my-2 border-t border-white/10" />

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Total pooled:&nbsp;</H6>

					<EthValue
						textClass={seriesColors.totalPooledEth.textClass}
						value={formatTotalPooledValue(data.raw.totalPooledEtherAfter)}
					/>
				</Box>

				<Box className="flex items-center">
					<H6 className="text-muted-foreground">Pool share:&nbsp;</H6>

					<H6 className={seriesColors.poolSharePercent.textClass}>
						{data.poolSharePercent.toFixed(4)}%
					</H6>
				</Box>

				<Box className="my-2 border-t border-white/10" />

				<Box>
					<H6 className="text-muted-foreground">Block: {data.raw.block}</H6>
					<H6 className="text-muted-foreground">Epoch day: {data.raw.epochDays}</H6>
					<H6 className="text-muted-foreground">Epoch full days: {data.raw.epochFullDays}</H6>
				</Box>
			</Box>
		</Box>
	);
};

const LegendContent = () => {
	const items = [
		{
			key: "userBalance",
			label: "User balance (stETH)",
			dotClass: "bg-amber-400",
			textClass: seriesColors.userBalance.textClass,
		},
		{
			key: "rewardsEth",
			label: "Rewards (stETH)",
			dotClass: "bg-emerald-400",
			textClass: seriesColors.rewardsEth.textClass,
		},
		{
			key: "apr",
			label: "APR (%)",
			dotClass: "bg-blue-400",
			textClass: seriesColors.apr.textClass,
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

type LineDotProps = DotProps & { payload?: ChartPoint };

const renderMilestoneDot = (props: LineDotProps): React.ReactElement<SVGElement> => {
	const { cx, cy, payload } = props;
	const count = payload?.plusCount ?? 0;

	if (count <= 0 || cx == null || cy == null) {
		return <g key={`${cx}${cy}`} style={{ display: "none" }} />;
	}

	return (
		<g key={`${cx}${cy}`} transform={`translate(${cx}, ${cy - 5})`} pointerEvents="none">
			{Array.from({ length: count }).map((_, idx) => (
				<text
					key={idx}
					x={0}
					y={-8 - idx * 14}
					fill={"gold"}
					fontSize={16}
					fontWeight={800}
					textAnchor="middle"
					dominantBaseline="central"
				>
					+
				</text>
			))}
		</g>
	);
};

export const RewardChart = ({ events, address }: { events: RewardEvent[]; address?: string }) => {
	// Ensure chronological order so milestone detection is deterministic
	const sorted = [...events].sort((a, b) => Number(a.blockTime) - Number(b.blockTime));

	const storageKey = useMemo(
		() => `rewardChart:milestones:${(address ?? "default").toLowerCase()}`,
		[address],
	);

	const [showMilestones, setShowMilestones] = useState(true);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = window.localStorage.getItem(storageKey);
		if (stored !== null) {
			setShowMilestones(stored === "true");
		}
	}, [storageKey]);

	const toggleMilestones = (next: boolean) => {
		setShowMilestones(next);
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(storageKey, String(next));
		} catch {
			// ignore storage failures (private mode, etc.)
		}
	};

	let lastHundredthBucket = Number.NEGATIVE_INFINITY; // 0.01 steps
	let lastTenthBucket = Number.NEGATIVE_INFINITY; // 0.1 steps
	let lastUnitBucket = Number.NEGATIVE_INFINITY; // 1.0 steps
	const chartData: ChartPoint[] = [];

	sorted.forEach((e, index) => {
		const timestamp = parseInt(e.blockTime, 10) * 1000;
		const dateLabel = new Date(timestamp).toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		});
		const totalPooledEth = toEtherNumber(e.totalPooledEtherAfter);
		const userBalance = toEtherNumber(e.balance);

		const currentHundredth = Math.floor(userBalance * 100); // 0.01 buckets
		const currentTenth = Math.floor(userBalance * 10); // 0.1 buckets
		const currentUnit = Math.floor(userBalance); // 1.0 buckets

		let plusCount = 0;
		if (index === 0) {
			lastHundredthBucket = currentHundredth;
			lastTenthBucket = currentTenth;
			lastUnitBucket = currentUnit;
		} else {
			if (currentUnit > lastUnitBucket) {
				plusCount = 3;
				lastUnitBucket = currentUnit;
				// also update lower buckets to avoid duplicate triggers
				lastTenthBucket = Math.max(lastTenthBucket, currentTenth);
				lastHundredthBucket = Math.max(lastHundredthBucket, currentHundredth);
			} else if (currentTenth > lastTenthBucket) {
				plusCount = 2;
				lastTenthBucket = currentTenth;
				lastHundredthBucket = Math.max(lastHundredthBucket, currentHundredth);
			} else if (currentHundredth > lastHundredthBucket) {
				plusCount = 1;
				lastHundredthBucket = currentHundredth;
			}
		}

		chartData.push({
			timestamp,
			date: dateLabel,
			apr: Number(e.apr),
			rewardsEth: toEtherNumber(e.rewards),
			rewardsUsd: Number(e.currencyChange),
			totalPooledEth,
			userBalance,
			poolSharePercent: totalPooledEth > 0 ? (userBalance / totalPooledEth) * 100 : 0,
			plusCount,
			raw: e,
		});
	});

	return (
		<Box className="h-[500px] w-full">
			<Container className="flex justify-start gap-4 mb-2">
				<H6 className="text-muted-foreground">Show milestones</H6>
				<Switch checked={showMilestones} onCheckedChange={toggleMilestones} />
			</Container>

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
						<linearGradient id="userBalanceGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
							<stop offset="100%" stopColor="white" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="poolShareGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#f472b6" stopOpacity={0.35} />
							<stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
						</linearGradient>
					</defs>

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

					<YAxis
						yAxisId="right"
						orientation="right"
						stroke="rgba(255,255,255,0.6)"
						tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
						tickFormatter={(value: number) => `${formatEthDisplay(value)} ETH`}
					/>

					<Tooltip content={<CustomTooltip />} />

					<Legend content={<LegendContent />} verticalAlign="top" align="right" />

					{/* Area under user balance */}
					<Area
						yAxisId="right"
						dataKey="userBalance"
						name="User balance (ETH)"
						stroke="none"
						fill="url(#userBalanceGradient)"
						dot={false}
						activeDot={false}
					/>

					<Line
						yAxisId="right"
						dataKey="userBalance"
						name="User balance (ETH)"
						stroke={seriesColors.userBalance.stroke}
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						dot={showMilestones ? renderMilestoneDot : false}
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

					<Line
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

					{/* Blue fill under APR curve */}
					<Area
						yAxisId="left"
						type="monotone"
						dataKey="apr"
						name="APR (%)"
						stroke="none"
						fill="url(#aprGradient)"
						dot={false}
						activeDot={false}
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
				</AreaChart>
			</ResponsiveContainer>
		</Box>
	);
};
