"use server";

import { Env } from "@ethos/core/index";
import { handleQueryResponse } from "@/hooks/queries/_utils";
import type {
	TokenPricesBySymbolsQueryParams,
	TokenPricesBySymbolsQueryResponse,
} from "@/server/api/alchemy/types";

const tokenPricesBySymbols = async ({ symbols }: TokenPricesBySymbolsQueryParams) => {
	if (!symbols || (Array.isArray(symbols) && symbols.length === 0)) {
		throw new Error("Missing token symbol(s)");
	}

	// Always turn into array and join with commas
	const querySymbols = symbols.map((s) => `symbols=${s}`).join("&");

	const url = `https://api.g.alchemy.com/prices/v1/${Env.Alchemy.AlchemyEnv.ALCHEMY_API_KEY}/tokens/by-symbol?${querySymbols}`;

	const response = await fetch(url, {
		next: { revalidate: 600 }, // cache 10 minutes
	});

	return ((await handleQueryResponse(response)) as any).data as TokenPricesBySymbolsQueryResponse;
};

export { tokenPricesBySymbols };
