import type { Daemon, Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { createActor, fromPromise, setup, type UnknownActorLogic } from "xstate";

/**
 * A single step of the daemon
 */
export type DaemonStep<N extends Nomos.Nomos> = {
	name: keyof N["states"];
	onDone?: keyof N["states"];
	on?: Partial<Record<keyof N["events"], { target: keyof N["states"] }>>;
	invoke?: {
		src: keyof N["states"];
		input?: (
			ctx: Daemon.DaemonContext<N>,
			evt: Daemon.DaemonEvent<N>,
		) => { context: Daemon.DaemonContext<N>; event?: Daemon.DaemonEvent<N> };
		onDone: { target: keyof N["states"] };
	};
};

type Daemonn<N extends Nomos.Nomos> = {
	actors: Record<keyof N["states"], UnknownActorLogic>;
	states: Record<keyof N["states"], DaemonStep<N>>;
};

export function createDaemonMachine<N extends Nomos.Nomos>(
	strategy: N,
	userId: string,
	daemonConfig: Daemonn<N>,
) {
	// 2a. Create actors from steps
	const { states, actors } = daemonConfig;

	// 2b. Setup machine
	const MachineSetup = setup({ actors });

	const machine = MachineSetup.createMachine({
		id: `daemon-${strategy.id}`,
		initial: "idle",
		context: {
			nomos: strategy,
			userId,
			params: strategy.params,
			internal: { logs: [] },
		},
		states: states as any,
	});

	const actor = createActor(machine);

	actor.start();

	const controls = {
		/**
		 * Send a NomosEvent and wait for all dependent states to complete.
		 */
		sendEvent: async (event: Nomos.NomosEvent) => {
			const eventName = event.type as keyof N["events"];
			const deps = (strategy.eventDependencies?.[eventName] ?? []) as Array<keyof N["states"]>;

			// Track remaining dependencies
			const remaining = new Set(deps);

			return new Promise<void>((resolve, reject) => {
				const sub = actor.subscribe((snapshot) => {
					const current = (
						typeof snapshot.value === "string" ? snapshot.value : Object.keys(snapshot.value)[0]
					) as keyof N["states"];

					if (remaining.has(current)) {
						remaining.delete(current);
					}

					if (remaining.size === 0) {
						sub.unsubscribe();
						resolve();
					}
				});

				try {
					actor.send(event as any);
				} catch (err) {
					sub.unsubscribe();
					reject(err);
				}
			});
		},
	};

	return { actor, controls };
}

type ActorInput<N extends Nomos.Nomos> = {
	context: Daemon.DaemonContext<N>;
	event?: Daemon.DaemonEvent<N>;
};

type FromPromiseArgs<TInput> = {
	input: TInput;
};

function createDaemonActor<N extends Nomos.Nomos, R = void>(
	fn: (args: FromPromiseArgs<ActorInput<N>>) => Promise<R>,
): UnknownActorLogic {
	return fromPromise<R, ActorInput<N>>(
		fn as unknown as (args: { input: ActorInput<N> }) => Promise<R>,
	);
}

export { createDaemonActor };
