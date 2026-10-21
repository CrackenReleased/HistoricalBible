# HistoricalBible: one world, one unfolding history

**Working product brief · revision 1 · 2026-10-21**  
**App checkpoint:** local v00.01.57. This is a task brief for future, separately authorized work. It does not change `AGENTS.md`, `principles.md`, Scripture, application behavior, accounts, or publishing permissions. Read it with `HISTORICAL_EVIDENCE_IMPLEMENTATION.md` and `HISTORICAL_SOURCE_REGISTER.md`; those documents retain the current evidence and rights boundaries.

## Why this matters, in the owner's words

> **Owner-voiced working statement (paraphrase for this brief):** “I do not want Christians to have to keep biblical history and world history in separate books in their minds. When I am reading about someone in the Bible, I want to see where they were, when they were there, who stood with or against them, and what was happening elsewhere in the same world. I am not looking only for things that mention the Bible. I want the wider world to make sense alongside the story I am reading, without pretending we know dates, routes, or relationships that we do not.”

Christians can grow up learning biblical history and then study “world history” as though the two happened in separate worlds. That divide makes it difficult to picture what was happening anywhere else when a biblical event occurred. It can even make biblical history *feel* like a different kind of history. HistoricalBible exists to help close that divide. The Bible happened in the same world as Egypt, China, Europe, the Americas, and every other region. A reader should be able to see that shared world while reading Scripture.

The aim is **not** to make external records a test that Scripture must pass, and it is **not** to limit the site to archaeological parallels to the Bible. The aim is to locate the people, journeys, nations, conflicts, and events of Scripture within the wider, continuing history of the world. Important events elsewhere may have had no contact with Israel at all. They still belong in the view when their dates overlap or fall within a useful nearby span of decades. History after the last biblical events belongs on the continuing world timeline; later events such as the Vikings must never be presented as contemporary with biblical narratives.

The reader must also be able to understand Israel and Judah through growth, division, conquest, captivity, return, and changing relationships. “Friend” and “enemy” are not permanent properties of a nation. An outside power may oppose a kingdom while sheltering one of its people; an alliance may be reluctant, self-serving, strained, coercive, or condemned by Scripture. Record **whose** relationship it was, **with whom**, **when**, **in what capacity**, and **on what basis**. Separate a biblical moral statement from an editor's inference. David's refuge with Achish while Saul opposed the Philistines is a required counterexample to any simple faction-wide label.

**Product maxim:** The Bible happened in the same world as the rest of history. Show the reader that world at the moment they are reading about, and show who stood with whom, when, why, and at what cost.

## The experience to build toward

A reader selects a person, city, or event in the KJV reader. The existing sidebar presents the selected **passage context**, an estimated event date or defensible range, the person or place at that point in the account, and any relevant journey stop. It then offers nearby conflicts, miracles, treaties, ruptures, changes in rule, and significant events elsewhere in the world. The exact connection of each item is visible: same event, same period, within nearby decades, or merely a later point on the continuing timeline.

Moving through a journey follows **narrative order** unless elapsed time is actually known. Each recorded stop can reveal what has happened and what comes next around that person and place. “Upcoming” means next in the account when no calendar date is established. Distinct text and shapes identify conflict, miracle, treaty, rupture, and political transition; color is additional help, never the only signal. Biblical events remain labeled as Scripture; independent world events have their own sources. An uncertain route segment is visibly schematic rather than a claimed recovered road.

**Open in map** carries the same passage, selected person or place, time/range, journey, and stop into the existing full map. It automatically shows the relevant layers and focuses the relevant area. The reader should not need to reselect the era, turn on journeys, or find the stop again. Returning to the reader should preserve the passage and selection. A missing date or unreviewed identity yields an honest broad-context state, not a fabricated precise snap.

This is a quiet evolution of `/bible` and `/map`. Keep the current page structure and familiar controls. Improve context selection, records, labels, and handoff within those surfaces before considering a new interface.

## Verified starting point and concrete gaps

| Already present in this checkout | Gap this brief addresses |
| --- | --- |
| `src/bibleReader.ts` has selected verse state, Chronology and Map companion tabs, and a compact map. | Its full-map link currently uses only `/map?era=…`; it does not carry the selected passage, person, journey, or stop. Its era selection is often a book/chapter rule rather than an occurrence-specific date. |
| `src/atlasApp.ts` accepts `era`, `journey`/`filter`, `story`, `region`, and `site` URL parameters and has a journey stop stepper. | The initial URL handler does not restore a selected verse/person or a journey stop. The stepper explicitly says sequence spacing is not elapsed time; preserve that truth. |
| `src/data/ancientMapData.ts` has world regions, eras, biblical routes, and two Elijah-related routes. | Both `elijah-prophet` and `elijah-elisha-ministry` currently have `figureId: 'hezekiah'`. The same wrong placeholder also appears on the Elisha, Amos, and Hosea routes inspected here, so the route-figure identity class needs a scoped sibling scan before an Elijah pilot. Existing region `factionCategory` values are static and cannot express a person's time-specific, possibly tense relationship. Audit the two Elijah routes before choosing one; do not multiply duplicate paths. |
| `src/data/datedEvents.ts` has two reviewed passage synchronies: Acts 18:12 and 2 Kings 18:13. All other selected verses have an honest undated state. | The current “Meanwhile” text repeats the synchronizing external record. It does not yet provide an independently sourced event or condition elsewhere in the world. Do not mistake an evidence receipt for world context. |
| `HISTORICAL_SOURCE_REGISTER.md` and `src/data/evidenceReceipts.ts` give 20 artifacts scoped receipts. | Receipts are an evidence layer, not the organizing principle of the world-history timeline. Preserve them and add separately sourced world records. |

