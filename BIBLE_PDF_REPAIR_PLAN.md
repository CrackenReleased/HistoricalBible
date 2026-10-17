# Bible.pdf Integrity and Divine-Name Small-Caps Restoration Plan

**Class:** FIXED REFERENCE PLAN / PROPOSED ACCEPTANCE CRITERIA, NOT A WORKING DOCUMENT  
**Snapshot date:** 2026-10-15  
**Status:** Proposal only; none of the investigation or repair steps in this plan is claimed completed.  
**Scope:** Proposed method to verify the owner's hand-typed KJV PDF for verse integrity, numbering, wording, and divine-name typography.

**Document freeze:** This file is **NOT** a living work plan, execution checklist, issue tracker, progress log, handoff, status report, correction register, or place for ongoing findings. **Do not edit it, tick off tasks, add results, append progress, or sync it during an audit or repair.** Once the owner authorizes separate work, create **separately scoped work products** and record findings in those files, never in this plan or in the governing `AGENTS.md` and `principles.md`. This document records a proposed method and historical source observations as of its snapshot date.

**Authorization boundary:** **REFERENCE ONLY.** Reading, installing, or approving this document's wording does **not** approve the performance of any described step. No one may edit, replace, delete, commit, upload, publish, deploy, or overwrite `Bible.pdf` or its derivatives unless the owner **separately and explicitly authorizes the specific work and destination**. The original file must remain unchanged absent distinct permission.

## Executive finding: the known problem is not an unexplained count

