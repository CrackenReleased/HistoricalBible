# Changelog — HistoricalBible.com

All notable changes to this project will be documented in this file.

## [00.01.28] - 2026-10-16

- Global Ancient Macro-Cartography & Contemporary Civilizations (`/map` & `/bible`):
  - **Global Ancient World Civilizations in Every Era**:
    - Expanded map projection boundaries (`MAP_BOUNDS`) from a localized Near-East rectangle (`[10.0, 24.5]` to `[54.0, 44.0]`) to a comprehensive global perspective (`[-10.0, 8.0]` to `[125.0, 56.0]`) spanning from the Atlantic and Rome across Africa, the Eurasian steppes, Persia, and India to the Pacific coast of China.
    - Integrated major contemporary world civilizations across all eras:
      - **Ancient China**: Western & Eastern Zhou Dynasties (`china_zhou`, c. 1046–256 BC; capitals Haojing & Luoyang; ~35M pop; ~3.4M km²) and Imperial Han Dynasty (`china_han`, 202 BC–AD 220; capitals Chang'an & Luoyang; ~57.6M pop; ~6.0M km²; terminus of Silk Road trade; biblically designated the "Land of Sinim" in Isaiah 49:12).
      - **Northern Steppes / Russia / Scythia**: Scythians, Cimmerians & Sarmatians (`scythia_steppes`, c. 900 BC–AD 200; capital Neapolis Scythica; ~2M pop; ~3.2M km²; nomadic horsemen referenced in Ezekiel 38–39 as the far northern armies of Magog, Meshech, and Tubal, and Colossians 3:11).
      - **Kingdom of Kush / Nubia / Ethiopia across All Ages**: Upper Nile empire (`kush_nubia`, c. 1070 BC–AD 350; capitals Napata & Meroë; ~2.5M pop; ~1.2M km²; realm of Pharaoh Tirhakah in 2 Kings 19:9 / Isaiah 37:9 and the royal official of Queen Candace in Acts 8:27).
      - **Ancient India**: Maurya Empire and Kushan Realm (`india_maurya`, c. 322 BC–AD 230; capital Pataliputra; ~50M pop; ~5M km²; eastern border of Esther 1:1 and 8:9, "from India [Hoddu] even unto Ethiopia").
      - **Arabian Kingdoms**: Kingdom of Saba (`kingdom_sheba`, c. 1200 BC–AD 275; capital Marib; ~1.5M pop; ~450k km²; Queen of Sheba in 1 Kings 10:1–13) and Nabataean Kingdom (`nabataea`, c. 312 BC–AD 106; capital Petra; ~1M pop; ~250k km²; 2 Corinthians 11:32).
      - **Babylon across All Ages**: Old Babylonian & Kassite Kingdom (`old_babylon`, Tower of Babel / Ur of the Chaldees in Genesis 10–11) and Neo-Babylonian Empire (`babylon`, Nebuchadnezzar).
      - **Egypt across All Ages**: Middle & New Kingdom Egypt (`egypt`, Exodus & Merneptah Stele), 26th Saite Dynasty (`saite_egypt`, Pharaoh Necho & Megiddo), and Ptolemaic Kingdom (`ptolemaic_egypt`, Alexandria & Septuagint translation).
      - **Persia & Media**: Median Empire (`media`, Ecbatana), Achaemenid Empire (`persia`, Cyrus, Darius, Artaxerxes), and Parthian Empire (`parthia`, Ctesiphon; eastern Roman rival, Acts 2:9).
      - **Levantine Neighbors**: Kingdom of Judah (`judah`), Kingdom of Israel (`israel_kingdom`), Phoenicia (`phoenicia`), Aram-Damascus (`aram_damascus`), Philistia (`philistia`), Moab (`moab_kingdom`), and Edom (`edom_kingdom`).
  - **Five-Tier Geopolitical Faction System & Universal Map Key**:
    - Classified every entity into 5 clear color-coded factions:
      - 🟡 **Covenant Nation**: Kingdom of Judah / Royal Davidic Line (`#eab308`).
      - 🟢 **Northern Kingdom**: Kingdom of Israel / Samaria (`#22c55e`).
      - 🔴 **Hostile Empires & Enemies**: Assyria, Babylon, Philistia, Aram-Damascus, Moab, Edom, Seleucid Syria, Imperial Rome (`#ef4444`).
      - 🔵 **Friendly & Allied Regions**: Phoenicia / Tyre & Sidon, Cyrus's Persia, Ptolemaic Egypt, Nabataea (`#38bdf8`).
      - 🟣 **Global World Civilizations**: Ancient China, Scythia/Russia, Kush/Ethiopia, India, Sheba (`#c084fc`).
    - Added `.map-key-dot.dot-global` and Global World Civilizations entry to the Kingdoms & Factions map key card in `bible.html`, `bible/index.html`, `map.html`, and `src/interact.css`.
  - **Rich Demographic & Kingdom Metadata**:
    - Displayed Imperial Capital, Estimated Population, Territorial Extent (km²), Faction Badge, Chapter Relevance, and Scripture Connection in every empire tooltip on hover/click.
    - Added stylized Imperial Capital pins with custom labels (`leaflet-capital-marker`) on the map canvas for active kingdoms (Jerusalem, Samaria, Nineveh, Babylon, Susa, Rome, Haojing/Luoyang, Neapolis Scythica, Napata/Meroë, Marib, Pataliputra, Petra).
  - **Macro-Cartographic Zoom & Preset Navigation**:
    - Expanded map zoom limit to `minZoom: 2` so users can zoom out to view the entire Eastern Hemisphere at once without boundary clipping.
    - Updated `all` region preset to zoom level 3 centered at `[31.0, 52.0]`, smoothly framing the Atlantic, Europe, Africa, the Middle East, India, and China in a single click.
    - Added biblical geographic entities for `ethiopia`, `cush`, `sinim`, `china`, `sheba`, `scythia`, `india`, and `petra` to `BIBLICAL_GEOGRAPHIC_ENTITIES`.
  - **Automated Verification**:
    - Added regression test `Global Macro-Cartography: Multiple contemporary world empires and regional powers render with capitals, populations, and areas` in `tests/bible-side-by-side-map.spec.ts`.
    - Added global legend assertions in `tests/map.spec.ts`.
    - All 52 Playwright tests pass green; 4/4 collection tests pass; 100% canonical KJV 31,102 verses verified; zero errors in Vite production build.

## [00.01.27] - 2026-10-16

- Canonical KJV 31,102 Verse Invariant Restoration:
  - **Full 31,102 Verse Restoration**: Added the 4 concluding epistolary and apocalyptic verses previously omitted from the website reader dataset (`Philippians 4:23`, `1 Thessalonians 5:28`, `Hebrews 13:25`, `Revelation 22:21`) into `public/data/kjv_verses.json`, fully restoring the universal canonical Protestant KJV verse count of 31,102 verses across all 66 books and 1,189 chapters.
  - **Fail-Closed Verification Gate**: Updated `scripts/verify-canonical-kjv.js` and `scripts/build-curated-kjv.js` to strictly enforce `verses.length === 31102` (failing closed if any verse is missing).
  - **Zero Unavailable References**: Updated `public/data/bible_network.json` (`siteVerseCount: 31102`, `unavailableSiteRefs: []`) and `src/collectionExplorer.ts` confirming all 31,102 verses are fully indexed, browsable, and readable online.
  - **Total Eradication of 31,098**: Completely purged all historical references to "31,098" across all scripts, tests, logs, and project documentation in favor of the true canonical 31,102.
  - **Automated Verification**: `npm run test:collection` (4/4 pass), `npm run build` (31,102 verses verified, 14,137 translator italics, 5,556 cased LORD), and all 51 Playwright tests pass green.

## [00.01.26] - 2026-10-16

- Reader-to-Inspector Synchronization & Leaflet Map Resolution (`/bible`):
  - **Bug 1: Stop Forced Tab Hijacking on Word Click**:
    - Left-clicking a word in the Scripture reader updates the selected word and displays a subtle badge on the Word Inspector tab without overriding or switching away from the actively selected `Map` or `Chronology` companion tabs.
    - Added biblical geographic entity & demonym dictionary (`BIBLICAL_GEOGRAPHIC_ENTITIES` in `src/data/ancientMapData.ts`); clicking words like "Tishbite", "Samaria", "Ekron", "Moab", or "Israel" while on the Map tab automatically pans and highlights the location on the Leaflet canvas with a contextual callout card.
    - Word Inspector tab auto-switch is strictly constrained to right-clicks (contextmenu) or when the user is already actively viewing `Word Inspector` or `Passage & X-Refs`.
  - **Bug 2: Chapter-Level Historical & Archaeological Resolution**:
    - Refactored chronology resolution from whole-book fallback to granular chapter-range epochs across multi-era historical books (`1 Kings`, `2 Kings`, `2 Chronicles`).
    - Fixed 2 Kings 1 chronology bleed: chapters 1–8 now correctly resolve to **c. 853–841 BC — Divided Monarchy: Moabite Rebellion & Ministry of Elijah and Elisha** with the *Mesha Stele (Moabite Stone)*, *Black Obelisk of Shalmaneser III*, and *Tel Dan Stele*, permanently replacing the erroneous Sennacherib 701 BC Assyrian siege bleed.
  - **Bug 3: Dark Scholarly Leaflet Tooltip Theme**:
    - Applied universal obsidian dark styling (`rgba(18, 20, 26, 0.96)`, gold border `rgba(212, 175, 55, 0.45)`, gold bold headings `#d4af37`, and silver dates `#a0aab8`) to Leaflet tooltips and popup wrappers.
    - Added explicit chapter relevance notes (`getEmpireRelevanceNote`) explaining why regional powers and biblical kingdoms are highlighted for the active passage.
  - **Bug 4: Map Zoom Expansion & Marker Collision Offset**:
    - Expanded Leaflet map zoom range from lock at level 10 to `maxZoom: 15` (with `maxNativeZoom: 13` for smooth tile scaling).
    - Added deterministic radial micro-jitter offset for markers within `< 0.12` degrees of each other, preventing Jerusalem pin stacking.
    - Filtered displayed pins by default to active chapter epoch with a `"✨"` toggle control to view all regional era discoveries.
  - **Bug 5: Scripture Connection Badges & In-Drawer Artifact Cards**:
    - Added `"Scripture Connection"` badges to archaeological pin tooltips linking artifacts directly to chapter text.
    - Clicking any artifact pin opens its full discovery summary card inside `#bible-companion-artifact-drawer` directly below the map canvas without leaving the Scripture reader.
  - **Automated Regression Tests**:
    - Added 5 comprehensive Playwright tests in `tests/bible-side-by-side-map.spec.ts` covering tab locking, geographic entity pans, chapter chronology resolution, dark tooltip themes, zoom level 15, and artifact drawer presentation. All 51 Playwright tests pass green.

## [00.01.25] - 2026-10-16

- Map Color Key & Ancient Factions Integration (`/bible` & `/map`):
  - Companion Map Key: Added dedicated Kingdoms & Factions color map key directly below `Open Full-Screen Atlas →` in the Bible side panel, matching user specification:
    - 🟡 **Kingdom of Judah**: `#eab308` (Jerusalem · Royal Davidic Line)
    - 🟢 **Kingdom of Israel**: `#22c55e` (Samaria · Northern 10 Tribes)
    - 🔴 **Hostile Empires & Enemies**: `#ef4444` (Philistia, Aram, Assyria, Babylon, Edom, Moab)
    - 🔵 **Friendly & Allied Regions**: `#38bdf8` (Tyre & Phoenicia · Hiram's Alliance)
    - ✨ **Archaeological Discoveries**: `#ffd700` (Surviving Inscriptions & Artifacts)
  - Cartographic Territory Rendering: Added geodetic territorial polygons for the Kingdom of Judah, Kingdom of Israel (Samaria), and Phoenician maritime allies to `WORLD_EMPIRES_GEO` and linked them to `united_monarchy`, `assyrian_siege`, and `babylonian_exile` in `CHRONOLOGICAL_ERAS`.
  - Harmonized Atlas Legend: Added the matching Kingdoms and Factions swatches into the footer legend of `/map`.
  - Tuned map container height to 320px in the companion panel for balanced side-panel proportions.
  - Automated Regression Tests: Updated `tests/bible-side-by-side-map.spec.ts` asserting map key presence, color dots, and 2 Kings 1 Assyrian siege rendering. All 48 tests pass. Visual proof captured at `test-results/bible-map-key-2kings-proof.png`.

## [00.01.24] - 2026-10-16

- Companion Tab Button Reordering (`/bible`):
  - Reordered the 4 side-panel companion tab buttons according to explicit user workflow priority:
    1. **Chronology** (`#companion-tab-chrono-btn`): Historical event dating vs. composition dating and chapter context.
    2. **Map** (`#companion-tab-map-btn`): Synchronized biblical world geography and ancient cartography.
    3. **Word Inspector** (`#companion-tab-word-btn`): Lexical definitions, untranslated root lemmas, and modern meaning.
    4. **Passage & X-Refs** (`#companion-tab-xrefs-btn`): Active verse context and cross-reference network connections.
  - Aligned HTML markup across both `bible.html` and `bible/index.html` including DOM panels for consistent tab navigation.
  - Automated Regression Tests: Updated `tests/site_pages.spec.ts` and `tests/word-inspector.spec.ts` locking in button order index assertions. All 47 tests pass. Visual proof captured at `test-results/companion-tabs-reordered-proof.png`.

## [00.01.23] - 2026-10-16

- Word Inspector UI Polish & Decluttering (`/bible`):
  - Streamlined Header Hierarchy: Removed redundant `— SCRIPTURE WORD INSPECTOR` eyebrow banner and duplicate `[ANCIENT HEBREW] [H... ]` badge row directly beneath the title.
  - Placed the inspected Scripture word title directly at the top of the card in illuminated gold Cinzel serif font with zero top margin, achieving immediate visual focus and eliminating redundant vertical height.
  - Untranslated lemma, transliteration, pronunciation, and Strong's Concordance ID (`Strong's H7307`) remain cleanly consolidated inside the `UNTRANSLATED WORD & ORIGIN` section below.
  - Automated Regression Tests: Updated `tests/word-inspector.spec.ts` asserting absence of eyebrow and badge row, and added explicit test verifying "Spirit" inspection in Genesis 1:2. All 46 tests pass. Visual proof captured at `test-results/word-inspector-spirit-clean.png`.

## [00.01.22] - 2026-10-16

- Enhanced Scripture Word Inspector & Lexicon Engine (`/bible`):
  - Top Card Comprehensive Lexicon: Addressed user feedback regarding empty cards in the Word Inspector. Every clicked or queried Scripture word now renders a rich 3-section card:
    1. **`WORD DEFINITION`** or **`NAME MEANING`**: Clear lexical definition or Hitchcock's name meaning for all 2,620 biblical individuals.
    2. **`UNTRANSLATED WORD & ORIGIN`**: Displays the original Ancient Hebrew or Koine Greek lemma in original script (e.g. `תֹּהוּ`, `רוּחַ`, `אָדָם`, `logos`), transliteration, phonetic pronunciation, linguistic derivation, Strong's Concordance ID (e.g. `Strong's H8414`, `H7307`), and English etymological root.
    3. **`✦ MODERN MEANING`**: Explicitly labeled section conveying what the ancient biblical term communicates in contemporary English today, contextualized against ancient Near Eastern idiom.
  - Multi-tiered Lexicon Resolution: Built offline indexing engine (`scripts/build-scripture-lexicon.js`) compiling Strong's Hebrew (8,674 entries) & Greek (5,523 entries) dictionaries into reverse-lookup indices with curated foundational theological terms (`src/data/scriptureLexiconData.ts` & `src/data/scriptureLexicon.ts`).
  - Study Desk / Interact Bridge Label Alignment: Renamed all bridge callout buttons across `/bible`, `/map`, and `/` to **"Interact"** (e.g. `Open in Interact →`, `View in Interact →`, `Explore in Interact →`) aligning 100% with top navigation while preserving the sacred slogan quote intact.
  - Automated Regression Tests: Created `tests/word-inspector.spec.ts` locking down definition rendering, untranslated lemma with Strong's ID, and Modern Meaning badge for Scripture words. All 45 Playwright tests pass green. Visual proof captured at `test-results/word-inspector-proof.png`.

## [00.01.21] - 2026-10-16

- Minimalist Map Compass Indicator (/map & /bible):
  - Completely replaced the bulky compass rose and loud banner with a sleek, minimalist compass needle visual aid.
  - Features a crisp red North pointer (#ef4444 / #b91c1c) with a subtle red 'N', clean slate gray South pointer (#94a3b8 / #64748b), and faint subtle East & West horizontal wings/labels (gba(148, 163, 184, 0.4)).
  - Reduced footprint to a 34px x 42px translucent glass HUD tile tucked into the upper-right corner (	op: 12px; right: 12px;), eliminating map obscuration and allowing all geography, coastlines, and city labels to remain 100% visible.
  - Automated Regression Tests: Updated 	ests/map-chronology-compass.spec.ts locking down the minimalist compass needle and North indicator. All 44 tests pass.

## [00.01.20] - 2026-10-16

- Bible Side-by-Side Companion Map Tab Integration (/bible):
  - Added dedicated [Map] tab to the Bible side-by-side companion panel beside Passage & X-Refs, Word Inspector, and Chronology.
  - Embedded an interactive, high-resolution Leaflet cartographic canvas inside the companion panel synchronized dynamically to the active chapter's historical epoch and geography (e.g. Genesis 1–11 → Patriarchs & Fertile Crescent; Exodus → Egypt & Sinai; Gospels → Christ & Roman Judea).
  - Features the prominent illuminated Compass Rose indicating North, active epoch watermark, zoom controls, and a direct link to the full-screen atlas (/map?era=...).
  - Single-Row Companion Tab Header: Streamlined Chronology & Eras label to Chronology and tuned .companion-tab-btn typography (ont-size: 0.76rem, padding: 0.35rem 0.55rem, white-space: nowrap) so all 4 companion tabs (Passage & X-Refs, Word Inspector, Chronology, Map) fit cleanly on a single row.
  - Automated Regression Tests: Added 	ests/bible-side-by-side-map.spec.ts asserting companion Map tab visibility, tab click action, Leaflet map initialization, chapter title/summary rendering, and direct link. All 44 tests in full test suite pass.

## [00.01.19] - 2026-10-16

- Upgraded Biblical World Map Cartography (`/map`):
  - High-Resolution Geodetic Tiles: Integrated Leaflet with Esri World Dark Gray Base (`World_Dark_Gray_Base`), rendering crisp real-world topography, mountain ranges, and water bodies (Mediterranean Sea, Red Sea, Dead Sea, Sea of Galilee, Nile Delta, Euphrates, Tigris) without watermarks or API key requirements.
  - Ornate Golden Compass Rose: Positioned a prominent dial in the top-right corner of the map viewport explicitly marking North with a crimson/gold needle and an illuminated `NORTH ↑` badge.
  - Chronological Timeline & Active Year Display: Built an illuminated header displaying the exact active year/range in 2rem gold Cinzel font (`4 BC – AD 33`, `722 – 701 BC`, etc.), headline, context, and 9 clickable era scrubber pills (`Patriarchs`, `Exodus & Law`, `United Monarchy`, `Assyrian Siege`, `Babylon Exile`, `Persian Return`, `Christ & Rome`, `Apostolic Age`, `All Eras`).
  - Temporal Isolation: Filtering by era strictly isolates the ruling empire and highlights that epoch's surviving archaeological discoveries with pulsing gold coin markers.
  - Automated Regression Tests: Added `tests/map-chronology-compass.spec.ts` locking down compass rose, north label, active year display, and era switching.

## [00.01.18] - 2026-10-16

- Interactive Biblical Maps & Cartographic Atlas (Option C):
  - Added dedicated `[Map]` tab in the 3rd column of the Study Desk workspace (`/interact`) beside `List` and `2D Graph`, auto-focusing the Ancient Near East canvas on the active figure's region (Roman Judea, Mesopotamia, Egypt/Sinai, Persia, Greece).
  - Built dedicated Cartographic Atlas page at `/map` (`map.html` & `map/index.html`) featuring high-DPI 60FPS canvas, layer toggles (Archaeological Discoveries, World Empires, Biblical Journeys, Cities, Waterways), regional quick-jump presets, and a slide-in discovery detail drawer for excavated artifacts.
  - Added `Map` to primary site navigation header across all pages (`Home`, `Bible`, `Map`, `Interact`, `Contact`).
  - Implemented 100% local-first, zero-dependency canvas cartographic engine (`src/engine/ancientMap.ts` & `src/data/ancientMapData.ts`) with geodetically accurate coordinates for 12 major archaeological discoveries, 5 world empire territories, and biblical routes (Abraham, Exodus, Paul).
  - Verification: 5 new Playwright regression tests in `tests/map.spec.ts` passing; 34/34 total suite tests passing; canonical KJV build passes with all 31,102 verses verified.
- Audited all 2,620 name entries using the explicitly approved source standard; published the complete per-name findings in audit/name-review.csv and audit/NAME_AUDIT.md.
- Scripture-led introductions and qualified lexical notes replace unchecked dictionary headlines. Original historical meanings remain attributed in the evidence comparison.
- Corrected identity/context conflicts and restored missing name spellings/capitalization: 2,453 linked entries and 12,323 shared-verse connections. Removed six English Mark verbs from the person index; Bible word lookup now respects the selected verse and Webster 1828 English usage.
- Added complete-coverage/source-integrity/index regressions and NAME-01 browser flow; four data tests and production build pass. No Scripture or PDF text changed.


## [00.01.16] - 2026-10-16

- Removed the PDF tab from the right-hand companion exploration panel in `bible.html`, `bible/index.html`, and `src/bibleReader.ts`. The companion panel now focuses strictly on biblical study tools (`Passage & X-Refs`, `Word Inspector`, `Chronology & Eras`).
- Completely purged the terms "archival" and "archive" from all reader and printable document user-facing text, badges, and layout classes.
- Re-architected the printable PDF edition section at the bottom of `/bible` as `#printable-edition` featuring an illuminated `✦ COMPLETE PRINT EDITION · 1,162 PAGES ✦` badge, preserving direct `/Bible.pdf` downloading and browser previewing.
- Updated Playwright regression test suite `tests/site_pages.spec.ts` locking down 3 companion study tabs, absence of `#companion-tab-pdf-btn`, and zero occurrences of "archival" text on `/bible`.
- Verification: 36/36 Playwright tests pass; 2/2 collection regression tests pass; canonical KJV invariant build succeeds in 369ms.

## [00.01.15] - 2026-10-16

- Corrected Genesis Biblical Chronology: established traditional canonical anchor of Creation at **c. 4004 BC** (Ussher / Biblical Masoretic chronological anchor) and clarified full Genesis sweep as **c. 4004 BC (Creation) – c. 1805 BC (Death of Joseph)** [~2,200-year sweep].
- Fixed date ambiguity bug where Genesis 1 previously rendered `Creation – c. 1805 BC`, which read erroneously as if Creation occurred around 1805 BC.
- Implemented Granular Chapter-Level Event Chronology (`getChapterChronology(osis, chapter)` in `src/data/bibleChronology.ts` and `src/bibleReader.ts`):
  - Genesis 1–2: `c. 4004 BC (Creation Week)` · Primeval History
  - Genesis 3–5: `c. 4004 – 2348 BC (The Fall & Antediluvian World)` · Primeval History
  - Genesis 6–9: `c. 2348 – 2347 BC (The Great Deluge & Noah's Ark)` · Primeval History
  - Genesis 10–11: `c. 2242 – 2091 BC (Tower of Babel & Table of Nations)` · Primeval History
  - Genesis 12–20: `c. 2091 – 2067 BC (Call of Abram & Covenant of Circumcision)` · Patriarchal Era
  - Genesis 21–25: `c. 2066 – 1991 BC (Isaac's Birth & Offering on Mount Moriah)` · Patriarchal Era
  - Genesis 26: `c. 2006 – 1886 BC (Patriarch Isaac at Gerar & Beersheba)` · Patriarchal Era
  - Genesis 27–36: `c. 1929 – 1859 BC (Jacob at Haran, Wrestling at Peniel & Twelve Tribes)` · Patriarchal Era
  - Genesis 37–50: `c. 1898 – 1805 BC (Joseph in Egypt, Descent of Israel & Death of Joseph)` · Patriarchal Era
- Added chapter-level breakdowns for other multi-era narrative books (Exodus, Acts).
- Enhanced Dual Chronology Banner and Chronology & Eras companion pane to dynamically present the active chapter's event date, setting era, and historical summary, alongside the full book sweep.
- Added comprehensive written Playwright regression tests in `tests/chronology.spec.ts` locking Creation Week c. 4004 BC, Primeval History era, and dynamic chapter progression; verified 36/36 Playwright tests pass, 2/2 collection regression tests pass, and canonical KJV 31,102 verse invariants verified in production build.

## [00.01.14] - 2026-10-16

- Reduced site header height from ~121px to a sleek, compact 52px (`padding: 0; height: var(--site-header-height);` and brand image `height: 34px`) across all pages, freeing up over 65px of vertical reading real estate.
- Architected declarative CSS collision geometry controls via `:root` custom properties (`--site-header-height: 52px;`, `--sticky-controls-gap: 12px;`, `--reader-sticky-top: calc(var(--site-header-height) + var(--sticky-controls-gap));`).
- Pinned `.bible-sticky-toolbar` and `.bible-companion-pane` to `top: var(--reader-sticky-top)`, ensuring that when scrolling through Scripture, the top controls (Order, Book, Chapter, Prev, Next buttons, Tip badge, and Companion tabs) sit crisply 12px below the header with 100% visibility and zero occlusion.
- Compacted page hero padding on `/bible` via `.bible-hero` (`padding: 1.25rem 0 0.85rem !important;`), bringing Scripture into view immediately on load.
- Added automated Playwright regression assertions in `tests/site_pages.spec.ts` locking header height <= 65px, verifying scroll geometry down 500px, and confirming toolbar/companion pane positions remain strictly below the header without collisions.
- Verification: 33/33 Playwright tests pass; 2/2 collection regression tests pass; canonical KJV invariant build succeeds in 375ms with 31,102 verses verified.

## [00.01.13] - 2026-10-16

- Updated `/bible` top hero gold text to: `— READ THE BIBLE WITH WORD-FOR-WORD INSPECTION` and main title to `The Holy Bible`, moving all download actions exclusively to the illuminated Archival Print Edition (PDF) card at the bottom.
- Added 66-Book Dual Chronology Engine (`src/data/bibleChronology.ts`) separating **Event Chronology** (when events happened) from **Composition Chronology** (when texts were penned).
- Added `Order:` selector to sticky toolbar supporting `Canonical (Gen → Rev)`, `Chronological (When Happened)`, and `Chronological (When Written)` with dynamic book regrouping.
- Added Dual Chronology Banner above each chapter displaying Event Date, Authorship Date/Author, and Chronological Delta note.
- Added `Chronology & Eras` companion tab with detailed historical era context and bridge links to contemporary world empires in the Study Desk (`/interact?era=...`).
- Redesigned the `/bible` Scripture Reader into a 16:10 split-screen layout (`bible.html`, `bible/index.html`) with a sticky pinned toolbar (`top: 76px; z-index: 40;`) that never scrolls off-screen.
- Added word-for-word selectability: every single word in Scripture is interactive via `<span class="kjv-word">`, enabling left-click and right-click (context menu) inspection of biblical dictionary definitions (Hitchcock) and concordance occurrences across the KJV without navigating away.
- Implemented in-place verse inspection: clicking any verse highlights the row and populates direct Treasury of Scripture Knowledge (TSK) cross-references in the right-side companion panel, eliminating external page redirects for study.
- Maintained small-caps `LORD` (`<span class="kjv-divine-name">L<span class="kjv-divine-rest">ORD</span></span>`) and bracketed translator italics `[...]` without token fragmentation.
- Added comprehensive regression tests in `tests/site_pages.spec.ts` locking split layout, sticky toolbar, in-place verse selection, word left/right-click inspection, and archival PDF notice; all 33 Playwright tests and collection tests pass.

## [00.01.12] - 2026-10-16

- Elevated `/bible` (`bible.html` and `bible/index.html`) from a static PDF download page into a dedicated, live Scripture Reader with full 66-book selector, chapter picker, previous/next navigation, and deep-links to the Interactive Study Desk.
- Preserved the downloadable edition as an illuminated Archival Print Edition (PDF) card with explicit notice clarifying that it is a static printable document for physical printing and offline reading, distinct from an interactive app.
- Added automated regression test in `tests/site_pages.spec.ts` locking 66 books, Genesis 1/2 reading, and archival PDF notice/links; 33/33 Playwright tests and all collection tests pass.

## [00.01.11] - 2026-10-16

- Introduced 60FPS 2D HTML5 Canvas Ego-Graph Inspector (`src/engine/egoGraph.ts`) for biblical figures and names, featuring 1-hop and 2-hop neighborhood expansion, click-to-pivot navigation, hover tooltips, smooth pan/zoom, and untarnished bronze/olive/stone scholarly styling.
- Added bidirectional URL state synchronization and deep-linking (`src/store/urlStateRouter.ts`), making figures (`?figure=`), names (`?name=`), verses (`?ref=`), collection tabs (`?tab=`), and view modes (`?view=graph`) bookmarkable and shareable with browser back/forward history support.
- Connected the 2D Ego-Graph directly to the existing 2,408-name / 12,058-edge `BibleNetwork` and `HistoricalSynchrony` dataset without redundant chunk bloat or filesystem re-parsing.
- Added regression tests `INT-19` and `INT-20` in `tests/interact.spec.ts` locking Ego-Graph view toggling and direct deep-linking.

## [00.01.10-docs.1] - 2026-10-16

- Remove the unsupported personal transcription narrative and quotation from the README; correct repeated claims in public historical documentation.
- Add a focused documentation regression covering README, changelog, handoff and why-log. Website/app version remains 00.01.10.

## [00.01.10] - 2026-10-16

- Make every collection total open its complete browsable records: 31,102 verse references, 344,799 cross-references, 2,408 name entries and 12,058 name connections.
- Connect the existing Obsidian network to search: all name passages, connected names and their shared verses; add book/chapter reading, full cross-reference ranges, filters and page-number navigation.
- Preserve original vote scores and source attribution; disclose the four website text omissions and alternate source numbering without changing Scripture.
- Add source export, full-network and UI traversal regression coverage.

## [00.01.09] - 2026-10-16

- Keep searched names such as Gideon beside the search field, with their dictionary meaning and exact-name Scripture passages, instead of jumping to the bottom directory.
- Prevent result buttons from submitting search a second time; keep connected passages in their current reader.
- Added three-name scroll/navigation regression coverage and checked desktop/mobile rendering plus existing figure, empire and verse flows.

## [00.01.08] - 2026-10-16

- Corrected GitHub Pages to publish the production Actions build, preventing branch publishing from overwriting the built site and breaking logo/favicon URLs; added a deployment regression gate.

- Branded Home with the detailed Bible/atlas logo and all main-page headers/footers with the compact logo, prepared from the supplied artwork.
- Replaced the empty favicon with the circular emblem, including browser and Apple touch sizes, and applied icons across all HTML entry points.
- Optimized transparent logo assets, responsive spacing, accessible image labels and dimensions; added route/image/favicon regression coverage. Build and desktop/mobile visual checks pass.

## [00.01.07] - 2026-10-16

- Introduced a collection entrance with a book-connection arc map derived from the existing index, dynamic collection counts, and research attribution.
- Moved global search near the top with suggested queries, a submit control, keyboard navigation, result announcements, and loading/failure states. Preserved the existing study desk and direct links to people.
- Kept arcs touching the Old Testament gold throughout; New-Testament-only connections remain teal.
- Added collection-data regression coverage and browser regression cases; reviewed four responsive widths. Release prepared for owner-authorized Git push.

## PDF publication [0.3.3] - 2026-10-16

- Replaced the local and website Bible.pdf copies with the verified 1,163-page edition, including chapter bookmarks, matching page labels, clickable book-name headers, and the brief reading note.
- Cleared the proof-version label from PDF document properties; no PDF page or metadata carries a proof version. The release version appears in GitHub commit 75af469, not in the reader-facing file.
- GitHub Pages deployment succeeded; both public PDF URLs match the local release SHA-256 B804F1BD546EBED2745654401BC66A173C2B7BC662C2EEBB354A1650875DFF65.

## PDF book-header links proof [0.3.3] - 2026-10-16

- Linked 1,158 visible top-right running book names to the matching book's chapter-one page, reusing the existing book-bookmark destination and zoom behavior.
- Preserved the two Old/New Testament opening headers as labels, the existing return-to-Contents link on every Scripture page, the 66 contents links, 1,189 chapter bookmarks, page labels, text, layout, and accessibility structure.
- Three book-header regression checks pass; application version remains 00.01.05. No source replacement, commit, or publication.

## [00.01.06] - 2026-10-16

- Unified all four site pages (`index.html`, `interact.html`, `bible.html`, `contact.html`) and clean directory routes (`bible/index.html`, `contact/index.html`) under the calm dark-gold design system (`Cinzel`, `EB Garamond`, `Inter`, `JetBrains Mono`).
- Separated the Front Door (`index.html` — welcome headline, 4-century timeline thread, 3 curiosity doors linking to `/interact?figure=<id>`, verbatim `PURPOSE` / `CONVICTION` mission cards, restored dark-gold "Download the Bible" welcome popup `#popup-widget6691`, quiet "Why the KJV" footnote, and PayPal donation form) from the dedicated Interactive Study Desk (`interact.html` — opening directly at the Discovery Pair `01 Read the Scripture` + `02 Meet the Historical Record`, `03 Follow Your Curiosity`, and the 3-column `Go Deeper` research workspace).
- Implemented true small-caps `LORD` typography (`L` + `0.74em` `ORD`) in the UI while preserving clean `LORD` text copy, and removed all `"hand-typed"` references from page copy and metadata.
- Updated `tests/interact.spec.ts` and `tests/site_pages.spec.ts` (20 Playwright tests passing) to lock in separated page roles, curiosity door transitions, true small-caps `LORD` glyph ratios, welcome popup behavior, `"Why the KJV"` footnote order, and zero `"hand-typed"` wording across all routes.

## PDF reading-note proof [0.3.2] - 2026-10-15

- Inserted one short, tagged live-text note after the cover and before the clickable Contents. It visibly distinguishes large-L/smaller-ORD small caps from four equal-height capitals, plus `Lord` and `lord`, while both capital forms copy as `LORD`.
- Added brief notation and pronoun explanations and one short reading paragraph. The supplied-word line explains that most printed KJVs use italics and this edition uses brackets for search, copying, and machine learning. Preserved the 66 book links, 1,189 chapter bookmarks, all 1,160 tagged return links, printed folios and Scripture text.
- Four reading-note regression checks pass. Application version remains 00.01.05; no publication, commit or source replacement.

## PDF accessibility proof [0.3.1] - 2026-10-15

- Gave the cover semantic title/subtitle headings and readable descriptions for its two ornaments.
- Tagged and named all 1,160 Scripture-page return links with individual annotation objects, preserving their destinations, book/chapter bookmarks, page labels, text and layout.
- Three accessibility regression checks pass; five representative pages render pixel-identically to v0.3.0. App version remains 00.01.05; no publication or source replacement.

## PDF navigation proof [0.3.0] - 2026-10-15

- Added 1,189 nested chapter bookmarks and PDF viewer page labels that match printed Scripture folios (1-1160), while preserving the existing layout, links, tagged text, and the prior v0.2.0 proof.
- Verified every chapter destination and page label, plus all-page text, geometry, link, and structure-tree preservation with five regression checks. Accessibility improvements remain a separately scoped review.

## PDF proof [0.2.0] - 2026-10-15

- Added a separate repair proof from the recovered Word master, preserving layout, selectable Scripture, 74 bookmarks and 1,296 links.
- Restored missing endings, removed duplicate passages/page-label contamination, recorded narrow wording/case repairs and restored source-based small caps.
- Added eight DOCX and ten PDF regression checks, before/after provenance and a clearly separated unresolved comparison list. Originals/site untouched; application version remains 00.01.05.

## Governance [1.0] - 2026-10-15

- Adopted owner-supplied AGENTS.md and principles.md in the project root with their wording preserved exactly.
- Added README entry points, the adoption record, and stable change-control guidance; PDF repair remains a separate task.
- Documentation only; application version remains 00.01.05.

## [00.01.05] - 2026-10-15

- Rebuilt Interact around a first discovery: Scripture beside a historical record, followed by questions that lead to another person or passage.
- Added twelve editorial discovery routes, exploration trail/back navigation, source-linked featured records, and an attributed CC0 photograph of the Pilate inscription.
- Moved era filters and the names dictionary into the deeper study; improved search, connected-passage navigation, empty states, and small-screen reading.
- Unified Interact URL aliases and explained the local-preview requirement when source HTML is opened from disk.
- Preserved the existing KJV corpus and historical collection. No dependencies added. Verified with headed browser regressions and the canonical production build.


## Obsidian Bible Network [0.01.00] - 2026-10-14

- Added native Obsidian Bible notes: complete KJV, names co-occurrence network, book indexes, and all 344,799 OpenBible cross-reference records with full target ranges and votes.
- Added dependency-free export/validation tools under E:\AI_Hub\Tools\bible-network, source attribution, regeneration rules, and five unit tests.
- Preserved the app's independent version and existing data; Obsidian export has its own v0.01.00 sequence.
## [00.01.04] - 2026-10-15

### Fixed & Restored
- **Verbatim Restoration of GoDaddy Web Archive**: Restored exact archived pages from `assets/Web_Archive_20261014/` (`Historical Bible - Faith and Religion, The Bible.html` -> `index.html`, `HistoricalBible.html` -> `contact.html`, `Bible-download.html` -> `bible.html`).
- **Complete Visual & Brand Fidelity**: Restored original GoDaddy typography (`Righteous`, `Josefin Sans`), header layout, sunset Bible banner, "Help Our Cause" section, and PayPal donation button flow (`BibleHistorical@gmail.com`).
- **Asset Directory Mirroring**: Copied `Historical Bible - Faith and Religion, The Bible_files`, `HistoricalBible_files`, and `Bible-download_files` to root and `public/` directories for zero-404 static hosting on GitHub Pages.
- **Direct Bible.pdf Serving**: Linked download button to the project's 9.5MB `Bible.pdf` hosted directly on the repository domain.
- **Interactive Gateway**: Maintained Three.js 3D WebGL Scripture Tapestry engine at `/interact` (`interact.html`).
- **Regression Verification**: Updated Playwright test suite (`tests/site_pages.spec.ts`) asserting exact archived content with automated screenshot proofs.

## [00.01.03] - 2026-10-14

### Added
- **Full HistoricalBible.com Multi-Page Suite**: Built out Home (`index.html`), Contact Us (`contact.html`), and Bible Download (`bible.html`) pages recreating the complete GoDaddy archive website with elegant Cinzel/Lora typography and local-first architecture.
- **Stand-alone 2D Tapestry Engine**: Preserved at `tapestry.html` alongside the unified `interact.html` engine.
- **Self-Hosted Bible PDF**: Copied the project's `Bible.pdf` directly into `public/Bible.pdf` and `public/downloads/Bible.pdf` (~9.5 MB) for direct, serverless downloads independent of third-party CDNs.
- **Brand Assets**: Migrated `logo.jpg`, PayPal, and accepted card badges into `public/images/`.
- **GitHub Pages & Custom Domain Preparation**: Configured `CNAME` for `historicalbible.com`, `.nojekyll`, and automated `.github/workflows/deploy.yml` deployment workflow.
- **Clean URL Directory Aliases**: Generated `contact/index.html`, `bible/index.html`, and `interact/index.html` ensuring resilient routing across clean paths and file extensions.
- **Expanded Automated Regression Suite**: Added `tests/site_pages.spec.ts` (`REG-09`, `REG-10`, `REG-11`). All 12 Playwright tests passing in 8.4s.

## [00.01.02] - 2026-10-14

### Added
- **KJV Corpus Ingestion**: Compiled 31,102 verses directly from the project's `Bible.pdf` into `public/data/kjv_verses.json`.
- **Restored Translator-Added Italics**: 14,134 bracketed verses (`[...]`) preserving KJV italics with `.kjv-added` CSS styling and transparent scholarly tooltips.
- **Divine Covenant Name Typography**: Preserved 5,556 verses with `LORD` (יהוה / Jehovah) in dedicated small-caps gold styling, distinguished from 1,010 verses with `Lord` (Adonai / Master).
- **Canonical `{chapter:verse}` Delimiters**: Standardized `{c:v}` across UI inspectors and headers, preventing collision with the 247 verses containing internal scripture parentheses `(...)`.
- **Permanent KJV Legend Bar**: Added interactive typography guide to `interact.html`.
- **Master README Chapter**: Codified *"The Textual Foundation: Preserving the KJV"* into project documentation.
- **Regression Test REG-08**: Automated Playwright test verifying KJV language integrity and typography in `tests/interact.spec.ts`.

## [00.01.01] - 2026-10-14

### Added
- **Three.js 3D WebGL Spatial Loom Engine** (`src/engine/threeVisualizer.ts`) with orbital camera, 3D quadratic Bézier arc splines, and additive blending.
- **Local-First Client Storage Engine** (`src/store/localFirstStore.ts`) leveraging browser `CacheStorage` & `IndexedDB` for 100% offline, 0ms latency scripture browsing.
- **Web Audio Harmonic Acoustic Engine** (`src/audio/acousticEngine.ts`) strictly tuned to Boarderless harmonic series ($G_3 = 196\text{ Hz}$) with stereo positioning.
- **Audited Theological Relation Inspector** (`src/main.ts` & `interact.html`) with plain-English rationales, classification badges, and verified `Bible.pdf` page citations.
- **Dedicated Interactive Gateway** (`interact.html` -> `/Interact`) featuring the "Enter the Scripture Tapestry" onboarding modal with 4 curated journeys.
- **Hitchcock Bible Names Dictionary & Identity Disambiguation** (`public/data/hitchcock_names.json`, `public/data/name_identities_audit.json`).
- Expanded Playwright regression test suite (`tests/interact.spec.ts`, 8 tests passing).

## [00.01.00] - 2026-10-14

### Added
- Complete project scaffolding at `E:\HistoricalBible`.
- Data ingestion pipeline (`scripts/build-crossref-data.py`) parsing OpenBible.info (CC BY 4.0) cross-references.
- Scripture indexing pipeline (`scripts/fetch-kjv-text.py`) mapping all 31,102 verses across 1,189 chapters of the KJV Bible.
- Procedural HTML5 Canvas visualization engine (`index.html`) featuring:
  - Arcs View: 1,189 chapter baseline bars, Psalm 119 anchor, 10 canonical divisions, distance rainbow mode, pan/zoom.
  - Threads View: Sequential chapter reader, 66-book canon spine, live Bézier thread loom.
  - Right Inspector Drawer: Focal verse, cross-reference distribution bar, inline KJV passage cards with pivot navigation.
  - Omnibox search supporting natural scripture citations (`Acts 1:1`, `John 3:16`, `Ps 23`).
  - CC BY 4.0 legal attribution footer.
- Playwright regression test suite (`tests/bibleviz.spec.ts`) with 5 automated compliance and invariant checks.
- Foundational documentation (`what_and_how_log.md`, `error_corrections_log.md`, `HANDOFF.md`).
