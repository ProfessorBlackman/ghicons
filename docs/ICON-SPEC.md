# GHIcons Icon Specification

This document defines what makes a valid GHIcon.

The specification is **framework-independent**. It describes the canonical icon asset itself, not how that icon is exposed through React, Vue, Svelte, Flutter, Web Components, or anything else.

Framework integrations consume icons that conform to this specification. They must not redefine the underlying icon.

> **Status:** `v1-draft`. The rules in [Validation](#-validation) are enforced in CI today. The [registry schema](#-the-icon-registry) ships with the `ghicons` core package and is not frozen until GHIcons 1.0.

---

## 📋 Table of Contents

- [Purpose](#-purpose)
- [Core Principles](#-core-principles)
- [SVG Requirements](#-svg-requirements)
- [Canvas and ViewBox](#-canvas-and-viewbox)
- [Colour](#-colour)
- [Geometry and Scaling](#-geometry-and-scaling)
- [File Naming](#-file-naming)
- [Categories](#-categories)
- [The Icon Registry](#-the-icon-registry)
- [Accessibility](#-accessibility)
- [SVG Safety](#-svg-safety)
- [Optimisation](#-optimisation)
- [Framework Independence](#-framework-independence)
- [Validation](#-validation)
- [Adding or Modifying an Icon](#-adding-or-modifying-an-icon)
- [Known Exceptions](#-known-exceptions)
- [Versioning Implications](#-versioning-implications)
- [Future Extensions](#-future-extensions)

---

## 🎯 Purpose

GHIcons is a collection of Ghanaian cultural symbols intended for use across software projects and platforms.

This specification exists so that every icon:

- follows the same technical constraints
- behaves predictably for developers
- can be generated for multiple frameworks
- can be distributed as a raw SVG asset
- can be optimised consistently
- remains visually and technically portable

An icon that conforms to this specification can serve as the canonical source for every GHIcons integration.

---

## 🧭 Core Principles

### 1. SVG is the canonical asset

Every GHIcon originates from an SVG file stored at:

```text
svg/<category>/<IconName>.svg
```

`svg/` sits at the repository root and belongs to no single package. Every package consumes it.

Generated React components, future framework components, published assets, the registry, documentation, and CDN output are all **derived** from this source.

Generated files must never become a source of truth.

### 2. Icons are framework-independent

A canonical SVG must not carry assumptions about React, Vue, Svelte, Flutter, Web Components, framework-specific CSS, or framework-specific JavaScript.

Adapting an icon to a platform is the integration's job.

### 3. Icons use a consistent canvas

Every GHIcon is drawn on a `24 × 24` coordinate system with `viewBox="0 0 24 24"`.

### 4. Icons are monochrome and inherit colour

GHIcons use `currentColor`. Source SVGs must not bake colour into icon geometry.

---

## 📐 SVG Requirements

Every canonical GHIcon must be a valid SVG document with a single root `<svg>` element.

A minimal valid icon:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="…" />
</svg>
```

### Required

- Valid, parseable SVG markup
- A single `<svg>` root element
- `viewBox="0 0 24 24"`
- `fill="currentColor"` on the root (or `none` where the geometry is stroked)
- Vector geometry only
- No embedded raster assets
- No scripts
- No external imports or remote references

### Discouraged

Editor metadata (`<metadata>`, `<sodipodi:*>`, `<desc>`), redundant groups and wrapper transforms, empty elements, and anything else that does not contribute to the artwork.

Contributors do not need to hand-minify. The pipeline optimises with SVGO.

---

## 📐 Canvas and ViewBox

```text
width:   24
height:  24
viewBox: 0 0 24 24
```

`width` and `height` are advisory — every integration overrides them — but include them so the raw file renders sensibly on its own.

**`viewBox` must be exactly `0 0 24 24`.** Any other value is invalid.

This matters more than it looks. A generated component substitutes its own `viewBox` default of `0 0 24 24`, so an icon drawn on a different canvas is silently clipped to that window rather than failing loudly. Depending on where its geometry sits, the result can be a crop — or nothing at all. `GhanaCedisIcon` shipped **blank** for the whole life of the `0.0.x` line for exactly this reason.

### Why 24 × 24?

A shared coordinate system makes icons predictable across the collection and lets the same source render at 16, 20, 24, 32, 48 or 64 pixels without a second asset. It is also what Lucide, Heroicons and most of the ecosystem use, so GHIcons sits alongside them without visual adjustment.

---

## 🎨 Colour

### The rule

GHIcons are **monochrome**. Filled geometry uses:

```xml
fill="currentColor"
```

Stroked geometry uses:

```xml
fill="none" stroke="currentColor"
```

No other colour value is permitted anywhere in a source icon — not on the root, not on a `<path>`, not in a `<style>` block.

| ❌ Not allowed | ✅ Correct |
|---|---|
| `fill="#000000"` | `fill="currentColor"` |
| `fill="#fff"` | `fill="currentColor"` |
| `fill="black"` | `fill="currentColor"` |
| `fill="#FCD116"` | `fill="currentColor"` |
| `fill="rgb(0,0,0)"` | `fill="currentColor"` |

### Why

`currentColor` means an icon behaves like text and inherits its surroundings. The same asset then works everywhere without a per-platform colour API:

```css
.icon { color: #b8860b; }
```

```tsx
<GyeNyame color="gold" />
```

```html
<img src="gye-nyame.svg" alt="Gye Nyame">
```

A hardcoded colour silently defeats all of this. A white `fill` in particular is invisible in the React integration — the generator discards the root tag — and then renders white-on-white the moment the same file ships as a raw asset.

### Inherently multicolour symbols

Some symbols are multicolour in real life: the national flag, the coat of arms, Kente motifs.

**Today, those ship as monochrome silhouettes.** `GhanaFlag` is the reference treatment — stripes and star as shapes, all `currentColor`.

Multicolour support is a [future extension](#-future-extensions), not a current allowance. Do not introduce palette colours into a source icon ahead of that work.

---

## 📏 Geometry and Scaling

Icons must stay legible small and hold their form large.

Design guidance:

- Use the canvas. An icon marooned in whitespace reads as smaller than its neighbours.
- Leave roughly 1–2px of breathing room at the edges; artwork at the boundary can clip.
- Avoid hairline geometry that disappears at 16px.
- Keep proportions consistent with the rest of the collection.
- Prefer fill over stroke. Where strokes are genuinely needed, `stroke-width` of `1.5` or `2` reads cleanly at 24px.

The specification does not mandate a universal stroke width. Stroked geometry should be drawn deliberately rather than produced by an automatic conversion.

See the [SVG Style Guide](wiki/SVG-Style-Guide.md) for the full drawing and cleanup walkthrough.

---

## 🏷️ File Naming

Source filenames are **PascalCase** and determine the generated identifier in every integration.

✅ `GyeNyame.svg`, `Sankofa.svg`, `Dwennimmen.svg`
❌ `gye-nyame.svg`, `gye_nyame.svg`, `gye nyame.svg`, `gyeNyame.svg`

So:

```text
svg/adinkra/GyeNyame.svg
    → GyeNyame.tsx
    → import { GyeNyame } from "@ghicons/react"
    → slug "gye-nyame"
    → ghicons/svg/adinkra/GyeNyame.svg
```

### Naming rules

A name should:

- use the recognised name of the symbol where one exists
- be descriptive and stable
- avoid abbreviations
- be a valid identifier in every target language

A name must **not**:

- carry a numeric disambiguator (`Sankofa1`) — name the symbol, do not number it. Two genuinely different symbols get two descriptive names; two forms of one symbol are [variants](#-future-extensions), which the specification does not model yet
- carry a redundant `Icon` suffix (`GhanaCedisIcon`) — every entry in the collection is an icon

Renaming a published icon is a **breaking change**. See [Known Exceptions](#-known-exceptions) for the names currently violating these rules.

---

## 🗂️ Categories

Categories are directories:

```text
svg/
├── adinkra/
├── general/
└── national/
```

The directory name is the canonical category identifier, and it propagates into the registry, the published asset paths, and the website's filtering.

A category represents a meaningful grouping, not a temporary implementation detail. Adding one is just creating a directory — the pipeline discovers it, and no generator change is required:

```text
svg/ceremonial/   ← picked up automatically
```

---

## 🗃️ The Icon Registry

The SVG is authoritative for the **artwork**. Everything else a tool needs to know about an icon lives in the registry — a generated, machine-readable index published as part of the `ghicons` core package.

```json
{
  "name": "GyeNyame",
  "slug": "gye-nyame",
  "category": "adinkra",
  "viewBox": "0 0 24 24",
  "file": "svg/adinkra/GyeNyame.svg",
  "meaning": "Except God — the supremacy of God",
  "keywords": ["god", "supremacy", "faith", "omnipotence"]
}
```

### Generated vs. authored fields

| Field | Source | Required |
|---|---|---|
| `name` | Derived from the filename | ✅ |
| `slug` | Derived from `name` (kebab-case) | ✅ |
| `category` | Derived from the directory | ✅ |
| `viewBox` | Read from the SVG | ✅ |
| `file` | Path within the published package | ✅ |
| `meaning` | Human-authored, culturally researched | Optional |
| `keywords` | Human-authored | Optional |
| `aliases` | Human-authored | Optional |
| `references` | Human-authored source citations | Optional |

Everything required is derived automatically, so a contributor adding an SVG gets a valid registry entry for free. Authored fields are additive and can arrive later.

Authored metadata lives beside the icon, never inside the generated index — the index is rebuilt from scratch on every run and hand edits to it are lost.

### Cultural metadata

`meaning` and `references` describe real cultural symbols. They must come from reliable research, not invention. Where an interpretation is contested or uncertain, say so rather than presenting one reading as settled fact. See [Cultural Guidelines](wiki/Cultural-Guidelines.md).

### What the registry must not become

The registry describes icons. It must never hold a second, independently editable copy of the artwork.

---

## ♿ Accessibility

The canonical SVG cannot know whether a given usage is decorative or meaningful — that depends on the interface using it.

So the specification requires that **integrations expose a way to supply an accessible name**, and leaves the choice to the consumer:

```tsx
// meaningful
<GyeNyame role="img" aria-label="Gye Nyame symbol" />

// decorative, adjacent to visible text
<button><GyeNyame aria-hidden="true" /> Learn more</button>
```

Source SVGs should not hardcode `aria-hidden`, `role`, or a `<title>` — that decides the question on the consumer's behalf.

---

## 🔒 SVG Safety

Canonical SVGs must not contain executable or externally-loaded content.

Prohibited:

- `<script>` elements
- `@import` in `<style>` blocks
- `<image>` elements and `data:` URIs
- Base64-encoded payloads
- Remote references in `href`, `fill`, or `stroke` (e.g. `fill="url(http://…)"`)

These rules exist because GHIcons are **inlined** into consuming applications. An inlined SVG runs in the host page's origin, so anything executable in a source file becomes the consumer's security problem.

---

## 🗜️ Optimisation

Contributors supply clean, readable SVGs. The pipeline optimises them with SVGO before generating any output.

Optimisation may remove metadata, simplify structure, reduce path precision, and drop redundant attributes.

**Optimisation must never change how an icon looks or what it means.** A visual diff that appears after optimisation is a bug in the pipeline configuration, not an acceptable cost.

---

## 🔌 Framework Independence

One canonical icon, many surfaces:

```tsx
<GyeNyame size={32} />                          {/* React */}
```
```vue
<GyeNyame :size="32" />                         <!-- Vue -->
```
```svelte
<GyeNyame size={32} />                          <!-- Svelte -->
```
```html
<gh-icon name="gye-nyame" size="32"></gh-icon>  <!-- Web Components -->
<img src="gye-nyame.svg" alt="Gye Nyame">       <!-- Raw SVG -->
```

Raw SVG and React exist today. The rest are planned — see the [Roadmap](wiki/Roadmap.md). The requirement is that whenever one of them ships, it represents the same canonical icon.

---

## 🔍 Validation

Every icon must pass validation before it enters the collection.

| Check | Requirement |
|---|---|
| Parseable | Valid XML with a single `<svg>` root |
| `viewBox` | Exactly `0 0 24 24` |
| Colour | No fill or stroke value other than `currentColor` or `none` |
| Raster | No `<image>` elements |
| Base64 | No `data:` payloads |
| Scripts | No `<script>` elements |
| Imports | No `@import` or remote references |
| Filename | PascalCase, no numeric suffix, no `Icon` suffix |

Validation runs two ways:

- **Locally**, so contributors get the answer before opening a PR
- **In CI**, across the **entire collection** on every run — not only changed files

The whole-collection sweep matters: validating only changed files is how 103 of 106 icons drifted to a hardcoded `fill='#fff'` without anyone noticing.

These checks are not style preferences. Each one protects an assumption the pipeline makes, and the table above should be read as the enforceable form of this specification.

---

## ➕ Adding or Modifying an Icon

### Adding

1. **Choose the category** — an existing directory under `svg/`, or a new one.
2. **Prepare the SVG** to this specification: `0 0 24 24`, `currentColor`, vector only, no scripts.
3. **Name the file** in PascalCase.
4. **Validate** locally.
5. **Generate** the outputs and confirm the icon appears.
6. **Review**: correct proportions, correct colour inheritance, legible at 16px, not clipped, consistent beside its neighbours.

Never hand-edit a generated component.

### Modifying

1. Edit the canonical SVG.
2. Validate.
3. Regenerate.
4. Review the visual result.
5. Update registry metadata if the change affects documented information.
6. Note it in the release.

A geometry correction is a patch. A rename or an API change is breaking.

### What contributors must not do

- Edit generated components instead of the SVG
- Add framework-specific code to a canonical SVG
- Hardcode colours
- Embed raster content or scripts
- Keep a separate SVG per framework
- Rename a published icon without treating it as breaking

If a framework needs special behaviour, it belongs in that framework's integration.

---

## ⚠️ Known Exceptions

Icons in the collection that do not currently satisfy this specification, and what happens to them.

**There are currently no known exceptions.** Every icon in the collection satisfies this specification.

Exceptions are recorded in `tools/validate.mjs` as well as here, so they report as warnings rather than silently passing — and any *new* violation of the same rule still fails the build. Removing an entry from that list is the last step of actually fixing the icon.

Resolved in the move to the framework-agnostic core, while the package boundary was already changing and renames cost least:

- `GhanaCedisIcon` was drawn on a `0 0 345 511.44` canvas and rendered **blank** in every published release, because the generator substitutes a `0 0 24 24` default and that window contains none of the artwork. Re-scoped to the standard canvas and renamed to `GhanaCedi`.
- 103 of 106 icons carried a hardcoded `fill='#fff'`. Normalised to `currentColor`.
- `Sankofa1` was the heart form of Sankofa carrying a numeric disambiguator. Renamed to `SankofaHeart`.

---

## 📦 Versioning Implications

The icon specification and the framework APIs are related but separate.

| Change | Version |
|---|---|
| Correcting an icon's geometry | Patch — `0.4.0 → 0.4.1` |
| Adding icons or a category | Minor — `0.4.0 → 0.5.0` |
| Renaming or removing an icon | Major |
| Changing a stable public API or icon contract | Major |
| Tightening a validation rule that existing icons fail | Major (or fix the icons first, and it is a patch) |

The full policy is in the [Release Process](wiki/Release-Process.md).

---

## 🔮 Future Extensions

Planned, in rough priority order. Each must land without invalidating existing icons wherever possible.

- **Authored metadata at scale** — meanings, keywords and references for the full collection
- **Aliases** — alternate and vernacular names, feeding search
- **Multicolour and duotone** — an explicit opt-in with a declared palette, plus a registry flag so consumers can tell monochrome and multicolour icons apart. Required before the coat of arms and Kente motifs can be represented faithfully
- **Variants** — filled/outline/weight, with unambiguous canonical naming. The collection already contains one genuine variant pair: `Sankofa` is the standard bird form and `SankofaHeart` the stylised heart form. They ship as two independently named icons because the specification cannot yet express the relationship; when it can, that pair is the case to model, and their names should not need to change
- **Additional canvas sizes** — a 16px-optimised set, if the 24px artwork proves insufficient at small sizes
- **Cultural provenance** — structured source citations
- **Localisation** — symbol names and meanings in Ghanaian languages

---

## 🧭 Guiding Principle

> **An icon should be defined once and consumed everywhere.**

The canonical SVG defines the artwork.
This specification defines the contract.
The registry describes the icon.
Framework integrations adapt it.
Distribution delivers it.

```text
                   CANONICAL ICON
                         │
                 ┌───────┴───────┐
                 ▼               ▼
                SVG           Registry
                 └───────┬───────┘
                         ▼
                 Icon Specification
                         │
     ┌──────────┬────────┼────────┬──────────┐
     ▼          ▼        ▼        ▼          ▼
  Raw SVG     React     Vue    Svelte   Web Components
     │
     ▼
    CDN
```

---

## See Also

- [Architecture](ARCHITECTURE.md) — how the system is built
- [SVG Style Guide](wiki/SVG-Style-Guide.md) — how to draw and clean an icon
- [Cultural Guidelines](wiki/Cultural-Guidelines.md) — how to research a symbol
- [Contributing](CONTRIBUTING.md) — how to submit one
