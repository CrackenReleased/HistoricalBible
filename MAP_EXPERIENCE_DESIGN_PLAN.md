# Historical Bible map — reading-first experience

**Design/work-plan revision:** 1.1 · 2026-10-17 (America/New_York)  
**Status:** Implementation complete and deployed (`v00.01.45`); explicit pre-overhaul revert point anchored at `2213ba1` (tag `v00.01.44-pre-reading-map`, branch `backup/v00.01.44-pre-reading-map`).  
**Inspected application baseline:** v00.01.44 (`2213ba1`), `E:\HistoricalBible` and https://historicalbible.com/map.  
**Owner/consumer:** HistoricalBible project; owner and subsequent implementing models. Update this file in place as decisions and implementation progress change. It is the canonical plan, not a parallel source of historical data.

### Live implementation checkpoint — 2026-10-17

- **Explicit Revert Point (Pre-Reading-First Overhaul):** Commit `2213ba1` (`v00.01.44`) is permanently tagged and pushed as `v00.01.44-pre-reading-map` and branched as `backup/v00.01.44-pre-reading-map` on `origin`. To revert `/map` to the pre-overhaul `v00.01.44` state at any time: `git revert --no-edit HEAD && git push origin master` (or `git checkout v00.01.44-pre-reading-map -- map.html src/atlasApp.ts src/engine/ancientMap.ts src/interact.css src/data/ancientMapData.ts tests/map.spec.ts tests/map-chronology-compass.spec.ts`).
- Owner explicitly requested building and a continuation trail, then instructed Antigravity to pick up from Codex's checkpoint and deploy `v00.01.45` with a clear revert point. Working directly in `E:\HistoricalBible`; prior documentation edits preserved.
- Implemented quiet entry, period/journey selects, progressively disclosed layer controls, one-place narrative sequence slider, Show all selected places, side-by-side reading card, and atlas-scoped muted styling (`v00.01.45`). Existing Leaflet engine retained; no dependencies or services added.
- Files in play: `map.html`, `src/atlasApp.ts`, `src/engine/ancientMap.ts`, `src/interact.css`, `src/data/ancientMapData.ts`, `tests/map-reading-experience.spec.ts`, `tests/map.spec.ts`, `tests/map-chronology-compass.spec.ts`.
- Accuracy decision: no year slider until dates are sourced. Representative route (`paul-first-journey`) had merged city labels on single coordinates and unsupported seasonal dates. Selected-place labels/notes corrected against canonical Acts 13–14; return to Antioch added using its existing coordinate. All locations remain explicitly approximate. No route lines/interpolated movement in atlas mode until geometry is sourced. Scripture corpus untouched.
- Completion fixes & visual review (Antigravity continuation):
  - Fixed `<label>`/`<select>` accessible-name pollution in `map.html` where nesting `<select id="atlas-era">` inside `<label>` caused `<option>` text (`"All eras · choose a journey"`) to collide with `getByLabel('Choose a journey')`.
  - Aligned `setEra`, `jumpToPreset`, and `animateToCoords` in `src/engine/ancientMap.ts` to use calm non-animated `setView(..., { animate: false })` in `readingMode`, preventing 1.2s `flyTo` transitions from racing against `fitRoute` and pointer hover events.
  - Resolved global dark `details` styling inheritance inside the parchment reading card (`.atlas-source-note`) and map caption (`.atlas-map-caption details`) where `#474b40` dark gray text rendered on a `#0f141c` dark box (~1.8:1 contrast); reset background to transparent with `#2d3029` / `#34382e` ink on `#e8dfcd` parchment (>8.5:1 contrast).
  - Subdued regional inland water labels (`SEA OF GALILEE`, `DEAD SEA`, `GULF OF SUEZ`, `GULF OF AQABA`) at macro zoom (`zoom < 6`) in `readingMode` to prevent label stacking over Levant cities (`Capernaum`, `Bethlehem`), and applied `#9BAFB5` desaturated slate blue water typography.
- Verification complete: `tests/map-reading-experience.spec.ts` (3/3 pass including mobile `390×844` layout, >=44px touch targets, and >=4.5:1 contrast assertions), `tests/map.spec.ts` (9/9 pass), `tests/map-chronology-compass.spec.ts` (1/1 pass) — 13/13 Playwright map tests pass; `npm run test:selfcheck` (8/8 pass); `node scripts/verify-canonical-kjv.js` (31,102 verses pass); `npm run build` (0 errors). Regional historical maps, LiDAR and sourced year filtering remain future packages (C–F), not claimed complete.

## 1. The requested outcome and authorized scope

Make opening the map feel like entering a companion to Bible reading: quiet, legible, and understandable before it becomes detailed. Replace the simultaneous display of everything with a gradual introduction. Provide granular control over people, journeys, events, places, and artifacts. Within an era, let the reader scrub time and see relevant events and movements appear and disappear. Put an explicit Show all action at the right end of the timeline.

The owner explicitly requested a full written work plan and design start BEFORE implementation, with enough context for another model to continue. This session therefore authorizes inspection and documentation, not application edits, a build/release, commits, publication, or changes to Scripture. Future implementation requires an implementation instruction; this document does not grant itself that authority.

