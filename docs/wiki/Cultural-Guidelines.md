# Cultural Guidelines

GHIcons collects Ghanaian symbols of every kind. Many of them — Adinkra above all — are cultural heritage, and this page is about those: how to research them, verify their accuracy, and handle cases where a symbol is contested or carries several interpretations.

Not every icon in the collection is a cultural symbol. A currency sign or an institutional mark is a matter of accuracy rather than heritage. The standards below apply wherever a symbol carries cultural meaning.

Cultural accuracy is as important as technical quality. An SVG with perfect paths but the wrong meaning — or the wrong name — does more harm than good.

This matters more than it used to. The research you contribute does not stay in a pull request comment: it becomes structured metadata in the published icon registry, which feeds the website, search, icon pickers and any tool built on GHIcons. An inaccurate meaning propagates everywhere the icon does.

---

## Why This Matters

Adinkra symbols and other Ghanaian cultural icons carry specific meanings that have been passed down over generations. Misrepresenting them — even unintentionally — can:

- Spread misinformation about Ghanaian culture
- Offend communities for whom these symbols are sacred or significant
- Undermine trust in the library as a reliable resource

Every contributor has a role in protecting this. If you are submitting, reviewing, or requesting an icon, please take the accuracy of its cultural representation seriously.

---

## What to Include With Every Submission

When submitting or requesting a symbol, always provide:

**1. The symbol's correct name**
Include both the common English name and the original Twi or relevant local language name where known. For example: *Gye Nyame* (not just "the supremacy of God symbol").

**2. Its meaning and cultural context**
A concise explanation of what the symbol represents and where it comes from. Is it Asante Adinkra? A national emblem? A regional motif?

**3. A reliable reference source**
See the list of trusted sources below. A Wikipedia link alone is not sufficient — try to find a primary or institutional source.

**4. Any known variations**
Some symbols have regional variations or have evolved over time. If your version differs from other depictions, note why.

**5. Search keywords**
Words someone might search for when looking for this symbol without knowing its Akan name — concepts, themes, related objects. These go into the registry and are how most people will actually find the icon.

---

## Where This Information Lives

Cultural information is stored as structured metadata alongside the icon, and published in the registry that ships with the `ghicons` package:

```json
{
  "name": "GyeNyame",
  "slug": "gye-nyame",
  "category": "adinkra",
  "meaning": "Except God — the supremacy of God",
  "keywords": ["god", "supremacy", "faith", "omnipotence"],
  "aliases": ["Gye Nyame"],
  "references": ["…"]
}
```

You do not need to write JSON to contribute this — provide the information in your pull request or issue and a maintainer will record it. But knowing where it ends up explains why the sourcing standards below are strict.

---

## Reliable Sources

These sources are considered trustworthy references for Ghanaian symbols:

- **The Ghana Museums and Monuments Board** — official government cultural institution
- **The Asante Cultural Centre, Kumasi**
- **Academic publications** on Ghanaian art and culture (JSTOR, Google Scholar)
- **Books by recognised Ghanaian scholars** — e.g. works by Kofi Antubam, R.S. Rattray
- **The Adinkra Dictionary** by W. Bruce Willis
- **National Commission on Culture, Ghana** publications
- **University of Ghana** (Legon) cultural research archives

Use these with caution (helpful but not authoritative on their own):
- Wikipedia — useful as a starting point, but verify against primary sources
- General image searches — visuals only, no cultural authority

---

## Handling Symbols With Multiple Interpretations

Some symbols carry multiple meanings or are interpreted differently across regions or communities. When this is the case:

- Document all known meanings in the icon's submission, not just one
- Do not choose a meaning that suits a particular narrative — represent the full picture
- If meanings conflict significantly, note the disagreement and cite your sources
- When in doubt, leave a comment on the PR or issue and ask the community

---

## Symbols Outside the Adinkra Canon

GHIcons is not limited to Adinkra. The library also welcomes:

- **Ghanaian national symbols** — coat of arms, Black Star, national emblems
- **Ethnic and regional symbols** from across Ghana's many groups (Akan, Ewe, Ga, Dagomba, etc.)
- **Cultural artifacts as icons** — the kente motif, the okyeame staff, the Golden Stool (Sika Dwa)

For non-Adinkra symbols, the same standards apply — provide name, meaning, origin, and a reliable source.

---

## Symbols From Neighbouring Cultures

Some symbols overlap with or originate from cultures across West Africa. If a symbol is shared between Ghana and neighbouring countries (e.g. Côte d'Ivoire, Togo), this is fine — but note the broader cultural context in the submission. GHIcons focuses on Ghanaian usage but does not need to be exclusionary about symbols with shared regional heritage.

---

## Flagging Inaccurate Icons

If you find an icon in the library that is named incorrectly, misrepresented, or culturally inaccurate:

1. Open an issue with the title format: `[Cultural Accuracy] IconName`
2. Describe the inaccuracy clearly and provide a correct reference source
3. Suggest the correct name or representation where possible

This is one of the most valuable contributions you can make. Do not hesitate to raise concerns — accuracy is more important than having more icons.

---

## A Note on Sacred Symbols

Some Ghanaian symbols hold sacred or ceremonial significance. GHIcons does not exclude such symbols — they are part of the cultural record — but asks that contributors treat them with appropriate respect in their descriptions and not reduce their meaning to decorative shorthand.

If you are unsure whether a symbol is appropriate to include, raise it in [💬 General](../discussions/categories/general) or [💡 Icon Ideas](../discussions/categories/icon-ideas) for community discussion before submitting.

---

## Questions?

Cultural accuracy is a community effort. If you have questions about a symbol, its meaning, or how to represent it correctly, bring it to [Discussions](../discussions). The community includes Ghanaian developers, researchers, and cultural enthusiasts who are glad to help.

You do not need to draw anything to contribute here. Researching and correcting the meanings of symbols already in the collection is one of the most valuable contributions available — see [Who We Need](Who-We-Need).

See also: [SVG Style Guide](SVG-Style-Guide) · [Icon Specification](../blob/dev/docs/ICON-SPEC.md) · [Contributing](../blob/dev/docs/CONTRIBUTING.md)
