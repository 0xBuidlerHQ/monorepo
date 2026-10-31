# BuidlerHQ monorepo

A pnpm workspace containing the `@0xhq/0xhq.space` Next.js application and shared `@0xhq/config` package. All workspace packages use the `@0xhq/` scope.

## Requirements

- Node.js 20.9 or newer
- pnpm 12.16.1 (pinned in `package.json`)

If you use Corepack, run `corepack enable` to use the pinned pnpm version.

## Development

From the repository root:

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000/en. Edit `apps/0xhq.space/src/app/[locale]/page.tsx` to update the home page.

## Commands

```sh
pnpm build      # Build all workspace applications
pnpm start      # Serve the production build of 0xhq.space
pnpm lint       # Run Biome across the workspace
pnpm typecheck  # Generate Next.js route types and check TypeScript
```

## Structure

```text
apps/
  0xhq.space/  # Next.js App Router, React, TypeScript, Tailwind CSS
packages/
  config/  # @0xhq/config: shared links and configuration
pnpm-workspace.yaml
pnpm-lock.yaml
```

Add additional applications under `apps/`; they are included in the workspace automatically.

Shared packages live under `packages/`. Import links from `@0xhq/config` or `@0xhq/config/links`. The app re-exports them through `@/config/links`; the footer uses `links.x` for the X profile URL.

## Content and translations

Markdown articles live in `apps/0xhq.space/content/learn/<article>/en.md` and `content/thoughts/<article>/en.md`. Add `fr.md` beside an English source to publish a French version. Each article folder has a shared `meta.json` for its date, tags, optional slug, and article-wide draft flag. Markdown files keep translated titles and per-language draft flags. Dates control newest-first sorting.

Content has language-specific URLs such as `/en/learn/blockchain-101` and `/fr/learn/blockchain-101`. All pages use `/en` or `/fr` prefixes; no legacy routes or redirects are configured. Content and interface are available in English and French, including dates and accessibility labels. The shared glossary lives in `content/glossary/en.md` and `fr.md`, with stable term anchors across languages.

Run `pnpm --filter @0xhq/0xhq.space check:translations` to identify translations needing review after English source changes. See [the app guide](apps/0xhq.space/README.md) for writing, translation, and publishing instructions.
