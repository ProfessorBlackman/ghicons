# GHIcons Development Guide

How to set up, develop, test, build and release GHIcons.

GHIcons is built around a **canonical SVG collection**. Every package is generated from it. If you internalise one thing from this document, make it that.

For the structure behind these commands, read [ARCHITECTURE.md](ARCHITECTURE.md). For what makes a valid icon, read [ICON-SPEC.md](ICON-SPEC.md).

---

## 📋 Table of Contents

- [Development Philosophy](#-development-philosophy)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [The Pipeline](#-the-pipeline)
- [Working with Icons](#-working-with-icons)
- [Generating Outputs](#-generating-outputs)
- [The Playground](#-the-playground)
- [Storybook](#-storybook)
- [Building](#-building)
- [Testing](#-testing)
- [Linting](#-linting)
- [Validation](#-validation)
- [CI/CD](#-cicd)
- [Website Development](#-website-development)
- [Generated Files](#-generated-files)
- [Common Tasks](#-common-tasks)
- [Changing the Icon System](#-changing-the-icon-system)
- [Troubleshooting](#-troubleshooting)
- [Related Documentation](#-related-documentation)

---

## 🧭 Development Philosophy

> **The SVG collection is the source of truth.**

Generated code is never a second source of truth. Three rules follow:

1. **Never hand-edit generated output.** Fix the SVG or fix the generator.
2. **Generation must be reproducible.** Delete everything generated, re-run, and the result must be identical. CI depends on this.
3. **Indexes are rebuilt, not appended to.** Appending leaves stale entries when icons are deleted or renamed.

---

## 🧰 Prerequisites

- **Node.js** — use the version in the repository configuration
- **pnpm** — the workspace depends on it; npm and yarn will not resolve the monorepo correctly
- **Git**

```bash
node --version
pnpm --version
git --version
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/ProfessorBlackman/ghicons.git
cd ghicons
pnpm install
```

The repository ships **no generated files**, so generate before anything else will run:

```bash
pnpm run generate
```

Then confirm a clean build:

```bash
pnpm run build
```

From there:

```bash
pnpm run dev          # icon browser playground
pnpm run storybook    # React component reference
```

---

## 📁 Project Structure

```text
ghicons/
├── svg/                    ← CANONICAL SOURCE. Contributors work here.
│   ├── adinkra/
│   ├── general/
│   └── national/
│
├── metadata/               ← Authored metadata (PLANNED, v0.2)
│
├── tools/                  ← The pipeline
│   ├── canonical.mjs         SVG → canonical icon representation
│   ├── validate.mjs          Spec enforcement
│   ├── build-core.mjs        → the ghicons package
│   ├── verify-packages.mjs   Release gate
│   ├── clean.mjs
│   └── generators/
│       ├── react.mjs
│       └── stories.mjs
│
├── packages/
│   ├── core/               → ghicons         (SVGs + registry)
│   └── react/              → @ghicons/react  (generated components)
│       └── src/props.ts      hand-written React contract
│
├── playground/             ← Vite dev app
├── .storybook/
├── .github/workflows/
├── docs/
└── ghicons_website/        ← separate git repository
```

### `svg/`

The canonical collection, at the root and owned by no package. Add and modify icons here and nowhere else.

### `tools/`

The pipeline. Stages 1–4 are framework-neutral; only `generators/` knows about a specific framework. Adding Vue means adding one emitter here, not a second pipeline.

### `packages/core/`

Published as `ghicons`. Optimised SVGs plus `registry.json`. Zero dependencies.

### `packages/react/`

Published as `@ghicons/react`. Everything in `src/icons/` and `src/index.ts` is generated; `src/props.ts` is hand-written and defines the React contract:

```ts
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  viewBox?: string;
}
```

That interface belongs to the React integration, not to the icon specification.

### `ghicons_website/`

The public icon browser. A separate application **with its own git repository**, nested in this directory but not tracked here. It consumes GHIcons as a published npm dependency, not a workspace link.

---

## ⚙️ The Pipeline

```text
   svg/*.svg + metadata/*.json
              ▼
      1. VALIDATE      enforce ICON-SPEC across the whole collection
              ▼
      2. OPTIMISE      SVGO; must not change geometry or meaning
              ▼
      3. NORMALISE     → { name, slug, category, viewBox, body, metadata }
              ▼
      4. REGISTRY      rebuild registry.json from scratch
              ▼
      5. GENERATE      per-target emitters: core + React today
              ▼
         packages/core/  (no compile)   packages/react/  →  tsc + vite  →  dist/
```

---

## 🎨 Working with Icons

Place the canonical SVG in the right category:

```text
svg/adinkra/Sankofa.svg
svg/general/GhanaCedi.svg
```

It must satisfy [ICON-SPEC.md](ICON-SPEC.md). The essentials:

- `viewBox="0 0 24 24"` exactly
- `fill="currentColor"` (or `none`); no other colour anywhere
- vector geometry only — no `<image>`, no base64
- no `<script>`, no `@import`, no remote references
- PascalCase filename, no numeric or `Icon` suffix

Then validate, generate, and look at it:

```bash
pnpm run validate
pnpm run generate
pnpm run dev
```

### Renaming and deleting

Both are **breaking changes** — generated identifiers and published asset paths derive from the filename.

```bash
git mv svg/adinkra/OldName.svg svg/adinkra/NewName.svg
pnpm run generate
```

Because generated indexes are rebuilt from source rather than appended to, a rename or deletion propagates cleanly. If you find a stale export surviving a regeneration, that is a bug in the generator — report it rather than deleting the entry by hand.

---

## 🔄 Generating Outputs

```bash
pnpm run generate            # everything below
pnpm run generate:core       # ghicons: SVG assets, registry.json, entry points
pnpm run generate:react      # @ghicons/react: components + barrel
pnpm run generate:stories    # Storybook stories
```

`tools/canonical.mjs` reads every SVG once, optimises it with SVGO and produces a framework-neutral object per icon — name, slug, category, viewBox, body. Each emitter consumes only that, so no emitter needs to know how an SVG is parsed.

Emitters adapt the canonical icon to their platform. The React emitter rewrites the root `<svg>` tag with prop-driven attributes and camelCases hyphenated SVG attributes (`fill-rule` → `fillRule`), which JSX requires and raw SVG does not.

Generation is **reproducible**: `pnpm run clean && pnpm run generate` produces byte-identical output. Indexes are rebuilt rather than appended to, so a renamed or deleted icon leaves nothing behind.

---

## 🖥️ The Playground

```bash
pnpm run dev
```

```text
index.html → playground/main.tsx → playground/App.tsx
```

A searchable, category-filtered browser over the whole collection, plus a docs page with copyable examples. Development-only; never published.

Use it for judging an icon in context — beside its neighbours, at several sizes, in both light and dark.

---

## 📚 Storybook

```bash
pnpm run storybook        # dev server on :6006
pnpm run build-storybook  # static build
```

Stories are generated, one per component, with Default, Large, Colored and SmallColored variants, and controls wired to `IconProps`. Because stories import from the package barrel, a missing export shows up immediately as a broken story.

Storybook is React integration tooling, not part of the canonical icon system.

---

## 🏗️ Building

```bash
pnpm run build        # validate → generate → compile every package
pnpm run build:react  # just the React bundle
```

Build tooling lives in the root package, so builds are orchestrated from the repository root rather than run inside each package. That keeps one dependency set and one lockfile, and lets package manifests declare only what their consumers need.

**`ghicons`** needs no compilation — generation writes the SVGs, `registry.json` and the entry points directly.

**`@ghicons/react`** runs `tsc` for declarations, then Vite library mode for the ESM and UMD bundles. `react`, `react-dom` and `react/jsx-runtime` are external.

Before publishing, check the packaging:

```bash
node tools/verify-packages.mjs
```

It verifies the two packages agree — every icon has both a registry entry and a component, declared files exist, no development file leaked into `dist/`, slugs are unique, versions match. A build can pass while the packaging is wrong.

---

## 🧪 Testing

```bash
pnpm test
pnpm test --watch
```

Vitest is configured. Test coverage is thin today and is a [v0.2 goal](wiki/Roadmap.md) — new tooling and generator work should arrive with tests.

The most valuable tests are the ones that protect pipeline invariants:

- every icon in `svg/` produces a registry entry and a component
- regeneration is byte-identical
- deleting an SVG removes its export
- every export renders without throwing

---

## 🎯 Linting

```bash
pnpm run lint
pnpm run lint --fix
```

ESLint with TypeScript, React Hooks, React Refresh and Storybook plugins. Lint runs in CI before every build; generated directories are excluded.

---

## ✅ Validation

```bash
pnpm run validate                       # whole collection
pnpm run validate svg/adinkra/New.svg   # one file
```

Validation is the enforceable form of [ICON-SPEC.md](ICON-SPEC.md). Run it before opening a PR — it catches everything CI would reject.

It checks the **entire collection**, not just what you changed. That is deliberate: checking only changed files is how 103 of 106 icons ended up with a hardcoded `fill='#fff'` without a single failing build.

---

## 🔁 CI/CD

| Workflow | Trigger | Does |
|---|---|---|
| `validate-svgs.yml` | Every PR | Validates the whole collection against the spec |
| `release.yml` | Push/PR to `master` | Lint → validate → generate → build; publishes on push |
| `dev-pre-release.yml` | Push to `dev` | Builds and publishes a GitHub pre-release |

Every workflow regenerates from source rather than trusting committed output, so a published package can never disagree with the SVG it came from.

Full detail: [Release Process](wiki/Release-Process.md).

---

## 🌐 Website Development

`ghicons_website/` has its own git repository, lockfile and dependencies.

```bash
cd ghicons_website
pnpm install
pnpm dev
```

It consumes GHIcons as a **published** npm dependency, so library changes reach it only after a release and a dependency bump. To test an unreleased change against it, use `pnpm link` or `pnpm pack` — and remember to undo that before committing.

Commit website changes in the website's own repository.

---

## 📦 Generated Files

Nothing generated is committed.

| Path | Generated by |
|---|---|
| `packages/core/svg/**` | `generate:core` |
| `packages/core/registry.json`, `index.*` | `generate:core` |
| `packages/react/src/icons/**` | `generate:react` |
| `packages/react/src/index.ts` | `generate:react` |
| `packages/react/stories/**` | `generate:stories` |
| `packages/react/dist/**` | `build:react` |

Consequences worth internalising:

- A fresh clone cannot build until you run `pnpm run generate`.
- Generated code never appears in a PR diff — review the **SVG** and the **generator**.
- Anything you hand-edit in those paths is destroyed on the next run.

---

## 🛠️ Common Tasks

**Add an icon**
```bash
cp MyIcon.svg svg/adinkra/GyeNyame.svg
pnpm run validate && pnpm run generate && pnpm run dev
```

**Check generation is reproducible**
```bash
pnpm run clean && pnpm run generate
```

**Fix an icon's artwork**
```bash
$EDITOR svg/adinkra/GyeNyame.svg
pnpm run validate && pnpm run generate
```

**Add a category** — create `svg/<category>/`. The pipeline finds it; no code change needed.

**Add metadata** — edit `metadata/`, then `pnpm run generate:core`. *(The metadata stage is not built yet — see the [Roadmap](wiki/Roadmap.md).)*

**Change the React props API** — edit `packages/react/src/props.ts` *and* `tools/generators/react.mjs`, then regenerate. They must stay in step.

**Check what would be published**
```bash
pnpm -C packages/core  pack --pack-destination /tmp
pnpm -C packages/react pack --pack-destination /tmp
tar tzf /tmp/ghicons-0.1.0.tgz
```

`pack` is not one of pnpm's recursive commands, so `--filter` fails with
`Unknown option: 'recursive'`. Use `-C`, and note that `--pack-destination`
resolves relative to `-C`, not to your working directory.

---

## 🧱 Changing the Icon System

Changes to the system itself — the specification, naming rules, registry schema, generated APIs, distribution formats — affect every icon and every consumer. They need more care than adding one icon.

1. State the problem.
2. State the proposed approach.
3. Assess backwards compatibility, and say plainly if it is breaking.
4. Update validation and generation together.
5. Update the affected documentation — [ICON-SPEC.md](ICON-SPEC.md) and [ARCHITECTURE.md](ARCHITECTURE.md) at minimum.
6. Regenerate everything and check the full diff.
7. Build and test every package.

A specification change that validation does not enforce is a comment, not a rule.

---

## 🩺 Troubleshooting

**`pnpm run build` fails on a missing module in `src/icons/`**
You have not generated. Run `pnpm run generate`.

**An icon renders cropped, off-centre, or blank**
Its `viewBox` is not `0 0 24 24`. Emitters substitute that default, so an off-canvas icon is silently clipped to that window instead of failing loudly — and if none of its geometry falls inside, it renders as nothing. Fix the SVG; `pnpm run validate` catches it.

**An icon renders invisible, or white on white**
A hardcoded `fill`. Replace it with `currentColor`. `pnpm run validate` catches this.

**An export exists for an icon I deleted**
The index was not rebuilt. Run `pnpm run clean && pnpm run generate`. If it survives that, it is a generator bug.

**Validation fails on an icon I did not touch**
Expected — validation covers the whole collection. Fix it or flag it; do not narrow the validator.

**Storybook shows no stories**
Stories are generated. Run `pnpm run generate:stories`.

**React logs "Invalid DOM property" for an icon**
The emitter camelCases hyphenated SVG attributes. If a new one slips through, add it to `toJsxAttributes` in `tools/generators/react.mjs` — do not hand-edit the component.

**Changes are not showing up on the website**
The website consumes the published package. Link it locally or release first.

**pnpm complains about the workspace**
Run pnpm from the repository root, not from inside a package, and not with npm or yarn.

---

## 📚 Related Documentation

- [ICON-SPEC.md](ICON-SPEC.md) — what makes a valid GHIcon
- [ARCHITECTURE.md](ARCHITECTURE.md) — how the system is structured
- [CONTRIBUTING.md](CONTRIBUTING.md) — the contribution process
- [Release Process](wiki/Release-Process.md) — versioning and publishing
- [SVG Style Guide](wiki/SVG-Style-Guide.md) — drawing and cleaning icons
- [Roadmap](wiki/Roadmap.md) — what is planned
