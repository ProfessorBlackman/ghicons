# Migration v2 — `0.1.x` → `0.2.0`

> **Status: unreleased.** `0.1.0` is the current release on npm. This guide
> describes what changes when `0.2.0` ships, and is written as the changes land
> rather than afterwards.
>
> The `v2` is the second guide in the series, not a GHIcons version. See the
> [index](MIGRATION.md).

**Nothing about the icons or the components changes.** No renames, no artwork
changes, no props changes. If you render icons and never read the registry, you
have nothing to do — upgrade and carry on.

What changes is the registry's shape, in two ways.

---

## `registry.generated` is now `registry.count`

The field always held the number of icons, under a name that reads as a
timestamp. A real generation timestamp would break the pipeline's guarantee that
a clean regeneration is byte-identical, so the value stayed and the name was
corrected.

```diff
  import registry from "ghicons/registry.json";

- const total = registry.generated;
+ const total = registry.count;
```

`registry.icons.length` was always equivalent and still is, so code using that
needs no change.

This is the only removal in the release. If you never read `registry.generated`
— and almost nothing did, since its name did not suggest a count — this section
does not apply to you.

---

## Icons carry researched metadata

`meaning`, `keywords` and `aliases` were declared in the registry's types from
`0.1.0` but were never populated: there was no mechanism for recording research,
so every icon shipped with derived fields only. There is one now, and two fields
join them:

| Field | Type | What it is |
|---|---|---|
| `note` | `string` | Longer context: origin, variations, or a reading that is contested |
| `references` | `string[]` | Where the meaning came from. Present wherever a `meaning` or `note` is |

```js
const icon = registry.icons.find(i => i.slug === "gye-nyame");

icon.meaning;     // "Except God — the omnipotence and supremacy of God in all affairs"
icon.references;  // ["Willis, W. Bruce. The Adinkra Dictionary …", "…"]
```

**Every one of these fields is still optional, and most icons do not have them
yet.** These are cultural symbols, so a meaning ships only once it has been
researched and sourced. Write code that copes with their absence:

```js
const label = icon.meaning ?? icon.name;
```

That was already true in `0.1.0`, where the fields were absent everywhere. The
difference is that they now start appearing, so anything that happened to rely
on `meaning` being `undefined` — a placeholder, a "documentation needed" branch
— will begin taking the other path for some icons.

### If you render a meaning, render its source

Wherever a `meaning` exists, so do the `references` it came from. Showing the
claim without any way to check it is the thing the project's
[cultural guidelines](wiki/Cultural-Guidelines.md) exist to prevent.

---

## If you contribute icons

Research lives in one file per icon, mirroring the artwork:

```text
svg/adinkra/GyeNyame.svg          the artwork
metadata/adinkra/GyeNyame.json    what is known about it
```

A `meaning` without `references` now fails validation, and a metadata file whose
icon has been renamed away fails too. The field rules are in
[ICON-SPEC.md](ICON-SPEC.md#authoring-metadata); what counts as a reliable
source is in the [Cultural Guidelines](wiki/Cultural-Guidelines.md).

Documenting a symbol already in the collection needs no drawing and no code, and
it is the contribution the project most needs — `pnpm run validate` prints how
many icons still have no recorded meaning.

---

## Getting help

Open a [Discussion](https://github.com/ProfessorBlackman/ghicons/discussions) or
an [issue](https://github.com/ProfessorBlackman/ghicons/issues).
