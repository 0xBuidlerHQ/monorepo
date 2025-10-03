import type { Address } from "viem";

/**
 * @dev
 */
namespace User {
	export type UserId = `user-${Address}`;

	export type User = {
		id: UserId;
	};
}

export type { User };
