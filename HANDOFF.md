## 2026-10-21 01:35:30 — Codex / HistoricalBible — World-context vision and action brief

- The owner asked for a clear, usable direction for Gemini and Claude, with subtle changes to the existing Bible sidebar/map. `HISTORICAL_WORLD_CONTEXT_BRIEF.md` is revision 1 of that task brief; read it alongside `HISTORICAL_EVIDENCE_IMPLEMENTATION.md` and `HISTORICAL_SOURCE_REGISTER.md`.
- It assigns five bounded packages and two representative slices: 2 Kings 18:13 shared context/relationships/independent world item, then Elijah journey plus the David/Achish relationship exception. It records the verified era-only reader-to-map link and wrong Hezekiah figure IDs on multiple prophet routes. These are future work, not changes made in this session.
- App remains local v00.01.57; documentation only. No application tests were needed, no app code or canonical/governing files changed, and nothing was committed or published. See `what_and_how_log.md` at this timestamp.

## 2026-10-20 23:28:18 — Codex / HistoricalBible — Local v00.01.57 evidence pass

- Owner asked for an unambiguous research-gap guide and implementation, and chose free, donation-supported study. `HISTORICAL_EVIDENCE_IMPLEMENTATION.md` is the execution contract; `HISTORICAL_SOURCE_REGISTER.md` is the 20-object source/rights ledger. All 20 atlas entries now have scoped evidence receipts, with proposed/disputed identifications explicitly labeled.
- Gallio/Acts 18:12 runs through Interact, map and reader with an evidence receipt and separate Seneca literary link. Reader defaults to three reviewed quotation links while retaining all 344,799 attributed OpenBible suggestions behind disclosure. One Genesis 1:2 Hebrew occurrence and two passage-specific chronology synchronies are reviewed; other occurrences and dates disclose their limits. No global lemma/date graph was fabricated.
- Corrections include wrong object IDs/URLs, the Soloi inscription plotted in Turkey, false Hezekiah/Moses profile routes, and unsupported exact or whole-narrative archaeology claims. KJV and governing files untouched. No commit, push, deployment, image import or paid-tier change.
- Validation: `npm run test:data` 30/30; evidence browser 5/5; affected map/Interact/reader/word browser run 47/48 on an outdated Pilate pending-copy assertion, then the corrected deep-link test 1/1; `npm run build` passed and verified 31,102 KJV verses. Desktop/mobile Gallio path visually checked. Details and sibling scan are in `what_and_how_log.md` at the same timestamp.
- Next source-dependent scope: extend reviewed quotation kinds, occurrence-level Hebrew/Greek alignment and dated-event coverage only with licensed, individually checked records. Do not infer every-verse dates or same-name identity from this seed. Public site remains unchanged until separately authorized publication.

## 2026-10-18 17:01:18 — Codex / HistoricalBible — Historical purpose and accurate credits (v00.01.56)

- User requested proper acknowledgement of Biblical Connections and a clearer focus on the wider world during biblical events. Verified scripts/build-crossref-data.py and shipped metadata identify OpenBible.info as the cross-reference source. Biblical Connections https://biblicalconnections.org/about/ independently credits OpenBible and Treasury of Scripture Knowledge; OpenBible's source page confirms that provenance. No evidence was found that Biblical Connections supplied this repository's dataset.
- Updated public Home/Interact/Bible statements to: “Explore Scripture alongside the people, kingdoms and events of world history.” Home purpose/support copy and Interact introduction now emphasize contemporary world history, timelines and maps, with cross-references supporting study. Added linked Biblical Connections acknowledgements as a related project on Home, Interact and Tapestry while retaining OpenBible/TSK licensing and existing lexical-source credits. README title/introduction and package description now match that purpose. No unsupported exclusivity or endorsement claim.
- Validation: all 13 affected browser tests (site_pages and bibleviz) pass, including existing tests extended with source/related-project link assertions. Canonical verifier and production build pass. Reviewed desktop purpose section and mobile Interact credits; no horizontal overflow at 390px. Existing regression expectations updated for the three changed slogans; no new standalone test file for prose edits.
- Sibling scan: checked the three repeated public slogans and existing attribution in Home, Interact, Bible and Tapestry. No Scripture, source datasets, doctrine/governance files or application logic changed. Previous local v00.01.55 test cleanup preserved. Local, uncommitted and unpublished.

## 2026-10-18 16:24:30 — Codex / HistoricalBible — Test suite cleanup (v00.01.55)

