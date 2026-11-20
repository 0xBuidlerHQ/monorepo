import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { signedHeaders, type ServiceKeys } from "@0xhq/api-client/protocol";
import type { ActivityPage, PassportIssuance, PublicPassport, PublicPassportDetail, Submission, SubmissionStatus } from "@0xhq/api-client/types";
import { durableWrite } from "../passports/storage.ts";
import { developmentFixtures, demoWallets, fixtureImage } from "./fixtures.ts";

export async function seedDevelopmentData({ apiURL, rpcURL, keys, adminPassword, manifest, signal, fixtures = developmentFixtures, log = console.log }: {
 apiURL: string; rpcURL: string; keys: ServiceKeys; adminPassword: string; manifest: string; signal?: AbortSignal;
 fixtures?: typeof developmentFixtures; log?: (message: string) => void;
}) {
 if (process.env.NODE_ENV === "production") throw new Error("Development seeding is disabled in production.");
 for (const value of [apiURL, rpcURL]) {
  const url = new URL(value);
  if (url.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("Development seeding requires local HTTP services.");
 }
 const requestSignal = () => signal ? AbortSignal.any([signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000);
 async function rpc(method: string, params: unknown[] = []) {
  const response = await fetch(rpcURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: requestSignal() });
  if (!response.ok) throw new Error("Development chain is unavailable.");
  const result = await response.json() as { result: unknown; error?: { message: string } };
  if (result.error) throw new Error(result.error.message);
  return result.result;
 }
 async function wait<T>(read: () => Promise<T | null>, label: string): Promise<T> {
  const deadline = Date.now() + 120_000;
  let last = "";
  while (Date.now() < deadline) {
   signal?.throwIfAborted();
   try { const result = await read(); if (result !== null) return result; }
   catch (error) { last = error instanceof Error ? error.message : "Unavailable"; }
   await delay(200, undefined, { signal });
  }
  throw new Error(`Timed out ${label}${last ? `: ${last}` : ""}`);
 }
 const chain = await wait(async () => {
  const value = await rpc("eth_chainId");
  return typeof value === "string" ? value : null;
 }, "waiting for the local chain");
 if (chain !== "0x7a69") throw new Error("Development seeding requires chain 31337.");
 // These publicly known Anvil addresses can inherit EIP-7702 delegation from
 // mainnet. Demo owners must be plain EOAs so ERC-721 receiver callbacks work.
 for (const wallet of demoWallets) {
  const code = await rpc("eth_getCode", [wallet, "latest"]);
  if (code === "0x") continue;
  if (typeof code !== "string" || !/^0xef0100[0-9a-f]{40}$/i.test(code)) throw new Error("A demo wallet contains unexpected contract code; refusing to overwrite it.");
  if (await rpc("eth_chainId") !== "0x7a69") throw new Error("Refusing to reset a demo delegation outside chain 31337.");
  await rpc("anvil_setCode", [wallet, "0x"]);
  if (await rpc("eth_getCode", [wallet, "latest"]) !== "0x") throw new Error("Could not reset the local demo wallet delegation.");
 }
 let staffToken = "";
 async function api<T>(path: string, { method = "GET", value, owner = 0, staff = false, bytes }: { method?: string; value?: unknown; owner?: number; staff?: boolean; bytes?: Buffer } = {}): Promise<T> {
  const body = bytes ?? (value === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(value)));
  const client = staff ? "admin" : "customer";
  const headers = signedHeaders({ client, secret: keys[client], subject: staff ? "staff" : `development:owner:${owner}`, method, path, body, token: staff ? staffToken : "" });
  const response = await fetch(new URL(path, apiURL), { method, headers: { ...headers, "Content-Type": bytes ? "image/webp" : "application/json" }, body: body.length ? Uint8Array.from(body) : undefined, signal: requestSignal() });
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(`Seed API ${method} ${path}: ${data.error ?? response.status}`);
  return data;
 }
 staffToken = (await api<{ token: string }>("/v1/staff/login", { method: "POST", value: { password: adminPassword }, staff: true })).token;
 log("Seeding local development cards: submissions, IPFS images, NFTs, and transfers…");
 const records: { fixture: typeof developmentFixtures[number]; submission: Submission }[] = [];
 for (const fixture of fixtures) {
  signal?.throwIfAborted();
  let submission = await api<Submission>("/v1/submissions", { method: "POST", owner: fixture.owner, value: {
   requestId: fixture.requestId, gradingCompany: fixture.certifier, certificationNumber: fixture.certificationNumber,
   recipientAddress: demoWallets[fixture.owner], contactEmail: `demo-owner-${fixture.owner + 1}@example.test`,
   notes: `Local development fixture: ${fixture.title}. Reference artwork, fictional certification and inspection; not a real authentication.`,
  } });
  if (submission.status === "draft") {
   submission = await api<Submission>(`/v1/submissions/${submission.id}/photos/front`, { method: "POST", owner: fixture.owner, bytes: await fixtureImage(fixture) });
   submission = await api<Submission>(`/v1/submissions/${submission.id}/submit`, { method: "POST", owner: fixture.owner });
  }
  const steps: SubmissionStatus[] = fixture.status === "requested" ? [] : fixture.status === "accepted" ? ["accepted"] : ["accepted", "received", "under_inspection", fixture.status];
  for (const status of [...new Set(steps)]) {
   if (submission.history.some(event => event.status === status)) continue;
   submission = await api<Submission>(`/v1/submissions/${submission.id}/status`, { method: "PATCH", staff: true, value: { status, version: submission.version, note: status === "rejected" ? "Simulated inspection rejection for development testing." : "Simulated staff inspection — local development fixture." } });
  }
  if (fixture.issue) await api<PassportIssuance>(`/v1/submissions/${submission.id}/passport`, { method: "POST", staff: true, value: { item: fixture.item, grade: fixture.grade, version: submission.version } });
  records.push({ fixture, submission });
 }
 const passports: { itemId: string; tokenId: string; title: string; certificationNumber: string; owner: string; metadataURI: string; imageURI: string | null }[] = [];
 for (const [position, { fixture, submission: original }] of records.filter(record => record.fixture.issue).entries()) {
  let submission = await wait(async () => {
   const row = await api<Submission>(`/v1/submissions/${original.id}`, { staff: true });
   if (row.passport?.status === "failed") throw new Error(row.passport.error ?? "Demo issuance failed.");
   return row.passport?.status === "confirmed" ? row : null;
  }, `confirming ${fixture.name}`);
  const passport = submission.passport;
  if (!passport?.tokenId || !passport.contractAddress || !passport.metadataURI) throw new Error("Confirmed demo passport is incomplete.");
  if (position < 4 && !submission.returnHandover) {
   submission = await api<Submission>(`/v1/submissions/${submission.id}/return`, { method: "POST", staff: true, value: { version: submission.version, ...(position % 2 ? { method: "in_person", details: { location: "TrueOrigin demo hub" } } : { method: "delivery", details: { carrier: "Demo delivery", trackingNumber: `DEMO-${fixture.certificationNumber}` } }) } });
  }
  if (position < 2 && submission.returnHandover?.status === "awaiting_receipt") await api<Submission>(`/v1/submissions/${submission.id}/return`, { method: "PATCH", owner: fixture.owner, value: { version: submission.version } });
  const path = `/v1/passports/${passport.itemId}`;
  let detail = await wait(async () => api<PublicPassportDetail>(path), `indexing ${fixture.name}`);
  const recipient = demoWallets[(fixture.owner + 1) % demoWallets.length];
  if (fixture.transfer && detail.verification.currentOwner?.toLowerCase() !== recipient.toLowerCase()) {
   if (detail.verification.currentOwner?.toLowerCase() !== demoWallets[fixture.owner].toLowerCase()) throw new Error("Demo passport ownership changed outside the seed flow.");
   if (await rpc("eth_chainId") !== "0x7a69") throw new Error("Refusing demo transfer outside chain 31337.");
   const { stdout } = await promisify(execFile)("cast", ["calldata", "safeTransferFrom(address,address,uint256)", demoWallets[fixture.owner], recipient, passport.tokenId], { signal });
   const hash = await rpc("eth_sendTransaction", [{ from: demoWallets[fixture.owner], to: passport.contractAddress, data: stdout.trim(), gas: "0x493e0" }]);
   await wait(async () => {
    const receipt = await rpc("eth_getTransactionReceipt", [hash]) as { status: string } | null;
    if (receipt && receipt.status !== "0x1") throw new Error("Demo transfer reverted.");
    return receipt;
   }, `confirming ${fixture.name} transfer`);
  }
  detail = await wait(async () => {
   const row = await api<PublicPassportDetail>(path);
   return !fixture.transfer || row.verification.currentOwner?.toLowerCase() === recipient.toLowerCase() ? row : null;
  }, `indexing ${fixture.name} ownership`);
  passports.push({ itemId: passport.itemId, tokenId: passport.tokenId, title: passport.title, certificationNumber: fixture.certificationNumber, owner: detail.verification.currentOwner ?? "", metadataURI: passport.metadataURI, imageURI: passport.imageURI });
 }
 await wait(async () => {
  const rows = await api<PublicPassport[]>("/v1/passports/public");
  return passports.every(passport => rows.some(row => row.itemId === passport.itemId)) ? true : null;
 }, "waiting for the public passports");
 await wait(async () => {
  const pending = new Set(passports.map(passport => `${passport.itemId}:issued`));
  for (const row of records.filter(record => record.fixture.transfer)) {
   const passport = passports.find(item => item.certificationNumber === row.fixture.certificationNumber);
   if (passport) pending.add(`${passport.itemId}:transfer`);
  }
  let cursor: string | null = "";
  while (cursor !== null && pending.size) {
   const query = new URLSearchParams({ limit: "50", ...(cursor ? { cursor } : {}) });
   const activity = await api<ActivityPage>(`/v1/activity?${query}`);
   for (const event of activity.events) pending.delete(`${event.itemId}:${event.kind}`);
   if (activity.nextCursor === cursor) throw new Error("Activity cursor did not advance.");
   cursor = activity.nextCursor;
  }
  return pending.size ? null : true;
 }, "waiting for indexed issuance and transfer activity");
 const result = { version: 1, chainId: 31337, wallets: demoWallets, passports, submissions: records.map(row => ({ id: row.submission.id, certificationNumber: row.fixture.certificationNumber, status: row.fixture.status })) };
 await durableWrite(manifest, Buffer.from(JSON.stringify(result, null, 2)));
 log(`Development data ready: ${passports.length} real NFTs with IPFS card images, ${records.length} submissions, ${fixtures.filter(row => row.transfer).length} transfers. Passports and Activity are populated.`);
 return result;
}
