# BuidlerHQ monorepo

A pnpm workspace containing the `@0xhq/0xhq.space`, `@0xhq/app.trueorigin.com`, and `@0xhq/admin.trueorigin.com` Next.js applications, shared packages, and local API/IPFS services. All workspace packages use the `@0xhq/` scope.

## Requirements

- Node.js 22.18 or newer
- pnpm 12.16.1 (pinned in `package.json`)

If you use Corepack, run `corepack enable` to use the pinned pnpm version.

## Development

Install dependencies, then start all Next.js apps through Turborepo:

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000/en for `0xhq.space`, http://localhost:3001 for the TrueOrigin app, or http://localhost:3002 for TrueOrigin Admin. Each app keeps its own development server and port. The submissions API runs at http://localhost:3004; see [its guide](services/api/README.md). The local IPFS service runs at http://localhost:3003; see [its guide](services/ipfs/README.md) for uploads and gateway usage.

To run one app:

```sh
pnpm dev --filter=@0xhq/app.trueorigin.com
```

See [the customer app guide](apps/app.trueorigin.com/README.md) and [admin guide](apps/admin.trueorigin.com/README.md) for setup.

Run only the admin app with `pnpm --filter @0xhq/admin.trueorigin.com dev` or `make dev admin.trueorigin.com`.

To start TrueOrigin with an Ethereum mainnet fork and local account-abstraction bundler:

```sh
make dev app.trueorigin.com
```

Foundry must be installed. Chain tooling, account code, configuration, and setup instructions live in [contracts/trueorigin.com](contracts/trueorigin.com/README.md).

## Commands

```sh
pnpm dev        # Run all app development servers
pnpm build      # Build apps in dependency order
pnpm start      # Build and serve all production apps
pnpm lint       # Lint all workspace packages
pnpm typecheck  # Generate Next.js types and check all packages
```

Turborepo is configured in [turbo.json](turbo.json). Builds, lint, and typechecks are cached locally in `.turbo/`; development and production servers are persistent, uncached tasks. Next.js build artifacts are cached without `.next/cache` or `.next/dev`. Typecheck cache entries include generated route types and TypeScript build information. Shared package changes invalidate dependent tasks, and environment files plus the public site settings are included in build cache keys.

Pass Turbo options through the root scripts, for example `pnpm build --filter=@0xhq/app.trueorigin.com` or `pnpm build --dry=json`. Individual package scripts also remain available through `pnpm --filter <package> <command>`.

## Structure

```text
apps/
  0xhq.space/    # Editorial site
  app.trueorigin.com/    # Customer application (port 3001)
  admin.trueorigin.com/  # Operations workspace (port 3002)
contracts/
  trueorigin.com/  # @0xhq/contracts.trueorigin.com: Ethereum and account abstraction
services/
  api/        # Submission database, private photos, staff sessions (port 3004)
  ipfs/       # Local persistent IPFS uploads and gateway (port 3003)
packages/
  api-client/ # Server-only client and shared submission types
  config/     # @0xhq/config: shared links and configuration
pnpm-workspace.yaml
pnpm-lock.yaml
turbo.json
```

Add additional applications under `apps/` and local services under `services/`; both are included in the workspace automatically.

Shared packages live under `packages/`. Import links from `@0xhq/config` or `@0xhq/config/links`. The app re-exports them through `@/config/links`; the footer uses `links.x` for the X profile URL.

## Content and translations

Markdown articles live in `apps/0xhq.space/content/learn/<article>/en.md` and `content/thoughts/<article>/en.md`. Add `fr.md` beside an English source to publish a French version. Each article folder has a shared `meta.json` for its date, tags, optional slug, and article-wide draft flag. Markdown files keep translated titles and per-language draft flags. Dates control newest-first sorting.

Content has language-specific URLs such as `/en/learn/blockchain-101` and `/fr/learn/blockchain-101`. Pages use `/en`, `/fr`, `/es`, or `/pt` prefixes. The locale homepage displays About; there is no separate `/about` page. URLs without a locale redirect to English: `/` goes to `/en`, and `/learn` goes to `/en/learn`. Content and interface are available in all four languages, including dates and accessibility labels. The shared glossary lives in `content/glossary/{en,fr,es,pt}.md`, with stable term anchors across languages.

Run `pnpm --filter @0xhq/0xhq.space check:translations` to identify translations needing review after English source changes. See [the app guide](apps/0xhq.space/README.md) for writing, translation, and publishing instructions.
