# @0xbuidlerhq/utilityaf

![React] ![TypeScript] ![Next.js] ![Vercel] ![Motion]

UtilityAF is a Next.js + React 19 playground for everyday utilities.

## Getting Started

```bash
pnpm install          # dependencies
pnpm dev              # turbopack dev server on 3000
pnpm build            # production build
```

## Tool Catalog 

### Text

- [x] Word Counter
- [] Text Case Converter
- [] Line Break Remover
- [] Duplicate Line Remover
- [] Lorem Ipsum Generator
- [] Diff Checker
- [] Reading Time
- [] Text Reverser

### Dev

- [] Password Generator
- [] UUID Generator
- [] QR Code Generator
- [] Markdown ↔ HTML
- [] JSON ↔ YAML ↔ CSV
- [] URL/Base64/Hash Helpers
- [] Regex Tester
- [] String Sanitizer
- [] Settings JSON Builder
- [] Terminal Formatter
- [] Screen Size Checker

### Time

- [] Stopwatch
- [] Countdown Timer
- [] Pomodoro Timer
- [] Alarm Clock
- [] Epoch Converter

### System

- [] Random Number
- [] Coin Flip
- [] Dice Roller
- [] Unit/Scale Converters
- [] IP Lookup
- [] Keyboard Tester
- [] Mouse Tester
- [] Webcam Test
- [] Mic Test

### Media

- [] Color Picker
- [] Image Compressor/Resizer/Converter
- [] Base64 ↔ Image
- [] PDF Merge/Split/Compress

## Conventions

- Keep components small and composable; push shared pieces into `src/components`.
- Co-locate hooks with their feature (e.g., `src/hooks/<feature>`); export “builder” helpers from config files.
- Prefer type-first APIs; derive display strings from data rather than duplicating constants.
- Document new tools in `src/config/tools.ts` and keep the README catalog in sync.


<!-- Badges -->
[ReactQuery]: https://img.shields.io/badge/React%20Query-black?logo=reactquery&logoColor=fff
[React]: https://img.shields.io/badge/React-black.svg?logo=react&logoColor=fff
[TypeScript]: https://img.shields.io/badge/TypeScript-black?logo=typescript&logoColor=fff
[Next.js]: https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white
[Vercel]: https://img.shields.io/badge/Vercel-black.svg?logo=vercel&logoColor=white
[Three.js]: https://img.shields.io/badge/Three.js-black?logo=threedotjs&logoColor=white
[Shadcn]: https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white
[Json]: https://img.shields.io/badge/JSON-black?logo=json&logoColor=white
[Viem]: https://custom-icon-badges.demolab.com/badge/Viem-black?logo=viem&logoColor=white
[Wagmi]: https://img.shields.io/badge/Wagmi-black?logo=wagmi&logoColor=white
[Solidity]: https://img.shields.io/badge/Solidity-black?logo=solidity&logoColor=white
[Motion]: https://img.shields.io/badge/Motion-black?logo=framer&logoColor=white