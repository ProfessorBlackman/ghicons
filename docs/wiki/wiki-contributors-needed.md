# Contributing to GHIcons — How You Can Help

You don't need to be a developer to help. Contributing an icon means contributing an SVG — never framework code.

**The biggest need is review.** All 106 icons have sourced meanings (Willis, Arthur, Rattray, institutions), but nobody who knows the symbols first-hand has checked them, and about a dozen rest on a single reference site. One icon's research is one file at `metadata/<category>/<Name>.json`, or put it in an issue for a maintainer to record.

| Role | What you'd do | Start here |
|---|---|---|
| **Icon designer** | Draw or trace symbols as clean SVGs | [CONTRIBUTING.md](../blob/dev/docs/CONTRIBUTING.md#adding-an-icon) |
| **Cultural researcher** | Suggest missing symbols; supply names, meanings and sources; flag misrepresentations | [Icon Ideas](../discussions/categories/icon-ideas) · [Icon request](../issues/new?template=icon_request.md) |
| **Metadata reviewer** | Check the meanings recorded for symbols you know; fix what's wrong or thin; replace weak citations; add missing readings, keywords and vernacular names | [Icon browser](https://ghicons.methuselah.site/icons) · [Cultural Guidelines](Cultural-Guidelines) |
| **Twi reader** | Check proverbs and names, which are quoted as sources spelled them | [Cultural Guidelines](Cultural-Guidelines) |
| **Quality reviewer** | Review icon PRs against reference images and the spec | [Open PRs](../pulls) · [Icon Specification](../blob/dev/docs/ICON-SPEC.md) |
| **Conversion volunteer** | Turn submitted PNG/JPEG files into SVGs, crediting the submitter | [`needs-conversion` issues](../issues?q=label%3Aneeds-conversion) |
| **Developer** | Fix bugs; add `aria-label`, `title` and `data-testid` support; tests; tooling | [Good first issues](../issues?q=label%3A%22good+first+issue%22) |
| **Framework integrator** | Build and maintain a Vue, Svelte, Web Components or Flutter adapter | [Architecture](../blob/dev/docs/ARCHITECTURE.md) — open a Discussion before building |
| **Advocate** | Share GHIcons, write tutorials, give feedback | [Show & Tell](../discussions/categories/show-and-tell) |

Useful skills: vector tools (Inkscape, Illustrator, Figma) for design; knowledge of Ghanaian culture and good sourcing for research; TypeScript and Node for code.

Not sure where to start? Introduce yourself in [General](../discussions/categories/general).
