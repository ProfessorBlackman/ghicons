# GHIcons 🇬🇭

[![Build Status](https://img.shields.io/github/actions/workflow/status/ProfessorBlackman/ghicons/release.yml?branch=master&label=build)](https://github.com/ProfessorBlackman/ghicons/actions)
[![npm version](https://img.shields.io/npm/v/ghicons)](https://www.npmjs.com/package/ghicons)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Ghanaian symbols, gathered and standardised for developers.**

Ghanaian symbols are scattered across the web in whatever format someone happened to upload — a PNG here, a hand-traced SVG there, all different sizes and weights. GHIcons collects them in one place and puts them on the same footing, so every symbol installs the same way and behaves the same way.

The scope is every symbol that is Ghanaian or belongs to Ghanaian life: Adinkra and other tribal symbols, the currency, national and state emblems, the marks of Ghanaian movements and organisations, and in time Ghanaian brands.

The collection is maintained independently of any framework. **SVG files are the canonical source of truth**; every package is generated from them.

---

## 📦 Packages

| Package | Install | What it is |
|---|---|---|
| **`ghicons`** | `npm install ghicons` | The framework-agnostic core — optimised SVGs and a machine-readable registry. No dependencies. Works with anything. |
| **`@ghicons/react`** | `npm install @ghicons/react` | React components with full TypeScript types. |

Vue, Svelte, Web Components and Flutter adapters are planned — see the [Roadmap](docs/wiki/Roadmap.md).

> ⚠️ **`ghicons` used to be the React package.** As of `0.1.0` the name belongs to the core, and React moved to `@ghicons/react`. See the [migration guide](docs/MIGRATION_v1.md).

---

## 🚀 Quick start

### Any framework, or none

```bash
npm install ghicons
```

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Icons use `currentColor`, so an inlined SVG takes its colour from CSS:

```css
.icon { color: #b8860b; }
```

Every icon is also described in the registry:

```js
import registry from "ghicons/registry.json";

const adinkra = registry.icons.filter(i => i.category === "adinkra");
// { name, slug, category, viewBox, file, meaning?, note?, keywords?, aliases?, references? }
```

### React

```bash
npm install @ghicons/react
```

```tsx
import { GyeNyame, Sankofa } from "@ghicons/react";

function App() {
  return (
    <div>
      <GyeNyame />
      <Sankofa size={40} color="gold" />
    </div>
  );
}
```

Icons inherit the surrounding text colour by default:

```tsx
<div style={{ color: "gold" }}>
  <GyeNyame />
</div>
```

---

## 🎛️ React props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Icon size. Numbers are pixels; strings take any CSS unit. |
| `color` | `string` | `currentColor` | Icon colour. |
| `viewBox` | `string` | `0 0 24 24` | SVG viewBox. |
| `className` | `string` | — | Additional CSS classes. |
| `style` | `React.CSSProperties` | — | Inline styles. |

Standard SVG attributes pass through:

```tsx
<GyeNyame size="2rem" color="#b8860b" role="img" aria-label="Gye Nyame symbol" />
```

Full guide: [DOCUMENTATION.md](docs/DOCUMENTATION.md).

---

## 🧿 The collection

100+ Adinkra symbols plus general and national icons, organised by category:

```text
svg/
├── adinkra/     Traditional Adinkra symbols
├── general/     Everyday Ghanaian-context icons
└── national/    National emblems
```

A few of them:

- **Gye Nyame** — the supremacy of God
- **Sankofa** — learning from the past
- **Duafe** — beauty and cleanliness
- **Dwennimmen** — humility together with strength
- **Ghana Cedi** — the national currency symbol

**[Browse all of them at ghicons.methuselah.site/icons](https://ghicons.methuselah.site/icons)** — search and filter by category, preview at any size and colour, and copy the code or the raw SVG. Every symbol also has its own page, with its metadata, a download and usage snippets.

The collection grows as symbols are researched, drawn and contributed.

---

## 🧠 Built around SVGs

The most important decision in GHIcons: **the SVG collection is the source of truth.** An icon is not defined by its React component.

```text
              Canonical SVG
                    │
            Icon Specification
                    │
              Icon Registry
                    │
             Generation Pipeline
                    │
   ┌──────────┬─────┴─────┬──────────┐
   ▼          ▼           ▼          ▼
Raw SVG     React    Future adapters CDN
```

One contribution reaches every platform GHIcons supports, and no two platforms can drift apart, because none of them owns the artwork.

Read the [Architecture](docs/ARCHITECTURE.md) and the [Icon Specification](docs/ICON-SPEC.md).

---

## 🛠️ Development

```bash
git clone https://github.com/ProfessorBlackman/ghicons.git
cd ghicons
pnpm install

pnpm run validate     # check the collection against the spec
pnpm run generate     # build the registry and all framework outputs
pnpm run dev          # icon browser playground
pnpm run storybook    # React component reference
pnpm run build        # build every package
pnpm run lint
```

Generated components, stories and the registry are derived from `svg/` and must never be edited by hand.

Full workflow: [DEVELOPMENT.md](docs/DEVELOPMENT.md).

---

## 🤝 Contributing

The most valuable contribution is an icon. You only need to produce an SVG — the pipeline handles every framework.

You can also contribute cultural research, corrections to existing icons, pipeline and tooling work, documentation, accessibility improvements, or help build a future framework adapter.

Read the [Icon Specification](docs/ICON-SPEC.md) before submitting artwork, then [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the process.

---

## 🗺️ Roadmap

GHIcons is pre-1.0.

| Phase | Goal |
|---|---|
| **v0.1** | Framework-agnostic core: raw SVG + registry, monorepo, collection on-spec |
| **v0.2** | Staged pipeline, authored metadata, registry-driven tooling |
| **v1.0** | Stable icon contract, registry schema and React API |
| **v1.x** | Collection growth, search and downloads, CDN, multicolour support |
| **v2.x** | Web Components, Vue, Svelte, Flutter |

Full detail: [Roadmap](docs/wiki/Roadmap.md).

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Documentation](docs/DOCUMENTATION.md) | Using GHIcons |
| [Icon Specification](docs/ICON-SPEC.md) | What makes a valid GHIcon |
| [Architecture](docs/ARCHITECTURE.md) | How the project is structured |
| [Development](docs/DEVELOPMENT.md) | Development workflow and tooling |
| [Contributing](docs/CONTRIBUTING.md) | How to contribute |
| [Migration](docs/MIGRATION.md) | Upgrading between releases — one guide per breaking change |
| [Roadmap](docs/wiki/Roadmap.md) | Direction and milestones |
| [Release Process](docs/wiki/Release-Process.md) | Versioning and releases |
| [SVG Style Guide](docs/wiki/SVG-Style-Guide.md) | Drawing and preparing icons |

The website also carries an [about page](https://ghicons.methuselah.site/about) covering what Adinkra symbols are and how the project handles their meanings.

---

## 💬 Community

Suggest symbols, discuss cultural context, request integrations, ask questions: [GitHub Discussions](https://github.com/ProfessorBlackman/ghicons/discussions).

For bugs and specific implementation problems: [open an issue](https://github.com/ProfessorBlackman/ghicons/issues).

---

## 📄 License

MIT © [Methuselah Nwodobeh](https://github.com/ProfessorBlackman)

---

## 🇬🇭 One icon. Everywhere.

The framework a developer uses should not determine whether Ghanaian visual language is available to them.

**One canonical symbol. One contribution. Available everywhere.**
