# Migration Guide

## `ghicons` 0.0.x → 0.1.0

**The `ghicons` package name now belongs to the framework-agnostic core. React components moved to `@ghicons/react`.**

This is a breaking change. It affects every project importing components from `ghicons`.

---

## What changed

| Before (`ghicons` 0.0.x) | After (`0.1.0`) |
|---|---|
| `ghicons` = React components | `ghicons` = SVG assets + icon registry, zero dependencies |
| — | `@ghicons/react` = React components |

Nothing about the icons themselves changed in this move — same artwork, same props, same `currentColor` behaviour. Only the package boundary moved.

---

## If you use GHIcons in React

Two steps.

**1. Swap the dependency**

```bash
npm uninstall ghicons
npm install @ghicons/react
```

```bash
# pnpm
pnpm remove ghicons && pnpm add @ghicons/react

# yarn
yarn remove ghicons && yarn add @ghicons/react
```

**2. Update your imports**

```diff
- import { GyeNyame, Sankofa } from "ghicons";
+ import { GyeNyame, Sankofa } from "@ghicons/react";
```

```diff
- import { type IconProps } from "ghicons";
+ import { type IconProps } from "@ghicons/react";
```

A project-wide find-and-replace of `from "ghicons"` → `from "@ghicons/react"` covers it.

The component API is unchanged. `size`, `color`, `className`, `style`, `viewBox` and standard SVG props all behave exactly as before.

---

## Icon renames in this release

Two icons were renamed while the package boundary was already changing, because renames are breaking and doing them separately would mean breaking consumers twice.

| Before | After | Why |
|---|---|---|
| `GhanaCedisIcon` | `GhanaCedi` | The `Icon` suffix was redundant — the specification now forbids it |
| `Sankofa1` | `SankofaHeart` | Numeric disambiguators are no longer permitted. This is the stylised heart form of Sankofa; `Sankofa` remains the standard bird form and is unchanged |

```diff
- import { GhanaCedisIcon } from "ghicons";
+ import { GhanaCedi } from "@ghicons/react";
```

### `GhanaCedi` also looks different

`GhanaCedisIcon` was drawn on a `0 0 345 511.44` canvas while the generated component declared `viewBox="0 0 24 24"`. That window falls on an empty region of the artwork, so the icon rendered **completely blank** in every `0.0.x` install — not merely cropped. It has been re-scoped to the standard 24×24 canvas and now renders correctly.

If you worked around this by hiding the icon or substituting your own, you can now use it as-is.

If you worked around the old behaviour by passing a custom `viewBox`, remove that override.

---

## If you do not use React

You are the reason this release exists. The core package now ships the icons directly.

**Install**

```bash
npm install ghicons
```

**Use the SVGs**

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Icons use `currentColor`, so inlining one lets CSS colour it:

```css
.icon { color: #b8860b; }
```

**Use the registry**

```js
import registry from "ghicons/registry.json";

const adinkra = registry.icons.filter(i => i.category === "adinkra");
// { name, slug, category, viewBox, file, meaning?, keywords? }
```

See [DOCUMENTATION.md](DOCUMENTATION.md) for the full guide.

---

## Why the name moved

GHIcons is a collection of Ghanaian symbols that ships a React adapter — not a React library containing SVGs. Leaving `ghicons` attached to React kept the old framing alive in the most visible place in the project, and left the "framework-agnostic" claim unverifiable, since nothing outside React could consume the collection.

The break was taken deliberately at ~21 installs/month rather than after 1.0, when the same correction would have been far more expensive.

---

## Getting help

If something in this guide does not cover your case, open a [Discussion](https://github.com/ProfessorBlackman/ghicons/discussions) or an [issue](https://github.com/ProfessorBlackman/ghicons/issues).
