# Every-name audit — v00.01.18

Owner-approved source decision: 2026-10-16. The KJV governs identity and testimony. Hitchcock remains an attributed historical name dictionary. Strong’s Hebrew/Chaldee and Greek dictionaries provide lexical comparison; Webster’s 1828 supplies English definitions. Conflicts are disclosed rather than silently replaced with a preferred guess.

**Future foundational decisions require an explicit question and the owner’s answer before implementation. No assumed defaults.** This is the recorded owner decision for this audit, not an amendment to the frozen project charter.

## Complete coverage

The audit contains **2,620 individual records**: all 2,619 entries in the existing dictionary plus the network’s separately split spelling Phalti. It includes all 2,408 original network nodes. No entry was omitted from review because it was obscure, uncomfortable or difficult to match.

Every record has a review status, display lexical note, findings, relevant Strong identifiers and Scripture references where established. The original historical gloss is retained separately. The complete per-entry report is [name-review.csv](name-review.csv); the editable review ledger is [name-review.json](name-review.json). Runtime evidence is generated in [name_audit.json](../public/data/name_audit.json).

| Review result | Entries | Meaning |
|---|---:|---|
| Comparable dictionary glosses | 944 | Broad lexical agreement; not a claim of biblical inspiration or proof. |
| Dictionary disagreement | 1,017 | Conflicting or additional proposed meanings; not 1,017 proven false names. |
| Uncertain derivation | 460 | The approved comparison does not establish a secure derivation. |
| Multiple senses or referents | 54 | Different people, places, words or roots must remain distinct. |
| Unmatched | 85 | No secure lexical match was established; the meaning remains unresolved. |
| Term, title or expression | 60 | A dictionary entry must not automatically become a named human person. |
| **Total** | **2,620** | **Exact, duplicate-free coverage.** |

## Material corrections

| Entry or class | Problem | Corrected treatment and evidence |
|---|---|---|
| Shadrach / Hananiah | An unsupported historical gloss led the introduction. | Lead with Hananiah’s biblical identity and the three companions’ refusal of idolatry; label the foreign name’s meaning uncertain. Daniel 1:6–7; 3:16–18,27–28; Strong H7714/H7715. No moon-god etymology is asserted from Google. |
| Meshach / Mishael; Abednego / Azariah | Babylonian names and unsupported derivations obscured biblical identity. | Lead with the KJV identification and testimony, keeping lexical proposals separate. Daniel 1:6–7; 3:16–18,27–28. |
| Abednego | The dictionary spelling failed to find Abed-nego in the source index. | Restore all 14 attested references, including the hyphenated form; the three companions are connected by their actual shared passages. |
| Noah | The patriarch and Zelophehad’s daughter were blended. | Preserve the two identities and distinct lexical senses. Genesis 5:29; 6:8; Numbers 26:33; 27:1; H5146/H5270. |
| Rahab | The woman and the Egypt-related poetic spelling were blended. | Distinguish Joshua 2:1 / Hebrews 11:31 from Psalm 87:4 / Isaiah 51:9 and their separate lexical forms. |
| Eli | The priest’s name and the cry “My God” were blended. | Distinguish 1 Samuel 1:9 from Matthew 27:46; H5941 and G2241. |
| Sarah | Abraham’s wife and Asher’s daughter share the English spelling in some passages. | Keep Genesis 17:15 and Numbers 26:46 distinct. |
| Jesus | Every occurrence could be interpreted as the same bearer, and uppercase forms were missed. | Restore all six explicitly printed JESUS references; identify Joshua contexts in Acts 7:45 / Hebrews 4:8 and Jesus called Justus in Colossians 4:11. |
| Paul / Saul | Familiar renaming language can exceed the text. | Acts 13:9 says “also called Paul”; do not claim a conversion-time renaming. |
| Mark | Six imperative verbs were indexed as a person, producing false links. | Retain five personal-name occurrences; remove the six verb matches and rebuild shared-verse weights. Webster 1828’s verb sense supports the distinction. |
| Sin / English sin | A reader word lookup could apply the wilderness’s name study to an English common noun. | Require an attested name occurrence at the selected verse before showing a personal/place name study. |
| On / So / No | A blanket common-word exclusion also hid genuine names. | Restore only explicitly cited proper-name passages, not every matching English word. On: Genesis 41:45,50;46:20; Numbers 16:1. So: 2 Kings 17:4. No: Jeremiah 46:25; Ezekiel 30:14–16; Nahum 3:8. |
| Arphaxad; Javan | The pinned digital records contain conflicting genealogical descriptions. | KJV governs: Arphaxad among Shem’s sons (Genesis 10:22); Javan among Japheth’s sons (10:2). Do not assert that every original printed edition was collated. |
| Lo-ruhamah; Sherah | Digital descriptions could obscure the women’s explicit identities. | Hosea 1:6 says daughter; 1 Chronicles 7:24 identifies Sherah as a daughter and credits her building activity. |
| Lahmi; Rab-shakeh | Source descriptions conflict with the biblical setting. | Follow 1 Chronicles 20:5 for Lahmi; 2 Kings 18:17 / Isaiah 36:2 for the Assyrian setting of Rabshakeh. |
| Abba; Rabbi; Selah; Mene / Tekel / Upharsin | Terms, titles, writing and a place/term homograph could be treated as people. | Label their actual category and context. Mark 14:36; John 1:38; 2 Kings 14:7 / Psalm 3:2; Daniel 5:25–28. |
| Source spelling and capitalization | Hyphens, fused spellings and uppercase tokens prevented links. | Reviewed 104 punctuation pairs under unique normalized keys. Restore explicit literal matches only. NUN/AIN alphabetic headings are not evidence for Joshua’s father or a place appearing in those verses. |