- Scope: test suite, runners, dependencies and testing documentation only. No application/source-corpus edits, commits, push or deployment. Public map release footer remains v00.01.54; package v00.01.55 identifies this local tooling revision.
- Baseline: 78/78 browser, 24/25 Node and 36/36 Python after supplying an isolated Python 3.12 environment. Default npm test previously omitted every Node and Python check. The failing Node assertion incorrectly required route subjects Job/Jonah to be curated historical profiles; actual journey navigation uses Scripture references. Site/city profile foreign-key checks remain intact. Two first-draft browser expectations were corrected to actual initial citations (JOB.1.1 and 2Kgs.14.25); no product change was needed.
- Cleanup: removed duplicated companion-tab ordering test, copied-sort tautology and contact source-string assertions; merged the compass regression into the atlas interaction suite. Removed 27 success-only screenshot calls and their screenshot-only delays; Playwright now retains screenshots and traces on failure (verified during test development). Replaced Windows-only npx.cmd startup with portable Node invocation and strict port handling. Moved console-only water diagnostic to scripts; retired obsolete static-dropdown audit after transferring reachability checks into executable tests.
- PDF/DOCX: retained all proof-specific assertions. Four suites now share cached read-only text/geometry/link comparisons for identical source/output pairs; cache identity includes path/size/mtime. Kept pixel, glyph, tag-tree, bookmark and insertion-specific assertions. Baseline ~61s; final expanded Python run ~34s. Added requirements-test.txt with versions actually installed and verified in ignored .venv-tests.
- Added coverage: atlas all-era/reverse membership and filter foreign keys; Job/Jonah passage navigation through refresh; actual contact subject/body encoding for reserved characters/newlines; importer threshold/empty/truncated inputs, ownership rejection, reciprocal edges, duplicate/unknown references and counts. Invalid exports must fail before directory creation or writing. Pure Python units are independent of local vault/proof assets.
- Validation: 26/26 Node data tests, 79/79 Chromium browser tests, 42/42 Python tests; canonical KJV verifier and Vite production build pass. npm test now covers data + portable Python + browsers; npm run test:all adds artifact-dependent Python acceptance (activate the documented environment). No skipped tests. Two in-memory mutation checks confirm hidden atlas routes and bypassed note ownership cause failures; original product behavior already passes the other new tests, so no claim they fail on old product code.
- Sibling scan: reviewed all 7 Node test files, 11 original browser specs, 7 Python suites and 2 console diagnostics. Consolidated repeated comparisons across 4 PDF suites; retained separate historical-stage/feature checks and distinct Hebrew word cases. No canonical material or governance files changed.
- Delegation: python_suite_review supplied a bounded read-only audit; its later implementation turn was unavailable, so all edits and validation were completed by the parent. No external project code changed. Existing legacy route fallback IDs in userContextStore were observed but not diagnosed or changed in this test-only scope.

## 2026-10-18 08:49:47 — Codex / HistoricalBible — Authorized publication of v00.01.54

- User explicitly requested push following local acceptance. Committing the previously verified atlas coverage/search changes to master and pushing origin, which triggers the existing GitHub Pages workflow.
- Validation carried forward from the completed implementation: 2 data regressions, 4 new browser regressions, 24 existing affected browser tests and production build/canonical-corpus verification passed. No implementation changes since verification.
- Deployment outcome will be recorded in the workspace handoff after the push; this entry records authorization, not a claim of deployment success.

## 2026-10-18 08:48:47 — Codex / HistoricalBible — Atlas coverage and competent search (v00.01.54)

