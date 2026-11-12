# Roadmap

GHIcons is in pre-1.0 development, growing from a React icon library into a framework-independent collection of Ghanaian symbols.

| Phase | Goal | Status |
|---|---|---|
| `v0.1` | Framework-agnostic core: raw SVG + registry, monorepo, collection on-spec | ✅ Shipped |
| `v0.2` | Staged pipeline, authored metadata, registry-driven tooling | 🚧 Cultural review open |
| `v1.0` | Stable icon contract, registry schema and React API | Next |
| `v1.x` | More symbols; search, downloads, CDN; multicolour | Discovery mostly shipped |
| `v2.x` | Web Components, Vue, Svelte, Flutter; API and tooling | Planned |
| `v3.x` | Broader African cultural coverage | Exploratory |

**Most useful contribution right now:** cultural review of the icon meanings. All 106 are sourced (Willis, Arthur, Rattray, institutions) but none has been checked by someone who knows the symbols first-hand. See the [Cultural Guidelines](Cultural-Guidelines).

## Principles

- One canonical SVG source; never a separately maintained per-framework copy.
- Prove the abstraction with one non-React consumer before building many adapters.
- Accuracy over icon count.

## ✅ v0.1 — Framework-agnostic core

- [x] pnpm monorepo; `ghicons` is the core, React moved to `@ghicons/react`
- [x] Optimised SVGs at stable paths, plus `registry.json`
- [x] Collection brought on-spec: 103 hardcoded fills fixed, `GhanaCedi` re-scoped and renamed, `Sankofa1` → `SankofaHeart`
- [x] Whole-collection validation in CI
- [x] LICENSE and package entry-point fixes

## 🚧 v0.2 — Pipeline and metadata

- [x] Staged pipeline with a canonical icon representation
- [x] Rebuilt (not appended) exports; clean renames and deletions; reproducible output
- [x] Authored metadata in `metadata/`, validated and merged into the registry
- [x] Meanings, keywords and references for all 106 icons; aliases for 68
- [x] Playground and website read the registry
- [ ] Cultural review of the authored meanings
- [ ] React: `aria-label`/`title` and `data-testid` support, full Storybook coverage, tests, verified tree-shaking

## v1.0 — Stable GHIcons

1.0 means the icon contract, registry format and React API are stable enough to depend on.

- [ ] Stable spec, naming, categories and registry schema
- [ ] Stable, fully typed and tested React API
- [ ] The most widely recognised Adinkra symbols, reviewed for consistency, names and descriptions
- [ ] Complete public API reference

## v1.x — Collection and discovery

**New symbols:** Coat of Arms, Independence Arch and other state symbols; Cedi variants and trade motifs; the Golden Stool and ceremonial objects; Kente-inspired motifs; marks of Ghanaian institutions and movements. Ghanaian brands come last, and only with a clear permission and removal policy. Many of these need multicolour support.

- [x] Website search, category filters, per-icon pages, meanings, copy/download, usage snippets, related icons
- [ ] Category packs and ZIPs
- [ ] Project-owned versioned CDN (unpkg serves the package today) and a manifest endpoint
- [ ] Multicolour/duotone support
- [ ] Icon variants (filled/outline/weight)

## v2.x — More frameworks

Web Components first (covering plain HTML, Django, Laravel, WordPress, Astro and Angular), then Vue, Svelte and Flutter, driven by demand and maintainer availability. Later: a read-only icon API, CLI, pickers, Figma and editor integrations.

## v3.x — Broader African scope

Possibly Akan diaspora and shared West African symbols, only if accurate research and community support exist. Not a generic "African icon pack".

## Suggestions

Open an [issue](https://github.com/ProfessorBlackman/ghicons/issues) or [discussion](https://github.com/ProfessorBlackman/ghicons/discussions). Feedback on which frameworks and categories to prioritise is especially useful.
