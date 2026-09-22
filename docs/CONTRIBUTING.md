# Contributing to GHIcons 🇬🇭

Thank you for wanting to contribute. GHIcons gathers Ghanaian symbols in one place and standardises them — Adinkra and other tribal symbols, the currency, national and state emblems, the marks of Ghanaian movements and organisations — so developers stop hunting for a usable copy of each one. It grows through contributions.

**The most important thing to know:** contributing an icon means contributing an **SVG**. You never need to write React, Vue or any framework code. The pipeline generates every output from your SVG.

---

## 📋 Table of Contents

- [Before You Start](#-before-you-start)
- [What Can I Contribute?](#-what-can-i-contribute)
- [Project Structure](#-project-structure)
- [Contribution Workflow](#-contribution-workflow)
- [Adding a New Icon](#-adding-a-new-icon)
- [Cultural Accuracy](#-cultural-accuracy)
- [Testing Your Icon](#-testing-your-icon)
- [Making a Pull Request](#-making-a-pull-request)
- [Contributing Code](#-contributing-code)
- [Changing the Icon System](#-changing-the-icon-system)
- [What Not to Commit](#-what-not-to-commit)
- [Checklists](#-checklists)
- [Development Commands](#-development-commands)
- [Getting Help](#-getting-help)

---

## 🧭 Before You Start

Two documents carry the rules; this one carries the process.

- **[ICON-SPEC.md](ICON-SPEC.md)** — what makes a valid GHIcon. Read this before drawing anything.
- **[SVG Style Guide](wiki/SVG-Style-Guide.md)** — how to draw and clean an icon in practice.

You do not need to read the architecture docs to contribute an icon.

---

## 💡 What Can I Contribute?

### 🎨 New icons

A Ghanaian symbol that is not in the collection yet. The highest-value contribution, and the one that needs no coding.

### ✏️ Improvements to existing icons

Corrected proportions, cleaner paths, better legibility at small sizes, a more faithful representation of the original symbol.

### 🇬🇭 Cultural research

Meanings, context, references and corrections for symbols already in the collection. You do not need to draw anything — accurate documentation is a real contribution, and one the project genuinely needs. `pnpm run validate` prints how many icons have a documented meaning; the gap is large. Add one file under `metadata/`, or open an issue with the research and a maintainer will record it — see [Add metadata](#6-add-metadata-optional-but-valuable).

### 📝 Documentation

Clarifications, examples, fixes, guides.

### 🛠️ Tooling

The pipeline, the validator, the registry, the generators, the playground, tests.

### 🌐 Framework integrations

Vue, Svelte, Web Components and Flutter adapters are planned. Experience in any of those ecosystems is welcome — see the [Roadmap](wiki/Roadmap.md).

---

## 📁 Project Structure

What matters to a contributor:

```text
ghicons/
├── svg/                    ← SOURCE OF TRUTH. Add icons here.
│   ├── adinkra/
│   ├── general/
│   └── national/
├── metadata/               ← Meanings, keywords, aliases
├── tools/                  ← The pipeline
├── packages/
│   ├── core/               → ghicons
│   └── react/              → @ghicons/react   (components: GENERATED)
└── docs/
```

The distinction that matters:

```text
svg/                         ← source, hand-authored
metadata/                    ← source, hand-authored
packages/*/src/icons/**      ← generated
packages/*/stories/**        ← generated
registry.json                ← generated
```

**Never hand-edit generated files.** They are rebuilt from source on every run, so edits are silently destroyed — and if a generated file is wrong, the bug is in the SVG or the generator, not in the output.

---

## 🔄 Contribution Workflow

```text
Fork → branch → change the SOURCE → validate → generate → review → PR → review → merge
```

---

## 🎨 Adding a New Icon

### 1. Check it does not already exist

Search the collection first. Avoid duplicate representations unless there is a clear reason for a variant — and note that GHIcons has no variants system yet, so "two versions of one symbol" currently has nowhere to live.

Unsure whether a symbol belongs? Open a discussion before investing time in drawing it.

### 2. Research the symbol

For culturally significant symbols this is part of the work, not a formality. Try to establish:

- the symbol's name, and alternate names
- its cultural context
- its meaning, or the documented interpretations of it
- how it is traditionally represented
- references you can cite

**Do not invent a meaning because an interpretation sounds plausible.** If the meaning is uncertain or contested, say so in the pull request. See [Cultural Guidelines](wiki/Cultural-Guidelines.md).

### 3. Choose a category

```text
svg/adinkra/     Traditional Adinkra symbols
svg/general/     Everyday Ghanaian-context icons
svg/national/    National emblems
```

If it fits none of these, discuss it before adding a category.

### 4. Draw the SVG

Follow [ICON-SPEC.md](ICON-SPEC.md). The essentials:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="…" />
</svg>
```

- `viewBox` exactly `0 0 24 24`
- `fill="currentColor"` — **never** a colour value, not even `#fff`
- vector geometry only; no embedded images or base64
- no `<script>`, no `@import`, no remote references
- PascalCase filename, no numeric suffix, no `Icon` suffix

The [SVG Style Guide](wiki/SVG-Style-Guide.md) walks through drawing, canvas use, path cleanup and tools.

### 5. Name the file

```text
svg/adinkra/GyeNyame.svg
svg/general/GhanaCedi.svg
```

The filename becomes the identifier in every integration and the slug in the registry, so renaming later is a breaking change. Get it right now.

### 6. Add metadata (optional but valuable)

Meanings, keywords, aliases and references go in `metadata/`, one file per icon, mirroring the icon's path. This is what powers search and the symbol descriptions on the website.

```text
svg/adinkra/Sankofa.svg          the artwork
metadata/adinkra/Sankofa.json    what is known about it
```

```json
{
  "meaning": "…",
  "keywords": ["…"],
  "aliases": ["…"],
  "references": ["…"]
}
```

Every field is optional and the file can arrive later than the icon — but a `meaning` must come with the `references` it was taken from, or validation fails. Field rules: [ICON-SPEC.md](ICON-SPEC.md#authoring-metadata). What counts as a reliable source: [Cultural Guidelines](wiki/Cultural-Guidelines.md).

You can also correct a symbol **already in the collection** without drawing anything. Every icon now carries a meaning, but they are not equally well sourced: some rest on a single reference site, and a correction citing Willis, Arthur, Rattray or a Ghanaian institution is a real improvement. So is fixing a translation, adding a proverb, or telling us an entry is simply wrong.

---

## 🇬🇭 Cultural Accuracy

Many GHIcons are real cultural symbols, which makes accuracy part of quality.

**Research before drawing.** Use reliable references.

**Preserve the symbol's identity.** The goal is a usable digital representation, not a redesign. Simplify for legibility; do not alter what makes the symbol recognisable.

**Document uncertainty.** Sources disagree. When they do, do not silently present one reading as settled fact.

**Cite your references.** In the PR description:

```markdown
## Cultural References
- Source describing the symbol and its traditional meaning
- Reference image showing the traditional representation
- Additional historical or cultural source
```

The project would rather have a smaller accurate collection than a larger questionable one. See [Cultural Guidelines](wiki/Cultural-Guidelines.md).

---

## 🧪 Testing Your Icon

```bash
pnpm run validate     # check against the specification
pnpm run generate     # build the registry and framework outputs
pnpm run dev          # look at it in the playground
pnpm run lint
pnpm run build
```

`pnpm run validate` catches everything CI would reject, so run it before pushing.

Then actually **look** at the icon:

- Does it look correct, and recognisably like the symbol?
- Does it read at 16px? At 48px?
- Does it inherit colour correctly?
- Does it sit comfortably beside neighbouring icons — similar visual weight, similar use of the canvas?
- Is any part clipped at the canvas edge?

### If the generated output looks wrong

Generated files are useful for checking whether the pipeline understood your SVG. If something is off:

1. Check the SVG first.
2. Then check whether the generator is behaving correctly.
3. Fix whichever is actually wrong.
4. Regenerate.

Never patch generated code to make one icon work.

---

## 🌿 Making a Pull Request

```bash
git checkout -b feat/add-nkyinkyim
git add svg/ metadata/
git commit -m "feat: add Nkyinkyim icon"
git push origin feat/add-nkyinkyim
```

Open a PR against `dev`.

Note that you commit **source only**. Generated files are not tracked, so `git status` showing untracked generated output is normal — do not add it.

### PR description

```markdown
## What does this PR do?
Adds the Nkyinkyim symbol to the Adinkra collection.

## Category
Adinkra

## Cultural Context
Nkyinkyim represents initiative, dynamism and versatility — the twists and
turns of life's journey.

## References
- [Reference 1]
- [Reference 2]

## Checklist
- [x] Follows the icon specification
- [x] PascalCase filename
- [x] viewBox is `0 0 24 24`
- [x] Uses `currentColor`
- [x] No raster content or external resources
- [x] `pnpm run validate` passes
- [x] Generates, lints and builds cleanly
- [x] Reviewed visually at 16px and 48px
```

---

## 🛠️ Contributing Code

GHIcons is more than a collection — there is real engineering in the pipeline, the registry, the validator and the integrations.

Good places to start:

- Tests for pipeline invariants (regeneration is reproducible; deletions propagate)
- Validator improvements and clearer error messages
- Registry and metadata tooling
- Playground and Storybook improvements
- Accessibility work in the React integration
- A new framework adapter

Read [DEVELOPMENT.md](DEVELOPMENT.md) for setup and [ARCHITECTURE.md](ARCHITECTURE.md) for how the pieces fit.

Keep PRs focused. One concern per PR reviews far faster than a mixed one.

---

## 🧱 Changing the Icon System

Changes to the specification, naming rules, registry schema, generated APIs or distribution formats affect **every** icon and every consumer. Open an issue or discussion first.

When proposing one:

1. State the problem being solved.
2. State the proposed approach.
3. Assess backwards compatibility, and say plainly if it is breaking.
4. Update validation and generation together — a rule the validator does not enforce is only a comment.
5. Update the affected documentation.
6. Regenerate everything and review the full diff.
7. Build and test every package.

---

## 🚫 What Not to Commit

- Generated files (components, stories, `registry.json`, `dist/`)
- Local build artifacts
- Machine-specific editor configuration
- Temporary SVG exports or working files
- Development screenshots
- Unrelated formatting churn
- Credentials or API keys

Unsure whether something belongs? Check [ARCHITECTURE.md](ARCHITECTURE.md) or ask.

---

## ✅ Checklists

### Icon contributions

- [ ] Icon does not already exist in the collection
- [ ] Symbol researched; meaning documented or uncertainty noted
- [ ] References included in the PR
- [ ] Placed in the correct category
- [ ] `viewBox="0 0 24 24"`
- [ ] `currentColor` only — no colour values anywhere
- [ ] Vector only; no scripts or external references
- [ ] PascalCase filename, no numeric or `Icon` suffix
- [ ] `pnpm run validate` passes
- [ ] Generates, lints and builds cleanly
- [ ] Reviewed visually at small and large sizes
- [ ] No generated files committed

### Code contributions

- [ ] Change is focused on one concern
- [ ] Lint passes
- [ ] Tests pass; new behaviour has tests
- [ ] Every package builds
- [ ] Generation still reproducible
- [ ] Documentation updated
- [ ] Breaking changes called out explicitly

---

## 💻 Development Commands

```bash
pnpm install              # install (pnpm required — it is a workspace)

pnpm run validate         # check the collection against the spec
pnpm run generate         # registry + all framework outputs
pnpm run dev              # playground
pnpm run storybook        # React component reference
pnpm run build            # build every package
pnpm run lint
pnpm test
```

A fresh clone has no generated files — run `pnpm run generate` before anything else.

Full reference: [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 🤝 Getting Help

Stuck, unsure whether a symbol fits, or want feedback on an SVG before polishing it? Open a [Discussion](https://github.com/ProfessorBlackman/ghicons/discussions) or a draft PR and ask. We would much rather help you get it right than have you stuck.

- [Discussions](https://github.com/ProfessorBlackman/ghicons/discussions)
- [Issues](https://github.com/ProfessorBlackman/ghicons/issues)
- [Good first issues](https://github.com/ProfessorBlackman/ghicons/issues?q=label%3A%22good+first+issue%22)

---

## 🇬🇭 The Bigger Picture

Every symbol added to GHIcons is one more piece of Ghanaian culture that developers can reach for — whether they are building for a Ghanaian audience or simply want their work to reflect a broader world.

The architecture exists to serve one principle:

> **One canonical icon. Many ways to use it.**

Your contribution reaches every platform GHIcons supports. Thank you for making the collection better.
