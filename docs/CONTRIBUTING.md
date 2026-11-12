# Contributing to GHIcons 🇬🇭

Contributing an icon means contributing an **SVG** — the pipeline generates every package from it, so you never write framework code.

Before drawing anything, read the [Icon Specification](ICON-SPEC.md) (the rules) and the [SVG Style Guide](wiki/SVG-Style-Guide.md) (how to draw).

## What you can contribute

- **New icons** — Ghanaian symbols not yet in the collection.
- **Icon fixes** — proportions, cleaner paths, legibility, faithfulness.
- **Cultural research** — better meanings and sources for existing icons. No drawing required.
- **Code** — the pipeline, validator, tests, playground, accessibility, framework adapters.
- **Documentation.**

## Adding an icon

1. **Check it doesn't exist.** Unsure it belongs? Open a [Discussion](https://github.com/ProfessorBlackman/ghicons/discussions) first.
2. **Research it** — name, alternate names, meaning, traditional form, citable sources. Don't invent meanings; note uncertainty. See [Cultural Guidelines](wiki/Cultural-Guidelines.md).
3. **Pick a category** — `svg/adinkra/`, `svg/general/` or `svg/national/`. Discuss before adding a new one.
4. **Draw the SVG** to spec:
   ```xml
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
     <path d="…" />
   </svg>
   ```
   `viewBox` exactly `0 0 24 24`; `currentColor` only; vector only; no scripts, imports or remote references.
5. **Name it** in PascalCase with no numeric or `Icon` suffix (`GyeNyame.svg`). The name becomes the identifier everywhere, and renaming later is breaking.
6. **Add metadata** (optional) in `metadata/<category>/<Name>.json`:
   ```json
   { "meaning": "…", "keywords": ["…"], "aliases": ["…"], "references": ["…"] }
   ```
   A `meaning` requires `references`. Rules: [ICON-SPEC.md](ICON-SPEC.md#authoring-metadata).

You can also improve metadata for existing icons: some rest on a single reference site, and a source like Willis, Arthur, Rattray or a Ghanaian institution is a real improvement. Or open an issue with your research and a maintainer will record it.

## Checking your work

```bash
pnpm install
pnpm run generate     # required on a fresh clone
pnpm run validate     # catches everything CI would reject
pnpm run dev          # look at it in the playground
pnpm run lint && pnpm run build
```

Then look at it: recognisable, legible at 16px and 48px, inherits colour, not clipped, consistent with its neighbours. If generated output looks wrong, fix the SVG or the generator — never the generated file.

## Opening a pull request

```bash
git checkout -b feat/add-nkyinkyim
git add svg/ metadata/
git commit -m "feat: add Nkyinkyim icon"
```

Open the PR against `dev`. Commit source only — untracked generated files are normal; don't add them. Include the symbol's category, cultural context and references in the description. The PR template has the checklist.

## Code contributions

See [DEVELOPMENT.md](DEVELOPMENT.md) and [ARCHITECTURE.md](ARCHITECTURE.md). Keep each PR to one concern, include tests for new behaviour, keep generation reproducible, update docs, and call out breaking changes.

Changes to the spec, naming, registry schema or generated APIs affect every consumer — open an issue or discussion first.

## Don't commit

Generated files (components, stories, `registry.json`, `dist/`), build artifacts, editor config, scratch SVGs, screenshots, unrelated formatting changes, or credentials.

## Getting help

Ask in [Discussions](https://github.com/ProfessorBlackman/ghicons/discussions) or open a draft PR for early feedback. Looking for a task? Try [good first issues](https://github.com/ProfessorBlackman/ghicons/issues?q=label%3A%22good+first+issue%22).
