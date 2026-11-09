"use client";

import type {
	AccountConfig,
	ConnectedAccount,
	PasskeyIdentity,
} from "@0xhq/contracts.trueorigin.com/account";
import { useRouter } from "next/navigation";
import {
	startAuthentication,
	startRegistration,
} from "@simplewebauthn/browser";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	beginPasskeyAuthentication,
	beginPasskeyRegistration,
	disconnectAccount,
	finishPasskeyAuthentication,
	finishPasskeyRegistration,
	fundLocalTestAccount,
	getAccountSession,
} from "@/actions/account";
import type { AccountActionResult, AccountSession } from "@/types/account";

async function deployedAccount(account: ConnectedAccount | null) {
	if (!account) return false;
	const { isAccountDeployed } = await import(
		"@0xhq/contracts.trueorigin.com/account"
	);
	return isAccountDeployed(account);
}

type Phase = "restoring" | "idle" | "registering" | "connecting" | "sending";

function actionData<T>(result: AccountActionResult<T>) {
	if (!result.ok) throw new Error(result.error);
	return result.data;
}

async function connectionFor(session: AccountSession) {
	if (!session.identity) return null;
	const { connectPasskeyAccount } = await import(
		"@0xhq/contracts.trueorigin.com/account"
	);
	return connectPasskeyAccount(session.identity, {
		...session.config,
		rpcUrl: new URL(session.config.rpcUrl, window.location.origin).href,
		bundlerUrl: new URL(session.config.bundlerUrl, window.location.origin).href,
	});
}

function useAccountState() {
	const router = useRouter();
	const [identity, setIdentity] = useState<PasskeyIdentity | null>(null);
	const [connection, setConnection] = useState<ConnectedAccount | null>(null);
	const [config, setConfig] = useState<AccountConfig | null>(null);
	const [phase, setPhase] = useState<Phase>("restoring");
	const [error, setError] = useState<string | null>(null);
	const [deployed, setDeployed] = useState(false);
	const [transactionHash, setTransactionHash] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		async function restore() {
			try {
				const session = actionData(await getAccountSession());
				if (active) setIdentity(session.identity);
				const account = await connectionFor(session);
				const deployed = await deployedAccount(account);
				if (active) {
					setConfig(session.config);
					setConnection(account);
					setDeployed(deployed);
				}
			} catch (cause) {
				if (active)
					setError(
						cause instanceof Error
							? cause.message
							: "Unable to restore your account.",
					);
			} finally {
				if (active) setPhase("idle");
			}
		}
		void restore();
		return () => {
			active = false;
		};
	}, []);

	async function connect(mode: "register" | "login") {
		setError(null);
		setPhase(mode === "register" ? "registering" : "connecting");
		try {
			let session: AccountSession;
			if (mode === "register") {
				const optionsJSON = actionData(await beginPasskeyRegistration());
				const credential = await startRegistration({ optionsJSON });
				session = actionData(await finishPasskeyRegistration(credential));
			} else {
				const optionsJSON = actionData(await beginPasskeyAuthentication());
				const credential = await startAuthentication({ optionsJSON });
				session = actionData(await finishPasskeyAuthentication(credential));
			}
			setIdentity(session.identity);
			setConfig(session.config);
			router.refresh();
			const account = await connectionFor(session);
			const deployed = await deployedAccount(account);
			setConfig(session.config);
			setConnection(account);
			setDeployed(deployed);
		} catch (cause) {
			setError(
				cause instanceof Error && cause.name !== "NotAllowedError"
					? cause.message
					: "Passkey request cancelled. You can try again.",
			);
		} finally {
			setPhase("idle");
		}
	}

	async function refreshIdentity() {
		const session = actionData(await getAccountSession());
		setIdentity(session.identity);
		setConfig(session.config);
		router.refresh();
	}

	async function disconnect() {
		try {
			actionData(await disconnectAccount());
			setIdentity(null);
			router.refresh();
			setConnection(null);
			setDeployed(false);
			setTransactionHash(null);
			setError(null);
		} catch {
			setError("Unable to disconnect. Please try again.");
		}
	}

	async function sendLocalTest() {
		if (!connection || config?.chainId !== 31337 || phase !== "idle") return;
		setPhase("sending");
		setError(null);
		setTransactionHash(null);
		try {
			const { sendLocalTestTransaction } = await import(
				"@0xhq/contracts.trueorigin.com/account"
			);
			actionData(await fundLocalTestAccount());
			const result = await sendLocalTestTransaction(connection);
			setTransactionHash(result.transactionHash);
			setDeployed(result.deployed);
		} catch (cause) {
			setError(
				cause instanceof Error ? cause.message : "The test transaction failed.",
			);
		} finally {
			setPhase("idle");
		}
	}

	return {
		identity,
		refreshIdentity,
		connection,
		config,
		phase,
		error,
		deployed,
		transactionHash,
		connect,
		disconnect,
		sendLocalTest,
	};
}

const AccountContext = createContext<ReturnType<typeof useAccountState> | null>(
	null,
);
export function AccountProvider({ children }: { children: ReactNode }) {
	const state = useAccountState();
	return (
		<AccountContext.Provider value={state}>{children}</AccountContext.Provider>
	);
}
export function useAccount() {
	const state = useContext(AccountContext);
	if (!state)
		throw new Error("useAccount must be used inside AccountProvider.");
	return state;
}
