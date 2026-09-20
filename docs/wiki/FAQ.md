# FAQ

Answers to the most common questions about using and contributing to GHIcons.

---

## Using GHIcons

**How do I install GHIcons?**

```bash
npm install ghicons
# or
pnpm add ghicons
# or
yarn add ghicons
```

---

**How do I use an icon in my project?**

```tsx
import { GyeNyame } from 'ghicons';

function App() {
  return <GyeNyame size={48} color="gold" />;
}
```

---

**What props do icons accept?**

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height of the icon |
| `color` | `string` | `'currentColor'` | Fill color |
| `className` | `string` | `undefined` | CSS class |
| `style` | `React.CSSProperties` | `undefined` | Inline styles |
| `viewBox` | `string` | `'0 0 24 24'` | SVG viewBox — rarely needs to be overridden |

---

**Can I use GHIcons outside of React?**

Not directly — GHIcons exports React components. If you need plain SVG files, the raw SVGs are available in the `/svg` directory of the [GitHub repository](https://github.com/ProfessorBlackman/ghicons/tree/master/svg) and can be used directly in any project.

Support for framework-agnostic distribution is on the [Roadmap](Roadmap).

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
- Make sure you are importing from `'ghicons'` (not a subpath)
- Check that the icon name is spelled correctly and is PascalCase — e.g. `GyeNyame`, not `gyeNyame` or `gye-nyame`
- Browse the [icon preview](https://ghicons.methuselah.site) to confirm the icon exists in the library
- If the icon exists but the import fails, it may not be exported from the main entry point — [open a bug report](../issues/new?template=bug_report.md)

---

## Contributing

**I want to contribute but I'm not a developer. Can I still help?**

Yes — there are several non-code roles. See [Who We Need](Who-We-Need) for a full breakdown. Cultural researchers, SVG designers, quality reviewers, and community advocates are all valuable contributors.

---

**How do I submit an SVG icon?**

See the [SVG Style Guide](SVG-Style-Guide) for requirements, then follow the [submission instructions](../blob/dev/docs/CONTRIBUTING.md#submitting-an-icon-svg) in `CONTRIBUTING.md`.

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

See the [SVG Style Guide](SVG-Style-Guide) for full requirements. If you fix the issues and push to your branch, the workflow will re-run automatically.

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
