# TrueOrigin

Digital passports for physical objects. Discover collectibles, submit an item for inspection, and keep a verifiable record of its NFT ownership as it changes hands.

TrueOrigin starts with Pokémon cards and a manually operated inspection and handover process. The catalogue can expand into other collectible categories over time.

**Stage: local development · Next release: v0.1.0 — Local alpha · Not yet released**

NFT ownership, physical custody, and physical receipt are separate records. An NFT transfer alone does not prove that someone possesses or has received the object.

## Release roadmap

These are product milestones, not published releases or delivery dates. The workspace packages currently remain private and use their own package versions. Completed checkboxes describe implemented functionality; each release still has its own validation requirements.

| Release | Milestone | Status | Outcome |
| --- | --- | --- | --- |
| **v0.1.0** | **Local alpha** | **Current target** | Complete the item lifecycle and a simple NFT transfer on the local chain. |
| v0.2.0 | Controlled hub pilot | Planned | Operate the flow with a small group, persistent infrastructure, and hub custody records. |
| v0.3.0 | Marketplace | Planned | List items, make offers, and complete purchases with defined payment and dispute rules. |
| v0.4.0 | Broader catalogue | Planned | Expand supported objects and improve discovery, scanning, and catalogue coverage. |

### v0.1.0 — Local alpha

**Goal:** two users can complete the journey from submission to passport issuance, physical return, and an NFT transfer, without needing to understand wallets.

Implemented:

- [x] Passkey registration and sign-in with a Kernel smart account behind the scenes.
- [x] Explore with a Pokémon Pokédex and Catalogue organized by named sets/collections plus Misc; English-only catalogue for the first release. Catalogue coverage remains limited; the empty Sealed section is hidden.
- [x] Submission by certifier and certification number, with authenticated receiving wallet and progress tracking.
- [x] Admin acceptance, arrival recording, inspection, approval, and rejection.
- [x] Local ERC-721 passport issuance with immutable IPFS metadata and file backups.
- [x] Individual passport pages, Registry, Verify, Collection, and an issuance/transfer Activity.
- [x] Manual returns from TrueOrigin by hand-to-hand or delivery, with customer receipt confirmation.
- [x] Simple NFT transfers: pick an item, enter a receiving wallet, review, authorize, and show confirmation. Live ownership checks and pending operation recovery protect execution.
- [x] App-wide on-chain transfer tracking in Activity, passport history, and Collection, including external NFT transfers.
- [x] Rebuilding the public index from blockchain events and restoring IPFS files from CAR backups.
- [x] Fresh local development startup with real seeded demo passports, IPFS card images, submissions, and on-chain transfer activity; an empty run remains available.

Remaining release criteria:

- [x] Validate the full two-account browser journey, cancelled signatures, reloads, and pending operation recovery; cover reverted transactions and issuance failures in automated tests.
- [x] Record the tested release scope and known limitations in [v0.1.0 acceptance notes](docs/releases/v0.1.0.md). No release tag has been created.

Scope decisions:

- Passkeys are the only account authentication method for this release. Google login, external wallet linking, extra approval factors, and custom recovery are deferred.
- Transfers only sends NFTs; it does not manage physical handovers. Any future peer-to-peer physical flow will be hand-to-hand only. Delivery remains available for returns from TrueOrigin.
- Invitations, recipient acceptance, physical receipt tracking between users, sale/gift classification, payments, and escrow are outside this release.
- Users retain the ability to transfer their NFTs outside TrueOrigin. The guided flow is an optional service.
- Marketplace is deferred and has no published page. Authenticate opens from the header/pill and Collection’s **Add an item**. Verify remains a global action; QR scanning is an input method inside Verify, not a separate destination.

### v0.2.0 — Controlled hub pilot

- [ ] Model hub custody explicitly: received, held, ready for handover, and released, with staff attribution and an audit trail.
- [ ] Define handling of authentication corrections, revocation, lost items, and disputed handovers before implementing any new contract powers.
- [ ] Choose and deploy to the pilot network; replace local-only issuance and gas funding with the pilot configuration.
- [ ] Secure issuer signing, staff access, and operational permissions.
- [ ] Configure persistent databases, redundant IPFS storage, independent backups, monitoring, and tested restoration.
- [ ] Validate the chosen passkey support and recovery limitations with pilot users.

Hub-assisted escrow is a later capability to design explicitly. Current returns and guided NFT transfers do not escrow assets or payments.

### v0.3.0 — Marketplace

- [ ] Listings, offers, purchases, and their lifecycle.
- [ ] Payment, cancellation, refund, and dispute rules.
- [ ] Decide whether hub-assisted exchanges need an NFT/payment escrow contract, and review its release conditions before deployment.
- [ ] Add actual listing and sale events to Activity; an NFT transfer is not automatically a sale.

### v0.4.0 — Broader catalogue

- [ ] Expand catalogue coverage, languages, and sealed products.
- [ ] Extend scanning beyond QR codes to certification-label text and other barcode formats.
- [ ] Add categories beyond Pokémon using the shared object/passport model.

## Pages and their purpose

