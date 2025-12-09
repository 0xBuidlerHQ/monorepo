import { useMutation } from "@tanstack/react-query";
import {
	handleMutationResponse,
	type MutationOptionsUserProps,
	mutationOptions as mutationOptionsPrimitive,
} from "./_utils";

/**
 * @dev Top-up mutation parameters
 */
type MutationParams = {
	nomosId: string;
	event: {
		type: "START";
		payload: {};
	};
};

/**
 * @dev Top-up mutation result
 */
type MutationResult = {};

/**
 * @dev Top-up agent mutation function
 */
const daemonCreateMutation = async (body: MutationParams) => {
	const response = await fetch(`${"http://localhost:8000"}/user/authenticated/daemons/create`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	return (await handleMutationResponse(response)) as MutationResult;
};

/**
 * @dev
 */
type MutationOptionsProps = {
	options?: MutationOptionsUserProps;
};

const defaultMutationOptions = () =>
	mutationOptionsPrimitive({
		mutationFn: (params: MutationParams) => daemonCreateMutation(params),
		retry: false,
	});

/**
 * @dev
 */
const mutationOptions = (props?: MutationOptionsProps) =>
	mutationOptionsPrimitive({
		...defaultMutationOptions(),
		...(props?.options as {}),
	});

/**
 * @dev
 */
const useDaemonCreate = (props?: MutationOptionsProps) => {
	const {
		mutate: daemonCreate,
		mutateAsync: daemonCreateAsync,
		data: daemonCreateData,
		isPending: daemonCreateIsPending,
		isError: daemonCreateIsError,
		error: daemonCreateError,
	} = useMutation(mutationOptions(props));

	return {
		daemonCreate,
		daemonCreateAsync,
		daemonCreateData,
		daemonCreateIsPending,
		daemonCreateIsError,
		daemonCreateError,
	};
};

export { useDaemonCreate };
