import "server-only";

import type { PasskeyIdentity } from "@0xhq/contracts.trueorigin.com/config";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import {
	type Credential,
	createSession,
	deleteSession,
	findSessionCredential,
} from "../db/account-store.ts";
import { passkeySettings, validateOrigin } from "./config.ts";
import { AccountError } from "./errors.ts";

// New names also avoid collisions with the previous /api-scoped cookies.
const sessionCookie = "trueorigin-account-session";
const flowCookie = "trueorigin-account-flow";
const sessionLifetime = 7 * 24 * 60 * 60;

export async function requireTrustedOrigin() {
	validateOrigin((await headers()).get("origin"));
}

function cookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		sameSite: "strict" as const,
		path: "/",
		secure: passkeySettings().origin.startsWith("https:"),
		maxAge,
	};
}
export async function readFlowToken() {
	return (await cookies()).get(flowCookie)?.value;
}
export async function writeFlowToken(token: string) {
	(await cookies()).set(flowCookie, token, cookieOptions(300));
}
export async function clearFlowToken() {
	(await cookies()).set(flowCookie, "", cookieOptions(0));
}
function publicIdentity(row: Credential): PasskeyIdentity {
	return { id: row.id, rpId: row.rp_id, pubX: row.pub_x, pubY: row.pub_y };
}
export async function sessionIdentity() {
	// Session expiry must be checked against the real request, including prefetches.
	await connection();
	const token = (await cookies()).get(sessionCookie)?.value;
	if (!token) return null;
	const row = findSessionCredential(token, passkeySettings().rpId);
	return row ? publicIdentity(row) : null;
}
export async function requireAccountIdentity() {
	const identity = await sessionIdentity();
	if (!identity) throw new AccountError("Connect with a passkey first.", 401);
	return identity;
}
export async function startSession(row: Credential) {
	await endSession();
	const token = createSession(row.id, sessionLifetime);
	(await cookies()).set(sessionCookie, token, cookieOptions(sessionLifetime));
	return publicIdentity(row);
}
export async function endSession() {
	const store = await cookies();
	const token = store.get(sessionCookie)?.value;
	if (token) deleteSession(token);
	store.set(sessionCookie, "", cookieOptions(0));
}
