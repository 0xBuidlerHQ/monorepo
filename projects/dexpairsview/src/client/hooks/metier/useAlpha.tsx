import {
	type DexPairsSearchQueryResponse,
	useDexPairsSearchSearch,
} from "@client/reactquery/useDexPairsSearch";

type Props = {
	value: string;
};

const useAlpha = (props: Props) => {
	const { value } = props;
	const { dexPairsSearch, dexPairsSearchIsPending } = useDexPairsSearchSearch({
		text: value,
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

	return { filteredSearch, dexPairsSearchIsPending };
};

export { useAlpha };