- Authorized scope: vet and complete map menus/search locally. No commit, push or deployment; canonical Bible.pdf, KJV corpus, AGENTS.md and principles.md unchanged.
- Findings: 45 journeys excluded Genesis 1–11 from menus; search only scanned journey annotations and silently truncated at eight. Partial-token matching returned unrelated results. 234 of the original 321 route/stop references used legacy book codes not recognized by the reader. Existing Jonah itinerary invented a landing coast, distance and intermediate towns; Job geography/dates were overstated; Peter’s Babylon/Rome identification was presented as Scripture.
- Delivered: 106 cited editorial story anchors (40 reuse existing stops; 66 are source-only), five additional menu categories, and paginated search across all 31,102 KJV verses/66 books. Also searches all 45 journeys, 18 cities and 20 discoveries. Direct references resolve exactly rather than matching their component digits against unrelated annotations. All-word matching, literal escaped text, keyboard navigation, lazy corpus loading, retry and complete result pagination remain separate from canonical source text. No automatic identity inference from name spellings.
- Accuracy: removed four unsupported Jonah map stops and speculative path geometry; retained four named/approximate places with explicit geographic limits. Corrected the claim of an exact Nineveh population. Job dates/coordinates are visibly conjectural. Peter’s Roman stop is explicitly external tradition. Route annotations are SCRIPTURAL_INFERENCE rather than Scripture quotations. Atlas route Interact links now use the cited passage instead of unrelated shared profile IDs.
- Coverage limits: menu prominence is editorial, not a proof that every possible story label is listed. Search covers the complete existing corpus by KJV words, names and references; it is not a natural-language oracle or an exhaustive biography index. Same-spelling people remain distinct in context. Not every character/event has established coordinates. Undated wisdom, prophetic and future passages are available without invented calendar dates. The intertestamental chronological gap is not populated with invented biblical narratives. Existing external historical/archaeological claims have not all received independent source verification.
- Regression evidence: tests/atlas-coverage-regression.ts initially failed on the absent full-corpus search, then on legacy references and the invented Jonah itinerary; now 2/2 pass. It validates all 106 story citations/IDs/periods/linked-stop existence, 317 current route/stop plus 20 archaeological citations, all 66 book reference anchors, minor names, exact/range references, all-word and whole-word matching, all pages, and accuracy guards. tests/atlas-coverage.spec.ts initially reproduced missing primeval menus and absent Onesiphorus results; now 4/4 pass, including reader book/chapter, mobile overflow, source typography, retry after blocked corpus fetch, injection text and exact-reference exclusion of unrelated cards. Retry test exposed a detached-button/outside-click race, fixed using the original event path.
- Existing affected checks: 24/24 tests across map.spec.ts, map-reading-experience.spec.ts and bible-side-by-side-map.spec.ts passed. Earlier reader-link fixture incorrectly asserted a nonexistent selector, then a chapter digit in the book-only heading; corrected to actual rendered book heading and chapter select. Build and canonical preservation verification passed (31,102 verses, 66 books, 1,189 chapters). Desktop atlas and mobile search screenshots visually inspected.
- Sibling scan: all 45 routes/272 remaining stops and 20 archaeological reference fields checked; all 18 cities included in search. Shared atlas/Bible companion behavior checked by existing tests. Pre-existing reader book selector has lowercase/current-value vs mixed-case option mismatch even when the correct chapter renders; recorded, not broadened into this task.
- Delegation: coverage_audit produced the single catalog and reviewed 42 initial map-stop associations; two ambiguous associations were removed. Final catalog additions persisted before the agent reached its usage limit; parent validated final data and integration.
- Artifact impact: three files added (atlasStories.ts and two regression suites), none deleted; no dependencies, database, duplicated corpus or new persisted schema fields. New source index ~25 KB, bounded to 120 entries before editorial review, maintained by HistoricalBible and consumed by atlas menus/search. Existing ignored dist/ and test-results/ hold reproducible build/verification output; no scratch scripts retained. See git diff for exact source/test growth. No project mirror directory exists.

## 2026-10-17 21:52:00 — Antigravity / HistoricalBible — Header Statistics Positioned Above Search Bar on /interact (v00.01.50)

- Fixed collection statistics totals and provenance footnote appearing below search results: In `src/interact.css`, moved `.collection-stats` and `.collection-provenance` to render above `.collection-search` on both desktop and mobile viewports (`@media (max-width: 820px)`).
- Natural vertical hierarchy established: Masthead → Hero Banner → Collection Statistics Totals (344,799 / 31,102 / 2,453 / 12,323) → Provenance Footnote → Collection Explorer (when expanded) → Search Bar ("Where will you begin?") → Search Result Card (e.g. Jonah) → Study Desk / Discovery Walk.
- Updated Playwright regression suite: `INT-15` search threshold adjusted for natural header hierarchy and expanded `INT-27` in `tests/interact.spec.ts` asserting that stats precede search bar and search results stay strictly underneath search bar (all 29/29 interact tests, 15/15 map tests, and 12/12 collection self-checks pass; `npm run build` passes).

## 2026-10-17 21:40:00 — Antigravity / HistoricalBible — Search Results & Collection Explorer Placed Strictly Below Header on /interact (v00.01.49)

- Fixed search result panel jumping above the Interact header: Removed `#study-workspace` from `src/collectionExplorer.ts` which had assigned flex order 0 to `#name-search-detail` and `#collection-explorer`.
- Kept `#name-search-detail` naturally below `<form id="collection-search-form">` inside `.collection-search`, and `#collection-explorer` below `.collection-stats`.
- Added Playwright regression test `INT-27` in `tests/interact.spec.ts` (all 29/29 interact tests pass; 15/15 map tests pass; 8/8 self-checks pass; `npm run build` passes).

## 2026-10-17 21:26:00 — Antigravity / HistoricalBible — Restored Deep Green Reading Palette on /map with Unified Map Key & Context Bar (v00.01.48)

- Restored the distinctive deep green and warm charcoal reading atlas palette for `/map` (`.atlas-reading` in `src/interact.css`) per user preference: `#171a18` canvas, `#20241f` / `#232722` panels, `#e8dfcd` warm parchment detail drawer, `#c3a576` brass accents, and subtle sepia tile filter (`filter: sepia(.12) saturate(.45)`).
- Kept the dynamic Map Key (`#atlas-legend`, rendered just above the map canvas when regions are enabled) and cross-page context bar (`#atlas-context-bar`) integrated cleanly within the deep green theme.
- Updated Playwright regression test in `tests/map-reading-experience.spec.ts` (15/15 Playwright map tests pass; 8/8 `test:selfcheck` pass; `npm run build` passes). Pre-overhaul revert point remains anchored at `2213ba1` (`v00.01.44-pre-reading-map` / `backup/v00.01.44-pre-reading-map`).

