## 2026-10-16 20:44:00 — Antigravity / HistoricalBible — Reader-to-Inspector Synchronization & Leaflet Map Resolution (v00.01.26)

- Resolved 5 UI/UX & data-binding bugs on `/bible?book=2+Kings&chapter=1`:
  1. **Tab Locking & Geographic Sync**: Word clicks update selected word state without hijacking away from active `Map` or `Chronology` companion tabs. Geographic words (`Tishbite` -> Tishbe in Gilead, `Samaria`, `Ekron`, `Moab`, `Israel`) pan/highlight directly on the Leaflet map with callout cards. Word Inspector auto-switch constrained to right-clicks or when already on inspector tabs.
  2. **Chapter-Level Chronology Resolution**: Replaced single-book fallback with chapter-range lookup across multi-era books (`1 Kings`, `2 Kings`, `2 Chronicles`). 2 Kings 1–8 resolves to Divided Monarchy (Elijah/Elisha c. 853–841 BC) with Mesha Stele, Black Obelisk, and Tel Dan Stele instead of Sennacherib 701 BC.
  3. **Dark Scholarly Tooltips**: Themed Leaflet tooltips and popups in obsidian dark/gold styling (`rgba(18, 20, 26, 0.96)`, gold border `#d4af37`), adding 1-line passage relevance context for all territorial polygons.
  4. **Deep Zoom & Marker Collision Offset**: Set `maxZoom: 15` / `maxNativeZoom: 13` allowing granular exploration. Clustered markers `< 0.12` deg in Jerusalem receive deterministic radial jitter offset, and markers filter to active chapter epoch with `✨` All Era Artifacts toggle.
  5. **Scripture Connection Badges & Discovery Drawer**: Added gold Scripture Connection badges to artifact tooltips and implemented interactive `#bible-companion-artifact-drawer` beneath the map canvas for full artifact details without losing place in Scripture reader.
- Automated Verification: Added 5 Playwright tests in `tests/bible-side-by-side-map.spec.ts`. All 51 Playwright tests pass green. Canonical KJV invariants (31,098 verses, 14,133 translator italics, 5,556 cased LORD) confirmed. Production build compiles in 733ms.

## 2026-10-16 15:08:00 — Antigravity / HistoricalBible — Dual Chronology Engine & Hero Alignment (v00.01.13)

- Updated `/bible` top gold hero text to: `— READ THE BIBLE WITH WORD-FOR-WORD INSPECTION` and main title to `The Holy Bible`. Moved download actions exclusively to the illuminated Archival Print Edition card at the bottom of the page (`#archival-pdf`).
- Implemented 66-Book Dual Chronology Engine (`src/data/bibleChronology.ts`) distinguishing **Event Chronology** (when events occurred) from **Composition Chronology** (when books were penned).
- Added `Order:` selector to sticky toolbar supporting `Canonical (Gen → Rev)`, `Chronological (When Happened)`, and `Chronological (When Written)` with dynamic book regrouping.
- Added Dual Chronology Banner above each chapter displaying Event Date, Authorship Date/Author, and Chronological Delta note.
- Added `Chronology & Eras` companion tab with detailed historical era context and bridge links to contemporary world empires in the Study Desk (`/interact?era=...`).
- Word-for-word selectability: Every word is wrapped in `<span class="kjv-word">`. Left-clicking or right-clicking (contextmenu) any word displays its Hitchcock definition and concordance occurrences in the right companion tab without navigating away.
- In-place verse inspection: Clicking any verse row highlights it and populates Treasury of Scripture Knowledge cross-references in the companion pane, eliminating disruptive page redirects.
- Small-caps divine names (`LORD`, `GOD`) and bracketed translator italics `[...]` preserved with zero fragmentation.
- Verification: Updated Playwright regression test `tests/site_pages.spec.ts` locking gold text, dual chronology banner, sort mode switching (Canonical, Event, Written), and Chronology & Eras tab; all 33 Playwright tests and 2 collection regression tests pass. Production build succeeds in 383ms.

## 2026-10-16 14:35:00 — Antigravity / HistoricalBible — Live Scripture Reader & Archival PDF Portal (v00.01.12)

- Replaced the static download card on `/bible` with a live, client-side Scripture Reader (`src/bibleReader.ts`) reading directly from the canonical KJV IndexedDB store with 66 books, chapter navigation, small-caps divine names, and Study Desk links.
- Elevated the downloadable edition into an illuminated Archival Print Edition (PDF) card with explicit notice clarifying that it is a static printable document for physical printing and offline reading, distinct from an interactive app.
- Verification: Added regression test in `tests/site_pages.spec.ts` locking 66 books, Genesis 1/2 reading, and archival PDF notice/links; 33/33 Playwright tests and all collection tests pass. Production build succeeds in 369ms.

