import { create } from "zustand";

/**
 * @dev A base step in the stepper process.
 * This represents a single step, with an ID, a function to execute, and an optional disabled flag.
 * The generic `B` is for extra metadata, `S` is for success payload, and `E` is for error payload.
 */
type StepBase<B, S, _> = B & {
	id: string;
	fn: () => Promise<S>;
	disabled?: boolean | undefined;
};

/**
 * @dev Possible statuses a step can have.
 */
type StepStatus = "idle" | "loading" | "success" | "error" | "disabled";

/**
 * @dev The state of a single step with discriminated union based on status.
 */
type StepStateSuccess<S> = {
	index: number;
	status: "success";
	payload: S;
};

type StepStateError<E> = {
	index: number;
	status: "error";
	payload: E;
};

type StepStateOther = {
	index: number;
	status: "idle" | "loading" | "disabled";
	payload?: undefined;
};

type StepState<S, E> = StepStateSuccess<S> | StepStateError<E> | StepStateOther;

/**
 * @dev Cached state of a step (used when restoring state later).
 * It is the same as StepState but without the index.
 */
type CachedStepStateSuccess<S> = Omit<StepStateSuccess<S>, "index">;

type CachedStepStateError<E> = Omit<StepStateError<E>, "index">;

type CachedStepStateOther = Omit<StepStateOther, "index">;

type CachedStepState<S, E> =
	| CachedStepStateSuccess<S>
	| CachedStepStateError<E>
	| CachedStepStateOther;

/**
 * @dev Configuration options for the stepper.
 * - `name`: Identifier for the stepper.
 * - `autoExecute`: Whether steps should automatically execute one after another.
 * - `executeOnNext`: Whether the next step should be executed when moving to it.
 */
type StepperConfig = {
	name: string;
	autoExecute?: boolean;
	executeOnNext?: boolean;
};

/**
 * @dev The full state of the stepper, including steps, active step, and configuration.
 */
type StepperState<B, S, E> = {
	activeStep: number;
	stepsState: StepState<S, E>[];
	stepsBase: StepBase<B, S, E>[];
	activeStepState: StepState<S, E> | undefined;
	activeStepBase: StepBase<B, S, E> | undefined;
	isRunning: boolean;
	isDone: boolean;
	isError: boolean;
	config: StepperConfig;
};

/**
 * @dev Actions the stepper can perform.
 */
type StepperActions<B, S, E> = {
	executeStep: (stepIndex: number) => void;

	setActiveStep: (step: number) => void;
	setStepsState: (state: StepState<S, E>[]) => void;
	setStepsBase: (state: StepBase<B, S, E>[]) => void;
	setIsRunning: (isRunning: boolean) => void;
	setIsDone: (isDone: boolean) => void;
	setIsError: (isError: boolean) => void;

	start: () => void;
	resume: () => void;
	retry: () => void;
	next: () => void;
	prev: () => void;
	reset: () => void;

	initialize: (steps: StepBase<B, S, E>[], newConfig?: StepperConfig) => void;
	initializeFromCache: (
		cachedState: CachedStepState<S, E>[],
		steps: StepBase<B, S, E>[],
		newConfig?: StepperConfig,
	) => void;
};

/**
 * @dev The complete Zustand store type that holds both state and actions.
 *
 * This defines the overall shape of the store, which includes both the
 * current state of the stepper process and the actions that manipulate it.
 *
 * The generics used are:
 * - `B`: Represents any extra metadata or data that is associated with a step (can be an object type).
 * - `S`: Represents the success payload type when a step completes successfully.
 * - `E`: Represents the error payload type when a step fails.
 */
type StepperStore<B, S, E> = StepperState<B, S, E> & StepperActions<B, S, E>;

/**
 * @dev Return type of createStepper, containing the store hook and step creation function.
 */
type StepperStoreReturn<B, S, E> = {
	useStepperStore: () => StepperStore<B, S, E>;
	createStep: (props: Omit<StepBase<B, S, E>, "index">) => StepBase<B, S, E>;

	ActionSuccess: (data: S) => S;
	ActionError: (data: E) => E;
};

/**
 * @dev Creates a Zustand store for managing a step-by-step process.
 *
 * This function returns an object with:
 * - `useStepperStore`: A Zustand hook for accessing the stepper state and actions
 * - `createStep`: A helper function to create properly typed steps for this specific store
 *
 * The generics used are:
 * - `B`: Represents any extra metadata or data that is associated with a step.
 * - `S`: Represents the success payload type when a step completes successfully.
 * - `E`: Represents the error payload type when a step fails.
 */
