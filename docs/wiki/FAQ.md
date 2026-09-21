# FAQ

Answers to the most common questions about using and contributing to GHIcons.

---

## Using GHIcons

**Which package do I install?**

Depends what you are building with.

```bash
# React
npm install @ghicons/react

# anything else — Vue, Svelte, Angular, Astro, Django, Laravel,
# WordPress, plain HTML — or if you just want the SVG files
npm install ghicons
```

> ⚠️ **`ghicons` changed meaning at `0.1.0`.** It used to be the React package; it is
> now the framework-agnostic core. Upgrading from `0.0.x`? See the
> [migration guide](../blob/dev/docs/MIGRATION.md).

---

**How do I use an icon in my project?**

In React:

```tsx
import { GyeNyame } from '@ghicons/react';

function App() {
  return <GyeNyame size={48} color="gold" />;
}
```

Anywhere else, use the SVG files from the core package:

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Inline the SVG rather than using `<img>` if you want CSS to control its colour.

---

**What props do React icons accept?**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height of the icon |
| `color` | `string` | `'currentColor'` | Fill color |
| `className` | `string` | `undefined` | CSS class |
| `style` | `React.CSSProperties` | `undefined` | Inline styles |
| `viewBox` | `string` | `'0 0 24 24'` | SVG viewBox — rarely needs to be overridden |

---

**Can I use GHIcons outside of React?**

Yes. That is what the `ghicons` core package is for — optimised SVG files plus a
machine-readable registry, with no dependencies and no framework code.

```bash
npm install ghicons
```

```js
import registry from 'ghicons/registry.json';
// [{ name, slug, category, viewBox, file, meaning?, keywords? }, ...]
```

Use the SVGs directly, inline them, feed the registry into your own generator, or build
an icon picker from it.

Dedicated Vue, Svelte, Web Components and Flutter adapters are on the [Roadmap](Roadmap).

---

**What is `registry.json` for?**

It describes the whole collection — every icon's name, slug, category, viewBox and file
path, plus meanings and keywords where they have been researched.

It is what lets one index serve icon search, pickers, documentation, downloads and code
generators, instead of each tool re-deriving the collection for itself.

---

**The icon I want isn't in the library. What do I do?**

[Open an Icon Request issue](../issues/new?template=icon_request.md) and describe the symbol. Include its name, meaning, and a reference image if possible. It will be added to the backlog for contributors to work on.

Alternatively, if you can produce the SVG yourself, submit it directly via a Pull Request — see [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md).

---

**Is GHIcons free to use?**

Yes. GHIcons is MIT licensed. You can use it in personal, commercial, and open source projects without restriction.

---

**How do I control icon color using CSS?**

Icons use `currentColor` by default, which means they inherit the text color of their parent element:

```css
.my-container {
  color: #FCD116; /* icons inside will be Ghana yellow */
}
```

Or use the `color` prop directly:
```tsx
<GyeNyame color="#FCD116" />
```

---

**Why is my icon not showing up after installing?**

A few things to check:
- Make sure you are importing from `'@ghicons/react'` — importing components from `'ghicons'` stopped working at `0.1.0`, see the [migration guide](../blob/dev/docs/MIGRATION.md)
- Check that the icon name is spelled correctly and is PascalCase — e.g. `GyeNyame`, not `gyeNyame` or `gye-nyame`
- Browse the [icon gallery](https://ghicons.methuselah.site/icons) to confirm the icon exists in the library
- If the icon exists but the import fails, it may not be exported from the main entry point — [open a bug report](../issues/new?template=bug_report.md)

---

## Contributing

**I want to contribute but I'm not a developer. Can I still help?**

Yes — there are several non-code roles. See [Who We Need](Who-We-Need) for a full breakdown. Cultural researchers, SVG designers, quality reviewers, and community advocates are all valuable contributors.

---

**How do I submit an SVG icon?**

Read the [Icon Specification](../blob/dev/docs/ICON-SPEC.md) for the rules and the
[SVG Style Guide](SVG-Style-Guide) for how to draw one in practice, then follow
[CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md).

You only ever need to supply an SVG — the pipeline generates every framework output.

---

**I have a PNG/JPEG of a symbol — can I still contribute it?**

Yes. [Open an Icon Submission issue](../issues/new?template=icon_submission_non_svg.md) and attach your file. A volunteer will convert it to SVG and open a PR on your behalf, crediting you.

Alternatively, you can convert it yourself using a free tool like [Vectorizer.ai](https://vectorizer.ai) or [Inkscape](https://inkscape.org), then submit the SVG directly.

---

**My SVG failed the automated validation check. What do I do?**

The validation workflow will show you exactly which checks failed in the PR's **Summary** tab. The most common issues are:

- `fill` is a hardcoded color instead of `currentColor` — change it
- `viewBox` is not `0 0 24 24` — update the SVG
- File name is not PascalCase — rename the file

See the [Icon Specification](../blob/dev/docs/ICON-SPEC.md) for the full rules. If you fix the issues and push to your branch, the workflow re-runs automatically.

Validation covers the **whole collection**, not just your changes, so you may occasionally
see a failure on an icon you did not touch. Flag it rather than working around it.

---

**Can I contribute symbols from other West African countries?**

The primary focus of GHIcons is Ghanaian symbols. However, some symbols are shared across West African cultures — particularly within the broader Akan diaspora. These are welcome, provided the Ghanaian cultural context is clearly documented.

See [Cultural Guidelines](Cultural-Guidelines) for more detail.

---

**I found a symbol that's named or represented incorrectly. What should I do?**

Please [open an issue](../issues/new) with the title format `[Cultural Accuracy] IconName`, describe the problem, and provide a reliable source for the correct representation. This is one of the most important contributions you can make to the project.

---

**How do I claim an issue?**

Leave a comment on the issue saying you'd like to work on it. A maintainer will assign it to you. Please only claim issues you intend to start within a reasonable timeframe — if you get stuck or need to step away, just leave a comment so someone else can pick it up.

---

**Something isn't covered here. Where do I ask?**

Open a question in [🙏 Q&A](../discussions/categories/q-and-a) in Discussions. The community and maintainers are happy to help.
