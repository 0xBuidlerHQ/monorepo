"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Button } from "@0xbuidlerhq/ui/shadcn/components/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@0xbuidlerhq/ui/shadcn/components/table";
import type { RewardEvent } from "@app/chart";
import type { ColumnDef } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { formatEther } from "viem";

type RewardTableRow = {
	date: string;
	apr: number;
	rewardsEth: number;
	rewardsUsd: number;
	totalPooledEth: number;
	userBalance: number;
	poolSharePercent: number;
	block: string;
};

const formatDate = (timestamp: number) =>
	new Date(timestamp).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

const toEtherNumber = (value: string): number => {
	try {
		// Try treating it as wei for consistency with the chart
		return Number(formatEther(BigInt(value)));
	} catch {
		return Number(value);
	}
};

const formatNumber = (value: number, maximumFractionDigits = 2) => {
	// Fallback to "-" if the value is not a number
	if (!Number.isFinite(value)) return "-";

	return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
};

const formatUsd = (value: number) => {
	if (!Number.isFinite(value)) return "-";

	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	}).format(value);
};

const formatPercent = (value: number, maximumFractionDigits = 3) => {
	if (!Number.isFinite(value)) return "-";

	return `${value.toFixed(maximumFractionDigits)}%`;
};

export const RewardsTable = ({ events }: { events: RewardEvent[] }) => {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const data = useMemo<RewardTableRow[]>(() => {
		return events.map((event) => {
			const timestamp = parseInt(event.blockTime, 10) * 1000;
			const totalPooledEth = toEtherNumber(event.totalPooledEtherAfter);
			const userBalance = toEtherNumber(event.balance);
			const poolSharePercent = totalPooledEth > 0 ? (userBalance / totalPooledEth) * 100 : 0;

			return {
				date: formatDate(timestamp),
				apr: Number(event.apr),
				rewardsEth: toEtherNumber(event.rewards),
				rewardsUsd: Number(event.currencyChange),
				totalPooledEth,
				userBalance,
				poolSharePercent,
				block: event.block,
			};
		});
	}, [events]);

	const columns = useMemo<ColumnDef<RewardTableRow>[]>(
		() => [
			{
				header: "Date",
				accessorKey: "date",
			},
			{
				header: "APR (%)",
				accessorKey: "apr",
				cell: ({ getValue }) => formatPercent(Number(getValue()), 2),
			},
			{
				header: "Rewards (ETH)",
				accessorKey: "rewardsEth",
				cell: ({ getValue }) => formatNumber(Number(getValue()), 6),
			},
			{
				header: "Rewards (USD)",
				accessorKey: "rewardsUsd",
				cell: ({ getValue }) => formatUsd(Number(getValue())),
			},
			{
				header: "Total pooled (ETH)",
				accessorKey: "totalPooledEth",
				cell: ({ getValue }) => formatNumber(Number(getValue()), 2),
			},
			{
				header: "User balance (ETH)",
				accessorKey: "userBalance",
				cell: ({ getValue }) => formatNumber(Number(getValue()), 4),
			},
			{
				header: "Pool share (%)",
				accessorKey: "poolSharePercent",
				cell: ({ getValue }) => formatPercent(Number(getValue()), 4),
			},
			{
				header: "Block",
				accessorKey: "block",
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { pagination },
		onPaginationChange: setPagination,
	});

	return (
		<Box className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/[0.01] p-5 backdrop-blur-md shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)]">
			<Box className="flex items-center justify-between pb-4">
				<span className="text-sm text-white/80">
					Showing{" "}
					{table.getRowModel().rows.length
						? pagination.pageIndex * pagination.pageSize + 1
						: 0}
					-
					{Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} of {data.length} rewards
				</span>

				<Box className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Prev
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</Box>
			</Box>

			<Table className="text-xs">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="text-white/80 bg-white/5 first:rounded-l-lg last:rounded-r-lg"
								>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getPaginationRowModel().rows.length ? (
						table.getPaginationRowModel().rows.map((row) => (
							<TableRow key={row.id} className="odd:bg-white/[0.02] hover:bg-white/[0.06]">
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="align-middle">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center text-muted-foreground">
								No rewards to show yet.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Box className="flex items-center justify-between pt-4 text-xs text-white/70">
				<span>
					Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
				</span>
				<Box className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</Box>
			</Box>
		</Box>
	);
};
