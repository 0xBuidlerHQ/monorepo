import { mkdir, open, readFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { digest } from "@0xhq/api-client/protocol";
import type { PassportIssuance } from "@0xhq/api-client/types";

export async function durableWrite(path: string, bytes: Uint8Array) {
	const temporary = `${path}.tmp`;
	const file = await open(temporary, "w", 0o600);
	try { await file.writeFile(bytes); await file.sync(); } finally { await file.close(); }
	await rename(temporary, path);
	if (digest(await readFile(path)) !== digest(bytes)) throw new Error("Passport backup verification failed.");
}
const escapeXML = (value: string) => value.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
export async function storePassportMetadata(directory: string, passport: PassportIssuance, ipfsURL: string) {
	const origin = new URL(ipfsURL);
	if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) throw new Error("Use the local IPFS service for development issuance.");
	const backup = join(directory, "passports", passport.itemId);
	await mkdir(backup, { recursive: true, mode: 0o700 });
	if (passport.metadataURI) {
		// Once a transaction can reference a CID, preserve its exact bytes across retries and code upgrades.
		const manifest = JSON.parse(await readFile(join(backup, "manifest.json"), "utf8")) as { itemId: string; image: { cid: string; uri: string; sha256: string; archiveSha256: string }; metadata: { cid: string; uri: string; sha256: string; archiveSha256: string } };
		if (manifest.itemId !== passport.itemId || manifest.metadata.uri !== passport.metadataURI || manifest.image.uri !== passport.imageURI) throw new Error("Passport backup manifest does not match the saved issuance.");
		for (const [name, asset] of [["passport.svg", manifest.image], ["metadata.json", manifest.metadata]] as const) {
			if (!/^[a-zA-Z0-9]{20,150}$/.test(asset.cid) || asset.uri !== `ipfs://${asset.cid}/${name}`) throw new Error("Invalid passport backup reference.");
			const original = await readFile(join(backup, name)), archive = await readFile(join(backup, `${name}.car`));
			if (digest(original) !== asset.sha256 || digest(archive) !== asset.archiveSha256) throw new Error("Passport backup integrity check failed.");
			const response = await fetch(new URL(`/ipfs/${asset.cid}/${name}`, origin), { signal: AbortSignal.timeout(10_000), redirect: "error" });
			if (!response.ok || digest(new Uint8Array(await response.arrayBuffer())) !== asset.sha256) throw new Error("Pinned passport content is unavailable. Restore it from the saved CAR archive.");
		}
		return { metadataURI: manifest.metadata.uri, imageURI: manifest.image.uri };
	}
	async function asset(name: string, contentType: string, bytes: Buffer) {
		await durableWrite(join(backup, name), bytes);
		const response = await fetch(new URL("/api/uploads", origin), { method: "POST", headers: { "Content-Type": contentType, "X-File-Name": name }, body: Uint8Array.from(bytes), signal: AbortSignal.timeout(10_000), redirect: "error" });
		if (!response.ok) throw new Error("Local IPFS upload failed. Start the IPFS service before issuing.");
		const result = await response.json() as { cid: string; uri: string };
		if (!/^[a-zA-Z0-9]{20,150}$/.test(result.cid) || result.uri !== `ipfs://${result.cid}/${name}`) throw new Error("Invalid IPFS upload response.");
		const downloaded = await fetch(new URL(`/ipfs/${result.cid}/${name}`, origin), { signal: AbortSignal.timeout(10_000), redirect: "error" });
		if (!downloaded.ok || digest(new Uint8Array(await downloaded.arrayBuffer())) !== digest(bytes)) throw new Error("Pinned passport data did not match the original.");
		const archive = await fetch(new URL(`/api/archives/${result.cid}`, origin), { signal: AbortSignal.timeout(10_000), redirect: "error" });
		if (!archive.ok) throw new Error("IPFS archive backup is unavailable.");
		const car = Buffer.from(await archive.arrayBuffer());
		if (!car.length || car.length > 10 * 1024 * 1024) throw new Error("Invalid IPFS archive backup.");
		await durableWrite(join(backup, `${name}.car`), car);
		return { uri: result.uri, cid: result.cid, sha256: digest(bytes), archiveSha256: digest(car) };
	}
	const title = escapeXML(passport.title.slice(0, 44));
	const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" rx="48" fill="#171717"/><g transform="translate(56 56) scale(2)" fill="white"><path d="M8 4h20v4h-8v15h-4V8H8V4Z"/><path d="M9.5 12a12 12 0 1 0 17 0" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/></g><text x="56" y="370" font-family="sans-serif" font-size="64" fill="white">TrueOrigin</text><text x="56" y="440" font-family="sans-serif" font-size="40" fill="#a0a0a0">Digital passport</text><text x="56" y="640" font-family="sans-serif" font-size="28" fill="white">${title}</text><text x="56" y="710" font-family="monospace" font-size="26" fill="#ff5f00">${escapeXML(passport.certifier)} · ${escapeXML(passport.certificationNumber)}</text><text x="56" y="900" font-family="sans-serif" font-size="20" fill="#999">Issued after inspection by TrueOrigin</text></svg>`);
	const image = await asset("passport.svg", "image/svg+xml", svg);
	// Only public item facts are serialized. Never include the submission/contact/shipping data.
	const metadata = Buffer.from(JSON.stringify({ name: passport.title, description: "A digital passport issued after inspection by TrueOrigin. NFT ownership alone does not prove physical possession or delivery.", image: image.uri,
		attributes: [{ trait_type: "Certifier", value: passport.certifier }, { trait_type: "Certification number", value: passport.certificationNumber }, ...(passport.grade ? [{ trait_type: "Grade", value: passport.grade }] : [])],
		trueorigin: { schema_version: "2", inspection_approved_at: passport.inspectionApprovedAt ?? null, item_id: passport.itemId, issued_at: passport.createdAt, network: "local-development", chain_id: 31337 } }));
	const document = await asset("metadata.json", "application/json", metadata);
	if (passport.metadataURI && passport.metadataURI !== document.uri) throw new Error("Stored passport metadata changed. Issuance stopped.");
	await durableWrite(join(backup, "manifest.json"), Buffer.from(JSON.stringify({ version: 1, itemId: passport.itemId, image, metadata: document })));
	return { metadataURI: document.uri, imageURI: image.uri };
}
