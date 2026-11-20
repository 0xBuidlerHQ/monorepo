# TrueOrigin API

The shared backend for `app.trueorigin.com` and `admin.trueorigin.com`. This service owns the submissions database and private intake photos. Neither frontend imports its database or business logic. Both Next.js backends use the server-only `@0xhq/api-client` package.

## Run locally

```sh
pnpm --filter @0xhq/api dev
```

Root `pnpm dev` includes this service automatically. It listens on **http://localhost:3004**, bound to loopback. `GET /health` reports readiness. No separate database installation is needed.

`make dev` resets and reuses the fixed `.dev-data/` directory at the repository root
and supplies fresh service credentials on every launch. The paths below describe direct service launches; previous data is not loaded
by `make dev`. See the [root guide](../../README.md).

Development admin access is automatic; the password command below is only for testing the explicit sign-in flow.

On first start, the service creates:

- `.data/submissions.sqlite`: SQLite with WAL mode, constraints, history, staff sessions, and request nonces.
- `.data/uploads/`: private submission photographs, stored outside the web roots and public IPFS gateway.
- `.data/service-keys.json`: separate development signing secrets for each app.
- `.data/admin-bootstrap.txt`: a randomly generated local staff password.

All of `.data/` is excluded from Git. To display the **local** staff password in your terminal:

```sh
pnpm --filter @0xhq/api admin:password
```

In development, open http://localhost:3002 directly; no password is required. The local admin backend still signs API requests, and access is restricted to localhost. Production always requires staff sign-in. Open http://localhost:3001/submit to create or sign in with a customer passkey and send a request. No wallet deployment, blockchain transaction, external email, public IPFS upload, or NFT mint occurs during submission.

Each app defaults to the local API and discovers development signing keys from the standard service directory. If you change `API_DATA_DIR`, point both apps' `API_SERVICE_KEYS_FILE` to the resulting absolute signing-key file path, or configure their matching server-side secret explicitly.

## Authentication boundary

Customer passkey authentication remains in the customer app's existing authentication database. Its server verifies the HttpOnly account session and derives a stable actor identifier from the RP ID and credential ID. It then signs a short-lived API request. The browser cannot choose an owner identifier or obtain signing secrets.

The API verifies a separate HMAC signing secret for each application, binding the subject, HTTP method, path/query, timestamp, unique nonce, authorization token, and exact body bytes. Persistent single-use nonces reject replay. Customer permissions come from the authenticated signer, never fields in the request JSON.

Admin requests need **both** the admin backend signature and a valid staff session issued by the API after password verification. Passwords are stored as salted scrypt hashes. Staff sessions are opaque, hashed in SQLite, expire after eight hours, and can be revoked. Password changes invalidate existing sessions. Staff login attempts are limited; the admin browser cookie is HttpOnly, SameSite=Strict, and Secure in production. Mutating Next.js actions also validate their origin. The initial staff account is one operator; multi-staff provisioning and issuer roles can be added separately.

The API is for backend callers; it does not enable browser CORS or accept Origin-bearing requests. Local unsigned requests cannot access submissions or photos.

## Endpoints

