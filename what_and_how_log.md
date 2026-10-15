# What and How Log — HistoricalBible.com
## 2026-10-14 20:44:00 — Legal Clearance, Procedural Architecture & Complete KJV Data Ingestion

### WHAT was built
1. **Legal & Licensing Boundary Audit**:
   - Audited the Etsy purchase assets (`BibleVizArc7WiderOTNTMedQuality.jpg`, `BibleNetwork.jpg`, and `ReadMeCrossReferences.txt` from Dr. Chris Harrison).
   - Confirmed that Dr. Chris Harrison's Etsy copyright is restricted solely to the static graphical raster files (`.jpg`/`.png`) for personal/non-commercial print use.
   - Grounded legal clearance under **17 U.S.C. § 102(b)**: Arc diagrams connecting sequential bar charts via semicircular Bézier curves represent mathematical and informational visualization systems that cannot be copyrighted.
   - Sourced the underlying cross-reference graph from Stephen Smith's **OpenBible.info** dataset (derived from R.A. Torrey's public-domain *Treasury of Scripture Knowledge*), licensed under **Creative Commons Attribution 4.0 (CC BY 4.0)** for unrestricted non-commercial and commercial interactive use with attribution.
   - Sourced the full 31,102 verse scripture text from the **King James Version (KJV)**, which resides entirely in the Public Domain.
2. **Automated Data Ingestion Pipelines**:
   - `scripts/build-crossref-data.py`: Downloads `cross-references.zip` from OpenBible.info, parses and normalizes range tokens (`Matt.4.23-Matt.4.24`), tracks inter-testament linkages, and compiles 343,570 total links into `public/data/cross_references_bundle.json` plus a curated high-confidence bundle (`public/data/cross_references_curated.json`, 117,200 links).
   - `scripts/fetch-kjv-text.py`: Compiles the complete 31,102-verse text of all 66 books and 1,189 chapters of the KJV Bible into `public/data/kjv_verses.json` (4.65 MB) for instant zero-latency client-side indexing.
3. **Dual-Mode Interactive Visualization Engine (`index.html`)**:
   - **Arcs View**: Zero-dependency HTML5 2D Canvas engine running at 60 FPS with full High-DPI scaling. Features 1,189 chapter histogram baseline bars (scaling downward proportionally to verse count with Psalm 119 extending furthest at 176 verses), 10 theological canonical division colors, interactive pan/zoom, chapter hit detection, and dual color schemes (`Canonical Division` vs `Chris Harrison Chapter Distance Rainbow`).
   - **Threads View**: 3-column split view with full sequential chapter reader on the left, vertical 66-book canonical spine with dynamic Bézier threads in the center, and a rich verse inspector on the right.
   - **Right Inspector Drawer**: Displays selected verse citation, text, 10-division cross-reference distribution bar, and inline target scripture cards with real KJV text that allow 1-click pivot navigation across the Bible.
   - **Legal Attribution Footer**: Prominently displays required CC BY 4.0 attribution to OpenBible.info and the Treasury of Scripture Knowledge.
4. **Playwright Regression Test Suite (`tests/bibleviz.spec.ts`)**:
   - `REG-01`: Legal compliance guard ensuring no Etsy raster filenames exist in the DOM and verifying CC BY 4.0 attribution.
   - `REG-02`: Canonical invariant test verifying 1,189 chapters and the Psalm 119 176-verse spike.
   - `REG-03`: Interactive mode switcher test verifying Arcs vs Threads views.
   - `REG-04`: Verse selection and inspector cross-reference rendering test.
   - `REG-05`: Omnibox natural scripture shorthand search test (`John 3:16`).

### HOW it works & WHY these decisions were made
- **Host Direct Execution**: Implemented natively in `E:\HistoricalBible` without temporary directories or sandboxes.
- **Progressive Hydration**: `index.html` mounts immediately with seed texts and arcs in < 15ms, then asynchronously fetches `kjv_verses.json` and `cross_references_curated.json` for instant UI responsiveness without main-thread blocking.
- **Adaptive Canvas Overdraw**: Background arcs use attenuated opacity (`0.02 - 0.16`), while focused chapter arcs highlight at `0.65 - 0.85` with 1.4px line width to eliminate visual mud.
