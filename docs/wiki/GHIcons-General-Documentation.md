# GHIcons General Documentation

An overview of GHIcons and what each wiki page covers.

## What GHIcons is

A standardised collection of Ghanaian symbols — Adinkra and other cultural symbols, the currency, national emblems — for developers. Every icon is a 24×24 monochrome SVG using `currentColor`, plus a registry entry with its name, category, and a sourced meaning.

## How it works

```text
svg/<category>/<Name>.svg + metadata/<category>/<Name>.json   (hand-authored)
        ▼  validate → optimise → normalise → registry → generate
ghicons (SVGs + registry.json)        @ghicons/react (components)
```

The SVGs are the source of truth; packages are generated from them. So contributing an icon means contributing an SVG, and contributing research means editing one JSON file. Vue, Svelte, Web Components and Flutter adapters are planned.

## Wiki pages

| Page | Read it if you want to… |
|---|---|
| [Home](Home) | Find your way around and reach common links |
| [How You Can Help](https://github.com/ProfessorBlackman/ghicons/wiki/Contributing-to-GHIcons-%E2%80%94-How-You-Can-Help) | Pick a contributor role, coding or not |
| [SVG Style Guide](SVG-Style-Guide) | Draw and clean up an icon |
| [Cultural Guidelines](Cultural-Guidelines) | Research a symbol and source its meaning |
| [Release Process](Release-Process) | Understand versioning and how releases reach npm |
| [Roadmap](Roadmap) | See what's done and what's next |
| [FAQ](FAQ) | Get quick answers on usage and contributing |

## Repository docs

The technical rules live with the code:

- [Icon Specification](../blob/dev/docs/ICON-SPEC.md) — what makes a valid icon (the authoritative rules)
- [Contributing](../blob/dev/docs/CONTRIBUTING.md) — the submission process
- [Usage](../blob/dev/docs/DOCUMENTATION.md) — installing and using the packages
- [Architecture](../blob/dev/docs/ARCHITECTURE.md) and [Development](../blob/dev/docs/DEVELOPMENT.md) — for maintainers
- [Migration](../blob/dev/docs/MIGRATION.md) — upgrade guides
