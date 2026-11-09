import "server-only";

import { randomBytes } from "node:crypto";
import {
	type AuthenticationResponseJSON,
	generateAuthenticationOptions,
	generateRegistrationOptions,
	type RegistrationResponseJSON,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { decodeCredentialPublicKey } from "@simplewebauthn/server/helpers";
import {
	type ChallengePurpose,
	type Credential,
	consumeChallenge,
	createChallenge,
	findCredential,
	saveCredential,
	updateCredentialCounter,
} from "../db/account-store.ts";
import { passkeySettings } from "./config.ts";
import { AccountError } from "./errors.ts";

export async function registrationOptions(previousToken?: string) {
	const { origin, rpId } = passkeySettings();
	const options = await generateRegistrationOptions({
		rpName: "TrueOrigin",
		rpID: rpId,
		userName: `TrueOrigin ${randomBytes(4).toString("hex")}`,
		attestationType: "none",
		supportedAlgorithmIDs: [-7],
		authenticatorSelection: {
			residentKey: "required",
			userVerification: "required",
		},
	});
	return {
		options,
		token: createChallenge(
			options.challenge,
			"register",
			origin,
			previousToken,
		),
	};
}

export async function authenticationOptions(previousToken?: string) {
	const { origin, rpId } = passkeySettings();
	const options = await generateAuthenticationOptions({
		rpID: rpId,
		userVerification: "required",
	});
	return {
		options,
		token: createChallenge(options.challenge, "login", origin, previousToken),
	};
}

function verificationSettings(
	token: string | undefined,
	purpose: ChallengePurpose,
) {
	if (!token) throw new AccountError("Start passkey authentication again.");
	const challenge = consumeChallenge(token);
	const { origin, rpId } = passkeySettings();
	if (
		!challenge ||
		challenge.origin !== origin ||
		challenge.purpose !== purpose
	)
		throw new AccountError("Passkey request expired. Please try again.");
	return {
		expectedChallenge: challenge.challenge,
		expectedOrigin: origin,
		expectedRPID: rpId,
		requireUserVerification: true,
	};
}

function validateResponse(input: unknown) {
	if (
		!input ||
		typeof input !== "object" ||
		!("id" in input) ||
		typeof input.id !== "string" ||
		!("response" in input) ||
		typeof input.response !== "object"
	)
		throw new AccountError("Invalid passkey response.");
	if (JSON.stringify(input).length > 65_536)
		throw new AccountError("Passkey response is too large.");
}

export async function verifyRegistration(
	input: unknown,
	token?: string,
): Promise<Credential> {
	const settings = verificationSettings(token, "register");
	validateResponse(input);
	const result = await verifyRegistrationResponse({
		...settings,
		response: input as RegistrationResponseJSON,
		supportedAlgorithmIDs: [-7],
	});
	if (!result.verified) throw new AccountError("Passkey verification failed.");
	const credential = result.registrationInfo.credential;
	const key = decodeCredentialPublicKey(credential.publicKey) as Map<
		number,
		unknown
	>;
	const x = key.get(-2),
		y = key.get(-3);
	if (
		!(x instanceof Uint8Array) ||
		!(y instanceof Uint8Array) ||
		x.length !== 32 ||
		y.length !== 32
	)
		throw new AccountError("An ES256 passkey is required.");
	const row: Credential = {
		id: credential.id,
		rp_id: settings.expectedRPID,
		public_key: credential.publicKey,
		counter: credential.counter,
		pub_x: `0x${Buffer.from(x).toString("hex")}`,
		pub_y: `0x${Buffer.from(y).toString("hex")}`,
	};
	saveCredential(row);
	return row;
}

export async function verifyAuthentication(
	input: unknown,
	token?: string,
): Promise<Credential> {
	const settings = verificationSettings(token, "login");
	validateResponse(input);
	const response = input as AuthenticationResponseJSON;
	const row = findCredential(response.id, settings.expectedRPID);
	if (!row)
		throw new AccountError("This passkey is not registered with TrueOrigin.");
	const result = await verifyAuthenticationResponse({
		...settings,
		response,
		credential: {
			id: row.id,
			publicKey: new Uint8Array(row.public_key),
			counter: row.counter,
		},
	});
	if (!result.verified) throw new AccountError("Passkey verification failed.");
	updateCredentialCounter(row.id, result.authenticationInfo.newCounter);
	return row;
}
