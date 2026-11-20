import { join } from "node:path";
import { createLocalPassportIssuer, type PreparedPassportTransaction } from "@0xhq/trueorigin-sdk/passport-issuer";
import type { Actor, SubmissionStore } from "../store.ts";
import { HttpError } from "../errors.ts";
import type { PassportIssuance } from "@0xhq/api-client/types";
import type { PassportImage } from "./assets.ts";
import { storePassportMetadata } from "./storage.ts";

type Issuer = Awaited<ReturnType<typeof createLocalPassportIssuer>>;
export type PassportOptions = { bootstrap?: boolean; deploymentsFile?: string; indexerURL?: string; enabled?: boolean; rpcURL?: string; ipfsURL?: string; issuer?: Issuer; storeMetadata?: typeof storePassportMetadata; image?: (passport: PassportIssuance) => Promise<PassportImage | undefined> };
export function createPassportWorkflow(directory: string, store: SubmissionStore, options: PassportOptions = {}) {
	let chain: Promise<Issuer> | undefined;
	const issuer = () => chain ??= options.issuer ? Promise.resolve(options.issuer) : createLocalPassportIssuer(join(directory, "passport-chain"), options.rpcURL, options.deploymentsFile).catch(error => { chain = undefined; throw error; });
	let working: Promise<void> | null = null;
	let closed = false;
	let bootstrapped = false;
	let bootstrapWarning = false;
	async function processJobs() {
        if (options.bootstrap && !bootstrapped) {
            try {
                await (await issuer()).deployment();
                bootstrapped = true;
                console.log("Local passport contract ready. The public index can start before the first issuance.");
            } catch (error) {
                if (!bootstrapWarning) console.warn("Waiting for local passport contract initialization. Registry and activity will become available once the local chain is ready.");
                bootstrapWarning = true;
                throw error;
            }
        }
		for (const job of store.passportJobs()) {
			if (closed) break;
			try {
				let passport = job.passport;
				const artwork = passport.metadataURI ? undefined : await options.image?.(passport);
				const metadata = await (options.storeMetadata ?? storePassportMetadata)(directory, passport, options.ipfsURL ?? "http://localhost:3003", artwork);
				passport = store.updatePassport(job.submissionId, { ...metadata, error: null });
				const client = await issuer();
				const address = passport.contractAddress as `0x${string}` | null ?? await client.deployment();
				passport = store.updatePassport(job.submissionId, { contractAddress: address });
				let registered = await client.passport(address, passport.itemId as `0x${string}`);
				let transaction: PreparedPassportTransaction;
				if (passport.transactionHash && job.raw) transaction = { raw: job.raw as `0x${string}`, hash: passport.transactionHash as `0x${string}` };
				else {
					if (registered) throw new Error("This item already exists on-chain without a matching saved transaction. Manual reconciliation is required.");
					transaction = await client.prepareIssue(address, passport.recipientAddress as `0x${string}`, passport.itemId as `0x${string}`, metadata.metadataURI);
					// Persist the signed transaction before submission; every retry broadcasts the same bytes/hash.
					passport = store.updatePassport(job.submissionId, { transactionHash: transaction.hash, status: "prepared" }, transaction.raw);
				}
				let receipt = await client.receipt(transaction.hash);
				if (!receipt) {
					await client.broadcast(transaction);
					store.updatePassport(job.submissionId, { status: "submitted" });
					receipt = await client.receipt(transaction.hash);
				}
				if (!receipt) continue;
				if (receipt.status !== "success") { store.updatePassport(job.submissionId, { status: "failed", error: "The mint reverted. No passport was issued; you can retry." }); continue; }
				registered = await client.passport(address, passport.itemId as `0x${string}`);
				if (!registered || registered.metadataURI !== metadata.metadataURI) throw new Error("The confirmed transaction does not match the passport metadata.");
				store.updatePassport(job.submissionId, { status: "confirmed", tokenId: registered.tokenId, confirmedAt: new Date().toISOString(), error: null });
			} catch (error) {
				const message = error instanceof Error && error.message.length < 220 && !error.message.includes("\n") ? error.message : "Waiting for local storage or chain access. Issuance will retry automatically.";
				store.updatePassport(job.submissionId, { error: message });
				// Stop this pass: do not assign subsequent jobs a nonce while a broadcast outcome is uncertain.
				break;
			}
		}
	}
	function pump() {
		if (working || closed || !options.enabled || process.env.NODE_ENV === "production") return working;
		working = processJobs().finally(() => { working = null; });
		return working;
	}
	const timer = setInterval(() => { void pump()?.catch(() => {}); }, 5000);
	timer.unref();
	if (options.bootstrap) void pump()?.catch(() => {});
	return {
		queue(id: string, value: unknown, actor: Actor) {
			if (actor.kind !== "staff") throw new HttpError(403, "Only staff can issue passports.");
			if (!options.enabled || process.env.NODE_ENV === "production") throw new HttpError(503, "Passport issuance is currently available only in local development.");
			const passport = store.queuePassport(id, value, actor);
			void pump()?.catch(() => {});
			return passport;
		},
		async close() { closed = true; clearInterval(timer); await working; },
		pump,
	};
}