const createStepper = <B, S, E>(): StepperStoreReturn<B, S, E> => {
	// Create the Zustand store
	const useStepperStore = create<StepperStore<B, S, E>>()((set, get) => ({
		activeStep: 0,
		stepsState: [],
		stepsBase: [],
		activeStepState: undefined,
		activeStepBase: undefined,
		isRunning: false,
		isDone: false,
		isError: false,
		config: {
			name: "",
			autoExecute: true,
			executeOnNext: false,
		},

		// State setters
		setActiveStep: (step) => {
			const state = get();
			set({
				activeStep: step,
				activeStepState: state.stepsState[step],
				activeStepBase: state.stepsBase[step],
			});
		},
		setStepsState: (state) => {
			const currentState = get();
			set({
				stepsState: state,
				activeStepState: state[currentState.activeStep],
			});
		},
		setStepsBase: (state) => {
			const currentState = get();
			set({
				stepsBase: state,
				activeStepBase: state[currentState.activeStep],
			});
		},
		setIsRunning: (isRunning) => set({ isRunning }),
		setIsDone: (isDone) => set({ isDone }),
		setIsError: (isError) => set({ isError }),

		// Initialize function
		initialize: (steps, newConfig) => {
			const initialStepsState: StepState<S, E>[] = steps.map((_, index) => ({
				index,
				status: "idle",
			}));

			const stepsBase: StepBase<B, S, E>[] = steps.map((item, index) => ({
				index,
				...item,
			}));

			set({
				stepsState: [...initialStepsState],
				stepsBase: [...stepsBase],
				config: { ...get().config, ...newConfig },
				activeStep: 0,
				activeStepState: initialStepsState[0],
				activeStepBase: stepsBase[0],
				isRunning: false,
				isDone: false,
				isError: false,
			});
		},

		/**
		 * @dev Initializes the stepper using a cached state.
		 * Useful for resuming progress from a previous session.
		 *
		 * - It merges saved progress (`cachedState`) with the new step definitions (`steps`).
		 * - Automatically determines the next step to execute based on success/error states.
		 * - If all steps are completed, it marks the process as "done."
		 *
		 * @param cachedState - Previously saved progress of steps.
		 * @param steps - The steps that should be executed.
		 * @param newConfig - Optional configuration overrides.
		 */
		initializeFromCache: (
			cachedState: CachedStepState<S, E>[],
			steps: StepBase<B, S, E>[],
			newConfig?: StepperConfig,
		) => {
			const stepsBase: StepBase<B, S, E>[] = steps.map((item, index) => ({
				index,
				...item,
			}));

			let activeStep = 0;
			let isError = false;

			// Merge cached step state with new steps
			const stepsState: StepState<S, E>[] = stepsBase.map((_, index) => {
				const cachedStep = cachedState?.[index];

				if (cachedStep) {
					if (cachedStep.status === "success") activeStep = index + 1;
					if (cachedStep.status === "error") isError = true;

					return {
						...cachedStep,
						index,
					};
				}

				return {
					index,
					status: "idle",
				};
			});

			// Check if all steps are done
			const isDone = activeStep === steps.length;

			// Make sure we don't go out of bounds
			const safeActiveStep = Math.min(activeStep, steps.length - 1);

			set({
				stepsState: [...stepsState], // Set the restored step state
				stepsBase: [...stepsBase], // Set the step definitions
				config: { ...get().config, ...newConfig }, // Merge config
				activeStep: safeActiveStep, // Resume from last completed step
				activeStepState: stepsState[safeActiveStep], // Set active step state
				activeStepBase: stepsBase[safeActiveStep], // Set active step base
				isRunning: false, // Initially not running
				isDone: isDone, // Mark as done if all steps were completed
				isError: isError, // Mark as error if any step had an issue
			});
		},

		/**
		 * @dev Executes a step by running its function and updating the state accordingly.
		 */
		executeStep: (stepIndex: number) => {
			console.log("Executing: ", stepIndex);
			const state = get();
			const { stepsBase, stepsState, config } = state;

			const stepBase = stepsBase[stepIndex];
			const stepState = stepsState[stepIndex];

			if (!stepBase || !stepState) return;

			// Create a new loading state
			const loadingState: StepState<S, E> = {
				index: stepIndex,
				status: "loading",
			};

			// Update current step to loading
			stepsState[stepIndex] = loadingState;

			// If the step being executed is the active step, update activeStepState too
			const updates: Partial<StepperState<B, S, E>> = {
				stepsState: [...stepsState],
			};

			if (stepIndex === state.activeStep) {
				updates.activeStepState = loadingState;
			}

			set(updates);

			stepBase
				.fn()
				.then((data) => {
					// Create success state with properly typed payload
					const successState: StepStateSuccess<S> = {
						index: stepIndex,
						status: "success",
						payload: data,
					};

					stepsState[stepIndex] = successState;

					// Prepare updates
					const successUpdates: Partial<StepperState<B, S, E>> = {
						stepsState: [...stepsState],
					};

					// If the step being executed is the active step, update activeStepState too
					if (stepIndex === state.activeStep) {
						successUpdates.activeStepState = successState;
					}

					set(successUpdates);

					if (stepIndex === stepsBase.length - 1) {
						state.setIsRunning(false);
						state.setIsDone(true);
					} else if (config.autoExecute) {
						state.next();
					}
				})
				.catch((error) => {
					// Create error state with properly typed payload
					const errorState: StepStateError<E> = {
						index: stepIndex,
						status: "error",
						payload: error as E,
					};

					stepsState[stepIndex] = errorState;

					// Prepare updates
					const errorUpdates: Partial<StepperState<B, S, E>> = {
						stepsState: [...stepsState],
					};

					// If the step being executed is the active step, update activeStepState too
					if (stepIndex === state.activeStep) {
						errorUpdates.activeStepState = errorState;
					}

					set(errorUpdates);
					state.setIsRunning(false);
					state.setIsError(true);
				});
		},

		/**
		 * @dev Starts executing the first step in the stepper.
		 * If there are steps to run, it marks the process as "running"
		 * and executes the first step (step index 0).
		 */
		start: () => {
			const state = get();
			if (state.stepsState.length > 0) {
				state.setIsRunning(true); // Mark as running
				state.executeStep(0); // Start from the first step
			}
		},

		/**
		 * @dev Resumes execution from the current active step.
		 * If steps exist, it marks the process as "running" and runs the current step.
		 */
		resume: () => {
			const state = get();
			if (state.stepsState.length > 0) {
				state.setIsRunning(true);
				state.executeStep(state.activeStep); // Resume from where we left off
			}
		},

		/**
		 * @dev Retries the current step if it's not already running.
		 * If there was an error before, it resets the error state and tries again.
		 */
		retry: () => {
			const state = get();

			if (!state.isRunning) {
				state.setIsError(false); // Clear any error
				state.setIsRunning(true); // Start running again
				state.executeStep(state.activeStep); // Retry current step
			}
		},

		/**
		 * @dev Moves to the next step in the sequence.
		 * If 'executeOnNext' is enabled in the config, it runs the step immediately.
		 */
		next: () => {
			const state = get();
			const { activeStep, config } = state;

			if (config.executeOnNext) {
				state.executeStep(activeStep);
			}

			if (activeStep < state.stepsState.length - 1) {
				const nextStep = activeStep + 1;
				state.setActiveStep(nextStep);

				if (!config.executeOnNext) {
					state.executeStep(nextStep); // Automatically execute the next step if allowed
				}
			}
		},

		/**
		 * @dev Moves to the previous step in the sequence, if possible.
		 * Does not execute it automatically, just updates the active step.
		 */
		prev: () => {
			const state = get();
			if (state.activeStep > 0) {
				state.setActiveStep(state.activeStep - 1);
			}
		},

		/**
		 * @dev Returns the current stepper state.
		 * This allows external components to read the current progress.
		 */
		get: () => {
			const state = get();
			return state;
		},

		/**
		 * @dev Resets the stepper to its initial state.
		 * Clears all steps, progress, and resets status flags.
		 */
		reset: () => {
			const state = get();
			state.setStepsState([]); // Clear all steps state
			state.setStepsBase([]); // Clear all step definitions
			state.setActiveStep(0); // Reset to step 0
			set({
				activeStepState: undefined,
				activeStepBase: undefined,
			});
			state.setIsRunning(false); // Mark as not running
			state.setIsDone(false); // Mark as not done
			state.setIsError(false); // Clear any error state
		},
	}));

	// Create a properly typed step creation function
	const createStep = (props: Omit<StepBase<B, S, E>, "index">) => props as StepBase<B, S, E>;

	const ActionSuccess = (data: S) => data;
	const ActionError = (data: E) => data;

	// Return the store hook and step creation function
	return {
		useStepperStore,
		createStep,

		ActionSuccess,
		ActionError,
	};
};

export { createStepper };

// No longer need the standalone createStep function since
// each store instance returns its own typed createStep

export type {
	StepBase,
	StepState,
	StepStateSuccess,
	StepStateError,
	StepStateOther,
	StepStatus,
	StepperConfig,
	StepperStore,
	StepperStoreReturn,
	CachedStepState,
	CachedStepStateSuccess,
	CachedStepStateError,
	CachedStepStateOther,
};