### Customer app — `app.trueorigin.com`

| Page | Route | Purpose | Current state |
| --- | --- | --- | --- |
| Explore | `/explore` | Discover the supported collectible universes and enter their reference catalogues. | Pokémon is available. |
| Pokémon · Pokédex | `/explore/pokemon/pokedex` | Browse Pokémon species by generation and open their profiles. | Local species data and artwork. |
| Pokémon profile | `/explore/pokemon/:id` | Learn about a species, its evolution family, and the cards that feature it. | Links to the available catalogue cards. |
| Pokémon · Catalogue | `/explore/pokemon/catalogue` | Browse named sets and collections of individual cards. | English Base Set is currently enabled. |
| Collection / set | `/explore/catalogue/collections/:id` | Browse a set’s cards, release details, and type/rarity filters. | Base Set contains 102 card references. |
| Card | `/explore/catalogue/:setId/:number` | Describe a specific catalogue card, its printings, and its Pokémon links. | Example: `/explore/catalogue/base-set/2`. Printing options reuse the reference image for now. |
| Activity | `/activity` | Follow passport issuance and NFT transfers across the platform. | On-chain activity is indexed; an NFT transfer is not classified as a sale. Sales/listing filters await the marketplace. |
| Registry | `/registry` | Browse individual objects with issued TrueOrigin passports, regardless of owner. | Public passport records, distinct from reference catalogue entries. |
| Passport | `/items/:id` | Inspect one registered object’s authentication record, current NFT owner, metadata, and ownership history. | Physical possession is explicitly separate from NFT ownership. |
| Authenticate | `/submit` | Request an inspection, supply the certifier and certification number, and follow the submission through issuance and return. | Available in the header/pill and through **Add an item** in Collection. Requires sign-in; the receiving wallet comes from the account. |
| Collection | `/collection` | See the passports currently owned by the signed-in user and open or transfer them. | Reflects indexed NFT ownership, including transfers made outside TrueOrigin. |
| Verify | `/verify` | Check an existing item by entering its passport or certification number, scanning a QR code with the camera, or uploading a QR image. | Public lookup. Supports passport QR codes, raw certification numbers, and PSA verification links; scanning does not authenticate the physical object. |
| Transfers | `/transfers` | Send an owned NFT to another wallet: select an item, enter the recipient, review, authorize, and confirm. | A simple NFT transfer; no payment, sale classification, or physical handover workflow. |
| Scan shortcut | `/scan` | Open the scanning method within Verify. | Redirects to `/verify?method=scan`; there is no separate Scan page or navigation item. |

**Explore describes a card; Registry shows actual registered copies; Collection shows the copies you own; Marketplace will show copies offered for sale; Transfers moves NFT ownership.**

Account management and the shared search are drawers, not separate pages. Search controls and Cmd/Ctrl+K open the same drawer; live results include app pages, Pokémon, collections, cards, and public passports. Private submissions are excluded. The empty Sealed section is hidden; `/explore/pokemon/sealed` redirects to Catalogue. The root `/` redirects to Explore, and `/explore/pokemon` opens Catalogue. Older Pokémon and set routes redirect to their current destinations. Magic, One Piece, and Yu-Gi-Oh! have placeholder universe pages outside the current release scope.

### Admin app — `admin.trueorigin.com`

| Page | Route | Purpose |
| --- | --- | --- |
| Operations | `/` | Review submissions, accept or reject requests, record arrival and inspection, approve passport issuance, follow issuance jobs, and manage physical returns. |

The admin workflow records staff decisions; the customer app displays the user-facing submission progress and issued passports.

## Run locally

Requirements: Node.js **22.18+**, pnpm **12.16.1** (pinned in `package.json`), and Foundry (`forge`, `anvil`, `cast`) on PATH. With Corepack installed, `corepack enable` selects the pinned pnpm version.

From the repository root:

```sh
pnpm install
pnpm --filter @0xhq/contracts.trueorigin.com deps
make dev app.trueorigin.com
```

The Ethereum fork needs an archive-capable upstream RPC. Configure `ETHEREUM_RPC_URL` in the root `.env`; the launcher can also reuse `ENV_ALCHEMY_BASE_RPC` with Alchemy's Ethereum hostname. See the [SDK setup guide](packages/trueorigin-sdk/README.md). Never commit RPC credentials or signer keys.

| Component | Local address | Purpose |
| --- | --- | --- |
| Customer app | http://localhost:3001 | Explore, submissions, passports, collection, and transfers |
| Admin app | http://localhost:3002 | Inspection, issuance, and manual returns |
| IPFS service | http://localhost:3003 | Local file pinning, gateway, and archives |
| API | http://localhost:3004 | Private operational data and public passport reads |
| Ponder indexer | http://localhost:3005 | Public registry and activity projection |
| Bundler | http://localhost:4337 | Local ERC-4337 user operations |
| Anvil | http://127.0.0.1:8545 | Ethereum fork, chain ID **31337** |

