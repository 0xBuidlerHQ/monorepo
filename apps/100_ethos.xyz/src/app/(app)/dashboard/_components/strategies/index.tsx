"use client";

import { Format, Web3 } from "@0xbuidlerhq/core/index";
import { cn } from "@0xbuidlerhq/ui/shadcn/lib/utils";
import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H1_1, H4, H5, H6 } from "@0xbuidlerhq/ui/system/base/typography";
import { Card } from "@0xbuidlerhq/ui/system/cards/card";
import { DashboardSection } from "@app/(app)/dashboard/_components/_shared/section";
import { StategyChart } from "@app/(app)/dashboard/_components/strategies/chart";
import { HoverGrid } from "@client/components/hoverGrid";
import { Cpu, type LucideIcon, Pause, Plane, Play, Sparkles, X } from "lucide-react";

type StategyData = {
	strategy: {
		label: string;
		icon: LucideIcon;
	};

	risk: {
		level: "very low" | "low" | "normal" | "high" | "very high";
	};

	exposure: {
		protocols: Web3.Protocols.ProtocolMetadata[];
		tokens: Web3.Tokens.SimpleTokenMetadata[];
		networks: Web3.Networks.NetworkMetadata[];
	};

	initialCapital: {
		totalAmountInUsd: number;

		amounts: {
			amount: bigint;
			token: Web3.Tokens.SimpleTokenMetadata;
		}[];
	};

	capital: {
		totalAmountInUsd: number;

		amounts: {
			amount: bigint;
			token: Web3.Tokens.SimpleTokenMetadata;
		}[];
	};

	status: "active" | "running" | "paused" | "stopped";
	actions: {
		icon: LucideIcon;
		iconClassname: string;
		iconContainerClassname: string;
		//
		action: Function;
		//
		label: string;
	}[];
};

