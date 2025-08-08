import { type CachedStepState, createStepper } from "@ethos/ui/hooks/useStepper";

/**
 * @dev Connect Button.
 */
type DefaultActionStepBase = {
	type: string;
	label: string;
};

type DefaultActionStepSuccess = { link: string };
type DefaultActionStepError = { msg: string };

// We'll store instances keyed by a unique identifier
const stepperInstances = new Map<string, unknown>();
const DEFAULT_INSTANCE_KEY = "default";

/**
 * Creates a stepper instance with the specified generic types.
 * Consumers can call this to get a customized stepper with their own types.
 * If the same key is used multiple times, returns the existing instance (singleton per key).
 */
function createConnectButtonStepper<
	TBase extends DefaultActionStepBase = DefaultActionStepBase,
	TSuccess extends DefaultActionStepSuccess = DefaultActionStepSuccess,
	TError extends DefaultActionStepError = DefaultActionStepError,
>(instanceKey: string = DEFAULT_INSTANCE_KEY) {
	if (!stepperInstances.has(instanceKey)) {
		stepperInstances.set(instanceKey, createStepper<TBase, TSuccess, TError>());
	}

	return stepperInstances.get(instanceKey) as {
		useStepperStore: ReturnType<typeof createStepper<TBase, TSuccess, TError>>["useStepperStore"];
		createStep: ReturnType<typeof createStepper<TBase, TSuccess, TError>>["createStep"];
		ActionSuccess: ReturnType<typeof createStepper<TBase, TSuccess, TError>>["ActionSuccess"];
		ActionError: ReturnType<typeof createStepper<TBase, TSuccess, TError>>["ActionError"];
	};
}

// Create the default instance for use in this package
const {
	useStepperStore: useConnectButtonActions,
	createStep: createConnectButtonActionStep,
	ActionSuccess,
	ActionError,
} = createConnectButtonStepper();

type CachedActionStepState = CachedStepState<DefaultActionStepSuccess, DefaultActionStepError>;

export {
	createConnectButtonStepper,
	//
	useConnectButtonActions,
	createConnectButtonActionStep,
	ActionSuccess,
	ActionError,
	//
	type CachedActionStepState,
	type DefaultActionStepBase,
	type DefaultActionStepError,
	type DefaultActionStepSuccess,
};
