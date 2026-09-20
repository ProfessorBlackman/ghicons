# SVG Style Guide

This guide explains how to prepare SVG icons for GHIcons. Following these standards ensures every icon in the library looks consistent, scales correctly, and works reliably across all React projects.

Read this before submitting an SVG — the automated validation workflow will catch most technical errors, but visual quality and cultural accuracy require a human eye.

---

## The Basics

Every icon in GHIcons is a 24×24 SVG component. This is the industry standard (used by Lucide, Heroicons, and others) and gives icons a predictable, scalable baseline.

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
| `width` / `height` | `24` | The component overrides these via props, but set them as fallback |

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

**Never hardcode colors.** GHIcons icons must be monochrome and respect the consumer's color context.

| ❌ Wrong | ✅ Correct |
|---|---|
| `fill="#000000"` | `fill="currentColor"` |
| `fill="black"` | `fill="currentColor"` |
| `fill="#FCD116"` | `fill="currentColor"` |
| `fill="white"` | `fill="currentColor"` |
| `fill="rgb(0,0,0)"` | `fill="currentColor"` |

The consumer controls color using the `color` prop:
```tsx
<GyeNyame color="gold" size={48} />
```

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
- [ ] File name is PascalCase (e.g. `GyeNyame.svg`)
- [ ] File is placed in the `/svg` directory
- [ ] Icon looks correct at 24px and 48px

The automated SVG validation workflow will also check most of these when you open a PR.

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
