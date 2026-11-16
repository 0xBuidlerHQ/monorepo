import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createPublicClient, createWalletClient, http, keccak256, encodeDeployData, encodeFunctionData, parseEther, type Address, type Hash, type Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { localEthereum } from "../config.ts";
import { trueOriginPassportAbi as abi, trueOriginPassportBytecode, trueOriginPassportRuntimeBytecode } from "../generated/passport.ts";

import { executableCode } from "./contract-code.ts";

export type PreparedPassportTransaction = { raw: Hex; hash: Hash };
export async function createLocalPassportIssuer(directory: string, rpcUrl = "http://127.0.0.1:8545", deploymentsFile = process.env.PASSPORT_DEPLOYMENTS_FILE ?? fileURLToPath(new URL("../../../../services/indexer/deployments/local.json", import.meta.url))) {
	if (process.env.NODE_ENV === "production") throw new Error("Passport issuance is local-only until production storage and policy are configured.");
	const endpoint = new URL(rpcUrl);
	if (!["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname)) throw new Error("Local passport issuance requires a loopback RPC.");
	await mkdir(directory, { recursive: true, mode: 0o700 });
	const keyPath = join(directory, "issuer-key.txt");
	try { await writeFile(keyPath, generatePrivateKey(), { mode: 0o600, flag: "wx" }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; }
	const account = privateKeyToAccount((await readFile(keyPath, "utf8")).trim() as Hex);
	const client = createPublicClient({ chain: localEthereum, transport: http(rpcUrl, { timeout: 8000, retryCount: 0 }) });
	const wallet = createWalletClient({ account, chain: localEthereum, transport: http(rpcUrl, { timeout: 8000, retryCount: 0 }) });
	async function assertLocal() { if (await client.getChainId() !== 31337) throw new Error("Refusing passport issuance outside the local chain 31337."); }
	async function assertContract(address: Address) {
		await assertLocal();
		const code = await client.getCode({ address });
		if (!code || code === "0x") throw new Error("The local chain was reset. Restore it or use a new API data directory; existing passports must not be silently reminted.");
		if (keccak256(executableCode(code)) !== keccak256(executableCode(trueOriginPassportRuntimeBytecode))) throw new Error("Passport bytecode changed. Use a new local development data directory.");
	}
	async function prepare(data: Hex, to?: Address): Promise<PreparedPassportTransaction> {
		await assertLocal();
		if (await client.getBalance({ address: account.address }) < parseEther("1")) {
			await client.request({ method: "anvil_setBalance" as never, params: [account.address, `0x${parseEther("10").toString(16)}`] as never });
		}
		const request = await wallet.prepareTransactionRequest({ account, chain: localEthereum, data, ...(to ? { to } : {}) });
		const raw = await wallet.signTransaction(request);
		return { raw, hash: keccak256(raw) };
	}
	async function receipt(hash: Hash) {
		await assertLocal();
		try { return await client.getTransactionReceipt({ hash }); }
		catch (error) { if (error instanceof Error && error.name === "TransactionReceiptNotFoundError") return null; throw error; }
	}
	async function broadcast(transaction: PreparedPassportTransaction) {
		await assertLocal();
		try { await client.sendRawTransaction({ serializedTransaction: transaction.raw }); }
		catch (error) { if (!await receipt(transaction.hash)) throw error; }
	}
	const statePath = join(directory, "deployment.json");
	async function deployment() {
		await assertLocal();
		let state: { address?: Address; transaction?: PreparedPassportTransaction } = {};
		try { state = JSON.parse(await readFile(statePath, "utf8")); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
		async function save() { await writeFile(`${statePath}.tmp`, JSON.stringify(state), { mode: 0o600 }); await rename(`${statePath}.tmp`, statePath); }
		if (state.address) {
			await assertContract(state.address);
		} else {
			if (!state.transaction) {
				state.transaction = await prepare(encodeDeployData({ abi, bytecode: trueOriginPassportBytecode, args: [account.address, account.address] }));
				await save();
			}
			await broadcast(state.transaction);
			const mined = await client.waitForTransactionReceipt({ hash: state.transaction.hash, timeout: 10_000, confirmations: 1 });
			if (mined.status !== "success" || !mined.contractAddress) throw new Error("Local passport deployment failed.");
			state.address = mined.contractAddress;
			await save();
		}
		const address = state.address;
		// Public recovery configuration is independent of submission SQLite and contains no signer secrets.
		if (state.transaction) {
			const mined = await receipt(state.transaction.hash);
			if (mined?.status !== "success") throw new Error("Deployment receipt is unavailable.");
			let manifest: { chainId: number; contracts: { address: Address; startBlock: number; blockHash: Hash }[] } = { chainId: 31337, contracts: [] };
			try { manifest = JSON.parse(await readFile(deploymentsFile, "utf8")); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
			if (manifest.chainId !== 31337) throw new Error("Deployment manifest chain mismatch.");
			const known = manifest.contracts.find(c => c.address.toLowerCase() === address.toLowerCase());
			if (known && known.blockHash !== mined.blockHash) throw new Error("The chain changed; preserve the old deployment manifest before starting a new local registry.");
			if (!known) {
				manifest.contracts.push({ address, startBlock: Number(mined.blockNumber), blockHash: mined.blockHash });
				await mkdir(dirname(deploymentsFile), { recursive: true });
				await writeFile(`${deploymentsFile}.tmp`, JSON.stringify(manifest, null, 2)); await rename(`${deploymentsFile}.tmp`, deploymentsFile);
			}
		}
		const role = await client.readContract({ address, abi, functionName: "ISSUER_ROLE" });
		if (!await client.readContract({ address, abi, functionName: "hasRole", args: [role, account.address] })) throw new Error("The local signer is not an authorized passport issuer.");
		return address;
	}
	return {
		deployment,
		async prepareIssue(address: Address, recipient: Address, itemId: Hex, metadataURI: string) {
			await assertContract(address);
			return prepare(encodeFunctionData({ abi, functionName: "issuePassport", args: [recipient, itemId, metadataURI] }), address);
		},
		broadcast,
		receipt,
		async passport(address: Address, itemId: Hex) {
			await assertContract(address);
			const tokenId = await client.readContract({ address, abi, functionName: "tokenIdForItem", args: [itemId] });
			if (!tokenId) return null;
			const [owner, metadataURI] = await Promise.all([
				client.readContract({ address, abi, functionName: "ownerOf", args: [tokenId] }),
				client.readContract({ address, abi, functionName: "tokenURI", args: [tokenId] }),
			]);
			return { tokenId: tokenId.toString(), owner, metadataURI };
		},
	};
}
