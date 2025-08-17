/**
 * @dev
 */
type TokenPricesBySymbolsQueryParams = {
	symbols: string[];
};

type TokenPricesBySymbolsQueryResponse = {
	symbol: string;
	prices: {
		currency: string;
		lastUpdatedAt: string;
		value: string;
	}[];
}[];

export type { TokenPricesBySymbolsQueryResponse, TokenPricesBySymbolsQueryParams };
