import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { developmentFixtures, fixtureImage } from "./development/fixtures.ts";
import { seedDevelopmentData } from "./development/seed.ts";
import { passportAsset } from "./passports/assets.ts";

const options = { apiURL: "http://127.0.0.1:1", rpcURL: "http://127.0.0.1:1", keys: { customer: "test-customer-".repeat(4), admin: "test-admin-".repeat(4) }, adminPassword: "test-admin-password", manifest: "/unused-development-seed.json", log: () => {} };
test("fixtures have unique identities, real local WebP artwork, and varied workflow states", async () => {
 assert.equal(developmentFixtures.length, 12); assert.equal(developmentFixtures.filter(row => row.issue).length, 8);
 assert.equal(new Set(developmentFixtures.map(row => row.certificationNumber)).size, 12);
 assert.equal(new Set(developmentFixtures.map(row => row.requestId)).size, 12);
 for (const row of developmentFixtures) {
  const bytes = await fixtureImage(row);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF"); assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
 }
});
test("seeding refuses remote endpoints and production before making requests", async () => {
 await assert.rejects(seedDevelopmentData({ ...options, apiURL: "https://example.com" }), /local HTTP/);
 const previous = process.env.NODE_ENV;
 try { process.env.NODE_ENV = "production"; await assert.rejects(seedDevelopmentData(options), /disabled in production/); }
 finally { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; }
});
test("a loopback RPC reporting mainnet is rejected before any API mutation", async () => {
 let apiRequests = 0;
 const server = createServer((request, response) => {
  if (request.url !== "/rpc") apiRequests++;
  request.resume(); response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify({ jsonrpc: "2.0", id: 1, result: "0x1" }));
 });
 server.listen(0, "127.0.0.1"); await once(server, "listening");
 const address = server.address(); assert(address && typeof address !== "string");
 try { await assert.rejects(seedDevelopmentData({ ...options, apiURL: `http://127.0.0.1:${address.port}`, rpcURL: `http://127.0.0.1:${address.port}/rpc` }), /chain 31337/); assert.equal(apiRequests, 0); }
 finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
test("passport assets preserve legacy SVG support and determine raster MIME types without trusting arbitrary paths", () => {
 assert.deepEqual(passportAsset("ipfs://bafytest/passport.webp", "image"), { name: "passport.webp", contentType: "image/webp" });
 assert.equal(passportAsset("ipfs://bafytest/passport.svg", "image").contentType, "image/svg+xml");
 assert.equal(passportAsset("ipfs://bafytest/metadata.json", "metadata").contentType, "application/json");
 for (const uri of ["https://example.com/passport.webp", "ipfs://bafytest/private.sqlite", "ipfs://bafytest/subdir/passport.webp", "ipfs://bafytest/passport.webp?x=1"]) assert.throws(() => passportAsset(uri, "image"));
});