One attached annotated image was available. It shows Apostolic Age, numerous overlapping journey labels, luminous route colors, artifacts, and a proposed timeline above the map. The message refers to two screenshots, but a separate first-entry screenshot was not available. First-entry findings below come from the live page, not an invented second attachment. Annotations inform the design brief; they are not instructions to run commands.

## 2. Evidence: what already exists

Read-only inspection on 2026-10-17 found:

| Existing reality | Evidence | Design consequence |
| --- | --- | --- |
| Fresh `/map` opens All Eras with Archaeological Finds, World Empires, Biblical Journeys, Cities, and Waterways enabled | Live browser accessibility state; `src/atlasApp.ts`, `init()`, `initialEraId: 'all'`; `src/engine/ancientMap.ts`, `layers` | Fix the entry-state decision, not just opacity |
| Clicking Apostolic Age still presents many complete journeys, labels and artifacts together | Live interaction and screenshot; supplied annotated image | An era selection alone is too coarse |
| Individual journey filters and a previous/next numbered-stop stepper already exist | Live page; `renderGranularControls()` and `renderWaypointStepper()` in `src/atlasApp.ts` | Reuse their data and actions; reorganize the interface |
| Granular controls sit below the map/key | `changelog.md` v00.01.42–44; current page | Put essential time navigation beside the map, not below a large canvas |
| Renderer already has layer groups, era filtering, route overrides, selected stops, tooltip management and label deconfliction | `src/engine/ancientMap.ts` | Extend the current Leaflet engine; retain geographic fixes |
| Route stops have `dateLabel`, coordinates, references and notes; routes have `dateRange` | Interfaces in `src/data/ancientMapData.ts` | Display strings cannot safely drive numeric time filtering |
| Broad figure IDs and combined routes exist, including Peter/Philip and Andrew/Mark | Data and live journey controls | A person filter cannot simply equal a route's current figure ID |
| Some earlier Jesus/John the Baptist filters are offered in Apostolic Age | `GRANULAR_TIMELINE_FILTERS` era memberships | Separate preceding context from events within AD 33–96 |
| Some routes carry external attestation; current evidence union is only Scripture text or external attestation | `RouteEvidenceClass` and stop/route metadata | Dates, routes and inferred coordinates need distinct provenance from Scripture text |
| Renderer clears and rebuilds layer groups in `renderActiveEra()` | `src/engine/ancientMap.ts` | Do not run the full reconstruction for every pointer move |
| Reset currently selects all eras | `resetView()` | A camera reset must not unexpectedly restore visual overload |
| Engine also serves Bible companion and Interact | Existing tests and engine consumers | Scope new entry behavior to atlas; explicitly verify shared-engine regressions |

Existing regression coverage includes `tests/map.spec.ts`, `tests/map-chronology-compass.spec.ts`, and `tests/bible-side-by-side-map.spec.ts`. These already protect coordinate alignment, layering, tooltip containment, journey interaction, era controls and layout. Prior changelog test-success statements were not rerun or independently verified in this documentation session.

Repository status was clean before documentation. No existing map redesign plan was found in the scoped repository filename scan; the existing PDF repair plan is unrelated. No HistoricalBible mirror directory was present in `E:\AI_Hub\Projects` at inspection.

## 3. Design direction: a quiet historical atlas

The visual problem is cumulative: saturated hues, glow, dashed route networks, emoji, all-capital banners, crowded labels, and several competing control groups. Merely making the same pile of information brown would preserve the confusion.

Use authentic regional cartographic material where provenance and reuse rights support it. The owner clarified that maps must originate with the region or its peoples, not simply be old outside interpretations. A roughly 1400s cartographer's craftsmanship and a clear teacher's voice guide presentation; they do not establish a map's provenance or historical accuracy. Real paper/ink character is welcome. Invented antique maps, artificial aging presented as authenticity, neon decoration and a new theme switcher are not. Keep controls legible and the brand recognizable; the inherited dark shell must not force authentic map sheets into an unsuitable palette.

Proposed starting tokens, to be adjusted against real map tiles during the first visual proof:

| Role | Initial token | Use |
| --- | --- | --- |
| Main surface | `#171A18` | Warm charcoal shell |
| Raised surface | `#232722` | Timeline and detail panels |
| Primary text | `#EEE6D6` | Warm ivory |
| Secondary text | `#BBB5A8` | Supporting copy, not tiny labels |
| Divider | `#44483F` | Quiet structural rules |
| Selected route | `#C3A576` | Muted ochre; strong through weight, not glow |
| Comparison route | `#91A092` | Sage |
| Additional comparison | `#A9A0B0` | Muted violet-gray |
| Water labeling | `#9BAFB5` | Desaturated slate blue |

These are design candidates, NOT a claim of verified contrast. Measure final foreground/background pairs: normal text at least 4.5:1; large text and meaningful control/graphic boundaries at least 3:1. Muted must not mean unreadable.

Keep existing serif typography for titles and place names where readable; use the existing UI face for controls and dates. Avoid monospaced all-caps banners as the dominant reading experience. Body/control text starts around 16px; selected event title around 20–24px. Use understated borders, no persistent glow, and no emoji as the primary map symbol system.

