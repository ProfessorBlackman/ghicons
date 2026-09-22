# GHIcons Wiki

Welcome to the GHIcons wiki, the knowledge base for contributors, maintainers, and anyone who wants to understand how the project works.

GHIcons gathers Ghanaian symbols in one place and standardises them — Adinkra and other tribal symbols, the currency, national and state emblems, and in time the marks of Ghanaian organisations and brands — so developers can use Ghanaian visual language anywhere they build, without hunting for it first.

---

## 🧭 The one thing to know

**GHIcons is not a React library that contains SVGs. It is a collection of Ghanaian symbols that ships adapters.**

The SVG files are the canonical source of truth. The framework-agnostic `ghicons` package, the `@ghicons/react` adapter, and every future integration are generated from them.

That is why contributing an icon means contributing an **SVG**, never framework code.

---

## 📚 Wiki Pages

| Page | What's in it |
|---|---|
| [Home](Home) | You are here |
| [Who We Need](Who-We-Need) | Contributor roles and how to get involved |
| [SVG Style Guide](SVG-Style-Guide) | How to draw and prepare icons |
| [Cultural Guidelines](Cultural-Guidelines) | Researching, verifying and representing symbols accurately |
| [Release Process](Release-Process) | How changes move from `dev` to npm |
| [Roadmap](Roadmap) | What's planned and where the project is heading |
| [FAQ](FAQ) | Common questions answered |

## 📖 Documentation in the repository

The technical documentation lives with the code so it stays in step with it.

| Document | What's in it |
|---|---|
| [Icon Specification](../blob/dev/docs/ICON-SPEC.md) | **What makes a valid GHIcon**, canvas, colour, naming, safety, registry, validation |
| [Architecture](../blob/dev/docs/ARCHITECTURE.md) | Repository and package structure, the pipeline, design trade-offs |
| [Development Guide](../blob/dev/docs/DEVELOPMENT.md) | Setup, commands, generation, building, troubleshooting |
| [Contributing](../blob/dev/docs/CONTRIBUTING.md) | The contribution process |
| [Usage Documentation](../blob/dev/docs/DOCUMENTATION.md) | Using GHIcons in a project |
| [Migration Guides](../blob/dev/docs/MIGRATION.md) | Upgrading between releases — one guide per breaking change |

---

## 📦 The packages

| Package | What it is |
|---|---|
| `ghicons` | The framework-agnostic core, optimised SVGs and a machine-readable registry. No dependencies. |
| `@ghicons/react` | React components with TypeScript types. |

Vue, Svelte, Web Components and Flutter adapters are planned. See the [Roadmap](Roadmap).

> ⚠️ **`ghicons` changed meaning at `0.1.0`.** It was the React package; it is now the core. React moved to `@ghicons/react`. See the [migration guide](../blob/dev/docs/MIGRATION_v1.md).

---

## 🚀 Quick Links

| I want to... | Go here |
|---|---|
| Install and use GHIcons | [npm](https://www.npmjs.com/package/ghicons) · [README](../blob/dev/README.md) |
| Submit an SVG icon | [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md) |
| Know what makes a valid icon | [Icon Specification](../blob/dev/docs/ICON-SPEC.md) |
| Request a symbol | [Open an issue](../issues/new?template=icon_request.md) |
| Submit a non-SVG file | [Open an issue](../issues/new?template=icon_submission_non_svg.md) |
| Report a bug | [Open an issue](../issues/new?template=bug_report.md) |
| Contribute cultural research | [Cultural Guidelines](Cultural-Guidelines) |
| Browse open tasks | [Issues](../issues) · [Good first issues](../issues?q=label%3A%22good+first+issue%22) |
| Chat with the community | [Discussions](../discussions) |
| Browse the icons | [ghicons.methuselah.site/icons](https://ghicons.methuselah.site/icons) |

---

## 🌍 About the Project

Ghana has a rich visual language — hundreds of Adinkra symbols, national emblems, the Cedi, the marks of its institutions. Almost none of it is available to developers in one place, in a consistent form.

GHIcons exists to change that. Every symbol added is one more piece of Ghanaian culture that developers can reference, use and share, whether they are building for a Ghanaian audience or simply want their work to reflect a broader world.

And because the collection is framework-independent, the framework a developer happens to use does not decide whether Ghanaian visual language is available to them.

The project is maintained by [Methuselah Nwodobeh](https://github.com/ProfessorBlackman) and built by contributors from the community.

---

## 🤝 New Here?

1. Read [Who We Need](Who-We-Need) to find your role
2. Read the [Icon Specification](../blob/dev/docs/ICON-SPEC.md) if you plan to contribute artwork
3. Read [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md) for the workflow
4. Browse [Good First Issues](../issues?q=label%3A%22good+first+issue%22) if you want to write code
5. Visit [💡 Icon Ideas](../discussions/categories/icon-ideas) to suggest symbols
6. Say hello in [💬 General](../discussions/categories/general)

You do not need to be a developer to contribute. Drawing icons and researching cultural meanings are both first-class contributions.
