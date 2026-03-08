# GHIcons

[![Build Status](https://img.shields.io/github/actions/workflow/status/ProfessorBlackman/ghicons/ci.yml?branch=master&label=build)](https://github.com/ProfessorBlackman/ghicons/actions)
[![npm version](https://img.shields.io/npm/v/ghicons)](https://www.npmjs.com/package/ghicons)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ProfessorBlackman/ghicons/blob/master/LICENSE)

GHIcons is a React icon library that provides high-quality Ghanaian icons and symbols (such as Adinkra symbols) for use in React projects.

## Features

- **Adinkra Symbols**: A wide collection of traditional Adinkra symbols.
- **Customizable**: Easy to change size, color, and apply custom styles.
- **TypeScript Support**: Fully typed for a great developer experience.
- **Lightweight**: Optimized SVG components.
- **Storybook Integration**: Explore and test icons in isolation.
- **Contributor Documentation**: Detailed guide for developers to understand the project structure and generation pipeline.

## 💬 Community

Have questions or ideas? Join the conversation in [GitHub Discussions](https://github.com/ProfessorBlackman/ghicons/discussions).

## 📚 Documentation

For general usage and library overview, see our [General Documentation](DOCUMENTATION.md).

## 📖 Contributor Guide

If you're looking to contribute or understand the project's internals, please check out our [Contributor's Guide](CONTRIBUTING.md).

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