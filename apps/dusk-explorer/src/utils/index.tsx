"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Check, Loader2, Plus } from "lucide-react";

import type { Banner } from "@components/banner";
import { Badge } from "@web-playground/ui/shadcn/components/badge";
import { Button } from "@web-playground/ui/shadcn/components/button";
import { Box } from "@web-playground/ui/system/base/box";
import { SP } from "@web-playground/ui/system/typography";
import Link from "next/link";
import { BLOCK } from "../app/blocks/[id]/metadata";
import { TRANSACTION } from "../app/transactions/[id]/metadata";

const shortcuts: { name: string; shortcut: string }[] = [
	{ name: "Todo", shortcut: "Todo" },
];

type Client = ReturnType<typeof useClient>;
const useClient = () => {
	const [mounted, setMounted] = useState(false);
	const usedTheme = useTheme();

	const router = useRouter();
	const fullRoute = usePathname().substring(1);
	const [route, subroute] = fullRoute.split("/");

	useEffect(() => {
		setMounted(true);
	}, []);

	const go = (path: string) => {
		router.push(`/${path}`);
	};

	const isRoute = (route: string) => {
		return fullRoute.includes(route);
	};

	const toggleTheme = () =>
		usedTheme.setTheme(usedTheme.theme === "dark" ? "light" : "dark");

	return {
		mounted,
		shortcuts,
		...usedTheme,
		isRoute,
		toggleTheme,
		fullRoute,
		route,
		subroute,
		go,
	};
};

const useBanner = (): Banner => {
	return {
		label: "This is an annoucement.",
	};
};

