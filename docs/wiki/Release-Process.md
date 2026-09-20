# Release Process

This page documents how GHIcons moves from day-to-day development to a published release on npm. It is intended for maintainers and contributors who want to understand how the project is versioned and shipped.

---

## Branch Structure

```
feature branches / contributor PRs
          ↓
        dev        ← all active development happens here
          ↓  (deliberate merge when ready to release)
        main       ← triggers npm publish
```

| Branch | Purpose |
|---|---|
| `dev` | Default branch. All PRs from contributors target `dev`. Merges here trigger a dev build released on GitHub for testing. |
| `main` | Stable, production branch. Only updated intentionally by a maintainer. Merges here trigger a release to npm. |
| `feature/*` | Optional short-lived branches for larger batches of work (e.g. `feature/adinkra-batch-2`) |

---

## Versioning

GHIcons follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Change type | Version bump | Example |
|---|---|---|
| Bug fix, SVG correction on an existing icon | Patch | `1.0.1` |
| New icons added (backwards compatible) | Minor | `1.1.0` |
| Breaking API change (renamed props, removed components) | Major | `2.0.0` |

The project is currently in pre-1.0 (`0.x.x`), which signals that the API may still change. The first stable release will be `1.0.0`.

---

## Dev Builds (GitHub Releases)

Every push to `dev` automatically triggers the **Dev Release** GitHub Actions workflow. This:

1. Builds the project
2. Packages the `dist/` output as a `.zip`
3. Publishes a **pre-release** on GitHub tagged `dev-v{version}-build.{run_number}`

These builds are for **maintainer testing only** — not for end users. They allow you to verify changes work correctly in a real React project before merging to `main`.

### Installing a dev build locally

1. Go to [Releases](../releases) and download the latest `ghicons-dev-*.zip`
2. Extract the zip
3. In your test project, run:
```bash
npm install /path/to/extracted/folder
```

---

## Production Releases (npm)

A production release is triggered by **merging `dev` into `main`**. This should be a deliberate, intentional action — not a casual merge.

### Steps to cut a release

1. **Ensure `dev` is stable** — all passing CI checks, no known regressions
2. **Bump the version** in `package.json` on the `dev` branch:
```bash
# Example: bumping from 0.3.0 to 0.4.0
npm version minor --no-git-tag-version
# or edit package.json manually
```
3. **Commit the version bump** to `dev`:
```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: bump version to 0.4.0"
git push origin dev
```
4. **Open a PR from `dev` → `main`** and merge it
5. The **npm release GitHub Actions workflow** triggers automatically and publishes to npm
6. **Tag the release** on GitHub with release notes summarising what changed

### Release notes format

When tagging a release on GitHub, use this format:

```
## What's new in v0.4.0

### New Icons
- GyeNyame — "Except God" (Adinkra)
- Sankofa — "Return and fetch it" (Adinkra)
- GhanaCedis — Ghana Cedis currency symbol

### Improvements
- Added `aria-label` support to all icon components
- Improved TypeScript types

### Bug Fixes
- Fixed incorrect viewBox on AkomaIcon
```

---

## npm Publishing

The npm publish workflow uses an `NPM_TOKEN` stored as a GitHub Actions secret. This token is scoped to the `ghicons` package on npm and is only accessible to repository maintainers.

If the publish fails, check:
- The `NPM_TOKEN` secret is set and has not expired (Settings → Secrets and variables → Actions)
- The version in `package.json` has been bumped — npm rejects publishing the same version twice
- The build step completed successfully before the publish step

---

## Hotfixes

For urgent fixes to a production release (e.g. a broken icon or missing export that slipped through):

1. Branch off `main` directly: `git checkout -b hotfix/fix-description main`
2. Make the minimal fix
3. Bump the **patch** version
4. PR directly into `main`
5. After merging, backport the fix to `dev` as well to keep branches in sync

---

## Who Can Release

Only maintainers with write access to `main` can trigger a production release. If you are a contributor and believe a fix is urgent enough to warrant a release, flag it by commenting on the relevant issue or opening a discussion.
