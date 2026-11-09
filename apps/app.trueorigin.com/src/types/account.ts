import type {
	AccountConfig,
	PasskeyIdentity,
} from "@0xhq/contracts.trueorigin.com/config";

export type AccountSession = {
	identity: PasskeyIdentity | null;
	config: AccountConfig;
};
export type AccountActionResult<T> =
	| { ok: true; data: T }
	| { ok: false; error: string };
