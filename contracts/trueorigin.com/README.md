# TrueOrigin contracts

A Foundry project for TrueOrigin's Solidity contracts. It builds and tests with
Foundry alone; Node.js, pnpm, ZeroDev, and the application services are not needed
for the passport unit tests.

```text
src/             Solidity contracts
script/          Solidity deployment scripts (local-only for now)
test/unit/       Solidity unit and fuzz tests (default profile)
test/integration/ Fork-dependent infrastructure tests (integration profile)
dependencies/    Soldeer-installed libraries (ignored by Git)
foundry.toml     Compiler, optimizer, remappings, RPC aliases, fuzz settings
soldeer.lock     Exact Solidity dependency revisions
```

`out/`, `cache/`, and `broadcast/` are generated and ignored. A small `package.json`
provides optional pnpm/Turbo command wrappers; it has no JavaScript dependencies
or exports. TypeScript, generated ABIs, account construction, RPC/signing helpers,
and the development launcher live in [packages/trueorigin-sdk](../../packages/trueorigin-sdk/README.md).

## Setup and standard Foundry commands

From this directory, with Foundry installed:

```sh
forge soldeer install --config-location foundry
forge build
forge test
forge fmt --check
```

Soldeer installs the pinned OpenZeppelin source into `dependencies/`. There are no
npm Solidity dependencies or Git submodules. Commit the dependency declaration
and lockfile when deliberately upgrading the library.

The compiler is pinned to Solidity **0.8.30**, with the **Prague** EVM target,
optimizer enabled at 200 runs, and 256 runs per fuzz test.

The infrastructure check is separate because it needs the running Ethereum fork:

```sh
FOUNDRY_PROFILE=integration forge test
```

Start that fork and its ERC-4337 bundler from the monorepo with
`pnpm --filter @0xhq/trueorigin-sdk dev`, or run the full stack with `pnpm dev`.

To regenerate the application ABI and bytecode after changing a contract:

```sh
pnpm --filter @0xhq/trueorigin-sdk generate:contracts
pnpm --filter @0xhq/trueorigin-sdk check:abi
```

The generated export is committed under `packages/trueorigin-sdk/src/generated/`.
The Foundry project never imports it or needs it to compile.

## Passport contract bootstrap

`src/TrueOriginPassport.sol` is the first non-upgradeable ERC-721 foundation. It uses
**OpenZeppelin Contracts 5.6.1**, pinned to commit
`5fd1781b1454fd1ef8e722282f86f9293cacf256` in `foundry.toml` and `soldeer.lock`.

The collection is **TrueOrigin Passport**, symbol **ORIGIN**. Names are provisional
until the final contract review. No contract is automatically deployed by `pnpm dev`; the local API deploys on first explicit passport issuance.

### Ownership and authority

- Only `ISSUER_ROLE` can call `issuePassport(recipient, itemId, metadataURI)`.
- The initial admin and issuer are explicit constructor arguments. The deployer
  receives no implicit privileges. The admin manages issuer roles; admin handover
  uses OpenZeppelin's delayed, two-step process, initially set to two days.
- Owners can transfer NFTs and authorize external operators using standard ERC-721
  functions, without TrueOrigin approval. Granting an issuer or admin role does not
  grant access to an owner's NFT.
- There is no proxy, upgrade hook, forced transfer, transfer pause, burn, or metadata
  setter. Losing an owner's signing access cannot be solved by an admin seizure.
- Token IDs start at one. `tokenIdForItem(itemId)` returns zero for an unissued item.
  Each nonzero item ID can be registered only once in this contract. That mapping
  remains unchanged when the NFT changes owners.

The item ID must be a permanent, opaque TrueOrigin identifier, independent of the
submission ID, wallet, and certifier. Regrading or changing a slab should not create
a new physical-item identity. The backend must resolve those identities and stop
repeat physical registrations; the contract cannot recognize an object presented
under a different ID. Never derive item IDs from emails or other personal data.

