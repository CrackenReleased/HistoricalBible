# Changelog — HistoricalBible.com

All notable changes to this project will be documented in this file.

## [00.01.63] - 2026-10-22

- **Elimination of Map Pulsing & Coin Marker Resizing**:
  - Permanently eradicated all pulsing animations across the cartographic engine (`goldHaloPulse` on `.gold-coin-core` and `geoPulseRing` on `.geo-focus-ping`).
  - Resized archaeological site coins down from $28\times 28\text{px}$ to subtle, muted $12\times 12\text{px}$ antique gold/bronze markers (`iconSize: [12, 12]`, `iconAnchor: [6, 6]`), removing visual clutter while preserving clarity and hover responsiveness.
  - Resized geographic place focus pin to $14\times 14\text{px}$ (`iconSize: [14, 14]`, `iconAnchor: [7, 7]`) and removed `.geo-focus-ping`.
- **Passage-Pertinent Archaeology Filtering in Scripture Companion Map (`/bible`)**:
  - Defaulted archaeology layer to `false` when `compact: true` in `AncientMapCanvas`.
  - Added `activeSiteOverrideIds: string[] | null` filtering to `AncientMapCanvas.renderActiveEra()`.
  - In `renderCompanionMap()`, archaeological discovery coins are suppressed by default unless the specific chapter/verse has a direct dated event receipt (e.g. 2 Kings 18 for the Taylor Prism).
  - In `handleWordClick()`, clicking a biblical city or geographic entity (such as Nineveh in Jonah 1) suppresses unrelated imperial archaeological coins from rendering over the city.
  - Implemented `AncientMapCanvas.clearFocusMarker()` and wired it to map canvas clicks, zoom/move events, and the artifact drawer close button (`.artifact-drawer-close`) so users can easily dismiss active pins and highlights.
- **Topographic Curvature & Elimination of Primitive Polygonal Boundaries**:
  - Re-coordinated `old_babylon` (`Old Babylonian & Kassite Kingdom`) along the western desert plateau escarpment (`lng: 40.8` to `44.2`), placing Babylon, Kish, Nippur, Uruk, Larsa, and Ur deep within the interior of the realm, eliminating the pinched bowtie/hourglass anomaly.
  - Expanded `egypt` and `saite_egypt` western bounds to encompass the Western Desert oasis chain (Kharga, Dakhla, Farafra, Bahariya, Fayum) reaching `lng: 27.95`, eliminating the riverbank-clipped ribbon effect.
  - Replaced all primitive 4-to-6-sided boxes in `CONTESTED_FRONTIER_ZONES` with organic 14-to-18-vertex topographic curves along wadis, cataracts, mountain passes, and escarpments across all 8 canonical contested frontiers.
  - Added `smoothPolylineCoordinates()` with endpoint anchoring for `WATER_FEATURES.rivers` and softened river styling to mature aquatic slate `rgba(84, 138, 168, 0.55)` (weight: 1.25).
  - Enhanced `smoothPolygonCoordinates()` with edge pre-densification for segments $> 0.60^\circ$ so long straight chords curve naturally.
  - Purged remaining neon cyan `#38bdf8` styles in favor of antique gold `#d4af37` and muted aquatic tones.