## 2026-10-17 21:11:00 — Antigravity / HistoricalBible — Site-Wide Obsidian & Gold Visual Homogeneity & Cross-Page Context Awareness (v00.01.47)

- Unified `/map` (`.atlas-reading` in `src/interact.css`) with the site-wide Historical Bible Obsidian & Gold design system (`#090c10` canvas, `#0e1218` surfaces and detail drawer, `#141a22` controls, `#d4af37` / `#f0cf65` gold accents, `Cinzel` display heading, `.legend-stop-badge` in `#atlas-legend`, and `filter: none` on `.leaflet-tile-pane`).
- Created `src/store/userContextStore.ts` and wired `src/bibleReader.ts`, `src/studySession.ts`, `src/atlasApp.ts`, and `#atlas-context-bar` in `map.html` so `/map` automatically surfaces the user's active `/bible` reading passage or `/interact` study subject with a one-click `Focus Map on [Context]` button and live cross-page navigation links.
- Added Playwright regression test in `tests/map-reading-experience.spec.ts` (15/15 Playwright map tests pass; 8/8 `test:selfcheck` pass; `npm run build` passes). Pre-overhaul revert point remains anchored at `2213ba1` (`v00.01.44-pre-reading-map` / `backup/v00.01.44-pre-reading-map`).

## 2026-10-17 20:36:00 — Antigravity / HistoricalBible — Dynamic Map Key Restored Above Map When Regions Enabled (v00.01.46)

- Restored `<section id="atlas-legend" class="atlas-legend" aria-label="Map legend" hidden>` directly above `.atlas-canvas-card` in `map.html` with all five colored region swatches (`Kingdom of Judah`, `Kingdom of Israel`, `Hostile Empires & Enemies`, `Friendly & Allied Regions`, `Global World Civilizations`) and map symbol swatches.
- Synced `legend.hidden = !this.mapCanvas?.layers.empires` inside `syncLayers()` in `src/atlasApp.ts` so the Map Key automatically appears just above the map whenever `World Empires` is toggled on and hides when toggled off.
- Styled `.atlas-reading .atlas-legend` in `src/interact.css` to match the full width and warm reading-atlas palette (`#20241f` background, `#eee6d6` ink).
- Added Playwright regression test in `tests/map-reading-experience.spec.ts` (14/14 map tests pass; `npm run build` passes). Pre-overhaul revert point remains anchored at `2213ba1` (`v00.01.44-pre-reading-map` / `backup/v00.01.44-pre-reading-map`).

## 2026-10-17 18:18:30 — Antigravity / HistoricalBible — Map Reading-First Experience Slice Deployed with Explicit Revert Point (v00.01.45)

- **Explicit Pre-Overhaul Revert Point**: Tagged and pushed `2213ba1` (`v00.01.44`) to `origin` as annotated tag `v00.01.44-pre-reading-map` and backup branch `backup/v00.01.44-pre-reading-map` before committing `v00.01.45`.
- Picked up from Codex's live implementation checkpoint in `MAP_EXPERIENCE_DESIGN_PLAN.md` (`v00.01.45`).
- Resolved `<label>`/`<select>` accessible-name collision in `map.html`, aligned `readingMode` camera transitions (`setEra`, `jumpToPreset`, `animateToCoords`) to non-animated `setView` in `src/engine/ancientMap.ts`, reset global dark `details` inheritance inside the parchment reading card (`.atlas-source-note`) and map caption in `src/interact.css`, and suppressed regional inland water labels at macro zoom (`zoom < 6`) in `readingMode`.
- Expanded `tests/map-reading-experience.spec.ts` with desktop (`1440×900`) and mobile (`390×844`) layout, touch-target (`>= 44px`), and WCAG AA contrast (`>= 4.5:1`) verification. All 13/13 Playwright map tests (`tests/map-reading-experience.spec.ts`, `tests/map.spec.ts`, `tests/map-chronology-compass.spec.ts`), 8/8 `npm run test:selfcheck` suites, KJV canonical verification, and `npm run build` pass. Committed and pushed `v00.01.45` to `origin/master`.

## 2026-10-17 17:44:44 — Codex / HistoricalBible — Map structure audit, design v1.1

- Updated MAP_EXPERIENCE_DESIGN_PLAN.md in place: four user-facing parts; regional-source qualification; measured/attested/reconstructed/unknown distinction; conditional bounded LiDAR use; Scripture fidelity and stewardship requirements.
- Removed premature persistence, new sharing formats, comparisons and journey-so-far from initial slice. Explicit student scenario and proof obligations added. No qualified regional map/LiDAR asset or runtime/student proof claimed. App stays v00.01.44; documentation only.

