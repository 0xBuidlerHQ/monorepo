# TrueOrigin TypeScript SDK

`@0xhq/trueorigin-sdk` is the off-chain Ethereum package shared by the customer app
and API. Solidity belongs in [contracts/trueorigin.com](../../contracts/trueorigin.com/README.md).

```text
src/account.ts                 Browser passkey signing and Kernel account construction
src/config.ts                  Public chain configuration and account types
src/server/rpc.ts              Server-only RPC endpoints, account address lookup, local funding
src/server/passport-issuer.ts  Local API issuer, signed transaction preparation and broadcasting
src/generated/passport.ts     Generated Solidity ABI and bytecode; do not edit manually
scripts/dev.mjs               Ethereum fork / Alto launcher
scripts/export-passport-abi.mjs ABI and bytecode generation/checking
```

Import only the subpath you need. Server modules must not be imported into client
components; issuer private keys remain in the API's data directory.

```ts
import { connectPasskeyAccount } from "@0xhq/trueorigin-sdk/account";
import { trueOriginPassportAbi } from "@0xhq/trueorigin-sdk/passport";
```

## Generate the contract exports

Install the native Foundry dependencies once:

```sh
pnpm --filter @0xhq/contracts.trueorigin.com deps
pnpm --filter @0xhq/trueorigin-sdk generate:contracts
pnpm --filter @0xhq/trueorigin-sdk check:abi
```

The generation script reads the compiled artifact from the Foundry project's `out/`
and writes `src/generated/passport.ts`. No application imports ignored build files.
Root Turbo builds run the Foundry dependency before generating the SDK export.

## Local chain and bundler

Foundry (`anvil`, `forge`, and `cast`) must be on PATH.

```sh
pnpm --filter @0xhq/trueorigin-sdk dev
```

This starts an Ethereum mainnet fork on `127.0.0.1:8545`, isolated chain ID **31337**,
and Pimlico Alto on port **4337**. `pnpm dev` starts these alongside the apps and
services. `make dev app.trueorigin.com` starts the complete TrueOrigin stack with
fresh isolated data for every launch; see the [root development guide](../../README.md).
Existing servers are never killed. Ctrl+C stops only the launcher's own children.

Set `ETHEREUM_RPC_URL` to an archive-capable Ethereum endpoint. The launcher loads
the root `.env`, the legacy contracts `.env`, this package's `.env.local`, and the
customer app's `.env.local`. Existing contracts-folder RPC settings still work.
The root `ENV_ALCHEMY_BASE_RPC` can also be reused with Alchemy's Ethereum hostname;
otherwise the launcher falls back to `https://ethereum.publicnode.com`, which may
reject archive requests. It validates the upstream chain and Kernel infrastructure
and never substitutes an empty chain.

For a different app port, set `TRUEORIGIN_APP_PORT` and ensure `PASSKEY_ORIGIN`
matches. Passkey storage belongs to the customer app; the launcher respects an
explicit `PASSKEY_DB_PATH` and otherwise uses the app's normal default/migration.
No existing credentials or database files are moved by this SDK refactor.

## Accounts and passports

Accounts use Kernel **v3.3**, EntryPoint **v0.7**, and the patched **v0.0.3** passkey
validator. Index zero gives a stable counterfactual account address. Creating a
passkey, signing in, calculating an address, and receiving a passport do not deploy
the user's account. Its first user operation carries factory initialization.

Passport issuance is currently local-only. The API owns metadata storage, backups,
submission authorization, transaction persistence/retry, and confirmation tracking;
this package owns Ethereum transaction construction and transport. See
[the API guide](../../services/api/README.md) for the workflow.

The local issuer checks the contract's executable runtime bytecode. Solidity's CBOR
source metadata is excluded from this comparison so moving dependency files or
changing comments does not invalidate an otherwise identical deployed contract.
Logic changes still require a new local deployment/data directory.

## Checks

```sh
pnpm --filter @0xhq/trueorigin-sdk lint
pnpm --filter @0xhq/trueorigin-sdk typecheck
pnpm --filter @0xhq/trueorigin-sdk check:abi
```
