# Architecture

How GHIcons is put together. For icon rules see [ICON-SPEC.md](ICON-SPEC.md); for usage see [DOCUMENTATION.md](DOCUMENTATION.md).

**The SVG collection is the source of truth. Everything else is generated from it.** GHIcons is a collection of Ghanaian symbols that ships a React adapter — not a React library containing SVGs.

```text
svg/**/*.svg + metadata/**/*.json        (hand-authored)
                 │
           Icon pipeline
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
   ghicons            @ghicons/react
 SVGs + registry     generated components
      │                     │
 website, CDN,         React apps,
 any framework          Storybook
```

## Repository layout

A pnpm monorepo. `svg/` sits at the root because it belongs to every package equally.

```text
ghicons/
├── svg/                    CANONICAL artwork, one directory per category
├── metadata/               Authored research, one JSON per icon, mirroring svg/
├── tools/
│   ├── canonical.mjs         SVG → canonical icon representation
│   ├── metadata.mjs          Metadata contract and checks
│   ├── validate.mjs          Spec enforcement (local + CI)
│   ├── build-core.mjs        → the ghicons package, incl. registry.json
│   ├── verify-packages.mjs   Pre-publish gate
│   ├── clean.mjs             Delete generated output
│   ├── clean-filenames.mjs   Normalise filenames to PascalCase
│   └── generators/           react.mjs, stories.mjs
├── packages/
│   ├── core/               → npm: ghicons
│   └── react/              → npm: @ghicons/react
│       └── src/props.ts      hand-written React contract
├── playground/             Vite dev app: icon browser
├── .storybook/
├── .github/workflows/
├── docs/                   (wiki/ is mirrored to the GitHub wiki)
└── ghicons_website/        Public site — separate git repository
```

### Hand-written vs. generated

Committed: `svg/`, `metadata/`, `tools/`, `playground/`, `packages/react/src/props.ts`.

Generated and git-ignored: `packages/core/{svg,registry.json,index.*}`, `packages/react/src/icons/`, `packages/react/src/index.ts`, `packages/react/stories/`, `packages/react/dist/`.

A fresh clone has no components or registry until `pnpm run generate` runs. CI regenerates before every build, so published output can't drift from source.

## Packages

**`ghicons`** — optimised SVGs, `registry.json`, and ESM/CJS accessors (`getIcon`, `iconsByCategory`, …). No dependencies. The accessors inline the registry so they work in browsers too. The CDN, website and future adapters build on this package.

**`@ghicons/react`** — generated `.tsx` components and the `IconProps` type. `react` is a peer dependency.

**Planned** — `@ghicons/vue`, `@ghicons/svelte`, `@ghicons/web-components`, and a Flutter package. Each is a generator over the same collection, never a copy of the artwork.

## The pipeline

```text
1. VALIDATE    enforce ICON-SPEC on the whole collection
2. OPTIMISE    SVGO, without changing appearance
3. NORMALISE   → { name, slug, category, viewBox, body, metadata }
4. REGISTRY    rebuild registry.json from scratch
5. GENERATE    per-target emitters (core, React, stories)
```

Stages 1–4 are framework-neutral, so a new framework needs one new emitter, not a new pipeline. The pipeline must be:

- **Reproducible** — `clean` + `generate` produces byte-identical output.
- **Complete** — indexes are rebuilt, never appended to, so deleted icons leave no stale exports.

## The registry

Generated at stage 4 and published in `ghicons`. Required fields come from the filename, directory and SVG; optional fields come from `metadata/`. One index feeds the website, playground, generators and future CDN. Schema: [ICON-SPEC.md](ICON-SPEC.md#the-icon-registry).

## The React integration

Each component is a thin wrapper over inlined paths:

```tsx
const GyeNyame: React.FC<IconProps> = ({ size = 24, color = 'currentColor', viewBox = "0 0 24 24", ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={trueSize(size)} height={trueSize(size)}
       fill={color} viewBox={viewBox} {...props}>{/* paths */}</svg>
);
```

- `trueSize` turns numbers and unitless strings into pixels and passes CSS units through.
- `fill={color}` comes before `{...props}`, so `fill` can still be overridden.
- No sprite sheet, stylesheet or network request.

## Build and publishing

Build tooling lives in the root package (one lockfile, one dependency set); package manifests declare only runtime/peer deps and publishing metadata.

- **`ghicons`** — no compile step; `build-core.mjs` writes everything.
- **`@ghicons/react`** — `tsc` for types, Vite library mode for ESM + UMD; React is external.

`tools/verify-packages.mjs` checks that the packages agree before publishing: every icon has a registry entry and a component, declared files exist, no dev files leaked into `dist/`, slugs are unique, versions match.

Adapters publish before the core, so a half-finished release never strands React users. See the [Release Process](wiki/Release-Process.md).

## CI

| Workflow | Trigger | Does |
|---|---|---|
| `validate-svgs.yml` | Every PR | Validates the whole collection |
| `release.yml` | Push/PR to `master` | Lint, validate, generate, build; publishes on push |
| `dev-pre-release.yml` | Push to `dev` | Builds a GitHub pre-release |

## Storybook, playground and website

- **Storybook** (`pnpm run storybook`) — generated per-icon stories for the React package.
- **Playground** (`pnpm run dev`) — searchable browser over the collection. Never published.
- **Website** ([ghicons.methuselah.site](https://ghicons.methuselah.site)) — Next.js app in `ghicons_website/`, its own repository. It consumes the *published* npm package and is driven by `registry.json`, so a new icon gets a page after the next release and dependency bump. Deploys itself to GitHub Pages.

## Design decisions

| Decision | Why | Cost |
|---|---|---|
| Collection at the repo root | All packages are peers over one source | Monorepo tooling, coordinated releases |
| `ghicons` names the core, not React | The headline name should mean the collection | A breaking change at `0.1.0` ([MIGRATION_v1.md](MIGRATION_v1.md)) |
| Generated code not committed | Keeps `svg/` authoritative; no hand-edit drift | Generated output isn't reviewable in PRs |
| Staged pipeline | New framework = one emitter | More moving parts |
| One flat barrel per package | Ergonomic imports with tree-shaking | Non-tree-shaking bundlers get everything |
| Categories as directories | Cheap to extend, can't desync | Richer classification lives in the registry |
| Monochrome `currentColor` | Icons behave like text | Multicolour is deferred |

## Status

Done: monorepo, staged pipeline, registry, whole-collection validation, spec-conformant collection, reproducible generation, both packages published, metadata for all 106 icons.

Open: cultural review of the authored metadata; tests beyond the metadata contract. Tracked in the [Roadmap](wiki/Roadmap.md).

## Where do I make my change?

| I want to… | Touch |
|---|---|
| Add or fix an icon | `svg/<category>/<Name>.svg` (never the generated component) |
| Add a category | Create `svg/<category>/` |
| Add meanings, keywords, aliases | `metadata/` |
| Change the icon rules | `ICON-SPEC.md` **and** `tools/validate.mjs` |
| Change the registry schema | `tools/build-core.mjs` and `ICON-SPEC.md` |
| Change React props | `packages/react/src/props.ts` **and** `tools/generators/react.mjs` |
| Change component or story output | `tools/generators/` |
| Add a framework | New emitter in `tools/generators/` + new package |
| Change what a package ships | Its `package.json` |
| Change CI or releases | `.github/workflows/` |
| Change the website | `ghicons_website/` (separate repo) |

Rule of thumb: what an icon *is* belongs to the icon system; how a platform *uses* it belongs to that integration.
