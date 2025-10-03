import type { Daemon, Nomos } from "@0xbuidlerhq/package-ethos.xyz";
import { fromPromise, setup } from "xstate";

/**
 * A single step of the daemon
 */
export type DaemonStep<
	N extends Nomos.Nomos<any>,
	E extends Record<string, any>,
	S extends string,
> = {
	name: S;
	actor: (context: Daemon.DaemonContext<N, E>, event?: Daemon.DaemonEvent<E>) => Promise<void>;
	onDone?: S;
	onEvents?: Record<string, S>;
};

/**
 * Generic factory for creating a daemon machine
 */
export function createDaemonMachine<
	N extends Nomos.Nomos<any>,
	E extends Record<string, any>,
	S extends string,
>(strategy: N, userId: string, steps: [DaemonStep<N, E, S>]) {
	// Create generic actors from steps
	const actors = Object.fromEntries(
		steps.map((step) => [
			step.name,
			fromPromise<void, { context: Daemon.DaemonContext<N, E>; event?: Daemon.DaemonEvent<E> }>(
				async ({ input }) => {
					await step.actor(input.context, input.event);
				},
			),
		]),
	);

	// Setup machine types
	const MachineSetup = setup({
		types: {
			context: {} as Daemon.DaemonContext<N, E>,
			events: {} as Daemon.DaemonEvent<E>,
			emitted: {} as any,
		},
		actors,
	});

	// Dynamically generate states
	const states = Object.fromEntries(
		steps.map((step) => [
			step.name,
			{
				invoke: {
					src: step.name,
					input: (c: Daemon.DaemonContext<N, E>) => c,
					onDone: step.onDone ? { target: step.onDone } : undefined,
				},
				on: step.onEvents,
			},
		]),
	);

	return MachineSetup.createMachine({
		id: `daemon-${strategy.id}`,
		initial: steps[0].name,
		context: {
			nomos: strategy,
			userId,
			params: strategy.params,
			internal: { logs: [] },
		},
		states,
	});
}
