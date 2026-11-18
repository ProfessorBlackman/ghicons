# GHIcons 🇬🇭

[![Build Status](https://img.shields.io/github/actions/workflow/status/ProfessorBlackman/ghicons/release.yml?branch=master&label=build)](https://github.com/ProfessorBlackman/ghicons/actions)
[![npm version](https://img.shields.io/npm/v/ghicons)](https://www.npmjs.com/package/ghicons)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Ghanaian symbols, gathered and standardised for developers.**

Adinkra and other tribal symbols, the currency, national emblems and more, in one consistent format. The SVG files are the source of truth; every package is generated from them.

## Packages

| Package | What it is |
|---|---|
| [`ghicons`](packages/core) | Optimised SVGs and a JSON registry. No dependencies; works with anything. |
| [`@ghicons/react`](packages/react) | Typed React components. |

Vue, Svelte, Web Components and Flutter are [planned](docs/wiki/Roadmap.md).

> ⚠️ `ghicons` was the React package until `0.1.0`. React now lives in `@ghicons/react` — see the [migration guide](docs/MIGRATION_v1.md).

## Quick start

**Any framework, or none:**

```bash
npm install ghicons
```

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

```js
import registry from "ghicons/registry.json";
const adinkra = registry.icons.filter(i => i.category === "adinkra");
```

**React:**

```bash
npm install @ghicons/react
```

```tsx
import { GyeNyame, Sankofa } from "@ghicons/react";

<GyeNyame />
<Sankofa size={40} color="gold" />
```

Icons use `currentColor`, so they take the surrounding text colour. Props, accessibility and more: [Documentation](docs/DOCUMENTATION.md).

## The collection

106 icons across three categories — `adinkra`, `general` and `national`. [Browse them](https://ghicons.methuselah.site/icons) with search, previews, meanings and copyable code.

## Development

```bash
git clone https://github.com/ProfessorBlackman/ghicons.git
cd ghicons
pnpm install
pnpm run generate     # required first: generated files are not committed
pnpm run dev          # icon browser playground
```

See [DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Contributing

Adding an icon means adding an SVG — no framework code. Read the [Icon Specification](docs/ICON-SPEC.md), then [CONTRIBUTING.md](docs/CONTRIBUTING.md). Cultural research on existing symbols is just as welcome.

## Documentation

| Document | For |
|---|---|
| [Documentation](docs/DOCUMENTATION.md) | Using GHIcons |
| [Icon Specification](docs/ICON-SPEC.md) | What makes a valid icon |
| [Contributing](docs/CONTRIBUTING.md) | Submitting icons and code |
| [Development](docs/DEVELOPMENT.md) | Commands and workflow |
| [Architecture](docs/ARCHITECTURE.md) | How the project is structured |
| [Migration](docs/MIGRATION.md) | Upgrading between releases |
| [Roadmap](docs/wiki/Roadmap.md) | What's planned |

Questions and ideas: [Discussions](https://github.com/ProfessorBlackman/ghicons/discussions). Bugs: [Issues](https://github.com/ProfessorBlackman/ghicons/issues).

## License

MIT © [Methuselah Nwodobeh](https://github.com/ProfessorBlackman)
