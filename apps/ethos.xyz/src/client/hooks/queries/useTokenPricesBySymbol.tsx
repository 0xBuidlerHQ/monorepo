"use client";

import type { QueryOptionsUserProps } from "@app/_hooks/queries/_utils";
import { tokenPricesBySymbols } from "@server/api/alchemy/getTokenPricesBySymbol";
import type {
	TokenPricesBySymbolsQueryParams,
	TokenPricesBySymbolsQueryResponse,
} from "@server/api/alchemy/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

/**
 * @dev
 */
type QueryParams = TokenPricesBySymbolsQueryParams;
type QueryResponse = TokenPricesBySymbolsQueryResponse;

/**
 * @dev
 */
const tokenPriceQuery = async ({ symbols }: QueryParams) => {
	const response = await tokenPricesBySymbols({ symbols });
	return response as QueryResponse;
};

/**
 * @dev
 */
type QueryOptionsProps = QueryParams & {
	options?: QueryOptionsUserProps;
};
const defaultQueryOptions = (params: QueryParams) =>
	queryOptions({
		queryKey: ["symbol", params.symbols],
		queryFn: () => tokenPriceQuery(params),
		//
		retry: false,
		refetchInterval: 60_000,
		enabled: true,
	});

/**
 * @dev
 */
const tokenPricesBySymbolQueryOptions = ({ options, ...params }: QueryOptionsProps) =>
	queryOptions({
		...defaultQueryOptions(params),
		...(options as {}),
	});

/**
 * @dev
 */
const useTokenPricesBySymbol = (props: QueryOptionsProps) => {
	const {
		data: tokenPricesBySymbol,
		isPending: tokenPriceIsPending,
		isError: tokenPriceIsError,
		error: tokenPriceError,
	} = useQuery(tokenPricesBySymbolQueryOptions(props));

	return { tokenPricesBySymbol, tokenPriceIsPending, tokenPriceIsError, tokenPriceError };
};

export { useTokenPricesBySymbol, tokenPricesBySymbolQueryOptions };