## 2026-10-16 14:02:00 — Antigravity / HistoricalBible — 2D Interactive Ego-Graph Canvas & Bidirectional URL Deep-Linking (v00.01.11)

- Integrated a lightweight 60FPS 2D HTML5 Canvas Ego-Graph Inspector (`src/engine/egoGraph.ts`) with 1-hop and 2-hop neighborhood expansion, click-to-pivot navigation, hover tooltips, and smooth pan/zoom in untarnished bronze/olive/stone styling.
- Added bidirectional URL state synchronization (`src/store/urlStateRouter.ts`) making figures (`?figure=`), names (`?name=`), verses (`?ref=`), collection tabs (`?tab=`), and view modes (`?view=graph`) bookmarkable and shareable with full browser back/forward history support.
- Directly wired into the existing `BibleNetwork` (2,408 names, 12,058 edges) and `HistoricalSynchrony` dataset in IndexedDB, rejecting 67MB redundant markdown chunking.
- Verification: Added Playwright tests `INT-19` and `INT-20`; all 30 Playwright tests (`bibleviz`, `site_pages`, `interact`) and `npm run test:collection` pass cleanly. Production build succeeds in 464ms.

## 2026-10-16 02:43:15 — Antigravity / HistoricalBible — Realigned Application Version to Beta Sequence (v00.01.07)

- Replaced `1.x` application version numbers across `interact.html` (`Interact · v00.01.07`), `package.json` (`"00.01.07"`), `package-lock.json` (`"00.01.07"`), and `changelog.md` (`[00.01.00]` through `[00.01.07]`), and added a regression test in `tests/site_pages.spec.ts` locking the version to `v00.01.xx`.
- Verified with `npm run build` and `npx playwright test tests/site_pages.spec.ts` (6 passed).

## 2026-10-16 01:36:30 — Antigravity / HistoricalBible — Unified Dark-Gold Redesign v00.01.06 pushed to GitHub

- Completed and pushed the v00.01.06 dark-gold redesign across `index.html`, `interact.html`, `bible.html`, `contact.html`, and clean directory routes (`bible/index.html`, `contact/index.html`, `interact/index.html`).
- Preserved verbatim mission/conviction copy (`PURPOSE` / `CONVICTION`), restored the dark-gold "Download the Bible" welcome popup (`#popup-widget6691`), implemented true small-caps `LORD` (`L` + `0.74em` `ORD`), removed all `"hand-typed"` references from pages/meta tags, and added the quiet "Why the KJV" footnote above the footer on Home.
- Verified with `npm run build` and 20 passing Playwright tests (`tests/interact.spec.ts` and `tests/site_pages.spec.ts`). Canonical detail: `E:\HistoricalBible\what_and_how_log.md`.

## 2026-10-15 21:47:14 — Codex / HistoricalBible — Accessibility proof v0.3.1 completed

- Produced E:/HistoricalBible/pdf-proof/v0.3.1/Bible-proof-v0.3.1.pdf: cover headings and readable ornament text; 1,160 labeled, tagged return links with unique page annotations. v0.2.0 and v0.3.0 remain as comparison proofs; originals and website untouched.
- Three accessibility tests pass; all 1,162 pages preserve text, geometry and link destinations; bookmarks and labels match v0.3.0. Five rendered pages are pixel-identical. See E:/HistoricalBible/what_and_how_log.md and pdf-proof/v0.3.1/verification-summary.json. Screen-reader behavior and PDF/UA conformance remain untested.
- Proof version 0.3.1; application version 1.5.0. No commit, push or deployment. Current proof-folder footprint ~141.7 MB under revised 160 MB cap.

## 2026-10-15 21:38:26 — Codex / HistoricalBible — Accessibility proof v0.3.1 started

- Intent: improve tagged reading structure and accessible navigation in a new versioned PDF proof. Keep Scripture text, page layout, click destinations, recovered originals, and website files unchanged.

## 2026-10-15 21:31:54 — Codex / HistoricalBible — Chapter navigation v0.3.0 completed