Use recognizable monochrome symbols: place dot, event marker, artifact symbol and directional route. Pair every symbol with a text label in the key. Color is supplementary. Evidence source, selection and chronology must remain understandable without color.

Evaluate each regional map by maker/cultural origin, creation place/date, depicted period, original purpose, holding institution, identifier, reuse rights and geographic suitability. Age alone does not qualify it. The previously suggested European Holy Land maps were not established as qualifying regional sources and are not selected assets. No qualifying historical basemap or regional LiDAR coverage has yet been verified. Where evidence is unavailable, use clearly identified modern geographic context or leave reconstruction absent; never manufacture a local historical map. A new provider/dependency is not presumed necessary. Existing empire polygons are not exact year-specific boundaries.

### Revision 1.1 — user-first structure and bloat audit

This section narrows the initial implementation scope where later sections describe broader possibilities. It records the owner's regional-map, measured-terrain, accuracy and stewardship requirements. It is a design-level audit, not proof from a built product or student testing.

**Purpose:** help a curious fourteen-year-old understand the place, sequence and meaning of an event, then engage with Scripture. Honor God through faithful handling of Scripture, truthful evidence, care for the learner and disciplined stewardship. Never trade accuracy for spectacle, invent theological authority, or treat an Ai interpretation as Scripture. Governing documents and the KJV corpus remain unchanged.

The visible structure has four parts: **map, time, What to show, and one story/detail card**. The card contains the short teaching prompt, explanation, Scripture link and expandable evidence. Do not add a separate narrator panel, lesson dashboard, source browser or reconstruction workspace.

| Student need | Minimum mechanism | Proof obligation |
| --- | --- | --- |
| Understand where to begin | Quiet map and one period/story choice | Learner starts a story without coaching |
| Understand what changed | One timeline plus previous/next event | Learner can explain what appeared/disappeared and why |
| Follow a person | Existing journey data and focused selection | Unrelated routes stay out of the way; chosen journey remains accessible |
| Investigate rather than receive a lecture | One optional observation prompt in the detail card | Student can inspect the map before opening the explanation |
| Connect discovery to Scripture | Existing reading link with context | Correct passage opens; annotation never replaces biblical text |
| Know what is established | Expandable Sources & dating within the same card | Student can distinguish a surveyed feature from a reconstructed claim |
| Choose more detail | One progressively disclosed visibility panel | Student can enable artifacts and return to the simple view |

**Proof scenario:** choose Apostolic Age, follow one reviewed journey, advance and reverse time, inspect one sourced place/event, open its Scripture passage, enable one artifact, then use Show all and return. Every retained component must serve a step in this scenario or protect accuracy/accessibility. A successful scripted test establishes behavior only; observed student use is needed to establish learnability. No usability result is claimed yet.

**Remove from the initial delivery:** resume-history storage, new share-link formats, multi-route comparison styling, optional journey-so-far mode, autoplay, audio narration, avatars, quizzes/scores/streaks, 3D reconstruction, custom map engines, new backend/services and a bulk map/LiDAR collection. Preserve existing links. These are excluded from the initial slice, not queued commitments. Core date filtering, Show all, granular controls, accessible interaction and evidence labeling remain requirements.

**Minimal internal structure:** existing curated records → one pure visibility calculation → existing map and controls. One controller owns exploration state. Prefer existing metadata and references; store only facts that cannot be derived. Add stable stop IDs and structured dating/provenance only where the working slice needs them. Do not build a generic lesson engine, evidence graph or new event database. A fourth user-facing panel or new dependency requires a demonstrated unmet user need.

### Regional maps and modern measurement: the accuracy gate

Modern terrain can support authentic regional maps but must not silently rewrite them. Preserve the original sheet as a source; identify translated labels, geographic alignment and modern overlays as additions. A distorted historical map may need its own image-coordinate annotations rather than forced alignment beneath precise geographic routes. Use the existing map library's supported modes before considering new machinery.

For a candidate survey, record source/provider, surveyed footprint/date, resolution, coordinate system, vertical reference where relevant, reported accuracy, license and what was actually measured. These are proposed checks, not assertions that suitable data exists. LiDAR does not date a structure or establish an ancient landscape on its own. Modern ground level, river courses, coastline and buildings may differ from the period depicted.

Every displayed reconstruction must be traceable to the claim it supports:

| Evidence status | Display contract |
| --- | --- |
| Measured | Say what was measured and when; do not label it an ancient condition automatically |
| Attested | Identify Scripture or the specific external source; keep their authority distinct |
| Reconstructed | Explain the inference, supporting evidence and uncertainty |
| Unknown | Leave the claim unfilled or explicitly unresolved; do not manufacture detail |

These are reader-facing descriptions, not a replacement for the project's existing claim classes. Reuse those classes and attach precision/provenance to the relevant date, location or geometry; one badge must not certify an entire mixed-evidence record.

Only introduce terrain processing when one concrete learning question needs it and a suitable source is verified. Process the smallest useful area with an existing tool, retain the source reference and reproducible transformation, and serve a bounded derived asset where practical. Do not ship raw point clouds to every visitor. Decide resolution/download limits from the actual asset and target-device measurements before retention; no unbounded downloads or speculative dataset library.

