# Migration v2 — `0.1.x` → `0.2.0`

**Icons and components are unchanged.** If you never read the registry, just upgrade.

## `registry.generated` is now `registry.count`

The field always held the icon count; the old name looked like a timestamp.

```diff
- const total = registry.generated;
+ const total = registry.count;
```

`registry.icons.length` still works.

## Icons now carry researched metadata

`meaning`, `keywords` and `aliases` were declared in `0.1.0` but always empty. They are now populated, and two fields are added:

| Field | Type | Description |
|---|---|---|
| `note` | `string` | Origin, variations or contested readings |
| `references` | `string[]` | Sources, present wherever `meaning` or `note` is |

All of these remain optional — new icons may arrive before their research:

```js
const label = icon.meaning ?? icon.name;
```

Code that assumed `meaning` was always `undefined` will now take the other branch. If you display a meaning, display its references too.

## Contributors

Research lives in `metadata/<category>/<Name>.json`. A `meaning` without `references` fails validation, as does a metadata file whose icon no longer exists. See [ICON-SPEC.md](ICON-SPEC.md#authoring-metadata).
