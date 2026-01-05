"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_1, H4, H5 } from "@0xbuidlerhq/ui/system/base/typography";
import { formatKMB, formatUSD } from "@0xbuidlerhq/wagmui";
import { AnimatedCard, AnimatedSection, AnimatedStagger } from "@client/animations";
import {
	type DexScreenerSearchQueryResponse,
	useDexScreenerSearch,
} from "@client/hooks/useDexScreenerSearch";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { useDebounce } from "react-use";

const Page = () => {
	const [searchInput, setSearchInput] = useState("btc");
	const [debounceValue, setDebounceValue] = useState(searchInput);
	const [sorting, setSorting] = useState<SortingState>([{ id: "liquidityUsd", desc: true }]);

	useDebounce(() => setDebounceValue(searchInput), 500, [searchInput]);
	const { dexScreenerSearch, dexScreenerSearchIsPending } = useDexScreenerSearch({
		text: debounceValue,
	});

	const filteredSearch = useMemo(() => {
		if (!dexScreenerSearch) return {};

		const groupedByChain: Record<string, Record<string, typeof dexScreenerSearch.pairs>> = {};

		for (const pair of dexScreenerSearch.pairs) {
			const chainKey = pair.chainId ?? "unknown-chain";
			const dexKey = pair.dexId ?? "unknown-dex";

			if (!groupedByChain[chainKey]) groupedByChain[chainKey] = {};
			if (!groupedByChain[chainKey][dexKey]) groupedByChain[chainKey][dexKey] = [];

			groupedByChain[chainKey][dexKey].push(pair);
		}

		return groupedByChain;
	}, [dexScreenerSearch]);

	const columns = useMemo<ColumnDef<DexScreenerSearchQueryResponse["pairs"][number]>[]>(() => {
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
				meta: { width: "20%" },
			},
			{
				id: "quote",
				header: () => <H5 className="uppercase text-left">Quote</H5>,
				cell: ({ row }) => (
					<Box>
						<H5>{row.original.quoteToken.name ?? row.original.quoteToken.symbol ?? "?"}</H5>
					</Box>
				),

				meta: { width: "20%" },
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
				meta: { width: "20%" },
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
				meta: { width: "20%" },
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

				meta: { width: "20%" },
			},
		];
	}, [dexScreenerSearch]);

	const DexPairsTable = ({
		data,
		columns,
	}: {
		data: DexScreenerSearchQueryResponse["pairs"];
		columns: ColumnDef<DexScreenerSearchQueryResponse["pairs"][number]>[];
	}) => {
		const table = useReactTable({
			data,
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
											header.column.getCanSort()
												? header.column.getToggleSortingHandler()
												: undefined
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

	return (
		<Container className="py-6">
			<Box className="flex flex-col gap-4">
				<AnimatedCard initial="hidden" animate="visible">
					<input
						className="bg-accent w-full p-4 rounded"
						value={searchInput}
						onChange={(e) => setSearchInput(e.currentTarget.value)}
						placeholder="btc / eth"
					/>
				</AnimatedCard>

				{(() => {
					if (dexScreenerSearchIsPending && searchInput !== "")
						return (
							<Box>
								<Loader className="animate-spin" />
							</Box>
						);

					if (!Object.keys(filteredSearch).length) {
						return <Box className="text-sm text-slate-500">No results yet.</Box>;
					}

					return (
						<AnimatedStagger initial="hidden" animate="visible" className="flex flex-col gap-4">
							{Object.entries(filteredSearch).map(([chainId, dexGroups]) => (
								<AnimatedSection
									key={chainId}
									className="p-4 bg-muted rounded border border-accent flex flex-col gap-1"
								>
									<H1_1 className="uppercase text-accent-foreground">{chainId}</H1_1>

									<Box className="mt-2 flex flex-col gap-4">
										{Object.entries(dexGroups).map(([dexId, pairs]) => (
											<Box key={`${chainId}-${dexId}`} className="flex flex-col gap-2">
												<Box className="flex items-center gap-2">
													<H4 className="bg-accent uppercase px-2">{dexId}</H4>
												</Box>

												<Box>
													<DexPairsTable data={pairs} columns={columns} />
												</Box>
											</Box>
										))}
									</Box>
								</AnimatedSection>
							))}
						</AnimatedStagger>
					);
				})()}
			</Box>
		</Container>
	);
};

export default Page;
