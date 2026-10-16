# Changelog — HistoricalBible.com

All notable changes to this project will be documented in this file.

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
- Three book-header regression checks pass; application version remains 1.5.0. No source replacement, commit, or publication.

## [1.6.0] - 2026-10-16

- Unified all four site pages (`index.html`, `interact.html`, `bible.html`, `contact.html`) and clean directory routes (`bible/index.html`, `contact/index.html`) under the calm dark-gold design system (`Cinzel`, `EB Garamond`, `Inter`, `JetBrains Mono`).
- Separated the Front Door (`index.html` — welcome headline, 4-century timeline thread, 3 curiosity doors linking to `/interact?figure=<id>`, verbatim `PURPOSE` / `CONVICTION` mission cards, restored dark-gold "Download the Bible" welcome popup `#popup-widget6691`, quiet "Why the KJV" footnote, and PayPal donation form) from the dedicated Interactive Study Desk (`interact.html` — opening directly at the Discovery Pair `01 Read the Scripture` + `02 Meet the Historical Record`, `03 Follow Your Curiosity`, and the 3-column `Go Deeper` research workspace).
- Implemented true small-caps `LORD` typography (`L` + `0.74em` `ORD`) in the UI while preserving clean `LORD` text copy, and removed all `"hand-typed"` references from page copy and metadata.
- Updated `tests/interact.spec.ts` and `tests/site_pages.spec.ts` (20 Playwright tests passing) to lock in separated page roles, curiosity door transitions, true small-caps `LORD` glyph ratios, welcome popup behavior, `"Why the KJV"` footnote order, and zero `"hand-typed"` wording across all routes.

## PDF reading-note proof [0.3.2] - 2026-10-15

- Inserted one short, tagged live-text note after the cover and before the clickable Contents. It visibly distinguishes large-L/smaller-ORD small caps from four equal-height capitals, plus `Lord` and `lord`, while both capital forms copy as `LORD`.
- Added brief notation and pronoun explanations and one short reading paragraph. The supplied-word line explains that most printed KJVs use italics and this edition uses brackets for search, copying, and machine learning. Preserved the 66 book links, 1,189 chapter bookmarks, all 1,160 tagged return links, printed folios and Scripture text.
- Four reading-note regression checks pass. Application version remains 1.5.0; no publication, commit or source replacement.

## PDF accessibility proof [0.3.1] - 2026-10-15

- Gave the cover semantic title/subtitle headings and readable descriptions for its two ornaments.
- Tagged and named all 1,160 Scripture-page return links with individual annotation objects, preserving their destinations, book/chapter bookmarks, page labels, text and layout.
- Three accessibility regression checks pass; five representative pages render pixel-identically to v0.3.0. App version remains 1.5.0; no publication or source replacement.

## PDF navigation proof [0.3.0] - 2026-10-15

- Added 1,189 nested chapter bookmarks and PDF viewer page labels that match printed Scripture folios (1-1160), while preserving the existing layout, links, tagged text, and the prior v0.2.0 proof.
- Verified every chapter destination and page label, plus all-page text, geometry, link, and structure-tree preservation with five regression checks. Accessibility improvements remain a separately scoped review.

## PDF proof [0.2.0] - 2026-10-15

- Added a separate repair proof from the recovered Word master, preserving layout, selectable Scripture, 74 bookmarks and 1,296 links.
- Restored missing endings, removed duplicate passages/page-label contamination, recorded narrow wording/case repairs and restored source-based small caps.
- Added eight DOCX and ten PDF regression checks, before/after provenance and a clearly separated unresolved comparison list. Originals/site untouched; application version remains 1.5.0.

## Governance [1.0] - 2026-10-15

- Adopted owner-supplied AGENTS.md and principles.md in the project root with their wording preserved exactly.
- Added README entry points, the adoption record, and stable change-control guidance; PDF repair remains a separate task.
- Documentation only; application version remains 1.5.0.

## [1.5.0] - 2026-10-15

- Rebuilt Interact around a first discovery: Scripture beside a historical record, followed by questions that lead to another person or passage.
- Added twelve editorial discovery routes, exploration trail/back navigation, source-linked featured records, and an attributed CC0 photograph of the Pilate inscription.
- Moved era filters and the names dictionary into the deeper study; improved search, connected-passage navigation, empty states, and small-screen reading.
- Unified Interact URL aliases and explained the local-preview requirement when source HTML is opened from disk.
- Preserved the existing KJV corpus and historical collection. No dependencies added. Verified with headed browser regressions and the canonical production build.


## Obsidian Bible Network [0.01.00] - 2026-10-14

- Added native Obsidian Bible notes: complete KJV, names co-occurrence network, book indexes, and all 344,799 OpenBible cross-reference records with full target ranges and votes.
- Added dependency-free export/validation tools under E:\AI_Hub\Tools\bible-network, source attribution, regeneration rules, and five unit tests.
- Preserved the app's independent version and existing data; Obsidian export has its own v0.01.00 sequence.
## [1.4.0] - 2026-10-15

