"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { formatKMB, formatUSD } from "@0xbuidlerhq/wagmui";
import type { DexPairsSearchQueryResponse } from "@client/reactquery/useDexPairsSearch";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

type Props = {
	data: DexPairsSearchQueryResponse["pairs"];
};

const DexPairsTable = (props: Props) => {
	const { data } = props;

	const columns = useMemo<ColumnDef<DexPairsSearchQueryResponse["pairs"][number]>[]>(() => {
		return [
			{
				id: "pair",
				header: () => <H5 className="uppercase text-left">Pair</H5>,
				cell: ({ row }) => (
					<Box>
						<H5>
							{row.original.baseToken.symbol} / {row.original.quoteToken.symbol}
						</H5>
					</Box>
				),
				meta: { width: "25%" },
			},
			{
				id: "marketCap",
				header: () => <H5 className="uppercase text-left">Market Cap</H5>,
				accessorFn: (row) => row.marketCap ?? 0,
				cell: ({ row }) => (
					<Box>
						<H5>{formatKMB(row.original.marketCap ?? 0)}</H5>
					</Box>
				),
				meta: { width: "25%" },
			},
			{
				id: "priceUsd",
				header: () => <H5 className="uppercase text-left">Price (usd)</H5>,
				accessorFn: (row) => (row.priceUsd ? Number(row.priceUsd) : 0),
				cell: ({ row }) => (
					<Box>
						<H5>{formatUSD(Number(row.original.priceUsd)) ?? "—"}</H5>
					</Box>
				),
				meta: { width: "25%" },
			},
			{
				id: "liquidityUsd",
				header: () => <H5 className="uppercase text-left">Liquidity (usd)</H5>,
				accessorFn: (row) => row.liquidity?.usd ?? 0,
				cell: ({ row }) => {
					if (!(row.original.liquidity?.usd !== null && row.original.liquidity?.usd !== undefined))
						return "-";
					return (
						<Box>
							<H5>{formatUSD(row.original.liquidity.usd)}</H5>
						</Box>
					);
				},

				meta: { width: "25%" },
			},
		];
	}, [data]);

	const [sorting, setSorting] = useState<SortingState>([{ id: "liquidityUsd", desc: true }]);

	const table = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: { sorting },
		onSortingChange: setSorting,
	});

	return (
		<Box className="w-full">
			<table className="w-full table-fixed">
				<colgroup>
					{columns.map((col) => (
						<col key={col.id} style={{ width: (col as any).meta?.width ?? "auto" }} />
					))}
				</colgroup>

				<thead className="text-left">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className={`py-2 pr-3 select-none ${
										header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
									}`}
									onClick={
										header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
									}
								>
									{header.isPlaceholder ? null : (
										<Box className="flex items-center gap-1">
											{flexRender(header.column.columnDef.header, header.getContext())}

											<span className="ml-1 text-[10px] text-accent-foreground/50">
												{header.column.getCanSort()
													? header.column.getIsSorted() === "asc"
														? "▲"
														: header.column.getIsSorted() === "desc"
															? "▼"
															: "↕"
													: ""}
											</span>
										</Box>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody className="divide-y divide-slate-800">
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="py-2 pr-3">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</Box>
	);
};

export { DexPairsTable };