**Every `make dev` run clears and reuses `.dev-data/`.** Accounts, submissions, files, deployment state, and the public index start fresh. Register again for the new run; credentials already saved in your authenticator are not deleted from your device. Startup then seeds **8 card NFTs, 12 submissions, and 3 NFT transfers** using the normal inspection/issuance workflow. Card images and metadata are pinned in local IPFS and backed up as CAR files; Ponder indexes the actual chain events. Wait for **Development data ready** in the terminal.


The demo includes Charizard, Blastoise, Venusaur, Pikachu, Mewtwo, Machamp, Zapdos, and Alakazam from Base Set, with catalogue artwork already stored in this repository. It also includes requests awaiting review, accepted requests, an inspection, a rejection, and hand-to-hand/delivery returns. Certification and inspection details are fictional and metadata marks these as local development demos.

Demo NFTs belong to Anvil's public test wallets. Your Collection still shows only the NFTs owned by your signed-in wallet; seeding does not create a passkey or bypass sign-in. The seed manifest at `.dev-data/api/development-seed.json` lists item IDs, wallet owners, certification numbers, and IPFS URIs. Restarts within the same run reuse the records and do not mint or transfer twice.

For an empty development environment:

```sh
TRUEORIGIN_DEV_SEED=false make dev
```

Stop the previous run with Ctrl+C before restarting. Shutdown waits for the complete process tree, including detached services, and force-stops stragglers after a grace period. If a previous run was interrupted or crashed, run `make clean` to stop remaining development processes from this workspace. Cleanup preserves development data and build caches; the next `make dev` still resets `.dev-data/`. Processes belonging to other projects are left alone and reported, so their ports must be freed in those projects. The launcher refuses occupied ports rather than killing unrelated services. `make dev admin.trueorigin.com` starts the same complete TrueOrigin stack. `make dev` also starts the unrelated `0xhq.space` app while it remains in this workspace.

`pnpm dev` skips the reset wrapper and uses configured service data paths, but its local chain still starts fresh. Keeping a database alone does not restore an old chain.

## Architecture and data

| Layer | Stores | Recovery |
| --- | --- | --- |
| Passport contract | Token/item IDs, current NFT ownership, approvals, issuer roles, immutable metadata URIs, and issuance/transfer events | Read contract state and replay chain history. Local Anvil state is disposable. |
| IPFS | Public item metadata and passport images | Keep files pinned and restore from independent copies or CAR archives; a CID cannot recreate missing content. |
| Private API SQLite | Submissions, inspection history, issuance jobs, private files' references, handover details, receipt assertions, and staff sessions | Back up the private database and associated files. These cannot be rebuilt from chain history. |
| Account SQLite | Credential public keys, login challenges, and sessions | Back up separately. Credential private keys stay with the user's authenticator. |
| Ponder | Searchable public passports, NFT owners, and transfer activity | Rebuild from trusted deployment configuration and blockchain events; public item facts also require IPFS content. |
| Repository assets | Reference catalogue data and images | Retained with the source repository. |

The current passport contract does not provide metadata rewriting, revocation, seizure, or transfer freezing. Issuance and guided transfers currently support the local development chain, not a production deployment.

## Repository

```text
apps/
  app.trueorigin.com/    Customer Next.js application
  admin.trueorigin.com/  Operations Next.js application
  0xhq.space/           Editorial site; planned move to a separate repository
contracts/
  trueorigin.com/        Foundry Solidity contracts, scripts, and tests
packages/
  api-client/           Server API client, shared types, and handover method definitions
  trueorigin-sdk/       Kernel accounts, RPC, issuance, transfers, and generated contract exports
  config/               Shared configuration
services/
  api/                  Private operations and public passport API
  indexer/              Ponder public blockchain index
  ipfs/                 Local IPFS service and restoration tools
scripts/                Development orchestration and reset checks
```

This repository is becoming **TrueOrigin-only**. `apps/0xhq.space` remains operational for now; moving it, its content, and any shared dependencies it needs into a separate repository is pending. Its [own README](apps/0xhq.space/README.md) remains the guide for editorial content and translations. Workspace packages currently retain the `@0xhq/` scope.

## Development checks

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm test:dev
pnpm --filter @0xhq/api test
pnpm --filter @0xhq/api test:issuance
pnpm --filter @0xhq/api test:seed
pnpm --filter @0xhq/contracts.trueorigin.com test
```

The issuance integration test launches isolated local services and exercises issuance, public verification, physical return tracking, NFT transfers, and reconstruction. The repeatable two-account browser acceptance test is `scripts/test-alpha-browser.mjs`; set `CHROME_PATH` to a Chromium executable and keep the local stack running. See the [v0.1.0 acceptance notes](docs/releases/v0.1.0.md) for validation evidence and known limitations. Run package checks individually while `0xhq.space` remains in the workspace if you only need TrueOrigin results.

Further setup and implementation details: [customer app](apps/app.trueorigin.com/README.md), [admin app](apps/admin.trueorigin.com/README.md), [API](services/api/README.md), [SDK](packages/trueorigin-sdk/README.md), [contracts](contracts/trueorigin.com/README.md), [indexer and recovery](services/indexer/README.md), and [IPFS](services/ipfs/README.md).
