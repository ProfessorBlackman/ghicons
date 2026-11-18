# FAQ

## Using GHIcons

**Which package do I install?**
`@ghicons/react` for React. `ghicons` for anything else, or if you want the SVG files and registry. (`ghicons` was the React package before `0.1.0` — see the [migration guide](../blob/dev/docs/MIGRATION_v1.md).)

**How do I use an icon?**

```tsx
import { GyeNyame } from '@ghicons/react';
<GyeNyame size={48} color="gold" />
```

```html
<img src="node_modules/ghicons/svg/adinkra/GyeNyame.svg" alt="Gye Nyame">
```

Props are listed in the [usage docs](../blob/dev/docs/DOCUMENTATION.md#react).

**How do I set the colour?**
Icons use `currentColor`, so they inherit the parent's text colour, or pass `color` in React. For raw SVGs, inline them — an `<img>` can't inherit CSS colour.

**What is `registry.json`?**
An index of every icon, for search, pickers, docs or your own generator:

```js
// { version, count, categories, icons: [
//   { name, slug, category, viewBox, file,
//     meaning?, note?, keywords?, aliases?, references? } ] }
```

The first five icon fields are always present. Treat the rest as optional — a new icon can arrive before its research: `icon.meaning ?? icon.name`.

**Where do the meanings come from, and how do I correct one?**
Every meaning cites its sources — mostly Willis's *Adinkra Dictionary* and Arthur's *Cloth as Metaphor*; the flag, Black Star and cedi cite the Permanent Mission of Ghana to the UN and the Bank of Ghana. They have **not yet been reviewed** by people who know the symbols first-hand, and a few rest on a single site. To correct one, edit `metadata/<category>/<Name>.json` or open an issue with the fix and its source. See [Cultural Guidelines](Cultural-Guidelines).

**What happened to `registry.generated`?**
It was renamed `registry.count` in `0.2.0`. See [MIGRATION_v2.md](../blob/dev/docs/MIGRATION_v2.md).

**My icon isn't showing up.**
Import from `@ghicons/react`, not `ghicons`. Check the PascalCase spelling (`GyeNyame`) and that the icon exists in the [gallery](https://ghicons.methuselah.site/icons). Still broken? [File a bug](../issues/new?template=bug_report.yml).

**Is it free?**
Yes, MIT licensed, including commercial use.

## Contributing

**The symbol I want is missing.**
[Request it](../issues/new?template=icon_request.md) with its name, meaning and a reference image — or draw it and open a PR.

**How do I submit an icon?**
Read the [Icon Specification](../blob/dev/docs/ICON-SPEC.md) and [SVG Style Guide](SVG-Style-Guide), then follow [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md). You only supply the SVG.

**I only have a PNG/JPEG.**
[Attach it to an issue](../issues/new?template=icon_submission_non_svg.md) and a volunteer will convert it, crediting you. Or convert it yourself with [Inkscape](https://inkscape.org) or [Vectorizer.ai](https://vectorizer.ai).

**My SVG failed validation.**
The PR's Summary tab shows which checks failed — usually a hardcoded `fill`, a `viewBox` other than `0 0 24 24`, or a non-PascalCase filename. Validation covers the whole collection, so if an icon you didn't touch fails, flag it.

**I'm not a developer. Can I help?**
Yes — research, design, reviewing and conversion all help. Most useful right now: checking the meanings already recorded, since a better-sourced correction is worth more than a new icon. See [How You Can Help](https://github.com/ProfessorBlackman/ghicons/wiki/Contributing-to-GHIcons-%E2%80%94-How-You-Can-Help).

**Can I add symbols from other West African countries?**
Shared symbols are welcome if their Ghanaian context is documented. See [Cultural Guidelines](Cultural-Guidelines).

**An icon is named or drawn wrong.**
Open an issue titled `[Cultural Accuracy] IconName` with a reliable source. A wrong or thin meaning counts too, since it ships to every project using the registry — or fix it directly in `metadata/<category>/<Name>.json`.

**How do I claim an issue?**
Comment on it and a maintainer will assign you. If you can't continue, say so in a comment.

Anything else: ask in [Q&A](../discussions/categories/q-and-a).