- Added 1,189 nested chapter bookmarks and viewer labels Cover/Contents/1-1160 in E:/HistoricalBible/pdf-proof/v0.3.0/Bible-proof-v0.3.0.pdf. Previous v0.2.0 and original PDF/DOCX remain intact. No text, page layout, or links changed; no publish/commit/deploy.
- Five navigation regression checks pass. Every chapter destination and label sequence checked. All 1,162 pages' text, geometry, links and tagged structure match; original 74 outline entries and 1,296 links preserved. Source/test: scripts/add_pdf_navigation.py; tests/test_pdf_navigation.py.
- Reproduce from the v0.2.0 proof with the navigation script; verify with the new five-test suite. Full shared-source/lifecycle notes are in E:/HistoricalBible/pdf-proof/README.md and v0.3.0/verification-summary.json.
- Current proof-folder footprint: approximately 106 MB against the documented 120 MB cap. The previous proof is retained. Accessibility remains a separate future review, with no changes made here.

## 2026-10-15 20:02:19 — Codex / HistoricalBible — PDF proof v0.2.0 delivered

- Separate review proof and repaired master: E:/HistoricalBible/pdf-proof/v0.2.0/. Preserves cover/layout, 74 bookmarks, 1,296 links; clean native Scripture selection with embedded exact body font. Originals, corpus/site, governance and user's open Word window unchanged. No commit/push/deploy.
- Verification: 18 tests pass; six tests in each suite fail on corresponding original. All 31,102 ordered verse texts and 1,162 native body geometries checked; 11 pages rendered/reviewed. Canonical detail: what_and_how_log.md entry 2026-10-15 20:02:19; proof guide and verification-summary.json.
- Review boundary: 384 comparison rows retained unchanged (mostly boundaries/spellings; some fallible witness extraction). This proof is not editorially certified or approved to replace the website PDF. Future authorized text adjudication should use the recorded source pages, not automatically adopt witness text. Preserve recovered per-word CSV/XLSX files for the owner's later language-comparison goal.
- Artifact impact: +1,032 source/+281 test lines; 21 retained artifact files (~68.2 MiB); two bundled-runtime packages added, no app dependency change. Obsolete approach and intermediate exports removed. Two bounded delegate contributions manually verified/integrated; no pending delegate work.

## 2026-10-15 16:23:05 — Codex / HistoricalBible — PDF repair v0.1.0 started

- Owner authorized work on the PDF, preserving intended structure, clickable navigation, and clean text selection/copying.
- Writable: separate local candidate, repair tools/tests and audit records, required logs. Original Bible.pdf, website corpus, constitutional files, remote Git and deployment remain unchanged.
- Existing audit's PDF SHA-256 matches the current original. Use native PDF text/links and inspect rendered pages before applying changes widely.

## 2026-10-15 16:16:37 — Codex / HistoricalBible — Governance v1.0 adopted

- Installed owner-selected AGENTS.md and principles.md as byte-identical root copies from Downloads/HistoricalBible_Revised_Governance_and_PDF_Plan. README records owner adoption despite the preserved proposed-status headers, canonical ownership, stable amendment rules, and read-before-work links.
- Scope: local governance installation and discovery links only. No PDF/corpus, application, dependency, runtime, remote, branch, commit, or deployment changes. Existing uncommitted work preserved.
- Verification: both SHA-256 hashes match supplied originals; reciprocal governance links and existing Bible-network-audit.md resolve. Referenced BIBLE_PDF_REPAIR_PLAN.md remains in Downloads and is explicitly outside this task. No project mirror exists at E:/AI_Hub/Projects/HistoricalBible.
- Prose-only verification: exact insertion/prefix checks preserve previous README and log content; application/tests unchanged, so no browser/build suite or application version bump. Governance revision: v1.0.
- Artifact impact: 2 Markdown files added; README and 3 project records updated; 0 source/test lines, dependencies, datasets, generated binaries, or scratch files added.
- Future work: follow the adopted foundations; proposed PDF repair remains unauthorized and unexecuted.

## 2026-10-15 14:59:43 — Codex / HistoricalBible — Interact v1.5.0

- Completed a discovery-led reader: Jesus/Pilate opening, 12 profile routes, questions, source links, local artifact photograph, trail/back, onward cross-reference reading, and responsive layouts.
- Verified 17 scoped headed browser checks plus final responsive/direct-file checks and canonical build. New INT-06 was observed failing on the old interface and passes now. Source and evidence distinctions are in the page; the inherited wider historical collection was not fully audited.
- Preview: http://127.0.0.1:5173/interact.html . Vite preview process is intentionally retained for user review. No commit/push/deployment. Other preexisting changes preserved.
- Canonical record: E:\HistoricalBible\what_and_how_log.md (v1.5.0). Three owned additions; no dependencies or databases; one CC0 photo, 118 KB.
# HANDOFF.md — HistoricalBible.com

## 2026-10-15 00:15:00 — Antigravity / HistoricalBible — Exact GoDaddy Web Archive Verbatim Restoration

