# GHIcons Project Structure & Architecture

This document explains how GHIcons is put together: where everything lives, how an SVG becomes a published artifact, and which parts of the tree are hand-written versus generated.

It is aimed at maintainers and contributors. If you only want to *use* GHIcons, read [DOCUMENTATION.md](DOCUMENTATION.md).

For the rules an icon itself must satisfy, read [ICON-SPEC.md](ICON-SPEC.md). This document covers the machinery around that specification.

---

## 📋 Table of Contents

- [The Core Principle](#-the-core-principle)
- [Design Goals](#-design-goals)
- [The Big Picture](#-the-big-picture)
- [Repository Layout](#-repository-layout)
- [The Packages](#-the-packages)
- [Source of Truth: `svg/`](#-source-of-truth-svg)
- [The Pipeline](#-the-pipeline)
- [The Registry](#-the-registry)
- [The React Integration](#-the-react-integration)
- [Build & Publishing](#-build--publishing)
- [Storybook & the Playground](#-storybook--the-playground)
- [Quality Gates](#-quality-gates)
- [The Website](#-the-website)
- [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
- [Current State vs. Target State](#-current-state-vs-target-state)
- [Where Do I Make My Change?](#-where-do-i-make-my-change)

---

## 🧭 The Core Principle

Everything in this document follows from one rule:

> **The SVG collection is the canonical source of truth. Everything else is a generated consumer of it.**

GHIcons is not a React library that happens to contain SVGs. It is a collection of Ghanaian symbols that happens to ship a React adapter.

```text
                         GHIcons
                            │
                     Canonical Icons
                            │
                    ┌───────┴───────┐
                    ▼               ▼
                  SVGs           Registry
                    └───────┬───────┘
                            ▼
                      Icon Pipeline
                            │
     ┌──────────┬───────────┼───────────┬──────────┐
     ▼          ▼           ▼           ▼          ▼
  Raw SVG     React        Vue       Svelte      CDN
```

React is an integration, not the definition of GHIcons. This distinction decides almost every structural question below.

---

## 🎯 Design Goals

1. **The collection is independent of any framework.** The canonical icon set and its specification do not know what React is.
2. **Contributors work only with source assets.** Adding an icon means adding an SVG. It never means writing framework code.
3. **Every implementation represents the same icon.** React, Vue, raw SVG or CDN — all derived from one source, all conforming to one specification.
4. **The icon specification is stable independently of framework APIs.** Canvas, colour behaviour, naming and metadata belong to the icon. Framework APIs are adapters around them.
5. **Generated code is disposable.** Components, stories, registries and manifests are reproducible from source. None of them is a second source of truth.
6. **Each package ships only what its consumers need.** A React app should not download a Vue adapter, and a plain-HTML user should not download React.
7. **One contribution reaches every platform.** Add an icon once; the pipeline makes it available everywhere GHIcons is supported.

---

## 🗺️ The Big Picture

```text
  Contributor
      │  adds / edits
      ▼
┌──────────────────────┐        ┌──────────────────────┐
│   svg/**/*.svg       │        │  metadata/**/*.json  │
│  canonical artwork   │        │  authored meanings,  │
│                      │        │  keywords, aliases   │
└──────────┬───────────┘        └──────────┬───────────┘
           └───────────────┬───────────────┘
                           ▼
              ┌────────────────────────┐
              │      Icon Pipeline     │
              │  1. Validate           │
              │  2. Optimise           │
              │  3. Normalise          │
              │  4. Build registry     │
              │  5. Generate outputs   │
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │   Canonical Icon Set   │
              │  assets + registry     │
              └───────────┬────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌──────────────────┐            ┌──────────────────────┐
│     ghicons      │            │   @ghicons/react     │
│  (core package)  │            │  generated .tsx      │
│  SVG + registry  │            │  components          │
└────────┬─────────┘            └──────────┬───────────┘
         │                                 │
         ▼                                 ▼
  CDN · downloads · website          React apps · Storybook
  any framework, any language
```

The only human-authored inputs in that diagram are the SVG and its metadata. Everything downstream is produced by the pipeline.

---

## 📁 Repository Layout

GHIcons is a **pnpm monorepo**. The canonical collection sits at the root, outside any package, because it belongs to all of them equally.

```text
ghicons/
├── svg/                        ← CANONICAL SOURCE OF TRUTH
│   ├── adinkra/                  Traditional Adinkra symbols
│   ├── general/                  Everyday Ghanaian-context icons
│   └── national/                 National emblems
│
├── metadata/                   ← Hand-authored icon metadata
│                                 meanings, keywords, aliases, references
│
├── tools/                      ← The pipeline. Framework-neutral.
│   ├── validate.mjs              Spec enforcement (local + CI)     ✅ built
│   ├── canonical.mjs             SVG → canonical icon representation
│   ├── registry.mjs              Canonical icons → registry.json
│   └── generators/
│       └── react.mjs             Canonical icons → .tsx components
│                                 (today: custom_scripts/build_components.cjs)
│
├── packages/
│   ├── core/                   → npm: ghicons
│   │   ├── dist/                 Optimised SVGs + registry (generated)
│   │   └── package.json
│   │
│   └── react/                  → npm: @ghicons/react
│       ├── src/
│       │   ├── props.ts          HAND-WRITTEN. The React icon contract.
│       │   ├── icons/            GENERATED components
│       │   └── index.ts          GENERATED barrel
│       ├── stories/              GENERATED Storybook stories
│       └── package.json
│
├── playground/                 ← Vite dev app: searchable icon browser
├── .storybook/                 ← Storybook config (React integration)
│
├── .github/
│   ├── workflows/                Validation, release, pre-release
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
│
├── docs/                       ← You are here
│   └── wiki/                     Pages mirrored to the GitHub wiki
│
├── ghicons_website/            ← Public site (separate git repository)
│
├── pnpm-workspace.yaml
└── LICENSE
```

### Hand-written vs. generated

| Path | Status | Committed? |
|---|---|---|
| `svg/**/*.svg` | Hand-authored | ✅ |
| `metadata/**` | Hand-authored | ✅ |
| `tools/**` | Hand-authored | ✅ |
| `packages/react/src/props.ts` | Hand-authored | ✅ |
| `playground/**` | Hand-authored | ✅ |
| `packages/core/dist/**` | Generated | ❌ |
| `packages/react/src/icons/**` | Generated | ❌ |
| `packages/react/src/index.ts` | Generated | ❌ |
| `packages/react/stories/**` | Generated | ❌ |

Because the generated tree is git-ignored, **a fresh clone has no components or registry until the pipeline runs**. CI regenerates everything before each build and publish, so generated output can never drift from source.

---

## 📦 The Packages

### `ghicons` — the core

The framework-agnostic package. No runtime dependencies, no framework code.

```text
ghicons/
├── svg/
│   ├── adinkra/GyeNyame.svg      optimised, spec-conformant
│   ├── general/…
│   └── national/…
├── registry.json                  the machine-readable index
├── index.js                       exports the registry
└── index.d.ts
```

Use it from anything:

```js
import registry from "ghicons/registry.json";
```
```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

This package is what makes the "framework-agnostic" claim real rather than aspirational. It is also what the CDN, the download pages, the website search and every future adapter are built on.

> **`ghicons` used to be the React package.** As of `0.1.0` the name belongs to the core, and React moved to `@ghicons/react`. See [MIGRATION.md](MIGRATION.md).

### `@ghicons/react` — the React integration

Generated `.tsx` components plus the shared `IconProps` contract. Depends on `react` as a peer dependency only.

```tsx
import { GyeNyame } from "@ghicons/react";
```

### Future packages

`@ghicons/vue`, `@ghicons/svelte`, `@ghicons/web-components`, and a Flutter package on pub.dev. Each is an adapter over the same canonical collection — never its own copy of the artwork. See the [Roadmap](wiki/Roadmap.md).

---

## 🖋️ Source of Truth: `svg/`

Each subdirectory of `svg/` is a **category**, and that structure is preserved through the whole pipeline:

```text
svg/adinkra/GyeNyame.svg
     │
     ├── ghicons          → svg/adinkra/GyeNyame.svg  (optimised)
     ├── ghicons          → registry entry "gye-nyame"
     └── @ghicons/react   → GyeNyame.tsx, exported as GyeNyame
```

Adding a category is creating a directory. The pipeline recurses over whatever it finds, so no generator change is needed.

The filename determines the identifier everywhere. `clean_filename` normalises names to PascalCase, and validation enforces it, so the generated identifier is always valid in every target language.

---

## ⚙️ The Pipeline

The pipeline is deliberately staged, and every stage is framework-neutral except the last.

```text
   svg/*.svg + metadata/*.json
              │
              ▼
    ┌──────────────────┐
    │  1. VALIDATE     │  Enforce ICON-SPEC across the whole collection.
    └────────┬─────────┘  Fails the build on any violation.
             ▼
    ┌──────────────────┐
    │  2. OPTIMISE     │  SVGO. Must not change appearance.
    └────────┬─────────┘
             ▼
    ┌──────────────────┐
    │  3. NORMALISE    │  Produce the canonical icon representation:
    └────────┬─────────┘  { name, slug, category, viewBox, body, metadata }
             ▼
    ┌──────────────────┐
    │  4. REGISTRY     │  Rebuild registry.json from scratch.
    └────────┬─────────┘
             ▼
    ┌──────────────────┐
    │  5. GENERATE     │  Per-target emitters consume the canonical
    └──────────────────┘  representation. React today; others later.
```

### Why the staging matters

Stages 1–4 know nothing about any framework. That is the whole point: adding Vue means writing one emitter against the canonical representation, not a second pipeline.

Two properties the pipeline must hold:

- **Reproducible.** Deleting every generated artifact and re-running must produce byte-identical output. CI relies on this.
- **Complete.** Generated indexes are *rebuilt*, never appended to. An append-only barrel leaves stale exports pointing at deleted icons — a bug GHIcons has already been bitten by.

---

## 🗃️ The Registry

`registry.json` is the machine-readable index of the collection, generated at stage 4 and published inside `ghicons`.

```json
{
  "version": "0.1.0",
  "icons": [
    {
      "name": "GyeNyame",
      "slug": "gye-nyame",
      "category": "adinkra",
      "viewBox": "0 0 24 24",
      "file": "svg/adinkra/GyeNyame.svg",
      "meaning": "Except God — the supremacy of God",
      "keywords": ["god", "supremacy", "faith"]
    }
  ]
}
```

Required fields are derived automatically from the filename, directory and SVG, so every icon gets a valid entry with no authoring effort. Optional fields come from `metadata/` and can arrive later.

The registry is what lets one index serve the website's search, the CDN's manifest, the download pages, the docs, and every framework generator — instead of each of them re-deriving the collection independently. The playground currently hardcodes its own name-to-category map; that goes away once it reads the registry.

The registry describes icons. It never holds a second editable copy of the artwork. Full schema in [ICON-SPEC.md](ICON-SPEC.md#-the-icon-registry).

---

## ⚛️ The React Integration

Every generated component conforms to `IconProps`, defined in `packages/react/src/props.ts`:

```ts
export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    viewBox?: string;
}
```

Alongside it, `trueSize(size)` normalises the `size` prop — bare numbers and unitless strings become pixels, valid CSS units pass through:

```ts
trueSize(24)        // "24px"
trueSize("2.5rem")  // "2.5rem"
trueSize("32")      // "32px"
```

A generated component is thin and dependency-free:

```tsx
const GyeNyame: React.FC<IconProps> = ({ size = 24, color = 'currentColor', viewBox = "0 0 24 24", ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg'
       width={trueSize(size)} height={trueSize(size)}
       fill={color} viewBox={viewBox} {...props}>
    {/* optimised paths, inlined */}
  </svg>
);
```

Three consequences:

- **`fill={color}` precedes `{...props}`**, so a consumer can still override `fill` directly.
- **Paths are inlined.** No sprite sheet, no stylesheet, no network request per icon.
- **`currentColor` is the default**, so icons inherit text colour. This is also why the spec forbids hardcoded fills — a baked-in colour silently defeats the `color` prop.

---

## 🏗️ Build & Publishing

Each package builds independently; the pipeline runs once, up front.

```text
pnpm run validate      → whole-collection spec check
pnpm run generate      → registry + all framework outputs
pnpm run build         → build every package
```

### `ghicons` (core)

No compilation in the usual sense — the build copies optimised SVGs and writes `registry.json` plus a tiny JS/TS entry point. No dependencies, so nothing to bundle or externalise.

### `@ghicons/react`

`tsc` emits declarations; Vite library mode bundles `src/index.ts` into ESM and UMD. `react` and `react-dom` are `external`, so they are never bundled and there is no duplicate-React hazard.

```jsonc
"exports": {
  ".": {
    "types":   "./dist/index.d.ts",
    "import":  "./dist/index.es.js",
    "require": "./dist/index.umd.js"
  }
}
```

Publishing order matters: `ghicons` first, then adapters, so an adapter never references a core version that is not yet on the registry. Full policy in the [Release Process](wiki/Release-Process.md).

---

## 📚 Storybook & the Playground

Two ways to look at icons while developing. Both are React-side tooling, not part of the canonical system.

- **Storybook** (`pnpm run storybook`) — the per-icon reference. Stories are generated, so the gallery grows with the collection. Variants: Default, Large, Colored, SmallColored.
- **Playground** (`pnpm run dev`) — a searchable, category-filtered browser over the whole collection, with a docs page. Development-only; never published.

As GHIcons becomes framework-neutral, the public website takes over as *the* icon browser, and these two narrow to what they are good at: React integration development.

---

## ✅ Quality Gates

| Workflow | Trigger | What it does |
|---|---|---|
| `validate-svgs.yml` | Every PR | Validates the **entire** collection against ICON-SPEC |
| `release.yml` | Push/PR to `master` | Lint, validate, generate, build; publishes on push |
| `dev-pre-release.yml` | Push to `dev` | Builds and publishes a pre-release |

Validation enforces the spec: `viewBox` exactly `0 0 24 24`, no colour but `currentColor`/`none`, no raster or base64, no scripts or imports, PascalCase filenames. Each rule protects a pipeline assumption — see [ICON-SPEC.md](ICON-SPEC.md#-validation).

> **Validating only changed files is not enough.** The original workflow checked only the SVGs touched by a PR, and 103 of 106 icons drifted to a hardcoded `fill='#fff'` without a single failing build. The sweep runs over everything now.

---

## 🌐 The Website

`ghicons_website/` is the public browser at [ghicons.methuselah.site](https://ghicons.methuselah.site) — a Next.js + Tailwind app with **its own git repository**, nested in this directory but not tracked here.

It consumes GHIcons as a published npm dependency, not a workspace link, so a library change reaches it only after a release and a dependency bump.

Once the registry ships, the site consumes it directly instead of maintaining parallel metadata — that is what unlocks search, meanings, per-icon pages and downloads. The website is a consumer of the collection, never a source of truth for it.

---

## 🧠 Design Decisions & Trade-offs

**A monorepo with the collection at the root.**
`svg/` deliberately sits outside `packages/`. If it lived inside the core package, the core would own the collection and every other adapter would consume it second-hand. At the root, all packages are peers over a shared source — which is what the architecture claims.
*Cost:* workspace tooling, multi-package release coordination, and a longer contributor path than a single-package repo.

**`ghicons` names the core, not React.**
The headline name should mean the icon collection, because that is what the project is. Leaving it attached to React would have kept the old framing alive in the most visible place.
*Cost:* a real breaking change for existing installs. Taken deliberately while the number was still small, rather than after 1.0 when it would be expensive. See [MIGRATION.md](MIGRATION.md).

**Generate components instead of committing them.**
A hundred near-identical `.tsx` files would swamp every diff and invite hand-edits that drift from the SVG. Keeping them git-ignored makes `svg/` unambiguously authoritative.
*Cost:* a clone is not buildable by inspection, and generated output cannot be reviewed in a PR.

**A staged pipeline rather than one script.**
Splitting validate / optimise / normalise / registry / generate means adding a framework is one new emitter, not a second pipeline.
*Cost:* more moving parts than the single generator it replaces.

**A single flat barrel per framework package.**
`import { GyeNyame, Sankofa } from "@ghicons/react"` is the ergonomic default, relying on ESM tree-shaking to drop unused icons.
*Cost:* bundlers that cannot tree-shake pull in everything. Those consumers should use the core package's raw SVGs.

**Categories as directories, with the registry for everything else.**
Category lives in the filesystem: cheap to extend, impossible to desync. Richer classification — keywords, aliases, meanings — belongs in the registry rather than being forced into the directory tree.

**Monochrome `currentColor` by default.**
Icons behave like text. This is the single most visible decision for consumers, and the one validation protects most aggressively. Multicolour is a deliberate future extension, not an oversight.

---

## 🚦 Current State vs. Target State

This document describes the architecture GHIcons is being restructured into. Being explicit about the gap:

| Area | Today | Target |
|---|---|---|
| Repo shape | Single package, `src/` is React | pnpm monorepo, `packages/core` + `packages/react` |
| `ghicons` on npm | The React package (`0.0.1`) | The framework-agnostic core (`0.1.0`) |
| React package | — | `@ghicons/react` |
| Pipeline | Validation is a real standalone stage (`tools/validate.mjs`); optimise/normalise/generate are still one inline script | Staged: validate → optimise → normalise → registry → generate |
| Registry | None; category derived ad hoc, playground hardcodes its own map | Generated `registry.json` shipped in the core |
| Barrel | Append-only; stale exports survive deletions | Rebuilt from source every run |
| Validation | ✅ Whole collection, every PR, via `pnpm run validate` | — |
| Collection | ✅ Fully spec-conformant — no known exceptions | — |
| Raw SVG distribution | Not available | Shipped in the core package |

Progress against this table is tracked in the [Roadmap](wiki/Roadmap.md).

---

## 🔧 Where Do I Make My Change?

| I want to… | Touch this |
|---|---|
| Add an icon | `svg/<category>/<Name>.svg`, then run the pipeline |
| Correct an icon's artwork | Its canonical SVG. Never the generated component |
| Add a category | Create `svg/<new-category>/` — discovered automatically |
| Add meanings, keywords or aliases | `metadata/` |
| Change what makes a valid icon | [`ICON-SPEC.md`](ICON-SPEC.md) **and** `tools/validate.mjs` |
| Change SVG validation in CI | `.github/workflows/validate-svgs.yml` |
| Change the registry schema | `tools/registry.mjs` and [`ICON-SPEC.md`](ICON-SPEC.md) |
| Change the React props API | `packages/react/src/props.ts` **and** `tools/generators/react.mjs` |
| Change how React components are emitted | `tools/generators/react.mjs` |
| Change Storybook stories | The story generator, then regenerate |
| Add a new framework integration | A new emitter in `tools/generators/` + a new package |
| Change what ships in a package | That package's `package.json` and ignore rules |
| Change the release flow | `.github/workflows/release.yml`, `dev-pre-release.yml` |
| Change the public website | `ghicons_website/` (separate repo, consumes the *published* package) |

The guiding rule:

> **If the change describes what an icon *is*, it belongs to the canonical icon system. If it describes how a platform *uses* an icon, it belongs to that platform's integration.**

---

## See Also

- [ICON-SPEC.md](ICON-SPEC.md) — what makes a valid GHIcon
- [DEVELOPMENT.md](DEVELOPMENT.md) — commands and day-to-day workflow
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to submit icons and code
- [MIGRATION.md](MIGRATION.md) — moving from `ghicons` 0.0.x to the new packages
- [Roadmap](wiki/Roadmap.md) — what is planned and in what order
