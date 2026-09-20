# GHIcons General Documentation

Welcome to the general documentation for **GHIcons**, a React icon library dedicated to Ghanaian cultural symbols and motifs.

## 📋 Table of Contents
- [Introduction](#-introduction)
- [Key Features](#-key-features)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
    - [Basic Usage](#basic-usage)
    - [Styling and Customization](#styling-and-customization)
    - [Using with TypeScript](#using-with-typescript)
- [Icon Categories](#-icon-categories)
    - [Adinkra Symbols](#adinkra-symbols)
    - [General Symbols](#general-symbols)
- [Design Principles](#-design-principles)
- [Accessibility](#-accessibility)
- [Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
- [Support and Feedback](#-support-and-feedback)

---

## 🌟 Introduction

**GHIcons** (Ghanaian Icons) is designed to bring the rich heritage of Ghanaian symbols—such as the famous Adinkra symbols—into the modern web development workflow. Each icon is carefully crafted as a performance-optimized React component, making it easy for developers to integrate Ghanaian culture into their applications with just a few lines of code.

## ✨ Key Features

- **Cultural Authenticity**: Icons representing meaningful Ghanaian symbols.
- **Optimized for Web**: Small bundle size thanks to pre-optimized SVGs.
- **Highly Customizable**: Control size, color, and more via standard React props.
- **Native TypeScript Support**: Full type definitions included out of the box.
- **Framework Compatible**: Works seamlessly with React 18+ and Next.js.

## 🚀 Installation

Install the library using your preferred package manager:

```bash
# npm
npm install ghicons

# pnpm
pnpm add ghicons

# yarn
yarn add ghicons
```

---

## 📖 Usage Guide

### Basic Usage

Import icons individually to keep your bundle size minimal (tree-shaking supported):

```tsx
import { GyeNyame, Sankofa } from 'ghicons';

function MyComponent() {
  return (
    <div>
      <GyeNyame />
      <Sankofa size={40} color="#b30000" />
    </div>
  );
}
```

### Styling and Customization

GHIcons components are wrappers around standard `<svg>` elements and accept all standard SVG attributes.

#### 1. Sizing
The `size` prop can be a `number` (pixels) or a `string` (any valid CSS unit like `rem`, `em`, `vh`).
```tsx
<Adinkrahene size={32} />       {/* 32px */}
<Adinkrahene size="2.5rem" />    {/* 2.5rem */}
```

#### 2. Coloring
By default, icons use `currentColor`, meaning they inherit the text color of their parent element. You can override this using the `color` prop.
```tsx
<div style={{ color: 'blue' }}>
  <Akoben /> {/* This will be blue */}
</div>

<Akoben color="gold" /> {/* This will be gold */}
```

#### 3. Custom Classes and Styles
Pass `className` or `style` objects for advanced CSS control.
```tsx
<Fihankra className="my-custom-icon" style={{ marginTop: '10px' }} />
```

### Using with TypeScript

If you are building a wrapper component or need to type your props:

```tsx
import { GyeNyame, type IconProps } from 'ghicons';

interface MyWrapperProps extends IconProps {
  label: string;
}

const IconButton = ({ label, ...iconProps }: MyWrapperProps) => (
  <button>
    <GyeNyame {...iconProps} />
    {label}
  </button>
);
```

---

## 📂 Icon Categories

### Adinkra Symbols
Our primary collection includes over 100 Adinkra symbols, including:
- **Gye Nyame**: Symbol of the supremacy of God.
- **Sankofa**: Symbol of importance of learning from the past.
- **Duafe**: Symbol of beauty and cleanliness.
- **Dwennimmen**: Symbol of humility together with strength.
- *And many more...*

### General Symbols
Commonly used icons specific to the Ghanaian context:
- **GhanaCedisIcon**: The official symbol for the Ghana Cedi currency.

---

## 🎨 Design Principles

- **Simplicity**: Icons are designed to be legible even at small sizes (e.g., 16px).
- **Consistency**: All icons follow a consistent stroke weight and internal grid.
- **Scalability**: Vector-based symbols ensure clarity at any resolution.

## ♿ Accessibility

GHIcons are rendered as decorative SVGs by default. If an icon conveys meaning, please add an `aria-label` or wrap it in a container with appropriate accessibility attributes:

```tsx
<GyeNyame aria-label="Gye Nyame Symbol" role="img" />
```

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Do I need to import any CSS files?**
A: No, GHIcons uses inline SVG styles. No external CSS is required.

**Q: Can I use GHIcons with Next.js?**
A: Yes! It works perfectly with both Client and Server Components in Next.js.

**Q: How do I request a new symbol?**
A: Please open an issue on our [GitHub repository](https://github.com/ProfessorBlackman/ghicons/issues).

---

## 📞 Support and Feedback

Found a bug or have a suggestion?
- **Issues**: [Report on GitHub](https://github.com/ProfessorBlackman/ghicons/issues)
- **Author**: [Methuselah Nwodobeh](https://github.com/ProfessorBlackman)

Thank you for using GHIcons to celebrate Ghanaian culture! 🇬🇭
