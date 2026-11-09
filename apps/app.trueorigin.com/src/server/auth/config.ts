import "server-only";
import { AccountError } from "./errors.ts";

export function passkeySettings() {
	if (process.env.NODE_ENV === "production" && !process.env.PASSKEY_ORIGIN)
		throw new Error("PASSKEY_ORIGIN must be configured.");
	const origin = new URL(process.env.PASSKEY_ORIGIN ?? "http://localhost:3001")
		.origin;
	const host = new URL(origin).hostname;
	const rpId = process.env.PASSKEY_RP_ID ?? host;
	if (host !== rpId && !host.endsWith(`.${rpId}`))
		throw new Error(
			"PASSKEY_RP_ID must match the origin or its parent domain.",
		);
	if (new URL(origin).protocol !== "https:" && host !== "localhost")
		throw new Error("Passkeys require HTTPS or localhost.");
	return { origin, rpId };
}

export function validateOrigin(origin: string | null) {
	if (origin !== passkeySettings().origin)
		throw new AccountError("Origin not allowed.", 403);
}
