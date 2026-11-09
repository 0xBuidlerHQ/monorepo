# API client

Server-only HTTP client for the TrueOrigin API. Imported by both Next.js backends; database access remains inside `services/api`.

- `@0xhq/api-client`: authenticated HTTP helpers; guarded by `server-only`.
- `@0xhq/api-client/types`: serializable submission types, status labels, and allowed staff transitions, safe for UI code.
- `@0xhq/api-client/protocol`: Node signing/verifying primitives shared with the API service.

Pass the customer subject only after verifying the account session, or use `admin` / `staff` with an API-issued staff session. Signing keys must never be accepted from browsers or bundled into client components. See `services/api/README.md` for configuration and the trust boundary.
