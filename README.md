# HistoricalBible — The Interactive Scripture Tapestry

> *"For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart."*  
> — **Hebrews 4:12**

---

## 🕊️ Dedication: For the Reward of His Suffering

This work is dedicated solely to the Glory of Almighty God and as an offering of gratitude for the suffering, sacrifice, and physical, historical resurrection of Jesus Christ. 

Christ lived a literal, historical, physical life upon this earth. In His flesh, He inarguably fulfilled over **300 specific prophecies** spoken hundreds and thousands of years prior through the prophets of the Old Testament. He endured physical torture and a roman crucifixion that birthed the very word *excruciating* (*ex cruce* — "out of the cross") to purchase the redemption of mankind.

Every line of code, every mathematical coordinate, and every Bézier arc in this repository is written with absolute intentionality and diligent might. This is not a transient technical curiosity, nor a commercial venture, nor a project bounded by any local town, county, or nation.

Annually, over 200 people download the authoritative text from [`HistoricalBible.com/bible`](https://historicalbible.com/bible) — many of them secretly residing in closed countries where the physical possession of a Bible carries the penalty of imprisonment or death. This project exists for them. It exists for the globe. It exists so that anyone, on any device, under any bandwidth constraint or hostile network environment, can receive, navigate, and study the living, interconnected Word of God with dignity, speed, and reverent beauty.

---

## 🌐 The Living Word: 344,799 Interconnected Threads

The Bible is not an ordinary book; it is a divine library of **66 books**, penned across **1,500 years** by more than **40 distinct authors** across three continents, united by a single Divine Author. It is the world’s first and greatest hyperlinked text.

```
       31,102 Verses  ·  1,189 Chapters  ·  66 Canonical Books
      344,799 Scriptural Cross-References  ·  2,619 Historical Names
         100% Local-First  ·  0ms Latency  ·  Full Offline Capability
```

---

## ⚡ Architecture: Local-First & Zero-Backend Lag

Built using the proven local-first engineering philosophy developed in `boarderless`:
* **Zero Server Round-Trips:** Most modern Bible applications rely on sluggish server queries that log user activity and fail when an internet connection drops. HistoricalBible downloads and caches the entire scripture corpus, cross-reference index, entity dictionary, and theological audit directly into the user’s browser via **`CacheStorage`** and **`IndexedDB`**.
* **Client GPU & Multi-Core Acceleration:** The application utilizes the user's local hardware (NVIDIA/AMD discrete GPUs, Apple Silicon, or integrated graphics via WebGL and HTML5 Canvas) to render hundreds of thousands of arcs simultaneously at a locked **60–120 FPS**.
* **Zero Tracking & Full Privacy:** Your scripture reading, searches, and theological investigations never leave your local machine.

---

## 🏛️ Core Engines & Interfaces

### 1. Three.js 3D WebGL Spatial Loom (`/interact.html`)
* **3D Orbital Canon Ring:** Plots all 1,189 chapters of the Old and New Testaments along a 3D elliptical ribbon in space.
* **3D Quadratic Bézier Splines:** Cross-reference connections sweep between books in three dimensions with additive blending, dynamic height attenuation, and vertex color interpolation.
* **Spatial Navigation:** Full orbital camera controls with mouse/touch rotation, zoom, tilt, and continuous cosmic drift.

### 2. High-DPI 2D Canvas Tapestry (`/index.html`)
* **1,189 Chapter Baseline Histogram:** Every chapter is rendered as a vertical downward bar scaling proportionally to verse count. The anchor of the baseline is **Psalm 119**, extending 176 verses deep.
* **Dual Color Schemes:**
  * **10 Canonical Divisions:** Law (Coral Red), History (Warm Amber), Poetry & Wisdom (Molten Gold), Major Prophets (Spring Green), Minor Prophets (Teal), Gospels (Cyan), Acts (Sky Blue), Pauline Epistles (Indigo), General Epistles (Violet), and Revelation (Magenta).
  * **Canonical Distance Rainbow:** Arcs colored along a full spectrum based on the chapter distance between the source and target passage.
* **Hit Detection & Arc Isolation:** Hovering or clicking a book, chapter, or verse isolates its inbound and outbound arcs while dimming unrelated background connections.

### 3. Chapter Threads & S-Curve Loom
* **Sequential Reader:** Clean KJV serif typography with cross-reference badge counts on every verse.
* **66-Book Center Spine:** Smooth S-curve Bézier threads sweep from the verse being read directly into the target books across the canon.
* **Inline Passage Pivot:** Connected scripture passages render directly in the inspector drawer, allowing 1-click pivot exploration without losing context.

### 4. Audited Theological Relation Engine
* Features an audited evaluation of cross-reference records (classifying links as **`SUPPORTED`**, **`AMBIGUOUS`**, or **`UNSUPPORTED`**).
* Displays a **plain-English theological rationale** for why passages connect (e.g., *"Creator praised as giver of blessing"*, *"All things originate in God"*, *"Divine invitation to return and receive mercy"*).
* Cites **verifiable evidence quotes** mapped directly to printed page numbers in [`Bible.pdf`](file:///E:/HistoricalBible/Bible.pdf) (e.g., *Page 590 of Bible.pdf*).

### 5. Hitchcock Bible Names Social Network
* Maps **2,619 biblical people and places** from *Hitchcock's Bible Names Dictionary*.
* Includes etymological glosses (e.g., *David = "well-beloved"*, *Melchizedek = "king of justice"*).
* Features verified whole-name verse co-occurrences, with deep linguistic disambiguation to separate common English homonym verbs (*"Mark ye now"*) from historical personages (*Mark the evangelist*).

### 6. Boarderless Harmonic Web Audio Engine
* Rooted strictly in the **Boarderless harmonic series** ($G_3 = 196.00\text{ Hz}$).
* Canonical division overtone frequencies:
  * **Law:** $G_3 = 196.00\text{ Hz}$ (Root)
  * **History:** $B_3 = 246.94\text{ Hz}$ (Major 3rd)
  * **Poetry & Wisdom:** $D_4 = 293.66\text{ Hz}$ (Perfect 5th)
  * **Major Prophets:** $E_4 = 329.63\text{ Hz}$ (Major 6th)
  * **Minor Prophets:** $F\#_4 = 369.99\text{ Hz}$ (Major 7th)
  * **Gospels:** $G_4 = 392.00\text{ Hz}$ (Octave)
  * **Acts:** $A_4 = 440.00\text{ Hz}$ (Major 9th)
  * **Pauline Epistles:** $B_4 = 493.88\text{ Hz}$ (Major 10th)
  * **General Epistles:** $C\#_5 = 554.37\text{ Hz}$ (Augmented 11th)
  * **Revelation:** $D_5 = 587.33\text{ Hz}$ (12th / 5th above octave)
* Velocity-sensitive attack envelopes and stereo placement based on canonical position across the 1,189 chapters.

---

## 🚀 Quick Start & Development

### Prerequisites
* Node.js v18+ or v20+
* Python 3.10+ (for data compilation scripts)

### Installation
```bash
# Clone the repository
git clone https://github.com/CrackenReleased/HistoricalBible.git
cd HistoricalBible

# Install dependencies (Vite, Three.js, Playwright)
npm install
```

### Data Pipeline (Optional — Pre-compiled data is already bundled)
```bash
# Ingest OpenBible.info cross-reference dataset (344,799 links)
python scripts/build-crossref-data.py

# Ingest and index all 31,102 KJV verses across 1,189 chapters
python scripts/fetch-kjv-text.py

# Ingest Hitchcock Names Dictionary and Theological Audit batches
python scripts/build-theological-audit.py
```

### Run Local Development Server
```bash
npm run dev
```
* **Interactive 3D Loom & Journey Gateway:** Open [`http://localhost:5173/interact.html`](http://localhost:5173/interact.html)
* **2D Panoramic Tapestry & Threads Reader:** Open [`http://localhost:5173/index.html`](http://localhost:5173/index.html)

### Production Build
```bash
npm run build
```
Compiles a production-ready, tree-shaken static bundle into the `dist/` folder in < 800ms, ready to host on GitHub Pages, Vercel, Cloudflare Pages, or any static web server.

### Run Automated Regression Test Suite
```bash
npx playwright test
```
Runs the full 8-point automated test suite validating:
* `REG-01`: 17 U.S.C. § 102(b) & CC BY 4.0 Legal Compliance Guard
* `REG-02`: Canonical Invariants (1,189 chapters, Psalm 119 max spike)
* `REG-03`: Arcs vs. Threads Mode Switcher
* `REG-04`: Verse Selection & Scripture Card Pivot Navigation
* `REG-05`: Omnibox Natural Shorthand Passage Search
* `REG-06`: Local-First Telemetry & Three.js WebGL Canvas Mounting
* `REG-07`: Welcome Modal 4-Journey Guided Onboarding
* `REG-08`: Audited Theological Relations & `Bible.pdf` Page Citations

---

## 🎨 Canonical Division Color Topology

| Division | Testament | Books | Chapter Count | Color Hex | Acoustic Frequency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Law (Torah)** | Old Testament | Genesis – Deuteronomy | 187 | `#f87171` | $196.00\text{ Hz}$ ($G_3$) |
| **History** | Old Testament | Joshua – Esther | 249 | `#fb923c` | $246.94\text{ Hz}$ ($B_3$) |
| **Poetry & Wisdom** | Old Testament | Job – Song of Solomon | 243 | `#facc15` | $293.66\text{ Hz}$ ($D_4$) |
| **Major Prophets** | Old Testament | Isaiah – Daniel | 183 | `#a3e635` | $329.63\text{ Hz}$ ($E_4$) |
| **Minor Prophets** | Old Testament | Hosea – Malachi | 67 | `#2dd4bf` | $369.99\text{ Hz}$ ($F\#_4$) |
| **Gospels** | New Testament | Matthew – John | 89 | `#22d3ee` | $392.00\text{ Hz}$ ($G_4$) |
| **Acts (History)** | New Testament | Acts | 28 | `#38bdf8` | $440.00\text{ Hz}$ ($A_4$) |
| **Pauline Epistles** | New Testament | Romans – Philemon | 87 | `#818cf8` | $493.88\text{ Hz}$ ($B_4$) |
| **General Epistles** | New Testament | Hebrews – Jude | 34 | `#c084fc` | $554.37\text{ Hz}$ ($C\#_5$) |
| **Prophecy (Apocalypse)** | New Testament | Revelation | 22 | `#f472b6` | $587.33\text{ Hz}$ ($D_5$) |

---

## 📜 Legal & Licensing Clearance

1. **Mathematical & Procedural Geometry (17 U.S.C. § 102(b)):**  
   Under United States Copyright Law, an idea, procedure, system, method of operation, or mathematical arc diagram connecting coordinates along an axis cannot be copyrighted. All arcs, histogram bars, splines, and Bézier curves in this application are generated dynamically and procedurally via HTML5 Canvas and WebGL.
2. **Cross-Reference Dataset (Public Domain + CC BY 4.0):**  
   Biblical cross-references are scholarly citations originating largely from R.A. Torrey's *Treasury of Scripture Knowledge* (Public Domain). The expanded digital dataset of ~344,799 links curated by Stephen Smith at [OpenBible.info](https://www.openbible.info/labs/cross-references/) is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**. Used with credit and attribution.
3. **Biblical Names Dictionary:**  
   *Hitchcock's Bible Names Dictionary* (Public Domain), digitized and preserved under CC BY 4.0.
4. **Scripture Text:**  
   The King James Version (KJV) text is in the Public Domain.
5. **No Raster File Dependencies:**  
   This repository contains zero copyrighted raster files. All visualizations are computed mathematically from raw factual data.

---

## 🤝 Community & Stewardship

HistoricalBible is an open stewardship for the Kingdom of God. Contributions, translations, theological audits, and performance optimizations are warmly welcomed via Pull Requests and Issues.

> *"The grass withereth, the flower fadeth: but the word of our God shall stand for ever."*  
> — **Isaiah 40:8**