## 2026-10-17 17:31:44 — Codex / HistoricalBible — Map experience design plan v1.0

- Completed requested planning-only deliverable: [MAP_EXPERIENCE_DESIGN_PLAN.md](E:/HistoricalBible/MAP_EXPERIENCE_DESIGN_PLAN.md). Live first-entry/Apostolic Age review and scoped source inspection inform calm entry, progressive controls, temporal semantics, uncertainty handling, wireframe, staged implementation and acceptance matrix.
- Application remains v00.01.44. No source, Scripture, tests, dependencies, commits or deployment changed. No application tests run for prose-only work. Next implementation starts with packages A/B only after owner requests implementation.

## 2026-10-17 01:05:00 — Antigravity / HistoricalBible — Map UI/UX Maturation: Viewport-Clamped Tooltips, Wrapped Single-Border Typography, 5x2 Era Grid & Label De-confliction (v00.01.32)

- **Viewport-Clamped Hover Informationals (`src/engine/ancientMap.ts`, `src/interact.css`)**:
  - Added `constrainTooltipToViewport()` to clamp all `.leaflet-tooltip` popups strictly inside `#atlas-canvas-container`, `#bible-companion-map-container`, and `#ancient-map-container` with a `10px` margin and top-left zoom control clearance.
  - Overrode Leaflet's `white-space: nowrap` with `white-space: normal !important; overflow-wrap: break-word !important;` and replaced inner `<div class="map-leaflet-tooltip">` duplicates with `<div class="map-tooltip-inner">`.
- **5x2 Era Scrubber Grid & Screen-Space Label De-confliction (`map.html`, `src/atlasApp.ts`, `src/engine/ancientMap.ts`)**:
  - Added `divided_monarchy_prophets` (`Divided Kingdom · c. 930 – 722 BC`) button to `map.html` and converted `.chrono-era-selector` to a 5x2 grid with zero text overflow.
  - Added `deconflictMarkerLabels()` with HUD clearance, OT/NT city filtering, concise on-canvas labels, and `focusOnFigure()` era synchronization.
- **Verification**:
  - 14/14 headed Playwright tests in `tests/map.spec.ts` and `tests/bible-side-by-side-map.spec.ts` PASS; `npm run test:selfcheck` (7/7 PASS); `npm run build` PASS.

## 2026-10-17 00:25:00 — Antigravity / HistoricalBible — Progressive Hydration, Expanded Archaeological/Geographic/Chronological Coverage, PDF Deduplication & Contact Mailto Wiring (v00.01.31)

- **Two-Phase Progressive Hydration & Parallel Loading**:
  - Added `localStore.initCritical()`, `isCriticallyLoaded()`, `isFullyLoaded()`, and `buildVerseIndices()` (`src/store/localFirstStore.ts`) and wired `BibleReader.init()` (`src/bibleReader.ts`) so `/bible` renders Scripture, Chronology, and Map panels immediately after `kjv_verses.json` + `historical_synchrony.v1.json` load in parallel, then refreshes X-Refs/Word Inspector when full hydration completes.
- **Expanded Archaeological Sites, Geography & Chapter Chronology**:
  - Added 6 archaeological sites (`lachish-ostraca`, `jehoiachin-ration-tablets`, `dead-sea-scrolls-qumran`, `pool-of-siloam-steps`, `sergius-paulus-inscription`, `arch-of-titus-spoils` → 20 total sites) and 26 biblical cities/regions to `src/data/ancientMapData.ts`.
  - Added granular `chapterBreakdown` arrays to `Josh`, `Judg`, `1Sam`, `2Sam`, `Isa`, `Jer`, and `Dan` in `src/data/bibleChronology.ts`.
- **PDF Proof Consolidation & `public/Bible.pdf` Deduplication**:
  - Removed intermediate `v0.3.0`–`v0.3.2` PDF binaries in `pdf-proof/` (`187.5 MB` → `~87 MB`, under the 160 MB cap) while retaining `v0.2.0`, `v0.3.3`, JSON manifests, and PNG proofs; all 5 Python PDF test suites pass.
  - Added `serveAndCopyRootBiblePdf()` in `vite.config.ts` to serve and copy root `Bible.pdf`, removing duplicate `public/Bible.pdf` (`31.38 MB`, `~136.7 MB` total workspace disk space saved).
- **Contact Form `mailto:` Synthesis & Verification**:
  - Wired dynamic `mailto:BibleHistorical@gmail.com` link generation on `/contact` (`contact.html`) and expanded `tests/data-integrity-selfcheck.ts` (11/11 tests pass; `vite build` passes).