Treat all existing world-region dates, boundaries, population estimates, Bible intersections, and permanent faction labels as **review candidates**, not as newly verified facts. In particular, do not infer that “Sinim” in Isaiah identifies China, or call every region “direct synchrony with Scripture,” without an individually reviewed basis. Do not silently remove these entries in a handoff task; correct a specific claim with a scoped source review and regression.

## Non-negotiable editorial rules

1. **Scripture is not on trial.** Display the preserved KJV and project confession according to `principles.md`. An absence of surviving external evidence does not hide a biblical event or make its account “unverified” as Scripture. A claim of a physical trace still requires provenance before it is presented as a sourced external fact.
2. **Never merge claim classes.** A biblical event, an independently attested world event, a date reconstruction, a proposed identity, a schematic route, and a moral interpretation each have their own label and source basis. Do not use “corroborated” as a generic synonym for “happened around the same time.”
3. **No invented precision.** Store ranges, uncertainty, chronology method, and source. A book/chapter overview is a fallback, not an exact date for every verse. A decades-wide overlap is not a known same-day encounter. Approximate coordinates are not a known footpath.
4. **Relationships have subjects and periods.** Record the person or polity on each side, the type of relationship, time span, geographic scope, perspective, tension, source passages or outside record, and the limit of what those sources establish. `neutral`, `unknown`, `coerced`, and `strained` must remain expressible. Moral evaluation requires a cited biblical basis or an explicitly labeled inference.
5. **Global means global, not forced connection.** Include meaningful contemporary history from outside the Levant when sourced. Explicitly state “no known contact is claimed” for a world item that is included only because its date overlaps. Do not fill a region or century with trivia just to look complete.
6. **Keep study free and familiar.** All interactive study remains free and donation supported. No accounts, paywall, visual rebuild, new external service, third-party image import, or bulk dataset ingestion is part of these work packages.

## Shared records and behavior contract

The following is the information the existing views must exchange. Agents may adapt existing types and router utilities; do not create a parallel state system. Use stable IDs and URL parameters for shareable cross-page state, with safe fallback on unknown IDs. A page URL must never contain authoritative Scripture text or an invented date.

| Record | Required information | Invariant |
| --- | --- | --- |
| Reading context | OSIS verse; optional selected occurrence/person/place; time range and basis when reviewed; era fallback; selected journey/stop; optional map focus. | One selection drives sidebar and full map. Refresh, back, forward, and direct URL restore the same intended context. Unknown IDs fall back to the cited verse. |
| World item | Event/condition name; region and approximate location where meaningful; start/end range; source ID/URL; what source establishes; overlap method; uncertainty. | Time overlap alone does not imply biblical contact or corroboration. Event and long-running period are visibly different. |
| Relationship | Two identified actors; actor types (person, kingdom, empire, city, etc.); date/range; relation kind and perspective; source refs; tension/limits; optional moral assessment with basis. | No permanent faction value is copied onto every person or every year. David–Achish, Saul–Philistines, and Judah–Assyria can coexist without collapsing into one label. |
| Journey stop and marker | Route/person ID, ordered stop, place ID/coordinate precision, Scripture reference, date range if available, event kind, source class, and route-segment certainty. | Narrative order is not elapsed time. Unknown connectors remain schematic. “Upcoming” is relative to current stop and clearly named. |

## Work packages for Gemini and Claude

Each package is independently reviewable. Assign **one owner per package**; a second agent can review the result against this brief. An agent must inspect the actual checkout and preserve existing uncommitted changes before editing. Do not run several agents against the same files at once. Complete a representative vertical slice and verify it before expanding coverage.

### A. Correct the existing selection foundation

**Goal:** A verse and a selected known entity produce one stable context across sidebar and map. Reuse `src/bibleReader.ts`, `src/atlasApp.ts`, `src/studySession.ts`, and the existing URL/router helpers. Start with a reviewed passage that has a defensible date, such as 2 Kings 18:13. Preserve the existing broad-era fallback for undated selections.

**Acceptance:** Open the passage, select the relevant person or place, open the full map, refresh, and go back. The passage, entity, appropriate time range, and relevant map focus survive. The map reveals needed layers without the user operating filters. An unknown or ambiguous name does not silently choose the wrong identity. A regression covers the full round trip, including an undated passage.

**Boundary:** Do not stamp dates on all verses or redesign the sidebar. A word click currently enters Word Inspector; extend the existing interaction without taking away word study or assuming every same-spelling token is a known person.