All `/v1` endpoints require authenticated backend signatures. Staff endpoints also require staff authentication except for the login operation itself.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/v1/submissions` | Customer's own latest 100 requests, or staff's latest 100 submitted requests |
| POST | `/v1/submissions` | Create an idempotent customer draft |
| GET | `/v1/submissions/{id}` | Read an authorized record and its history |
| POST | `/v1/submissions/{id}/photos/front` or `/back` | Upload a private draft photo |
| GET | `/v1/submissions/{id}/photos/front` or `/back` | Retrieve an authorized private photo |
| POST | `/v1/submissions/{id}/submit` | Submit a draft for review |
| PATCH | `/v1/submissions/{id}/status` | Apply an authorized status transition with version checking |
| POST | `/v1/staff/login` | Verify staff password and issue a session |
| GET | `/v1/staff/session` | Validate the current staff session |
| POST | `/v1/staff/logout` | Revoke the current staff session |

Drafts contain a request UUID, certifier (PSA, CGC, or Beckett), certification ID, contact email, and the authenticated account’s receiving wallet. Item names and grades are not collected from the customer. Existing item names, grades, and notes remain readable on historical records. The owner and receiving wallet are determined by the customer backend from the verified passkey session, not form fields. Address resolution uses read-only Ethereum RPC calls; it does not deploy the wallet or send a transaction. Certification details are customer-provided until physical inspection; no PSA verification is implied by accepting a request.

Private front/back uploads accept PNG, JPEG, or WebP up to 8 MiB each; signatures are checked against actual file bytes. Photos are not required to submit a request. The initial customer form collects item details only; the private-photo endpoints remain available for existing records and later inspection work. Photo hashes and metadata remain in the database; photographs are not overwritten after submission. Draft retries with the same request ID and details reuse the same record. Only one active submission per certifier and certification ID is allowed; rejected/cancelled submissions release that constraint.

Staff can move a request through `requested → accepted → in_transit → received → under_inspection → approved`, with allowed rejection branches and optional direct receipt after acceptance. Customers can cancel their own drafts, requested, or accepted submissions via the API. Staff status updates require the current record version, and rejections require an explanation. Updates and public messages to the owner are appended to the audit history. There is no automatic shipping acceptance, live certification check, minting, or claim that a passport was issued.

## Deployment

This first version runs one API process with durable local storage. Both apps call it over HTTP; they do not share a SQLite mount. Back up the database with a consistent SQLite snapshot and preserve the associated uploads. Use a shared transactional database such as PostgreSQL before horizontally scaling the API.

In production, configure `API_CUSTOMER_SECRET`, `API_ADMIN_SECRET`, `API_ADMIN_PASSWORD`, and a durable `API_DATA_DIR`. Both secrets must be distinct and at least 32 characters; the password must be at least 12 characters. Each frontend receives only its matching signing secret and `API_URL`; never use `NEXT_PUBLIC_` for these values. Configure `ADMIN_ORIGIN` in the admin app. The API currently binds to localhost and checks localhost Host headers; a same-host private proxy can forward calls while preserving the local Host header. Add explicit private-network binding/host configuration before distributing the service across hosts.

IPFS remains a separate service for later public passport evidence and metadata. Minting and shipping integrations are not implemented by this submission backend.

## Checks

```sh
pnpm --filter @0xhq/api lint
pnpm --filter @0xhq/api typecheck
pnpm --filter @0xhq/api test
```

Integration tests use isolated temporary databases and verify ownership isolation, private photo access, staff sessions, allowed transitions, stale updates, active certification uniqueness, replay prevention, and restart persistence.

## Local passport issuance

Run the normal full stack with `pnpm dev`. Once an inspection is **Approved**, expand
it in admin and select **Issue passport**. Choose a universe (for example Pokémon) and a type (Card, Book, or Box), then complete its fields and grade. The display title is generated from these structured facts (for example, `Venusaur — Base Set #15/102`); it is not an editable field. New metadata includes the structured facts and generated NFT `name`. Item data uses `{ type, schemaVersion, universe, attributes }`. The versioned type definition drives field validation, staff forms, display labels and short/full titles. Cards use subject, set, number and printed total; books use title, author, ISBN, edition and publisher; boxes use name, set, product format, edition and language. All types support an optional boolean `attributes.sealed` for factory-seal status; it is independent of type and is never inferred for an unspecified object. The catalogue describes shared references; a passport identifies one physical copy with its own certification, owner and history. Readers render primitive attributes for unknown future types or versions and retain their immutable metadata title; issuance rejects unsupported schemas. Certification, ownership and history remain separate from item attributes. This development data format requires a fresh local reset.
The recipient is taken from the authenticated submission; the form cannot override it.
Acceptance alone never issues an NFT.

Issuance runs asynchronously in the API, so browser refreshes or a disconnected
admin tab do not cancel it. The admin view polls while issuance is pending. The
SQLite passport record has queued/prepared/submitted/confirmed/failed states. The
signed raw mint transaction and its hash are committed before broadcast. RPC errors
retain the same transaction for reconciliation; a confirmed on-chain revert is the
only automatic path that permits signing a new mint transaction on explicit retry.
Duplicate clicks return the existing job and item ID.