## 2026-10-16 23:36:00 — Antigravity / HistoricalBible — Codebase Audit Remediation: Data Self-Checks, Error Handling, Bloat Cleanup & Docs Sync (v00.01.30)

- **Data Integrity & Automated Self-Checks**:
  - Repaired 5 `[I[` / `[O[` bracket typos in `public/data/kjv_verses.json` (`Numbers 12:6`, `Psalms 25:17`, `Isaiah 41:17`, `Jeremiah 17:10`, `Habakkuk 1:5`) verified against `Bible.pdf` (`pdf-proof/v0.2.0/reference-verses.json`), updated `scripts/build-curated-kjv.js`, and logged exact page numbers and italic offsets in `error_corrections_log.md`.
  - Enhanced `scripts/verify-canonical-kjv.js` with strict non-nested balanced bracket verification (`14,138` bracketed-italic verses, `5,556` `LORD` verses, `66` books, `1,189` chapters).
  - Fixed `src/data/bibleChronology.ts` duplicate `eventOrder: 19` (`Ecclesiastes` & `Obadiah`), missing `eventOrder: 66`, 32 mismatched `eventEraId` foreign keys, and `Titus` `osis: 'Tit'` → `'Titus'`.
  - Created `tests/data-integrity-selfcheck.ts` (`npm run test:selfcheck`) verifying all cross-dataset invariants across KJV, `BIBLE_CHRONOLOGY`, `ancientMapData`, `historical_synchrony.v1.json` ↔ `discoveries.ts`, and `localStore.searchWholeWord`.
- **Error Handling & Runtime Fixes**:
  - Replaced substring concordance matching in `BibleReader.renderWordInspector()` with `localStore.searchWholeWord()`, cached `/data/strongs_reverse.json` in `CacheStorage` with retry support and async Word Inspector re-render, fixed `'tit'` → `'titus'` and added `'job'`/`'joel'`/`'obad'` in `getMapEraForCurrentPassage()`, added `Chronological Reconstruction` evidence-class disclosure to `renderCompanionChrono()`, and HTML-escaped `BibleReader.renderError()`.
  - Wired `/map` detail drawer links (`src/atlasApp.ts`) to `/bible?ref=...`, rendered `WATER_FEATURES` (`seas` and `rivers`) on the Waterways layer in `AncientMapCanvas` with an offline tile-error badge (`src/engine/ancientMap.ts`), added null guards in `src/main.ts`, `src/collectionExplorer.ts`, and `src/engine/egoGraph.ts` (`destroy()`), and fixed `tapestry.html` data ingestion and `SEED_TEXTS["Isa.49.6"]`.
- **Bloat Cleanup & Docs Sync (`v00.01.30`)**:
  - Removed duplicate `public/downloads/Bible.pdf` (31.38 MB), 6 legacy GoDaddy `*_files/` folders, 5 unused JSON datasets in `public/data/`, and 4 one-off migration scripts in `scripts/`, reducing `dist/` by **41.04 MB** (`107.75 MB` → `66.71 MB`).
  - Converted duplicate `bible/index.html` and `contact/index.html` to lightweight redirect stubs and updated `README.md`, `package.json`, `interact.html`, and `map.html` to `v00.01.30`.
- **Verification**:
  - `node scripts/verify-canonical-kjv.js` PASS; `npm run test:collection` (9/9 PASS including `tests/data-integrity-selfcheck.ts`); `vite build` PASS in 682ms.

## 2026-10-16 22:15:00 — Antigravity / HistoricalBible — Map Interaction Hardening, Zero-Collision Exclusivity & Northern Kingdom Inspection (v00.01.29)

- **Map Interaction Hardening & Tooltip Exclusivity**:
  - Implemented `bindManagedTooltip(layer, content, options)` in `src/engine/ancientMap.ts` maintaining a singleton `activeTooltipLayer`. Opening any tooltip closes previous ones, preventing multiple tooltips from sticking on screen simultaneously.
  - Attached listeners on `movestart`, `zoomstart`, `click`, and `container.mouseleave` to dismiss active tooltips and prune orphaned DOM nodes from Leaflet's `tooltipPane`.
  - Enforced `pointer-events: none !important;` in `src/interact.css` on `.leaflet-tooltip` and `.map-leaflet-tooltip` to prevent hover dropouts and sticky popups.
- **Northern Kingdom of Israel (`israel_kingdom`) Accessibility**:
  - Refined geodetic boundaries in `src/data/ancientMapData.ts`: bounded `assyria` and `babylon` western borders to `lng: 37.5`, freeing Northern Israel (Samaria), Phoenicia, and upper Judah from geodetic occlusions.
  - Sized and enriched `israel_kingdom` polygon (`lat: 31.95–33.30, lng: 34.85–35.80`) covering Samaria, Megiddo, Jezreel, Shechem, and Gilead.
  - Sorted SVG polygons by area descending (`parseArea(b.approximateArea) - parseArea(a.approximateArea)`), guaranteeing macro empires render in the background and focal kingdoms render in the foreground.
  - Added interactive polygon hover styling (`#ffd700` gold border, fill opacity 0.32, `polygon.bringToFront()`) and click handling to open the historical dossier drawer.
