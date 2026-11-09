import type { CID } from "multiformats/cid";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createHeliaLight } from "helia";
import { unixfs } from "@helia/unixfs";
import { FsBlockstore } from "blockstore-fs";
import { FsDatastore } from "datastore-fs";

export async function createStorage(directory: string) {
	await mkdir(directory, { recursive: true });
	const blockstore = new FsBlockstore(join(directory, "blocks"));
	const datastore = new FsDatastore(join(directory, "datastore"));
	await blockstore.open();
	await datastore.open();
	const helia = createHeliaLight({ blockstore, datastore, blockBrokers: [], routers: [] });
	await helia.start();
	const files = unixfs(helia);
	return {
		files,
		async add(name: string, content: Uint8Array) {
			let root: CID | undefined;
			for await (const entry of files.addAll([{ path: name, content }], { wrapWithDirectory: true, cidVersion: 1, rawLeaves: true })) {
				if (entry.path === "") root = entry.cid;
			}
			if (!root) throw new Error("IPFS import did not produce a directory.");
			// Recursively pin the directory and file blocks before reporting success.
			try {
				for await (const _cid of helia.pins.add(root)) { /* Consume the recursive pin operation. */ }
			} catch (error) {
				if (!(error instanceof Error) || error.name !== "AlreadyPinnedError") throw error;
			}
			return root.toString();
		},
		async close() {
			await helia.stop();
			await blockstore.close();
			await datastore.close();
		},
	};
}
