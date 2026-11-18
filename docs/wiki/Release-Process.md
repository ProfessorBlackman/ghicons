# Release Process

How changes reach npm. Every published package is the output of the pipeline (validate → optimise → normalise → registry → generate → build); nothing is published by hand.

## Packages

| Package | Contents |
|---|---|
| `ghicons` | Optimised SVGs + `registry.json` |
| `@ghicons/react` | Generated components; `react` as peer |
| *Planned* | `@ghicons/vue`, `@ghicons/svelte`, `@ghicons/web-components`, Flutter on pub.dev |

**All packages share one version and release together**, even if one didn't change. That makes it obvious which core an adapter matches. Revisit before 1.0 if the package count grows.

## Branches

```text
feature branch → dev (GitHub pre-release) → master (npm release)
```

Open PRs against `dev`. `master` only receives changes ready for users. The workflows use `master`, not `main`.

## Versioning

Semantic Versioning. The most severe change in a release decides the bump.

| Bump | Examples |
|---|---|
| **Major** | Removing or renaming an icon; changing a public API, package name or exports; tightening validation so published icons fail |
| **Minor** | New icons, categories, optional props, integrations, or registry fields |
| **Patch** | Fixing geometry, SVG issues or generated output; docs and packaging fixes; **authored metadata** |

Metadata values (`meaning`, `note`, `keywords`, `aliases`, `references`) are patches: they change no schema, and research shouldn't wait for a minor release. A new registry *field* is a minor.

Pre-1.0, disruptive changes may land in a minor, but must still be documented with an upgrade path.

## Publishing

```text
master
  ▼  lint → validate → generate → build → verify packaging
  ▼  publish @ghicons/* adapters
  ▼  wait until npm serves them
  ▼  publish ghicons (core)
```

Adapters go first because nothing depends on the core at runtime, and a core release without its adapter would strand React users mid-migration. If an adapter ever depends on `ghicons`, dependency order wins.

## Checklist

- [ ] Whole collection validates; new icons culturally reviewed
- [ ] Clean regeneration is identical to CI's; no stale entries
- [ ] Lint, tests and builds pass; output contains only intended files
- [ ] README and ICON-SPEC match the current behaviour
- [ ] Breaking changes have a new `docs/MIGRATION_v<n>.md` and a row in `MIGRATION.md`
- [ ] `(unreleased)` cleared from `MIGRATION.md` after publishing
- [ ] Release notes written (Added / Fixed / Breaking)
- [ ] Versions aligned across packages

## Breaking changes

Each needs: what changed, why, what to do, and a before/after example — in a **new** migration guide (`MIGRATION_v<n>.md`, next number in the series). Never rewrite an existing guide.

Prefer deprecating icons for at least one minor release before removing them in a major. Icon fixes are patches, but note visual changes in the release notes.

## Hotfixes

Branch from `master`, make only the fix, validate and build, release a patch, then **merge back into `dev`** so the next release doesn't reintroduce the bug.

## Failed releases

Never publish manually as a workaround. Fix the stage that failed: validation (the SVG), generation (source or generator), build, or publish (`NPM_TOKEN`, org permissions).

If a multi-package publish fails partway, publish the remaining packages at the same version. Don't unpublish — npm versions can't be reused.

## Verifying a release

From a clean project, not the monorepo:

```bash
npm install ghicons @ghicons/react
```

Check that `registry.json` loads, SVGs exist at their documented paths, React icons render, scale and inherit colour, types resolve, npm metadata is correct, and the website still builds.