**Release blockers:** fabricated precision; untraceable historical claims; ambiguous source/annotation boundaries; altered Scripture; map distortion disguised as geographic certainty; or beautiful interactions that obscure what happened. Complete historical knowledge is not a deliverable we can guarantee. Faithful representation of what is known and unknown is mandatory.

**Bloat verdict:** the four-part user interface and current engine can support the core journey. Revision 1.0 included premature persistence, sharing and comparison scope; those are now excluded from the first slice. The plan remains detailed for model handoff, but creates no corresponding requirement for extra product surfaces. Runtime size, performance and usability remain unproved until implementation and observation.

## 4. Representative design start

### 4.1 First arrival: orient before loading history

The map is immediately present, centered on the eastern Mediterranean/Holy Land, with subdued terrain, water and a few major place labels. No routes, artifacts, empire fills, animated markers, or opened detail drawer. This is an orientation state, not an arbitrary historical claim.

One short introduction sits above the map:

> Explore the world of Scripture
>
> Choose a period, then follow its people and events through time.
>
> **Choose a period** · Explore places

Opening Choose a period reveals a compact chronological list using existing era names, date ranges, and one short description each. The entire ten-button grid is not permanently consuming the first screen. No modal tutorial, compulsory tour, carousel, autoplay, or blank screen that waits for onboarding completion.

Explain symbols when they first become relevant. The compact key describes only visible feature types. A persistent Help action can reopen the introductory explanation; no repeating tooltips on every visit.

Direct links are exceptions: a valid site, figure, or future timeline link opens its requested subject, context and detail. It must not be intercepted by the introduction. Plain navigation should remain calm; offer Resume previous exploration as an explicit action if persistence is later enabled, rather than silently reopening an overwhelming comparison.

### 4.2 Desktop working state: Apostolic Age selected

Low-fidelity layout specification (not a rendered UI or a historical proof):

```text
Historical Bible                                     Home  Bible  Map  ...

The world of Scripture
[Apostolic Age · AD 33–96 v]      [What to show · 2]      [Map key]

TIMELINE                         Around AD 47
Move through time to follow the events of this period.
[Previous event] ──33────40──────●────50────60────70────80────96  [Show all]
[Next event]       [Events near this date v]                     in this era

┌─────────────────────────────────────────────────┬─────────────────────┐
│                                                 │ Paul's first journey│
│          Quiet eastern Mediterranean            │ Around AD 46–48     │
│                                                 │                     │
│      Antioch •                                  │ Selected event      │
│               ╲                                 │ Place · date range  │
│                 • Salamis                       │ Short explanation   │
│             Cyprus                              │                     │
│                                                 │ [Read in the Bible] │
│   One selected route; no bright route banners    │ [Sources & dating]  │
│                                                 │                     │
│ [+] [−] [Fit visible]                            │                     │
└─────────────────────────────────────────────────┴─────────────────────┘
Showing: Paul · journeys and events                     [Reset filters]
```

AD 47 here is a layout example inside the current route's AD 46–48 label, not a newly verified date for Salamis. The detail panel must show actual reviewed date precision. Do not ship this illustrative placement as source data.

### 4.3 First minute in Apostolic Age

1. Reader selects Apostolic Age. The era title and a one-sentence introduction appear. The timeline opens at its beginning, with the earliest reviewed introductory event selected. Pentecost/Jerusalem is the intended editorial starting point, subject to the existing data/source review.
2. The map shows that event and its immediate geographic context. It does not reveal all routes from AD 33–96.
3. Reader presses Next event or moves the slider. Date text and nearby-event list update together; irrelevant events disappear. The map stays geographically steady unless the reader requests a fit or selects an off-screen event.
4. Reader selects Paul under What to show. Only Paul's eligible events and journeys remain. The first-journey track becomes available in its reviewed range. Stops reveal in supported order.
5. Reader enables artifacts. Relevant artifacts appear with distinct symbols and their own dates, without becoming travel waypoints.
6. Reader presses Show all at the far right. The map shows the full selected era for the current categories/person filters; the heading says All dates in Apostolic Age. A Return to AD … action restores the previous cursor.

The first slice should demonstrate these six actions before the design is repeated across every era.

## 5. Time behavior: an explicit contract

### Two scopes, never one overloaded slider

- **Era selection** chooses a historical period. Jesus' birth/ministry and John the Baptist primarily belong to Christ & Rome; Apostolic Age defaults to AD 33–96.
- **Within-era time cursor** explores that era. Show preceding context is an optional labeled action, not silent inclusion of earlier events. Selecting it should navigate to the preceding era or clearly enter a cross-era context view.
- **Show all at the far right** is a separate button, visually adjacent to the timeline but outside its numeric scale. AD 96 must still mean AD 96, not all dates. Keyboard End reaches AD 96; Tab reaches Show all.
- **All eras** remains a separately labeled advanced overview. It is never the default and never synonymous with Show all in this era.

### Three temporal views

| View | What the map means | Defaults |
| --- | --- | --- |
| Events near this date | Only records whose reviewed occurrence/display intervals intersect the cursor/window | Default |
| Journey so far | Selected route's supported stops/segments up to the cursor; future segments hidden | Optional for an active journey |
| All dates in this era | Full era contents intersected with category/person/evidence filters | Explicit Show all |

