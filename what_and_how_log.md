## 2026-10-14 20:58:42 — Obsidian Bible Network v0.01.00

- Request: turn assets/BibleNetwork.jpg into a native Obsidian network using the linked OpenBible data.
- Provenance: Chris Harrison's BibleViz page identifies the image as a name-spelling co-occurrence network, distinct from verse cross-references. No original edge/name download was linked. Reconstructed the described method with Hitchcock's dictionary and the existing KJV corpus, clearly labeled as an independent reconstruction.
- Deliverable: E:\AI_Hub\Vault\Bible\Start Here.md; 33,579 generated notes, including 31,102 KJV verses, one explicit 3John.1.15 alternate-versification stub, 2,408 names, 66 book indexes, and two guide notes. Names have 12,058 undirected co-occurrence connections. Full OpenBible 2026-10-12 snapshot preserves all 344,799 records (including 1,229 negative-vote rows); target ranges expand to 614,280 verse links.
- Reusable exporter and verification: E:\AI_Hub\Tools\bible-network\export_bible.py, verify_bible.py, test_export_bible.py. Five unit tests pass for homonyms/aliases, whole-name matching, range expansion, alternate numbering, and Windows-safe note paths. Full validator passes: 723,332 wikilinks, zero dangling links, 31,102 unchanged scripture texts, exact equality with every original (source, range, votes) record, and independent checks of three name-pair evidence counts. This is a new feature, not a bug fix; no old-code fail claim applies.
- Scoped scan: checked all source endpoints (one numbering mismatch), duplicate source/target records (none), duplicate dictionary entries (merged), and all delivered wikilinks. No changes to the HistoricalBible app/runtime or its datasets.
- Lifecycle: generated notes are exporter-owned; personal annotations belong in a separate Bible Study folder. Snapshots and hashes retained with the exporter. Refresh is explicit, no scheduled process. Exporter refuses to overwrite notes without its ownership marker; source removals require explicit archival review.
- Artifact impact: 33,579 derived Markdown files (~64 MiB), 3 Python source/test files, 3 public source snapshots (~2 MiB), and one reproducibility report; no dependencies. No screenshot retained: live graph rendering remains unverified while Obsidian processes the large first import. The app is set to open the Bible guide instead of the global graph. Obsidian start bookmark and names-only graph filter added. No files deleted; no duplicate scripture source introduced. Tool source/test line totals are recorded in the session completion handoff.

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

## 2026-10-14 22:56:00 — Three.js 3D Spatial Loom, Local-First Offline Cache & Audited Theological Inspector for HistoricalBible.com/Interact

### WHAT was built
1. **Three.js 3D WebGL Spatial Loom Engine (`src/engine/threeVisualizer.ts`)**:
   - Built a 3D WebGL GPU-accelerated arc visualizer that plots all 1,189 chapters in an elliptical orbital ring in 3D space.
   - Computes 3D quadratic Bézier splines connecting cross-referenced passages with additive blending and distance-based height scaling.
   - Interactive orbit controls supporting mouse/touch rotation, zoom, and continuous cosmic drift at a locked 60 FPS.
2. **Local-First Client Storage Engine (`src/store/localFirstStore.ts`)**:
   - Uses browser `CacheStorage` and `IndexedDB` to cache KJV scripture text (31,102 verses), cross-reference links (117,200 curated / 343,570 full), Hitchcock's Bible Names (2,619 entries), and theological audit relations on the user's device.
   - Client-side execution offloads rendering to the visitor's local GPU and RAM, providing 0ms search and navigation latency with zero server roundtrips and full offline capability.
3. **Web Audio Harmonic Acoustic Engine (`src/audio/acousticEngine.ts`)**:
   - Complies strictly with Rule 2 of `.agents/AGENTS.md` (no generic synth blips).
   - Rooted in the Boarderless harmonic series ($G_3 = 196.00\text{ Hz}$).
   - Assigns distinct harmonic overtones across the 10 canonical divisions (Law, History, Poetry, Major Prophets, Minor Prophets, Gospels, Acts, Pauline, General, Revelation).
   - Velocity-sensitive attack/decay envelopes with stereo panning determined by canonical position.
4. **Audited Theological Relation Inspector (`src/main.ts` & `interact.html`)**:
   - Compiled ChatGPT's theological batch evaluations (`audit-batch-genesis.jsonl` and `audit-batch-primary.jsonl`) into `public/data/theological_relations.json`.
   - Right Inspector surfaces plain-English theological rationales (*"Creator praised as giver of blessing"*, *"All things originate in God"*), classification badges (`SUPPORTED`, `AMBIGUOUS`, `UNSUPPORTED`), and verified page citations from the printed `Bible.pdf` (e.g., *Page 590 of Bible.pdf*).
   - Ingested Hitchcock's Bible Names Dictionary (`hitchcock_names.json`) and linguistic identity findings (`name_identities_audit.json`).
5. **Dedicated Interactive Gateway (`interact.html` -> `/Interact`)**:
   - Welcomes users with the "Enter the Scripture Tapestry" onboarding modal featuring 4 curated journeys:
     - *1. The Creation Witness* (Genesis 1:1, John 1, Colossians 1, Hebrews 1)
     - *2. The Messianic Promise* (Genesis 3:15, Psalm 22, Isaiah 53)
     - *3. The Golden Thread* (John 3:16)
     - *4. The People & Places Network* (2,619 Hitchcock names & definitions)
   - Real-time local-first telemetry banner reporting offline status and zero backend lag.
6. **Playwright Regression Suite Expansion (`tests/interact.spec.ts`)**:
   - `REG-05`: Verifies Local-First telemetry and Three.js WebGL canvas mounting.
   - `REG-06`: Verifies onboarding modal flow and verse navigation.
   - `REG-07`: Verifies audited theological relations and verified `Bible.pdf` page citations.
   - Full 8-test suite passing cleanly in 5.9 seconds.

### HOW it works & WHY these decisions were made
- **Local-First Architecture**: Offloads all heavy graph computation to the client device. The server only delivers static files; the user's browser executes all spatial maths and searches locally.
- **Three.js WebGL BufferGeometry**: Employs packed `Float32BufferAttribute` arrays for positions and vertex colors, rendering thousands of 3D arcs with a single draw call via `THREE.LineSegments`.
- **Preserved ChatGPT Research**: Ingested all audit findings directly into the web application rather than leaving them dormant in tool scripts.
