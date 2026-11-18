# @ghicons/react 🇬🇭

**Ghanaian symbols as typed, tree-shakeable React components**, generated from the [`ghicons`](https://www.npmjs.com/package/ghicons) SVG collection.

> ⚠️ Through `0.0.1` these components were published as `ghicons`. See the [migration guide](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/MIGRATION_v1.md).

## Install

```bash
npm install @ghicons/react
```

Requires React 18 or 19.

## Use

```tsx
import { GyeNyame, Sankofa } from '@ghicons/react';

<GyeNyame />
<Sankofa size={40} color="gold" />
```

Icons default to `currentColor`, so they inherit the surrounding text colour.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Numbers are pixels; strings take any CSS unit |
| `color` | `string` | `currentColor` | Icon colour |
| `viewBox` | `string` | `0 0 24 24` | SVG viewBox |
| `className` | `string` | — | CSS classes |
| `style` | `React.CSSProperties` | — | Inline styles |

Any other SVG attribute passes through. `IconProps` is exported for wrappers.

## Accessibility

```tsx
<GyeNyame role="img" aria-label="Gye Nyame symbol" />       {/* meaningful */}
<button><GyeNyame aria-hidden="true" /> Learn more</button>  {/* decorative */}
```

Not using React? Use [`ghicons`](https://www.npmjs.com/package/ghicons) for raw SVGs and the registry.

## Links

[Documentation](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/DOCUMENTATION.md) · [Contributing](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/CONTRIBUTING.md) · [Browse icons](https://ghicons.methuselah.site/icons)

## License

MIT © Methuselah Nwodobeh