The existing repository report [`Bible-network-audit.md`](https://github.com/CrackenReleased/HistoricalBible/blob/master/Bible-network-audit.md), written 2026-10-15, states that a **31,102-ID imported KJV dataset** was compared with **31,102 distinct verse IDs extracted from the owner's `Bible.pdf`**. Four specific concluding verses are absent from that PDF according to the report's visual spot checks:

| Verse absent from audited PDF | Preceding verse visible | Physical PDF page | Printed page |
| --- | --- | ---: | ---: |
| Philippians 4:23 | Philippians 4:22 | 1097 | 1095 |
| 1 Thessalonians 5:28 | 1 Thessalonians 5:27 | 1104 | 1102 |
| Hebrews 13:25 | Hebrews 13:24 | 1127 | 1125 |
| Revelation 22:21 | Revelation 22:20 | 1162 | 1160 |

**Status: identified by the existing audit, not independently confirmed against rendered PDF pages in this session.** Do not silently add text from the assistant's memory or from arbitrary online JSON. The owner must approve the actual text and formatting restored to a new working copy, using a trustworthy KJV print witness.

The same audit reports these distinct issues:

1. **15 duplicate verse tags** on rendered PDF pages: Exodus 16:1 and 16:2 on physical page 70; 2 John 1:1 through 1:13 on physical page 1143. These are reported as *visible duplicated printing*, not merely a duplicated extraction record. Recheck the pages before repair.
2. **784 token-sequence differences** between PDF extraction and the imported source. Some are real editorial or spelling differences, and some demonstrably are PDF-extraction artifacts (e.g., `thy` extracted as `th y` in Genesis 16:6). The count is a **review queue, not a count of proven transcription errors**.
3. **15,682 formatting/typography/bracketing comparisons** have equal case-folded ordered word tokens but differ in visible presentation, including intentional supplied-word notation. These are not automatically mistakes and must **not** be wholesale normalized.
4. **13 extracted page-heading fragments** occur inside verse text, including Esther 9:22. Verify whether they are a glyph-layout/extraction issue or genuinely contaminate selectable text; separate display-layout repair from Scripture-character repair.
5. The audit reports **31,102 tagged instances, 31,102 unique identifiers, and 15 duplicate tags**. Because those three statements cannot straightforwardly describe the same unfiltered occurrence count, ask the local audit tool to separately report **raw tag occurrences**, **unique canonical keys**, **duplicates beyond the first occurrence**, and **excluded or de-duplicated rows**. Resolve this reporting ambiguity before accepting totals.
6. **`3John.1.15`** appears in an *outside cross-reference dataset* as an alternate-versification endpoint. Treat this as a mapping problem, **not a fifth omitted verse from the adopted KJV 31,102-verse count**. The project must explicitly declare which KJV numbering convention it is implementing and prevent orphaned references.
7. **Source-of-truth conflict:** [`scripts/fetch-kjv-text.py`](https://github.com/CrackenReleased/HistoricalBible/blob/master/scripts/fetch-kjv-text.py) is written to download `https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json`; meanwhile README/HANDOFF describe the site's text as ingested from the owner's hand-typed PDF. Do not certify the live JSON as PDF-derived until the exact build path and each artifact's provenance are demonstrated.

### Verified evidence scope

- The items above were read from repository documents and code, not from a completed, independent re-rendering of all PDF pages.
- The repository's audit identifies the compared PDF SHA-256 as:

```text
350c32f5e611917ef3d58942dc50802cc9c9119904b6094c37ebb3e07afc9aad
```

- The **full KJV corpus has not been independently proved correct here**. No new PDF was made, no source text was repaired, and no remote or local project data was edited.

## Step 0. Obtain explicit permission and protect the original

**Gate:** Owner approves the *specific* audit and a separate local scratch/output destination; this document itself is **not approval**.

1. Record the location, file size, creation details, page count, and SHA-256 of the current `Bible.pdf`. On Windows:

```powershell
Get-FileHash "E:\HistoricalBible\Bible.pdf" -Algorithm SHA256
```

2. Compare against the audit SHA above. If the hash differs, label the audit **historical**, retain both versions, and rerun from the new source; do not silently reuse old findings.
3. Take two immutable copies of the original, one securely backed up, and make all candidate changes only in a distinct versioned working directory, for example `Bible_Proof_vNext/` **if the owner authorizes that workspace**.
4. Define a single selected, identifiable KJV printed edition or equally trustworthy owner-approved textual witness to adjudicate hard cases. Record title, printing, publisher/year where available, page/verse citations, and the rules for variant punctuation/spelling/formatting.
5. **Do not call the imported JSON the authority** merely because it contains 31,102 keys. It is an important comparison target, not a self-certifying original.

**Output if authorized:** `audit/source_manifest.json` containing hashes, versions, verified reference text, and an explicit authority decision.

## Step 1. Reconcile the canonical verse inventory and numbering

**Goal:** Exactly **66 books, 1,189 chapters, and 31,102 unique KJV verse identifiers** under the selected KJV versification, with no unknown, missing, duplicate, or out-of-order identifiers.

1. Parse markers of the form `{chapter:verse}` **only inside a known book context**. Do not infer canonical verse boundaries from parentheses or from a simple regex without page/book boundaries.
2. Construct a **book → chapter → expected verse sequence** manifest from the owner-approved KJV witness; independently validate counts against a second vetted source. Preserve source-version identifiers.
3. Extract from PDF two different views: (a) raw token/verse-tag occurrences in document order, including repeats; (b) normalized unique book/chapter/verse keys. Flag missing, extra, duplicate, out-of-order, malformed, or non-monotonic tags. Never silently de-duplicate.
4. Create one issue per confirmed missing/duplicate/invalid key, beginning with the four named omissions and the 15 duplicate-tag reports. Inspect the actual rendered page, not just its extracted text.
5. **3 John**: adopt one canonical verse numbering convention for the project; retain incoming cross-reference numbering as source metadata and build an explicit, reviewed mapping rather than manufacturing `3 John 1:15` as Scripture or discarding an entire link.
6. Check every book boundary, chapter transition, chapter-ending verse, front matter, footnote, accidental page-number, and last verse of every book; generate full frequency tables of verse tags.

**Acceptance:** `31,102 expected = 31,102 unique in the candidate source`; `missing=0`; `unexpected=0`; `duplicate tag occurrences=0`; `out_of_order=0`; `unmapped_external_verse=0` **for the adopted canonical set**. Keep external alternate references in a separately tested mapping table.

## Step 2. Repair *only confirmed* omissions and duplicates in a new candidate

**Gate:** Owner approves exact corrections with before/after pages and KJV-witness citations.

- For each of the four omitted verses, restore only the correct owner-approved KJV wording, supplied-word typography, final punctuation, and verse marker to the corresponding book's final chapter. Keep surrounding verse text identical unless another separately logged defect is confirmed.
- For Exodus 16:1–2 and 2 John 1:1–13, remove **only the duplicate printed occurrences** in the **working candidate**, leaving exactly one complete canonical occurrence per verse and preserving page flow.
- Check pagination, chapter headings, book headings, table of contents, line wrapping, and cross-references after every repair. Page numbers will move when text reflows; old “physical page” references must not be silently reused against a new PDF.
- Do not use a PDF overlay to **visually hide** duplicate text while leaving duplicate text in extraction/search. Prefer repairing the editable source/master and generating a new PDF. If the original editable source is unavailable, create a versioned structured master from proofed text with owner-approved typography; do not destructively patch the original binary.
- Preserve a human-readable change manifest: `reference`, `original_hash`, `old_page`, `before_excerpt`, `after_excerpt`, `reason`, `witness`, `reviewer`, `approval`, `candidate_hash`.

**Acceptance:** Every change maps to a reviewed issue; every corrected verse appears once, in the right order, **visibly and in text extraction**; all unaffected verses remain unchanged under the appropriate exact-text comparison.

## Step 3. Adjudicate all wording and formatting flags

**Gate:** Owner-approved source and approved working copy.

1. Triage 784 word-token flags into: actual text divergence; original printing preference; old-English spelling/hyphenation differences; joined/split PDF glyphs; editorial-added bracket treatment; wrong verse association; or undecidable without human review.
2. For every **material wording change**, inspect the page image, the selected KJV print witness, and the surrounding verse before proposing a correction. A PDF parser's “difference” is not evidence that the PDF author typed the wrong word.
3. For the 15,682 equal-token but different-format cases, do not manually review every ordinary whitespace difference unless a reliable rule flags risk. Instead run **exhaustive machine checks** of bracket structure/position, supplied-word typography, capital letters, punctuation deltas, and text round-trip, followed by **targeted page-image review** of all risky cases and statistically selected controls. Preserve intentional bracket indicators.
4. For 13 page-heading contaminations, determine whether the **visible printed page** contains the heading inside a verse or text extraction merely misorders normal page furniture. Fix only the identified layer (layout versus extraction) and verify both rendering and text selection afterward.
5. Produce a full discrepancy register with classification and a specific resolution for each item. No “784 reviewed” claim until all 784 have a recorded decision; no blanket script-based approval.

**Acceptance:** Zero unreviewed material word-token flags; zero unexplained inserted/deleted Scripture words; no misplaced bracket delimiters, page headers, chapter transitions, or verse merges; complete change log. A uniform-looking PDF is **not** sufficient.

## Step 4. Audit and restore `LORD` small caps: typography and meaning

**The exact requirement:** Preserve the King James typographic convention when the printed witness uses it: a **full-sized capital `L` followed by smaller-height capitals `ORD`**, representing the name rendered as `LORD` (typically corresponding to the Hebrew divine name YHWH). In many settings the printed form is better approximated visually as **Lᴏʀᴅ** than as four large equal-height letters. The text remains `LORD` for search, copy, and canonical comparison.

**Critical distinctions:** Do **not** change ordinary `Lord` to `LORD` merely because the referent is God. In many KJV settings **`GOD`** in `Lord GOD` also represents the divine name and can carry small-cap significance; ordinary `God` is different. Special English name renderings such as `JEHOVAH` (e.g., Psalm 83:18) and `JAH` (Psalm 68:4) need separate review, not automatic conversion into `LORD`. Capitals used in titles, running headers, abbreviations, or citations are not proof of a divine-name token.

### The audit must test TWO separate properties

**A. Semantic/text fidelity:** What word occurs at each reference? `LORD`, `Lord`, `GOD`, `God`, `JEHOVAH`, `JAH`, etc., including punctuation and possessives; is the biblical reading correct?

**B. Typography fidelity:** Do the PDF's **actual drawn glyphs** show the expected small capitals, at the correct relative sizes? A PDF text extractor returning `LORD` cannot answer this question; a font face, character bounding boxes, and rendered image must be examined. Likewise a Unicode visual example is not evidence that the stored canonical letters have been preserved.

### Exhaustive procedure

1. Search all 66 books for case-sensitive, token-boundary candidates: `LORD`, `Lord`, `GOD`, `God`, `JEHOVAH`, `JAH`, and compounds/possessives as necessary. Record **occurrence counts** separately from **verses containing occurrences**; one verse may contain several. Existing README counts (such as “5,556 verses containing `LORD`”) cannot be reused as glyph-occurrence totals without checking.
2. For every candidate, retain book/chapter/verse, instance number within verse, phrase context, physical PDF page, glyph bounding box, font name, character sizes/heights, extraction result, and selected print-witness expectation.
3. Compare each rendered instance with expected **large initial + smaller caps** where appropriate. Use typography/layout extraction (e.g. PDF character sizes) **plus visual rendering**; PDFs may use special small-cap fonts or outline glyphs whose sizes cannot be inferred from plain text. A machine can flag candidates; human/visual approval adjudicates uncertain cases.
4. Include high-priority proof pages: Genesis 2:4, Exodus 3:15, Psalm 23:1, Psalm 83:18 (`JEHOVAH`), Psalm 68:4 (`JAH`), and a verified `Lord GOD` example. Review contexts where the same verse contains `Lord` and `LORD` or other contrasting forms.
5. Detect **false positives** (`Lord` incorrectly made small caps), **false negatives** (`LORD` rendered as uniform large caps when the chosen style requires small caps), **case corruption** (`Lord` mechanically converted to `LORD`), and **export corruption** (copy/paste yields odd Unicode or loses spaces).
6. In the editable master (once authorized), implement style semantically rather than rewriting the Bible's letters. For example, retain underlying string `LORD`, then render `L` at normal cap height and `ORD` at a smaller height using deliberate typography. Verify the actual typeface's small-cap metrics against printed proofs. Do not create a `Lᴏʀᴅ` Unicode replacement in the canonical text store.
7. Generate an image/contact-sheet proof for each flagged case, review all anomalies and a documented sample of passes, and include a chapter-indexed manifest so the owner can see **every candidate occurrence and result**, not just a summary percentage.

Suggested `divine_name_smallcaps_audit.csv` columns:

```text
book,chapter,verse,occurrence_index,token,context,pdf_page,
bbox,fontname,glyph_height_ratio,expected_style,observed_style,
status,reason,source_witness,reviewer,approval,source_hash
```

**Acceptance:** Every case-sensitive candidate has a traceable status, all expected small-cap sites have visually verified glyph styling, there are **zero unresolved high-risk mismatches**, no `Lord`→`LORD` semantic changes, and plain-text search/copy returns the correct canonical letters. Test printed PDF and website rendering separately.

## Step 5. Make the corpus reproducible and protect derived datasets

1. Establish **one owner-approved canonical structured text master** (e.g. a versioned, losslessly normalized verse table with explicit supplied-word and divine-name metadata) from the proofed material. The actual PDF remains a **faithful, versioned output**, not an opaque sole source for future editing.
2. Trace `Bible.pdf` → canonical structured master → website KJV JSON → rendered site, or define and document the corrected actual direction of the pipeline. Record hashes at every stage. Investigate the third-party downloader's historical/current role; **do not replace a live pipeline in this planning step**.
3. Add two independent validators: a **structural** validator (book/chapter/verse keys, duplicates, order, missing) and a **text/format** validator (words, punctuation, editorial brackets, small caps, PDF glyphs, copy/paste extraction). Validate the website against the approved master, not by comparison to itself.
4. Keep KJV text separate from external cross-reference records, names, lexicons, speculative correlations, and AI interpretation. Cross-reference ingestion must map alternate versification explicitly and never append invented text.
5. Store tool versions, test commands, source hashes, repeatable fixtures, a failure summary, and screenshots of risky pages. No “100% verified” release statement unless the **defined acceptance tests** actually pass.

## Step 6. Owner review, human proofing, and controlled release

**Two stages, both separately authorized:**

- **Candidate acceptance:** supply original-versus-candidate manifests, exact verse repairs, duplicate removals, a decision for every high-risk token discrepancy, small-caps manifest, and visual comparisons. Owner reviews and approves the candidate. Keep original untouched.
- **Publishing approval:** only after a separate **explicit instruction** should an agent overwrite/replace a public downloadable PDF, generated KJV JSON, site content, GitHub branch, or production deployment. An approved candidate is **not** a deployment authorization.

### Static acceptance criteria (not a checklist to update here)

The following statements describe the **evidence a separately authorized future work product would need to demonstrate**; none is asserted complete by this plan:

- The original and reference witnesses are identified and hashed.
- The approved KJV inventory contains 66 books, 1,189 chapters, and **31,102** correctly ordered unique canonical verse IDs.
- There are no missing, duplicated, malformed, out-of-order, or unexpectedly renumbered canonical identifiers.
- The four historically reported end-verse omissions and fifteen historical duplicate-tag alerts are individually adjudicated in **that future audit's** separate records.
- All **784 historically flagged word-token comparisons** are individually classified and, as authorized, corrected or justified outside this document.
- Thirteen reported page-heading alerts are adjudicated at the proper rendering/extraction layer.
- Translator-supplied-word markers and typography are accurately preserved.
- Every divine-name candidate is inventoried, expected `LORD`/`GOD` small-cap distinctions visually verified, and canonical letters unchanged.
- External 3 John alternate-versification references are mapped without fabricating Scripture.
- Derived datasets have reproducible provenance, and human reviewers verify material changes.
- Automated tests and relevant visible-page proofing pass against the approved witness.
- The owner separately authorizes each consequential artifact change and any publication or deployment.

## Examples of separate work artifacts (not created or automatically authorized by this plan)

These are proposed work products, not files already generated:

- `audit/source_manifest.json`
- `audit/verse_inventory.csv`
- `audit/verse_anomalies.csv`
- `audit/wording_review.csv`
- `audit/divine_name_smallcaps_audit.csv`
- `audit/pdf_render_proofs/`
- `audit/correction_manifest.md`
- `audit/release_verification_report.md`
- `Bible_proofed_candidate_vNext.pdf` (only after explicit authorization)

**Do not put future work records into this frozen plan, `AGENTS.md`, `principles.md`, or the frozen conversation retrospective.** Findings belong in a new, distinctly named audit record or authorized what/why, handoff, and error log, with permission before writing to any of them.

---

**Owner decision required before execution:** Authorize a **read-only source audit** against a specified PDF and KJV reference witness; decide later, on seeing its detailed findings, whether to authorize creation of a corrected **candidate copy**. A further explicit approval would be required for any installation or deployment.
