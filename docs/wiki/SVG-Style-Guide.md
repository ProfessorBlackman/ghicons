# SVG Style Guide

This guide explains how to **draw and prepare** an SVG for GHIcons in practice — canvas use, path cleanup, level of detail, tools.

The SVG is the canonical source of every GHIcon. It is not a step on the way to a React component; it is the asset that the React package, the raw-SVG package, the CDN and every future framework adapter are all generated from. Getting it right once makes it right everywhere.

> **The rules live in the [Icon Specification](../blob/dev/docs/ICON-SPEC.md).** That document is authoritative and is what validation enforces. This guide is the practical companion to it.

Read both before submitting. Automated validation catches technical errors; visual quality and cultural accuracy need a human eye.

---

## The Basics

Every icon in GHIcons is drawn on a 24×24 canvas. This is the industry standard (Lucide, Heroicons and others use it), so GHIcons sits alongside those sets without visual adjustment, and it gives every icon a predictable, scalable baseline.

### Required attributes

```svg
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="..." />
</svg>
```

| Attribute | Required value | Why |
|---|---|---|
| `viewBox` | `0 0 24 24` | Defines the coordinate space. Must be consistent across all icons |
| `fill` | `currentColor` | Allows consumers to control icon color via CSS |
| `xmlns` | `http://www.w3.org/2000/svg` | Required for valid SVG |
| `width` / `height` | `24` | Every integration overrides these, but set them so the raw file renders sensibly on its own |

---

## Fill vs Stroke

GHIcons uses **fill-based icons** by default. Avoid `stroke` attributes unless the symbol's design genuinely requires it.

**✅ Preferred — fill only:**
```svg
<path fill="currentColor" d="M12 2L..." />
```

**⚠️ Avoid unless necessary — stroke:**
```svg
<path stroke="currentColor" stroke-width="2" fill="none" d="M12 2L..." />
```

If a symbol's detail can only be expressed with strokes (e.g. fine line work), use `stroke="currentColor"` and `fill="none"`, and set `stroke-width` to a value that looks clean at 24px (typically `1.5` or `2`). Never mix hardcoded stroke colors with `currentColor`.

---

## Color Rules

**Never hardcode colors.** GHIcons are monochrome and must respect the consumer's color context.

This is the rule that matters most, and the one that has been broken most often. A hardcoded `fill` is *invisible* in the React package — the generator discards the root tag and substitutes its own — so a wrong colour can sit in the collection for months without anyone noticing. The moment the same file ships as a raw SVG, it renders in that hardcoded colour. A white fill becomes white-on-white.

103 of the first 106 icons carried `fill='#fff'` for exactly this reason. Validation now checks the whole collection on every run.

| ❌ Wrong | ✅ Correct |
|---|---|
| `fill="#000000"` | `fill="currentColor"` |
| `fill="black"` | `fill="currentColor"` |
| `fill="#FCD116"` | `fill="currentColor"` |
| `fill="white"` | `fill="currentColor"` |
| `fill="rgb(0,0,0)"` | `fill="currentColor"` |

The consumer controls colour however their platform does:

```tsx
<GyeNyame color="gold" size={48} />   /* React */
```
```css
.icon { color: gold; }                /* inlined SVG, any stack */
```

### Inherently multicolour symbols

Some symbols are multicolour in life — the national flag, the coat of arms, Kente motifs.

**They ship as monochrome silhouettes today.** `GhanaFlag` is the reference treatment: stripes and star as shapes, all `currentColor`. Multicolour support is planned but does not exist yet, so do not introduce palette colours ahead of it.

---

## Canvas and Sizing

All icons live on a **24×24 canvas**. When preparing your SVG:

- Use the full canvas — icons should feel present, not tiny and centered in a lot of whitespace
- Leave a small amount of breathing room at the edges — a 1–2px margin on all sides is a good guideline
- Avoid placing content right at the edge of the 24×24 boundary, as it may get clipped

**Good use of canvas:**

```
┌──────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░  │  ← 1-2px breathing room
│  ░                    ░  │
│  ░    icon content    ░  │
│  ░                    ░  │
│  ░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────┘
```

