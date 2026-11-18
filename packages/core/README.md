# ghicons 🇬🇭

**Ghanaian symbols as optimised SVGs, with a machine-readable registry.**

Adinkra symbols, the currency, national emblems and more. No dependencies, no framework — use them with anything.

Using React? Install [`@ghicons/react`](https://www.npmjs.com/package/@ghicons/react) instead.

> ⚠️ Until `0.1.0` this package contained React components; they moved to `@ghicons/react`. See the [migration guide](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/MIGRATION_v1.md).

## Install

```bash
npm install ghicons
```

## SVG files

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Files live at `svg/<category>/<Name>.svg`. Every icon uses a `0 0 24 24` viewBox and `fill="currentColor"` — inline the SVG to set its colour with CSS, since `<img>` can't inherit it.

## Registry

```js
import { icons, categories, getIcon, iconsByCategory } from 'ghicons';
// or: import registry from 'ghicons/registry.json';
// or: const { icons } = require('ghicons');

getIcon('gye-nyame');
// { name: 'GyeNyame', slug: 'gye-nyame', category: 'adinkra',
//   viewBox: '0 0 24 24', file: 'svg/adinkra/GyeNyame.svg', meaning: '…', … }

iconsByCategory('national');   // [BlackStar, GhanaFlag]
```

| Field | Always present | Description |
|---|:---:|---|
| `name` | ✅ | PascalCase name |
| `slug` | ✅ | Kebab-case identifier |
| `category` | ✅ | `adinkra`, `general`, `national` |
| `viewBox` | ✅ | `0 0 24 24` |
| `file` | ✅ | Path to the SVG in this package |
| `meaning` | | Documented meaning |
| `note` | | Origin, variations or contested readings |
| `keywords` | | Search terms |
| `aliases` | | Alternate names |
| `references` | | Sources; present wherever a meaning is |

The registry also has `version`, `count` and `categories`. Meanings are sourced; corrections are welcome under the [cultural guidelines](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/wiki/Cultural-Guidelines.md).

## Links

[Documentation](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/DOCUMENTATION.md) · [Icon specification](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/ICON-SPEC.md) · [Contributing](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/CONTRIBUTING.md) · [Browse icons](https://ghicons.methuselah.site/icons)

## License

MIT © Methuselah Nwodobeh
