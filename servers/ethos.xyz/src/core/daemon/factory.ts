import type { Nomos, Praxis } from "@0xbuidlerhq/package-ethos.xyz";
import { createActor, setup } from "xstate";

function createDaemon<N extends Nomos.Nomos>(userId: string, nomos: N, praxis: Praxis.Praxis<N>) {
	// 2a. Create actors from steps
	const { states, actors } = praxis;

	// 2b. Setup machine
	const MachineSetup = setup({ actors });

	const machine = MachineSetup.createMachine({
		id: `daemon-${nomos.id}`,
		initial: "idle",
		context: {
			nomos: nomos,
			userId,
			params: nomos.params,
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
			const deps = (nomos.eventDependencies?.[eventName] ?? []) as Array<keyof N["states"]>;

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

export { createDaemon };
