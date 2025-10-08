import type { Nomos } from "@0xbuidlerhq/core/index";
import type { User } from "@0xbuidlerhq/core/user";
import { fromPromise, type PromiseActorLogic } from "xstate";

export namespace Praxis {
	/** Unique Praxis identifier */
	export type PraxisId = `praxis-0x${string}`;

	/**
	 * Generic state type
	 * Users supply their own states as string union type
	 */
	export type PraxisState<S extends string = string> = S;

	export type PraxisEvent<E extends Record<string, {}>> = {
		[K in keyof E]: { type: K; payload: E[K] };
	}[keyof E];

	/** Logs emitted by the Praxis, fully typed by event */
	export interface PraxisLog<N extends Nomos.Nomos> {
		event: PraxisEvent<N["events"]>;
		timestamp: string;
	}

	/** Generic context for a Praxis */
	export interface PraxisContext<N extends Nomos.Nomos> {
		nomos: N;
		userId: User.UserId;
		params: N["params"];

		internal: {
			logs: PraxisLog<N>[];
		};
	}

	/** Generic Praxis instance */
	export interface PraxisInstance<N extends Nomos.Nomos = any> {
		id: PraxisId;
		state: keyof N["states"];
		context: PraxisContext<N>;
	}

	/** Registry of Praxiss keyed by strategy ID */
	export type PraxisByStrategyId<N extends Nomos.Nomos> = Record<N["id"], PraxisInstance<N>>;

	type ActorInput<N extends Nomos.Nomos> = {
		context: Praxis.PraxisContext<N>;
		event: Praxis.PraxisEvent<N>;
	};

	// XState actor logic, not a plain function
	type PraxisActor<N extends Nomos.Nomos, R = void> = PromiseActorLogic<R, ActorInput<N>>;

	type PraxisConfigStep<N extends Nomos.Nomos> = {
		name: keyof N["states"];
		onDone?: keyof N["states"];
		on?: Partial<Record<keyof N["events"], { target: keyof N["states"] }>>;
		invoke?: {
			src: keyof N["states"]; // must match a key in `actors`
			input?: (
				ctx: Praxis.PraxisContext<N>,
				evt: Praxis.PraxisEvent<N>,
			) => { context: Praxis.PraxisContext<N>; event?: Praxis.PraxisEvent<N> };
			onDone: { target: keyof N["states"] };
		};
	};

	export type Praxis<N extends Nomos.Nomos> = {
		actors: Record<keyof N["states"], PraxisActor<N>>;
		states: Record<keyof N["states"], PraxisConfigStep<N>>;
	};

	// Wrap a plain async function into an XState Promise actor
	export function createPraxisActor<N extends Nomos.Nomos, R = void>(
		fn: (args: { input: ActorInput<N> }) => Promise<R>,
	): PraxisActor<N, R> {
		return fromPromise<R, ActorInput<N>>(async ({ input }) => fn({ input }));
	}
}
