# Historical evidence and discovery implementation

Status: task-specific implementation guide, 2026-10-20. This records the owner's request to document and implement the verified gaps. It does not amend `AGENTS.md` or `principles.md`, authorize publication, or override the protected KJV corpus.

**Product direction, 2026-10-21:** Read `HISTORICAL_WORLD_CONTEXT_BRIEF.md` before extending chronology, journeys, world regions, or relationship markers. The owner's aim is to place biblical events within wider world history and show time- and person-specific relationships. Archaeological synchronies remain a supporting layer, not the selection rule for which world history belongs in the app.

## Current implementation checkpoint — local v00.01.57

| Requirement | Implemented and verified | Remaining boundary |
| --- | --- | --- |
| Representative Gallio path | Interact → map → Acts 18:12, source receipt, limitation, and a separately sourced Seneca literary pivot. | Do not add Corinth bema photographs or more family links without object and media review. |
| Artifact audit | All 20 catalog entries have individual receipts in `HISTORICAL_SOURCE_REGISTER.md` and corrected public copy. Pilate, Erastus, Siloam, Merneptah, Ketef Hinnom, Sargon, Lachish, Jehoiachin, the Pool of Siloam, and Soloi were additionally reviewed after the first ten. Proposed and disputed connections remain labeled. | No receipt proves an entire passage. Recheck object-level media rights and source interpretation before adding photographs, translations, or further claims. |
| Cross-references | Three explicit quotations reviewed. The unchanged 344,799-record OpenBible archive is behind a labeled traditional disclosure in the reader and remains accessible in Interact. | Review additional link types one by one. Do not delete or promote by votes. |
| Word and identity | One reviewed Genesis 1:2 lemma; all other spellings disclose lack of occurrence alignment. Supplied English and divine-name case are guarded. Nahor, Joash and Jehoash senses have separate cited fixtures. | A global occurrence graph and original-language alignment corpus require rights and source review; do not generate them from English spelling. |
| Chronology | Two sourced passage synchronies (Acts 18:12; 2 Kings 18:13). Other selected verses state that no reviewed event date is established. | The existing book/chapter chronology remains an editorial overview. Do not extrapolate exact event or composition dates to every verse. Wider world-history nodes need independently sourced records. |
| Access | Owner decided free study with donation support; payments and accounts unchanged. | No paid tier work in this task. |

The checks that pin this checkpoint are `tests/evidence-regression.ts`, `tests/evidence-receipt.spec.ts`, `tests/word-inspector.spec.ts`, and `tests/name-identities-regression.ts`. A passing test proves the implemented guard and pilot behavior, not the unreviewed historical claims.

## Exact continuation contract for the research proposal

The supplied research describes a sitewide knowledge graph and every-verse chronology. This revision implements the reviewed seed and the safeguards, **not** a claim that the full corpus has been researched. Work through the following independent units only when the named source evidence is available; report the count actually reviewed after each unit.

| Unit still outstanding | Required input and action | Exit condition |
| --- | --- | --- |
| Full quotation/parallel network | For each candidate, record both KJV OSIS refs, a connection kind, the exact shared wording or independently checked parallel, source credit and reviewer decision. Keep OpenBible votes out of promotion logic. | A reviewed index fixture covers each added link; archive length stays 344,799 and source attribution remains visible. |
| Hebrew/Greek occurrence graph | Obtain an edition and alignment dataset with terms permitting the intended use. Map by verse **and token occurrence**, recording original form, lemma, morphology, edition and alignment uncertainty. Never infer from English spelling or brackets. | A clicked token either shows a source-linked occurrence or explicitly says alignment unavailable; Nahor/Joash and divine-name/supplied-word fixtures remain distinct. |
| Event and composition chronology | Add an event range only to passages the cited source actually dates; maintain a separate sourced composition range for books or passages where defensible. Do not require event-before-composition as a universal ordering rule: later texts can narrate earlier events, and composition dates are debated. | Every shown date has type, range, source, method and limit; all other verses show no established event date. Do not auto-stamp all 31,102 verses. |
| Wider world-history nodes | Start with one source-backed contemporary to a reviewed biblical interval, with an independent world-history primary or scholarly record, date overlap method, stable place ID and approximate coordinate. Expand by period only after source and UI review. | “Meanwhile” and map links show why two records overlap and their different uncertainties; no global empire layer claims a precise year state from a century label. |
| More archaeology and literature pivots | Intake the proposed Tell al-Rimah/Jehoash, Sheshonq, Kurkh, Babylonian Chronicle and similar candidates one object at a time. Mykytiuk’s proposed person list is a research lead, not an automatic confirmation flag. Keep Gallio/Seneca identity and ancient writing separate from Paul's encounter. | Each added object has an edition/museum ID, exact limited claim, passage method, date/provenance, review state, media rights and a passing card/navigation regression. |
| Media and external data | Check rights for each museum photo, inscription transcription, lexicon, OHM feature and gazetteer version separately. Keep license/attribution with each imported record; do not assume a source is CC0 because a research memo says so. | Only imported material with documented permitted use is displayed, with visible credit and a reproducible source/version ledger. |

The original memo’s suggested purge count (3,521) does not match this checkout: the reproducible count is 3,504 nonpositive OpenBible records. Retain the full licensed archive and label it as traditional suggestions. The owner's 2026-10-20 decision closes the proposed subscription tier; every study feature remains free and donation supported.

## Source of truth and existing baseline

