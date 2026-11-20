# TrueOrigin App

Customer application for `app.trueorigin.com`. The separate operations workspace lives in `apps/admin.trueorigin.com` on port 3002.

Next.js App Router application using the same dependency versions and tooling as `0xhq.space`: React, TypeScript, Tailwind CSS, Biome, Base UI, Motion, Hairline, Markdown tooling, and the shared `@0xhq/config` package.

## Development

From the repository root:

```sh
pnpm install
pnpm --filter @0xhq/app.trueorigin.com dev
```

Open http://localhost:3001. The editorial app uses port 3000.

## Verification and production

```sh
pnpm --filter @0xhq/app.trueorigin.com lint
pnpm --filter @0xhq/app.trueorigin.com typecheck
pnpm --filter @0xhq/app.trueorigin.com build
pnpm --filter @0xhq/app.trueorigin.com start
```

Root `dev` starts all apps through Turborepo. Root `build`, `lint`, and `typecheck` include this app automatically and use the local task cache. Root `start` builds and serves all apps. Use `pnpm dev --filter=@0xhq/app.trueorigin.com` to run only TrueOrigin.

## Structure

- `src/`: starter page, root layout, and Tailwind global styles.
- `src/components/`: reusable UI primitives, side drawers, icons, and brand assets.
- `src/features/`: account flows, navigation, settings, and the app shell.
- `src/config/site.ts`: TrueOrigin identity, metadata, and founding-idea link.
- `src/config/utils.ts`: class name helper for UI components.
- `public/`: static assets, including the original engraved SVG landscape.

The app uses a dark visual identity, serif display typography, and Geist text fonts loaded through `next/font/google`. It shares the `@/*` alias, shadcn configuration, and Tailwind Turbopack integration with `0xhq.space`. The starter is independent of the editorial site’s content, routes, and newsletter integration.

## Passkey accounts

Run `make dev app.trueorigin.com` from the repository root to start this app, an Ethereum mainnet fork, and a local ERC-4337 bundler. The Connect button supports passkey registration and sign-in; accounts deploy with their first transaction. See [the Ethereum SDK guide](../../packages/trueorigin-sdk/README.md) for configuration, cross-device limitations, and tests.

## Component structure

Keep `components/` presentational and reusable: accept content, state, and callbacks through props. Components do not import features, call account APIs, or own business workflows. Shared Base UI primitives live in `components/ui/`.

Use `features/` to compose those components with application behavior:

- `account/`: passkey provider, session state, and account connection flow.
- `navigation/`: persistent navigation, breadcrumbs, and the shared live search drawer.
- `settings/`: settings drawer.
- `shell/`: application frame and feature composition.

Route files compose features. Ethereum TypeScript implementation lives in `packages/trueorigin-sdk`; Solidity lives in `contracts/trueorigin.com`.

## Backend structure

- `src/actions/account.ts`: typed Server Actions for session restoration, passkey registration/sign-in, logout, and local test funding.
- `src/server/auth/`: passkey verification, trusted-origin checks, and HttpOnly session cookies.
- `src/server/db/`: SQLite connection and credential, challenge, and session queries.
- `src/server/ethereum/`: authenticated, method-restricted JSON-RPC forwarding.
- `src/types/account.ts`: serializable action results and public session data.

Features call Server Actions; actions delegate to backend services. Passkey prompts and transaction signing run in the browser. API routes also serve public search, activity, passport assets, and authenticated submission updates. Search includes reference catalogue entries and public passports, never private submission fields. Account construction and chain operations live in `packages/trueorigin-sdk`.

Every action validates the configured origin. Signed responses must match a single-use, five-minute challenge and the RP ID. Sessions use opaque tokens stored as hashes, with HttpOnly, SameSite=Strict cookies scoped to `/` so they work for both Server Actions and RPC routes. Only public credential and account configuration data is returned to the client.

### Configuration and storage

Copy `.env.example` to `.env.local` for app settings. Use a trusted HTTPS origin outside localhost. Credentials are scoped to an RP ID: `localhost`, `trueorigin.dev`, and `app.trueorigin.com` have separate passkeys. Password-manager syncing and cross-device authentication depend on the browser, device, and provider; the app does not restrict authenticator attachment or transports.

SQLite defaults to `apps/app.trueorigin.com/.data/passkeys.sqlite` when running from this package. If that default file does not yet exist, the app copies the previous contracts-owned registry using a consistent SQLite snapshot, preserving WAL-backed records and leaving the original file intact. An explicit `PASSKEY_DB_PATH` is used as-is. Existing sessions need a fresh sign-in because the old cookies were scoped to `/api`.

The registry contains public keys, credential IDs, counters, expiring challenges, and hashed session tokens. Private keys remain in authenticators. Back up this database: public credential data is needed to recover undeployed account addresses.

Production requires `PASSKEY_ORIGIN`, a durable `PASSKEY_DB_PATH`, an Ethereum RPC, and a ZeroDev bundler endpoint. This SQLite implementation targets a single persistent instance. Multiple instances need a shared durable database; public endpoints also need deployment-level rate limits.

Run `pnpm --filter @0xhq/app.trueorigin.com test` for authentication and session unit tests. These require no browser, fork, or bundler.

### Reference catalog

