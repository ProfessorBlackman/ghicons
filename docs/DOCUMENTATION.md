# Using GHIcons

## Which package?

| You use | Install |
|---|---|
| React | `@ghicons/react` |
| Anything else, or you want the SVG files or registry | `ghicons` |

```bash
npm install ghicons            # SVGs + registry, no dependencies
npm install @ghicons/react     # React components
```

Upgrading from `ghicons` `0.0.x`, when it was the React package? See [MIGRATION_v1.md](MIGRATION_v1.md).

## The core package

```text
ghicons/
├── svg/<category>/<Name>.svg
├── registry.json
└── index.js / index.cjs / index.d.ts
```

### Raw SVG files

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Paths are stable, so a build step can copy them.

**To set the colour, inline the SVG.** Icons use `fill="currentColor"`, which an `<img>` cannot inherit from the page:

```html
<span class="icon">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="…" /></svg>
</span>
```

```css
.icon { color: #b8860b; }
.icon svg { width: 2rem; height: 2rem; }
```

A build-time inliner (`vite-plugin-svg-icons`, `svg-inline-loader`, etc.) works too.

### The registry

```js
import registry from "ghicons/registry.json";

registry.icons.find(i => i.slug === "gye-nyame");
// {
//   name: "GyeNyame",
//   slug: "gye-nyame",
//   category: "adinkra",
//   viewBox: "0 0 24 24",
//   file: "svg/adinkra/GyeNyame.svg",
//   meaning: "Except God — the omnipotence and supremacy of God in all affairs",
//   keywords: ["god", "supremacy", "omnipotence", "faith"],
//   aliases: ["Gye Nyame"],
//   references: ["Willis, W. Bruce. The Adinkra Dictionary (1998)", "…"]
// }
```

Or use the accessors: `import { icons, categories, getIcon, iconsByCategory } from "ghicons"`.

`name`, `slug`, `category`, `viewBox` and `file` are always present. `meaning`, `note`, `keywords`, `aliases` and `references` are optional — treat them that way:

```js
const label = icon.meaning ?? icon.name;
```

Full schema: [ICON-SPEC.md](ICON-SPEC.md#the-icon-registry).

## React

```tsx
import { GyeNyame, Sankofa } from "@ghicons/react";

<GyeNyame />
<Sankofa size={40} color="#b30000" />
<GyeNyame size="2.5rem" className="my-icon" style={{ marginTop: 10 }} />
```

Icons are named exports, so bundlers tree-shake the ones you don't use. They default to `currentColor` and inherit the surrounding text colour.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Numbers are pixels; strings take any CSS unit |
| `color` | `string` | `currentColor` | Icon colour |
| `viewBox` | `string` | `0 0 24 24` | SVG viewBox |
| `className` | `string` | — | CSS classes |
| `style` | `React.CSSProperties` | — | Inline styles |

Any other SVG attribute (`onClick`, `aria-*`, `data-*`, `role`…) passes through. `IconProps` is exported for building wrappers:

```tsx
import { GyeNyame, type IconProps } from "@ghicons/react";

const IconButton = ({ label, ...icon }: IconProps & { label: string }) => (
  <button><GyeNyame {...icon} />{label}</button>
);
```

Works in Next.js Client and Server Components. No CSS import is needed.

## Accessibility

You decide whether an icon is meaningful or decorative:

```tsx
<GyeNyame role="img" aria-label="Gye Nyame symbol" />    {/* meaningful */}
<button><GyeNyame aria-hidden="true" /> Learn more</button>  {/* decorative */}
```

The same attributes work on inlined SVGs.

## Categories

- **adinkra** — 100+ traditional Adinkra symbols.
- **general** — Ghanaian concepts outside Adinkra; currently the Ghana Cedi.
- **national** — Black Star and Ghana Flag. Multicolour symbols ship as monochrome silhouettes until [multicolour support](wiki/Roadmap.md) lands.

Meanings are researched and sourced, never invented; contested readings are noted as such.

## Help

[Discussions](https://github.com/ProfessorBlackman/ghicons/discussions) for questions, [Issues](https://github.com/ProfessorBlackman/ghicons/issues) for bugs and symbol requests.
