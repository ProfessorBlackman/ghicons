# Migration v1 — `ghicons` 0.0.x → 0.1.0

**The `ghicons` name now belongs to the framework-agnostic core. React components moved to `@ghicons/react`.** The artwork, props and `currentColor` behaviour are unchanged.

## React users

```bash
npm uninstall ghicons
npm install @ghicons/react
```

Replace `from "ghicons"` with `from "@ghicons/react"` across your project:

```diff
- import { GyeNyame, type IconProps } from "ghicons";
+ import { GyeNyame, type IconProps } from "@ghicons/react";
```

### Renamed icons

| Before | After |
|---|---|
| `GhanaCedisIcon` | `GhanaCedi` |
| `Sankofa1` | `SankofaHeart` (the heart form; `Sankofa` is unchanged) |

`GhanaCedisIcon` rendered **blank** in every `0.0.x` release because its artwork sat outside the 24×24 viewBox. `GhanaCedi` renders correctly — remove any workaround or custom `viewBox` you added.

## Everyone else

The core package now ships the SVGs and a registry directly:

```bash
npm install ghicons
```

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

See [DOCUMENTATION.md](DOCUMENTATION.md).

## Why

GHIcons is a symbol collection with a React adapter, so its main name should mean the collection. The break was taken early, while installs were few, rather than after 1.0.
