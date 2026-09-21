# Contributing to GHIcons — How You Can Help

GHIcons is a community-driven project. Its goal is to gather Ghanaian symbols — Adinkra and other tribal symbols, the currency, national and state emblems, the marks of Ghanaian movements and organisations — in one place, standardised, and available whatever framework developers happen to use. The collection grows through contributions from people like you.

You don't need to be an expert developer to contribute. There are meaningful roles for designers, researchers, cultural enthusiasts, and coders of all experience levels.

**Contributing an icon means contributing an SVG.** The SVG collection is the canonical source of truth, and the project generates every package from it — so you never need to write framework code to add a symbol.

---

## 🎨 Icon Designers & SVG Artists

**What's needed:** Clean, accurate SVG files of Ghanaian symbols not yet in the library.

Ghana has hundreds of Adinkra symbols, many of which exist only in print or as raster images. If you can draw or trace a clean SVG, your contribution directly expands what developers can build with.

**What you'll be doing:**
- Drawing or tracing Ghanaian symbols as vector graphics
- Ensuring SVGs meet the library's technical requirements (correct viewBox, `currentColor` fill, clean paths)
- Submitting your files via a Pull Request

**Skills helpful:** Inkscape, Adobe Illustrator, Figma, or any vector tool. Familiarity with SVG format is a plus but not required — tools like [Vectorizer.ai](https://vectorizer.ai) can help convert raster images.

**How to get started:** See the [SVG submission guide](../blob/dev/docs/CONTRIBUTING.md#submitting-an-icon-svg) in `CONTRIBUTING.md`.

---

## 🖼️ Symbol Researchers & Cultural Contributors

**What's needed:** Knowledge of Ghanaian symbols, their names, meanings, and accurate visual references.

Cultural accuracy is one of the most important aspects of this project. Symbols can be misrepresented if the person drawing them doesn't know their origin or correct form. Researchers and cultural contributors play a vital role in making sure GHIcons is trustworthy.

**What you'll be doing:**
- Identifying symbols that should be in the library but aren't yet
- Providing accurate names, meanings, and reference images for symbols
- Reviewing submitted icons for cultural accuracy and flagging misrepresentations
- Opening Icon Request issues with well-sourced information

**Skills helpful:** Knowledge of Ghanaian culture, history, or art. Ability to find and cite reliable sources (academic, institutional, or community-verified).

**How to get started:** Head to [💡 Icon Ideas](../discussions/categories/icon-ideas) in Discussions and share what you know, or open an [Icon Request issue](../issues/new?template=icon_request.md).

---

## ✅ Icon Quality Reviewers

**What's needed:** People who can review SVG submissions for visual quality and technical correctness.

Every icon submitted needs to be checked before it's accepted into the library. Reviewers make sure icons look accurate, are technically sound, and meet the library's SVG standards. This is one of the highest-leverage things you can do — a good review saves maintainers time and keeps the library quality high.

**What you'll be doing:**
- Reviewing open Pull Requests that add new SVG icons
- Checking SVGs against the requirements (viewBox, fill, clean paths, naming)
- Comparing the submitted icon against a reference image of the symbol
- Leaving clear, constructive feedback on PRs

**Skills helpful:** A good eye for detail. Basic understanding of SVG structure is helpful but not required — the [Icon Specification](../blob/dev/docs/ICON-SPEC.md) tells you exactly what to look for, and `pnpm run validate` checks the technical rules for you, leaving you free to judge the things a script cannot.

**How to get started:** Browse [open Pull Requests](../pulls) and leave a review comment on any icon submission.

---

## 🔄 SVG Conversion Volunteers

**What's needed:** People to convert non-SVG symbol files (PNG, JPEG, PDF) into clean SVGs.

Many contributors have good reference images of Ghanaian symbols but lack the tools or knowledge to produce an SVG. Conversion volunteers bridge that gap — taking a raster image and producing a clean vector file ready for the library.

**What you'll be doing:**
- Picking up [Icon Submission issues](../issues?q=label%3Aneeds-conversion) labeled `needs-conversion`
- Converting the attached file to SVG using tools like Inkscape or Vectorizer.ai
- Ensuring the result meets the SVG requirements
- Opening a PR with the converted file, crediting the original submitter

**Skills helpful:** Basic experience with Inkscape or any vector tool. Willingness to learn — this is a well-documented, beginner-friendly workflow.

**How to get started:** Browse issues labeled [`needs-conversion`](../issues?q=label%3Aneeds-conversion) and comment on one to claim it.

---

## 🐛 Developers — Bug Fixes & Code Maintenance

**What's needed:** Developers to fix bugs, improve the build pipeline, and maintain code quality.

GHIcons is built with React, TypeScript, Vite, and SVGR. There's always work to be done — from fixing small bugs to improving accessibility, adding test support, or refining the developer experience.

**What you'll be doing:**
- Fixing open bugs reported in [Issues](../issues?q=label%3Abug)
- Adding missing features (e.g. `aria-label` support, `data-testid`, `title` prop)
- Improving TypeScript types
- Maintaining the Storybook stories
- Reviewing code Pull Requests

**Skills helpful:** React, TypeScript, SVG, Vite. New to open source? Issues labeled [`good first issue`](../issues?q=label%3A%22good+first+issue%22) are designed to be approachable for first-time contributors.

**How to get started:** Browse [`good first issue`](../issues?q=label%3A%22good+first+issue%22) or the full [Issues](../issues) list and comment on something you'd like to pick up.

---

## 📣 Community & Advocacy

**What's needed:** People who share GHIcons with others and help grow awareness of the project.

A library is only useful if people know about it. Spreading the word in developer communities — especially Ghanaian and African tech spaces — helps attract contributors, users, and feedback that makes the project better.

**What you'll be doing:**
- Sharing GHIcons in developer communities, forums, and social media
- Writing blog posts or tutorials about using GHIcons in projects
- Posting in [🌍 Show & Tell](../discussions/categories/show-and-tell) when you use GHIcons in a project
- Giving feedback on the library's usability and documentation

**How to get started:** Use GHIcons in a project, then tell someone about it. Post in [Show & Tell](../discussions/categories/show-and-tell) — your project might inspire someone else to contribute.

---

## 🗃️ Metadata & Registry Contributors

**What's needed:** Structured information about the icons already in the collection.

Every GHIcon carries a registry entry — its name, slug, category, and where researched, its meaning, keywords and alternate names. The derived fields generate automatically; the meaningful ones need people. This metadata is what will power icon search, symbol descriptions on the website, and the icon picker tools built on top of GHIcons.

**What you'll be doing:**
- Writing accurate, well-sourced meanings for symbols in the collection
- Adding search keywords so people can find a symbol without knowing its Akan name
- Recording alternate and vernacular names
- Flagging entries where sources disagree, rather than picking one silently

**Skills helpful:** Careful research and clear writing. No coding required — entries are plain structured text.

**How to get started:** Pick a symbol you know well, check the [Cultural Guidelines](Cultural-Guidelines), and open a PR or a Discussion with what you find.

---

## 🌐 Framework Integration Developers

**What's needed:** Developers who can build and maintain adapters for frameworks beyond React.

GHIcons is architected so that adding a framework means writing one generator against the canonical icon collection — not re-drawing a single icon. Vue, Svelte, Web Components and Flutter are all planned, and Web Components in particular would make GHIcons usable in plain HTML, Django, Laravel, WordPress, Astro and Angular in one stroke.

**What you'll be doing:**
- Building a generator that emits idiomatic components for your framework
- Designing an API that fits your ecosystem's conventions while preserving the GHIcons icon contract
- Helping maintain that integration once it ships

**Skills helpful:** Deep familiarity with one target ecosystem. Knowing how its users expect an icon library to behave matters more than knowing GHIcons internals.

**How to get started:** Read the [Architecture](../blob/dev/docs/ARCHITECTURE.md) and the [Roadmap](Roadmap), then open a Discussion about the framework you want to take on. An integration becomes official when someone can maintain it reliably, so say hello before building.

---

## Quick Reference

| Role | Skills needed | Where to start |
|---|---|---|
| Icon Designer | SVG / vector tools | [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md) |
| Cultural Researcher | Knowledge of Ghanaian symbols | [Icon Ideas](../discussions/categories/icon-ideas) |
| Quality Reviewer | Eye for detail | [Open PRs](../pulls) |
| SVG Conversion Volunteer | Inkscape or similar | [`needs-conversion` issues](../issues?q=label%3Aneeds-conversion) |
| Metadata Contributor | Research and clear writing | [Cultural Guidelines](Cultural-Guidelines) |
| Developer | TypeScript, Node | [`good first issue`](../issues?q=label%3A%22good+first+issue%22) |
| Framework Integrator | Vue, Svelte, Flutter, Web Components | [Architecture](../blob/dev/docs/ARCHITECTURE.md) |
| Community Advocate | Enthusiasm | [Show & Tell](../discussions/categories/show-and-tell) |

---

## Not sure where to start?

Drop a message in [💬 General](../discussions/categories/general) and introduce yourself. Tell us what you're good at or what you'd like to learn, and we'll point you in the right direction.

Every contribution — no matter how small — helps build something meaningful. 🇬🇭
