# GHIcons Release Process

How changes move from a contribution to a published package.

GHIcons publishes **multiple packages from one repository**, all generated from one canonical icon collection. This document covers how that is versioned, validated and shipped.

---

## 📋 Table of Contents

- [Release Philosophy](#-release-philosophy)
- [What Gets Published](#-what-gets-published)
- [Branch Strategy](#-branch-strategy)
- [Release Types](#-release-types)
- [Versioning](#-versioning)
- [Version Alignment Across Packages](#-version-alignment-across-packages)
- [Development Releases](#-development-releases)
- [Stable Releases](#-stable-releases)
- [Release Checklist](#-release-checklist)
- [Release Workflow](#-release-workflow)
- [Icon Collection Changes](#-icon-collection-changes)
- [Breaking Changes](#-breaking-changes)
- [Hotfixes](#-hotfixes)
- [Pre-1.0 Releases](#-pre-10-releases)
- [Failed Releases](#-failed-releases)
- [Verifying a Release](#-verifying-a-release)
- [Responsibilities](#-responsibilities)

---

## 🧭 Release Philosophy

GHIcons does not publish hand-written packages. It publishes the **output of a pipeline** run against a canonical collection.

```text
Canonical SVGs + metadata
        ▼
    Validation
        ▼
   Optimisation
        ▼
    Normalisation
        ▼
  Registry generation
        ▼
  Framework generation
        ▼
       Build
        ▼
  Package / distribute
```

A release publishes only when that pipeline completes end to end. That is what guarantees published artifacts match the canonical source — nobody can ship a component that no longer corresponds to its SVG.

---

## 📦 What Gets Published

| Package | npm | Contents |
|---|---|---|
| Core | `ghicons` | Optimised SVGs + `registry.json`. No dependencies. |
| React | `@ghicons/react` | Generated components. `react` as a peer dependency. |
| *Future* | `@ghicons/vue`, `@ghicons/svelte`, `@ghicons/web-components` | Generated adapters |
| *Future* | pub.dev | Flutter package |

> **`ghicons` changed meaning at `0.1.0`.** It was the React package through `0.0.1`; it is now the framework-agnostic core. React moved to `@ghicons/react`. See [MIGRATION.md](../MIGRATION.md).

**Publish order is adapters first, then the core.**

No adapter depends on the core at runtime — components carry their own inlined paths — so the order is chosen by what happens when a publish fails halfway, not by dependencies.

- Adapter fails: the core has not moved, existing consumers are untouched, retry costs nothing.
- Core fails *after* the adapter published: harmless, the adapter is simply available early.
- Core published first and the adapter then fails: every React consumer upgrading `ghicons` breaks, with no `@ghicons/react` to migrate to. This is the state to design against.

CI waits for each adapter to be resolvable on the registry before releasing the core.

**If a future adapter ever declares a dependency on `ghicons`, it must publish after the core.** Dependency order wins wherever the two rules disagree.

---

## 🌿 Branch Strategy

```text
feature branch
      ▼
     dev          → pre-releases
      ▼
   master         → stable releases to npm
```

### `dev`

Where completed contributions integrate before becoming stable: new icons, tooling, documentation, framework work, fixes, upcoming API changes.

Pushes to `dev` publish a GitHub pre-release.

### `master`

The stable branch. A merge into `master` turns a release candidate into a published release, so it should only ever contain changes that are ready for users.

Pushes to `master` publish to npm.

> The configured workflows use `master`. Some older documentation says `main` — the workflows are authoritative.

---

## 📦 Release Types

**Development release** — a pre-release from `dev`, for testing upcoming changes, reviewing new icons and validating tooling before a stable release.

**Stable release** — a production release published to npm.

**Hotfix release** — a focused stable release carrying an urgent fix.

---

## 🔢 Versioning

GHIcons follows **Semantic Versioning**: `MAJOR.MINOR.PATCH`.

### Major

Breaking changes:

- removing or renaming an icon
- changing a public framework API
- changing package names or exports
- changing a stable icon-specification rule in a way that affects consumers
- tightening validation such that existing published icons become invalid

### Minor

Backwards-compatible additions:

- new icons
- new categories
- new optional props or features
- a new framework integration
- new registry fields that consumers can ignore

**Adding icons is a minor release.** Existing consumers are unaffected.

### Patch

Backwards-compatible fixes:

- correcting an icon's geometry
- fixing an SVG technical issue
- correcting generated output
- documentation and packaging fixes

---

## 🔗 Version Alignment Across Packages

**All packages share one version number and release together.**

When `ghicons` goes to `0.3.0`, `@ghicons/react` goes to `0.3.0` on the same commit, even if nothing in the React adapter changed.

Why: adapters are generated from the core's collection, so "which core does this adapter correspond to?" must have an obvious answer. Matching numbers make that free, and they let an adapter declare an exact core dependency without a lookup table.

*Cost:* packages get version bumps for changes that did not affect them, and a consumer who reads only the React changelog sees releases with no React-visible changes. That is an acceptable trade while the number of packages is small. If the ecosystem grows enough that it stops being acceptable, independent versioning gets revisited before 1.0 — not after.

---

## 🧪 Development Releases

```text
feature branch
      ▼  PR
     dev
      ▼  CI: validate → generate → build → pre-release
GitHub pre-release
```

Pre-releases are for verification, not general consumption. They let maintainers and contributors check a change against real code before it becomes stable.

---

## 🚀 Stable Releases

```text
dev
  ▼  PR
master
  ▼  CI: lint → validate → generate → build → verify packaging
  ▼  publish @ghicons/*        (adapters)
  ▼  wait for registry to serve them
  ▼  publish ghicons           (core)
npm
```

---

## ✅ Release Checklist

### Source

- [ ] All SVGs pass whole-collection validation
- [ ] No off-spec icons, including ones not touched by this release
- [ ] New icons have been culturally reviewed
- [ ] Metadata is accurate for anything added or changed

### Icon system

- [ ] The registry regenerates cleanly from source
- [ ] No stale entries for deleted or renamed icons
- [ ] Generated output is reproducible — a clean regeneration produces identical results
- [ ] Naming follows the specification

### Code

- [ ] Lint passes
- [ ] Tests pass
- [ ] Every package builds
- [ ] Build output contains only intended artifacts

### Documentation

- [ ] README reflects the current API
- [ ] Icon specification matches what validation enforces
- [ ] Breaking changes documented with an upgrade path
- [ ] Release notes drafted

### Release

- [ ] Version selected according to the rules above
- [ ] Versions aligned across packages
- [ ] Publish order is adapters first, core last (unless an adapter depends on the core)

---

## 🔄 Release Workflow

### 1 — Complete development

Work lands on a feature branch and opens a PR into `dev`.

### 2 — CI validation

CI validates the entire collection, regenerates outputs, and builds every package. A failure here blocks the merge.

### 3 — Merge into `dev`

A pre-release publishes automatically.

### 4 — Validate the complete build

From a clean checkout, delete all generated artifacts, regenerate, and build. Output must be identical to CI's. If it is not, generation is not reproducible and the release stops.

### 5 — Select the version

Apply the [versioning rules](#-versioning) to the full set of changes since the last release — the highest-severity change decides. One rename in a release full of additions still makes it a major.

### 6 — Update release information

Write the release notes. Group by what the reader cares about:

```markdown
## Added
### Adinkra
- Nkyinkyim — symbol of initiative and dynamism

### National
- Coat of Arms

## Fixed
- GhanaCedi now renders on the 24×24 canvas (previously blank — its artwork sat outside the declared viewBox)

## Breaking
- `GhanaCedisIcon` renamed to `GhanaCedi`
```

### 7 — Merge into `master`

### 8 — Publish

CI publishes the adapters, waits for them to resolve, then publishes the core. Verify each landed before announcing.

---

## 🎨 Icon Collection Changes

### Adding icons

Minor release. Add the SVG, regenerate, review, ship.

### Fixing icons

Patch release — as long as the icon keeps its name and contract. Note the visual change in the release notes; consumers who pinned a version deserve to know their icon looks different.

### Removing icons

Major release. Removal breaks anyone importing that icon.

Prefer deprecation: announce it, keep the icon for at least one minor release, then remove it in the next major.

---

## 💥 Breaking Changes

Anything that can break a consumer's build or visibly change their UI without their action.

A breaking change must ship with:

1. A clear statement of what changed
2. Why it changed
3. What consumers must do
4. A copy-pasteable before/after

### Example

```markdown
## Breaking: `GhanaCedisIcon` renamed to `GhanaCedi`

The `Icon` suffix was redundant — every entry in the collection is an icon —
and the specification now forbids it.

Before:
  import { GhanaCedisIcon } from "@ghicons/react";
After:
  import { GhanaCedi } from "@ghicons/react";
```

---

## 🔥 Hotfixes

For an urgent problem in a published release — a broken build, a badly wrong icon, a packaging failure.

```text
master
   ▼  hotfix branch
   ▼  fix + validate + build
master
   ▼  patch release
   ▼  back-merge into dev
```

Keep a hotfix narrow: the fix and nothing else. Always back-merge into `dev`, or the next stable release silently reintroduces the bug.

---

## 0️⃣ Pre-1.0 Releases

GHIcons is pre-1.0. The public API and architecture are still moving, so changes that would be disruptive during a `1.x` lifecycle can happen on a minor bump.

This is not licence to break things casually. The project still:

- documents every API change
- communicates breaking changes clearly
- avoids unnecessary churn
- maintains the icon specification
- preserves existing integrations where practical

The `0.1.0` handover of the `ghicons` name is the clearest example: a genuine break, taken deliberately while the cost was low, documented with a migration path. Pre-1.0 is exactly when structural corrections should happen — the alternative is carrying them past 1.0, when they get much more expensive.

The goal of `1.0.0` is a stable foundation for the icon system and its integrations.

---

## ❌ Failed Releases

If the pipeline fails, do not manually publish as a workaround.

Find where it failed:

| Stage | Meaning |
|---|---|
| Validation | An icon violates the specification. Fix the SVG. |
| Generation | The pipeline cannot process a source file. Fix the source or the generator. |
| Build | A package does not compile. |
| Publish | Credentials, registry, or naming. Check `NPM_TOKEN` and org permissions. |

If a publish fails partway through a multi-package release, the registry is in a mixed state. Publish the remaining packages at the same version rather than rolling the first one back — npm versions cannot be reused, and an unpublish breaks anyone who already installed it.

The publish order is designed so that a partial release is survivable: adapters land first, so a failure leaves existing consumers on a working version rather than stranded on a broken one.

---

## 🔎 Verifying a Release

After publishing, verify from a clean project — not from the monorepo.

**Install**

```bash
npm install ghicons @ghicons/react
```

**Core**

```js
import registry from "ghicons/registry.json";
console.log(registry.icons.length);
```

Confirm the SVGs are present at their documented paths and render with a colour applied.

**React**

```tsx
import { GyeNyame } from "@ghicons/react";
<GyeNyame size={48} color="gold" />
```

Check that it renders, scales, inherits colour, and that types resolve.

**Package metadata** — version, exports, files, license and repository fields are correct on npm.

**Website** — still builds against the new version.

---

## 👥 Responsibilities

**Contributors** — follow the icon specification, keep PRs focused, respond to review, never hand-edit generated files.

**Maintainers** — review for cultural accuracy and technical conformance, decide versions, write release notes, verify published packages, communicate breaking changes.

**CI/CD** — validate the whole collection, regenerate from source, build every package, publish in order, refuse to publish on any failure.

---

## 🧭 Release Principle

```text
Contribute → Review → Validate → Generate → Build → Release → Distribute
```

> **One canonical icon collection. Reproducible outputs. Multiple ways to consume GHIcons.**
