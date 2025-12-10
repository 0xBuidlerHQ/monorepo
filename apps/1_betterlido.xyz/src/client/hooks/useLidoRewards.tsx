"use client";

//

import { handleQueryResponse, type QueryOptionsUserProps } from "@client/hooks/_utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

/**
 * @dev
 */
type QueryParams = {
	address: Address;
};

interface RewardEvent {
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

interface Totals {
	ethRewards: string;
	currencyRewards: string;
}

interface StETHCurrencyPrice {
	eth: number;
	usd: number;
}

type QueryResponse = {
	events: RewardEvent[];
	totals: Totals;
	averageApr: string;
	ethToStEthRatio: number;
	stETHCurrencyPrice: StETHCurrencyPrice;
	totalItems: number;
};

/**
 * @dev
 */
const lidoRewardsQuery = async (params: QueryParams) => {
	const response = await fetch(
		`https://stake.lido.fi/api/rewards?address=${params.address}& currency=${"usd"}&onlyRewards=${true}&archiveRate=${true}&skip=0&limit=${1000}`,
		{
			method: "GET",
		},
	);

	return (await handleQueryResponse(response)) as QueryResponse;
};

/**
 * @dev
 */
type QueryOptionsProps = QueryParams & {
	options?: QueryOptionsUserProps;
};
const defaultQueryOptions = (params: QueryParams) =>
	queryOptions({
		queryKey: ["symbol", params.address],
		queryFn: () => lidoRewardsQuery(params),
		//
		retry: false,
		refetchInterval: 60_000,
		enabled: !!params.address,
	});

/**
 * @dev
 */
const lidoRewardsQueryOptions = ({ options, ...params }: QueryOptionsProps) =>
	queryOptions({
		...defaultQueryOptions(params),
		...(options as {}),
	});

/**
 * @dev
 */
const useLidoRewards = (props: QueryOptionsProps) => {
	const {
		data: lidoRewards,
		isPending: lidoRewardsIsPending,
		isError: lidoRewardsIsError,
		error: lidoRewardsError,
	} = useQuery(lidoRewardsQueryOptions(props));

	return { lidoRewards, lidoRewardsIsPending, lidoRewardsIsError, lidoRewardsError };
};

export { useLidoRewards };
