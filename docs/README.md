# GHIcons Documentation

All project documentation lives here. The root [`README.md`](../README.md) stays at the repository root as the npm and GitHub landing page.

---

## Start here

**GHIcons gathers Ghanaian symbols in one place and standardises them** — Adinkra and other tribal symbols, the currency, national and state emblems, and eventually the marks of Ghanaian organisations and brands. The SVG files in `svg/` are the canonical source of truth; every package — the framework-agnostic core, the React adapter, and every future integration — is generated from them.

If you read one document, make it [ICON-SPEC.md](ICON-SPEC.md). Everything else describes machinery built around it.

---

## For users of the library

| Document | What's in it |
|---|---|
| [DOCUMENTATION.md](DOCUMENTATION.md) | Installation, usage with and without React, the registry, props, accessibility, FAQ |
| [MIGRATION.md](MIGRATION.md) | Upgrading from `ghicons` 0.0.x, when the package name meant React |

## For contributors

| Document | What's in it |
|---|---|
| [ICON-SPEC.md](ICON-SPEC.md) | **What makes a valid GHIcon.** Canvas, colour, naming, safety, registry schema, validation |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add an icon or contribute code, and the PR process |
| [SVG Style Guide](wiki/SVG-Style-Guide.md) | How to draw and clean an icon in practice |
| [Cultural Guidelines](wiki/Cultural-Guidelines.md) | Researching, verifying and representing symbols accurately |

## For maintainers

| Document | What's in it |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Repository and package structure, the pipeline, the registry, design trade-offs, current vs. target state |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup, commands, generation, building, testing, CI, troubleshooting |
| [Release Process](wiki/Release-Process.md) | Branches, versioning across packages, publishing, hotfixes |
| [Roadmap](wiki/Roadmap.md) | Milestones and direction |

---

## Wiki pages

[`wiki/`](wiki) holds the pages mirrored to the [GitHub wiki](https://github.com/ProfessorBlackman/ghicons/wiki). Links inside them use wiki-style paths — a link written as `Roadmap` rather than `Roadmap.md` — so they resolve once published to the wiki.

| Page | What's in it |
|---|---|
| [Home](wiki/Home.md) | Wiki landing page and index |
| [Who We Need](wiki/wiki-contributors-needed.md) | Contributor roles and how to get involved |
| [SVG Style Guide](wiki/SVG-Style-Guide.md) | Drawing and preparing icons |
| [Cultural Guidelines](wiki/Cultural-Guidelines.md) | Cultural research and representation |
| [Release Process](wiki/Release-Process.md) | How changes reach npm |
| [Roadmap](wiki/Roadmap.md) | What's planned and in what order |
| [FAQ](wiki/FAQ.md) | Common questions |

---

## Document map

```text
What an icon IS          →  ICON-SPEC.md
How the system is BUILT  →  ARCHITECTURE.md
How to WORK on it        →  DEVELOPMENT.md
How to CONTRIBUTE        →  CONTRIBUTING.md
How to USE it            →  DOCUMENTATION.md
How it gets RELEASED     →  wiki/Release-Process.md
Where it's GOING         →  wiki/Roadmap.md
```

The split is deliberate: the icon specification should stay stable even when the build tooling, packages or repository structure change around it.