The default must allow items to disappear after their interval; otherwise the map merely accumulates clutter again. A dated event does not remain active forever. Long-lived places stay as geographic context, not as a claim that a person stayed there.

Time scale is linear in years within an era. Use readable adaptive tick labels. Previous/next event jumps to meaningful reviewed temporal boundaries so the reader does not have to hunt through empty years. Event entries appear under the rail or in a collapsible list; do not put every long title on the rail. Near-coincident events cluster into a count with an accessible list.

Scrubbing should update map visibility and date text during dragging. Commit URL/history changes on release or keyboard completion, not each pixel. No autoplay in the initial scope: user-controlled exploration first. A future play control is optional follow-on work, not a delivery dependency.

### Date precision and honest movement

- Do not parse `dateLabel`/`dateRange` strings at runtime to manufacture dates.
- A precisely dated interval can be filtered precisely. A circa or uncertain interval displays Around/Approximately and its range.
- An interval representing possible occurrence is different from an event's known duration. Store this distinction; the UI must not say someone remained in a place throughout an uncertainty range.
- An undated stop belongs to an ordered narrative, not an invented year. Show it under Date not established / sequence only and allow previous/next stepping. Do not assign evenly spaced years.
- Do not animate a traveler at a supposedly exact location between unverified stops. Reveal the last supported stop or a labeled approximate travel segment. Smooth geographic interpolation is permissible only as visibly illustrative movement, never a precise historical claim; omit it from the first release.
- Partial route geometry requires reviewed stop-to-path segment mapping. Do not slice a curved path by array fraction or draw a straight line across land when the actual route is maritime.
- Use one documented numeric calendar convention for computation (astronomical years are a candidate: 1 BC = 0), with adapters to historical display that never shows year zero. Do not mix that convention with negative historical-year integers.
- Overlapping dates and simultaneous movements are valid. Different people may appear together; they need independent identities and visibility controls.

### Artifacts and empires

Artifacts need separate creation/use period, historical relevance period and modern discovery date. The ancient slider uses the historical relevance/creation relationship established for the record, never the modern excavation year. Missing temporal metadata yields an explicitly undated contextual item, not automatic visibility in every year.

Existing empire bounds are approximate polygons. First release may show era-level context labeled Approximate extent for this period when enabled. Do not morph borders between years without independently sourced boundary snapshots. Explain when a polygon is contextual rather than exact to the selected date.

## 6. Granular visibility and introduction

What to show opens a compact side panel (mobile sheet) with these groups:

| Group | Available control | Initial era behavior |
| --- | --- | --- |
| People | Named multi-select with Only this person; clear selection | Introductory focus, not every person |
| Journeys | Individual route checkboxes under the selected person(s) | Selected story only |
| Events | Enable/disable event markers and individual event entries | On for current story/time |
| Places | Major places / all places; individual hide/show in list | Major relevant places |
| Archaeological finds | Off/on, then individual findings | Off |
| Empires and kingdoms | Off/on, then individual regions | Off |
| Waterway labels | Label control independent of base-map water | Restrained major labels |
| Evidence | Scripture-linked accounts; external historical traditions separately labeled | External traditions not preselected |

Use expanders so all these controls are not exposed at once. Show a concise summary outside the panel and explain what each newly enabled category means. Person and route controls need real names, not just colors. A small searchable list is appropriate for long lists; do not invent a new global search product.

Provide explicit presets: People and journeys, Artifacts only, and Custom. Choosing a preset changes category visibility, but does not silently erase date/era selection. Show all changes time scope only; it does not turn on every layer or clear user filters. Its helper text should say All dates; current filters kept. An advanced Show everything in this era action may exist inside the panel, clearly distinguished and never automatic.

Visibility composition:

`era/context eligibility ∩ temporal eligibility ∩ category visibility ∩ selected identities/routes ∩ evidence preferences − explicitly hidden items`

An empty selection must not accidentally mean all selected. Distinguish all, none, and a selected set in state. When nothing matches, explain the active filters and offer Next matching event or Reset filters. Never silently re-enable disabled layers to fill the map.

Group checkboxes show mixed state when only some children are selected. Counts should describe the current result (for example, 2 visible of 7 selected), so hidden-by-date is understandable. Changes are immediate and reversible.

## 7. Selection, labels, camera and detail behavior

- Full route title belongs in the selected detail card/list, not a giant floating banner across the geography.
- Default labels: selected event/place first, major context second. Additional labels appear on focus, selection or appropriate zoom. Keep an accessible list so decluttering never removes access to content.
- Numbered stops appear for the selected journey only. Comparing multiple journeys uses subdued distinguishable line styles and explicit names. Keep other selected routes available; do not silently hide them to satisfy a hard-coded object cap.
- Selected route has a stronger stroke; other enabled routes recede. Avoid animated dashes and pulsing dots by default.
- Overlapping markers expand or open a local list. Preserve existing pane ordering, accurate marker positioning, tooltip clamping and deconfliction.
- Scrubbing does not repeatedly fly the camera. Keep the viewport stable. Fit visible is explicit; a selected off-screen event offers Locate on map. Optional follow-selection behavior must be visible and defeatable.
- Reset view resets camera. Reset filters restores the current era's calm preset. Start over returns to orientation. These are three different actions.
- On scrub, if the selected item is no longer temporally visible, close its transient tooltip and clear its map selection; show the current date's event summary. Do not leave a stale drawer that looks current. Explicitly pinned comparison details, if later added, must be labeled outside current date; pinning is not required initially.
- The detail card contains: title, place, date/range, concise explanation, Read in the Bible, and Sources & dating. Keep Scripture wording sourced from the verified corpus. Dates, paths and modern summaries are annotations.
- Existing route evidence classification is not sufficient to certify every coordinate/date. Source presentation must distinguish Scripture reference, chronological reconstruction and external attestation. Missing sources must remain visibly unresolved.

