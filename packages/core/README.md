# ghicons 🇬🇭

**Ghanaian cultural icons — optimised SVGs and a machine-readable registry.**

Adinkra symbols, national emblems and other Ghanaian motifs, as plain SVG files with no dependencies and no framework. Use them with anything: Vue, Svelte, Angular, Astro, Django, Laravel, WordPress, plain HTML, or your own tooling.

Building with React? Install [`@ghicons/react`](https://www.npmjs.com/package/@ghicons/react) instead — it wraps these same icons as typed components.

> ⚠️ **`ghicons` used to be the React package.** As of `0.1.0` this name is the framework-agnostic core and React moved to `@ghicons/react`. See the [migration guide](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/MIGRATION.md).

---

## Install

```bash
npm install ghicons
```

## What's in the box

```text
ghicons/
├── svg/
│   ├── adinkra/GyeNyame.svg    …and 100+ more
│   ├── general/
│   └── national/
├── registry.json               the index of the whole collection
└── index.js / index.cjs        convenience accessors
```

## Use the SVG files

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Paths are stable, so a build step can copy them reliably.

Every icon is drawn on a `0 0 24 24` canvas and uses `fill="currentColor"`. **Inline the SVG** if you want CSS to control its colour — an `<img>` cannot inherit colour from the page:

```css
.icon { color: #b8860b; }
```

## Use the registry

```js
import { icons, categories, getIcon, iconsByCategory } from 'ghicons';

getIcon('gye-nyame');
// { name: 'GyeNyame', slug: 'gye-nyame', category: 'adinkra',
//   viewBox: '0 0 24 24', file: 'svg/adinkra/GyeNyame.svg' }

iconsByCategory('national');   // [BlackStar, GhanaFlag]
categories;                    // ['adinkra', 'general', 'national']
```

CommonJS works too:

```js
const { icons } = require('ghicons');
```

Or read the JSON directly, from any language:

```js
import registry from 'ghicons/registry.json';
```

Use it to build an icon picker, a search interface, a docs page, or your own code generator.

### Registry fields

| Field | Always present | Description |
|---|:---:|---|
| `name` | ✅ | PascalCase name, and the identifier framework packages use |
| `slug` | ✅ | Kebab-case identifier, stable across every channel |
| `category` | ✅ | `adinkra`, `general`, `national`, … |
| `viewBox` | ✅ | Always `0 0 24 24` |
| `file` | ✅ | Path to the SVG inside this package |
| `meaning` | | Documented meaning, where researched |
| `keywords` | | Search keywords |
| `aliases` | | Alternate and vernacular names |

Optional fields are being filled in across the collection.

## Why this package exists

The SVG collection is GHIcons' source of truth — every framework package is generated from it. This package ships that collection directly, so the framework you use never decides whether Ghanaian visual language is available to you.

## Links

- [Documentation](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/DOCUMENTATION.md)
- [Icon specification](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/ICON-SPEC.md)
- [Contributing](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/CONTRIBUTING.md)
- [Browse the icons](https://ghicons.methuselah.site)

## License

MIT © Methuselah Nwodobeh
