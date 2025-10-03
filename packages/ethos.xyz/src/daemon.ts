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

	/**
	 * Convert an event map into a discriminated union
	 * Example:
	 * { DEPOSIT: { amount: bigint }, HARVEST: undefined }
	 * becomes:
	 * | { type: "DEPOSIT"; payload: { amount: bigint } }
	 * | { type: "HARVEST"; payload: undefined }
	 */
	export type DaemonEvent<E extends Record<string, any>> = {
		[K in keyof E]: { type: K; payload: E[K] };
	}[keyof E];

	/** Logs emitted by the daemon, fully typed by event */
	export interface DaemonLog<E extends Record<string, any>> {
		event: DaemonEvent<E>;
		timestamp: string;
	}

	/** Generic context for a daemon */
	export interface DaemonContext<
		N extends Nomos.Nomos<any>,
		E extends Record<string, any> = Record<string, any>,
	> {
		nomos: N;
		userId: User.UserId;
		params: N["params"];

		internal: {
			logs: DaemonLog<E>[];
		};
	}

	/** Generic daemon instance */
	export interface DaemonInstance<
		N extends Nomos.Nomos<any>,
		E extends Record<string, any> = Record<string, any>,
		S extends string = string,
	> {
		id: DaemonId;
		state: DaemonState<S>;
		context: DaemonContext<N, E>;
	}

	/** Registry of daemons keyed by strategy ID */
	export type DaemonsByStrategyId<
		N extends Nomos.Nomos<any>,
		E extends Record<string, any> = Record<string, any>,
		S extends string = string,
	> = Record<N["id"], DaemonInstance<N, E, S>>;
}