## 8. Responsive and accessible behavior

Desktop: one concise header/control row, one timeline band, then the map and one detail panel. At 1440×900 and 1920×1080, the map and primary time controls should be visible without scrolling through a button wall. Map height follows the available viewport rather than demanding an arbitrary oversized canvas.

Mobile around 390×844: era selector above the map; date and slider immediately adjacent; Previous/Next as large buttons; Show all still discoverable beside/below the rail. Details and What to show use an expandable sheet with a clear close action and visible map context. A sheet may scroll internally, but must not trap page scroll or cover the entire map by default. At 200% zoom the layout reflows without horizontal document scrolling.

Use a native range input where possible, with a meaningful accessible name and `aria-valuetext` such as Around AD 47, 2 matching events. Provide keyboard arrows, Home/End, previous/next buttons, and event-list alternatives. Announce committed changes politely rather than reading every drag frame. Visible focus, checked state, and touch targets of about 44px are required. Tooltips must also work on focus/tap; hover is not the only access path. Reduced motion disables fades/camera animation. Maintain focused control elements during updates; never rebuild the slider underneath an active drag.

Keep map attribution visible. On unavailable tiles, show the existing failure notice with usable timeline/list/details. Do not promise offline maps or responsiveness on all hardware without measurement.

## 9. Implementation architecture to extend

### Existing file responsibilities

| File | Planned responsibility |
| --- | --- |
| `map.html` | Orientation, compact era control, timeline mount, What to show and detail structure |
| `src/atlasApp.ts` | Atlas state/actions, introductory flow, filters, slider, route stepping and URL coordination |
| `src/engine/ancientMap.ts` | Render derived visibility; incremental temporal updates; preserve existing interactions |
| `src/data/ancientMapData.ts` | Extend existing entities with reviewed optional temporal/identity metadata; retain stable IDs |
| `src/interact.css` | Scoped atlas tokens/layout and carefully scoped shared-map styles |
| `src/data/bibleChronology.ts` | Inspect for reusable chronology conventions; do not create competing dates or alter it blindly |
| `src/store/urlStateRouter.ts` | Inspect conventions before deciding whether atlas serialization should reuse this module |
| Existing map tests | Extend observable-behavior coverage; revise intentionally superseded default/layout assertions |

A small pure temporal selector module may be justified to separate date/filter logic from Leaflet. Create it only after checking whether the existing chronology helpers already serve that purpose. No new framework, map engine, database, analytics, AI service or backend is required by this design.

### Proposed state contract (design, not existing API)

One authoritative atlas exploration state should include entry mode, era ID, temporal view, cursor, last single-date cursor, people/route selection, category toggles, explicit hidden item IDs, evidence preference and selected event/stop. Controls and map derive from the same state. Do not keep independently mutable copies in the toolbar, stepper and engine.

Use explicit reducer/actions or an equally clear controller boundary: selectEra, setCursor, setTemporalView, selectPerson, toggleCategory, toggleItem, selectEvent, resetFilters, resetCamera. An era change restores a calm preset and valid cursor, clears incompatible transient selections and leaves the base-map camera transition intentional. Browser Back/Forward restores state consistently.

Share links should serialize only stable IDs and compact explicit options; validate unknown IDs, invalid dates and combinations. Preserve existing site/figure links. Resolve valid URL intent before the first content render to avoid flashing every layer. Invalid parameters fall back to calm orientation with a nonblocking explanation. Session/local preference persistence, if used, must be versioned and optional; do not add a new dataset or tracking.

### Proposed temporal metadata contract

Extend existing records in place where possible. Exact names to finalize after reviewing all consumers:

- Stable event/stop ID (current stops have names but no separate required ID).
- Start/end numeric bounds; precision (year, circa, range, sequence-only, unknown).
- Meaning of bounds (duration versus possible occurrence).
- Existing display label, kept for source-sensitive wording.
- Person IDs distinct from broad figure groupings; route and related entity references.
- Explicit sequence order and, where supported, route geometry segment references.
- Provenance for date/location/path: Scripture references, editorial inference rationale, or named historical source; unresolved reason where applicable.

No separate copied event database by default. Prefer derived indexes over duplicate source records. If an event is shared across routes, reference its canonical record. Inventory existing data before adding fields; make optional extensions backward compatible with Bible and Interact consumers.

Source ownership remains HistoricalBible. Proposed records are non-personal historical annotations, but external source text/licenses must be respected. Retain curated metadata as long as its feature exists; revise provenance alongside data. No automatic external ingestion or unbounded record generation. Validate IDs, date ordering, route relationships, duplicates and missing evidence.

