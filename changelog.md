# Changelog — HistoricalBible.com

All notable changes to this project will be documented in this file.

## Obsidian Bible Network [0.01.00] - 2026-10-14

- Added native Obsidian Bible notes: complete KJV, names co-occurrence network, book indexes, and all 344,799 OpenBible cross-reference records with full target ranges and votes.
- Added dependency-free export/validation tools under E:\AI_Hub\Tools\bible-network, source attribution, regeneration rules, and five unit tests.
- Preserved the app's independent version and existing data; Obsidian export has its own v0.01.00 sequence.
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
