import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { once } from "node:events";
import { createServer } from "node:net";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { signedHeaders } from "@0xhq/api-client/protocol";
import type { PublicPassportDetail, ActivityPage, Submission } from "@0xhq/api-client/types";
import { createApiService } from "./server.ts";
import { createIpfsService } from "../../ipfs/src/server.ts";
import { seedDevelopmentData } from "./development/seed.ts";
import { developmentFixtures, developmentPassportImage, fixtureImage, demoWallets } from "./development/fixtures.ts";

async function freePort() {
 const server = createServer(); server.listen(0, "127.0.0.1"); await once(server, "listening");
 const address = server.address(); assert(address && typeof address !== "string");
 await new Promise<void>(resolve => server.close(() => resolve())); return address.port;
}
test("development seed creates real NFTs, IPFS card artwork, workflow records and transfers, and is idempotent", { timeout: 180_000 }, async () => {
 const directory = await mkdtemp(join(tmpdir(), "trueorigin-seed-"));
 const rpcURL = `http://127.0.0.1:${await freePort()}`, indexPort = await freePort(), indexerURL = `http://127.0.0.1:${indexPort}`;
 const anvil = spawn("anvil", ["--port", new URL(rpcURL).port, "--chain-id", "31337", "--silent"], { stdio: "ignore" });
 const deploymentsFile = join(directory, "deployments.json");
 let indexer: ReturnType<typeof spawn> | undefined;
 let api: Awaited<ReturnType<typeof createApiService>> | undefined;
 let ipfs: Awaited<ReturnType<typeof createIpfsService>> | undefined;
 let logs = "";
 let apiProcess: ReturnType<typeof spawn> | undefined;
 try {
  ipfs = await createIpfsService({ directory: join(directory, "ipfs"), port: 0 });
  const keys = { customer: "seed-customer-secret-".repeat(3), admin: "seed-admin-secret-".repeat(3) }, adminPassword = "seed-integration-password";
  const config = { directory: join(directory, "api"), keys, adminPassword, port: 0, passport: { bootstrap: true, enabled: true, rpcURL, indexerURL, ipfsURL: ipfs.url, deploymentsFile, image: developmentPassportImage } };
  api = await createApiService(config);
  // Reproduce the fork: public Anvil keys have delegated code on Ethereum.
  for (const wallet of demoWallets) {
   const response = await fetch(rpcURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "anvil_setCode", params: [wallet, `0xef0100${"00".repeat(18)}dead`] }) });
   assert.equal((await response.json()).result, null);
  }
  const cwd = fileURLToPath(new URL("../../indexer/", import.meta.url));
  indexer = spawn(process.execPath, [join(cwd, "scripts/dev.mjs")], { cwd, env: { ...process.env, NODE_ENV: "development", PONDER_PORT: String(indexPort), PASSPORT_RPC_URL: rpcURL, PASSPORT_DEPLOYMENTS_FILE: deploymentsFile, PONDER_DATABASE_DIR: join(directory, "index"), PONDER_TELEMETRY_DISABLED: "true" }, stdio: ["ignore", "pipe", "pipe"] });
  indexer.stdout?.on("data", chunk => { logs += chunk; }); indexer.stderr?.on("data", chunk => { logs += chunk; });
  const manifest = join(directory, "development-seed.json");
  const options = { apiURL: api.url, rpcURL, keys, adminPassword, manifest, log: () => {} };
  const seeded = await seedDevelopmentData(options);
  assert.equal(seeded.passports.length, 8); assert.equal(seeded.submissions.length, 12);
  assert.deepEqual(JSON.parse(await readFile(manifest, "utf8")), seeded);
  let token = "";
  async function call<T>(path: string, staff = false, value?: unknown): Promise<T> {
   const method = value === undefined ? "GET" : "POST", body = value === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(value));
   const response = await fetch(`${api?.url}${path}`, { method, headers: { ...signedHeaders({ client: staff ? "admin" : "customer", secret: staff ? keys.admin : keys.customer, subject: staff ? "staff" : "public:seed", method, path, body, token }), "Content-Type": "application/json" }, body: body.length ? Uint8Array.from(body) : undefined });
   assert.equal(response.status, 200, `${method} ${path}`); return response.json() as Promise<T>;
  }
  token = (await call<{token: string}>("/v1/staff/login", true, { password: adminPassword })).token;
  const submissions = await call<Submission[]>("/v1/submissions", true);
  assert.equal(submissions.length, 12);
  assert(submissions.every(row => row.photos.some(photo => photo.side === "front")));
  assert(submissions.some(row => row.status === "requested")); assert(submissions.some(row => row.status === "accepted"));
  assert(submissions.some(row => row.status === "under_inspection")); assert(submissions.some(row => row.status === "rejected"));
  assert.equal(submissions.filter(row => row.returnHandover).length, 4);
  assert.equal(submissions.filter(row => row.returnHandover?.status === "received").length, 2);
  const activity = await call<ActivityPage>("/v1/activity?limit=50");
  assert.equal(activity.events.filter(event => event.kind === "issued").length, 8);
  assert.equal(activity.events.filter(event => event.kind === "transfer").length, 3);
  for (const item of seeded.passports) {
   const detail = await call<PublicPassportDetail>(`/v1/passports/${item.itemId}`);
   assert.equal(detail.verification.status, "verified"); assert.equal(detail.verification.currentOwner?.toLowerCase(), item.owner.toLowerCase());
   const fixture = developmentFixtures.find(row => row.certificationNumber === item.certificationNumber); assert(fixture);
   assert.equal(detail.verification.history.filter(event => event.kind === "transfer").length, fixture.transfer ? 1 : 0);
   const imageResponse: Response = await fetch(`${ipfs.url}/ipfs/${item.imageURI?.slice(7)}`);
   assert.equal(imageResponse.headers.get("content-type"), "image/webp");
   assert.deepEqual(Buffer.from(await imageResponse.arrayBuffer()), await fixtureImage(fixture));
   const metadata = await (await fetch(`${ipfs.url}/ipfs/${item.metadataURI.slice(7)}`)).json();
   assert.equal(metadata.image, item.imageURI); assert.equal(metadata.trueorigin.demo, true);
   assert.match(metadata.description, /fictional/);
   const { stdout } = await promisify(execFile)("cast", ["call", detail.contractAddress, "tokenURI(uint256)(string)", item.tokenId, "--rpc-url", rpcURL]);
   assert.equal(JSON.parse(stdout.trim()), item.metadataURI);
   const backup = join(config.directory, "passports", item.itemId);
   assert((await readFile(join(backup, "passport.webp.car"))).length > 0);
  }
  const again = await seedDevelopmentData(options);
  assert.deepEqual(again, seeded);
  const repeated = await call<ActivityPage>("/v1/activity?limit=50");
  assert.deepEqual(repeated.events.map(event => event.id), activity.events.map(event => event.id));
  assert.equal((await call<Submission[]>("/v1/submissions", true)).length, 12);
  // Raster images remain available with the correct MIME type after the gateway stops.
  await ipfs.close(); ipfs = undefined;
  const first = seeded.passports[0], path = `/v1/passports/${first.itemId}/image`;
  const response = await fetch(`${api.url}${path}`, { headers: signedHeaders({ client: "customer", secret: keys.customer, subject: "public:seed", method: "GET", path, body: Buffer.alloc(0) }) });
  assert.equal(response.status, 200); assert.equal(response.headers.get("content-type"), "image/webp");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await fixtureImage(developmentFixtures[0]));
  // Exercise the actual API entrypoint used by make dev, not only the seed helper.
  await api.close(); api = undefined;
  ipfs = await createIpfsService({ directory: join(directory, "ipfs"), port: 0 });
  apiProcess = spawn(process.execPath, [fileURLToPath(new URL("./index.ts", import.meta.url))], {
   env: { ...process.env, NODE_ENV: "development", TRUEORIGIN_DEV_SEED: "true", API_DATA_DIR: config.directory, API_PORT: String(await freePort()), API_CUSTOMER_SECRET: keys.customer, API_ADMIN_SECRET: keys.admin, API_ADMIN_PASSWORD: adminPassword, PASSPORT_RPC_URL: rpcURL, PASSPORT_INDEXER_URL: indexerURL, PASSPORT_IPFS_URL: ipfs.url, PASSPORT_DEPLOYMENTS_FILE: deploymentsFile }, stdio: ["ignore", "pipe", "pipe"],
  });
  apiProcess.stdout?.on("data", chunk => { logs += chunk; }); apiProcess.stderr?.on("data", chunk => { logs += chunk; });
  const automaticManifest = join(config.directory, "development-seed.json");
  let automatic: typeof seeded | null = null;
  for (let n = 0; n < 100; n++) {
   try { automatic = JSON.parse(await readFile(automaticManifest, "utf8")); break; } catch {}
   if (apiProcess.exitCode !== null) throw new Error(`Automatic seed process exited: ${logs.slice(-2000)}`);
   await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(automatic, `Automatic seed did not complete: ${logs.slice(-2000)}`);
  assert.deepEqual(automatic, seeded);
  console.log("Seed verified: 8 on-chain passports, 8 real IPFS card images, 12 submissions, 3 indexed transfers, idempotent reruns, and automatic API startup.");
 } catch (error) { if (logs.includes("Error")) console.error(logs.slice(-2000)); throw error; }
 finally {
  if (apiProcess && apiProcess.exitCode === null && apiProcess.signalCode === null) { const stopped = once(apiProcess, "exit"); apiProcess.kill("SIGTERM"); await stopped; }
  if (indexer && indexer.exitCode === null && indexer.signalCode === null) { const stopped = once(indexer, "exit"); indexer.kill("SIGTERM"); await stopped; }
  await api?.close(); await ipfs?.close();
  if (anvil.exitCode === null && anvil.signalCode === null) { const stopped = once(anvil, "exit"); anvil.kill("SIGTERM"); await stopped; }
  await rm(directory, { recursive: true, force: true });
 }
});