### Rendering strategy

Separate static geography and dynamic selected-time overlays. Reuse Leaflet objects keyed by stable IDs where feasible. Compute temporal visibility once per animation frame during dragging; defer expensive labels/details as appropriate without making them stale. Preserve selected focus and avoid creating/removing listeners every frame. Profile the representative slice before choosing caches or workers. No unsupported FPS claims.

## 10. Ordered work packages and exit conditions

The work below is proposed, not completed. Each package should leave a clear checkpoint in this file and project logs. Do not deploy midway just to show progress.

### A. Establish the implementation baseline

- Re-read owner scope, frozen governance and this plan; check current git status/version and concurrent edits.
- Inspect remaining timeline/URL consumers and the current actual tile configuration. Preserve existing fixes.
- Run the existing relevant map suite once before edits. Record pre-existing failures rather than expanding into unrelated repair.
- Capture first-entry and Apostolic Age screenshots for comparison at desktop/mobile sizes.
- **Exit:** known baseline, reusable code/data identified, scope confirmed; no broad audit.

### B. Build one design proof using the real map

- Implement the calm atlas entry and compact era/controls shell in the actual page, using the current engine and realistic existing content.
- Apply the restrained palette, selected-route labels, compact key, and one realistic detail card.
- Use Apostolic Age / Paul's first journey as the representative selected-story state. No invented chronology to make the prototype look functional.
- Review hierarchy, reading comfort, control discoverability, typography, contrast and map visibility at intended sizes. Correct this slice before expanding.
- **Exit:** first entry is understandable, primary controls/map fit the viewport, selected story is readable. Technical success alone does not pass this gate.

### C. Prepare the representative chronology

- Inventory and source-review Apostolic Age events, starting with the introductory event and Paul's first journey; enumerate the exact route IDs from current data.
- Add structured temporal/identity metadata without changing canonical Scripture or asserting unverified dates.
- Include one approximate-date case, one simultaneous event and one sequence-only/undated case in the selector design/tests. Synthetic test fixtures are not production historical data.
- **Exit:** usable intervals and honest uncertainty behavior; no guessed evenly distributed waypoint dates.

### D. Implement temporal state and one end-to-end journey

- Add the authoritative exploration state and pure temporal selector; wire slider, previous/next, detail card and map to it.
- Implement near-date, selected journey-so-far, Show all and return-to-cursor behavior.
- Add partial route reveal only where segment mapping supports it; retain ordered stepping for undated stops.
- Ensure route/marker visibility updates in both forward and backward scrubbing.
- **Exit:** the six-action representative story in §4.3 works with honest source precision and passes targeted regressions.

### E. Add granular controls and date-aware categories

- Add people/individual journey selection and independent events/places/artifacts/empires controls.
- Handle combined-person routes explicitly; never relabel a combined route as solely one traveler without data support.
- Implement category presets, explicit exclusions, mixed checkbox states and useful empty results.
- Add artifact temporal relevance and contextual empire labels where reviewed metadata supports them.
- **Exit:** the user can show only people/journeys, only artifacts, or a chosen combination without time state changing unexpectedly.

### F. Expand to other eras

- Extend the proven selector/UI to each existing era; reuse entity IDs and preserve existing navigation.
- Audit chronology per era; unresolved/undated material remains accessible in sequence/context mode.
- Keep All eras as an explicit overview. Show preceding context handles Jesus/John the Baptist without putting AD 26 events into AD 50.
- **Exit:** every era has a coherent starting point, honest date coverage and no automatic all-layer overload.

### G. Integration, accessibility and delivery review

- Verify Bible companion and Interact retain their own contextual opening behavior and link contracts.
- Exercise deep links, reload, Back/Forward, reset controls, tile failure, keyboard, touch and reduced motion.
- Run scoped regression tests and canonical-source verification/build when implementation warrants it.
- Complete a separate rendered-design critique; record results and limitations with screenshots.
- Update logs and only then choose the next application version based on the actual current version. Do not preassign a release version from this plan.
- Commit/publish/deploy only if separately authorized. Confirm served assets after an authorized deployment.
- **Exit:** functionality and design both meet acceptance criteria; release status is explicit.

## 11. Regression and design acceptance matrix

Proposed test cases, NOT tests already written or executed in this session:

| Case | Required observable result |
| --- | --- |
| Fresh entry | Quiet geographic context; no all-era route wall; one obvious introduction/action |
| Era selection | Valid opening event/date; title, map, timeline and detail agree |
| Forward/back scrub | Future items hide, eligible items show, expired items retire; reversing restores exact prior state |
| Interval boundaries | Before/start/end/after behavior follows documented inclusive intervals; no random flicker |
| BC/AD boundary | No displayed year zero; correct chronological ordering |
| Approximate/unknown date | Honest labels; sequence-only records not assigned fabricated numeric dates |
| Partial journey | Only supported elapsed segments; future route and future stop numbers absent |
| Person selection | Correct individuals; combined route does not misattribute another person's movement |
| Filters | Independent toggles; mixed states; none stays none; no stale drawer or silent re-enabling |
| Show all | All dates within selected era, current filters retained; last cursor restored on return |
| End key vs Show all | End selects era's final year; separate keyboard-accessible Show all action |
| Artifact chronology | Ancient relevance is used, not modern discovery year |
| Empire context | Approximate era extent labeled; no invented year-specific border movement |
| Empty date/filter result | Explanation and useful next matching event/reset action |
| Direct links | Existing site/figure requests open correctly; malformed inputs fail calmly |
| Shared surfaces | Bible companion and Interact retain contextual focus and working links |
| Camera | Dragging date does not fight manual pan; Fit visible/Reset view do not reset filters |
| Map integrity | Existing marker coordinates, pane hierarchy, single-tooltip and clamping behavior retained |
| Keyboard/mobile | Slider/list alternatives, visible focus, usable touch targets, no hover dependence |
| Reduced motion | No obligatory camera fly/pulse/fade |
| Density | Real long labels and simultaneous journeys remain understandable; no label hides selected event |
| Tiles unavailable | Timeline, event list and reading links still usable; truthful failure notice |