The API creates a **local-only** issuer key under `.data/passport-chain/` with mode
0600. During development startup it funds that key using Anvil and deploys TrueOriginPassport
with that account as local admin/issuer. Both loopback RPC and chain ID 31337 are
required before any signing or funding. Production issuance is disabled even if
`PASSPORT_LOCAL_ISSUANCE=true`; no mainnet private key is read or used. For a real
network, implement the reviewed issuer, durable external storage, finality/reorg
policy, and authentication/correction model first.

Metadata includes only public item facts, an opaque item ID, and a generated passport
image. Private uploaded photos, owner email, notes, and shipping data are never
published automatically. Before signing, the API verifies IPFS reads and writes the
original metadata/image, full CAR archives, and an integrity manifest under
`.data/passports/<item-id>/`. Existing metadata bytes are preserved and verified
across retries, rather than being rebuilt under an already-signed transaction.

These backups and the IPFS node are local development storage on the same machine;
they are not independent disaster-recovery replicas. Back up the entire API data
directory and use independent storage in production. A chain reset is not repaired
by silently reminting existing passports: restore the previous chain snapshot, or
use a new development data directory to start a separate test environment.

After confirmation, the customer's Collection lists passports currently owned by
their server-derived wallet. Ownership is read from the contract, so standard NFT
transfers outside TrueOrigin remove the NFT from the old wallet's Collection and
include it in the new wallet's Collection. Physical handover is not inferred from a
blockchain transfer. Passport discovery and collection membership use the public
[Ponder index](../indexer/README.md), with live contract verification before asserting ownership.

### Verification

```sh
pnpm --filter @0xhq/api test
pnpm --filter @0xhq/api test:issuance
```

The second command starts its own temporary Anvil, IPFS, API, and Ponder instances and cleans
them up. Foundry (`anvil` and `cast`) must be on PATH. It tests real issuance, duplicate
requests, backup restoration into an empty IPFS store, restart idempotency, private
metadata exclusion, and an external transfer. It does not touch the running dev chain.

## Public passports and verification

Public reads come from Ponder rather than the private SQLite issuance cache.
Only confirmed on-chain issuances are published. The customer app reads `/v1/passports/public`,
`/v1/passports/lookup?certifier=PSA&number=...`, and `/v1/passports/<item-id>` using its
backend service signature; visitors do not need a customer account. These endpoints
serialize an explicit public DTO and never return submission IDs, emails, notes,
private photos, raw signed transactions, or issuer credentials. Ponder unavailability
or incomplete historical indexing returns 503, without a private-database fallback.

The read-only SDK checks the configured chain, executable contract code, item/token
mapping, token URI, successful canonical mint receipt and event, and the Transfer
history against the current owner at one block snapshot. Displayed item facts are
also checked against immutable IPFS metadata or its integrity-verified local backup. It does not initialize
an issuer, read its key, fund accounts, deploy, or send a transaction. RPC failure and
record mismatch produce separate unavailable/mismatch results with no asserted owner
or history, rather than returning stale data as verified.

New immutable metadata records the public inspection approval date. Older metadata
without this fact reports it as not recorded after rebuilding; it is never invented.
The public inspection status means the approval recorded by TrueOrigin. The current
contract has no revocation tracking, and the response/UI state that limitation.
NFT transfers never imply physical handover, delivery, possession, or that a physical
object shown alongside an NFT is the inspected object.

`/v1/passports/<item-id>/image` and `/metadata` expose only the public issuance
artifacts after checking their manifest references and hashes. These archived assets
remain readable when the original local IPFS service is offline. The customer app
proxies them through `/api/passports/<item-id>/<asset>` with restrictive SVG CSP.

The end-to-end issuance test also covers public lookup, current owner/history after
an external transfer, access without the issuer key, unknown IDs, private-field
exclusion, archive availability without IPFS, independence from changed private cache
fields, full rebuild without the original index or private SQLite/artifact directory,
and chain outages/resets. See the [recovery guide](../indexer/README.md).

## Platform activity

`GET /v1/activity?kind=all&limit=30&cursor=...` is a signed public read endpoint for the Activity page. It exposes chain-derived passport issuance and ownership transfer events with original transaction timestamps, wallet addresses, public item facts, and stable IDs. Newest-first pagination uses block/log cursors. `kind` accepts `all`, `issued`, `transfer`, `sale`, or `listing`; the last two return empty results while the marketplace is unavailable. Transfers are not treated as sales. Metadata outages retain the event with `passport: null`. No submission contacts, private notes, or private photos are returned.