### Status Overview
- **Verbatim Restoration**: Restored original GoDaddy archive files (`Historical Bible - Faith and Religion, The Bible.html` -> `index.html`, `HistoricalBible.html` -> `contact.html`, `Bible-download.html` -> `bible.html`) with 100% visual fidelity.
- **Original Brand & Layout**: Maintained GoDaddy typography (`Righteous` and `Josefin Sans`), header navigation, hero banner (`20190908_192538.jpg`), PayPal donation workflow (`BibleHistorical@gmail.com`), and popup modal.
- **Asset Mirroring**: Full asset directories mirrored into root and `public/` (`Historical Bible - Faith and Religion, The Bible_files`, `HistoricalBible_files`, `Bible-download_files`).
- **Direct PDF Serving**: Download link routes to the project's 9.5MB `Bible.pdf`.
- **Interactive Gateway**: 3D Scripture Tapestry accessible at `/interact` (`interact.html`).
- **Automated Verification**: Full Playwright test suite passes (4/4 routes verified with screenshots in `test-results/`). Production Vite build succeeds in 1.01s.

## 2026-10-14 23:48:00 — Antigravity / HistoricalBible — Full Multi-Page Suite & GitHub Pages Custom Domain Hosting Ready

### Status Overview
- **Complete Web Suite**: Rebuilt Home (`index.html`), Contact Us (`contact.html`), and Bible Download (`bible.html`) pages from GoDaddy Web Archive with Cinzel/Lora typography, brand logo, and mission pillars.
- **Stand-alone 2D Tapestry**: Preserved at `tapestry.html`.
- **Self-Hosted Bible.pdf**: Copied to `public/Bible.pdf` and `public/downloads/Bible.pdf` (~9.5 MB) for direct downloads.
- **Custom Domain Deployment**: `CNAME` for `historicalbible.com`, `.nojekyll`, and automated `.github/workflows/deploy.yml` configured.
- **Directory Routing**: Clean routing aliases created for `/contact`, `/bible`, and `/interact`.
- **Automated Verification**: 12/12 Playwright regression tests passing in 8.4s. Production Vite build in 838ms.

## 2026-10-14 23:28:00 — Antigravity / HistoricalBible — KJV Scripture Corpus & Linguistic Integrity Ingestion Live

### Status Overview
- **Authoritative Text**: Ingested all 31,098 verses extracted directly from the project's `Bible.pdf` into `public/data/kjv_verses.json`.
- **Translator Additions**: Restored **14,134 bracketed verses** (`[...]`) preserving the KJV italicized translator additions with dedicated `.kjv-added` styling and informative scholarly tooltips.
- **Divine Tetragrammaton**: Preserved **5,556 verses** with `LORD` in divine small-caps covenant styling, distinguishing from **1,010 verses** with `Lord` (Adonai / Master).
- **Verse Delimiters**: Standardized `{chapter:verse}` notation across all UI inspectors and headers, protecting all **247 verses** containing internal scripture parentheses `(...)` from parsing collisions.
- **Master README**: Published the permanent chapter **"The Textual Foundation: Preserving the KJV"** to GitHub.
- **Automated Regression Suite**: 9 Playwright tests passing cleanly in 6.5s (including new `REG-08` KJV language integrity test). Production Vite build compiling in 809ms.

## 2026-10-14 23:08:00 — Antigravity / HistoricalBible — Public GitHub Release at CrackenReleased/HistoricalBible Live

### Status Overview
- **Public GitHub Repository**: **[https://github.com/CrackenReleased/HistoricalBible](https://github.com/CrackenReleased/HistoricalBible)**
- **Landing Page & Gateway**: `https://historicalbible.com/interact` (`interact.html`)
- **Master README**: Authoritative technical and historical documentation covering the local-first architecture and KJV textual foundation.
- **Three.js 3D Spatial Loom**: GPU-accelerated WebGL arc engine plotting 1,189 chapters in 3D orbit with additive-blended Bézier splines and 60 FPS orbital camera controls.
- **Local-First Architecture**: Powered by browser `CacheStorage` & `IndexedDB`, downloading all scripture, names, and cross-references once to user's device for 0ms offline capability.
- **Harmonic Acoustic Synthesis**: Web Audio engine rooted in Boarderless harmonic series ($G_3 = 196\text{ Hz}$) with canonical division overtones and stereo positioning.
- **Audited Theological Knowledge Integration**: Ingested ChatGPT's 135 theological relations with plain-English rationales, classification badges, and verified `Bible.pdf` page citations into `theological_relations.json`.
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
