import type {
	DefaultError,
	queryOptions,
	UseMutationOptions,
	useMutation,
} from "@tanstack/react-query";
import { getReasonPhrase } from "http-status-codes";

const safeJsonResponse = async <T,>(response: Response): Promise<T> => {
	try {
		return (await response.json()) as T;
	} catch (_) {
		return {} as T;
	}
};

/**
 * @dev
 */
const mutationOptions = <
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> => {
	return options;
};

/**
 * @dev
 */
type MutationOptionsBaseProps = Parameters<typeof useMutation>[0];
type MutationOptionsUserProps = Omit<MutationOptionsBaseProps, "mutationKey" | "mutationFn">;

/**
 * @dev
 */
type QueryOptionsBaseProps = Parameters<typeof queryOptions>[0];
type QueryOptionsUserProps = Omit<QueryOptionsBaseProps, "queryKey" | "queryFn">;

/**
 * @dev
 */

/**
 * @dev
 */
const handleQueryResponse = async <T,>(response: Response): Promise<T> => {
	if (!response.ok)
		throw new Error(
			`Error while executing query: ${response.status}: ${getReasonPhrase(response.status)}`,
		);

	return (await response.json()) as T;
};

/**
 * @dev
 */
const handleMutationResponse = async <T,>(response: Response): Promise<T> => {
	const responseData = safeJsonResponse<T>(response);

	if (!response.ok)
		throw new Error(
			`Error while executing mutation: [${response.status} - ${getReasonPhrase(response.status)}]: ${responseData}`,
		);

	return responseData;
};

export {
	mutationOptions,
	//
	handleMutationResponse,
	//
	handleQueryResponse,
};
export type { MutationOptionsUserProps, QueryOptionsUserProps };
