# SVG Style Guide

How to draw and prepare an icon in practice. The rules themselves are in the [Icon Specification](../blob/dev/docs/ICON-SPEC.md), which is what validation enforces.

## Template

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="..." />
</svg>
```

## Colour

**Never hardcode colours** — not `#000`, `black`, `white` or Ghana gold. Use `currentColor` so consumers control the colour. A hardcoded fill is hidden in React but shows up in the raw SVG; 103 of the first 106 icons once shipped with `fill='#fff'` this way.

Multicolour symbols (flag, coat of arms, Kente) are drawn as monochrome silhouettes for now; `GhanaFlag` is the reference.

## Fill vs stroke

Prefer fills. If a symbol needs strokes, use `stroke="currentColor" fill="none"` with a `stroke-width` of `1.5` or `2`.

## Canvas

Fill the 24×24 canvas, leaving about 1–2px of margin. Content at the very edge can clip; content floating in whitespace looks smaller than its neighbours.

## Level of detail

Recognisability beats perfect reproduction. Simplify details that turn to noise at small sizes, prefer a well-known simplified form, and check the icon at 24px and 48px.

## Clean paths

Before submitting, remove:

- editor metadata (`<metadata>`, `sodipodi:*`, `inkscape:*`, `<desc>`)
- unnecessary `<g>` groups and wrapper transforms (apply them to the path)
- empty elements

Merge paths that form one shape.

```svg
<!-- Before -->
<svg xmlns:inkscape="...">
  <metadata>...</metadata>
  <g transform="translate(0,-1028.3)"><g transform="scale(0.5)"><path fill="#000000" d="M..." /></g></g>
</svg>

<!-- After -->
<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M..." />
</svg>
```

## Not allowed

`<image>` elements, base64 data, external URLs, `<script>`, or `@import`. Retrace raster sources as vector paths.

## Naming

PascalCase, named after the symbol: `GyeNyame.svg`, not `Sankofa1.svg` or `GyeNyameIcon.svg`. Put it in `svg/adinkra/`, `svg/general/` or `svg/national/`. The filename becomes the identifier everywhere, so renaming later is a breaking change.

Run `pnpm run validate` before pushing — it applies the same checks as CI.

## Tools

- [Inkscape](https://inkscape.org) — free vector editor for tracing and cleanup
- [Vectorizer.ai](https://vectorizer.ai) — raster to SVG
- [SVGOMG](https://jakearchibald.github.io/svgomg/) — browser-based optimiser
- [SVG Viewer](https://www.svgviewer.dev) — preview and inspect SVG code

Unsure? Post your SVG in [Discussions](../discussions) or open a draft PR.
