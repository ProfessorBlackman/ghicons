# Contributing to GHIcons

Thank you for your interest in contributing to GHIcons! This library exists to bring Ghanaian cultural symbols — Adinkra, national icons, and more — into the React ecosystem. Every contribution helps grow that mission.

There are several ways to get involved, no matter your skill level.

---

## Ways to Contribute

### 1. 🎨 Submit a New Icon (SVG)
The most impactful contribution. If you have an SVG of a Ghanaian symbol that isn't in the library yet, we want it.

### 2. 🖼️ Submit a Non-SVG Icon for Conversion
Have a PNG, JPEG, or other format of a symbol? Submit it and a maintainer or volunteer will handle the SVG conversion.

### 3. ✅ Review & Quality-Check Icon Submissions
Help review open PRs for icon quality. No coding required — just a good eye.

### 4. 💡 Request an Icon
Can't make an SVG but know a symbol that should be in the library? Open a request issue.

### 5. 🐛 Code Maintenance & Bug Fixes
Fix bugs, improve the build pipeline, improve TypeScript types, or work on the website.

---

## Submitting an Icon (SVG)

### SVG Requirements

All icons must meet these standards before they'll be accepted:

| Requirement           | Detail                                                                                                                                |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **viewBox**           | Must be `0 0 24 24`                                                                                                                   |
| **Width & Height**    | Must be `24` (or omitted — the consumer controls size via props)                                                                      |
| **Fill**              | Use `fill='currentColor'` so the icon inherits color from the parent. Do **not** hardcode colors like `fill='#fff'` or `fill='black'` |
| **No raster content** | Pure vector paths only. No embedded PNGs or base64 images                                                                             |
| **Clean paths**       | Remove unnecessary groups, transforms, metadata, and editor artifacts                                                                 |
| **Single color**      | Icons should be monochrome. Multi-color icons are not currently supported                                                             |
| **Naming**            | File name should be `PascalCase` and descriptive, e.g. `GyeNyame.svg`, `GhanaCedis.svg`                                               |

#### Example of a valid icon SVG

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.2431 3.37796L16.162 1.29691L11.9999 5.45901..." />
</svg>
```

> ⚠️ **Important:** Change `fill='#fff'` or any hardcoded color to `fill='currentColor'` before submitting. This is the most common reason PRs are sent back for revision.

### How to Submit

1. **Fork** the repository and create a branch: `git checkout -b icon/your-icon-name`
2. Place your SVG file(s) in the `/svg` directory
3. Open a **Pull Request** with:
   - The name of the symbol and its cultural origin/meaning
   - A reference image or source (helps with quality review)
4. A maintainer will review the SVG, and if it passes, generate the React component

---

## Submitting a Non-SVG Icon

If you have a PNG, JPEG, PDF, or other format of a symbol:

1. Open an issue using the **"Icon Submission (non-SVG)"** template
2. Attach the file and describe the symbol (name, meaning, source)
3. A volunteer will convert it to a clean SVG and open a PR on your behalf, crediting you

> You can also convert it yourself using a free tool like [Inkscape](https://inkscape.org/) or [Vectorizer.ai](https://vectorizer.ai/), then follow the SVG submission steps above.

---

## Requesting an Icon

Don't have a file but want to see a specific symbol added?

1. Open an issue using the **"Icon Request"** template
2. Include: the symbol name, its meaning, and ideally a reference image or link
3. It'll be added to the backlog for contributors to pick up

---

## Reviewing Icon Quality

Icon review is one of the most valuable things you can do. To review an open icon PR:

- Check that the SVG meets all the requirements listed above (viewBox, fill, no raster content, clean paths)
- Compare the rendered icon against a reference image of the symbol
- Leave a comment on the PR with your findings — approve it, or describe what needs to change

You don't need to be a maintainer to leave a review comment. Community feedback is very welcome.

---

## Code Contributions

For bug fixes, build improvements, or new features:

1. Check the [Issues](https://github.com/ProfessorBlackman/ghicons/issues) tab for open tasks
2. Comment on an issue to claim it before starting work
3. Fork the repo, make your changes, and open a PR against `master`
4. Follow the existing code style (TypeScript, ESLint config is included)

For larger changes, please open an issue to discuss the approach first.

---

## Need Help?

Open a [Discussion](../../discussions) or leave a comment on any issue. We're a friendly community and happy to help new contributors get started.

---

*GHIcons is MIT licensed. By contributing, you agree that your contributions will be licensed under the same license.*