const data: StategyData[] = [
	{
		strategy: {
			icon: Sparkles,
			label: "My USDC",
		},
		status: "active",
		risk: {
			level: "very low",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdc")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 100000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdc")!,
				},
				// {
				// 	amount: 1000000000n,
				// 	token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				// },
			],
		},
		actions: [
			{
				label: "Pause",
				icon: Pause,
				iconClassname: "text-yellow-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-yellow-300/20 border-yellow-500/50",
					"dark:bg-yellow-900/20 dark:border-yellow-500/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My ETH",
		},
		status: "paused",
		risk: {
			level: "low",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 100000000000000000000n,
					token: Web3.Tokens.simpleTokenMetadata("eth")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000000000n,
					token: Web3.Tokens.simpleTokenMetadata("eth")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My OP",
		},
		status: "running",
		risk: {
			level: "normal",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 100000000000000000000n,
					token: Web3.Tokens.simpleTokenMetadata("op")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000000n,
					token: Web3.Tokens.simpleTokenMetadata("op")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
	{
		strategy: {
			icon: Plane,
			label: "My USDT",
		},
		status: "stopped",
		risk: {
			level: "very high",
		},
		exposure: {
			protocols: [Web3.Protocols.protocolMetadata("aave")!],
			tokens: [Web3.Tokens.simpleTokenMetadata("eth")!, Web3.Tokens.simpleTokenMetadata("usdc")!],
			networks: [
				Web3.Networks.networkMetadata("base")!,
				Web3.Networks.networkMetadata("ethereum")!,
			],
		},
		initialCapital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 10000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		capital: {
			totalAmountInUsd: 1000,
			amounts: [
				{
					amount: 1000000000n,
					token: Web3.Tokens.simpleTokenMetadata("usdt")!,
				},
			],
		},
		actions: [
			{
				label: "Play",
				icon: Play,
				iconClassname: "text-green-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-green-300/20 border-green-500/50",
					"dark:bg-green-900/20 dark:border-green-300/20",
				),
				action: () => {},
			},
			{
				label: "Stop",
				icon: X,
				iconClassname: "text-red-500",
				iconContainerClassname: cn(
					"p-[3px] rounded border",
					"bg-red-300/20 border-red-500/50",
					"dark:bg-red-900/20 dark:border-red-500/20",
				),
				action: () => {},
			},
		],
	},
];
const getColorClasses = (color: string) => {
	const colorMap = {
		cyan: {
			bg: "bg-[oklch(0.93_0.05_200)]",
			border: "border-[oklch(0.88_0.06_200)]",
			text: "text-[oklch(0.6_0.09_200)]",
			hover: "hover:bg-[oklch(0.95_0.04_200)] hover:border-[oklch(0.85_0.07_200)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.07_200_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.06_200_/_0.5)] from-2.5% to-20% to-primary-foreground",
		},
		purple: {
			bg: "bg-[oklch(0.93_0.05_300)]",
			border: "border-[oklch(0.88_0.06_300)]",
			text: "text-[oklch(0.6_0.09_300)]",
			hover: "hover:bg-[oklch(0.95_0.04_300)] hover:border-[oklch(0.85_0.07_300)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.07_300_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.06_300_/_0.5)] from-2.5% to-20% to-primary-foreground",
		},
		green: {
			bg: "bg-[oklch(0.93_0.05_150)]",
			border: "border-[oklch(0.88_0.06_150)]",
			text: "text-[oklch(0.6_0.09_150)]",
			hover: "hover:bg-[oklch(0.95_0.04_150)] hover:border-[oklch(0.85_0.07_150)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.07_150_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.06_150_/_0.5)] from-2.5% to-20% to-primary-foreground",
		},
		orange: {
			bg: "bg-[oklch(0.93_0.06_70)]",
			border: "border-[oklch(0.88_0.07_70)]",
			text: "text-[oklch(0.6_0.1_70)]",
			hover: "hover:bg-[oklch(0.95_0.05_70)] hover:border-[oklch(0.85_0.08_70)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.08_70_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.07_70_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		red: {
			bg: "bg-[oklch(0.93_0.06_25)]",
			border: "border-[oklch(0.88_0.07_25)]",
			text: "text-[oklch(0.6_0.1_25)]",
			hover: "hover:bg-[oklch(0.95_0.05_25)] hover:border-[oklch(0.85_0.08_25)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.08_25_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.07_25_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		pink: {
			bg: "bg-[oklch(0.93_0.06_340)]",
			border: "border-[oklch(0.88_0.07_340)]",
			text: "text-[oklch(0.6_0.1_340)]",
			hover: "hover:bg-[oklch(0.95_0.05_340)] hover:border-[oklch(0.85_0.08_340)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.08_340_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.07_340_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		blue: {
			bg: "bg-[oklch(0.93_0.05_250)]",
			border: "border-[oklch(0.88_0.06_250)]",
			text: "text-[oklch(0.6_0.09_250)]",
			hover: "hover:bg-[oklch(0.95_0.04_250)] hover:border-[oklch(0.85_0.07_250)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.07_250_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.06_250_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		yellow: {
			bg: "bg-[oklch(0.95_0.07_95)]",
			border: "border-[oklch(0.9_0.08_95)]",
			text: "text-[oklch(0.65_0.1_95)]",
			hover: "hover:bg-[oklch(0.97_0.06_95)] hover:border-[oklch(0.87_0.09_95)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.87_0.09_95_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.9_0.08_95_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		slate: {
			bg: "bg-[oklch(0.93_0.02_250)]",
			border: "border-[oklch(0.88_0.025_250)]",
			text: "text-[oklch(0.6_0.03_250)]",
			hover: "hover:bg-[oklch(0.95_0.015_250)] hover:border-[oklch(0.85_0.025_250)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0.025_250_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0.025_250_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		gray: {
			bg: "bg-[oklch(0.93_0_0)]",
			border: "border-[oklch(0.88_0_0)]",
			text: "text-[oklch(0.6_0_0)]",
			hover: "hover:bg-[oklch(0.95_0_0)] hover:border-[oklch(0.85_0_0)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.85_0_0_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.88_0_0_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
		black: {
			bg: "bg-[oklch(0.2_0_0)]",
			border: "border-[oklch(0.3_0_0)]",
			text: "text-[oklch(0.75_0_0)]",
			hover: "hover:bg-[oklch(0.25_0_0)] hover:border-[oklch(0.35_0_0)]",
			glow: "hover:shadow-[0_0_8px_oklch(0.3_0_0_/0.6)]",
			gradientTopToBottom:
				"bg-gradient-to-b from-[oklch(0.3_0_0_/_0.5)] from-2.5% to-[60px] to-primary-foreground",
		},
	};

	return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
};

const Strategies = () => {
	return (
		<DashboardSection title="STRATEGIES" icon={Cpu}>
			<Test />
		</DashboardSection>
	);
};

type StrategyCardProps = StategyData;
const Cardd = (props: StrategyCardProps) => {
	const statusData = (() => {
		switch (props.status) {
			case "active":
				return {
					label: "ACTIVE",
					style: getColorClasses("green"),
				};
			case "paused":
				return {
					label: "PAUSED",
					style: getColorClasses("yellow"),
				};
			case "running":
				return {
					label: "RUNNING",
					style: getColorClasses("slate"),
				};
			case "stopped":
				return {
					label: "STOPPED",
					style: getColorClasses("red"),
				};
		}
	})();

	return (
		<Card
			className={cn(
				"flex flex-col relative p-0 rounded-lg overflow-clip group",
				statusData.style.gradientTopToBottom,
			)}
		>
			<Box className="absolute top-3 left-3">
				<CardStatus {...props} />
			</Box>

			<Box className="h-30 pointer-events-none">
				<StategyChart />
			</Box>

			<Box className="flex flex-col p-4 pt-0 grow">
				<Box className="flex justify-between items-start mb-4">
					<Box className="grow basis-0">
						<CardBalance {...props} />
					</Box>
				</Box>

				<Box className="grow mb-4">
					<CardTokens {...props} />
				</Box>

				<Box className="flex justify-between items-center">
					<Box className="grow basis-0">
						<CardChains {...props} />
					</Box>

					<Box className="flex flex-col gap-2">
						<CardRisk {...props} />
					</Box>

					<Box className="grow basis-0 flex justify-end">
						<CardPerformance {...props} />
					</Box>
				</Box>
			</Box>
		</Card>
	);
};

const CardBalance = (props: StrategyCardProps) => {
	return (
		<Box className="flex flex-col gap-2">
			<H5 className="tracking-tighter text-muted-foreground">Top Strate 007</H5>

			<H1_1 className="text-primary font-numbers tracking-tighter font-semibold">
				{Format.FormatUSD.classic(11234)}
			</H1_1>
		</Box>
	);
};

const CardPerformance = (props: StrategyCardProps) => {
	const percent = 0.1;

	return (
		<Box className="flex flex-col gap-2">
			<H6 className="text-muted-foreground text-center">Performance</H6>

			<Box className="flex flex-col items-center gap-2">
				<H4 className="text-green-500 font-semibold">+ {Format.FormatPercent.format(percent)}</H4>
			</Box>
		</Box>
	);
};

const CardStatus = (props: StrategyCardProps) => {
	const statusData = (() => {
		switch (props.status) {
			case "active":
				return {
					label: "ACTIVE",
					labelClassname: getColorClasses("green").text,
					labelClassnameBorder: getColorClasses("green").border,
					labelContainerClassname: cn(getColorClasses("green").bg),
				};
			case "paused":
				return {
					label: "PAUSED",
					labelClassname: getColorClasses("yellow").text,
					labelClassnameBorder: getColorClasses("yellow").border,
					labelContainerClassname: cn(getColorClasses("yellow").bg),
				};
			case "running":
				return {
					label: "RUNNING",
					labelClassname: getColorClasses("slate").text,
					labelClassnameBorder: getColorClasses("slate").border,
					labelContainerClassname: cn(getColorClasses("slate").bg),
				};
			case "stopped":
				return {
					label: "STOPPED",
					labelClassname: getColorClasses("red").text,
					labelClassnameBorder: getColorClasses("red").border,
					labelContainerClassname: cn(getColorClasses("red").bg),
				};
		}
	})();

	return (
		<Box className="flex items-center gap-1">
			<Box
				className={cn(
					"py-[1px] px-2 bg-muted border rounded-full",
					statusData.labelContainerClassname,
					statusData.labelClassnameBorder,
				)}
			>
				<H6 className={cn("font-semibold text-[11px]!", statusData.labelClassname)}>
					{statusData.label}
				</H6>
			</Box>
		</Box>
	);
};

const CardTokens = (props: StrategyCardProps) => {
	return (
		<Box className="flex flex-col gap-2">
			<H6 className="text-muted-foreground">Asset(s)</H6>

			<Box className="flex flex-col gap-2">
				{props.capital.amounts.map((item) => {
					const { amount, token } = item;

					return (
						<Box key={token.id} className="flex gap-2 items-center">
							<Box>{token?.Logo && <token.Logo className="size-7" />}</Box>

							<Box className="flex flex-col gap-[2px]">
								<H6 className="font-semibold">{token.ticker}</H6>

								<H6 className="text-muted-foreground font-montserrat tracking-tighter">
									{Format.FormatNumber.format(
										Number(Format.FormatUnits.format(amount, token.decimals)),
									)}
								</H6>
							</Box>

							<Box className="grow" />

							<H4 className="font-medium font-montserrat tracking-tighter">
								{Format.FormatUSD.classic(1000)}
							</H4>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

const CardChains = (props: StrategyCardProps) => {
	return (
		<Box className="flex flex-col gap-2">
			<H6 className="text-muted-foreground">Exposure</H6>

			<Box className="flex">
				{props.exposure.networks.map((item) => {
					return (
						<Box
							key={item.id}
							className="flex gap-1 items-center first:ml-0 -ml-[10px] transition-all duration-500 group-hover:-ml-1"
						>
							<Box>{item?.Logo && <item.Logo className="size-5" />}</Box>
							{/* <H6 className="font-semibold text-primary/50 uppercase">{item.name}</H6> */}
						</Box>
					);
				})}

				{props.exposure.protocols.map((item) => {
					return (
						<Box
							key={item.id}
							className="flex gap-1 items-center first:ml-0 -ml-[10px] transition-all duration-500 group-hover:-ml-1"
						>
							{/* <H6 className="font-semibold text-primary/50 uppercase">{item.name}</H6> */}
							<Box>{item?.Logo && <item.Logo className="size-5" />}</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

const CardRisk = (props: StrategyCardProps) => {
	const riskData = (() => {
		switch (props.risk.level) {
			case "very low":
				return {
					label: "Very Low",
					labelClassname: getColorClasses("cyan").text,
					labelContainerClassname: cn(
						"border",
						getColorClasses("cyan").bg,
						getColorClasses("cyan").border,
					),
				};
			case "low":
				return {
					label: "Low",
					labelClassname: getColorClasses("green").text,
					labelContainerClassname: cn(
						"border",
						getColorClasses("green").bg,
						getColorClasses("green").border,
					),
				};
			case "normal":
				return {
					label: "Normal",
					labelClassname: getColorClasses("slate").text,
					labelContainerClassname: cn(
						"border",
						getColorClasses("slate").bg,
						getColorClasses("slate").border,
					),
				};
			case "high":
				return {
					label: "High",
					labelClassname: getColorClasses("yellow").text,
					labelContainerClassname: cn(
						"border",
						getColorClasses("orange").bg,
						getColorClasses("orange").border,
					),
				};
			case "very high":
				return {
					label: "Very High",
					labelClassname: getColorClasses("red").text,
					labelContainerClassname: cn(
						"border",
						getColorClasses("red").bg,
						getColorClasses("red").border,
					),
				};
		}
	})();

	return (
		<Box className="flex flex-col gap-2">
			<H6 className="text-muted-foreground text-center">Risk</H6>

			<Box className="rounded-md flex flex-col items-center gap-2">
				<Box className="flex">
					<Box className={cn("rounded-full bg-muted h-6 flex items-center")}>
						<H6 className={cn("flex px-[10px] font-medium text-muted-foreground h-4 items-center")}>
							{riskData.label}
						</H6>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

const Test = () => {
	return (
		<HoverGrid>
			{data.map((item, index) => {
				return <Cardd key={index} {...item} />;
			})}
		</HoverGrid>
	);
};

export { Strategies };