`issuePassport` uses safe minting and makes the item mapping and URI available
before the receiving contract is called. A rejected receiver rolls back the whole
issuance, including the token sequence and item registration. Issuance is guarded
against receiver reentrancy. A counterfactual wallet with no deployed code can
receive its passport without account deployment, like any other empty address;
TrueOrigin must verify that the recipient really is the user's derived wallet.

The NFT records digital ownership. It does not prove physical possession, delivery,
or a physical handover. Guided delivery and transfer confirmation belong in a
separate application/workflow layer and do not restrict standard NFT transfers.

### Metadata

Each passport stores an immutable `ipfs://...` JSON URI. The contract checks the
scheme and that a nonempty address follows it; it does **not** validate a CID, read
IPFS, verify photos, or consult the submission database. Only the trusted issuance
service should mint, after checking the approved inspection, recipient, item ID,
and pinned metadata. Initial request acceptance must not trigger issuance.

The existing local IPFS service can supply real CIDs during development. Local-only
content will not be available to public wallets unless it is also pinned somewhere
reachable by them. Store IPFS URIs, rather than localhost gateway addresses.

A starting JSON structure for the next integration step is:

```json
{
  "name": "TrueOrigin Passport — item name",
  "description": "A digital passport for an item inspected by TrueOrigin.",
  "image": "ipfs://<image-cid>/front.webp",
  "attributes": [
    { "trait_type": "Certifier", "value": "PSA" },
    { "trait_type": "Certification number", "value": "<public-certification-number>" }
  ],
  "trueorigin": {
    "schema_version": "1",
    "item_id": "<permanent-opaque-item-id>",
    "verified_at": "<inspection-timestamp>"
  }
}
```

This schema is a proposal, not an implemented metadata builder. Keep contact details,
shipping information, private inspection notes, and receiving-wallet credentials out
of public metadata. Read the current NFT owner from the contract, rather than putting
an owner address in immutable JSON that becomes stale after a transfer.

### Scope before deployment

This bootstrap deliberately does not implement authentication revocation,
reinstatement, or versioned corrections. Those policies and their events must be
specified and reviewed **before a real deployment**; a non-upgradeable deployed
contract cannot have these functions added later. The admin app now queues issuance through the API after approval, on the local
development chain only. Signing stays in the API; no key is sent to either browser.

The local integration now has a metadata builder, CAR backups, and an idempotent
issuance worker recording chain ID, contract address, token ID, transaction hash,
and confirmation state. Next steps are the final authentication/correction model,
independent production storage, and a production signer/finality policy. An RPC timeout must be reconciled
against `tokenIdForItem` before retrying or reporting success. The contract deduplicates
item IDs, but it does not supply an off-chain transaction queue or finality tracking.

### Local deployment script

With Anvil running on chain **31337**, set `PASSPORT_ADMIN` and `PASSPORT_ISSUER` to
wallets you control. Foundry reads this package's `.env`; do not commit it. Use an
explicit funded local sender, for example the first unlocked Anvil account:

```sh
pnpm --filter @0xhq/contracts.trueorigin.com deploy:passport:local \
  --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

This is a simulation: it sends no deployment transaction. Adding `--broadcast
--unlocked` deliberately deploys using that local unlocked account. The script refuses
any chain ID other than 31337 and never accepts a private key in source code. No
mainnet deployment script or automatic deployment is included. The contract's issuer
and admin keys are application infrastructure, never end-user passkey credentials.

Foundry writes local run records under `broadcast/`, which is ignored by Git.

### References

- [ERC-721 standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin ERC-721](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721)
- [OpenZeppelin access control](https://docs.openzeppelin.com/contracts/5.x/access-control)

## Checks

```sh
pnpm --filter @0xhq/contracts.trueorigin.com build:contracts
pnpm --filter @0xhq/contracts.trueorigin.com check:contracts
pnpm --filter @0xhq/contracts.trueorigin.com test:contracts
pnpm --filter @0xhq/contracts.trueorigin.com lint
```

The passport unit and fuzz tests run without a chain, RPC, IPFS, or database.
The existing infrastructure test remains separate and requires the local fork:

```sh
pnpm --filter @0xhq/contracts.trueorigin.com test:infrastructure
```

Authentication tests run through `pnpm --filter @0xhq/app.trueorigin.com test`.
