import type { Nomos } from "@0xbuidlerhq/core/index";
import type { User } from "@0xbuidlerhq/core/user";

export namespace Daemon {
	/** Unique daemon identifier */
	export type DaemonId = `daemon-0x${string}`;

	/**
	 * Generic state type
	 * Users supply their own states as string union type
	 */
	export type DaemonState<S extends string = string> = S;

	export type DaemonEvent<E extends Record<string, {}>> = {
		[K in keyof E]: { type: K; payload: E[K] };
	}[keyof E];

	/** Logs emitted by the daemon, fully typed by event */
	export interface DaemonLog<N extends Nomos.Nomos> {
		event: DaemonEvent<N["events"]>;
		timestamp: string;
	}

	/** Generic context for a daemon */
	export interface DaemonContext<N extends Nomos.Nomos> {
		nomos: N;
		userId: User.UserId;
		params: N["params"];

		internal: {
			logs: DaemonLog<N>[];
		};
	}

	/** Generic daemon instance */
	export interface DaemonInstance<N extends Nomos.Nomos = any> {
		id: DaemonId;
		state: keyof N["states"];
		context: DaemonContext<N>;
	}

	/** Registry of daemons keyed by strategy ID */
	export type DaemonsByStrategyId<N extends Nomos.Nomos> = Record<N["id"], DaemonInstance<N>>;
}