Extend `tests/map.spec.ts` and `tests/map-chronology-compass.spec.ts` for entry/temporal flows; add pure selector cases using the existing supported test conventions. Keep `tests/bible-side-by-side-map.spec.ts` for shared-renderer impact. Review obsolete tests that require all toggles active, the permanent era grid, or the granular panel below the key; replace those expectations with intended behavior while retaining the regressions they originally protected.

Suggested scoped commands after implementation (check scripts/config again first):

```powershell
Set-Location E:\HistoricalBible
npx playwright test tests/map.spec.ts tests/map-chronology-compass.spec.ts tests/bible-side-by-side-map.spec.ts --project=chromium
npm run test:selfcheck
npm run build
```

Tests use the existing Playwright configuration and its managed Vite server. Do not start orphan background servers. For a reproducible defect, demonstrate the regression fails on the old behavior and passes on the correction; for new functionality, report acceptance coverage honestly rather than claiming an old test failure that was never run.

Design acceptance requires reviewing actual rendered states at 1920×1080, 1440×900, approximately 390×844 and 200% zoom: calm first arrival, one selected journey, a meaningful scrub change, Show all with comparisons, artifacts-only, and expanded mobile controls. A reader should be able to identify the period, change time, select one person's journey, enable artifacts and return to the calm preset without explanatory coaching. This is a proposed usability check, not a completed user study.

## 12. Risks and decisions to carry forward

1. **Chronology is the largest substantive work item.** Existing date prose is not ready for exact scrubbing. Deliver truthful partial coverage before pretending every stop has a year.
2. **Combined identities need normalization.** Broad figure groups may support legacy Interact links but cannot be the sole person-filter identity. Preserve compatibility.
3. **Existing evidence labels overreach if reused indiscriminately.** A Scripture-linked route does not make its geometry/date verbatim Scripture. Introduce proper annotation provenance without rewriting Scripture.
4. **Shared CSS/renderer changes can leak.** Use atlas-specific options/defaults and targeted shared-surface checks.
5. **All eras still contains much content.** Explicit advanced access and label hierarchy are necessary even after first entry is fixed.
6. **Map tiles may carry distracting modern labels.** Assess actual provider capabilities before proposing a replacement.
7. **Large-era ranges may have sparse events.** Previous/next and a filtered event list are essential; a slider alone is not enough.
8. **Historical review cannot be replaced by UI polish.** Source dates and routes per record. Do not treat current repository assertions as independently verified history.

Default design choices for continuation: preserve recognizable site identity while authentic regional sources determine map treatment; follow revision 1.1's narrowed first-slice scope; start direct `/map` in orientation; open the era timeline upon era choice; Show all preserves current filters; external traditions are opt-in; no autoplay; no geographic interpolation in first release; existing artifacts remain accessible; KJV corpus and governing documents stay untouched.

These defaults allow work to proceed once implementation is requested without requiring a new round of broad design questions. If the owner changes a decision, amend the relevant section and record the reason.

## 13. Continuation checkpoint

**Completed in this session:** live first-entry inspection, live Apostolic Age interaction and visual inspection, supplied-image review, scoped code/data/test/log inspection, this design/work plan and continuation records.

**Not completed:** rendered redesign/prototype, structured historical metadata, implementation, new tests, baseline test execution, accessibility/contrast measurements, mobile verification, commit or deployment. The wireframe is a design specification only. App remains v00.01.44.

**Next authorized implementation starting point:** Package A, then the single representative design in B. Do not repeat a broad repository audit. First read `AGENTS.md`, `principles.md`, current status and this file; inspect the few remaining consumers specified above. Ask for no further planning approval if the owner explicitly asks to implement this plan.

**Suggested continuation request:** “Implement `E:\HistoricalBible\MAP_EXPERIENCE_DESIGN_PLAN.md` revision 1.1, beginning with its narrowed calm first-entry and Apostolic Age representative slice. Apply the regional-source and evidence gates; no historical basemap or LiDAR dataset has yet been qualified. Preserve Scripture and existing map fixes. Record completed checkpoints in that file. Do not deploy without my instruction.”

**Documentation verification:** check that links/paths exist, recommendations are distinguished from completed work, the first-entry observations match the live page, and only documentation/continuity files changed. No application test suite is necessary to validate this prose-only deliverable.