`/explore` is the category entrance to the object reference catalog, separate from individual passports at `/items/[id]`. Browse Cards at `/explore/cards`, then Pokémon at `/explore/cards/pokemon`. Other domains and games are marked as future catalogs. The first supported catalog is English Pokémon cards, browsable by Pokémon (`/explore/pokemon`), set (`/explore/sets`), or search. Both paths lead to the same card reference at `/explore/cards/[id]`. Individual sample passports link back through `referenceId`; preview examples are never counted as registered copies.

The bundled snapshot in `src/features/reference/pokemon-cards.json` contains 20,635 English card entries across 176 sets from [Pokémon TCG Data](https://github.com/PokemonTCG/pokemon-tcg-data). It is a reference snapshot, not a complete multilingual or live pricing service. No card images or pricing data are imported. The Pokédex uses its existing PokéAPI species/generation snapshot. Unknown card, set, and Pokémon identifiers return a not-found page; results are paginated server-side.

To refresh the card snapshot, download the source repository archive, then run `python3 scripts/import-pokemon-catalog.py /path/to/archive.tar.gz` from this app directory. The importer retains text metadata and species associations, validates unique card IDs and set links, and displays the original `base1` set as “Base Set.” The generated JSON is excluded from Biome's file-size limit; application code remains linted. Price history and real owned-object records still require separate integrations.

## Local IPFS

The local upload service and gateway live in [services/ipfs](../../services/ipfs/README.md). Run it with `pnpm --filter @0xhq/ipfs dev` or root `pnpm dev`. `resolveIpfsUri` in `src/config/ipfs.ts` resolves saved `ipfs://` references through `NEXT_PUBLIC_IPFS_GATEWAY_URL` (localhost:3003 in development). Production deployments must configure their public gateway.

## Item submissions

`/submit` lets customers sign in with a passkey, select a certifier, enter the certification ID and contact email, and submit a request. Item names and grades are not collected from the customer. Photos and free-form notes are not collected in the initial request form. Progress and staff messages appear on the same page. The existing account registry remains in this app; submission records and photos are owned exclusively by [services/api](../../services/api/README.md). Requests do not mint NFTs or publish photographs to IPFS. Production requires the shared `API_URL` and this app’s `API_CUSTOMER_SECRET`.

## Passport pages and Verify

`/passports` lists confirmed issued passports; `/collection` links owned NFTs to
`/passports/<permanent-item-id>`. Item pages use the public passport index and blockchain,
replacing the previous static demo item route. They show the item, TrueOrigin's
recorded inspection approval, live NFT owner, mint/transfer history, and the block
checked. Physical possession and delivery are explicitly unconfirmed. This contract
version's lack of revocation tracking is shown separately from on-chain verification.

`/verify` accepts a passport URL, full item ID, or a supported certifier plus its
certification number. Matching records lead to the canonical passport page. A
missing record is not presented as proof that the physical item is counterfeit;
service/chain errors are shown as unavailable, not successful verification. Visitors
can use Passports, Verify, and passport pages without signing in. Passport image and
metadata routes serve the public integrity-checked archives, not private submission
photos or contact information.

### Local submission-to-transfer journey

Submit an item while signed in. In the admin app, accept it, record receipt, inspect, approve, and issue its passport. Choose hand-to-hand or delivery for the return. Staff record the handover after giving the item to the owner or the parcel to the carrier. The customer sees issuance and shipping separately in Submit, with automatic progress updates, and can confirm physical receipt.

Collection and Submit link to Transfers. Select a passport, enter the recipient's full Ethereum address, review it, and authorize the NFT transfer with the account credential. Transfers currently use the local development chain and local gas funding. Live owner, contract bytecode and immutable passport identity are checked before signing; receipt confirmation requires the matching ERC-721 transfer event. The submitted operation hash is saved in browser storage so an uncertain result can be checked after reload without signing again. Keep that browser storage until confirmation. NFT transfer does not prove or arrange physical handover; peer shipping, escrow, trading and payment are separate future work.

### Pokémon catalogue navigation

The Pokémon tabs are Pokédex, Catalogue, and Sealed. Catalogue lists the currently supported sets and named collections, plus Misc for cards without a known collection. Collection pages live at `/explore/catalogue/collections/:id`; individual cards keep their existing `/explore/catalogue/:id` URLs. Their breadcrumb is Explore / Pokémon / Catalogue / Collection / Card. The Pokédex links to these same individual card pages.

Only English Base Set is currently exposed. The language selector is removed and legacy language query parameters resolve to English. French source data and images remain available in the repository for a later release. The retained 30th Celebration source data is disabled; if re-enabled, its Classic Collection remains a checklist inside the parent release. Old `/explore/sets` and `/explore/sets/:id` links redirect to the new structure while preserving query parameters. Legacy `category=sets` routes lead to Catalogue. Misc is currently empty and hidden from the catalogue grid because every enabled card belongs to Base Set; no placeholder promo collections or fabricated card data are added.

### Sealed catalogue

`/explore/pokemon/sealed` is intentionally empty for now. Its shared section navigation, search, and product-type filters remain, but no product or printing detail routes are published. The Base Set research data and downloaded artwork are retained locally for future catalogue work; the UI does not import or expose them.

## Local alpha acceptance

See the [v0.1.0 acceptance notes](../../docs/releases/v0.1.0.md) for the tested flows, repeatable browser test, and known limitations. Authenticate remains at `/submit`; the empty Sealed section is hidden and its URL redirects to Catalogue.