---

## Path Cleanliness

Clean paths are smaller, faster, and easier to maintain. Before submitting:

- **Remove editor metadata** — Inkscape, Illustrator, and Figma all add metadata tags (`<sodipodi>`, `<metadata>`, `<desc>`, etc.) that should be stripped
- **Remove unnecessary groups** — flatten `<g>` elements where possible
- **Remove redundant transforms** — apply transforms to the path data itself rather than wrapping in `<g transform="...">`
- **Remove empty elements** — delete any `<path d=""/>` or `<g></g>` nodes
- **Merge paths where possible** — if two paths form a single shape, combine them

**Example of a bloated SVG to clean up:**
```svg
<!-- ❌ Before cleaning -->
<svg xmlns:dc="..." xmlns:inkscape="...">
  <metadata>...</metadata>
  <g inkscape:label="Layer 1" transform="translate(0,-1028.3)">
    <g transform="scale(0.5)">
      <path fill="#000000" d="M..." />
    </g>
  </g>
</svg>

<!-- ✅ After cleaning -->
<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M..." />
</svg>
```

---

## Level of Detail

Adinkra symbols range from simple geometric forms to highly intricate designs. When converting a complex symbol:

- Prioritise **recognisability** over perfect reproduction — at 24px, fine details disappear
- Simplify small decorative elements that become noise at small sizes
- Test your icon at both 24px (default) and 48px to make sure it reads well at both sizes
- If a symbol has a well-known simplified form, prefer that over a maximally detailed reproduction

---

## No Raster Content

SVG files must be **pure vector**. Do not embed:

- `<image>` elements
- Base64-encoded PNG or JPEG data
- External image URLs

If your source file contains raster content, retrace it as vector paths before submitting.

---

## No Scripts or External References

For security, the following are not allowed:

- `<script>` tags of any kind
- `@import` in `<style>` blocks
- External URLs in `fill`, `stroke`, or `href` attributes (e.g. `fill="url(http://..."`)

---

## Validation Checklist

Before opening a PR, verify:

- [ ] `viewBox` is `0 0 24 24`
- [ ] `fill` is `currentColor` (no hardcoded colors anywhere)
- [ ] No embedded raster images or base64 data
- [ ] No `<script>` tags or external references
- [ ] Editor metadata stripped
- [ ] File name is PascalCase (e.g. `GyeNyame.svg`), with no numeric suffix (`Sankofa1`) and no `Icon` suffix (`GyeNyameIcon`)
- [ ] File is placed in the right category: `svg/adinkra/`, `svg/general/` or `svg/national/`
- [ ] Icon looks correct at 24px and 48px

Run `pnpm run validate` before you push — it applies exactly the same checks CI does, across the whole collection.

### Naming

The filename becomes the identifier in every integration and the slug in the registry:

```text
svg/adinkra/GyeNyame.svg
  → import { GyeNyame } from "@ghicons/react"
  → ghicons/svg/adinkra/GyeNyame.svg
  → registry slug "gye-nyame"
```

Renaming a published icon is a breaking change, so choose carefully the first time.

---

## Tools

| Tool | Use |
|---|---|
| [Inkscape](https://inkscape.org) | Free, open source vector editor. Great for tracing and cleaning SVGs |
| [Vectorizer.ai](https://vectorizer.ai) | Converts raster images to SVG automatically |
| [SVGOMG](https://jakearchibald.github.io/svgomg/) | Browser-based SVG cleaner and optimizer |
| [SVG Viewer](https://www.svgviewer.dev) | Quickly preview and inspect SVG code in the browser |

---

## Questions?

If you're unsure whether your SVG meets the standards, paste it into a [Discussion](../discussions) or open a draft PR and ask for feedback. We'd rather help you get it right than have you stuck.

See also: [Icon Specification](../blob/dev/docs/ICON-SPEC.md) · [Cultural Guidelines](Cultural-Guidelines) · [Contributing](../blob/dev/docs/CONTRIBUTING.md)
