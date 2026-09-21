# GHIcons Documentation

**GHIcons** gathers Ghanaian symbols in one place and standardises them, so developers stop hunting across the web for a usable copy of each one.

The scope is every symbol that is Ghanaian or belongs to Ghanaian life: Adinkra and other tribal symbols, the currency, national and state emblems, the marks of Ghanaian movements and organisations, and in time Ghanaian brands.

> **Define a symbol once. Make it available everywhere.**

The canonical source for every GHIcon is an SVG. Framework packages and other distribution formats are generated from those assets — so you can use GHIcons with React, with any other framework, or with no framework at all.

---

## 📋 Table of Contents

- [What is GHIcons?](#-what-is-ghicons)
- [Which package do I need?](#-which-package-do-i-need)
- [Installation](#-installation)
- [Using the core package](#-using-the-core-package)
  - [Raw SVG files](#raw-svg-files)
  - [The registry](#the-registry)
- [Using GHIcons with React](#-using-ghicons-with-react)
  - [Basic usage](#basic-usage)
  - [Sizing](#sizing)
  - [Colouring](#colouring)
  - [Classes and styles](#classes-and-styles)
  - [TypeScript](#typescript)
  - [Props reference](#props-reference)
- [Icon Categories](#-icon-categories)
- [Design Principles](#-design-principles)
- [Accessibility](#-accessibility)
- [FAQ](#-faq)
- [Support](#-support)

---

## 🧭 What is GHIcons?

Three parts that fit together.

### 1. The collection

SVG representations of Ghanaian symbols — the **canonical source of truth** for the whole project.

```text
svg/
├── adinkra/
├── general/
└── national/
```

### 2. The specification

A common contract every icon follows: a 24×24 canvas, `currentColor`, naming rules, safety requirements, optimisation. It means icons behave consistently no matter how you consume them. See [ICON-SPEC.md](ICON-SPEC.md).

### 3. The integrations

Platform-specific packages generated from the collection. React today; Vue, Svelte, Web Components and Flutter planned.

These are **outputs of the icon system**, never separate sources of truth.

---

## 📦 Which package do I need?

| You are building with… | Install | 
|---|---|
| React | `@ghicons/react` |
| Anything else — Vue, Svelte, Angular, Astro, Django, Laravel, WordPress, plain HTML | `ghicons` |
| A design tool, docs site, or your own generator | `ghicons` (for the registry) |

> ⚠️ **`ghicons` used to be the React package.** As of `0.1.0` it is the framework-agnostic core. Upgrading from `0.0.x`? See [MIGRATION.md](MIGRATION.md).

---

## 🚀 Installation

```bash
# core — SVGs + registry, no dependencies
npm install ghicons

# React
npm install @ghicons/react
```

```bash
# pnpm
pnpm add ghicons
pnpm add @ghicons/react

# yarn
yarn add ghicons
yarn add @ghicons/react
```

---

## 🧱 Using the core package

`ghicons` contains the optimised SVG files and a machine-readable index. No runtime, no framework, no dependencies.

```text
ghicons/
├── svg/
│   ├── adinkra/GyeNyame.svg
│   ├── general/…
│   └── national/…
├── registry.json
└── index.js
```

### Raw SVG files

Reference a file directly:

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Or copy the ones you need into your own assets directory — the paths are stable, so a build step can copy them reliably.

**To control colour, inline the SVG.** Icons use `fill="currentColor"`, which only inherits when the SVG is part of the document:

```html
<span class="icon">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="…" />
  </svg>
</span>
```

```css
.icon { color: #b8860b; }
.icon svg { width: 2rem; height: 2rem; }
```

An `<img>` tag renders the icon in its own default colour and cannot inherit yours — that is a browser rule, not a GHIcons limitation. Inline the SVG, or use a build-time inliner such as `vite-plugin-svg-icons`, `svg-inline-loader`, or your framework's equivalent.

### The registry

`registry.json` describes the whole collection:

```js
import registry from "ghicons/registry.json";

registry.icons.length;
// 106

registry.icons.find(i => i.slug === "gye-nyame");
// {
//   name: "GyeNyame",
//   slug: "gye-nyame",
//   category: "adinkra",
//   viewBox: "0 0 24 24",
//   file: "svg/adinkra/GyeNyame.svg",
//   meaning: "Except God — the supremacy of God",
//   keywords: ["god", "supremacy", "faith"]
// }
```

Use it to build an icon picker, a search interface, a documentation page, or your own code generator:

```js
const byCategory = registry.icons.reduce((acc, icon) => {
  (acc[icon.category] ??= []).push(icon);
  return acc;
}, {});
```

`name`, `slug`, `category`, `viewBox` and `file` are always present. `meaning`, `keywords` and `aliases` are optional and being filled in across the collection.

Full schema: [ICON-SPEC.md](ICON-SPEC.md#-the-icon-registry).

---

## ⚛️ Using GHIcons with React

### Basic usage

```tsx
import { GyeNyame, Sankofa } from "@ghicons/react";

function MyComponent() {
  return (
    <div>
      <GyeNyame />
      <Sankofa size={40} color="#b30000" />
    </div>
  );
}
```

Icons are individual named exports, so modern bundlers tree-shake the ones you do not use.

### Sizing

`size` takes a number (pixels) or a string (any CSS unit):

```tsx
<Adinkrahene size={32} />      {/* 32px */}
<Adinkrahene size="2.5rem" />  {/* 2.5rem */}
<Adinkrahene size="1.5em" />
```

Default is `24`.

### Colouring

Icons use `currentColor`, so they inherit the surrounding text colour:

```tsx
<div style={{ color: "blue" }}>
  <Akoben />   {/* blue */}
</div>
```

Or set it directly:

```tsx
<Akoben color="gold" />
```

This is part of the icon specification, not a React convenience — it works the same way in every integration.

### Classes and styles

```tsx
<Fihankra className="my-icon" style={{ marginTop: "10px" }} />
```

Works with plain CSS, Tailwind, CSS modules, or anything else.

### TypeScript

The shared `IconProps` type is exported:

```tsx
import { GyeNyame, type IconProps } from "@ghicons/react";

interface IconButtonProps extends IconProps {
  label: string;
}

const IconButton = ({ label, ...iconProps }: IconButtonProps) => (
  <button>
    <GyeNyame {...iconProps} />
    {label}
  </button>
);
```

### Props reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Rendered size. Numbers are pixels. |
| `color` | `string` | `currentColor` | Icon colour. |
| `viewBox` | `string` | `0 0 24 24` | SVG viewBox. |
| `className` | `string` | — | Additional CSS classes. |
| `style` | `React.CSSProperties` | — | Inline styles. |

Components render real `<svg>` elements, so every standard React SVG attribute works too — `onClick`, `aria-*`, `data-*`, `role`, and the rest.

---

## 📂 Icon Categories

### Adinkra

The largest category — 100+ symbols. A few:

- **Gye Nyame** — the supremacy of God
- **Sankofa** — learning from the past
- **Duafe** — beauty and cleanliness
- **Dwennimmen** — humility together with strength

Cultural meanings are treated carefully. GHIcons documents symbols accurately and avoids inventing or overstating interpretations. Where a reading is contested, the documentation says so.

### General

Ghanaian concepts and objects outside the Adinkra canon — currently the **Ghana Cedi** currency symbol, with everyday Ghanaian iconography to follow.

### National

Symbols representing Ghana as a nation. **Black Star** and **Ghana Flag** ship today; the Coat of Arms, Independence Arch and others are planned.

Note that several national symbols are multicolour in real life. GHIcons is monochrome today, so they ship as silhouettes until multicolour support lands — see the [Roadmap](wiki/Roadmap.md).

---

## 🎨 Design Principles

**Simplicity** — icons stay recognisable at small sizes, designed around a 24×24 grid.

**Consistency** — one viewBox, predictable scaling, one colour model, compatible SVG structure, consistent naming.

**Scalability** — vector throughout; sharp at any size.

**Framework independence** — the canonical icon knows nothing about React, Vue or Flutter. Platform behaviour belongs in the integration.

**Cultural accuracy** — many of these are real cultural symbols. Where one is, its meaning is researched and documented, never inferred or invented.

---

## ♿ Accessibility

Whether an icon is decorative or meaningful depends on how you use it, so GHIcons leaves the decision to you and makes both easy.

**Meaningful** — give it an accessible name:

```tsx
<GyeNyame role="img" aria-label="Gye Nyame symbol" />
```

**Decorative** — hide it, when adjacent text already carries the meaning:

```tsx
<button>
  <GyeNyame aria-hidden="true" />
  Learn more
</button>
```

The same applies to inlined raw SVGs: add `role="img"` and `aria-label`, or `aria-hidden="true"`.

---

## ❓ FAQ

**Do I need to import a CSS file?**
No. Icons are inline SVG. There is no GHIcons stylesheet.

**Does GHIcons only support React?**
No. The `ghicons` core package works with anything — it is just SVG files and a JSON index. React is the only *generated component* package today; Vue, Svelte, Web Components and Flutter are planned.

**Can I use it with Next.js?**
Yes, in both Client and Server Components.

**Can I use the SVG files directly?**
Yes. That is what the core package is for.

**Why does my `<img>` icon ignore my colour?**
An SVG loaded through `<img>` cannot inherit CSS from the page. Inline the SVG instead — see [Raw SVG files](#raw-svg-files).

**Can I request a symbol?**
Yes. Open an [issue](https://github.com/ProfessorBlackman/ghicons/issues) with the symbol, its cultural significance, its Ghanaian context, references, and why it would be useful.

**Can I contribute an icon?**
Yes, and you only need to supply an SVG. Read [ICON-SPEC.md](ICON-SPEC.md) and [CONTRIBUTING.md](CONTRIBUTING.md). The pipeline handles every framework output.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/ProfessorBlackman/ghicons/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ProfessorBlackman/ghicons/discussions)
- **Repository:** [GitHub](https://github.com/ProfessorBlackman/ghicons)

If you are proposing a cultural symbol, reliable context and references help a great deal.

---

## 🇬🇭 The bigger picture

GHIcons started as a React icon library. The goal is broader: **to make Ghanaian symbols — all of them, not only the cultural ones — easy to use anywhere software is built.**

The SVG collection is the foundation. React, raw SVG, and every future integration are just different ways of consuming it.

> **Contribute an icon once. Make it available everywhere GHIcons is supported.**
