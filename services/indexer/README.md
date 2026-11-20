# TrueOrigin public index

Ponder indexes the trusted TrueOrigin Passport contracts. Its database is a disposable projection of public chain data, independent of the private submission database.

## Local development

Run `make dev` from the repository root for a fresh environment on every launch, or
`pnpm dev` to use the configured service data directories. The indexer listens on **127.0.0.1:3005** and uses embedded PGlite; no PostgreSQL installation is needed locally.

On a fresh development environment, the API initializes the local passport contract at startup (without minting an NFT). The indexer waits for that deployment manifest, then starts even when the registry is empty. The issuer writes `deployments/local.json`, containing only the chain ID, trusted contract addresses, deployment blocks, and their block hashes. The indexer starts automatically and restarts when this manifest changes. Existing local deployments are discovered read-only from the saved deployment receipt, without reading submission SQLite, creating a signer, or minting anything.

To run it separately:

```sh
pnpm --filter @0xhq/indexer dev
```

The API uses `PASSPORT_INDEXER_URL` (default `http://127.0.0.1:3005`). It returns an unavailable response while the index is offline or historical indexing is incomplete, rather than falling back to the private issuance cache. After a new mint or external transfer there can be a short indexing delay. Collection ownership and passport verification are also checked directly against the current chain. A chain reset or deployment block-hash mismatch makes indexed data unavailable; it is never silently treated as the current registry.

## What can be reconstructed

- Passport IDs, token IDs, immutable metadata URIs, issuing accounts, original recipients, mint transactions and timestamps, current NFT owners, and transfer history come from the chain.
- Public item names, certifiers, certificate numbers, grades, and images come from the immutable IPFS metadata referenced by each token. New metadata includes the public inspection approval timestamp.
- Previously minted metadata is never rewritten. If it lacks the approval timestamp, the rebuilt public record reports `not_recorded` for that inspection detail.
- Emails, shipping information, intake photographs, submission progress, staff sessions, and customer authentication are private operational data. They are not indexed or recoverable from public chain data.

Handlers only read chain data. IPFS hydration happens in the API so an IPFS outage cannot prevent indexing ownership changes. The API uses verified local artifact backups when available, or the configured IPFS gateway when rebuilding without those backups. An absent file remains unavailable; a CID alone cannot recover lost bytes.

## Rebuild after losing the index

Stop the indexer, preserve or restore `deployments/local.json`, then start with a fresh `PONDER_DATABASE_DIR` (absolute path). Ponder replays from the configured deployment blocks. Neither the private API database nor its issuer key is needed to rebuild the public index.

Keep the chain/RPC history, deployment manifest, and independently pinned IPFS content or CAR backups. Back up private databases separately. The default local manifest is gitignored; retain a copy outside the machine. Real deployment configuration should be versioned with the contract release. Do not delete the manifest just because the index database is disposable.

The isolated recovery test mints, transfers externally, restores IPFS from CAR files, discards the entire first index database, and starts both a fresh index and an API with no original SQLite or artifact directory:

```sh
pnpm --filter @0xhq/api test:issuance
```

It also checks the rebuilt transfer history, item facts, approval date, images, collection, privacy, and refusal to serve stale records after an Anvil reset. Requires Foundry (`anvil`, `cast`).

## Configuration and deployment

See `.env.example`. A custom `PASSPORT_DEPLOYMENTS_FILE` must be an absolute path shared by the issuer and indexer. Never put signer keys or signed transactions in this manifest. To regenerate types with an existing manifest, run `pnpm --filter @0xhq/indexer codegen`.

Ponder production mode uses PostgreSQL via `DATABASE_URL` and an explicit unique `DATABASE_SCHEMA`. PGlite is development-only. This integration currently supports the existing local chain **31337**; a real-network rollout still needs reviewed deployment configuration, RPC history availability, storage replication, finality policy, and issuer setup. No live-network deployment or change to existing NFT contracts is made here.

## Read API

These loopback-only endpoints contain public data and require no private-service signing secret. The customer app continues to use the signed shared API, not Ponder directly.

- `GET /ready`: Ponder historical indexing readiness.
- `GET /status`: indexed chain checkpoint.
- `GET /v1/passports?owner=0x…`: chain-derived registry entries, optionally filtered by indexed owner.
- `GET /v1/passports/0x…`: one item and its indexed NFT transfer history.

## Activity

`GET /v1/activity?kind=all&limit=30&cursor=<block>:<log-index>` joins indexed transfers to registered passports. Results are ordered by block and log index, newest first; the opaque cursor identifies the last returned event. Limits are capped at 50. Filters support `issued` and `transfer`. Sales and listings remain empty until actual marketplace contracts/events are integrated; a standard NFT transfer is never classified as a purchase or sale.

The shared API exposes the same signed public endpoint. Item metadata is hydrated once per asset per page; an IPFS outage leaves the chain event visible with fallback item information. Activity events and stable event IDs are reconstructed when rebuilding the index.
