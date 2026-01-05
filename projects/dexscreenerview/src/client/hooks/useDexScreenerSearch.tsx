"use client";

//

import { handleQueryResponse, type QueryOptionsUserProps } from "@client/hooks/_utils";
import { queryOptions, useQuery } from "@tanstack/react-query";

/**
 * @dev
 */
type DexScreenerSearchQueryParams = {
	text: string;
};

type DexScreenerSearchQueryResponse = {
	schemaVersion: string;

	pairs: Array<{
		chainId: string;
		dexId: string;
		url: string; // uri
		pairAddress: string;
		labels: string[] | null;

		baseToken: {
			address: string;
			name: string;
			symbol: string;
		};

		quoteToken: {
			address: string | null;
			name: string | null;
			symbol: string | null;
		};

		priceNative: string;
		priceUsd: string | null;

		txns: Record<
			string,
			{
				buys: number;
				sells: number;
			}
		>;

		volume: Record<string, number>;

		priceChange: Record<string, number> | null;

		liquidity: {
			usd: number | null;
			base: number;
			quote: number;
		} | null;

		fdv: number | null;
		marketCap: number | null;
		pairCreatedAt: number | null;

		info: {
			imageUrl: string | null;

			websites: Array<{
				url: string; // uri
			}> | null;

			socials: Array<{
				platform: string;
				handle: string;
			}> | null;
		};

		boosts: {
			active: number;
		};
	}>;
};

/**
 * @dev
 */
const dexScreenerSearchQuery = async (params: DexScreenerSearchQueryParams) => {
	const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${params.text}`, {
		method: "GET",
	});

	return (await handleQueryResponse(response)) as DexScreenerSearchQueryResponse;
};

/**
 * @dev
 */
type QueryOptionsProps = DexScreenerSearchQueryParams & {
	options?: QueryOptionsUserProps;
};
const defaultQueryOptions = (params: DexScreenerSearchQueryParams) =>
	queryOptions({
		queryKey: ["symbol", params.text],
		queryFn: () => dexScreenerSearchQuery(params),
		//
		retry: false,
		enabled: !!params.text,
	});

/**
 * @dev
 */
const dexScreenerSearchQueryOptions = ({ options, ...params }: QueryOptionsProps) =>
	queryOptions({
		...defaultQueryOptions(params),
		...(options as {}),
	});

/**
 * @dev
 */
const useDexScreenerSearch = (props: QueryOptionsProps) => {
	const {
		data: dexScreenerSearch,
		isPending: dexScreenerSearchIsPending,
		isError: dexScreenerSearchIsError,
		error: dexScreenerSearchError,
	} = useQuery(dexScreenerSearchQueryOptions(props));

	return {
		dexScreenerSearch,
		dexScreenerSearchIsPending,
		dexScreenerSearchIsError,
		dexScreenerSearchError,
	};
};

export { useDexScreenerSearch, type DexScreenerSearchQueryResponse };
