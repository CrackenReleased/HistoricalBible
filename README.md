# HistoricalBible.com — Interactive Cross-Reference Tapestry

> **31,102 Verses. 343,570 Scriptural Connections. Zero Fillers. The Word of God interpreting the Word of God.**

An ultra-responsive, zero-backend-lag procedural visualization engine exploring cross-references across all 66 books and 1,189 chapters of the Holy Bible (King James Version).

---

## 🏛 Legal & Licensing Architecture

1. **Procedural Geometry (17 U.S.C. § 102(b)):**
   Under U.S. copyright law, an idea, mathematical procedure, system, or arc diagram connecting coordinates along an axis cannot be copyrighted. All arcs, bars, and Bézier curves are computed and rendered dynamically via HTML5 Canvas in user space.
2. **Cross-Reference Dataset (Public Domain + CC BY 4.0):**
   Biblical cross-references originate from R.A. Torrey's *Treasury of Scripture Knowledge* (Public Domain). The expanded digital dataset curated by Stephen Smith at [OpenBible.info](https://www.openbible.info/labs/cross-references/) is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**, permitting both non-commercial and commercial interactive applications with attribution.
3. **Scripture Text (Public Domain):**
   The King James Version (KJV) text is in the Public Domain.
4. **Artwork Reference:**
   Static raster files from Dr. Chris Harrison (`BibleVizArc7WiderOTNT.png`, `BibleNetwork.jpg`) are strictly personal-use artifacts and are **not** distributed or hosted in this application.

---

## 🚀 Quick Start

### 1. Ingest Data
```bash
# Ingest OpenBible.info cross-reference dataset (downloads ~2MB zip -> outputs ~343k links)
python scripts/build-crossref-data.py

# Ingest and index all 31,102 KJV verses across 1,189 chapters
python scripts/fetch-kjv-text.py
```

### 2. Run Local Development Server
```bash
# Start Vite or any static HTTP server
npx vite
# Or simply open index.html directly in any modern browser!
```

### 3. Run Automated Regression Suite
```bash
npx playwright test tests/bibleviz.spec.ts
```

---

## 🎨 Visualization Features

* **Arcs View (Macro Tapestry):**
  * 1,189 vertical chapter histogram bars along the baseline (with Genesis and Matthew in white, alternating gray book bands, and Psalm 119 extending furthest at 176 verses).
  * 10 Canonical Division Colors (Law, History, Poetry, Major Prophets, Minor Prophets, Gospels, Acts, Pauline Epistles, General Epistles, Revelation).
  * Mode switch between **Canonical Divisions** and **Chapter Distance Rainbow**.
  * Smooth pan & zoom with chapter-level click isolation.
* **Threads View (Chapter Study):**
  * Left pane: Full chapter reader with KJV serif typography and cross-reference badges.
  * Center spine: 66-book canon loom with dynamic Bézier threads connecting active verses to target books.
  * Right inspector: Selected verse, cross-reference distribution bar, and inline target scripture cards with 1-click pivot navigation.

---

## 📜 Attribution

Cross-reference dataset provided by [OpenBible.info](https://www.openbible.info/labs/cross-references/) (CC BY 4.0), derived from the Public Domain *Treasury of Scripture Knowledge*. Visualization concept inspired by Chris Harrison & Christoph Römhild. Scripture text: King James Version (Public Domain).