### B. Make one journey genuinely contextual

**Goal:** Use Elijah as the first route case because an Elijah route and stop stepper already exist. First write a failing identity regression for the wrong `hezekiah` figure links on Elijah and related prophet routes; inspect all route `figureId` assignments for the same failure class and correct each demonstrated mismatch. Audit the two Elijah routes and their stop references, date labels, coordinates, and schematic connectors. Reuse one coherent route rather than create a third. Wire a cited Elijah passage to the matching stop and preserve it through Open in map.

**Acceptance:** A selection in a Cherith, Zarephath, Carmel, or Jordan passage opens at the matching reviewed stop or shows a clear broad-route fallback. Stepper movement updates selected stop, nearby context, and next narrative events; refresh preserves the stop. Markers have text plus distinct symbols. A test fails if a prophet route resolves to the wrong figure or if a selected stop resets to the first stop.

**Boundary:** Do not claim every drawn connector is Elijah's exact road. Do not invent missing stops or precise years. Inventory other people with recorded movement as a coverage backlog; add routes in later authorized slices, one sourced journey at a time.

### C. Add relationships that change with person and time

**Goal:** Introduce a small, cited relationship record layered over the current static map categories. Begin with a clear kingdom-level case (Judah and Assyria during the 701 BC campaign), then an exception case (David's refuge with Achish versus Saul's conflict with Philistines in 1 Samuel 27). Keep northern Israel and Judah distinct. Show neutral, tense, or unknown states when supported or when a simple ally/enemy conclusion is unwarranted.

**Acceptance:** Selecting David does not paint all Philistines as David's permanent allies or treat Saul as sharing David's refuge. The viewer can tell actor, counterpart, time, relationship, source, and tension. An uncited moral conclusion is not displayed as Scripture. A regression checks the David/Achish/Saul counterexample and a relationship changing over time.

**Boundary:** Static `factionCategory` may remain for legacy overview, but contextual cards and markers must not inherit it as a truth about every person and period. Do not rewrite every empire record in one pass.

### D. Put an independent world item in “Meanwhile”

**Goal:** For the reviewed 2 Kings 18:13 interval, add one major, independently sourced world condition or event outside the Assyrian/Judah synchrony. The Eastern Zhou/Spring and Autumn period in China is a possible candidate **only after** source, date, place, and reuse review. Explain the interval overlap in plain language; do not claim contact with Judah. Preserve the Taylor Prism as the distinct synchronizing source. Then add a second independently reviewed region only if the first card reads clearly on desktop and mobile.

**Acceptance:** The sidebar separates “how this passage is dated” from “elsewhere in the world.” The latter has a working source link, period/event label, range, location where warranted, and a sentence explaining overlap and limits. The map opens at the biblical context while offering the world item without forcing a globe-wide zoom. A regression fails if the inscription alone masquerades as the entire world horizon or an outside event is shown outside its stated interval.

**Boundary:** Do not ingest an entire chronology dataset or convert a 10–100-year discovery window into a claim that two events occurred simultaneously. Keep regional records independently sourced and rights checked.

### E. Quietly adjust language and expand only after proof

**Goal:** Once A–D work in the current interface, tune labels and introductory copy toward “Scripture in its world.” Keep the familiar page structure, typography, and controls. Make “Around this time,” “Along this journey,” and “Relationships at this point” understandable without introducing a new mode maze. Inspect one desktop and one narrow viewport with real long names and date ranges.

**Acceptance:** A person reading the old site recognizes it. The selected passage remains central; world context enriches rather than crowds Scripture. Source and uncertainty labels are readable and accessible. No new payment, sign-in, or navigation burden appears. Record a before/after observation from real rendered pages and the specific usability weakness corrected.

**Boundary:** Do not advertise universal coverage. State what is reviewed and leave honest empty states. Expand by period and person only after the representative flow works.

## Order, handoff, and definition of done

1. **First slice:** A + the Judah/Assyria portion of C + one item from D around 2 Kings 18:13. This proves shared context, a time-specific relationship, and truly independent world history without needing a route.
2. **Second slice:** B + the David/Achish exception of C. This proves person-specific relationships, journey position, and next-in-account markers. Correct Elijah's wrong figure link at the start of B.
3. **Then expand:** inventory recorded travelers and period coverage. Prioritize meaningful gaps; do not promise a path for a person whose movement cannot be located or ordered from sources. Continue the world timeline after the biblical period without false contemporaneity.

For every agent handoff, record: exact files touched; existing behavior verified before change; cited Scripture and external records with IDs/URLs; what is attested, inferred, proposed, or unresolved; the selected URL/interaction tested; mobile/desktop observation if UI changed; regression test that would catch the failure on old code; sibling scan; app version; and whether anything was committed or published. Preserve the full 344,799-record cross-reference archive and the canonical 31,102-verse KJV corpus. Do not commit, push, deploy, or alter governing files without the owner's separate instruction.

**Success is not the number of pins or routes.** Success is a reader opening a passage, understanding the person and place at that point, seeing Israel's actual relationships and the wider world around that time, and moving between Bible and map without losing the question they were exploring.
