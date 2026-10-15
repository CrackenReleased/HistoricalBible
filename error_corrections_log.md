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