- **Comprehensive Verification & Regression Suite**:
  - Added automated browser regression tests in [`tests/companion-map-callout-regression.spec.ts`](file:///E:/HistoricalBible/tests/companion-map-callout-regression.spec.ts) asserting:
    1. Sidebar companion map suppresses artifact coins on non-pertinent passages.
    2. Zero pulsing animations on coins or geographic focus pins.
    3. Small muted $12\times 12\text{px}$ coin core dimensions in full `/map`.
    4. Dismissing artifact drawer or clicking map clears active geographic focus pin.
  - Expanded [`tests/all-eras-territorial-fidelity-regression.ts`](file:///E:/HistoricalBible/tests/all-eras-territorial-fidelity-regression.ts) with assertions ensuring all contested frontier zones have $\ge 12$ vertices, Old Babylon spans $> 4^\circ$ longitude without pinches, and Egypt encompasses the Western Desert oases.
  - All 73 Node.js regression tests passing (73/73).
  - All 7 Playwright browser tests passing (7/7).
  - 100% canonical KJV corpus verified (31,102 verses across 66 books).
  - Clean production build verified.

## [00.01.62] - 2026-10-21

- **Cross-Atlas & Multi-Timeline Territorial Fidelity Verification**:
  - Verified and locked the organic curved kingdom polygons, dynamic overlap detection, and **dashed boundary lines** (`stroke-dasharray`) across:
    1. **Standalone Atlas** (`/map`, `src/atlasApp.ts`) — Verified across Divided Monarchy (`divided_monarchy_prophets`) and Persian Restoration (`persian_restoration`), with layer toggle synchronization and Map Key rendering.
    2. **Scripture Companion Map** (`/bible`, `src/bibleReader.ts`) — Verified in Genesis 47 (Patriarchs) with Lower Nubia Egypt/Kush sovereign overlap and exterior leader-line callout.
    3. **Study Desk 3rd Column** (`/interact`, `src/main.ts`) — Verified with King David (`united_monarchy`) rendering smoothed organic contours in `#ancient-map-container`.
  - **Decision-Point Chronological Bounding**:
    - Fixed `isEraMatch` in `src/engine/ancientMap.ts` (`this.activeEra.id === 'all' || zone.eraIds.includes(this.activeEra.id)`), ensuring contested frontier zones are strictly chronologically bounded and never leak anachronistically across unrelated periods.
    - Updated `CONTESTED_FRONTIER_ZONES` in `src/data/ancientMapData.ts` with comprehensive empire claim attributions (`saite_egypt`, `rome`) and era bounds (`united_monarchy`, `babylonian_exile`, `apostolic_church`).
- **Comprehensive Regression & Test Verification**:
  - Created [`tests/all-eras-territorial-fidelity-regression.ts`](file:///E:/HistoricalBible/tests/all-eras-territorial-fidelity-regression.ts) asserting across all 13 chronological eras:
    - Every era features >= 6 active sovereign realms.
    - All empires have >= 4 coordinates and plausible geographic area (> 1,000 km²).
    - Overlapping contested realms render dashed border styling without anachronistic bleed.
  - Updated [`tests/companion-map-callout-regression.spec.ts`](file:///E:/HistoricalBible/tests/companion-map-callout-regression.spec.ts) with full browser assertions across `/bible`, `/map`, and `/interact` (5/5 tests passing).
  - All 80 Node.js regression tests passing (80/80).
  - 100% canonical KJV corpus verified (31,102 verses across 66 books).
  - Clean production Vite build.

## [00.01.61] - 2026-10-21

- **Kingdom of Kush / Nubia Territorial Realignment**:
  - Expanded `kush_nubia` from an unnaturally narrow 30-mile Nile cataract ribbon into its full historical regional extent (~850,000–1,200,000 km²).
  - Encompassed the vital **"Island of Meroë" (the Butana plain)** between the Nile, the Atbara River, and the Blue Nile, reaching eastward toward Kassala (`lng: 36.2`) and Ethiopian approaches.
  - Encompassed major inland Meroitic temple cities of **Naga** and **Musawwarat es-Sufra** (`lat: 16.42, lng: 33.32`) situated 25 miles inland from the Nile.
  - Included the Eastern Desert gold mining districts along Wadi Allaqi and Wadi Gabgaba reaching toward the Red Sea hills (`lng: 34.2` to `37.25`).
  - Included the western savanna margin along the ancient Wadi Howar corridor ("Yellow Nile") connecting ancient Chad/Darfur savannas to the Nile (`lng: 27.5` to `29.5`).
  - Extended chronological span to `c. 2000 BC – AD 350 (Kerma, Napata & Meroë · 25th Nubian Dynasty)` so the realm is historically active in Genesis 47 (Patriarchs) through the New Testament (Acts 8:27 Candace).
- **Dashed Boundaries for Overlapping & Contested Territorial Frontiers**:
  - Identified and rendered historically argued and overlapping territorial borderlands throughout biblical history with distinct cartographic **dashed lines** (`dashArray: '6, 5'` boundary stroke and `dashArray: '8, 6'` halo) rather than solid lines.
  - Dynamic polygon intersection detection (`doPolygonsOverlap`) dynamically marks and renders contested frontier regions.
  - Added formal `CONTESTED_FRONTIER_ZONES` catalog exporting 8 canonical biblical frontier zones:
    1. *Lower Nubia / Wawat* (Egypt & Kush) — Buhen, Semna, and cataract forts.
    2. *Northern Benjamin Buffer / Bethel Corridor* (Judah & Israel) — Baasha & Asa Ramah/Mizpah frontier (1 Kings 15:17).
    3. *Gilead & Ramoth-Gilead* (Israel & Aram-Damascus) — Ahab & Ben-hadad border wars (1 Kings 22:3).
    4. *Plains of Moab & Medeba Plateau / Mishor* (Israel & Moab) — Mesha Stele / Omride contested territory (2 Kings 3:4).
    5. *Shephelah Foothill Buffer* (Philistia & Judah) — Beth-shemesh, Libnah, Azekah contested border (1 Samuel 6:12).
    6. *Sinai & Negev Wilderness Frontier* (Egypt, Judah, Nabataea) — Kadesh-barnea & Way of Shur.
    7. *Coele-Syria & Palestine Corridor* (Seleucid & Ptolemaic Empires) — Syrian Wars & Antiochus III (Daniel 11:15).
    8. *Alluvial Babylonian Borderland* (Assyria & Babylonia) — Dur-Kurigalzu, Nippur, and marsh frontiers.
  - Interactive external callouts on hover detail argued sovereign claims, rival powers, and Scripture citations.
- **Verification & Regression Suite**:
  - Added new regression suite `tests/territorial-boundaries-overlap-regression.ts` (4/4 passing) asserting Kush area >= 750,000 km², Butana/Naga/gold-fields inclusion, Egypt/Kush overlap, Judah/Israel overlap, and exported frontier zones.
  - All 79 Node.js regression tests passing (`tests/*-regression.ts`, `tests/data-integrity-selfcheck.ts`).
  - All Playwright browser integration tests passing (including `companion-map-callout-regression.spec.ts`).
  - 100% canonical KJV corpus verified (31,102 verses). Clean Vite production build.


## [00.01.60] - 2026-10-21

- **Atlas Theme Color Realignment for External Popups**:
  - Completely replaced neon colors (`#38bdf8`, `#7dd3fc`, bright orange `#fb923c`) across floating external callouts, map tooltips, and leader line connectors with the warm antique gold (`#d4af37`, `#c99738`), deep obsidian (`rgba(18, 16, 12, 0.97)`), warm parchment (`#fdfbf7`, `#f4efe6`), and muted stone earth tones of the Atlas.
  - Waypoint tooltips, kingdom polygons, leader line arc, and discovery site callouts now seamlessly match the antique map aesthetic.
- **Jacob's Path Corrected from Birthplace**:
  - Fixed Jacob's journey (`jacob-padan-aram`) which previously began incorrectly in Haran.
  - Jacob's first stop is now Stop 0 at the Tents of Isaac (Beer-sheba & Well Lahai-roi, Genesis 25:19–28:10), capturing the birth of Jacob & Esau, Esau selling his birthright for red pottage, Isaac's blessing stolen in goat skins, Esau's vow, and Jacob being sent to Padan-aram.
- **Joseph's Journey Created & Pharaoh Attribution Fixed**:
  - Joseph is who was in lead in Egypt under Pharaoh, not Jacob his father.
  - Created dedicated biblical journey `joseph-egypt`: *"Joseph: From Canaan's Pit to Ruler of Egypt"* (`c. 1898 – 1805 BC`, 6 stops: Hebron coat of many colours -> Dothan pit -> Memphis/Prison -> Royal Court of Pharaoh -> Goshen sustenance of Israel -> Death & oath of his bones).
  - Clicking Pharaoh in Genesis 47 (or clicking Joseph) now spotlights Joseph's path in Egypt rather than Jacob's path.
  - Resolved dynamic narrative path naming in the companion artifact drawer.
- **Verification & Regression Coverage**:
  - All 10 Playwright tests passing (`tests/bible-entity-click-navigation.spec.ts`, `tests/companion-map-callout-regression.spec.ts`, `tests/bible-side-by-side-map.spec.ts`).
  - All 15 unit/regression tests passing (`tests/pharaoh-entity-resolution-regression.ts`, `tests/data-integrity-selfcheck.ts`).
  - Canonical KJV corpus: 31,102 verses verified 100% intact.
  - Clean production build (`npm run build` in 898ms).

- **Organic Historical Cartography & External Leader-Line Callouts**:
  - Replaced crude, jagged low-vertex kingdom/empire boundary cuts with authentic high-resolution geodetic coordinates tracing actual historical relief (Nile Delta ribbon and valley down to Aswan, fertile Yemeni highlands of Sheba, Nubian cataract S-curves, and Tigris-Euphrates alluvial floodplains).
  - Implemented multi-pass organic curve subdivision algorithm (`smoothPolygonCoordinates` using Chaikin's geometric corner-cutting) and dual-stroke watercolor boundary wash (soft outer translucent halo + crisp antique boundary line) across all kingdoms, empires, and regional realms.
  - Replaced internal, cursor-blocking Leaflet popups on the companion map with an **External Floating Callout** positioned cleanly to the left of the map (extending into the Scripture column margin on desktop, or stacked beneath the map on mobile).
  - Implemented dynamic SVG leader line with graceful cartographic arc, pulsing gold pinpoint, and pointer arrow that connects the external callout directly to the exact hovered coordinate, leaving the entire companion map and cursor 100% unobstructed.
  - Eliminated map tooltip collisions and strict mode violations on companion map hovering.
  - Verified with new Playwright integration suite `tests/companion-map-callout-regression.spec.ts` (2/2 passing) and full existing test suites (`tests/bible-side-by-side-map.spec.ts` 7/7 passing, `tests/bible-entity-click-navigation.spec.ts` 1/1 passing, unit tests 16/16 passing). Canonical KJV corpus 100% intact.

## [00.01.58] - 2026-10-21

- **Map-First Entity Navigation & Biblical Cartography**:
  - Implemented smart entity resolution in `src/data/ancientMapData.ts` (`resolveBiblicalEntity`) for rulers (Pharaoh, Caesar, Nebuchadnezzar, Cyrus, Sennacherib, Pilate, Herod), places (Goshen, Rameses, Memphis, Zoan, Haran, Ur, Dothan, etc.), figures, empires, and routes.
  - Clicking any Person, Place, Time, Ruler, or Realm in the Scripture text now switches directly to the Map tab, zooms into the relevant region, displays approximate year, kingdom region of power, allies & contemporaries, and connected narrative paths.
  - Word Inspector is reserved for non-entity vocabulary or explicit right-clicks.
  - Fixed Genesis 47 / Patriarchs era cartography: removed out-of-period Nabonidus Cylinder (c. 550 BC) artifact marker from 2000 BC Patriarchs era, centered map on the Canaan–Egypt corridor, and wired Genesis 37–50 to the `jacob-joseph-egypt` narrative journey stop at the Land of Goshen / Avaris.
  - Verified with new regression test `tests/pharaoh-entity-resolution-regression.ts` (13/13 unit tests pass) and browser test `tests/bible-entity-click-navigation.spec.ts` (15/15 Playwright tests pass).

## [00.01.57] - 2026-10-21

- Integrated dedicated Google Analytics 4 (GA4) telemetry (`G-P4HE0VJJC9`) across all public pages (`index.html`, `bible.html`, `map.html`, `interact.html`, `contact.html`, `tapestry.html`) and created `src/analytics.ts` for deep custom event tracking (scripture chapters, verse selection, companion tabs, map layers, presets, dossiers, figures, curiosity doors, and contact inquiries). Tested via `tests/analytics-regression.ts` (68/68 node regressions passed) and `tests/analytics-tracking.spec.ts` (4/4 browser tests passed).

- Added an evidence receipt and source register for all 20 existing atlas artifacts, with corrected source IDs, bounded claims, date ranges, limitations, and `attested`/`inferred`/`proposed`/`disputed` connections. Corrected the Soloi map point to Cyprus and removed false figure links and object links.
- Connected a sourced Gallio → Acts 18:12 reader/map route and separately sourced Seneca literary context; added two passage-specific chronology synchronies with an honest undated state elsewhere.
- Kept the full attributed OpenBible cross-reference archive while showing three individually reviewed quotation links by default. Added one occurrence-specific Hebrew word alignment and explicit limits for unreviewed words and same-spelling people.
- Recorded the owner's free, donation-supported study decision. No account, paid tier, corpus rewrite, third-party image import, commit, push, or deployment.
- Data regressions 30/30, evidence browser checks 5/5, canonical KJV verifier and production build passed. Affected map/reader/word/Interact run passed 47/48 with one outdated Pilate assertion; after updating that assertion, the deep-link check passed 1/1.

## [00.01.56] - 2026-10-18

- Clarified Historical Bible's focus: Scripture alongside the people, kingdoms and events of world history. Updated public purpose/support copy and repeated study statements.
- Linked Biblical Connections as a related project sharing the OpenBible dataset; retained accurate OpenBible.info / Treasury of Scripture Knowledge data attribution and licensing.
- Verified 13 affected browser tests, build/canonical checks and desktop/mobile credit layout. Local release; not committed or deployed.

## [00.01.55] - 2026-10-18

- Local test/tooling revision: default npm test now runs all data regressions, portable Python importer units and browser tests; test:all includes historical PDF/DOCX and vault acceptance.
- Removed duplicated/implementation-only assertions and success-only screenshots; consolidated repeated PDF extraction without dropping feature checks. Retired the obsolete static-menu diagnostic and moved manual geometry diagnostics out of tests.
- Added atlas reachability and passage-link regressions, contact encoding assertions, and importer boundary/ownership/invalid-export cases. Preserved profile foreign-key checks for actual profile links.
- Verified 26 data, 79 browser and 42 Python tests plus production build/canonical KJV verification. Documented and pinned the tested Python dependencies. Not committed or deployed.

## [00.01.54] - 2026-10-18

- Added 106 Scripture story menu entries spanning Creation–Babel, major narratives, wisdom, late Judah, prophetic readings and Revelation alongside the 45 existing journeys.
- Search now reaches all 66 KJV books, with complete verse pagination, exact reference handling, source-preserving display, place/discovery results and loading failure recovery.
- Added reader compatibility for legacy atlas book codes; map study links open the cited passage instead of unrelated shared figure profiles.
- Removed Jonah’s invented intermediate itinerary and mileage; label Job’s uncertain geography/dating and Peter’s Roman tradition honestly.
- Verified 106 story citations, every route/stop/discovery anchor, two data tests, four new browser tests and 24 existing affected browser checks. Canonical corpus unchanged; build passes. Local release only, not deployed.

## [00.01.53] - 2026-10-18

- **Root-Cause Hidden Entities Audit & Unrestricted Navigation**:
  - Traversed all 45 routes, 20 archaeological discoveries, 13 chronological eras, 26 world empires, and 47 granular timeline filters to eliminate all artificial restrictions.
  - Added missing `2kings_jehu` and `2kings_fall_samaria` eras to `<select id="atlas-era">` in `map.html`.
  - Added Sargon II's Khorsabad Annals (`sargon-prism`) and Jonah's mission (`jonah-prophet`) to the `assyrian_siege` era, resolving trapped discovery access.
  - Added Joshua's Conquest (`joshua-conquest`) and Samuel's Circuit (`samuel-circuit`) to the `judges` era, providing the complete biblical arc of Conquest & Judges.
  - Added `ptolemaic_egypt` to `persian_restoration.additionalRegionIds`, uniting Daniel 11's Ptolemaic and Seleucid kingdoms.
  - Fixed city filtering in `src/engine/ancientMap.ts` by adding `'judges'` to `otEraIds`.
  - Made the Journey dropdown (`#atlas-journey`) accessible on fresh page load with all 45 biblical journeys, and added automatic era synchronization when selecting any journey.
  - Added Playwright regression test verifying unrestricted access across all eras, journeys, discoveries, and empires (all 74/74 Playwright tests pass).

## [00.01.52] - 2026-10-18

- **Conquest & Judges Chronological Period**:
  - Added the missing judges period ("Conquest & Judges · c. 1380–1050 BC") into CHRONOLOGICAL_ERAS in src/data/ancientMapData.ts and <option value="judges"> in map.html.
  - Updated Judges and Ruth in src/data/bibleChronology.ts to eventEraId: 'judges'.
  - Populates Gideon's route (gideon-judges), Samson (samson-judges), and Ruth (ruth-boaz), allowing users to easily explore the Harod Spring, Moreh, and the 300 Midian rout without guessing eras.
- **Instant Journey & Story Search**:
  - Added dedicated Journey Search field (#atlas-journey-search) directly in map.html controls with autocomplete popup and quick-clear button.
  - Implemented real-time indexing with comprehensive phrase matching, keyword maps, and stop note recognition across all biblical routes.
  - Prioritizes exact stop names over narrative note mentions. Selecting any result automatically switches era if needed, activates the journey, focuses and animates the map, and opens the matching stop in the detail drawer.
- **Jacob's Travels: To & From Rachel in Padan-Aram**:
  - Added jacob-padan-aram (Genesis 28–35) with 9 stops: Beersheba departure, Bethel (Jacob's Ladder), The Well of Haran in Padan-Aram (Meeting Rachel), Mount Gilead covenant heap with Laban, Mahanaim (God's host of angels), Peniel (wrestling for the blessing), Succoth/Shechem, Ephrath/Bethlehem (Rachel's grave pillar), and arrival at Hebron.
- **Balaam's Donkey & the Oracles of Moab**:
  - Added balaam-journey (Numbers 22–24) with 6 stops: Pethor on the Euphrates River, Path through the Vineyards (where the donkey speaks and the Angel of the LORD stands with drawn sword), City of Moab on the Arnon, Bamoth-Baal, Top of Pisgah, and Top of Peor (the Star out of Jacob prophecy).
- **Jonah's 550-Mile Overland Trek to Nineveh**:
  - Enriched jonah-prophet (Jonah 1–4) with 8 stops and explicit overland path geometry illustrating the immense 550-mile walking journey from where the great fish vomited him onto the Mediterranean shore, through the Hamath gap and Northern Syrian highway, across the Euphrates River ford at Tiphsah, into Nineveh (repenting in sackcloth and ashes), and out to the booth east of the city.
- **Pane Hierarchy Synchronization**:
  - Equalized z-index at 620 for sitePane and routeStopPane in src/engine/ancientMap.ts so archaeological discovery markers sit above route stops without being blocked from pointer clicks.
- **Regression Tests**:
  - Added Playwright regression tests in tests/map-reading-experience.spec.ts covering period selection, journey search for "gideon", "donkey", "rachel", and "nineveh", stop jumping, and drawer inspection. All 73/73 Playwright tests, 12/12 collection self-checks, and all water crossing audits pass cleanly.

## [00.01.51] - 2026-10-18

- **'What to show' Menu Sits on Dedicated Line on `/map`**:
  - Moved `#atlas-visibility` (`.atlas-disclosure`) to its own dedicated full-width flex line (`flex: 1 1 100%`) directly beneath the period and journey dropdowns and strictly above the journey timeline sequence slider (`#atlas-sequence`).
  - Sized desktop `<summary>` button as `width: fit-content; display: inline-flex; align-items: center` with left alignment, and gave `.atlas-disclosure-body` its own clean top border and margin so expanding/collapsing options never causes layout jumps.
- **Expansive Screen-Filling Map Canvas**:
  - Increased `.atlas-reading .atlas-canvas-card` height from `clamp(420px, 56vh, 660px)` to `clamp(580px, 78vh, 960px)` and widened `.atlas-reading .atlas-page-layout` to `max-width: min(1840px, 100%)` with tighter container padding (`clamp(16px, 2vw, 36px)`).
  - Eliminates the large empty black void beneath the map on standard desktop screens (1080p / 1440p) and lets the map and detail drawer fill the screen with rich visual presence.
- **Removed Ukrainian Flag from Map Attribution**:
  - Overrode default Leaflet attribution prefix in `src/engine/ancientMap.ts` using `map.attributionControl.setPrefix('<a href="https://leafletjs.com" ...>Leaflet</a>')` and hid `.leaflet-attribution-flag` via CSS. Maintains neutral, purely biblical focus while preserving all required Leaflet and Esri copyright attributions.
- **Regression Tests**:
  - Added Playwright regression tests in `tests/map-reading-experience.spec.ts` locking in the dedicated line positioning, expanded canvas dimensions (height >= 650px), and flag absence. (All 16/16 Playwright map tests and 12/12 collection self-checks pass; `npm run build` passes).

## [00.01.50] - 2026-10-17

- **Collection Statistics Totals & Provenance Placed Strictly Above Search Bar on `/interact`**:
  - Reordered `.collection-stats` and `.collection-provenance` to render above `.collection-search` on both desktop and mobile viewports (`src/interact.css`), resolving the issue where searching for an entry (such as Jonah) expanded `#name-search-detail` and pushed the site collection totals to the bottom of the page beneath all search results.
  - The vertical header hierarchy now follows the natural reading order: Masthead → Hero Banner → Collection Statistics Totals (344,799 Cross-reference records, 31,102 KJV verses, 2,453 Biblical name entries, 12,323 Name connections) → Provenance Footnote → Collection Explorer (when expanded) → Search Bar ("Where will you begin?") → Search Result Card (e.g. Jonah) → Study Desk / Discovery Walk.
  - Updated Playwright regression suite: adjusted `INT-15` search threshold for natural header hierarchy and expanded `INT-27` in `tests/interact.spec.ts` asserting that stats precede search bar and search results stay strictly underneath search bar (all 29/29 interact tests, 15/15 map tests, and 12/12 collection self-checks pass).

## [00.01.49] - 2026-10-17

- **Search Results & Collection Explorer Placed Strictly Below Header Information on `/interact`**:
  - Removed artificial `#study-workspace` container in `src/collectionExplorer.ts` that was reparenting `#name-search-detail` and `#collection-explorer` into a flex order 0 wrapper, which had caused search results (e.g. Jonah) and explorer tabs to unexpectedly leap to the very top of the page above the Interact hero banner and search input.
  - Returned `#name-search-detail` to its canonical position in `interact.html` directly inside `<div class="collection-search">` beneath `<form id="collection-search-form">`, so search results now open naturally directly underneath the search input and below the hero.
  - Added Playwright regression test `INT-27` in `tests/interact.spec.ts` locking in the exact vertical ordering: `#name-search-detail` and `#collection-explorer` are strictly below `.collection-hero` and `#search-input` (all 29/29 interact tests and 15/15 map tests pass).

## [00.01.48] - 2026-10-17

- **Restored Deep Green Reading Palette on `/map` with Cohesive Map Key & Context Bar**:
  - Restored the distinctive deep green and warm charcoal reading atlas palette for `/map` (`.atlas-reading` in `src/interact.css`) per user design preference: `#171a18` canvas, `#20241f` / `#232722` control surfaces, `#e8dfcd` warm parchment detail drawer, `#c3a576` brass accents, and subtle sepia tile filter (`filter: sepia(.12) saturate(.45)`).
  - Ensured the dynamic Map Key (`#atlas-legend`) and cross-page reading context bar (`#atlas-context-bar`) are seamlessly integrated into this reading palette with numbered waypoint stop badge (`.legend-stop-badge`), glowing box-shadows stripped on legend dots, and parchment contrast ratios exceeding WCAG AAA standards.
  - Updated Playwright regression suite in `tests/map-reading-experience.spec.ts` locking in the deep green reading palette and cross-page context awareness (15/15 Playwright map tests pass).

## [00.01.47] - 2026-10-17

- **Site-Wide Obsidian & Gold Visual Homogeneity & Cross-Page Context Continuity (`/bible` ↔ `/map` ↔ `/interact`)**:
  - Unified `/map` (`.atlas-reading` in `src/interact.css`) with the site-wide Historical Bible Obsidian & Gold design system (`#090c10` canvas, `#0e1218` surfaces and detail drawer, `#141a22` controls, `#d4af37` / `#f0cf65` gold accents, `Cinzel` display heading, numbered `.legend-stop-badge` in `#atlas-legend`, and crisp un-filtered map tiles `filter: none`), eliminating the isolated olive/beige/sepia palette while maintaining 7.4:1–17.4:1 contrast.
  - Added `src/store/userContextStore.ts` (`hb_user_context_v1`) and `#atlas-context-bar` (`map.html`, `src/atlasApp.ts`, `src/bibleReader.ts`, `src/studySession.ts`) so `/map` is self-aware of the user's active reading chapter in `/bible` or study subject in `/interact`, offers a one-click **`Focus Map on [Context]`** action, and live-updates cross-page links as the user explores the atlas.
  - Added Playwright regression test in `tests/map-reading-experience.spec.ts` verifying site-wide visual homogeneity and `/bible` → `/map` context continuity (15/15 Playwright map tests pass).

## [00.01.46] - 2026-10-17

- **Dynamic Map Key Above Map Canvas When Colored Regions Are Enabled**:
  - Restored the visual Map Key (`#atlas-legend`) positioned directly above `.atlas-canvas-card` in `map.html`, hidden by default and dynamically revealed whenever the user enables `World Empires` (`data-layer="empires"`) in `What to show` (`src/atlasApp.ts`).
  - Styled `.atlas-reading .atlas-legend` in `src/interact.css` to span the full width of the map canvas card (`max-width: none`) in the warm reading-atlas palette (`#20241f` surface, `#eee6d6` ink) displaying the colored region swatches (`Kingdom of Judah`, `Kingdom of Israel`, `Hostile Empires & Enemies`, `Friendly & Allied Regions`, `Global World Civilizations`) and map symbols.
  - Added Playwright regression test in `tests/map-reading-experience.spec.ts` verifying the Map Key appears directly above the map canvas when `World Empires` is toggled on and hides when toggled off (14/14 Playwright map tests pass).

## [00.01.45] - 2026-10-17

- **Reading-First Atlas Experience Slice (`/map`)**:
  - Implemented calm orientation entry on `/map` (`Every journey begins with a place`), period and journey selectors, progressively disclosed layer and region controls (`What to show`), one-place narrative sequence slider with `Previous`/`Next` and `Show all stops`, side-by-side parchment reading card (`#atlas-detail-drawer`), and atlas-scoped muted palette (`.atlas-reading`).
  - Refined `paul-first-journey` stops and notes against canonical KJV Acts 13–14 with explicit source and dating disclosure (`Exact date not specified in Acts 13–14`) and added the return stop at Antioch in Syria.
  - Fixed `<label>`/`<select>` accessible-name collision in `map.html`, aligned `readingMode` camera transitions (`setEra`, `jumpToPreset`, `animateToCoords`) to non-animated `setView`, reset global dark `details` styling inside the parchment reading card and map caption, and hid regional inland water labels at macro zoom (`zoom < 6`) in `readingMode` to prevent Levant label overlap.
  - Added `tests/map-reading-experience.spec.ts` and updated `tests/map.spec.ts` and `tests/map-chronology-compass.spec.ts` (13/13 Playwright tests pass; 8/8 self-check suites pass; KJV verification and production build pass).

## [Design plan 1.1] - 2026-10-17

- Audited user-first map structure, narrowed initial scope, and incorporated regional provenance, measured-terrain evidence and faithful Scripture handling. No application changes; version remains 00.01.44.

## [Design plan 1.0] - 2026-10-17

- Added MAP_EXPERIENCE_DESIGN_PLAN.md: inspected current atlas and documented calmer entry, progressive layers, within-era timeline, structured dating requirements, design wireframe and implementation handoff. Documentation only; application stays 00.01.44.

## [00.01.44] - 2026-10-17

- **Atlas Canvas Width Calibration & Balanced Side Margin Breathing Room**:
  - Calibrated widescreen map margins by setting `.atlas-main-container` side padding to `clamp(24px, 3.2vw, 64px)` and capping `.atlas-canvas-card` at `max-width: 1780px; margin: 0 auto;`.
  - On 1920px viewports, the map spans 1780px wide with ~70px of comfortable side margin, eliminating tight window/scrollbar borders while keeping the map expansive and wider than the 1240px interface controls.
  - Updated Playwright regression test asserting calibrated width and side margins. All tests PASS.

## [00.01.43] - 2026-10-17

- **Edge-to-Edge Widescreen Map Canvas Expansion with Decoupled Constrained Interface Controls**:
  - Decoupled the map container width architecture so the interactive map canvas (`.atlas-canvas-card`) spans edge-to-edge across the monitor (1888px width on 1920 viewports with clean 16px side breathing room) while all interface controls (header, toolbar, chronology HUD, era buttons, legend, and granular journey tracks) remain comfortably constrained and centered (`max-width: 1240px; margin: 0 auto;`).
  - Added native `ResizeObserver` on the Leaflet container to automatically trigger `map.invalidateSize()` and label deconfliction during viewport and card dimension changes.
  - Added Playwright regression test verifying widescreen map breakout while interfaces remain constrained. All 14/14 tests in `tests/map.spec.ts` PASS.

## [00.01.42] - 2026-10-17

- **Atlas Page Layout Relocation & ~8% Widescreen Responsive Margins**:
  - Relocated `#chrono-granular-panel` (the 43 journey tracks and apostle route buttons) from above the map canvas to sit cleanly below the map and below the cartographic key (`footer.atlas-legend`), eliminating the vertical button wall and immediately bringing the map into prime viewport view.
  - Implemented responsive `padding-left: 8%` and `padding-right: 8%` on `.atlas-page .wrap`, expanding map canvas width to 84% of the viewport and eliminating excessive letterbox black space on widescreen desktop monitors.
  - Added Playwright regression test verifying vertical DOM ordering (`map < legend < granular`) and left/right padding (8.0% on desktop). All 14/14 tests in `tests/map.spec.ts` PASS.

## [00.01.41] - 2026-10-17

- **Leaflet Custom Marker Coordinate Drift Fix**:
  - Enforced `position: absolute !important;` on `.leaflet-gold-marker`, `.leaflet-capital-marker`, and `.leaflet-city-marker` in `src/interact.css`. Overriding Leaflet's native `position: absolute` with `position: relative` had caused marker elements to stay in normal document flow within their parent panes, causing each marker to accumulate the vertical heights of all preceding sibling markers (+14px to +28px per marker, compounding to over +400px of downward drift in all-eras view and placing European/Levantine/Mesopotamian artifacts in Sub-Saharan Africa).
  - Introduced dedicated `capitalPane` (`zIndex: 570`) in `src/engine/ancientMap.ts` separating imperial capital markers from archaeological discovery sites (`sitePane`, `zIndex: 580`).
  - Added Playwright regression test verifying all custom markers compute to `position: absolute`, have uniform non-accumulating offset, and sit on their true historical ground truth (Arch of Titus in Rome, Pilate Stone in Caesarea, Merneptah Stele in Thebes, Cyrus Cylinder in Babylon). All 13/13 tests PASS.

## [00.01.40] - 2026-10-17

- Unify Interact search, wider study, discovery, connections, graph/map availability and shared URLs around one selected subject. Unsupported historical evidence and relationship cards clear instead of retaining the previous person. Exact name/reference matches take precedence over incidental mentions.
- Support Balaam/Balam donkey and KJV ass search aliases using Numbers 22:21-35 and 2 Peter 2:16; no invented human relationships, chronology, travel or external evidence.
- Preserve single-subject selection through refresh, history, saved studies, legacy mixed links and name-detail dismissal. Regression coverage: INT-23 through INT-26, subject URL exclusivity, aliases, canonical citations and saved passage/topic links.

## [00.01.39] - 2026-10-17

- Interact: Enter and Explore now open the top search suggestion and dismiss the dropdown. Name submissions bring the selected study into view; typing continues to preview suggestions. Empty and unmatched queries preserve the current selection.
- Regression coverage: Jonah submission through both controls, figure/empire submission, empty/unmatched queries, and canonical verse submission. Existing INT-17 click-selection scroll failure reproduced with submission fix disabled; outside this fix.

## [00.01.38] - 2026-10-17

- Strict 4-Tier Interactive Stacking Hierarchy & Equirectangular Geodesic Area Sorting:
  - **4-Tier Map Pane Architecture (`src/engine/ancientMap.ts`)**: Structured map layers into an explicit interactive z-index hierarchy: Tier 1 Points (Stops: 620, Sites & Capitals: 580, Cities: 550) > Tier 2 Paths (Routes: 480, Rivers: 460) > Tier 3 Small Regions (Lakes: 420) > Tier 4 Macro Regions (Empires: 390, Ocean Typography: 370).
  - **Points Always on Top**: Positioned city markers (`550`) and discovery sites (`580`) strictly above route corridors (`480`) and rivers (`460`), eliminating all occlusions where routes obscured cities or pins.
  - **Paths Above All Regions**: Placed rivers (`460`) and routes (`480`) strictly above inland lakes (`420`) and empire polygons (`390`), guaranteeing paths are never swallowed by region fills.
  - **Equirectangular Geodesic Area Sorting (`src/data/ancientMapData.ts`)**: Implemented Shoelace formula with cosine latitude correction to sort all area polygons (empires, kingdoms, and lakes) by geodesic surface area descending. Larger regions render first in the background; smaller regions render last in the foreground on top, ensuring hover events on smaller entities are never blocked by surrounding empire backdrops.
  - **Automated Regression Coverage (`tests/data-integrity-selfcheck.ts`, `tests/map.spec.ts`)**: Added unit tests verifying area-sorting relationships across all 26 historical eras and Playwright browser tests validating the full z-index chain and hover interactivity. 8/8 self-check test suites PASS; 12/12 Playwright tests PASS.

## [00.01.37] - 2026-10-17

- Sub-Meter OpenStreetMap Shoreline Geometry (Galilee & Dead Sea), True River Delta Realignment & Transjordan Satrapy Corridor:
  - **Sub-Meter OpenStreetMap Lake Polygons (`src/data/ancientMapData.ts`)**: Replaced hand-crafted polygonal lake boundaries with 244-point (Sea of Galilee) and 281-point (Dead Sea) GIS-accurate shorelines extracted from OpenStreetMap, hugging every natural cove, bay, and promontory pixel-for-pixel on the raster basemap.
  - **Hydrological Delta Alignment (`src/data/ancientMapData.ts`)**: Realigned the Upper Jordan River to enter the Sea of Galilee at the exact northern delta mouth (`[32.893, 35.618]`) and the Lower Jordan River to exit at the true southern Degania outlet (`[32.705, 35.588]`).
  - **Persian Satrapy Corridor (`src/data/ancientMapData.ts`)**: Rerouted the western boundary of the Persian Empire along the King's Highway corridor east of Galilee, eliminating diagonal water collision chords.
  - **Automated Collision Assertion (`tests/data-integrity-selfcheck.ts`)**: Bound ray-casting collision verification directly to the 244-point lake polygon, ensuring 0 unintended route and empire boundary collisions. All 11 Playwright and 7 self-check tests PASS.

## [00.01.36] - 2026-10-17

- Zero-Collision Water Body Geometry, Geodetic Route Road Corridors, SVG Focus Outline Reset & Cartographic Boundary Overhaul:
  - **Geodetic Route Architecture (`src/data/ancientMapData.ts`)**: Added `path?: GeoCoordinate[]` to route models so paths follow historical road corridors (e.g. Great North Road bypassing Sea of Galilee on the west) rather than cutting through lakes or deserts. Verified 0 unintended water crossings across all 43 canonical routes.
  - **Hydrological River Separation (`src/data/ancientMapData.ts`)**: Split the Jordan River into Upper and Lower courses, eliminating the straight line slicing through the center of the Sea of Galilee.
  - **Chromium SVG Focus Ring Reset (`src/interact.css`)**: Globally neutralized SVG outline styling so clicking water bodies or route lines never triggers white bounding box artifacts.
  - **Detailed Zoom Water Label Management (`src/engine/ancientMap.ts`, `src/interact.css`)**: Automatically suppressed vector water labels at high zoom (`zoom >= 8`), preventing double-stamping over raster GIS lake names.
  - **United Kingdom Realignment (`src/data/ancientMapData.ts`)**: Created unified kingdom polygon for `united_monarchy` era (`united_israel`), retiring overlapping divided kingdom borders during the United Monarchy.
  - **Continental Frontiers & Coastline Integrity (`src/data/ancientMapData.ts`)**: Realigned empire boundaries for Nabataea, Persia, Ptolemaic Egypt, Saite Egypt, and Seleucid Empire to follow real coastlines and river valleys, eliminating all water-crossing chords across the Dead Sea, Red Sea (Gulf of Aqaba & Suez), and eastern Mediterranean Sea.
  - **Regression Coverage (`tests/data-integrity-selfcheck.ts`, `tests/map.spec.ts`)**: Added automated geometric collision detection and Chromium visual regression assertions. 11/11 Playwright tests PASS; 7/7 data integrity tests PASS.

## [00.01.35] - 2026-10-17

- High-Resolution Topographic Kingdom Boundaries, Authentic Biblical Hydrology, On-Water Antique Typography & Solid Cartographic Hairlines:
  - **High-Resolution Geodetic Hydrology (`src/data/ancientMapData.ts`)**:
    - Replaced crude open sea polygons with genuine physical lake shorelines for the Sea of Galilee (17 pts) and Dead Sea (21 pts).
    - Upgraded rivers with 16–25 point serpentine geodetic paths following real river channels: Jordan River (meanders through the Ghor, Dan, Sea of Galilee, Adam, Jericho to Dead Sea), Nile River (main valley from Elephantine/Aswan past Luxor, Abydos, Memphis, Cairo apex), Damietta and Rosetta Delta branches, Pelusiac branch / Wadi Tumilat through Goshen, Euphrates River (Carchemish, Emar, Mari, Babylon, Ur, Shatt al-Arab), Tigris River (Nineveh, Calah, Assur, Samarra, Baghdad, Ctesiphon), River Jabbok, River Arnon, Brook Zered, Brook Kishon, Brook Cherith, and Brook of Egypt.
  - **High-Resolution Topographic Kingdom & Empire Boundaries (`src/data/ancientMapData.ts`)**:
    - Replaced crude 4–6 point bounding boxes with detailed 12–24 coordinate polygons based on biblical and archaeological topography: Judah (Joshua 15 borders, Shephelah, Negev, Dead Sea cliffs), Israel (Samaria, Sharon, Carmel, Acre, Upper Galilee, Golan, Gilead, Jabbok), Phoenicia (coastal littoral bounded by Mount Lebanon), Philistia (coastal plain bounded by Ekron, Gath, Shephelah), Moab (Dead Sea cliffs, Arnon/Zered gorges, Medeba plateau), Edom (Mount Seir massif, Bozrah, Petra/Sela, Ezion-geber/Aqaba), Aram-Damascus, Egypt (Nile valley and Delta corridor, hugging land and avoiding the open Red Sea), Assyria, Babylon, Persia, and Rome.
  - **Solid Cartographic Hairlines & Antique On-Water Typography (`src/engine/ancientMap.ts`, `src/interact.css`)**:
    - Eliminated all dashed borders (`dashArray: '6, 6'` and `dashArray: '3, 5'`): rendered all boundaries as solid, elegant hairlines (`weight: 1.6`, `dashArray: undefined`, soft watercolor `fillOpacity: 0.14`, elevating to `0.26` on hover).
    - Rendered classical on-water typographic annotations into `waterPane`: `THE GREAT SEA · MEDITERRANEAN SEA · YAM GADOL`, `THE RED SEA · YAM SUPH`, `GULF OF SUEZ`, `GULF OF AQABA`, `DEAD SEA · THE SALT SEA`, `SEA OF GALILEE · CHINNERETH`, `PERSIAN GULF · LOWER SEA`, and `BLACK SEA`.
  - **Regression Coverage (`tests/map.spec.ts`)**:
    - Added automated Playwright regression test verifying non-dashed solid strokes on all kingdom boundaries and lake bodies, and visibility of on-water antique typography. All 10/10 tests PASS.

## [00.01.34] - 2026-10-17

- Complete Biblical Character Mapping (41 Canonical Routes across Genesis to Revelation) & 8-Tier Managed Panes Architecture:
  - **41 Canonical Biblical Character Routes (`src/data/ancientMapData.ts`)**:
    - Expanded character coverage across all eras from Genesis to Revelation, adding 22 new character routes: Job (`job-land-of-uz`), Gideon (`gideon-judges`), Samson (`samson-judges`), Ruth (`ruth-boaz`), Samuel (`samuel-circuit`), Saul (`saul-reign`), Solomon (`solomon-glory`), Elijah (`elijah-prophet`), Elisha (`elisha-ministry`), Amos (`amos-prophet`), Hosea (`hosea-prophet`), Jonah (`jonah-prophet`), Isaiah (`isaiah-ministry`), Jeremiah (`jeremiah-ministry`), Daniel (`daniel-exile`), Ezekiel (`ezekiel-exile`), Esther (`esther-mordecai`), Ezra (`ezra-journey`), Nehemiah (`nehemiah-walls`), Stephen & Philip (`stephen-philip-deacons`), Paul's Early Ministry (`paul-conversion-early`), and Barnabas & Mark (`barnabas-mark`).
    - Every route contains numbered, dated, interactive stops with Scripture citations and historical commentary.
    - Updated macro-era active route arrays (`patriarchs`, `exodus`, `united_monarchy`, `divided_monarchy_prophets`, `2kings_jehu`, `assyrian_siege`, `babylonian_exile`, `persian_restoration`, `roman_christ`, `apostolic_church`, and `all`).
    - Added dedicated granular sub-era filter chips into `GRANULAR_TIMELINE_FILTERS`.
  - **8-Tier Managed Map Panes & Zero-Collision Stacking (`src/engine/ancientMap.ts`)**:
    - Created explicit `cityPane` (`440`) and `sitePane` (`540`), elevating `routeStopPane` to `620` so that city marker dots never intercept pointer events when hovering or clicking numbered waypoint stops.
    - Assigned imperial capital markers to `sitePane` (`540`) and route banners to `routePane` (`480`), ensuring route banners never block interactive capital pins or archaeological discoveries.
    - Re-positioned banner coordinates in Judah and Samaria to maintain clear margins around royal capitals.
  - **Verification (`tests/map.spec.ts`)**:
    - All 9 Playwright end-to-end tests PASS in 34.7s; all 7 data integrity selfcheck tests PASS.

## [00.01.33] - 2026-10-17

- Granular Sub-Era Map Timeline, 19 Biblical & Apostolic Journeys (130+ Dated Stops), John the Baptist & Jesus Parallel Synchrony, Thomas to Parthia & India & Interactive Waypoint Stepper:
  - **19 Biblical & Apostolic Journeys with 130+ Dated Stops (`src/data/ancientMapData.ts`)**:
    - Expanded `BIBLICAL_ROUTES` from 3 routes to 19 comprehensive routes across Old Testament (`abraham-call`, `jacob-joseph-egypt`, `exodus-route`, `joshua-conquest`, `david-exile-throne`, `elijah-elisha-ministry`, `babylonian-deportation-daniel`, `ezra-nehemiah-return`), John the Baptist & Earthly Life of Jesus (`john-baptist-ministry`, `jesus-nativity-youth`, `jesus-early-ministry`, `jesus-galilean-ministry`, `jesus-passion-resurrection`), and Apostolic Missions (`peter-philip-missions`, `paul-first-journey`, `paul-second-journey`, `paul-third-journey`, `paul-voyage-rome`, `john-seven-churches-patmos`, `thomas-parthia-india`, `andrew-mark-missions`).
    - Added explicit `RouteEvidenceClass` (`'SCRIPTURE_TEXT' | 'EXTERNAL_HISTORICAL_ATTESTATION'`) and `attestationSource` citations (Origen in Eusebius *Hist. Eccl.* 3.1, Takht-i-Bahi inscription of King Gondophares, Gregory of Nazianzus, Jerome, Ephrem the Syrian) to distinguish canonical Scripture waypoints from patristic/historical tradition waypoints.
  - **Granular Sub-Era Filter Bar & Interactive Waypoint Stepper (`map.html`, `src/atlasApp.ts`, `src/engine/ancientMap.ts`, `src/interact.css`)**:
    - Added 22 granular sub-era track filters (`GRANULAR_TIMELINE_FILTERS`) accessible from `/map` (including all John the Baptist, 4 phases of Jesus's life, and Apostolic tracks directly from **Apostolic Age** and **Christ & Rome**), plus the `#chrono-waypoint-stepper` control bar (`◀ Prev Stop`, `Next Stop ▶`, multi-route switcher tabs, live stop readout card, and clickable `1..N` stop chips).
    - Added golden-angle spiral micro-offset deconfliction (`getDeconflictedStopCoords`) for shared cities across concurrent routes and tuned pane z-ordering (`routeStopPane: 560`, `markerPane: 600`).
  - **Regression Coverage (`tests/map.spec.ts`)**:
    - Added headed Playwright regression test verifying John the Baptist + Jesus parallel view, Jesus's 4 life phases, Thomas's Parthia & India route with patristic badges, and stop-by-stop stepping (16/16 Playwright map tests passing).

## [00.01.32] - 2026-10-17

- Map UI/UX Maturation: Viewport-Clamped Hover Informationals, Wrapped Single-Border Tooltips, 5x2 Era Grid & Screen-Space Label De-confliction:
  - **Viewport-Clamped Hover Informationals (`src/engine/ancientMap.ts`, `src/interact.css`)**:
    - Added `AncientMapCanvas.constrainTooltipToViewport()` to mathematically clamp all `.leaflet-tooltip` popups within the visible map container (`10px` inset margin + top-left zoom control clearance), flipping top-clipped tooltips below their marker anchor and shifting `translate3d` horizontally/vertically as needed.
    - Enforced `white-space: normal !important; overflow-wrap: break-word !important;` on `.leaflet-tooltip` and `.map-tooltip-inner` and removed duplicate nested `.map-leaflet-tooltip` wrappers so multi-sentence descriptions wrap cleanly inside a single gold border.
  - **5x2 Responsive Era Timeline Grid & Divided Kingdom Tab (`map.html`, `src/atlasApp.ts`, `src/interact.css`)**:
    - Added the `divided_monarchy_prophets` (`Divided Kingdom · c. 930 – 722 BC`) button to `map.html`, mapped granular sub-eras in `syncEraUI`, and converted `.chrono-era-selector` into a 5-column responsive grid with zero button text overflow or horizontal clipping.
  - **Screen-Space Marker Label De-confliction & Era Filtering (`src/engine/ancientMap.ts`)**:
    - Added `deconflictMarkerLabels()` across cardinal directions (`east`, `west`, `north`, `south`) and offset nudges with HUD control clearance (`.ancient-map-controls`, `.ornate-compass-rose`, `.map-canvas-year-hud`), filtered anachronistic Greco-Roman/NT cities out of Old Testament eras, shortened on-canvas artifact/capital labels while keeping full titles in tooltips/drawers, and synced `activeEra` in `focusOnFigure()` for `/interact?view=map`.
  - **Regression Coverage (`tests/map.spec.ts`)**:
    - Added headed Playwright regression test verifying 100% viewport containment of all tooltips, wrapped text width, zero era button overflow, and zero marker label collisions across `/map`, `/bible?tab=map`, and `/interact?view=map` (14/14 specs passing).

## [00.01.31] - 2026-10-17

- Progressive Hydration, Expanded Archaeological/Geographic/Chronological Coverage, PDF Deduplication & Contact Mailto Wiring:
  - **Two-Phase Progressive Hydration & Parallel Loading**:
    - Added `localStore.initCritical()`, `isCriticallyLoaded()`, `isFullyLoaded()`, and `buildVerseIndices()` in `src/store/localFirstStore.ts` to load `/data/kjv_verses.json` and `/data/history/historical_synchrony.v1.json` in parallel and hydrate `/bible` Scripture text, Chronology, and Map panels immediately while `/data/cross_references_bundle.json` and `/data/bible_network.json` finish hydrating in parallel (`src/bibleReader.ts`).
  - **Expanded Archaeological Sites, Biblical Geography & Granular Chapter Chronology**:
    - Added 6 high-attestation archaeological sites to `ARCHAEOLOGICAL_SITES` (`lachish-ostraca`, `jehoiachin-ration-tablets`, `dead-sea-scrolls-qumran`, `pool-of-siloam-steps`, `sergius-paulus-inscription`, `arch-of-titus-spoils`, bringing the total to 20 sites) and wired them into `CHRONOLOGICAL_ERAS` (`src/data/ancientMapData.ts`).
    - Added 26 biblical cities and regions to `BIBLICAL_GEOGRAPHIC_ENTITIES` (`corinth`, `rome`, `ephesus`, `philippi`, `colossae`, `thessalonica`, `galatia`, `antioch`, `athens`, `crete`, `patmos`, `hebron`, `shiloh`, `gibeon`, `hazor`, `ai`, `shechem`, `beersheba`, `dan`, `lachish`, `susa`, `shushan`, `bethlehem`, `nazareth`, `capernaum`, `caesarea`).
    - Added contiguous `chapterBreakdown` ranges to `Joshua`, `Judges`, `1 Samuel`, `2 Samuel`, `Isaiah`, `Jeremiah`, and `Daniel` (`src/data/bibleChronology.ts`).
  - **PDF Proof Consolidation & `public/Bible.pdf` Deduplication**:
    - Consolidated intermediate PDF binaries (`v0.3.0`–`v0.3.2`) in `pdf-proof/`, freeing `~105.3 MB` (`187.5 MB` → `~87 MB`, well under the 160 MB workspace cap) while retaining `v0.2.0`, `v0.3.3`, all JSON manifests, and PNG proofs; updated `tests/test_pdf_*.py` and `pdf-proof/README.md`.
    - Added `serveAndCopyRootBiblePdf()` in `vite.config.ts` to serve and bundle `/Bible.pdf` directly from root `Bible.pdf`, removing the duplicate `31.38 MB` `public/Bible.pdf` (`~136.7 MB` total disk space saved).
  - **Contact Form `mailto:` Synthesis & Expanded Self-Checks**:
    - Updated `contact.html` to dynamically construct a `mailto:BibleHistorical@gmail.com` link with the user's Name, Email, Message, and email-list opt-in preference upon submission.
    - Extended `tests/data-integrity-selfcheck.ts` with regression assertions for all `v00.01.31` enhancements.

## [00.01.30] - 2026-10-16

- Codebase Audit Remediation: Automated Data Self-Checks, Error Handling, Bloat Cleanup & Documentation Sync:
  - **Canonical KJV & Cross-Dataset Self-Checks**:
    - Repaired 5 `[I[` / `[O[` bracket typos in `public/data/kjv_verses.json` (`Numbers 12:6`, `Psalms 25:17`, `Isaiah 41:17`, `Jeremiah 17:10`, `Habakkuk 1:5`) verified against `Bible.pdf` (`pdf-proof/v0.2.0/reference-verses.json`), updated `scripts/build-curated-kjv.js`, and documented the repairs in `error_corrections_log.md`.
    - Upgraded `scripts/verify-canonical-kjv.js` to enforce strict non-nested balanced `[...]` brackets across all 31,102 verses (`14,138` bracketed-italic verses, `5,556` `LORD` verses, `66` books, `1,189` chapters).
    - Fixed `src/data/bibleChronology.ts`: resolved duplicate `eventOrder: 19` (`Ecclesiastes` & `Obadiah`) and missing `eventOrder: 66` so `eventOrder` forms a strict `1..66` permutation, aligned all 32 `eventEraId` values to valid `CHRONOLOGICAL_ERAS` IDs, and fixed Titus `osis: 'Tit'` → `'Titus'`.
    - Added `tests/data-integrity-selfcheck.ts` (`npm run test:selfcheck`) verifying invariants across `kjv_verses.json`, `BIBLE_CHRONOLOGY`, `ancientMapData.ts`, `historical_synchrony.v1.json` ↔ `discoveries.ts`, and `localStore.searchWholeWord`.
  - **Error Handling & Bug Fixes**:
    - Added `localStore.searchWholeWord()` (`src/store/localFirstStore.ts`) and wired it into `BibleReader.renderWordInspector()` (`src/bibleReader.ts`) to eliminate substring false positives in concordance results.
    - Cached `/data/strongs_reverse.json` in `CacheStorage`, shared an in-flight promise, enabled retries on transient failures, and refreshed the Word Inspector when Strong's prefetch resolves (`src/data/scriptureLexicon.ts`, `src/bibleReader.ts`).
    - Fixed `'tit'` → `'titus'` and added `'job'`, `'joel'`, `'obad'` in `BibleReader.getMapEraForCurrentPassage()`, added `Chronological Reconstruction` evidence-class disclosure to `renderCompanionChrono()`, debounced `mapResizeTimer`, and HTML-escaped error messages in `BibleReader.renderError()`.
    - Wired `/map` detail drawer links (`src/atlasApp.ts`) to `/bible?ref=...` instead of hardcoded `/bible`.
    - Rendered `WATER_FEATURES` (`seas` and `rivers`) on `waterLayerGroup` when the Waterways (`rivers`) layer is enabled in `AncientMapCanvas` and added an offline tile-error fallback badge (`src/engine/ancientMap.ts`).
    - Added defensive null guards in `src/main.ts`, `src/collectionExplorer.ts`, and `src/engine/egoGraph.ts` (added `destroy()` listener cleanup), and fixed `tapestry.html` data loading (`/data/kjv_verses.json`, `/data/cross_references_bundle.json`) and `SEED_TEXTS["Isa.49.6"]`.
  - **Bloat Cleanup & Documentation Synchronization**:
    - Removed duplicate `public/downloads/Bible.pdf`, 6 legacy GoDaddy `*_files/` folders, 5 unconsumed JSON files in `public/data/`, and 4 one-off scripts in `scripts/`, reducing production `dist/` size by **41.04 MB** (`107.75 MB` → `66.71 MB`).
    - Replaced duplicate `bible/index.html` and `contact/index.html` with lightweight redirect stubs matching `interact/index.html` and `map/index.html`.
    - Updated `README.md`, `package.json`, `interact.html`, and `map.html` to `v00.01.30`.

## [00.01.29] - 2026-10-16

- Map Interaction Hardening, Zero-Collision Exclusivity & Northern Kingdom Inspection across All Maps (`/map`, `/bible`, `/interact`):
  - **Single Tooltip Exclusivity (`bindManagedTooltip`)**:
    - Centralized active tooltip lifecycle management in `AncientMapCanvas` (`src/engine/ancientMap.ts`), ensuring strictly at most one tooltip exists at any moment across all layers.
    - Bound canvas event handlers (`movestart`, `zoomstart`, `click`, `container.mouseleave`) to clean up all open and orphaned tooltips in `tooltipPane`.
    - Added CSS enforcement in `src/interact.css` with `pointer-events: none !important;` on all tooltips to prevent dropped mouseout events and eliminate multiple stuck popups.
  - **Northern Kingdom of Israel (`israel_kingdom`) Accessibility & Geodetic Boundary Refinement**:
    - Retuned historical bounds in `src/data/ancientMapData.ts` so `assyria` and `babylon` terminate at `lng: 37.5` in upper Mesopotamia / Syrian desert, leaving Samaria, Galilee, Gilead, and the Levant completely unblocked.
    - Re-ordered SVG polygon rendering by area descending (`parseArea(b.approximateArea) - parseArea(a.approximateArea)`), guaranteeing macro empires render in the background while smaller focal kingdoms (Israel, Judah, Phoenicia, Moab) render on top in the foreground.
    - Added interactive polygon hover (`#ffd700` gold border, fill opacity 0.32, `polygon.bringToFront()`) and click listeners opening the kingdom's complete historical dossier in the companion drawer.
  - **DivIcon Hitbox Shrinkage & Directional Quadrant Layout**:
    - Sized DivIcons strictly to their visual pin dimensions (`capIcon: [12, 12]`, `goldIcon: [28, 28]`, `cityIcon: [10, 10]`), eliminating the previous 80px–140px invisible rectangular collision boundaries that previously blanketed neighboring cities in the dense Levant.
    - Implemented intelligent directional label layout:
      - Coastal / western capitals (`philistia`, `phoenicia`): `.label-west` (`right: 14px; left: auto; text-align: right;`) pointing into the Mediterranean Sea.
      - Southern capitals (`judah`, `edom_kingdom`): `.label-south` (`top: 12px; left: 2px;`) pointing southward.
      - Northern capitals (`israel_kingdom`): `.label-north` (`top: -16px; left: 4px;`) pointing northward.
    - Established faction-aware Z-index priority: Covenant & Israel capitals (`zIndexOffset: 1500`), secondary empire capitals (`zIndexOffset: 1200`), discovery artifacts (`zIndexOffset: 1600`), general cities (`zIndexOffset: 500`).
    - Deduplicated imperial seats in `BIBLICAL_CITIES` to prevent redundant gray city dots from overlapping prominent royal capitals (e.g. Jerusalem).
    - Updated `moab_kingdom` capital coordinates to `Kir-Hareseth (Kerak)` (`lat: 31.18, lng: 35.70`), the southern fortress of King Mesha, completely eliminating overlap with the northern `Mesha Stele` discovery site at Dibon.
  - **Automated Verification**:
    - Added regression tests in `tests/bible-side-by-side-map.spec.ts` and `tests/map.spec.ts` asserting single tooltip exclusivity, Northern Kingdom hover accessibility, and drawer population.
    - All 54 Playwright tests pass green (54/54); collection tests pass (4/4); 100% canonical KJV 31,102 verses verified; Vite production build passes in 788ms.

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
  - Features a crisp red North pointer (#ef4444 / #b91c1c) with a subtle red 'N', clean slate gray South pointer (#94a3b8 / #64748b), and faint subtle East & West horizontal wings/labels (
gba(148, 163, 184, 0.4)).
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
