## 2026-10-16 23:05:00 — Web KJV dataset inverted bracket repair (`[I[` / `[O[` → `[I]` / `[O]`)

- **Symptom**: Five verses in `public/data/kjv_verses.json` contained inverted closing brackets (`[I[` or `[O[`) inherited from workbook extraction, causing `formatKjvText()` (`/\[([^\]]+)\]/g`) to greedily italicize entire clauses across bracket boundaries or render literal `[O[` on screen.
- **Canonical Verification (`Bible.pdf` & `pdf-proof/v0.2.0/reference-verses.json`)**: Verified against `Bible.pdf` font/italic span metrics:
  1. `Numbers 12:6` (`Bible.pdf` p. 83): `"[I[ the LORD"` → `"[I] the LORD"` (`italic_evidence`: `I` at chars 65–66).
  2. `Psalms 25:17` (`Bible.pdf` p. 292): `"[O[ bring thou"` → `"[O] bring thou"` (`italic_evidence`: `O` at chars 39–40).
  3. `Isaiah 41:17` (`Bible.pdf` p. 361): `"[I[ the God of Israel"` → `"[I] the God of Israel"` (`italic_evidence`: `I` at chars 119–120).
  4. `Jeremiah 17:10` (`Bible.pdf` p. 380): `"[I[ try the reins"` → `"[I] try the reins"` (`italic_evidence`: `I` at chars 29–30).
  5. `Habakkuk 1:5` (`Bible.pdf` p. 456): `"for [I[ will work"` → `"for [I] will work"` (`italic_evidence`: `I` at chars 70–71).
- **Regression Lock**: Added strict balanced-bracket and non-nested-bracket invariant checks to `scripts/verify-canonical-kjv.js` and `tests/data-integrity-selfcheck.ts`.

## 2026-10-15 21:31:54 — PDF chapter navigation and page labels v0.3.0

- Navigation-only PDF updates can preserve reading text, layout, link annotations and tags: compare every page and annotation after updating the outline and page-label tree.
- Chapter destinations were taken from each chapter's own verse-one marker. Viewer labels use custom front-matter names, then decimal 1-1160 to match the printed Bible folios. The five existing Psalm divisions must be included when setting the Psalm bookmark's collapsed descendant count.
- Verified all 1,189 chapter destinations and every page label; five regression checks pass. The accessibility/tag-reading-order assessment was not part of this update.

## 2026-10-15 20:02:19 — PDF proof v0.2.0: source and export integrity

- Shared source defects include four missing final verses, duplicate Exodus paragraphs, two repeated clauses and 25 page-label strings embedded in verses. Repair is applied only to a separate master with per-change evidence; original-source agreement alone does not establish correctness.
- Native Word export omitted the Adobe body font. The proof embeds the exact font and recodes native strings with explicit Unicode mappings; both readers and all-page word positions verified. Running header/footer text polluted cross-page copies; label vectors now preserve appearance and clickable annotations without selectable label text.
- Comparison extraction has source-specific defects. Restrict automatic lexical proposals to narrowly corroborated readings; keep 384 ambiguous/variant rows unchanged. Regression suites cover missing/duplicate/contaminated text, brackets, glyph case/sizing, inventory, text and navigation; old originals reproduce six failures in each suite, proof passes all 18.

# Error Corrections Log — HistoricalBible.com

## [2026-10-14 20:44:00] Initial Build, Pipeline & Sibling Scans

### ERR-01: Risk of Copyright Contamination from Etsy Raster Assets
- **Symptom / Risk**: Embedding `BibleVizArc7WiderOTNTMedQuality.jpg`, `BibleNetwork.jpg`, or the Dropbox high-res PNG into the public web application breaches Dr. Chris Harrison's personal-use-only Etsy license.
- **Decision Point Fixed**: Strict procedural isolation. All visual geometry (semicircular arcs, histogram bars, Bézier threads) is rendered procedurally via code on HTML5 `<canvas>` using OpenBible.info's CC BY 4.0 TSV dataset and public domain KJV text. Enforced an automated Playwright regression assertion (`REG-01`) that scans all image and stylesheet DOM elements for prohibited filenames.
- **Sibling Scan**: Audited all assets in `E:\HistoricalBible` to confirm zero raster dependency.

### ERR-02: OpenBible Range Tokens in Target Columns
- **Symptom**: Raw rows in `cross_references.txt` contain verse ranges in the destination column (e.g., `Matt.4.23-Matt.4.24`), which fail direct hash map lookup against atomic verse IDs (`Matt.4.23`).
- **Decision Point Fixed**: Implemented `parse_ref()` in `scripts/build-crossref-data.py` to strip hyphenated range boundaries for node and chapter indexing while preserving the full range string (`r`) for display on the scripture card.
- **Sibling Scan**: Verified all 66 book prefixes (`1Sam`, `1Kgs`, `1Chr`, `Song`, `Phlm`, etc.) across all 343,570 records to guarantee no orphaned links.

### ERR-03: Main-Thread Freezing During Canvas Overdraw (340k Arcs)
- **Symptom**: Stroking 343,570 individual arc paths in Canvas 2D on every pan/zoom frame causes heavy frame drops.
- **Decision Point Fixed**: Implemented adaptive Level-of-Detail (LOD). Background arcs are sub-sampled and rendered with 0.02 alpha, while active chapter arcs are rendered with boosted contrast (0.65 alpha, 1.4px stroke). Pre-indexed arcs by chapter ID (`s` and `t`) so chapter filtering takes O(1) time.

## [2026-10-15 21:47:14] PDF return-link annotation reuse

- The Word-derived PDF shared one header-link annotation object across 1,160 Scripture pages. Assigning a page-specific StructParent directly to it leaves every page pointing at the last tag.
- In v0.3.1, copy the annotation per page before adding Link/OBJR structure and parent-tree entries. `tests/test_pdf_accessibility.py` verifies unique keys, annotation references, labels and reading-order placement on every Scripture page; all three checks pass.
