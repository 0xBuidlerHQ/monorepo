# TrueOrigin Admin

Separate Next.js application for `admin.trueorigin.com`. Staff sign-in, the submission review queue, private photos, and status updates use the shared API in `services/api`. Public IPFS publication, shipping integrations, and passport issuance are not connected yet.

From the repository root:

```sh
pnpm --filter @0xhq/admin.trueorigin.com dev
```

Open http://localhost:3002. The customer app runs at http://localhost:3001 in `apps/app.trueorigin.com`.

```sh
pnpm --filter @0xhq/admin.trueorigin.com lint
pnpm --filter @0xhq/admin.trueorigin.com typecheck
pnpm --filter @0xhq/admin.trueorigin.com build
```

Root Turbo commands include this app automatically. Deploy this directory as its own project for `admin.trueorigin.com`; domain configuration and DNS are managed by the hosting provider. Set `TRUEORIGIN_APP_URL` if the customer app uses a different URL.

The app shares the existing Next.js, React, TypeScript, Tailwind, and Biome versions. Staff authorization is enforced by the API with a separate staff session and the admin backend signature. It is independent of customer passkey sign-in.

## Local IPFS

The local upload service and gateway live in [services/ipfs](../../services/ipfs/README.md). Run it with `pnpm --filter @0xhq/ipfs dev` or root `pnpm dev`. `resolveIpfsUri` in `src/config/ipfs.ts` resolves saved `ipfs://` references through `NEXT_PUBLIC_IPFS_GATEWAY_URL` (localhost:3003 in development). Production deployments must configure their public gateway.

## Submissions API

Start `pnpm --filter @0xhq/api dev`. Get the local staff password using `pnpm --filter @0xhq/api admin:password`, then sign in at the admin homepage. Production requires `API_URL`, `API_ADMIN_SECRET`, and `ADMIN_ORIGIN`. See [the API guide](../../services/api/README.md).