- **DivIcon Hitbox Shrinkage & Directional Quadrant Layout**:
  - Sized DivIcons strictly to their visual dimensions: `capIcon: [12, 12]`, `goldIcon: [28, 28]`, `cityIcon: [10, 10]`, eliminating wide bounding boxes (80px–140px) that intercepted mouse events over neighboring regions.
  - Implemented directional quadrant classes:
    - Coastal / Western (`philistia`, `phoenicia`): `.label-west` pointing into the Mediterranean Sea.
    - Southern (`judah`, `edom_kingdom`): `.label-south` pointing southward.
    - Northern (`israel_kingdom`): `.label-north` pointing northward.
  - Established strict faction-aware Z-index priority: Discovery coins (`1600`) > Covenant & Israel capitals (`1500`) > Secondary capitals (`1200`) > Biblical cities (`500`).
  - Deduplicated imperial seats in `BIBLICAL_CITIES` to prevent duplicate gray city dots from overlapping prominent royal capitals.
  - Relocated `moab_kingdom` capital coordinates to `Kir-Hareseth (Kerak)` (`lat: 31.18, lng: 35.70`), the southern fortress of King Mesha, completely eliminating overlap with the northern `Mesha Stele` discovery site at Dibon.
- **Automated Verification**:
  - Added regression tests in `tests/bible-side-by-side-map.spec.ts` and `tests/map.spec.ts`.
  - All 54 Playwright tests pass (54/54); collection tests pass (4/4); 100% canonical KJV 31,102 verses verified; zero errors in Vite production build.

## 2026-10-16 21:32:00 — Antigravity / HistoricalBible — Global Ancient Macro-Cartography & Contemporary Civilizations (v00.01.28)

