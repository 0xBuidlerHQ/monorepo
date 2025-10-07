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
		export interface Daemon extends DaemonPrimitive.DaemonInstance {}

		/**
		 * @dev
		 */
		export namespace Nomos {
			export interface _Nomos extends NomosPrimitive.Nomos {}
			export interface _NomosEvent extends NomosPrimitive.NomosEvent {}
		}

		/**
		 * @dev
		 */
		export interface User extends UserPrimitive.User {}
	}
}

export type { API };
