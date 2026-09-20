# GHIcons Roadmap

Where GHIcons is heading, in what order, and why.

GHIcons began as a React icon library. It is becoming a framework-independent icon system for Ghanaian cultural symbols.

> **Contribute an icon once. Make it available everywhere GHIcons is supported.**

---

## 📋 Table of Contents

- [Current Status](#-current-status)
- [Roadmap Principles](#-roadmap-principles)
- [v0.1 — The Framework-Agnostic Core](#-v01--the-framework-agnostic-core)
- [v0.2 — Pipeline & Metadata](#-v02--pipeline--metadata)
- [v1.0 — Stable GHIcons](#-v10--stable-ghicons)
- [v1.x — Collection & Discovery](#-v1x--collection--discovery)
- [v2.x — Ecosystem Expansion](#-v2x--ecosystem-expansion)
- [v3.x — Broader African Scope](#-v3x--broader-african-scope)
- [Long-Term Direction](#-long-term-direction)
- [What Influences the Roadmap](#-what-influences-the-roadmap)
- [Suggest Something](#-suggest-something)

---

## 🚧 Current Status

GHIcons is in active pre-1.0 development.

**Shipped:**

- 100+ Adinkra symbols plus general and national icons
- React component generation with full TypeScript types
- Storybook integration
- SVG validation in CI
- npm distribution and automated release workflows
- A public icon browser

**Built, not yet published — the framework-agnostic core.** The monorepo, both packages, the registry and the pipeline are done and verified; publishing waits on the npm organisation. See [v0.1](#-v01--the-framework-agnostic-core).

### A note on sequencing

Earlier versions of this roadmap placed raw SVG distribution at v1.x and multi-framework support at v2.x, behind a stable 1.0.

**That order has changed.** Framework-agnostic distribution moved to the front. The reasoning:

- The architecture already claims the SVG collection is canonical. Shipping only a React package made that claim unverifiable — nothing outside React could consume the collection, so nothing tested whether it was genuinely framework-independent.
- A raw-SVG package and a registry are the cheapest possible proof, and they unblock the CDN, downloads, website search and every future adapter at once.
- Bringing the collection up to spec was a prerequisite either way. 103 of 106 icons carried a hardcoded `fill='#fff'` that was invisible in React and fatal for raw SVG — the kind of defect that only surfaces once something other than React consumes the source.

Everything else keeps its relative order. The stability work that used to define 1.0 still defines 1.0; it now happens on top of an already-agnostic foundation rather than before one.

---

## 🧭 Roadmap Principles

**One canonical icon source.** Every integration derives from the same vetted SVG collection. There is never an independently maintained React, Vue or Flutter version of an icon.

**Framework independence at the architecture level.** This does not mean supporting every framework immediately. It means the core is not coupled to any of them.

**Prove the abstraction before multiplying it.** One non-React consumer proves the collection is genuinely portable. Four half-maintained adapters prove nothing.

**Cultural accuracy over icon count.** These are cultural symbols, not decorative shapes. A smaller accurate set beats a larger questionable one.

**Automation over duplication.** Adding an icon once should make it available to every supported target without manual copies.

---

## 🔲 v0.1 — The Framework-Agnostic Core

**The current milestone.** GHIcons becomes usable without React.

### Packaging

- [x] Restructure into a pnpm monorepo
- [x] `ghicons` becomes the framework-agnostic core — optimised SVGs + registry, zero dependencies
- [x] React moves to `@ghicons/react`
- [ ] Publish `@ghicons/*` under the `ghicons` npm organisation — built and verified, awaiting the org
- [x] Document the breaking change and the upgrade path

### Raw SVG distribution

- [x] Ship optimised, spec-conformant SVGs in the core package
- [x] Predictable, stable asset paths (`svg/<category>/<Name>.svg`)
- [x] Document plain-HTML and non-JavaScript usage

### The registry

- [x] Generate `registry.json` with the derived fields — name, slug, category, viewBox, file
- [x] Ship it inside the core package
- [x] Define the schema in the icon specification

### Bring the collection up to spec

- [x] Normalise the 103 icons carrying a hardcoded `fill='#fff'` to `currentColor`
- [x] Re-scope `GhanaCedisIcon` from `0 0 345 511.44` to the 24×24 canvas — it rendered cropped in every release
- [x] Resolve `Sankofa` / `Sankofa1` naming — two forms of the symbol, so `Sankofa1` became `SankofaHeart`
- [x] Rename `GhanaCedisIcon` → `GhanaCedi`
- [x] Validate the **entire** collection in CI, not only changed files (`pnpm run validate`)

### Repository hygiene

- [x] Add the missing `LICENSE` file
- [x] Fix the `types` entry field (pointed at `.d.js`)
- [x] Point `main` at the bundle rather than raw `tsc` output
- [x] Ensure build output contains only intended package artifacts

---

## 🔲 v0.2 — Pipeline & Metadata

With the core shipped, make the machinery behind it match the architecture.

### Pipeline

- [x] Separate the stages: validate → optimise → normalise → registry → generate
- [x] Introduce a reusable canonical icon representation
- [x] Rebuild barrel exports from source instead of appending to them
- [x] Handle icon deletion and renames cleanly
- [x] Guarantee generated output is reproducible from source
- [x] Add local validation tooling that mirrors CI exactly
- [x] Document the generator contracts
- [x] Remove the placeholder Cloudinary script and the unused SVGR config

### Metadata

- [ ] Decide which fields are generated and which are authored
- [ ] Author meanings and keywords for the collection, with cultural review
- [ ] Add aliases and alternate names
- [ ] Validate metadata alongside SVGs
- [ ] Make the playground read the registry instead of its hardcoded category map
- [ ] Make the website consume the registry instead of parallel metadata

### React integration

- [ ] `aria-label` and `title` support
- [ ] `data-testid` support
- [ ] Storybook coverage for every icon
- [ ] Automated tests
- [ ] Verified tree-shaking

---

## 🔲 v1.0 — Stable GHIcons

1.0 is not "more icons". It means the **icon contract, the registry format and the React API are stable enough to depend on**.

### Icon system

- [ ] Stable icon specification
- [ ] Stable naming and category conventions
- [ ] Stable registry schema
- [ ] Reliable validation with no known off-spec icons
- [ ] Reproducible generation, no stale outputs
- [ ] Documented migration policy for future specification changes

### React

- [ ] Stable documented props API — `size`, `color`, `className`, `style`, `viewBox`, `aria-label`, `title`, `data-testid`, standard SVG props
- [ ] Full TypeScript types
- [ ] Full Storybook coverage
- [ ] Integration tests

### Collection

- [ ] Complete the most widely recognised Adinkra symbols
- [ ] Review the whole collection for visual consistency
- [ ] Verify every icon name
- [ ] Add reliable symbol descriptions
- [ ] Correct or remove questionable representations before freezing them

### Documentation

- [x] Architecture documentation
- [x] Icon specification
- [x] Contributor guide
- [x] Development guide
- [x] Release process
- [x] SVG style guide
- [ ] Complete public API reference

After 1.0, breaking the React API or the icon contract requires a major version.

---

## 🔲 v1.x — Collection & Discovery

The system is stable; now make the collection bigger and easier to find things in.

### Expand the collection

**National symbols** — Coat of Arms, Independence Arch, national monuments, selected state symbols.
*Black Star and Ghana Flag already ship.*

**Currency and trade** — Cedi variants, cocoa motifs, market and trade symbols.

**Ceremonial and cultural** — Golden Stool, Okyeame staff, traditional ceremonial objects.

**Textile and pattern** — selected Kente-inspired motifs, tileable patterns where appropriate.

All subject to the icon specification and cultural review. Several of these are inherently multicolour, so they depend on the multicolour extension below.

### Website and discovery

- [ ] Search by name and keyword
- [ ] Filter by category
- [ ] Individual icon pages
- [ ] Display meanings and cultural context
- [ ] Copy SVG / download SVG
- [ ] Copy framework usage examples
- [ ] Related icons
- [ ] Category packs and a full icon pack

### Distribution

- [ ] Per-icon downloads
- [ ] Category ZIPs
- [ ] CDN with versioned, immutable, cache-friendly URLs
- [ ] A registry/manifest endpoint

```html
<img src="https://cdn.ghicons.dev/0.1/icons/gye-nyame.svg">
```

### Specification extensions

- [ ] Multicolour and duotone support with a declared palette and a registry flag — required before the coat of arms and Kente motifs can be represented faithfully
- [ ] Icon variants (filled / outline / weight)

---

## 🔲 v2.x — Ecosystem Expansion

Additional framework adapters become official products. The architecture supports them from v0.1; this is when they get built and maintained.

Each consumes the same canonical source and registry. None contains its own copy of the artwork.

**Web Components** — the highest-leverage target, since one implementation covers plain HTML, Django, Laravel, WordPress, Astro and Angular:

```html
<gh-icon name="gye-nyame" size="32" color="gold"></gh-icon>
```

**Vue** — `@ghicons/vue`, `<GyeNyame :size="32" />`

**Svelte** — `@ghicons/svelte`, `<GyeNyame size={32} />`

**Flutter** — a Dart representation on pub.dev, `GyeNyame(size: 32)`

### Release strategy

Integrations do not all ship at once. Order is driven by community demand, contributor expertise, maintenance cost and implementation quality. An integration becomes official only when it can be maintained reliably — a small number of good adapters beats a large set of neglected ones.

### Developer tooling

Once the registry and public APIs are stable: a read-only icon API (`GET /icons?category=adinkra`), CLI search and download, icon pickers, Figma integration, editor extensions.

---

## 🔲 v3.x — Broader African Scope

Exploratory. Cultural symbols beyond Ghana, with Ghanaian symbols remaining at the heart of the project.

Possible directions: Akan diaspora symbols, shared West African symbols, regional collections, community-maintained national collections.

This only happens when the project can support accurate research and appropriate community contribution. The goal is **not** to become a generic "African icon pack" — cultural provenance and accuracy stay central.

---

## 🧭 Long-Term Direction

```text
                    GHIcons
                       │
              Canonical SVG Set
                       │
              Icon Specification
                       │
                 Icon Registry
                       │
                Generation Layer
                       │
   ┌──────────┬────────┼────────┬───────────┐
   ▼          ▼        ▼        ▼           ▼
Raw SVG     React     Vue    Svelte   Web Components
   │                                        │
   ▼                                        ▼
  CDN ──────────────► API              Flutter
```

React remains important. It is one integration among several.

---

## 📊 Milestone Summary

| Phase | Primary goal |
|---|---|
| `v0.1` | Framework-agnostic core: raw SVG + registry, monorepo, collection on-spec |
| `v0.2` | Staged pipeline, authored metadata, registry-driven tooling |
| `v1.0` | Stable icon contract, registry schema and React API |
| `v1.x` | Expand the collection; search, downloads, CDN; multicolour support |
| `v2.x` | Web Components, Vue, Svelte, Flutter; API and developer tooling |
| `v3.x` | Carefully explore broader African cultural coverage |

---

## 🧠 What Influences the Roadmap

**Community requests** — what developers actually ask for, for both symbols and integrations.

**Contributor availability** — some integrations move faster when someone with that expertise shows up.

**Cultural research** — an icon is not added because an image of it exists online. The project needs reasonable confidence that the representation and description are accurate.

**Maintenance cost** — every official package is something the project must keep alive.

**Technical dependencies** — some work unlocks several features at once, so it comes first:

```text
Canonical pipeline → framework generators → Vue / Svelte / Flutter
Icon registry      → website search → CDN / API → third-party tooling
```

---

## 💬 Suggest Something

New symbols, corrections, cultural research, framework integrations, tooling ideas, documentation and accessibility improvements are all welcome.

Use [GitHub Issues](https://github.com/ProfessorBlackman/ghicons/issues) or [Discussions](https://github.com/ProfessorBlackman/ghicons/discussions). Feedback is especially useful for deciding which integrations and categories to prioritise.

---

## 🇬🇭 The Bigger Picture

GHIcons started as a way to use Ghanaian symbols in React projects. It is growing into something broader:

> **A reliable, open, developer-friendly home for Ghanaian cultural symbols in software.**

The framework a developer uses should not determine whether Ghanaian visual language is available to them.

One canonical symbol. One specification. One contribution. Available everywhere.
