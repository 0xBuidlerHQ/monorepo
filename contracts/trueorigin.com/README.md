# TrueOrigin Ethereum infrastructure

`@0xhq/contracts.trueorigin.com` owns Ethereum configuration, ZeroDev Kernel account construction and signing, chain interactions, Foundry, and the local fork/bundler launcher. Authentication, sessions, SQLite, HTTP proxies, and Server Actions live in the Next.js app.

## Run locally

Install Foundry (`anvil` and `forge` on PATH), Node.js 22.18+ and the repository's pinned pnpm version. From the repository root:

```sh
pnpm install
make dev app.trueorigin.com
```

Open **http://localhost:3001/explore**. This starts:

- An Ethereum mainnet fork on `127.0.0.1:8545`, isolated chain ID **31337**.
- Pimlico Alto, an ERC-4337 bundler listening on `0.0.0.0:4337`.
- The TrueOrigin Next.js app on port **3001**.

Ctrl+C stops the processes started by this command. Existing servers are never killed. For another app port, run `TRUEORIGIN_APP_PORT=3011 make dev app.trueorigin.com` and make sure `PASSKEY_ORIGIN` matches that port.

The launcher loads the root `.env`, this directory's `.env`, and `apps/app.trueorigin.com/.env.local`. Set `ETHEREUM_RPC_URL` to an archive-capable Ethereum mainnet RPC. Otherwise, the root `ENV_ALCHEMY_BASE_RPC` is reused with Alchemy's Ethereum hostname (the key must allow Ethereum access); the fork stays on Ethereum, not Base. Without either setting, the launcher falls back to `https://ethereum.publicnode.com`, which may reject historical state requests without authentication. App authentication settings belong in `apps/app.trueorigin.com/.env.local`. The launcher validates the upstream chain and deployed contracts and never substitutes an empty chain. All development transactions stay on the fork.

To start just the chain and bundler, use `pnpm --filter @0xhq/contracts.trueorigin.com dev`. Root `pnpm dev` also runs this package alongside the apps through Turbo; `make dev app.trueorigin.com` is the dedicated full-stack command.

## Accounts

The SDK uses Kernel **v3.3**, EntryPoint **v0.7**, and the patched **v0.0.3** passkey validator. A stable account index of zero reconstructs the same counterfactual address from a credential's public data.

Creating a passkey, signing in, calculating an address, and receiving funds do not deploy the account. The first submitted user operation includes the factory initialization data and deploys it.

The app's `AccountProvider` exposes the client through `useAccount()`. Local test funding is authenticated by an app Server Action before calling this package's local-only helper. There is no mainnet faucet or unrestricted sponsorship.

## Structure

- `src/account.ts`: account construction, passkey signing, deployment checks, and local test operations.
- `src/config.ts`: chain definitions and public types.
- `src/rpc.ts`: network configuration, provider endpoints, and local-only funding.
- `scripts/dev.mjs`: process supervision and fork/bundler startup.
- `foundry.toml`, `test/`: Foundry configuration and Solidity infrastructure checks.

The fork already contains ZeroDev's account infrastructure. Alto may deploy local simulation helpers during startup; these are not user accounts.

For passkey authentication, storage, and app backend structure, see [the app guide](../../apps/app.trueorigin.com/README.md).

## Checks

```sh
pnpm --filter @0xhq/contracts.trueorigin.com lint
pnpm --filter @0xhq/contracts.trueorigin.com typecheck
pnpm --filter @0xhq/contracts.trueorigin.com test:contracts
```

The Foundry test requires the local fork to be running. Authentication unit tests run through `pnpm --filter @0xhq/app.trueorigin.com test` and require no servers.
