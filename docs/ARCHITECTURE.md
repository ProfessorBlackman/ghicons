# GHIcons Project Structure & Architecture

This document explains how GHIcons is put together: where everything lives, how an SVG
becomes a published React component, and which parts of the tree are hand-written versus
machine-generated.

It is aimed at contributors and maintainers. If you only want to *use* the library, read
[DOCUMENTATION.md](DOCUMENTATION.md) instead.

## 📋 Table of Contents

- [Design Goals](#-design-goals)
- [The Big Picture](#-the-big-picture)
- [Repository Layout](#-repository-layout)
- [Source of Truth: the `svg/` Directory](#-source-of-truth-the-svg-directory)
- [The Icon Component Contract](#-the-icon-component-contract)
- [The Generation Pipeline](#-the-generation-pipeline)
- [Build & Packaging](#-build--packaging)
- [Storybook & the Dev Playground](#-storybook--the-dev-playground)
- [Quality Gates (CI)](#-quality-gates-ci)
- [The Website](#-the-website)
- [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
- [Known Rough Edges](#-known-rough-edges)
- [Where Do I Make My Change?](#-where-do-i-make-my-change)

---

## 🎯 Design Goals

The architecture is shaped by four constraints:

1. **Contributors should only ever touch SVGs.** Adding an icon must not require writing
   React. The pipeline turns a validated `.svg` file into a typed component, a Storybook
   story, and a public export with no hand-editing.
2. **Every icon behaves identically.** One props interface (`IconProps`), one sizing
   helper (`trueSize`), one colouring rule (`currentColor`). Consumers learn the API once.
3. **The published package stays small.** SVGs are optimised at generation time, React is
   a peer dependency, and everything that is not the compiled library is excluded from the
   npm tarball.
4. **Generated code is disposable.** Components, stories, and the barrel file can be
   deleted and rebuilt from `svg/` at any time. They are not the source of truth.

## 🗺️ The Big Picture

```
  Contributor                Generation                 Build                Consumer
 ─────────────      ───────────────────────────    ────────────────      ──────────────

  svg/adinkra/          custom_scripts/                 tsc                npm i ghicons
   Aban.svg      ──►    build_components.cjs     ──►  (types)      ──►     import { Aban }
                         │  • svgo optimise            +                    from 'ghicons'
                         │  • wrap in template       vite build
                         │  • append to barrel       (lib mode)
                         ▼                               │
              src/icons/components/adinkra/               ▼
                      Aban.tsx                          dist/
                        +                          index.es.js
                    src/index.ts                    index.umd.js
                        │                            index.d.ts
                        │
                        ▼
                custom_scripts/
                build_stories.cjs   ──►   src/stories/Aban.stories.tsx   ──►   Storybook
```

Read left to right: the only human-authored artefact in that chain is the SVG file.
Everything from `src/icons/components/` onwards is produced by scripts.

## 📁 Repository Layout

```
ghicons/
├── svg/                        ← SOURCE OF TRUTH. Raw, hand-authored SVGs.
│   ├── adinkra/                  Traditional Adinkra symbols (~103 files)
│   ├── general/                  Everyday Ghanaian-context icons (e.g. Cedi sign)
│   └── national/                 National emblems (flag, black star)
│
├── custom_scripts/             ← The generation pipeline (plain CommonJS, no build step)
│   ├── build_components.cjs      svg/ → src/icons/components/ + src/index.ts
│   ├── build_stories.cjs         components → src/stories/
│   ├── clean_filename.cjs        Normalises SVG filenames to PascalCase
│   └── upload_to_cloudinary.cjs  Placeholder for asset hosting (currently empty)
│
├── src/
│   ├── icons/
│   │   ├── props.ts            ← HAND-WRITTEN. The shared icon contract.
│   │   └── components/         ← GENERATED. git-ignored. Mirrors svg/ structure.
│   │       ├── adinkra/
│   │       ├── general/
│   │       └── national/
│   ├── stories/                ← GENERATED. git-ignored. One story per component.
│   ├── index.ts                ← GENERATED. The public barrel / package entry point.
│   ├── App.tsx, App.css        ← Dev-only playground (icon browser), not published.
│   ├── main.tsx, index.css     ← Vite dev entry for the playground.
│   └── assets/                   Logo and static assets for the playground.
│
├── svgr_templates_dir/
│   └── svgr-icon-template.cjs  ← SVGR component template (see note below)
├── .svgrrc.cjs                 ← SVGR config pointing at that template
│
├── .storybook/                 ← Storybook config (main.ts, preview.ts)
├── .github/
│   ├── workflows/                CI: SVG validation, release, dev pre-release
│   ├── ISSUE_TEMPLATE/           Icon requests, bug reports, non-SVG submissions
│   └── PULL_REQUEST_TEMPLATE/    Per-type PR templates
│
├── docs/                       ← All project documentation (you are here)
│   └── wiki/                     Pages mirrored to the GitHub wiki
│
├── ghicons_website/            ← Separate Next.js site (its own git repo, see below)
│
├── dist/                       ← Build output. git-ignored. The only thing npm ships.
├── index.html                  ← Vite dev shell for the playground
├── vite.config.ts              ← Library build config (lib mode + dts plugin)
├── tsconfig*.json              ← Split configs: base / app / node / build
├── eslint.config.js
├── .npmignore                  ← Keeps everything except dist/ out of the tarball
└── package.json
```

### Hand-written vs. generated

| Path | Status | Committed? |
|---|---|---|
| `svg/**/*.svg` | Hand-authored | ✅ Yes |
| `src/icons/props.ts` | Hand-authored | ✅ Yes |
| `src/App.tsx`, `src/main.tsx` | Hand-authored (dev only) | ✅ Yes |
| `custom_scripts/*.cjs` | Hand-authored | ✅ Yes |
| `src/icons/components/**` | Generated | ❌ git-ignored |
| `src/stories/**` | Generated | ❌ git-ignored |
| `src/index.ts` | Generated (append-only) | ⚠️ See [Known Rough Edges](#-known-rough-edges) |
| `dist/**` | Built | ❌ git-ignored |

Because the generated tree is git-ignored, **a fresh clone has no components until you run
`pnpm run generate:icons`**. The `build` script does this for you, and CI runs it explicitly
before every build and publish.

## 🖋️ Source of Truth: the `svg/` Directory

Each subdirectory of `svg/` is a **category**, and the directory structure is preserved
verbatim through the whole pipeline:

```
svg/adinkra/Aban.svg  →  src/icons/components/adinkra/Aban.tsx  →  export { Aban }
```

Adding a new category is therefore just a matter of creating a new folder under `svg/` —
no script changes required. The generator recurses through whatever it finds.

The filename determines the component name. `clean_filename.cjs` normalises names
(`gye-nyame.svg` → `GyeNyame.svg`), and CI enforces PascalCase so the generated identifier
is always a valid React component name.

## 🧩 The Icon Component Contract

Every generated component conforms to the same shape, defined in `src/icons/props.ts`:

```ts
export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    viewBox?: string;
}
```

`props.ts` also exports `trueSize(size)`, the sizing helper. It normalises the `size` prop
so that bare numbers and unitless strings become pixels, while valid CSS units
(`rem`, `em`, `%`, `vh`, …) pass through untouched:

```ts
trueSize(24)        // "24px"
trueSize("2.5rem")  // "2.5rem"
trueSize("32")      // "32px"
```

A generated component is a thin, dependency-free function:

```tsx
const Aban: React.FC<IconProps> = ({ size = 24, color = 'currentColor', viewBox = "0 0 24 24", ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg'
       width={trueSize(size)} height={trueSize(size)}
       fill={color} viewBox={viewBox} {...props}>
    {/* optimised paths, inlined */}
  </svg>
);
```

Three consequences worth noting:

- **`fill={color}` sits before `{...props}`**, so a consumer can still override `fill`
  directly through spread props.
- **Paths are inlined**, not fetched. There is no runtime sprite sheet, no CSS file to
  import, and no network request per icon.
- **`currentColor` is the default**, so icons inherit text colour unless told otherwise.
  This is also why CI rejects hardcoded fills in source SVGs — a baked-in colour would
  silently defeat the `color` prop.

## ⚙️ The Generation Pipeline

### `build_components.cjs` — the core generator

```bash
node custom_scripts/build_components.cjs [svgDir] [componentsDir] [--overwrite|-o]
# defaults: svg → src/icons/components
# exposed as: pnpm run generate:icons
```

For each `.svg` file it finds, recursively:

1. **Skip or overwrite.** If the target `.tsx` already exists and `--overwrite` was not
   passed, the file is skipped. This makes regeneration cheap during local development;
   CI always passes `--overwrite` so the output can never drift from the SVG.
2. **Optimise** the SVG with [SVGO](https://github.com/svg/svgo), then extract the
   `<svg>…</svg>` element with a regex.
3. **Rewrite the opening tag**, replacing whatever the source declared with the
   prop-driven attributes (`width`, `height`, `fill`, `viewBox`, `{...props}`).
4. **Emit the component** into the mirrored category directory, computing a relative
   import path back to `src/icons/props` so nesting depth does not matter.
5. **Append the export** to `src/index.ts`, unless that exact export line is already
   present.

### `build_stories.cjs` — Storybook story generator

```bash
node custom_scripts/build_stories.cjs <componentsDir> [--overwrite]
# exposed as: pnpm run generate:stories
```

Walks a components directory and writes one `*.stories.tsx` per component into
`src/stories/`, each with four variants (`Default`, `Large`, `Colored`, `SmallColored`)
and `argTypes` wired to the `IconProps` fields. Stories import from `../index`, so a
missing export in the barrel surfaces immediately as a broken story.

Note the argument shape differs from the icon generator: the components directory is
**required**, and the flag is `--overwrite` only (no `-o` short form).

### `clean_filename.cjs` — filename normaliser

```bash
node custom_scripts/clean_filename.cjs <folder>
# exposed as: pnpm run dir:rename
```

Renames every file in a folder to PascalCase, stripping characters that are illegal in a
JS identifier. Run this on a batch of freshly downloaded SVGs before generating.

### A note on SVGR

`.svgrrc.cjs` and `svgr_templates_dir/svgr-icon-template.cjs` configure
[`@svgr/cli`](https://react-svgr.com/) with a template that produces the same component
shape. **No npm script currently invokes SVGR** — `build_components.cjs` does the
conversion itself with SVGO plus string templating. Treat the SVGR setup as the earlier
approach that is kept around as a fallback; if you change the component shape, change both
so they do not diverge.

## 📦 Build & Packaging

`pnpm run build` is three steps:

```jsonc
"build": "pnpm run generate:icons --overwrite && tsc -p tsconfig.build.json && vite build"
```

1. **`generate:icons --overwrite`** — rebuild every component from `svg/`, guaranteeing the
   build reflects current SVGs.
2. **`tsc -p tsconfig.build.json`** — type-checks and emits declarations into `dist/`.
   Stories and tests are excluded from this pass.
3. **`vite build`** — Vite library mode (`vite.config.ts`) bundles `src/index.ts` into
   `dist/index.es.js` and `dist/index.umd.js`. `react` and `react-dom` are marked
   `external`, so they are never bundled, and `vite-plugin-dts` emits the types entry.

### TypeScript config layout

| File | Used for |
|---|---|
| `tsconfig.json` | Base/editor config, references `tsconfig.node.json` |
| `tsconfig.build.json` | Library build — emits declarations, excludes stories & tests |
| `tsconfig.app.json` | Strict no-emit checking for the Vite playground |
| `tsconfig.node.json` | Config files that run in Node (Vite config, etc.) |

### What ships to npm

`package.json` declares `"files": ["dist"]`, and `.npmignore` additionally strips `src/`,
`svg/`, `custom_scripts/`, `.storybook/`, `.github/`, and the playground entry points. The
published surface is the `exports` map:

```jsonc
"exports": {
  ".": {
    "types":   "./dist/index.d.ts",
    "import":  "./dist/index.es.js",
    "require": "./dist/index.umd.js"
  }
}
```

React is a **peer dependency** (`^19.0.0`), so consumers supply their own copy and there is
no duplicate-React hazard.

## 📚 Storybook & the Dev Playground

Two independent ways to look at icons while developing:

- **Storybook** (`pnpm run storybook`, port 6006) — the per-icon reference. Config lives in
  `.storybook/`, picking up `src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and `src/**/*.mdx`.
  Stories are generated, so the gallery grows automatically with the library.
  `pnpm run build-storybook` produces the static site in `storybook-static/`.
- **Vite playground** (`pnpm run dev`) — `index.html` → `src/main.tsx` → `src/App.tsx`, a
  searchable, category-filtered browser over `import * as Icons from './index'`. It is a
  development tool only and is excluded from the package.

`vitest` is wired up as `pnpm test`, but there are no test files in the repository yet.

## ✅ Quality Gates (CI)

Three GitHub Actions workflows in `.github/workflows/`:

| Workflow | Trigger | What it does |
|---|---|---|
| `validate-svgs.yml` | PR to `dev` touching `svg/**/*.svg` | Validates only the changed SVGs and writes a pass/fail table to the job summary |
| `release.yml` | Push/PR to `master` | Installs, lints, regenerates icons, builds; on push to `master` also publishes to npm |
| `dev-pre-release.yml` | Push to `dev` | Builds and publishes a GitHub pre-release |

The SVG validator is an inline Python script enforcing the five rules that the pipeline
depends on:

1. `viewBox` is exactly `0 0 24 24`
2. No hardcoded `fill` colours — only `currentColor` or `none`
3. No embedded raster images or `base64` data
4. No `<script>` tags or `@import`
5. Filename is PascalCase (`GyeNyame.svg`)

These are not stylistic preferences. Rules 1–2 are what make the `size`/`color`/`viewBox`
props work; rules 3–4 keep the bundle small and the output safe to inline; rule 5 is what
makes the generated identifier valid.

## 🌐 The Website

`ghicons_website/` is the public icon browser at
[ghicons.methuselah.site](https://ghicons.methuselah.site). It is a **Next.js 16 +
Tailwind 4 app with its own git repository and lockfile**, nested inside this directory but
not tracked by the library repo.

Importantly, it consumes `ghicons` as a **published npm dependency** (`"ghicons": "^0.0.1"`),
not via a workspace link. A change to the library only reaches the website after a release
and a dependency bump there.

## 🧭 Design Decisions & Trade-offs

**Generate components instead of committing them.**
103+ near-identical `.tsx` files would swamp every diff and invite hand-edits that drift
from the SVG. Keeping them git-ignored makes `svg/` unambiguously the source of truth. The
cost: a clone is not immediately buildable-by-inspection — you must run the generator
first, and the generated tree cannot be reviewed in a PR.

**String templating instead of SVGR at build time.**
`build_components.cjs` gives full control over the emitted file (doc comment, relative
import path, exact prop ordering) with one fewer moving part in CI. The cost is a
regex-based extraction of the `<svg>` element, which assumes well-formed single-root SVGs —
precisely what the CI validator guarantees.

**A single flat barrel export.**
Every icon is a named export from one entry point. This keeps the import ergonomics simple
(`import { Aban, Sankofa } from 'ghicons'`) and relies on ESM tree-shaking to drop unused
icons. There are no per-category subpath exports, so bundlers that cannot tree-shake will
pull in everything.

**Categories as directories, not metadata.**
Category lives in the folder structure rather than in a manifest. Cheap to extend and
impossible to get out of sync — but it also means there is no machine-readable index of
icons with tags, meanings, or search keywords. `src/App.tsx` currently hardcodes its own
name-to-category sets to work around this.

**`currentColor` by default.**
Icons behave like text. This is the single decision most visible to consumers, and the one
the SVG validator protects most aggressively.

## ⚠️ Known Rough Edges

Documented so nobody rediscovers them the hard way:

- **`src/index.ts` is append-only.** `addToIndexFile` appends an export if the exact line is
  absent, but nothing ever removes one. Deleting or renaming an SVG leaves a stale export
  pointing at a file that will not be regenerated, breaking the build. Delete `src/index.ts`
  and regenerate after any removal or rename.
- **`src/index.ts` is generated but not git-ignored,** unlike the rest of the generated tree.
  It shows up as an untracked/modified file depending on local history.
- **`package.json` field mismatches.** `"types": "dist/index.d.js"` has a typo (`.d.js`
  should be `.d.ts`), and `"main": "dist/index.js"` points at the raw `tsc` output rather
  than the bundle. Modern resolvers use the `exports` map, which is correct, so this only
  bites older tooling.
- **`tsc` emits more than the library.** `tsconfig.build.json` excludes stories from the
  type-check pass, but `dist/` still ends up containing `App.js`, `main.js`, and
  `dist/stories/` declarations from the playground. Harmless, but it inflates the tarball.
- **`custom_scripts/upload_to_cloudinary.cjs` is empty.** Referenced nowhere; a placeholder.

## 🔧 Where Do I Make My Change?

| I want to… | Touch this |
|---|---|
| Add an icon | Drop the `.svg` into the right `svg/<category>/` folder, then `pnpm run generate:icons` |
| Add a whole category | Create `svg/<new-category>/` — the generator picks it up automatically |
| Change the props every icon accepts | `src/icons/props.ts` **and** the template string in `custom_scripts/build_components.cjs` (and `svgr_templates_dir/svgr-icon-template.cjs` to keep them aligned) |
| Change how components are emitted | `custom_scripts/build_components.cjs` |
| Change the Storybook stories | The template in `custom_scripts/build_stories.cjs`, then regenerate with `--overwrite` |
| Change bundling, externals, or output formats | `vite.config.ts` |
| Change what ships to npm | `package.json` (`files`, `exports`) and `.npmignore` |
| Change the SVG rules contributors must meet | `.github/workflows/validate-svgs.yml` **and** [`CONTRIBUTING.md`](CONTRIBUTING.md) / the [SVG Style Guide](wiki/SVG-Style-Guide.md) |
| Change the release flow | `.github/workflows/release.yml`, `dev-pre-release.yml` |
| Change the icon browser site | `ghicons_website/` (separate repo — and it consumes the *published* package) |

---

## See Also

- [DEVELOPMENT.md](DEVELOPMENT.md) — day-to-day commands and workflows
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to submit icons and code
- [DOCUMENTATION.md](DOCUMENTATION.md) — consumer-facing usage guide
- [SVG Style Guide](wiki/SVG-Style-Guide.md) — how to draw and prepare icons
