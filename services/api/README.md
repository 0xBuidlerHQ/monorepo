# TrueOrigin API

The shared backend for `app.trueorigin.com` and `admin.trueorigin.com`. This service owns the submissions database and private intake photos. Neither frontend imports its database or business logic. Both Next.js backends use the server-only `@0xhq/api-client` package.

## Run locally

```sh
pnpm --filter @0xhq/api dev
```

Root `pnpm dev` includes this service automatically. It listens on **http://localhost:3004**, bound to loopback. `GET /health` reports readiness. No separate database installation is needed.

On first start, the service creates:

- `.data/submissions.sqlite`: SQLite with WAL mode, constraints, history, staff sessions, and request nonces.
- `.data/uploads/`: private submission photographs, stored outside the web roots and public IPFS gateway.
- `.data/service-keys.json`: separate development signing secrets for each app.
- `.data/admin-bootstrap.txt`: a randomly generated local staff password.

All of `.data/` is excluded from Git. To display the **local** staff password in your terminal:

```sh
pnpm --filter @0xhq/api admin:password
```

Open http://localhost:3002 and sign in with that password. Open http://localhost:3001/submit to create or sign in with a customer passkey and send a request. No wallet deployment, blockchain transaction, external email, public IPFS upload, or NFT mint occurs during submission.

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
