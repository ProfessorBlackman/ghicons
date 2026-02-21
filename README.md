# GHIcons

GHIcons is a React icon library that provides high-quality Ghanaian icons and symbols (such as Adinkra symbols) for use in React projects.

## Features

- **Adinkra Symbols**: A wide collection of traditional Adinkra symbols.
- **Customizable**: Easy to change size, color, and apply custom styles.
- **TypeScript Support**: Fully typed for a great developer experience.
- **Lightweight**: Optimized SVG components.
- **Storybook Integration**: Explore and test icons in isolation.

## Installation

```bash
npm install ghicons
# or
pnpm add ghicons
# or
yarn add ghicons
```

## Usage

```tsx
import { GyeNyame, GhanaCedisIcon } from 'ghicons';

function App() {
  return (
    <div>
      <GyeNyame size={48} color="gold" />
      <GhanaCedisIcon size="2rem" color="green" />
    </div>
  );
}
```

### Props

All icons accept the following props:

| Prop        | Type                  | Default          | Description                                           |
|-------------|-----------------------|------------------|-------------------------------------------------------|
| `size`      | `number \| string`    | `24`             | The size of the icon (numbers are treated as pixels). |
| `color`     | `string`              | `'currentColor'` | The color of the icon.                                |
| `viewBox`   | `string`              | `'0 0 24 24'`    | The SVG viewBox attribute.                            |
| `className` | `string`              | `undefined`      | Additional CSS classes.                               |
| `style`     | `React.CSSProperties` | `undefined`      | Inline styles.                                        |

## License

MIT © [Methuselah Nwodobeh](https://github.com/ProfessorBlackman/ghicons)