### Fixed & Restored
- **Verbatim Restoration of GoDaddy Web Archive**: Restored exact archived pages from `assets/Web_Archive_20261014/` (`Historical Bible - Faith and Religion, The Bible.html` -> `index.html`, `HistoricalBible.html` -> `contact.html`, `Bible-download.html` -> `bible.html`).
- **Complete Visual & Brand Fidelity**: Restored original GoDaddy typography (`Righteous`, `Josefin Sans`), header layout, sunset Bible banner, "Help Our Cause" section, and PayPal donation button flow (`BibleHistorical@gmail.com`).
- **Asset Directory Mirroring**: Copied `Historical Bible - Faith and Religion, The Bible_files`, `HistoricalBible_files`, and `Bible-download_files` to root and `public/` directories for zero-404 static hosting on GitHub Pages.
- **Direct Bible.pdf Serving**: Linked download button to Joel's hand-typed 9.5MB `Bible.pdf` hosted directly on the repository domain.
- **Interactive Gateway**: Maintained Three.js 3D WebGL Scripture Tapestry engine at `/interact` (`interact.html`).
- **Regression Verification**: Updated Playwright test suite (`tests/site_pages.spec.ts`) asserting exact archived content with automated screenshot proofs.

## [1.3.0] - 2026-10-14

### Added
- **Full HistoricalBible.com Multi-Page Suite**: Built out Home (`index.html`), Contact Us (`contact.html`), and Bible Download (`bible.html`) pages recreating the complete GoDaddy archive website with elegant Cinzel/Lora typography and local-first architecture.
- **Stand-alone 2D Tapestry Engine**: Preserved at `tapestry.html` alongside the unified `interact.html` engine.
- **Self-Hosted Bible PDF**: Copied Joel's hand-typed `Bible.pdf` directly into `public/Bible.pdf` and `public/downloads/Bible.pdf` (~9.5 MB) for direct, serverless downloads independent of third-party CDNs.
- **Brand Assets**: Migrated `logo.jpg`, PayPal, and accepted card badges into `public/images/`.
- **GitHub Pages & Custom Domain Preparation**: Configured `CNAME` for `historicalbible.com`, `.nojekyll`, and automated `.github/workflows/deploy.yml` deployment workflow.
- **Clean URL Directory Aliases**: Generated `contact/index.html`, `bible/index.html`, and `interact/index.html` ensuring resilient routing across clean paths and file extensions.
- **Expanded Automated Regression Suite**: Added `tests/site_pages.spec.ts` (`REG-09`, `REG-10`, `REG-11`). All 12 Playwright tests passing in 8.4s.

## [1.2.0] - 2026-10-14

### Added
- **Hand-Typed Authoritative KJV Corpus Ingestion**: Compiled 31,098 verses directly from Joel McCracken Jr.'s hand-typed `Bible.pdf` into `public/data/kjv_verses.json`.
- **Restored Translator-Added Italics**: 14,134 bracketed verses (`[...]`) preserving KJV italics with `.kjv-added` CSS styling and transparent scholarly tooltips.
- **Divine Covenant Name Typography**: Preserved 5,556 verses with `LORD` (יהוה / Jehovah) in dedicated small-caps gold styling, distinguished from 1,010 verses with `Lord` (Adonai / Master).
- **Canonical `{chapter:verse}` Delimiters**: Standardized `{c:v}` across UI inspectors and headers, preventing collision with the 247 verses containing internal scripture parentheses `(...)`.
- **Permanent KJV Legend Bar**: Added interactive typography guide to `interact.html`.
- **Master README Chapter**: Codified *"The Textual Foundation: Typed by Hand for the Glory of God"* into project documentation.
- **Regression Test REG-08**: Automated Playwright test verifying KJV language integrity and typography in `tests/interact.spec.ts`.

## [1.1.0] - 2026-10-14

### Added
- **Three.js 3D WebGL Spatial Loom Engine** (`src/engine/threeVisualizer.ts`) with orbital camera, 3D quadratic Bézier arc splines, and additive blending.
- **Local-First Client Storage Engine** (`src/store/localFirstStore.ts`) leveraging browser `CacheStorage` & `IndexedDB` for 100% offline, 0ms latency scripture browsing.
- **Web Audio Harmonic Acoustic Engine** (`src/audio/acousticEngine.ts`) strictly tuned to Boarderless harmonic series ($G_3 = 196\text{ Hz}$) with stereo positioning.
- **Audited Theological Relation Inspector** (`src/main.ts` & `interact.html`) with plain-English rationales, classification badges, and verified `Bible.pdf` page citations.
- **Dedicated Interactive Gateway** (`interact.html` -> `/Interact`) featuring the "Enter the Scripture Tapestry" onboarding modal with 4 curated journeys.
- **Hitchcock Bible Names Dictionary & Identity Disambiguation** (`public/data/hitchcock_names.json`, `public/data/name_identities_audit.json`).
- Expanded Playwright regression test suite (`tests/interact.spec.ts`, 8 tests passing).

## [1.0.0] - 2026-10-14

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
