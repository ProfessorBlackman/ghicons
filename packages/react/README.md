# @ghicons/react 🇬🇭

**Ghanaian symbols as React components.**

Adinkra and other tribal symbols, the currency, national emblems and more — fully typed, tree-shakeable, and generated from the [`ghicons`](https://www.npmjs.com/package/ghicons) canonical SVG collection.

> ⚠️ **Moved from `ghicons`.** Through `0.0.1` these components were published as `ghicons`. That name now belongs to the framework-agnostic core. See the [migration guide](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/MIGRATION_v1.md).

---

## Install

```bash
npm install @ghicons/react
```

React 18 or 19, as a peer dependency.

## Use

```tsx
import { GyeNyame, Sankofa } from '@ghicons/react';

function App() {
  return (
    <div>
      <GyeNyame />
      <Sankofa size={40} color="gold" />
    </div>
  );
}
```

Icons use `currentColor`, so they inherit the surrounding text colour:

```tsx
<div style={{ color: 'gold' }}>
  <GyeNyame />
</div>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Numbers are pixels; strings take any CSS unit |
| `color` | `string` | `currentColor` | Icon colour |
| `viewBox` | `string` | `0 0 24 24` | SVG viewBox |
| `className` | `string` | — | Additional CSS classes |
| `style` | `React.CSSProperties` | — | Inline styles |

Components render real `<svg>` elements, so every standard SVG attribute works too:

```tsx
<GyeNyame size="2rem" color="#b8860b" role="img" aria-label="Gye Nyame symbol" onClick={…} />
```

## TypeScript

`IconProps` is exported for building wrappers:

```tsx
import { GyeNyame, type IconProps } from '@ghicons/react';

const IconButton = ({ label, ...icon }: IconProps & { label: string }) => (
  <button><GyeNyame {...icon} />{label}</button>
);
```

## Accessibility

Whether an icon is decorative or meaningful depends on how you use it, so the choice is yours:

```tsx
<GyeNyame role="img" aria-label="Gye Nyame symbol" />   {/* meaningful */}
<button><GyeNyame aria-hidden="true" /> Learn more</button>   {/* decorative */}
```

## Not using React?

Install [`ghicons`](https://www.npmjs.com/package/ghicons) for the raw SVGs and the icon registry — it works with any framework, or none.

## Links

- [Documentation](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/DOCUMENTATION.md)
- [Contributing](https://github.com/ProfessorBlackman/ghicons/blob/master/docs/CONTRIBUTING.md)
- [Browse the icons](https://ghicons.methuselah.site/icons)

## License

MIT © Methuselah Nwodobeh
