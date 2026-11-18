# GHIcons Icon Specification

What makes a valid GHIcon. This describes the canonical SVG, not any framework's API; integrations must not redefine it.

> **Status:** `v1-draft`. The [validation](#validation) rules are enforced in CI. The [registry schema](#the-icon-registry) is not frozen until 1.0.

## Core rules

1. **The SVG is canonical.** Every icon lives at `svg/<category>/<IconName>.svg`. Components, the registry and published assets are derived from it and never edited by hand.
2. **No framework assumptions.** Platform-specific behaviour belongs in the integration.
3. **24 × 24 canvas**, `viewBox="0 0 24 24"`.
4. **Monochrome**, using `currentColor`.

## SVG requirements

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="…" />
</svg>
```

- Valid SVG with a single `<svg>` root
- `viewBox` exactly `0 0 24 24`
- `width`/`height` of `24` (advisory — integrations override them)
- Vector geometry only

Strip editor metadata, redundant groups and empty elements where you can; the pipeline also optimises with SVGO.

**Why the exact viewBox matters:** generated components default to `0 0 24 24`, so an icon drawn on another canvas is silently clipped — `GhanaCedisIcon` rendered blank throughout `0.0.x` for this reason.

## Colour

Filled geometry uses `fill="currentColor"`; stroked geometry uses `fill="none" stroke="currentColor"`. **No other colour value is allowed anywhere** — root, paths or `<style>`.

This lets the icon inherit colour like text in every integration. A hardcoded colour breaks that: a white fill is hidden in React (the generator replaces the root tag) but renders white-on-white as a raw SVG.

Multicolour symbols (flag, coat of arms, Kente) ship as monochrome silhouettes for now — `GhanaFlag` is the reference. Don't add palette colours ahead of [multicolour support](#future-extensions).

## Geometry

- Use the canvas, with roughly 1–2px of margin.
- Avoid hairlines that vanish at 16px.
- Prefer fills; where strokes are needed, `1.5` or `2` reads well.

See the [SVG Style Guide](wiki/SVG-Style-Guide.md).

## File naming

Filenames are **PascalCase** and become the identifier everywhere:

```text
svg/adinkra/GyeNyame.svg
  → import { GyeNyame } from "@ghicons/react"
  → slug "gye-nyame"
  → ghicons/svg/adinkra/GyeNyame.svg
```

Use the symbol's recognised name; keep it descriptive and free of abbreviations. Not allowed:

- numeric disambiguators (`Sankofa1`) — two forms of one symbol are [variants](#future-extensions), not numbers
- an `Icon` suffix (`GhanaCedisIcon`)

Renaming a published icon is a **breaking change**.

## Categories

A category is a directory under `svg/` (`adinkra`, `general`, `national`). Its name flows into the registry, asset paths and the website. A new directory is picked up automatically.

## The icon registry

`registry.json` is generated and ships in the `ghicons` package:

```json
{
  "version": "0.2.0",
  "count": 106,
  "categories": ["adinkra", "general", "national"],
  "icons": [
    {
      "name": "GyeNyame",
      "slug": "gye-nyame",
      "category": "adinkra",
      "viewBox": "0 0 24 24",
      "file": "svg/adinkra/GyeNyame.svg",
      "meaning": "Except God — the omnipotence and supremacy of God in all affairs",
      "keywords": ["god", "supremacy", "omnipotence", "faith"],
      "aliases": ["Gye Nyame"],
      "references": ["Willis, W. Bruce. The Adinkra Dictionary (1998)", "https://www.adinkrasymbols.org/symbols/gye-nyame/"]
    }
  ]
}
```

| Field | Source | Required |
|---|---|---|
| `name` | Filename | ✅ |
| `slug` | `name` in kebab-case | ✅ |
| `category` | Directory | ✅ |
| `viewBox` | The SVG | ✅ |
| `file` | Path in the package | ✅ |
| `meaning`, `note`, `keywords`, `aliases` | Authored | Optional |
| `references` | Authored | With `meaning` or `note` |

The registry describes icons; it never holds a copy of the artwork.

### Authoring metadata

Authored fields live in `metadata/`, one JSON file per icon mirroring its SVG path (`metadata/adinkra/GyeNyame.json`). Never edit the generated registry — it is rebuilt every run.

```json
{
  "meaning": "Except God — the omnipotence and supremacy of God in all affairs",
  "note": "Regional readings differ in emphasis; see the references.",
  "keywords": ["god", "supremacy", "omnipotence", "faith"],
  "aliases": ["Gye Nyame"],
  "references": ["Willis, W. Bruce. The Adinkra Dictionary (1998)"]
}
```

| Field | Rule |
|---|---|
| `meaning` | One line, ≤ 240 characters |
| `note` | ≤ 1200 characters: origin, variations, contested readings |
| `keywords` | ≤ 24 entries, each ≤ 32 chars; lowercase letters, digits, spaces, hyphens |
| `aliases` | Other names for the symbol; never the icon's own name |
| `references` | ≤ 300 characters each. **Required with `meaning` or `note`** |

Validation fails on:

- a derived field (`name`, `slug`, `category`, `viewBox`, `file`)
- an unknown field
- a `meaning` or `note` without `references`
- a metadata file with no matching icon
- an empty file

Wikipedia as the only source is flagged. Contested meanings must be described as contested. See [Cultural Guidelines](wiki/Cultural-Guidelines.md).

```bash
node tools/validate.mjs metadata/adinkra/GyeNyame.json
```

## Accessibility

Source SVGs must not hardcode `aria-hidden`, `role` or `<title>`. Integrations must let consumers supply an accessible name or hide the icon.

## SVG safety

Icons are inlined into host pages, so these are prohibited:

- `<script>` elements
- `@import` in `<style>`
- `<image>` elements, `data:` URIs, base64 payloads
- Remote references in `href`, `fill` or `stroke`

## Optimisation

The pipeline runs SVGO. Optimisation must never change how an icon looks; a visual diff is a pipeline bug.

## Validation

`pnpm run validate` runs locally and in CI, across the **entire collection** on every run — checking only changed files is how 103 icons once drifted to `fill='#fff'`.

| Check | Requirement |
|---|---|
| Parseable | Valid XML, single `<svg>` root |
| `viewBox` | Exactly `0 0 24 24` |
| Colour | Only `currentColor` or `none` |
| Raster / base64 | None |
| Scripts / imports | None, and no remote references |
| Filename | PascalCase, no numeric or `Icon` suffix |

## Adding or modifying an icon

1. Add or edit the SVG in `svg/<category>/`.
2. `pnpm run validate`, then `pnpm run generate`.
3. Check it: proportions, colour inheritance, legible at 16px, not clipped, consistent with neighbours.
4. Update `metadata/` if the documented information changed.

Never edit generated components or keep per-framework copies of an SVG.

## Known exceptions

None — every icon meets this spec. Exceptions, when they exist, are listed in `tools/validate.mjs` so they warn instead of fail, while new violations still fail.

Fixed in `0.1.0`: `GhanaCedisIcon` (off-canvas, rendered blank) became `GhanaCedi`; 103 hardcoded `fill='#fff'` became `currentColor`; `Sankofa1` became `SankofaHeart`.

## Versioning

| Change | Version |
|---|---|
| Fixing an icon's geometry | Patch |
| Adding icons or a category | Minor |
| Renaming or removing an icon | Major |
| Changing a stable API or icon contract | Major |
| Tightening a rule existing icons fail | Major (or fix the icons first) |

Full policy: [Release Process](wiki/Release-Process.md).

## Future extensions

- **Multicolour / duotone** — opt-in with a declared palette and a registry flag
- **Variants** — filled/outline/weight. `Sankofa` / `SankofaHeart` is the first pair to model; their names should not change
- **16px-optimised set**, if needed
- **Structured provenance** and **localised names** in Ghanaian languages
