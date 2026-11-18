# Cultural Guidelines

Many GHIcons — Adinkra and others like it — are cultural heritage. An icon with perfect paths but the wrong name or meaning does more harm than good, and because research is published in the registry, an error spreads to the website, search and every project using GHIcons.

Symbols like a currency sign or an institutional mark just need to be accurate; the standards below apply wherever a symbol carries cultural meaning.

## What to provide

When submitting or requesting a symbol:

1. **Name** — the local-language name (e.g. *Gye Nyame*) and English name where known.
2. **Meaning and context** — what it represents and where it comes from.
3. **A reliable source** — not Wikipedia alone.
4. **Known variations** — and why your version differs, if it does.
5. **Search keywords** — terms someone would use without knowing the Akan name.

You don't need to write JSON; put it in your PR or issue and a maintainer will record it in `metadata/<category>/<Name>.json`. Field rules are in the [Icon Specification](../blob/dev/docs/ICON-SPEC.md#authoring-metadata).

**Sourcing is enforced:** a `meaning` or `note` without `references` fails validation, and Wikipedia-only sources are flagged. Use `note` for contested or regional readings.

## Reliable sources

- Ghana Museums and Monuments Board
- National Commission on Culture, Ghana
- Asante Cultural Centre, Kumasi
- University of Ghana research archives
- Academic publications (JSTOR, Google Scholar)
- Recognised scholars, e.g. Kofi Antubam, R.S. Rattray
- *The Adinkra Dictionary*, W. Bruce Willis

Wikipedia and image searches are starting points only.

## Multiple interpretations

Document every known meaning, not the one that suits a narrative. If they conflict, say so and cite each. When unsure, ask on the PR or issue.

## Scope

Beyond Adinkra, GHIcons welcomes national symbols, symbols from Ghana's many ethnic groups (Akan, Ewe, Ga, Dagomba…), and cultural artifacts such as Kente motifs, the okyeame staff and the Golden Stool. Symbols shared with neighbouring countries are welcome if the Ghanaian context is documented.

Sacred or ceremonial symbols are included as part of the cultural record, but describe them respectfully, not as decorative shorthand. If unsure whether one belongs, raise it in [Discussions](../discussions/categories/icon-ideas) first.

## Reporting an inaccuracy

Open an issue titled `[Cultural Accuracy] IconName`, describe the problem, and cite a source for the correction. Accuracy matters more than icon count.

Questions go to [Discussions](../discussions). See also: [SVG Style Guide](SVG-Style-Guide) · [Contributing](../blob/dev/docs/CONTRIBUTING.md)
