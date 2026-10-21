# HistoricalBible — Scripture in World History

Historical Bible helps readers ask: **What else was happening in the world during the events of the Bible?** Our focus is connecting biblical people, places and events with the kingdoms, cultures and historical records of their time. Cross-references support that study alongside timelines and maps.

Our cross-reference records come from [OpenBible.info](https://www.openbible.info/labs/cross-references/) by Stephen Smith, drawing primarily from the *Treasury of Scripture Knowledge* (CC BY 4.0 for the OpenBible dataset). [Biblical Connections](https://biblicalconnections.org/) is a related project exploring links within Scripture; its [source statement](https://biblicalconnections.org/about/) credits the same OpenBible dataset. The repository’s importer and snapshot metadata identify OpenBible as our data source. This acknowledgement recognizes shared work without claiming Biblical Connections supplied our dataset or endorses this project.

## Project governance — v1.0 adopted 2026-10-15

The owner selected these documents as the guiding foundations for HistoricalBible on 2026-10-15:

- [principles.md](./principles.md): foundational doctrinal charter, Scripture-first interpretation, source preservation, and evidence boundaries.
- [AGENTS.md](./AGENTS.md): operating contract for agents and contributors across this project. Read both before work.

These root files are the canonical project copies. Their original proposed-status headers are preserved verbatim from the supplied documents; this dated record confirms owner adoption. Downloads are retained as the original delivery, not a second working source. Both foundations stay stable during ordinary work; amendments require explicit owner authorization.

Before code work, also read the cross-project operating rules at E:\AI_Hub\AGENTS.md. Existing README sections, historical handoffs, and logs describe prior work and do not override these foundations or authorize future actions. Routine work belongs in HANDOFF.md, what_and_how_log.md, and error_corrections_log.md as appropriate.

AGENTS.md references a separately supplied BIBLE_PDF_REPAIR_PLAN.md. That plan remains in the original Downloads folder and was not installed or executed in this governance-only task. The existing [Bible-network-audit.md](./Bible-network-audit.md) is a historical report; its findings have not been reverified here. PDF or corpus repair requires a separately scoped request.


## Interact & Study Desk Suite — v00.01.31

Run `npm run dev` from this project, then open [Interact locally](http://localhost:5173/interact.html). Opening the source HTML from disk cannot run the data-backed reader. `/interact`, `/interact/`, and `/interact.html` lead to the same experience.

Begin with the Jesus/Pilate discovery, compare the Scripture and historical record, and choose a next question. The exploration trail returns to earlier discoveries. The wider study holds people/empire browsing, Scripture search, connected passages, and the names dictionary. There are currently 12 curated historical profiles; a name dictionary entry does not imply a full historical profile.

Editorial routes live in `src/discoveries.ts`; Scripture comes from the existing local corpus. Featured museum links and evidence-scope notes distinguish surviving records from interpretation. The wider inherited historical commentary has not been comprehensively audited as part of the redesign. The local Pilate inscription photograph is by Gary Todd, CC0, with its [source and license](https://commons.wikimedia.org/wiki/File:Limestone_Inscription_with_Name_of_Pontius_Pilate,_Caesarea,_26-36_AD_(42500903014).jpg) also credited in the reader.

Verification: `npm run test:selfcheck`, `npm run test:collection`, `npx playwright test`, and `npm run build`. Earlier tapestry visualization remains available at `/tapestry.html`.

> *"For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart."*  
> — **Hebrews 4:12**

---

## 🌐 The Living Word: Verified Local-First Study Collection

The Bible is not an ordinary book; it is a divine library of **66 books**, penned across **1,500 years** by more than **40 distinct authors** across three continents, united by a single Divine Author.

```
       31,102 Verses  ·  1,189 Chapters  ·  66 Canonical Books
      344,799 Scriptural Cross-References  ·  2,453 Reviewed Biblical Names
         12,323 Name Co-Occurrence Edges  ·  20 Archaeological Inscriptions
         100% Local-First  ·  CacheStorage Backed  ·  Automated Self-Checks
```

---

## ⚡ Architecture: Local-First & Zero-Backend Lag

* **Zero Server Round-Trips:** HistoricalBible loads and caches the canonical KJV corpus (`kjv_verses.json`), cross-reference bundle (`cross_references_bundle.json`), reviewed biblical name index (`bible_network.json` + `name_audit.json`), Strong's lexicon (`strongs_reverse.json`), and historical synchrony model (`historical_synchrony.v1.json`) directly in the browser via **`CacheStorage`** (`localFirstStore.ts`).
* **Strict Separation of Evidence:** Every historical claim and companion panel explicitly distinguishes between **Biblical Text (KJV)**, **Direct Archaeological / Inscriptional Attestation**, **Chronological Reconstruction**, **Scholarly / Chronological Debate**, and **Theological / Covenant Summary**.
* **Zero Tracking & Full Privacy:** Scripture reading, word studies, and historical investigations run locally in the browser.

---

## 📜 The Textual Foundation: Preserving the KJV

HistoricalBible presents the King James Version through its downloadable PDF (`Bible.pdf`) and interactive reader (`/bible`). The project preserves three textual distinctions enforced by automated self-checks:

### 1. Preserving "What Was Added" — Translator Italics in Brackets `[...]`
In the King James Version (1611), the translators italicized English words supplied for English grammar and readability (e.g., `[them,]`, `[is]`, `[was]`, `[are]`). Across **14,138 verses** (`21,499` balanced bracket spans), HistoricalBible preserves these additions explicitly with brackets `[...]`, verified against the italic font runs of `Bible.pdf` and rendered in distinguished italics with scholarly tooltips.

### 2. The Divine Name: The Covenant Distinction Between `LORD` and `Lord`
* **`LORD` (rendered in small caps)** translates the Tetragrammaton **יהוה** (*Yahweh* / *Jehovah*)—the covenant-keeping God of Israel (Exodus 3:14), preserved across **5,556 verses**.
* **`Lord` (capital L, lowercase ord)** translates **אֲדֹנָי** (*Adonai*) or **κύριος** (*Kyrios*).

### 3. Unbreakable Verse Delimiters: Braces `{chapter:verse}` vs. Scriptural Parentheses `(...)`
Because the King James Bible contains internal scriptural parentheses `(...)` (e.g., Genesis 10:14, Romans 5:13–17), HistoricalBible uses the **`{chapter:verse}`** brace standard (e.g., `{18:1}`, `{18:2}`) so verse markers never collide with punctuation inside the biblical text.

---

## 🏛️ Core Pages & Engines

### 1. Front Door (`/index.html`)
* Introduces the four-stop centuries thread (Abraham, David, Daniel, Jesus Christ), three curiosity doors into `/interact`, mission statement, KJV notation footnote, and printable PDF access.

### 2. Split-Screen KJV Bible Reader (`/bible` · `src/bibleReader.ts`)
* **66-Book & 1,189-Chapter Reader:** Supports sorting books by Canonical Order (`1..66`), Event Chronology (`1..66`), or Composition Chronology (`1..66`), with granular chapter-level historical dates (`src/data/bibleChronology.ts`).
* **4-Tab Study Companion:**
  1. **Chronology:** Displays Happened vs. Written dates, chapter breakdown, contemporary empires, and explicit `Chronological Reconstruction` evidence-class disclosure.
  2. **Map:** Side-by-side Leaflet geographical companion (`src/engine/ancientMap.ts`) synchronized to the active book/chapter era and clickable geographical terms in the KJV text.
  3. **Word Inspector:** Whole-word KJV concordance (`localStore.searchWholeWord`), Strong's Hebrew/Greek root lookup (`src/data/scriptureLexicon.ts`), Websters 1828 & Free Dictionary definitions, and reviewed name studies.
  4. **Passage & X-Refs:** Bidirectional Treasury of Scripture Knowledge cross-references with inline KJV text previews.

### 3. Biblical World Map & Archaeological Atlas (`/map` · `src/atlasApp.ts`)
* **Interactive Geodetic Map (`src/engine/ancientMap.ts`):** Renders 10 chronological eras, 19 imperial/kingdom territories, 14 physical archaeological discovery pins, 33 biblical cities with Hitchcock meanings, 3 major journeys (Abraham, Exodus, Paul), and biblical waterways (`WATER_FEATURES` seas and rivers) with offline tile fallback.

### 4. Interactive Historical Study Desk (`/interact` · `src/main.ts`)
* **Dual-Stream Historical Synchrony:** Connects 12 curated biblical figures with contemporary world empires and surviving inscriptions.
* **Collection Explorer (`src/collectionExplorer.ts`):** Browses all 66 books, 344,799 cross-reference source records (including ranges and vote metadata), 2,453 reviewed biblical names, and 12,323 shared-verse name connections.
* **2D Canvas Ego-Graph (`src/engine/egoGraph.ts`):** Interactive 1-hop and 2-hop radial neighborhood graph for biblical figures and names.

### 5. Standalone 2D Cross-Reference Tapestry (`/tapestry.html`)
* **1,189-Chapter Baseline Histogram & Arc Loom:** Renders canonical division arcs and chapter-to-chapter S-curve threads backed by `/data/kjv_verses.json` and `/data/cross_references_bundle.json`.

---

## 🛡️ Data Integrity & Automated Self-Checks

The default suite includes all Node data regressions, portable Python importer units,
and browser tests. Use Node 24 (verified here with 24.20.0);
Python 3.10+ and Google Chrome are required. Browser runs start Vite on port 5173.
Use a free port before CI runs; local runs can reuse an existing development server.

```bash
npm ci
npm test                     # Data + Python units + all browser tests
npm run test:data            # All *-regression.ts files and data-integrity-selfcheck.ts
npm run test:browser         # Playwright only; accepts file names / --grep
npm run test:python:unit     # Importer tests without PDF dependencies or local vault
npm run test:selfcheck       # Focused cross-dataset checks
npm run test:collection      # Compatibility alias for the complete data suite
npm run build               # Canonical KJV verification + production bundle
```

The complete local acceptance suite also checks historical PDF/DOCX proofs and the
original Obsidian export. These are retained regression fixtures, not obsolete tests.
They require `TacticalCastle/HistoricalBible/Bible.docx`, `pdf-proof/v0.2.0/`
(the DOCX and PDF), `pdf-proof/v0.3.3/Bible-proof-v0.3.3.pdf`, and the existing
`E:/AI_Hub/Vault/Bible` and `E:/AI_Hub/Tools/bible-network/sources/cross-references.zip`.
Missing fixtures or dependencies fail explicitly; they are never silently skipped.
Intermediate v0.3.0–v0.3.2 proofs are checked when present, otherwise the tests use
the retained v0.3.3 proof. Canonical `Bible.pdf` remains read-only.

```powershell
python -m venv .venv-tests
.\.venv-tests\Scripts\python.exe -m pip install -r requirements-test.txt
# Activate the environment so npm's Python commands use the same interpreter.
.\.venv-tests\Scripts\Activate.ps1
npm run test:all              # Default suite + every Python acceptance test
npm run test:python           # Python acceptance tests alone
```

On macOS/Linux, activate with `source .venv-tests/bin/activate`. The dependency pins
were verified on Python 3.12. Proof comparisons share a read-only cache keyed by file
path, size and modification time, avoiding repeated full-document extraction when
historical stages resolve to the same fixtures. Feature-specific typography,
accessibility, bookmarks, navigation and pixel checks remain separate.

Playwright saves screenshots and traces **on failure** in `test-results/`; routine
success screenshots were not visual assertions. Existing layout/overflow assertions
remain active. `scripts/audit-water-crossings.ts` is an optional manual geometry
diagnostic, not an automated test. Atlas reachability is asserted by
`tests/atlas-coverage-regression.ts` and the live menu browser tests.

---

## 📜 Legal & Licensing Clearance

1. **Mathematical & Procedural Geometry (17 U.S.C. § 102(b)):** All arcs, histogram bars, and network graphs are generated procedurally via HTML5 Canvas and SVG.
2. **Cross-Reference Dataset (Public Domain + CC BY 4.0):** Originating from R.A. Torrey's *Treasury of Scripture Knowledge* (Public Domain) and curated by [OpenBible.info](https://www.openbible.info/labs/cross-references/) under **CC BY 4.0**.
3. **Biblical Names & Lexical Resources:** *Hitchcock's Bible Names Dictionary* (Public Domain), Strong's Hebrew and Greek Dictionaries (Public Domain), and audited name reviews in `public/data/name_audit.json`.
4. **Scripture Text:** The King James Version (KJV) text is in the Public Domain.

> *"The grass withereth, the flower fadeth: but the word of our God shall stand for ever."*  
> — **Isaiah 40:8**

