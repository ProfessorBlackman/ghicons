# Migration Guides

One guide per breaking release, each in its own file. A release never rewrites
the guide before it, so the instructions for your situation stay where they were
even after three more versions ship.

> **`v1`, `v2` … are guide numbers, not GHIcons versions.** `MIGRATION_v2.md` is
> the second migration guide — it does not describe a GHIcons `2.0`.

| You are on | It takes you to | Guide |
|---|---|---|
| `ghicons` `0.0.x` — when that name meant the React components | `0.1.0` | [MIGRATION_v1.md](MIGRATION_v1.md) |
| `ghicons` or `@ghicons/react` `0.1.x` | `0.2.0` *(unreleased)* | [MIGRATION_v2.md](MIGRATION_v2.md) |

## Which one do I need?

Check what you have installed:

```bash
npm ls ghicons @ghicons/react
```

Then start at the guide whose "You are on" column matches, and read forward
through each one in turn — the guides are cumulative, so upgrading across two
releases means following both, oldest first.

If you are starting fresh, you need none of them. Install the current packages
and read [DOCUMENTATION.md](DOCUMENTATION.md).

## Pruning

Old guides are removed once the version they migrate *from* has fallen out of
use, so this list stays short enough to be worth reading. Removing one is a
deliberate decision, noted in the release that does it — and the guide remains
in the git history and in the tag of the release it shipped with.

## Getting help

If no guide covers your case, open a
[Discussion](https://github.com/ProfessorBlackman/ghicons/discussions) or an
[issue](https://github.com/ProfessorBlackman/ghicons/issues).
