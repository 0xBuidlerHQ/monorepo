import type {
	Daemon as DaemonPrimitive,
	Nomos as NomosPrimitive,
	User as UserPrimitive,
} from "./index";

/**
 * @dev
 */
namespace API {
	/**
	 * @dev
	 */
	export namespace Types {
		/**
		 * @dev
		 */
		export interface Nomos extends NomosPrimitive.Nomos {}

		/**
		 * @dev
		 */
		export interface Daemon extends DaemonPrimitive.DaemonInstance<any> {}

		/**
		 * @dev
		 */
		export interface User extends UserPrimitive.User {}
	}
}

export type { API };