const timeAgo = (timestamp: number): string => {
	const now = Date.now();
	const secondsAgo = Math.floor((now - timestamp * 1000) / 1000);

	if (secondsAgo < 60) {
		return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`;
	}

	if (secondsAgo < 3600) {
		const minutesAgo = Math.floor(secondsAgo / 60);
		return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
	}

	if (secondsAgo < 86400) {
		const hoursAgo = Math.floor(secondsAgo / 3600);
		return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
	}

	const daysAgo = Math.floor(secondsAgo / 86400);
	return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
};

const useChart = () => {
	return [
		{
			date: "Jan 22",
			Price: 3000,
		},
		{
			date: "Feb 22",
			Price: 3100,
		},
		{
			date: "Mar 22",
			Price: 3322,
		},
		{
			date: "Apr 22",
			Price: 3470,
		},
		{
			date: "May 22",
			Price: 3475,
		},
		{
			date: "Jun 22",
			Price: 3129,
		},
	];
};

const useLatestBlocks = () => {
	type Block = {
		id: number;
		hash: string;
		timestamp: number;
		txsNb: number;
		averageFee: bigint;
		reward: bigint;
	};

	const data: Block[] = [
		{
			id: 1343343,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343344,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343345,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343346,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343347,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343348,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343349,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343350,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343351,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
		{
			id: 1343351,
			hash: "97d8999860e0bf06",
			timestamp: 1705075749,
			txsNb: 123,
			averageFee: BigInt(123456),
			reward: BigInt(16),
		},
	];

	const header: ColumnDef<Block>[] = [
		{
			header: "Block",
			cell: ({ row: { original: block } }) => (
				<Button
					asChild
					variant="ghost"
					className="h-auto p-0 hover:bg-transparent"
				>
					<Link href={BLOCK.href + block.id}>
						<Box>
							<SP className="font-semibold underline underline-offset-[3px]">
								{block.id}
							</SP>
							<div className="text-xs text-muted-foreground">
								{timeAgo(block.timestamp)}
							</div>
						</Box>
					</Link>
				</Button>
			),
		},
		{
			header: "Fee",
			cell: ({ row: { original: block } }) => (
				<div className="flex flex-col justify-center">
					<div className="text-[13px]">
						<span className="text-xs text-muted-foreground">Avg:</span>{" "}
						{block.averageFee.toString()}
					</div>
					<div className="text-[13px]">
						<span className="text-xs text-muted-foreground">Total:</span>{" "}
						{block.txsNb.toString()}
					</div>
				</div>
			),
		},
		{
			header: "Txn(s)",
			cell: ({ row: { original: block } }) => (
				<Badge variant="outline" className="gap-1 rounded-lg">
					<div className="">{block.txsNb}</div>
				</Badge>
			),
		},
		{
			header: "Reward",
			cell: ({ row: { original: block } }) => (
				<Badge variant="secondary" className="gap-1 rounded-lg">
					{block.reward.toString()}
					{/* <Image src={Logo} alt="" className="h-3 w-3 dark:invert" /> */}
				</Badge>
			),
		},
	];

	return {
		data,
		header,
	};
};

const useLatestTxs = () => {
	type Tx = {
		hash: string;
		timestamp: number;
		blockHash: string;
		gas: {
			gasPrice: bigint;
			gasLimit: bigint;
		};
		fee: bigint;
		type: string;
		status: "Success" | "Pending" | "Fail";
	};

	const data: Tx[] = [
		{
			hash: "0x1234567890x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Contract",
			status: "Pending",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Fail",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Contract",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
		{
			hash: "0x123456789",
			timestamp: 1705075749,
			blockHash: "0x123456789",
			gas: { gasPrice: BigInt(1234567890), gasLimit: BigInt(1705075749) },
			fee: BigInt(124),
			type: "Transfer",
			status: "Success",
		},
	];

	const header: ColumnDef<Tx>[] = [
		{
			header: "Hash",
			cell: ({ row: { original: block } }) => (
				<Button
					asChild
					variant="ghost"
					className="h-auto p-0 hover:bg-transparent"
				>
					<Link href={TRANSACTION.href + block.hash}>
						<div>
							<SP className="font-semibold underline underline-offset-[3px]">
								{shorten0x(block.hash)}
							</SP>
							<div className="text-xs text-muted-foreground">
								{timeAgo(block.timestamp)}
							</div>
						</div>
					</Link>
				</Button>
			),
		},
		{
			header: "Gas",
			accessorKey: "gas",
			cell: ({ row: { original: block } }) => (
				<div className="flex flex-col justify-center">
					<div className="text-[13px]">
						<span className="text-xs text-muted-foreground">Price:</span>{" "}
						{block.gas.gasPrice.toString()}
					</div>
					<div className="text-[13px]">
						<span className="text-xs text-muted-foreground">Limit:</span>{" "}
						{block.gas.gasLimit.toString()}
					</div>
				</div>
			),
		},
		{
			header: "Fee",
			cell: ({ row: { original: block } }) => (
				<Badge variant="secondary" className="gap-1 rounded-lg">
					<div className="">{block.fee.toString()}</div>
					{/* <Image src={Logo} alt="" className="h-3 w-3 dark:invert" /> */}
				</Badge>
			),
		},
		{
			header: "Type",
			cell: ({ row: { original: block } }) => (
				<Badge variant="default" className="rounded-lg">
					{block.type}
				</Badge>
			),
		},
		{
			header: "Status",
			cell: ({ row: { original: block } }) => {
				return (
					<>
						{block.status === "Success" && (
							<Badge
								variant="outline"
								className="rounded-full border-transparent bg-emerald-500 bg-opacity-20 p-1 text-emerald-500 dark:bg-emerald-700"
							>
								<Check className="h-3 w-3" />
							</Badge>
						)}

						{block.status === "Pending" && (
							<Badge
								variant="outline"
								className="rounded-full border-transparent bg-gray-500 bg-opacity-20 p-1 text-gray-500 dark:bg-gray-700"
							>
								<Loader2 className="h-3 w-3 animate-spin" />
							</Badge>
						)}

						{block.status === "Fail" && (
							<Badge
								variant="outline"
								className="rounded-full border-transparent bg-rose-500 bg-opacity-20 p-1 text-rose-500 dark:bg-rose-700"
							>
								<Plus className="h-3 w-3 rotate-45" />
							</Badge>
						)}
					</>
				);
			},
		},
	];

	return {
		data,
		header,
	};
};

const shorten0x = (str: string) => {
	return `${str.substring(0, 5)}...${str.substring(str.length - 3, str.length)}`;
};

export {
	useLatestBlocks,
	useLatestTxs,
	shorten0x,
	useBanner,
	useChart,
	useClient,
	type Client,
};