The remaining individual disagreements and qualifications are recorded for **every entry** in the CSV/ledger, including Micah, Mishael, Jerubbaal, Ezer, Bethuel/Bethul and problematic digital cross-references. Unresolved entries stay unresolved; they were not assigned invented certainty.

## Index corrections and presentation

- **45 linked entries restored**, bringing the reader from 2,408 to **2,453** entries. These include proper names, places and biblical terms; this is not a count of unique people in the Bible.
- **200 distinct missing reference associations restored; six Mark verb associations excluded.** Corrections include uppercase names and reviewed punctuation variants.
- Recomputed all shared-verse weights from the corrected occurrence sets: **12,323** connections, compared with 12,058 in the retained original snapshot.
- Original name meanings and source records are preserved; the runtime applies a reviewed overlay. A source attribution is not silently changed from Hitchcock to Strong.
- Name introductions distinguish scriptural summaries from lexical notes. Disputed historical glosses live inside the source comparison, not as unqualified headlines.
- The Bible word inspector requires the selected verse to contain an attested name occurrence. The verified English verb sense of mark is attributed to Webster’s 1828.

## Sources, authority and limitations

- [KJV corpus](../public/data/kjv_verses.json): governing existing project text. No Scripture, PDF or source-vault text was changed. Its four unavailable website text records remain a separate issue.
- [Hitchcock publication information](https://www.ccel.org/h/hitchcock/bible_names/title.html) and [introductory uncertainty note](https://www.whatsaiththescripture.com/The.Holy.Bible/Dictionary.Scripture.Names.html). Existing digital dictionary remains unchanged; its attribution/license are retained.
- [Strong source manifest](name-sources/sources.json): pinned OpenScriptures Hebrew/Greek transcriptions, commit URLs, hashes and original CC-BY-SA headers. Original Strong dictionary text is public domain; the digital transcription has its own attribution. Header license version is not invented.
- [Webster 1828, mark](https://webstersdictionary1828.com/Dictionary/mark): the English verb sense only. No unverified Shadrach definition is attributed to Webster.

This is an **AI-assisted editorial audit of every supplied entry**, with source and coverage validation. It is not an independent human scholarly certification or a facsimile collation of every original Strong/Hitchcock/Webster page. Digital source discrepancies are labeled as such, not automatically blamed on the original author. Dictionary agreement does not establish Scripture, and absence of a secure match does not establish a name’s meaning.

The KJV resolves biblical identity conflicts; it does not necessarily state a name’s etymology. Where the approved evidence is insufficient, visible uncertainty is the correction.

## Regeneration, ownership and verification

Canonical project review: `audit/name-review.json` plus `audit/name-context-corrections.json`. Consumers: the Interact name study, graph/directory/search labels, and Bible reader word inspector. `public/data/name_audit.json` and the CSV are generated by extending the existing compiler:

```powershell
python -B scripts/build-theological-audit.py --name-review
npm run test:collection
npm run build
```

The two Strong snapshots and release notes are pinned, read-only evidence; no silent network refresh occurs. Rebuilds validate every name, unique coverage, source hashes, cited identifiers, Scripture references and occurrence exclusions. Published overlay bound: 5 MiB; current size is approximately 1.88 MB. Data consists of public biblical and lexical material, not personal user notes. Retain one current review/source snapshot; replace intentionally after future approved review, without accumulating duplicate histories or databases.

Regression: `tests/name-audit-regression.ts` fails on the prior store and passes after integration. It checks full coverage, exact source excerpts/hashes, the disputed Shadrach headline, distinct identities, six removed Mark verbs, six uppercase JESUS references, restored Abed-nego, proper On/So/No matches, contextual English lookup, and safe handling if the lexical resource is unavailable. Existing collection invariants check every corrected edge weight. Browser flows are additionally recorded in `tests/interact.spec.ts` (NAME-01).
