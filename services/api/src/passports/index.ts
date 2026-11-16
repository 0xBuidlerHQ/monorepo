import { HttpError } from "../errors.ts";
import type { PublicPassport, Certifier, ActivityQuery, ActivityPage } from "@0xhq/api-client/types";
export type IndexedPassport = {
	itemId: string;
	contractAddress: string;
	tokenId: string;
	metadataURI: string;
	issuer: string;
	issuedTo: string;
	owner: string;
	transactionHash: string;
	issuedAt: number;
};
export async function readIPFS(uri: string, gateway: string) {
	const match =
		/^ipfs:\/\/([a-zA-Z0-9]{20,150})\/([a-zA-Z0-9._-]{1,100})$/.exec(uri);
	if (!match) throw new HttpError(503, "Invalid immutable passport reference.");
	try {
		const response = await fetch(
			new URL(`/ipfs/${match[1]}/${match[2]}`, gateway),
			{ signal: AbortSignal.timeout(5000), redirect: "error" },
		);
		if (!response.ok) throw new Error("Missing IPFS content");
		if (Number(response.headers.get("content-length")) > 2 * 1024 * 1024)
			throw new Error("Passport asset too large");
		const reader = response.body?.getReader();
		if (!reader) throw new Error("Empty asset");
		const parts: Uint8Array[] = [];
		let size = 0;
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				size += value.length;
				if (size > 2 * 1024 * 1024) throw new Error("Passport asset too large");
				parts.push(value);
			}
		} finally {
			await reader.cancel();
		}
		return Buffer.concat(parts);
	} catch {
		throw new HttpError(
			503,
			"The immutable passport content is unavailable. Restore its pinned IPFS content or CAR backup.",
		);
	}
}
export function createPassportIndex(
	url = "http://127.0.0.1:3005",
	metadata: (row: IndexedPassport) => Promise<Buffer>,
) {
	async function request(path: string) {
		try {
			const ready = await fetch(new URL("/ready", url), {
				signal: AbortSignal.timeout(3000),
				redirect: "error",
			});
			if (!ready.ok) throw new Error("Index is rebuilding");
			const response = await fetch(new URL(path, url), {
				signal: AbortSignal.timeout(8000),
				redirect: "error",
			});
			if (response.status === 404)
				throw new HttpError(
					404,
					"No issued TrueOrigin passport matches these details.",
				);
			if (!response.ok) throw new Error("Index unavailable");
			return await response.json();
		} catch (error) {
			if (error instanceof HttpError) throw error;
			throw new HttpError(
				503,
				"The public passport index is unavailable or rebuilding. Try again shortly.",
			);
		}
	}
	async function hydrate(row: IndexedPassport): Promise<PublicPassport> {
		try {
			const document = JSON.parse((await metadata(row)).toString("utf8"));
			const attribute = (name: string): string =>
				document.attributes?.find(
					(a: { trait_type: string }) => a.trait_type === name,
				)?.value ?? "";
			const certifier = attribute("Certifier");
			if (
				document.trueorigin?.item_id !== row.itemId ||
				document.trueorigin?.chain_id !== 31337 ||
				typeof document.name !== "string" ||
				!["PSA", "CGC", "BGS"].includes(certifier) ||
				typeof document.image !== "string"
			)
				throw new Error("Metadata mismatch");
			const approvedAt = document.trueorigin.inspection_approved_at;
			if (
				approvedAt != null &&
				(typeof approvedAt !== "string" ||
					!Number.isFinite(Date.parse(approvedAt)))
			)
				throw new Error("Invalid inspection date");
			if (
				typeof attribute("Certification number") !== "string" ||
				typeof attribute("Grade") !== "string"
			)
				throw new Error("Invalid item facts");
			return {
				itemId: row.itemId,
				title: document.name,
				grade: attribute("Grade"),
				certifier: certifier as Certifier,
				certificationNumber: attribute("Certification number"),
				chainId: 31337,
				contractAddress: row.contractAddress,
				tokenId: row.tokenId,
				metadataURI: row.metadataURI,
				imageURI: document.image,
				transactionHash: row.transactionHash,
				issuedTo: row.issuedTo,
				issuedAt: new Date(row.issuedAt * 1000).toISOString(),
				inspection: {
					status: approvedAt ? "approved" : "not_recorded",
					approvedAt: typeof approvedAt === "string" ? approvedAt : null,
					revocationSupported: false,
				},
			};
		} catch (error) {
			if (error instanceof HttpError) throw error;
			throw new HttpError(
				503,
				"Indexed passport metadata is invalid or unavailable.",
			);
		}
	}
	return {
		async activity(query: ActivityQuery = {}): Promise<ActivityPage> {
			if (query.kind === "sale" || query.kind === "listing") return { events: [], nextCursor: null };
			const params = new URLSearchParams({ kind: query.kind ?? "all", limit: String(query.limit ?? 30) });
			if (query.cursor) params.set("cursor", query.cursor);
			type Row = { event: { id: string; from: string; to: string; transactionHash: string; blockNumber: string; logIndex: number; timestamp: number }; passport: IndexedPassport };
			const page: { events: Row[]; nextCursor: string | null } = await request(`/v1/activity?${params}`);
			const facts = new Map<string, Promise<PublicPassport | null>>();
			return { nextCursor: page.nextCursor, events: await Promise.all(page.events.map(async row => {
				if (!facts.has(row.passport.itemId)) facts.set(row.passport.itemId, hydrate(row.passport).catch(() => null));
				return { id: `31337:${row.event.transactionHash}:${row.event.logIndex}`, kind: /^0x0{40}$/i.test(row.event.from) ? "issued" as const : "transfer" as const,
					itemId: row.passport.itemId, tokenId: row.passport.tokenId, contractAddress: row.passport.contractAddress,
					from: row.event.from, to: row.event.to, transactionHash: row.event.transactionHash, blockNumber: row.event.blockNumber, logIndex: row.event.logIndex,
					timestamp: new Date(row.event.timestamp * 1000).toISOString(), passport: await facts.get(row.passport.itemId) ?? null };
			})) };
		},
		async record(itemId: string) {
			return hydrate(
				await request(`/v1/passports/${encodeURIComponent(itemId)}`),
			);
		},
		async list(owner?: string): Promise<PublicPassport[]> {
			const rows: IndexedPassport[] = await request(
				`/v1/passports${owner ? `?owner=${encodeURIComponent(owner)}` : ""}`,
			);
			return Promise.all(rows.map(hydrate));
		},
	};
}
