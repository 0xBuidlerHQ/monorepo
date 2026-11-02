# 0xhq.space

Run `pnpm install` and `pnpm dev` from the repository root. Open http://localhost:3000/en.

## Markdown content

Each article has a folder containing its language versions:

```text
content/
  learn/
    blockchain-101/
      meta.json
      en.md
      fr.md
    ethereum-101/
      meta.json
      en.md
  thoughts/
    hello-world/
      meta.json
      en.md
  glossary/
    en.md
    fr.md
```

English is the source language. Content and interface support English (`en`), French (`fr`), Spanish (`es`), and European Portuguese (`pt`): navigation, dates, reading time, breadcrumbs, table of contents, accessibility labels, and error pages follow the chosen language. The document’s HTML `lang` is also set on the server. UI strings live in `src/lib/messages.ts`.

## Publishing an article

Create a folder such as `content/learn/my-article/` (or use `thoughts` or `ideas`). Add a shared `meta.json`:

```json
{
  "slug": "my-article",
  "date": "2026-10-31",
  "tags": ["technology"],
  "draft": false
}
```

`slug` is optional: the folder name supplies it by default. Slugs use lowercase letters, numbers, and hyphens, and must be unique within a collection. A custom slug applies to every language.

Then add `en.md`:

```md
---
title: My article
draft: false
---

Write your article using **Markdown**.
```

Published articles require a valid `date` in `YYYY-MM-DD` format in `meta.json`. Listings sort newest first, with title as the tiebreaker. Tags are optional and shared across languages. Optional `previous` and `next` fields in `meta.json` specify article slugs in the same collection for the bottom reading navigation. These do not affect date-based listing order. A link is displayed only if its target is published in the current language. The translated title is injected as the first Markdown heading.

There are two independent draft controls:

- `meta.json` → `draft: true` hides the entire article in every language.
- A language file (`en.md`, `fr.md`, `es.md`, or `pt.md`) → `draft: true` hides only that language version.

A version is published only when both draft flags are absent or false. Drafts are excluded from listings, direct URLs, metadata, and the language selector. A globally drafted article can omit its date until publication.

Keep `slug`, `date`, and `tags` exclusively in `meta.json`; putting them in language front matter is rejected to prevent contradictory values. Markdown front matter contains the translated title, optional per-language draft status, and translation revision information.

The English URL is `/en/learn/my-article`. French versions use `/fr/learn/my-article`. Thoughts follow the same pattern. `/en/learn` and `/fr/learn` list only published content in that language. There is no silent English fallback for a missing translation.

## Curated products

Curated / Pépites / Joyas / Pérolas lives at `/<locale>/curated`. Products are image cards that link directly to the maker’s purchase page. They have no local article page, publication date, or reading time.

Edit `content/curated/products.json` to add a product. Each entry has a unique `id`, `name`, `brand`, HTTPS purchase `url`, `availability` (`preorder`, `available`, or `discontinued`), an `image` with local `src`, `width`, `height`, and original `source` URL, and `translations` for `en`, `fr`, `es`, and `pt` containing `description` and `imageAlt`. Array order controls card order. Store product images in `public/images/curated/`. No Markdown or shared article metadata is needed.

Discontinued products can link to second-hand listings. White-background catalog photos can set `image.blendWithBackground: true` to blend into the gray card using CSS, preserving the original image file.

