"use server";

import {
	browserAccountConfig,
	fundLocalAccount,
} from "@0xhq/contracts.trueorigin.com/rpc";
import { AccountError } from "@/server/auth/errors";
import {
	authenticationOptions,
	registrationOptions,
	verifyAuthentication,
	verifyRegistration,
} from "@/server/auth/passkeys";
import {
	clearFlowToken,
	endSession,
	readFlowToken,
	requireAccountIdentity,
	requireTrustedOrigin,
	sessionIdentity,
	startSession,
	writeFlowToken,
} from "@/server/auth/session";
import type { AccountActionResult, AccountSession } from "@/types/account";

async function accountAction<T>(
	operation: () => Promise<T>,
): Promise<AccountActionResult<T>> {
	try {
		await requireTrustedOrigin();
		return { ok: true, data: await operation() };
	} catch (error) {
		if (error instanceof AccountError)
			return { ok: false, error: error.message };
		console.error(
			"Account action failed:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return {
			ok: false,
			error: "Unable to complete this account request. Please try again.",
		};
	}
}

export async function getAccountSession() {
	return accountAction(
		async (): Promise<AccountSession> => ({
			identity: await sessionIdentity(),
			config: browserAccountConfig(),
		}),
	);
}
export async function beginPasskeyRegistration() {
	return accountAction(async () => {
		const { options, token } = await registrationOptions(await readFlowToken());
		await writeFlowToken(token);
		return options;
	});
}
export async function finishPasskeyRegistration(response: unknown) {
	return accountAction(async (): Promise<AccountSession> => {
		const config = browserAccountConfig();
		const token = await readFlowToken();
		await clearFlowToken();
		const credential = await verifyRegistration(response, token);
		return { identity: await startSession(credential), config };
	});
}
export async function beginPasskeyAuthentication() {
	return accountAction(async () => {
		const { options, token } = await authenticationOptions(
			await readFlowToken(),
		);
		await writeFlowToken(token);
		return options;
	});
}
export async function finishPasskeyAuthentication(response: unknown) {
	return accountAction(async (): Promise<AccountSession> => {
		const config = browserAccountConfig();
		const token = await readFlowToken();
		await clearFlowToken();
		const credential = await verifyAuthentication(response, token);
		return { identity: await startSession(credential), config };
	});
}
export async function disconnectAccount() {
	return accountAction(async () => {
		await endSession();
		await clearFlowToken();
		return null;
	});
}
export async function fundLocalTestAccount() {
	return accountAction(async () => {
		const identity = await requireAccountIdentity();
		await fundLocalAccount(identity);
		return null;
	});
}
