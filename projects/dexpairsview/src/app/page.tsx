"use client";

import { Box } from "@0xbuidlerhq/ui/system/base/box";
import { Container } from "@0xbuidlerhq/ui/system/base/container";
import { H1_1, H4 } from "@0xbuidlerhq/ui/system/base/typography";
import { AnimatedCard, AnimatedStaggerContainer, AnimatedStaggerItem } from "@client/animations";
import { TextInput } from "@client/components/inputs/TextInput";
import { DexPairsTable } from "@client/components/tables/DexPairsTable";
import {
	type DexPairsSearchQueryResponse,
	useDexPairsSearchSearch,
} from "@client/hooks/useDexPairsSearch";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "react-use";

const Page = () => {
	const [searchInput, setSearchInput] = useState("eth / link");
	const [debounceValue, setDebounceValue] = useState(searchInput);

	useDebounce(() => setDebounceValue(searchInput), 300, [searchInput]);
	const { dexPairsSearch, dexPairsSearchIsPending } = useDexPairsSearchSearch({
		text: debounceValue,
	});

	const filteredSearch = (() => {
		if (!dexPairsSearch) return {};

		const groupedByChain: Record<string, Record<string, DexPairsSearchQueryResponse["pairs"]>> = {};

		for (const pair of dexPairsSearch.pairs) {
			const chainKey = pair.chainId ?? "unknown-chain";
			const dexKey = pair.dexId ?? "unknown-dex";

			if (!groupedByChain[chainKey]) groupedByChain[chainKey] = {};
			if (!groupedByChain[chainKey][dexKey]) groupedByChain[chainKey][dexKey] = [];

			groupedByChain[chainKey][dexKey].push(pair);
		}

		return groupedByChain;
	})();

	return (
		<Container className="py-6">
			<Box className="flex flex-col gap-4">
				<AnimatedCard initial="hidden" animate="visible">
					<TextInput value={searchInput} setValue={setSearchInput} />
				</AnimatedCard>

				{(() => {
					if (dexPairsSearchIsPending && searchInput !== "")
						return <Loader className="animate-spin" />;

					if (!Object.keys(filteredSearch).length) {
						return <Box className="text-sm text-slate-500">No results yet.</Box>;
					}

					return (
						<AnimatedStaggerContainer className="flex flex-col gap-4">
							{Object.entries(filteredSearch).map(([chainId, dexGroups]) => (
								<AnimatedStaggerItem
									key={`${chainId}${dexGroups}`}
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
													<DexPairsTable data={pairs} />
												</Box>
											</Box>
										))}
									</Box>
								</AnimatedStaggerItem>
							))}
						</AnimatedStaggerContainer>
					);
				})()}
			</Box>
		</Container>
	);
};

export default Page;