The first entry is Ambire Ice. Its description and image come from [Ambire’s product page](https://www.ambire.com/ice); its purchase link opens the pre-order section. Optional `price` metadata stores the seller’s listed `amount`, ISO `currency`, `checkedAt` date, and `source` URL. Verified prices appear at the bottom right of the card in the seller’s currency, formatted for the selected language; hovering shows the date checked. These are manually maintained snapshots. Products without a verified fixed price show a localized “See price” link label instead. The brand appears at the top left. The cards use the site’s existing dark background, typography, borders, and red interaction accents.

There is one root layout, `src/app/[locale]/layout.tsx`, for all four languages. Pages use `/en`, `/fr`, `/es`, or `/pt` URLs. The locale homepage displays About; there is no separate `/about` page. `src/proxy.ts` redirects page URLs without a locale to English, preserving the path and query string: `/` goes to `/en`, and `/learn` goes to `/en/learn`. Static assets, Next.js internals, and API routes bypass locale redirects. No custom article ordering is configured.

## Translating content

Create `fr.md`, `es.md`, or `pt.md` beside the English file. The slug, date, and tags are inherited from `meta.json`. Translate the title and Markdown body, and add `sourceRevision`:

```md
---
title: Mon article
draft: true
sourceRevision: SHA256_OF_THE_REVIEWED_ENGLISH_FILE
---

Rédigez la traduction ici.
```

Run `pnpm --filter @0xhq/0xhq.space check:translations` from the repository root. It reports missing or outdated source revisions and prints the current English hash. Review the source changes, update the translation, then record that hash. Do not update the hash without reviewing the source. Set the language file’s `draft: false` when ready to publish, and make sure the shared `meta.json` is not drafted. Changes only to shared metadata do not require a translation revision update.

The EN/FR/ES/PT selector lives in the header. It opens the same article in the chosen language and disables unavailable translations. Navigation preserves the selected language for both content and interface. Translation titles do not change the URL slug. All current articles and glossary definitions have French, Spanish, and European Portuguese versions. Future translations can still be drafted and published individually.

## Glossary

Edit `content/glossary/{en,fr,es,pt}.md`. The glossary is a reference page at `/<locale>/glossary`, without article dates or reading time.

Keep definitions alphabetically ordered in their language. Use stable English identifiers for translated terms:

```md
## Clé privée {#private-key}

Une valeur secrète utilisée pour signer une demande.
```

The `{#private-key}` is removed from the displayed heading and becomes its anchor. Link to it with `[clé privée](/fr/glossary#private-key)`. English headings generate anchors automatically (`## Private key` → `#private-key`).

Translated articles should link to content in the same language when it exists. If a related article is only available in English, link to its `/en/…` URL and make that clear in the link text. Missing translations return 404 rather than mixing languages. All glossaries share the same stable term identifiers.

Glossary translations also use `sourceRevision` and `draft` front matter. Source changes flag them for review, but do not automatically unpublish an existing translation.

## Article SEO and share images

Add a short, plain-text `description` to each language file's front matter. This is both the visible introduction under the article title and the description used in search and social metadata. Write it in the same language as the article:

```yaml
title: "[ Blockchain ] 101"
description: "Understand transactions, digital signatures, blocks, consensus, and finality with a concert ticket example."
draft: false
```

Descriptions are provided for all current articles in all four languages. New articles without a description use a plain-text excerpt as a fallback. Update descriptions alongside translations and record the reviewed English `sourceRevision` as usual.

Each article automatically gets a localized 1200 × 480 PNG share card at `/<locale>/<collection>/<slug>/share-image`. To use your own image, put a PNG, JPEG, or WebP in `public/images/`, then add `"image": "/images/my-article.jpg"` to the article's shared `meta.json`. Add a translated `imageAlt` to each language file. Use a landscape image around 1200 × 630 for social sharing. These images are used in metadata; custom images are not inserted into the article body automatically.

Generated cards use the site's dark theme, typography, and colored title markers. They show only the article title, description, publication date, and reading time, without navigation, subscription controls, breadcrumbs, footer, or borders. Geist and Geist Mono are bundled locally in `src/assets/fonts/` under their included SIL Open Font License, so the share cards need no font downloads. Title-marker colors are shared with the website.

Pages without their own image inherit the default 1200 × 480 card at `/share-image.png`. It uses the site name and description from `src/lib/site.ts`, with the same dark style and no article date or reading time. Appending `/share-image` to other page URLs, including unknown paths, serves this default card. Unknown articles' image URLs redirect to the static default PNG; ordinary unknown page URLs still return the site's not-found page. The default and all published article cards are generated during the production build.

With `pnpm dev` running, run `pnpm --filter @0xhq/0xhq.space test:share-images` to verify the actual image endpoints. Set `SHARE_IMAGE_BASE_URL` to check another local port or a production server. This complements the build check, since the image renderer's handling of React components differs in development.

The article emits a clean search title, description, canonical URL, published-language alternatives, Open Graph metadata, an X large-image card, and Article/BlogPosting JSON-LD with its author and publication date. The visible title keeps its existing styling. Markdown continues to supply semantic headings, paragraphs, lists, tables, and code blocks; use `##` for article sections because the title already provides the page's `h1`.

Set an optional `"updated": "2026-11-01"` in `meta.json` after a substantive revision. It must be on or after the publication date and is only emitted as a modified date when supplied. `SITE_URL` defaults to `https://0xhq.space`; keep it set to the public production origin so previews don't become canonical URLs.

`/sitemap.xml` lists published pages and available translations; drafts are excluded. `/robots.txt` points crawlers to it. Run `pnpm --filter @0xhq/0xhq.space test:seo` to check metadata and safe structured-data serialization.

## Article animations

Configure article illustrations in the article’s shared `meta.json`. Each entry selects a figure, its section heading, and the caption for each language:

```json
"animations": [
  {
    "figure": "relay",
    "afterHeading": {
      "en": "the-transaction-lifecycle",
      "fr": "le-deroulement-d-une-transaction"
    },
    "caption": {
      "en": "Alice’s signed request travels between participants.",
      "fr": "La demande signée d’Alice circule entre les participants."
    }
  }
]
```

Use the heading’s URL fragment without `#` for `afterHeading`, or `article-title` to place a figure beside the article title. Each configured language needs both a heading and a caption. On wide screens, each figure starts beside its section heading in the left margin, then sticks while its section is visible and moves out before the next section. On narrow screens, it appears inline after the heading. Changing the target changes which section uses the figure; removing the entry removes it. Supported figures are `branches`, `terminal`, `padlock`, `format`, `rebuild`, `settle`, `relay`, `exploded`, and `hub`. No heading-to-animation assignments or captions live in the renderer. Figures loop continuously while visible; playback respects reduced motion.

## Development and deployment

Save Markdown and refresh the page during development. In production, rebuild and deploy to publish edits; the production server does not watch content files. Hosting and automatic deployments are not configured in this repository.

Local images belong in `public/`; use paths such as `![Description](/images/photo.jpg)`.

## Checks

From the repository root:

```sh
pnpm typecheck
pnpm lint
pnpm --filter @0xhq/0xhq.space test:content
pnpm --filter @0xhq/0xhq.space check:translations
pnpm build
```

The content tests use Node.js 24 (or another version with native TypeScript support) and cover shared metadata, locale isolation, both draft levels, validation, and source revision checks.

Ethereum uses eight custom SVG animations: `ethereum-network`, `ethereum-program`, `ethereum-ether`, `ethereum-tokens`, `ethereum-exchange`, `ethereum-gas`, `ethereum-fees`, and `ethereum-settlement`. Their drawings live in `src/components/ethereum-drawings.ts` and share the same looping playback, reduced-motion handling, and language-switch preservation as the Hairline illustrations. These illustrations are conceptual rather than literal execution diagrams.

Blockchain 101 uses nine custom SVG scenes in `src/components/blockchain-drawings.ts`: `blockchain-history`, `blockchain-record`, `blockchain-signature`, `blockchain-rules`, `blockchain-hashes`, `blockchain-consensus`, `blockchain-lifecycle`, `blockchain-layers`, and `blockchain-together`. Both articles use `src/components/svg-drawing.ts` to mount, label, pause, and dispose their SVGs.

DeFi 101 continues the series after Ethereum in all four languages. Its eight article scenes live in `src/components/defi-drawings.ts`: `defi-network`, `defi-allocation`, `defi-swap`, `defi-staking`, `defi-lending`, `defi-project`, `defi-returns`, and `defi-together`. Assignments and translated captions live in `content/learn/defi-101/meta.json`.

Article and glossary links use internal site paths or heading fragments only. External references remain plain text rather than outbound links. The Markdown renderer also displays external link labels as plain text.

Stablecoins 101 follows DeFi in all four languages. Seven custom scenes in `src/components/stablecoin-drawings.ts` cover the title, reference value, reserves, arbitrage, backing models, depegging, and the complete picture. Configure them in `content/learn/stablecoins-101/meta.json` using `stablecoin-value`, `stablecoin-peg`, `stablecoin-reserves`, `stablecoin-arbitrage`, `stablecoin-models`, `stablecoin-depeg`, and `stablecoin-together`.

Layer 2 101 follows Stablecoins in all four languages. Seven custom scenes in `src/components/layer-2-drawings.ts` illustrate networks, capacity, rollups, balances, bridges, token versions, and settlement. Assignments and translated captions live in `content/learn/layer-2-101/meta.json`, using `layer2-networks`, `layer2-capacity`, `layer2-rollup`, `layer2-balances`, `layer2-bridge`, `layer2-versions`, and `layer2-settlement`.

The learning sequence is Blockchain → Ethereum → Wallets → DeFi → Stablecoins → Layer 2 → Oracles. Article lists are ordered by publication date, newest first and oldest last. The `previous` and `next` fields control article navigation only. Wallets has eight custom scenes in `src/components/wallet-drawings.ts`, assigned with localized captions in `content/learn/wallets-101/meta.json`.

Oracles 101 follows Layer 2 in all four languages and revisits Bob’s 400 USDC loan. Seven custom scenes live in `src/components/oracle-drawings.ts`, configured in `content/learn/oracles-101/meta.json` as `oracle-data`, `oracle-boundary`, `oracle-sources`, `oracle-report`, `oracle-freshness`, `oracle-loan`, and `oracle-trust`. Article lists continue to sort by publication date; previous/next metadata controls navigation only.

Ideas is a translated content section at `/<locale>/ideas`, with entries in `content/ideas/<slug>/{meta.json,en.md,fr.md,es.md,pt.md}`. The header links to its date-sorted index. `idea-00` contains the collectible ownership concept.

## Spanish and European Portuguese

Spanish pages use `/es`; Portuguese pages use `/pt`, with Portugal-specific wording and `pt-PT` date formatting. The language switcher displays PT and announces Portuguese (Portugal). About, footer accessibility labels, errors, glossary, thoughts, ideas, and all seven learning articles are translated. Glossary terms retain English anchor IDs in every language, so links and term selection survive language changes. Article headings use localized anchors; each article’s `meta.json` maps its animations and captions for every language. The SVG instances remain shared when switching languages.

`check:translations` validates all non-English language files against the English source hash. Content tests check links and glossary anchors in all four languages. Add new languages through `src/lib/locales.ts`, including their regional format and language-switch labels, rather than adding English/French branches.

## Newsletter subscriptions

The header has a rounded Subscribe button with a white background, black label, and arrow. On mobile, navigation occupies its own row, with larger language controls and a compact Subscribe button together beneath it. Translated links stay on one line, with horizontal scrolling available on unusually narrow screens. Desktop keeps its existing layout with Subscribe in the right-hand area. It opens the shadcn Base UI drawer, with an email field, translated title/description, and close control. The form inside is deliberately UI-only and prevents submission; it does not contact Buttondown. There is no bottom-of-page signup form.

The Buttondown form component and public newsletter configuration (`https://buttondown.com/0xhq` in `packages/config/src/links.ts`) remain available for future integration. When mounted with `getNewsletterSignupUrl`, `NewsletterSignup` uses a native HTML POST to Buttondown, including the email address, `embed=1`, and language/source metadata; Buttondown handles validation and confirmation. No API key or database is needed. `.env.example` documents the optional username override for that future wiring; it currently has no effect on the drawer’s UI-only form.

Reference: [Buttondown HTML signup forms](https://docs.buttondown.com/building-your-subscriber-base).

## UI components

`components.json` configures shadcn’s `base-nova` registry for the app’s existing Tailwind v4 setup. `src/components/ui/drawer.tsx` was installed with the official shadcn CLI and uses `@base-ui/react/drawer` (not Vaul), with the registry’s `cn` utility. Base UI supplies the portal, modal focus handling, focus restoration, scroll lock, Escape/outside dismissal, and swipe interactions. The bottom-sheet form uses its VirtualKeyboardProvider; `body` is positioned for the iOS overlay. The site always uses its dark palette, including native controls, prose, title markers, and article animations, regardless of device appearance settings. Reduced-motion users skip the drawer transitions.
