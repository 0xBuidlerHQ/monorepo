"use client";

import { EthereumLogo } from "@0xbuidlerhq/assets/crypto/ethereum/Logo";
import { Format } from "@0xbuidlerhq/core";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import type React from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
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
	apr: "#60a5fa",
	rewardsEth: "#22c55e",
	totalPooledEth: "#a5b4fc",
	userBalance: "#ffffff",
	poolSharePercent: "#f472b6",
} as const;

const EthValue = ({
	value,
	color,
	maxFractionDigits = 2,
}: {
	value: number | string;
	color: string;
	maxFractionDigits?: number;
}) => {
	const text = typeof value === "string" ? value : formatEthDisplay(value, maxFractionDigits);

	return (
		<Box className="flex items-center gap-1">
			<strong style={{ color }}>{text}</strong>
			<EthereumLogo className="size-4" />
		</Box>
	);
};

// ------- Chart data type ------- //

type ChartPoint = {
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

	return (
		<div
			style={{
				background: "#0b1020",
				border: "1px solid rgba(255,255,255,0.06)",
				borderRadius: 12,
				padding: "10px 12px",
				boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
				color: "white",
				minWidth: 220,
				maxWidth: 280,
				fontSize: 12,
			}}
		>
			<div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
			<div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>Epoch rewards snapshot</div>

			<div style={{ display: "grid", gap: 4 }}>
				<Box className="flex items-center">
					<span style={{ opacity: 0.7 }}>Rewards:&nbsp;</span>
					<EthValue color={seriesColors.rewardsEth} value={data.rewardsEth} maxFractionDigits={8} />
				</Box>

				<div>
					<span style={{ opacity: 0.7 }}>Rewards value:&nbsp;</span>
					<strong style={{ color: seriesColors.rewardsEth }}>${data.rewardsUsd.toFixed(2)}</strong>
				</div>

				<div>
					<span style={{ opacity: 0.7 }}>APR:&nbsp;</span>
					<strong style={{ color: seriesColors.apr }}>{data.apr.toFixed(2)}%</strong>
				</div>

				<Box className="flex items-center">
					<span style={{ opacity: 0.7 }}>Total pooled:&nbsp;</span>
					<EthValue
						color={seriesColors.totalPooledEth}
						value={formatTotalPooledValue(data.raw.totalPooledEtherAfter)}
					/>
				</Box>

				<Box className="flex items-center">
					<span style={{ opacity: 0.7 }}>User balance:&nbsp;</span>
					<EthValue color={seriesColors.userBalance} value={data.userBalance} />
				</Box>

				<div>
					<span style={{ opacity: 0.7 }}>Pool share:&nbsp;</span>
					<strong style={{ color: seriesColors.poolSharePercent }}>
						{data.poolSharePercent.toFixed(4)}%
					</strong>
				</div>
			</div>

			<hr
				style={{
					border: "none",
					borderTop: "1px solid rgba(255,255,255,0.08)",
					margin: "8px 0",
				}}
			/>

			{/* Extra raw info if you want "all the data" accessible */}
			<div style={{ fontSize: 11, opacity: 0.7 }}>
				<div>Block: {data.raw.block}</div>
				<div>Epoch day: {data.raw.epochDays}</div>
				<div>Epoch full days: {data.raw.epochFullDays}</div>
			</div>
		</div>
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
		<div
			style={{
				width: "100%",
				height: 500,
			}}
		>
			<div style={{ marginBottom: 12 }}>
				<div style={{ fontSize: 18, fontWeight: 600 }}>Staking Rewards & APR</div>
				<div style={{ fontSize: 12, opacity: 0.7 }}>
					APR · rewards · total pooled · user balance · pool share
				</div>
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 8 }}>
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

					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

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

					<Legend
						verticalAlign="top"
						align="right"
						wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}
					/>

					{/* Area for rewards (ETH) */}
					<Area
						yAxisId="rewards"
						type="monotone"
						dataKey="rewardsEth"
						name="Rewards (ETH)"
						stroke="#22c55e"
						fill="url(#rewardsGradient)"
						strokeWidth={2}
						activeDot={{ r: 6 }}
						dot={false}
					/>

					{/* Line for APR (%) */}
					<Line
						yAxisId="left"
						type="monotone"
						dataKey="apr"
						name="APR (%)"
						stroke="#60a5fa"
						strokeWidth={2.5}
						dot={false}
						activeDot={{ r: 6 }}
					/>

					{/* Flashy white curve for user balance */}
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="userBalance"
						name="User balance (ETH)"
						stroke="#ffffff"
						strokeWidth={2.5}
						dot={false}
						activeDot={{ r: 6 }}
					/>

					{/* Pool share percentage line */}
					<Line
						yAxisId="poolShare"
						type="monotone"
						dataKey="poolSharePercent"
						name="Pool share (%)"
						stroke="#f472b6"
						strokeWidth={2.5}
						dot={false}
						activeDot={{ r: 6 }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};
