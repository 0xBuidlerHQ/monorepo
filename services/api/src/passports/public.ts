import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createPassportReader, PassportMismatch } from "@0xhq/trueorigin-sdk/passport-reader";
import { digest } from "@0xhq/api-client/protocol";
import type { PublicPassport, PublicPassportDetail } from "@0xhq/api-client/types";
import { createPassportIndex, readIPFS, type IndexedPassport } from "./index.ts";
import { passportAsset } from "./assets.ts";
import { HttpError } from "../errors.ts";

export function createPublicPassportService(directory: string, rpcURL?: string, indexerURL?: string, ipfsURL = "http://localhost:3003") {
	const reader = createPassportReader(rpcURL);
	async function metadata(row: IndexedPassport) {
		try { return (await archive(row.itemId, "metadata", row.metadataURI)).bytes; }
		catch { return readIPFS(row.metadataURI, ipfsURL); }
	}
	const index = createPassportIndex(indexerURL, metadata);
	const record = index.record;
	async function archive(itemId: string, kind: "image" | "metadata", expectedURI: string | null) {
		const directoryPath = join(directory, "passports", itemId);
		const manifest = JSON.parse(await readFile(join(directoryPath, "manifest.json"), "utf8")) as { itemId: string; image: { uri: string; sha256: string }; metadata: { uri: string; sha256: string } };
		const asset = manifest[kind];
		if (manifest.itemId !== itemId || asset.uri !== expectedURI) throw new Error("Archive reference mismatch");
		const { name, contentType } = passportAsset(asset.uri, kind);
		const bytes = await readFile(join(directoryPath, name));
		if (digest(bytes) !== asset.sha256) throw new Error("Archive integrity mismatch");
		return { bytes, contentType };
	}
	async function readAsset(itemId: string, kind: "image" | "metadata") {
		const passport = await record(itemId);
		const uri = kind === "image" ? passport.imageURI : passport.metadataURI;
		try { return await archive(passport.itemId, kind, uri); }
		catch {
			if (!uri) throw new HttpError(404, "No passport image is recorded.");
			return { bytes: await readIPFS(uri, ipfsURL), contentType: passportAsset(uri, kind).contentType };
		}
	}
	return {
		list: () => index.list(),
		activity: index.activity,
  activityEvent: index.activityEvent,
		async owned(wallet: string) {
			const candidates = await index.list(wallet);
			const owned: PublicPassport[] = [];
			for (const passport of candidates) {
				try {
					const verified = await reader.verify({ contractAddress: passport.contractAddress as `0x${string}`, itemId: passport.itemId as `0x${string}`, tokenId: passport.tokenId, metadataURI: passport.metadataURI, transactionHash: passport.transactionHash as `0x${string}`, issuedTo: passport.issuedTo as `0x${string}` });
					if (verified.currentOwner.toLowerCase() === wallet.toLowerCase()) owned.push(passport);
				} catch { throw new HttpError(503, "Current passport ownership could not be checked."); }
			}
			return owned;
		},
		async lookup(certifier: string, number: string) {
			const passport = (await index.list()).find(entry => entry.certifier === certifier && entry.certificationNumber === number);
			if (!passport) throw new HttpError(404, "No issued TrueOrigin passport matches these details.");
			return passport;
		},
		async detail(itemId: string): Promise<PublicPassportDetail> {
			const passport = await record(itemId);
			const base = { checkedAt: new Date().toISOString(), currentOwner: null, issuer: null, blockNumber: null, blockHash: null, history: [], historyTruncated: false };
			try {
				const verified = await reader.verify({ contractAddress: passport.contractAddress as `0x${string}`, itemId: passport.itemId as `0x${string}`, tokenId: passport.tokenId,
					metadataURI: passport.metadataURI, transactionHash: passport.transactionHash as `0x${string}`, issuedTo: passport.issuedTo as `0x${string}` });
				const archived = await readAsset(passport.itemId, "metadata");
				const metadata = JSON.parse(archived.bytes.toString("utf8")) as { name?: string; image?: string; attributes?: { trait_type: string; value: string }[]; trueorigin?: { item_id?: string; chain_id?: number } };
				const attribute = (name: string) => Array.isArray(metadata.attributes) ? metadata.attributes.find(entry => entry.trait_type === name)?.value ?? "" : "";
				if (metadata.name !== passport.title || metadata.image !== passport.imageURI || metadata.trueorigin?.item_id !== passport.itemId || metadata.trueorigin?.chain_id !== passport.chainId || attribute("Certifier") !== passport.certifier || attribute("Certification number") !== passport.certificationNumber || attribute("Grade") !== passport.grade) throw new PassportMismatch("The displayed item facts do not match the archived passport metadata.");
				return { ...passport, verification: { ...base, ...verified, status: "verified", message: null } };
			} catch (error) {
				return { ...passport, verification: { ...base, status: error instanceof PassportMismatch ? "mismatch" : "unavailable",
					message: error instanceof PassportMismatch ? error.message : "The blockchain could not be checked. No current owner or live verification is being asserted." } };
			}
		},
		asset: readAsset,
	};
}
