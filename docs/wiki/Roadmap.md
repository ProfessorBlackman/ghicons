# Roadmap

This page outlines where GHIcons is heading — what's planned, what's in progress, and the milestones that mark the project's growth. It is a living document and will be updated as the project evolves.

---

## Current Status

GHIcons is in **active early development** (pre-1.0). The library already contains over 100 Adinkra symbols and is published on npm. The immediate focus is on:

- Building out the contribution infrastructure (workflows, templates, community)
- Expanding the icon set
- Reaching a stable enough API to warrant a `1.0.0` release

---

## Milestones

### 🔲 v0.x — Foundation (Current)

The groundwork phase. The library is usable but the API and icon set are still evolving.

- [x] Initial icon set (100+ Adinkra symbols)
- [x] React component generation via SVGR
- [x] TypeScript support
- [x] Storybook integration
- [x] Published to npm
- [ ] Contribution workflows (CI, issue templates, PR templates)
- [ ] GitHub Discussions community
- [ ] `aria-label` and `title` prop support for accessibility
- [ ] `data-testid` prop support
- [ ] Full Storybook coverage for all icons
- [ ] All icons exported from main entry point

---

### 🔲 v1.0 — Stable Release

The first stable release. API is locked. Ready for production use with confidence.

**Goals:**
- Complete set of the most widely recognised Adinkra symbols
- Stable, documented props API (`size`, `color`, `className`, `style`, `aria-label`, `title`, `data-testid`)
- Full TypeScript types
- Every icon has a Storybook story
- Comprehensive README and wiki
- Reliable CI/CD pipeline

---

### 🔲 v1.x — Growing the Library

Post-1.0, the focus shifts to expanding coverage and improving DX.

**Planned:**
- Ghanaian national symbols (Black Star, Coat of Arms, Independence Arch, Golden Stool)
- Currency and trade icons (Ghana Cedis variants, Cocoa pod)
- Kente pattern motifs as icon tiles
- Okyeame staff and other ceremonial icons
- Icon search and filtering on the project website
- Downloadable SVG packs by category
- Bundle size optimisation (tree-shaking verification)

---

### 🔲 v2.x — Multi-Framework Support (Future)

GHIcons will not stay React-only. The goal is to bring Ghanaian symbols to developers regardless of the framework or platform they work on.

**Planned libraries:**
- **Flutter** — a Dart package exposing GHIcons as Flutter `Widget`s
- **Vue** — a Vue 3 component library
- **Svelte** — a Svelte component package
- **Web Components** — framework-agnostic custom elements usable in any HTML project

Each framework library will be published as its own package (e.g. `ghicons-flutter`, `ghicons-vue`) but sourced from the same canonical SVG files in this repository, ensuring consistency across all platforms.

---

### 🔲 CDN & Raw SVG Access (Future)

Not every developer wants to install a package. A CDN will make GHIcons accessible to anyone — no npm, no build step required.

**Planned:**
- A hosted CDN endpoint to serve individual SVG icons by name:
  ```html
  <img src="https://cdn.ghicons.dev/icons/GyeNyame.svg" />
  ```
- Direct `<script>` tag usage for quick prototyping
- A REST-style API to query icons by name, category, or tag
- Downloadable icon packs (zip bundles by category)

The project website will be expanded to support browsing and downloading individual SVGs directly.

---

### 🔲 v3.x — Broader African Scope (Long-term Vision)

A longer-term vision to expand beyond Ghana while keeping Ghanaian symbols as the heart of the project.

**Being considered:**
- West African symbols with shared cultural heritage (Akan diaspora symbols)
- Symbols from other African countries, contributed and maintained by their own communities
- A categorisation system (e.g. `Adinkra`, `National`, `Ceremonial`, `Regional`, `West African`)
- Multi-weight variants (outline vs filled) for select icons

> This milestone is exploratory. Community feedback will shape whether and how it happens.

---

## The Bigger Picture

GHIcons started as a React library, but the vision is bigger than that. The canonical source of truth is always the SVG files in this repository — every framework library, CDN endpoint, and icon pack will be generated from the same set of vetted, accurate SVGs. This means contributing an icon once makes it available everywhere GHIcons reaches.

The long-term goal is for GHIcons to be the definitive home for Ghanaian and African cultural symbols in software — wherever developers are building, whatever tools they use.

---

## What Influences the Roadmap

The roadmap is shaped by:

- **Community requests** — symbols requested in [💡 Icon Ideas](../discussions/categories/icon-ideas) and [Icon Request issues](../issues?q=label%3Aicon-request) directly inform what gets added
- **Contributor availability** — some milestones depend on volunteers stepping up for icon design, code work, or framework expertise
- **Cultural research** — symbols are only added when they can be represented accurately
- **Framework demand** — community signal around Flutter, Vue, Svelte, and other platforms will determine the order framework libraries are built

If there is a symbol, framework, or feature you want to see, the best way to make it happen is to open a request, contribute it yourself, or help someone else do it.

---

## Suggest Something

Have an idea for the roadmap? Start a conversation in [💡 Icon Ideas](../discussions/categories/icon-ideas) or [💬 General](../discussions/categories/general).
