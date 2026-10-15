# Changelog — HistoricalBible.com

All notable changes to this project will be documented in this file.

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
