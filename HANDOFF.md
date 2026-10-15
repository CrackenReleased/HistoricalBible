# HANDOFF.md — HistoricalBible.com

## 2026-10-14 22:56:00 — Antigravity / HistoricalBible — Local-First 3D WebGL Suite & Audited Theological Inspector Live for /Interact

### Status Overview
- **Workspace Location**: `E:\HistoricalBible`
- **New Gateway**: `interact.html` (`https://HistoricalBible.com/Interact`)
- **Three.js 3D Spatial Loom**: GPU-accelerated WebGL arc engine plotting 1,189 chapters in 3D orbit with additive-blended Bézier splines and 60 FPS orbital camera controls.
- **Local-First Architecture**: Powered by browser `CacheStorage` & `IndexedDB`, downloading all scripture, names, and cross-references once to user's device for 0ms offline capability.
- **Harmonic Acoustic Synthesis**: Web Audio engine rooted in Boarderless harmonic series ($G_3 = 196\text{ Hz}$) with canonical division overtones and stereo positioning.
- **Audited Theological Knowledge Integration**: Ingested ChatGPT's 135 theological relations with plain-English rationales, classification badges, and verified `Bible.pdf` page citations into `theological_relations.json`.
- **Hitchcock Names Entity Graph**: Ingested 2,619 names and definitions into `hitchcock_names.json`.
- **Automated Regression Suite**: 8 Playwright tests passing cleanly in 5.9s (`tests/bibleviz.spec.ts` + `tests/interact.spec.ts`).

## 2026-10-14 20:44:00 — Antigravity / HistoricalBible — Project Scaffolded & Ingestion Complete at E:\HistoricalBible

### Status Overview
- **Workspace Location**: `E:\HistoricalBible`
- **Legal Clearance**: Fully verified and compliant under 17 U.S.C. § 102(b) (mathematical/procedural visualization), CC BY 4.0 (OpenBible.info cross-reference dataset by Stephen Smith / Treasury of Scripture Knowledge), and Public Domain (King James Version text).
- **Compiled Datasets**:
  - `public/data/cross_references_bundle.json`: 343,570 full cross-references (19.8 MB)
  - `public/data/cross_references_curated.json`: 117,200 curated cross-references (6.8 MB)
  - `public/data/kjv_verses.json`: 31,102 full KJV verses across all 1,189 chapters (4.65 MB)
- **Interactive UI (`index.html`)**:
  - **Arcs View**: 60 FPS HTML5 Canvas engine with 1,189 chapter histogram bars (Psalm 119 max spike), 10 canonical division colors, distance rainbow mode, pan/zoom, hover hit-testing, and dynamic arc highlighting.
  - **Threads View**: 3-pane chapter reader, 66-book canon spine with dynamic Bézier threads, and right-hand inspector.
  - **Right Inspector Drawer**: Focal verse display, 10-division connects-to distribution bar, and inline target KJV passage cards with 1-click pivot navigation.
  - **Footer Attribution**: CC BY 4.0 compliant attribution to OpenBible.info and Treasury of Scripture Knowledge.
- **Pipelines**:
  - `scripts/build-crossref-data.py`: Downloads and compiles OpenBible dataset.
  - `scripts/fetch-kjv-text.py`: Downloads and indexes full 31,102 KJV verses.
- **Test Automation (`tests/bibleviz.spec.ts`)**:
  - 5 comprehensive Playwright tests covering license compliance, canonical invariants (1,189 chapters, Psalm 119 spike), mode switching, verse selection with inline scripture cards, and omnibox search.

### Next Actions
1. Run local dev server (`npx vite`) or execute tests (`npx playwright test`).
2. Explore extending a 3rd visualization mode in the future based on Chris Harrison's "Bible Social Network" (`BibleNetwork.jpg`, mapping 2,619 biblical people and places co-occurrences).