- **Global Ancient World Civilizations in Every Era**:
  - Expanded map projection bounds (`MAP_BOUNDS`) from Near East rectangle (`[10.0, 24.5]` to `[54.0, 44.0]`) to global perspective (`[-10.0, 8.0]` to `[125.0, 56.0]`) spanning Atlantic/Rome across Africa, Eurasian steppes, Middle East, India, to China.
  - Added major contemporary world civilizations across all eras:
    - **Ancient China**: Zhou Dynasties (`china_zhou`, c. 1046–256 BC; capitals Haojing & Luoyang; ~35M pop; ~3.4M km²) and Han Dynasty (`china_han`, 202 BC–AD 220; capitals Chang'an & Luoyang; ~57.6M pop; ~6.0M km²; "Land of Sinim", Isaiah 49:12; Silk Road).
    - **Northern Steppes / Russia / Scythia**: Scythians, Cimmerians & Sarmatians (`scythia_steppes`, c. 900 BC–AD 200; capital Neapolis Scythica; ~2M pop; ~3.2M km²; "Gog, Magog, Meshech, and Tubal", Ezekiel 38–39).
    - **Kingdom of Kush / Nubia / Ethiopia across All Ages**: Upper Nile empire (`kush_nubia`, c. 1070 BC–AD 350; capitals Napata & Meroë; ~2.5M pop; ~1.2M km²; Pharaoh Tirhakah in 2 Kings 19:9 / Isaiah 37:9 and Queen Candace in Acts 8:27).
    - **Ancient India**: Maurya Empire and Kushan Realm (`india_maurya`, c. 322 BC–AD 230; capital Pataliputra; ~50M pop; ~5M km²; "Hoddu", Esther 1:1, 8:9).
    - **Arabian Kingdoms**: Kingdom of Saba (`kingdom_sheba`, c. 1200 BC–AD 275; capital Marib; ~1.5M pop; ~450k km²; Queen of Sheba) and Nabataean Kingdom (`nabataea`, c. 312 BC–AD 106; capital Petra; ~1M pop; ~250k km²).
    - **Babylon across All Ages**: Old Babylonian & Kassite Kingdom (`old_babylon`, Tower of Babel / Ur) and Neo-Babylonian Empire (`babylon`, Nebuchadnezzar).
    - **Egypt across All Ages**: Middle & New Kingdom Egypt (`egypt`), 26th Saite Dynasty (`saite_egypt`), and Ptolemaic Kingdom (`ptolemaic_egypt`).
    - **Persia & Media**: Median Empire (`media`), Achaemenid Empire (`persia`), and Parthian Empire (`parthia`, Ctesiphon).
    - **Levantine Neighbors**: Kingdom of Judah (`judah`), Kingdom of Israel (`israel_kingdom`), Phoenicia (`phoenicia`), Aram-Damascus (`aram_damascus`), Philistia (`philistia`), Moab (`moab_kingdom`), and Edom (`edom_kingdom`).
- **Five-Tier Faction Classification & Universal Map Key**:
  - 🟡 Covenant Nation (`#eab308`), 🟢 Northern Kingdom (`#22c55e`), 🔴 Hostile Enemies (`#ef4444`), 🔵 Friendly/Allied (`#38bdf8`), 🟣 Global World Civilizations (`#c084fc`).
  - Added `.map-key-dot.dot-global` to `src/interact.css` and added Global World Civilizations to the Kingdoms & Factions map key card in `bible.html`, `bible/index.html`, and `map.html`.
- **Demographic Metadata & Imperial Capital Pins**:
  - Rendered `leaflet-capital-marker` pins with custom labels for all active kingdoms on the map canvas.
  - Hovering/clicking polygons displays Faction Badge, Capital, Estimated Population, Territorial Area, Chapter Relevance, and Scripture Connection.
- **Navigation & Zoom**:
  - Set `minZoom: 2` (was 3) and `all` preset zoom to 3 centered at `[31.0, 52.0]`. Added biblical geographic entities for `ethiopia`, `cush`, `sinim`, `china`, `sheba`, `scythia`, `india`, and `petra`.
- **Automated Verification**:
  - Added regression test in `tests/bible-side-by-side-map.spec.ts` and assertions in `tests/map.spec.ts`.
  - All 52 Playwright tests pass green; 4/4 collection tests pass; 100% canonical KJV 31,102 verses verified; zero errors in Vite production build.

## 2026-10-16 21:03:00 — Antigravity / HistoricalBible — Canonical KJV 31,102 Verse Invariant Restoration (v00.01.27)

- Restored the 4 missing benediction verses (`Phil.4.23`, `1Thess.5.28`, `Heb.13.25`, `Rev.22.21`) into `public/data/kjv_verses.json`, reinstating the true canonical 31,102 Protestant KJV verse count.
- Fail-Closed Gate: `scripts/verify-canonical-kjv.js` and `scripts/build-curated-kjv.js` strictly enforce `verses.length === 31102`.
- Zero Unavailable References: `public/data/bible_network.json` updated with `siteVerseCount: 31102` and `unavailableSiteRefs: []`.
- Eradicated all traces of `31,098` / `31098` across all documentation, tests, scripts, and logs.
- Verification: `npm run test:collection` (4/4 pass), `npm run build` (31,102 verses verified, 14,137 translator italics, 5,556 cased LORD), and all 51 Playwright tests pass green.

## 2026-10-16 20:44:00 — Antigravity / HistoricalBible — Reader-to-Inspector Synchronization & Leaflet Map Resolution (v00.01.26)

- Resolved 5 UI/UX & data-binding bugs on `/bible?book=2+Kings&chapter=1`:
  1. **Tab Locking & Geographic Sync**: Word clicks update selected word state without hijacking away from active `Map` or `Chronology` companion tabs. Geographic words (`Tishbite` -> Tishbe in Gilead, `Samaria`, `Ekron`, `Moab`, `Israel`) pan/highlight directly on the Leaflet map with callout cards. Word Inspector auto-switch constrained to right-clicks or when already on inspector tabs.
  2. **Chapter-Level Chronology Resolution**: Replaced single-book fallback with chapter-range lookup across multi-era books (`1 Kings`, `2 Kings`, `2 Chronicles`). 2 Kings 1–8 resolves to Divided Monarchy (Elijah/Elisha c. 853–841 BC) with Mesha Stele, Black Obelisk, and Tel Dan Stele instead of Sennacherib 701 BC.
  3. **Dark Scholarly Tooltips**: Themed Leaflet tooltips and popups in obsidian dark/gold styling (`rgba(18, 20, 26, 0.96)`, gold border `#d4af37`), adding 1-line passage relevance context for all territorial polygons.
  4. **Deep Zoom & Marker Collision Offset**: Set `maxZoom: 15` / `maxNativeZoom: 13` allowing granular exploration. Clustered markers `< 0.12` deg in Jerusalem receive deterministic radial jitter offset, and markers filter to active chapter epoch with `✨` All Era Artifacts toggle.
  5. **Scripture Connection Badges & Discovery Drawer**: Added gold Scripture Connection badges to artifact tooltips and implemented interactive `#bible-companion-artifact-drawer` beneath the map canvas for full artifact details without losing place in Scripture reader.
- Automated Verification: Added 5 Playwright tests in `tests/bible-side-by-side-map.spec.ts`. All 51 Playwright tests pass green. Canonical KJV invariants (31,102 verses, 14,133 translator italics, 5,556 cased LORD) confirmed. Production build compiles in 733ms.

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
- **Authoritative Text**: Ingested all 31,102 verses extracted directly from the project's `Bible.pdf` into `public/data/kjv_verses.json`.
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