- `Bible.pdf` and its verified 31,102-verse derivative remain the Scripture source. Neither historical data nor outside translations may rewrite them.
- `src/data/bibleChronology.ts` already models all 66 books and some chapter event ranges. It does **not** establish an exact date for every verse.
- `public/data/cross_references_bundle.json` retains 344,799 attributed OpenBible records. The present snapshot has 2,275 zero-vote and 1,229 negative-vote records (3,504 nonpositive); votes are not historical evidence.
- `src/data/ancientMapData.ts` already contains 20 artifact entries; `src/discoveries.ts` supplies twelve reading routes; `src/data/nameIdentities.ts` contains reviewed spelling-level distinctions; `src/data/scriptureLexicon.ts` often resolves English spelling without a verified occurrence-level lemma.
- The local checkout starts at v00.01.56 with earlier uncommitted work. The public site may lag. Preserve existing work, and do not commit, push, deploy, change payments, or alter the governing files under this task.

## Rules that every implementation must satisfy

1. **Authority:** Scripture text, project doctrine, scriptural inference, external attestation, lexical notes, editorial links, and unresolved claims remain distinguishable in data and UI. Do not label an outside correlation as proof of a biblical narrative.
2. **Evidence receipt:** A published historical claim identifies the precise claim, named source and stable record URL/ID, what that source actually says, its date or range, connection method, scope/limitations, review state, and rights for reused text or media. An external URL alone is not a review.
3. **Honest uncertainty:** Preserve `attested`, `inferred`, `proposed`, `disputed`, and `unknown` states. Date ranges and approximate coordinates are preferable to invented exactness. A book's composition date does not mechanically date every verse.
4. **Cross-reference preservation:** Keep the full attributed OpenBible archive intact. A separate reviewed index drives any default "curated" view. Never infer truth from votes or a universal numeric cutoff. Label traditional/theme links as editorial.
5. **Occurrence identity:** A clicked English token is not automatically a specific Hebrew/Greek lemma or a unique person. Resolve using reviewed verse occurrence evidence. Translator-supplied `[words]` cannot generate an original-language claim. Preserve `LORD`/`Lord`/`GOD`, pronoun number, source markers, and visible small caps.
6. **Rights:** Track terms by source and by media item. Open availability is not a commercial license. OpenHistoricalMap can include individually licensed elements; Theographic is CC BY-SA with underlying credits. Do not import IIP, photographs, or lexicons in bulk before checking their exact terms.
7. **Product promise:** Keep the current free Scripture experience and donation model. No subscription, billing integration, account requirement, or paywall without a separate owner choice defining what remains free.

## Work sequence and acceptance

### 1. Representative path: Acts 18:12 and Gallio

Use existing reader, Interact, atlas, and study-context links. Add one reviewed claim record and receipt for the Gallio/Delphi inscription synchrony using a stable primary collection or scholarly record. Separate the inscription's attestation of Gallio's office from the dating of Paul's ministry and from any later family/literature links. Add only independently checked pivots. Acceptance: the path is navigable in both directions; each claim shows its evidence class, source, limitation, and date range; a regression test detects missing or overstated receipt data.

### 2. Audit existing archaeology before adding more

Inventory all 20 entries and their claims. Attach authoritative collection/excavation references, object IDs where available, provenance, media license, and editorial review status. Remove unsupported wording from default claims; mark disputed identifications. Do not silently replace a source with Wikipedia or assume an artifact directly confirms an entire passage. Acceptance: no default artifact card presents an unreviewed external claim as verified; source links resolve; missing rights/provenance is visible to editors and blocks new media reuse.

### 3. Cross-reference views

Preserve archive counts and attribution. Create explicit connection kinds (quotation, parallel account, reviewed shared entity, reviewed lexical connection, editorial theme, unresolved), each with source and review status. A small reviewed set, beginning with the representative path, can enter the default view. The original collection remains accessible as a labeled historical source. Acceptance: default links have reviewable reasons; no vote threshold promotes a link; raw records remain unchanged and searchable.

### 4. Word and identity accuracy

Separate occurrence-level reviewed annotations from English spelling lookups. Return "word-level alignment unavailable" where a precise lemma cannot be established. Review the two Nahors, the two Jehoashes, divine-name casing, pronoun number, and supplied words as fixtures. Acceptance: selected occurrence never silently borrows another occurrence's identity or lemma; the canonical text remains byte-for-byte unchanged.

### 5. Chronology and world horizon

Represent specific events and composition claims with cited ranges, uncertainty, and links to passages. Reuse the current book/chapter overview as a broad fallback. Add a modest "Meanwhile" set for independently checked periods (Gallio and the 701 BC Assyrian campaign first); link to existing map locations using stable IDs and source-specific coordinate precision. Acceptance: undated passages show "date not established"; the two pilot periods can be compared without suggesting an exact global state for every year.

### 6. Source intake and future expansion

Maintain a source register with version/date, URL, license, attribution, permitted uses, changes, and media terms. Wikidata structured records and Pleiades places can be candidates after identity review; source IDs are leads, not automatic identification. Check IIP, Achemenet, lexicons, Theographic, OpenHistoricalMap individual features, and every museum photo separately before importing. Extend only after the first paths pass editorial and UI review.

### 7. Product access decision — resolved by owner, 2026-10-20

The owner chose to keep all interactive study tools free and donation supported. Do not add subscriptions, billing, account requirements, or access controls as part of this work. Any future change needs a separate owner instruction. The research's paid-tier proposal is closed for this implementation.

## Verification and handoff

Run the existing canonical verifier and the relevant Node/Playwright regressions for each code slice. Inspect one real desktop and mobile rendered path before multiplying records. In handoff, state which claims were reviewed, which remain unresolved, exact tests run, local version, and whether anything was published. Preserve the user's existing uncommitted work throughout.