Public event links use `/activity/<eventId>` and `GET /v1/activity/<eventId>`. IDs are a versioned SHA-256 digest of canonical chain ID, transaction hash and log index, truncated to 128 bits and encoded as base64url. The indexer uses this derived ID as the event primary key, so rebuilding produces identical IDs without a separate mapping table. Source identifiers remain separate fields, including `chainId`. Only the prefix-free public ID format is accepted; no legacy ID routes or redirects are provided.

The customer Activity refreshes the newest page every 15 seconds, applies filters without navigation, and pauses automatic updates while viewing older events. It labels previously loaded data when updates fail. The recovery integration test verifies activity ordering, filtering, pagination, privacy, metadata outages, and reconstruction from an empty database.

### Manual physical handovers

After a received item is approved or rejected, staff record its return with `POST /v1/submissions/:id/return`:

```json
{ "method": "in_person", "details": { "location": "TrueOrigin office" }, "version": 6 }
```

Or delivery:

```json
{ "method": "delivery", "details": { "carrier": "DHL", "trackingNumber": "123456" }, "version": 6 }
```

Meeting location is optional. Staff record an in-person handover after giving the owner the item, or delivery after giving the parcel to the carrier. Both create an `awaiting_receipt` handover; only the original customer can confirm receipt with `PATCH` on the same path and `{ "version": 7 }`. Both operations enforce optimistic versions; identical retries are idempotent and recorded method/details cannot be overwritten. Carrier tracking is entered manually, without external carrier integration.

The shared definitions in `packages/api-client/src/handovers.ts` own method labels, fields, validation, and summaries. Add a method to `HandoverDetailsByMethod` and `handoverMethods` to expose its form in admin and its details in the customer app without changing the receipt workflow or storage schema. The reusable `PhysicalHandover` model is currently wired to submission returns; peer-to-peer delivery is not yet wired up.

Handover details, actor IDs and receipt timestamps stay private in `submission_handovers` in the submissions SQLite database. Schema v4 migrates existing v3 delivery records, retaining their details, timestamps and status; the legacy table is retained as a migration backup and is no longer used. Back up this database: chain reconstruction restores public passports and ownership, not private handover records.

NFT issuance and physical return are independent. Receipt confirmation is the customer's assertion, not carrier verification or a guarantee of physical possession. Handover details and receipt assertions are never published in NFT metadata or the public activity stream.

`make dev` sets `TRUEORIGIN_DEV_SEED=true` and seeds development data after local services are ready: eight real passport NFTs, twelve submissions with card photos, three on-chain transfers, and four return records (two with receipt confirmed). The API entrypoint uses authenticated API operations and the regular durable issuance worker; no records are injected into the index. Public WebP artwork is uploaded to local IPFS, content-checked, and backed up with its CAR archive before minting. Metadata explicitly marks the records as fictional local demos. Existing SVG passport images remain supported.

The dataset is defined in `src/development/fixtures.ts`. It uses deterministic request IDs and fictional certification numbers, and rerunning against the same chain/database is idempotent. Owners are Anvil test wallets, not fabricated signed-in customer accounts. On a fork, the seed removes only EIP-7702 delegations from those known demo wallets through the local Anvil RPC; unexpected contract code is left intact and reported. `.dev-data/api/development-seed.json` records public item IDs, owners, and CIDs. Pending/rejected requests remain private workflow data.

Use `TRUEORIGIN_DEV_SEED=false make dev` for an empty run. Plain `pnpm dev` does not enable seeding unless the flag is set explicitly. Seeding refuses production, non-loopback services, and RPCs reporting a chain other than 31337. Bootstrap and production issuance guards remain unchanged.

`pnpm --filter @0xhq/api test:seed` runs an isolated Anvil/API/IPFS/Ponder integration test. It verifies on-chain token URIs, byte-for-byte IPFS card images, workflow states, returns, transfer activity, restart idempotency, raster backup serving, and automatic startup wiring.
