import { startAuthentication } from "@simplewebauthn/browser";
import {
	PasskeyValidatorContractVersion,
	toPasskeyValidator,
} from "@zerodev/passkey-validator";
import { createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { getEntryPoint, KERNEL_V3_3 } from "@zerodev/sdk/constants";
import {
	findQuoteIndices,
	isRIP7212SupportedNetwork,
	parseAndNormalizeSig,
	type WebAuthnKey,
} from "@zerodev/webauthn-key";
import {
	createPublicClient,
	encodeAbiParameters,
	http,
	keccak256,
	toBytes,
	toHex,
} from "viem";
import {
	type AccountConfig,
	accountChain,
	type PasskeyIdentity,
} from "./config.ts";

function decodeBase64(value: string) {
	return Uint8Array.from(
		atob(value.replace(/-/g, "+").replace(/_/g, "/")),
		(c) => c.charCodeAt(0),
	);
}

const signWithPasskey: NonNullable<WebAuthnKey["signMessageCallback"]> = async (
	message,
	rpID,
	chainId,
	allowCredentials,
) => {
	const bytes =
		typeof message === "string"
			? new TextEncoder().encode(message)
			: typeof message.raw === "string"
				? toBytes(message.raw)
				: message.raw;
	const challenge = btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
	const assertion = await startAuthentication({
		optionsJSON: {
			challenge,
			rpId: rpID,
			allowCredentials,
			userVerification: "required",
		},
	});
	const clientData = new TextDecoder().decode(
		decodeBase64(assertion.response.clientDataJSON),
	);
	const { r, s } = parseAndNormalizeSig(
		toHex(decodeBase64(assertion.response.signature)),
	);
	return encodeAbiParameters(
		[
			{ type: "bytes" },
			{ type: "string" },
			{ type: "uint256" },
			{ type: "uint256" },
			{ type: "uint256" },
			{ type: "bool" },
		],
		[
			toHex(decodeBase64(assertion.response.authenticatorData)),
			clientData,
			findQuoteIndices(clientData).beforeType,
			BigInt(r),
			BigInt(s),
			isRIP7212SupportedNetwork(chainId),
		],
	);
};

/** Computes the counterfactual address. Does not send a transaction or deploy. */
export async function connectPasskeyAccount(
	identity: PasskeyIdentity,
	config: AccountConfig,
) {
	const chain = accountChain(config.chainId);
	const publicClient = createPublicClient({
		chain,
		transport: http(config.rpcUrl),
	});
	if ((await publicClient.getChainId()) !== chain.id)
		throw new Error("The configured Ethereum network does not match the RPC.");
	const entryPoint = getEntryPoint("0.7");
	const validator = await toPasskeyValidator(publicClient, {
		entryPoint,
		kernelVersion: KERNEL_V3_3,
		validatorContractVersion: PasskeyValidatorContractVersion.V0_0_3_PATCHED,
		webAuthnKey: {
			pubX: BigInt(identity.pubX),
			pubY: BigInt(identity.pubY),
			authenticatorId: identity.id,
			authenticatorIdHash: keccak256(decodeBase64(identity.id)),
			rpID: identity.rpId,
			signMessageCallback: signWithPasskey,
		},
	});
	const account = await createKernelAccount(publicClient, {
		entryPoint,
		kernelVersion: KERNEL_V3_3,
		index: 0n,
		plugins: { sudo: validator },
	});
	const client = createKernelAccountClient({
		account,
		chain,
		client: publicClient,
		bundlerTransport: http(config.bundlerUrl),
		userOperation: {
			estimateFeesPerGas: async () => publicClient.estimateFeesPerGas(),
		},
	});
	return { account, client, publicClient };
}

export type ConnectedAccount = Awaited<
	ReturnType<typeof connectPasskeyAccount>
>;
export type { AccountConfig, PasskeyIdentity } from "./config.ts";

export async function isAccountDeployed(connection: ConnectedAccount) {
	const code = await connection.publicClient.getCode({
		address: connection.account.address,
	});
	return !!code && code !== "0x";
}

/** Development-only operation; the server also independently enforces the local chain. */
export async function sendLocalTestTransaction(connection: ConnectedAccount) {
	if (connection.publicClient.chain.id !== 31337)
		throw new Error("Local test transactions require the Ethereum fork.");
	const hash = await connection.client.sendUserOperation({
		calls: [{ to: connection.account.address, value: 0n, data: "0x" }],
	});
	const receipt = await connection.client.waitForUserOperationReceipt({
		hash,
		timeout: 120_000,
	});
	if (!receipt.success) throw new Error("The test transaction reverted.");
	return {
		transactionHash: receipt.receipt.transactionHash,
		deployed: await isAccountDeployed(connection),
	};
}
