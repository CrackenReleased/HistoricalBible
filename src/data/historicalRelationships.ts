/**
 * src/data/historicalRelationships.ts
 * Time-specific, cited relationship records between biblical polities, rulers, and outside world powers.
 *
 * Invariant (HISTORICAL_WORLD_CONTEXT_BRIEF.md § Non-negotiable editorial rules):
 * - Relationships have subjects and periods: who with whom, when, in what capacity, and on what basis.
 * - 'Friend' and 'enemy' are not permanent properties of a nation. Faction labels must not be copied onto every year.
 * - Show neutral, tense, coerced, or strained states when supported by Scripture or external annals.
 * - Separate a biblical moral evaluation from secular external annals.
 */

export type HistoricalActorType = 'person' | 'kingdom' | 'empire' | 'city' | 'people_group';

export type RelationshipKind =
  | 'coerced_tribute_and_siege'
  | 'voluntary_vassalage'
  | 'coerced_captivity'
  | 'armed_conflict'
  | 'refuge'
  | 'alliance_strained'
  | 'neutral'
  | 'peaceable_fellowship'
  | 'unknown';

export interface HistoricalRelationship {
  id: string;
  actor1Id: string;
  actor1Name: string;
  actor1Type: HistoricalActorType;
  actor1Leader?: string;
  actor2Id: string;
  actor2Name: string;
  actor2Type: HistoricalActorType;
  actor2Leader?: string;
  periodLabel: string;
  startYear: number;
  endYear: number;
  relationshipKind: RelationshipKind;
  relationshipLabel: string;
  summary: string;
  perspectiveActor1: string;
  perspectiveActor2: string;
  tensionAndLimits: string;
  scriptureRefs: string[];
  scriptureOsis: string;
  additionalScriptureOsis?: string[];
  preferredWorldItemId?: string;
  attestationSources: Array<{
    title: string;
    url: string;
    provenance: string;
  }>;
  moralAssessmentBasis?: string;
}

export const HISTORICAL_RELATIONSHIPS: readonly HistoricalRelationship[] = [
  {
    id: 'judah-assyria-701bc',
    actor1Id: 'judah',
    actor1Name: 'Kingdom of Judah',
    actor1Type: 'kingdom',
    actor1Leader: 'King Hezekiah',
    actor2Id: 'assyria',
    actor2Name: 'Neo-Assyrian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Sennacherib',
    periodLabel: '701 BC (14th year of Hezekiah)',
    startYear: -701,
    endYear: -701,
    relationshipKind: 'coerced_tribute_and_siege',
    relationshipLabel: 'Armed conflict, siege, and coerced tribute following rebellion',
    summary: 'Hezekiah rebelled against Assyrian vassalage; Sennacherib invaded Judah, captured fortified towns, besieged Lachish and Jerusalem, and exacted heavy silver and gold tribute before withdrawing.',
    perspectiveActor1: 'Judah refused to continue paying tribute to the Assyrian king (2 Kings 18:7), suffered invasion of all fenced cities, yielded heavy temple and palace treasures under siege at Lachish (2 Kings 18:14–16), and was spared total conquest when Jerusalem was delivered (2 Kings 19:35–36).',
    perspectiveActor2: 'Sennacherib treated Hezekiah as a rebellious vassal who withheld tribute, boasting on the Taylor Prism of overwhelming 46 walled cities, trapping Hezekiah in Jerusalem "like a bird in a cage," and exacting 30 talents of gold and 800 talents of silver.',
    tensionAndLimits: 'Not a permanent static state: Ahaz previously sought Assyrian protection as a paying vassal (2 Kings 16:7), Hezekiah rebelled into open war (2 Kings 18:7), paid emergency tribute under siege (2 Kings 18:14), yet Jerusalem remained unconquered. Assyria was neither a constant ally nor an all-conquering occupant.',
    scriptureRefs: ['2 KINGS {18:13}–{19:37}', 'ISAIAH {36:1}–{37:38}'],
    scriptureOsis: '2Kgs.18.13',
    attestationSources: [
      {
        title: 'Taylor Prism, 1855,1028.1 · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1855-1028-1',
        provenance: 'Six-sided clay prism of Sennacherib excavated at Nineveh (1830), recording the third campaign in 701 BC.'
      }
    ],
    moralAssessmentBasis: 'Biblical observation: Scripture records Hezekiah did that which was right in the sight of the LORD and rebelled against Assyria (2 Kings 18:3,7), yet stripped temple gold under siege (2 Kings 18:15–16). Moral evaluation is cited directly from Scripture, not deduced from external annals or generic faction tags.'
  },
  {
    id: 'judah-assyria-732bc',
    actor1Id: 'judah',
    actor1Name: 'Kingdom of Judah',
    actor1Type: 'kingdom',
    actor1Leader: 'King Ahaz',
    actor2Id: 'assyria',
    actor2Name: 'Neo-Assyrian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Tiglath-Pileser III (Pul)',
    periodLabel: 'c. 734–732 BC (Syro-Ephraimite War)',
    startYear: -734,
    endYear: -732,
    relationshipKind: 'voluntary_vassalage',
    relationshipLabel: 'Sought tributary alliance and vassal submission',
    summary: 'Ahaz sent messengers to Tiglath-Pileser declaring "I am thy servant and thy son: come up, and save me", sending silver and gold from the temple to secure military intervention against Syria and Israel.',
    perspectiveActor1: 'Facing invasion from Rezin of Syria and Pekah of Israel, Ahaz voluntarily sought Assyrian military relief as a paying tributary vassal (2 Kings 16:7–9).',
    perspectiveActor2: 'Tiglath-Pileser III accepted Judah’s submission, marched against Damascus, killed Rezin, and incorporated regional kingdoms into the expanding Neo-Assyrian tribute system.',
    tensionAndLimits: 'Contrasts sharply with Hezekiah’s later rebellion: under Ahaz, Judah actively bought Assyrian assistance, illustrating that Assyria was not viewed by Judah as an eternal enemy across every generation.',
    scriptureRefs: ['2 KINGS {16:7}–{16:9}', '2 CHRONICLES {28:16}–{28:21}'],
    scriptureOsis: '2Kgs.16.7',
    attestationSources: [
      {
        title: 'Tiglath-Pileser III Nimrud Summary Inscriptions · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1848-1104-5',
        provenance: 'Cuneiform slabs listing Jehoahaz (Ahaz) of Judah paying tribute alongside regional kings.'
      }
    ],
    moralAssessmentBasis: 'Scripture condemns Ahaz for trusting in Assyria rather than the LORD, noting the Assyrian king distressed him but strengthened him not (2 Chronicles 28:20).'
  },
  {
    id: 'judah-assyria-650bc',
    actor1Id: 'judah',
    actor1Name: 'Kingdom of Judah',
    actor1Type: 'kingdom',
    actor1Leader: 'King Manasseh',
    actor2Id: 'assyria',
    actor2Name: 'Neo-Assyrian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Esarhaddon / Ashurbanipal',
    periodLabel: 'c. 650 BC',
    startYear: -670,
    endYear: -643,
    relationshipKind: 'coerced_captivity',
    relationshipLabel: 'Imperial captivity, bound with thorns, and restoration as vassal',
    summary: 'Assyrian captains took Manasseh among thorns, bound him with fetters, and carried him to Babylon; upon repenting before God, he was restored to his kingdom in Jerusalem.',
    perspectiveActor1: 'Manasseh suffered imperial arrest and deportation to Babylon by the king of Assyria, was humbled, and was subsequently allowed to return to rule as a subdued vassal (2 Chronicles 33:11–13).',
    perspectiveActor2: 'Assyrian royal annals (Esarhaddon and Ashurbanipal) list "Manasseh, king of Judah" among 22 vassal kings of the Levant compelled to provide building materials and military levies.',
    tensionAndLimits: 'Demonstrates a third distinct phase: captive deportation and subsequent imperial restoration under close imperial supervision.',
    scriptureRefs: ['2 CHRONICLES {33:11}–{33:13}'],
    scriptureOsis: '2Chr.33.11',
    attestationSources: [
      {
        title: 'Prism of Esarhaddon · British Museum BM 91028',
        url: 'https://www.britishmuseum.org/collection/object/W_1929-1012-1',
        provenance: 'Nineveh prism listing Manasseh of Judah among 22 tributary kings.'
      }
    ],
    moralAssessmentBasis: 'Scripture highlights Manasseh’s personal repentance and prayer in affliction, emphasizing God’s mercy rather than geopolitical diplomacy.'
  },
  {
    id: 'david-achish-1012bc',
    actor1Id: 'david',
    actor1Name: 'David & His Men',
    actor1Type: 'person',
    actor1Leader: 'David (in exile)',
    actor2Id: 'gath-philistines',
    actor2Name: 'Kingdom of Gath (Philistines)',
    actor2Type: 'city',
    actor2Leader: 'King Achish son of Maoch',
    periodLabel: 'c. 1012–1010 BC (David’s 16-month exile in Ziklag)',
    startYear: -1012,
    endYear: -1010,
    relationshipKind: 'refuge',
    relationshipLabel: 'Political asylum, military sanctuary, and feigned tributary vassalage',
    summary: 'Fleeing Saul’s relentless pursuit, David sought refuge with Achish king of Gath. Achish granted David the border town of Ziklag. David conducted raids against desert raiders while reporting to Achish that he fought against the south of Judah, gaining Achish’s deep confidence until the Philistine lords intervened at Aphek.',
    perspectiveActor1: 'David sought to escape Saul, reasoning "there is nothing better for me than that I should speedily escape into the land of the Philistines; and Saul shall despair of me" (1 Samuel 27:1). Maintained secret fidelity to Judah while feigning loyalty to Gath.',
    perspectiveActor2: 'Achish trusted David, believing "He hath made his people Israel utterly to abhor him; therefore he shall be my servant for ever" (1 Samuel 27:12). Achish stood ready to bring David into battle until the Philistine princes protested (1 Samuel 29:4).',
    tensionAndLimits: 'Crucial counterexample to static faction labeling: Israel and the Philistines were at open national war under King Saul, yet David found sanctuary and protection under a Philistine king; simultaneously, the other Philistine lords fiercely distrusted David and forced Achish to dismiss him before the battle of Gilboa.',
    scriptureRefs: ['1 SAMUEL {27:1}–{27:12}', '1 SAMUEL {29:1}–{29:11}'],
    scriptureOsis: '1Sam.27.1',
    attestationSources: [
      {
        title: 'Tell es-Safi Excavation Project · Bar-Ilan University',
        url: 'https://gath.wordpress.com/',
        provenance: 'Excavations at Tell es-Safi (ancient Philistine Gath) documenting extensive Iron Age I-II strata and destruction layers.'
      }
    ],
    moralAssessmentBasis: 'Scripture records David’s human fear ("I shall now perish one day by the hand of Saul", 1 Sam 27:1) and his ambiguous double-dealing at Ziklag without editorial gloss, contrasting human desperation with God’s sovereign preservation.'
  },
  {
    id: 'saul-philistines-1010bc',
    actor1Id: 'saul',
    actor1Name: 'Kingdom of Israel',
    actor1Type: 'kingdom',
    actor1Leader: 'King Saul',
    actor2Id: 'philistines',
    actor2Name: 'Philistine Pentapolis',
    actor2Type: 'people_group',
    actor2Leader: 'Philistine Lords (Princes of the Philistines)',
    periodLabel: 'c. 1010 BC (Battle of Mount Gilboa)',
    startYear: -1010,
    endYear: -1010,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Full-scale invasion, decisive defeat of Israel, and death of King Saul',
    summary: 'The Philistine lords mobilized their unified armies at Shunem and Aphek to invade Israel. Forsaken by the LORD after consulting the woman with a familiar spirit at En-dor, Saul and his sons fell on Mount Gilboa; the Philistines occupied the cities of the valley and fastened Saul’s body to the wall of Beth-shan.',
    perspectiveActor1: 'Saul was afraid, and his heart greatly trembled (1 Sam 28:5); when the LORD answered him not, he turned to witchcraft in desperation, facing imminent defeat and death.',
    perspectiveActor2: 'The Philistine lords rejected David from joining the campaign, maintained unified military focus, routed the armies of Israel at Gilboa, and celebrated victory in the house of Ashtaroth (1 Sam 31:10).',
    tensionAndLimits: 'Directly contemporaneous with David’s sanctuary under Achish: while Saul’s army was being crushed by the Philistine alliance at Gilboa, David was protected at Ziklag under Philistine royal grant, demonstrating that relationships are actor- and time-contingent.',
    scriptureRefs: ['1 SAMUEL {28:4}–{28:25}', '1 SAMUEL {31:1}–{31:13}'],
    scriptureOsis: '1Sam.31.1',
    attestationSources: [
      {
        title: 'Beth Shean Excavations · Hebrew University of Jerusalem',
        url: 'https://archaeology.huji.ac.il/beth-shean-valley-project',
        provenance: 'Stratigraphy of Iron Age I Tell Beth-Shean confirming Philistine/Egyptian presence and northern fortress structures.'
      }
    ],
    moralAssessmentBasis: 'Scripture explicitly attributes Saul’s downfall to his unfaithfulness: "So Saul died for his transgression which he committed against the LORD... and also for asking counsel of one that had a familiar spirit" (1 Chron 10:13).'
  },
  {
    id: 'israel-egypt-exodus',
    actor1Id: 'israel',
    actor1Name: 'Children of Israel',
    actor1Type: 'people_group',
    actor1Leader: 'Moses & Aaron',
    actor2Id: 'egypt',
    actor2Name: 'Kingdom of Egypt (New Kingdom)',
    actor2Type: 'kingdom',
    actor2Leader: 'Pharaoh of the Exodus',
    periodLabel: 'c. 1446 BC (Exodus & Deliverance)',
    startYear: -1446,
    endYear: -1446,
    relationshipKind: 'coerced_captivity',
    relationshipLabel: 'Generational slavery, hard bondage, plagues, and miraculous deliverance',
    summary: 'Generations after Joseph, a new king arose who knew not Joseph and subjected Israel to severe brickmaking servitude and infanticide. God sent Moses and Aaron with signs and ten plagues; Pharaoh repeatedly hardened his heart until the Passover night of the firstborn compelled Egypt to let Israel go, followed by Pharaoh’s pursuit and destruction at the Red Sea.',
    perspectiveActor1: 'Israel groaned under bitter affliction and bondage in mortar and brick (Exodus 1:13–14; 2:23); cried to the LORD, who remembered His covenant with Abraham, Isaac, and Jacob, redeemed them with a stretched out arm and great judgments, and led them through the divided sea.',
    perspectiveActor2: 'Pharaoh viewed the Hebrews as an expanding demographic security threat ("lest they multiply, and it come to pass, that, when there falleth out any war, they join also unto our enemies", Exod 1:10), demanded forced labor, hardened his heart against releasing imperial slaves ("Who is the LORD, that I should obey his voice?", Exod 5:2), and pursued them to recapture his workforce.',
    tensionAndLimits: 'Contrasts sharply with Genesis 47, where Pharaoh granted Israel the choice pasture of Goshen in honor of Joseph. Over centuries, imperial policy pivoted from hospitable royal patronage to brutal forced labor, demonstrating that political relationships change over time.',
    scriptureRefs: ['EXODUS {1:8}–{1:14}', 'EXODUS {5:1}–{5:2}', 'EXODUS {12:29}–{12:37}', 'EXODUS {14:5}–{14:31}'],
    scriptureOsis: 'Exod.12.37',
    additionalScriptureOsis: ['Exod.1.8', 'Exod.5.1', 'Exod.12.31', 'Exod.14.21'],
    preferredWorldItemId: 'shang-dynasty-bronze',
    attestationSources: [
      {
        title: 'Papyrus Anastasi VI & Leiden Papyrus 348 · British Museum / Rijksmuseum',
        url: 'https://www.britishmuseum.org/collection/object/Y_EA10247',
        provenance: 'New Kingdom administrative papyri recording the passage of Semitic nomads (Shasu/Apiru) through eastern delta frontier fortresses.'
      }
    ],
    moralAssessmentBasis: 'Scripture explicitly characterizes Egypt’s bondage as cruel oppression ("And the Egyptians made the children of Israel to serve with rigour", Exod 1:13) and records God’s righteous judgment upon the gods of Egypt (Exod 12:12).'
  },
  {
    id: 'abraham-melchizedek',
    actor1Id: 'abraham',
    actor1Name: 'Abram the Hebrew',
    actor1Type: 'person',
    actor1Leader: 'Patriarch Abram',
    actor2Id: 'salem',
    actor2Name: 'Kingdom of Salem',
    actor2Type: 'city',
    actor2Leader: 'Melchizedek, King of Salem & Priest of the Most High God',
    periodLabel: 'c. 2080 BC (Return from the Slaughter of Chedorlaomer)',
    startYear: -2080,
    endYear: -2080,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Priestly blessing, bread and wine, and mutual honor in the Most High God',
    summary: 'Returning from defeating Chedorlaomer to rescue Lot, Abram was met by Melchizedek king of Salem in the valley of Shaveh. Melchizedek brought forth bread and wine, pronounced a blessing in the name of the most high God, and Abram gave him tithes of all. In sharp contrast, Abram flatly rejected any reward from Bera king of Sodom lest Sodom claim "I have made Abram rich." (Gen 14:22–24).',
    perspectiveActor1: 'Abram honored Melchizedek as priest of the most high God (El Elyon), received his priestly blessing and bread and wine, and offered a tenth of all spoils; while simultaneously refusing even a thread or shoelatchet from the corrupt king of Sodom.',
    perspectiveActor2: 'Melchizedek, reigning in righteousness and peace at Salem, proclaimed divine benediction over Abram and praised the most high God who delivered Abram’s enemies into his hand (Gen 14:19–20).',
    tensionAndLimits: 'Crucial distinction in Genesis 14: Abram encountered two adjacent Canaanite kings in the same valley on the same day—Melchizedek king of Salem and Bera king of Sodom. Abram communed with Melchizedek and gave tithes, yet refused any gift from the king of Sodom, proving relationships are actor- and character-specific.',
    scriptureRefs: ['GENESIS {14:17}–{14:24}', 'PSALM {110:4}', 'HEBREWS {7:1}–{7:10}'],
    scriptureOsis: 'Gen.14.18',
    additionalScriptureOsis: ['Gen.14.19', 'Gen.14.20'],
    preferredWorldItemId: 'egypt-middle-kingdom-12th',
    attestationSources: [
      {
        title: 'Middle Bronze Execration Texts (Berlin & Brussels) & Amarna Letters (EA 287) · Staatliche Museen zu Berlin',
        url: 'https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/',
        provenance: 'Early 2nd millennium BC hieratic bowls and figurines naming ancient Jerusalem (Rušalimum / Urusalim).'
      }
    ],
    moralAssessmentBasis: 'Scripture celebrates Melchizedek as king of righteousness and king of peace without genealogy, an eternal royal priest and prophetic type of the Son of God (Hebrews 7:1–3).'
  },
  {
    id: 'judah-babylon-586bc',
    actor1Id: 'judah',
    actor1Name: 'Kingdom of Judah',
    actor1Type: 'kingdom',
    actor1Leader: 'King Zedekiah',
    actor2Id: 'babylon',
    actor2Name: 'Neo-Babylonian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Nebuchadnezzar II',
    periodLabel: '588–586 BC (Siege and Destruction of Jerusalem)',
    startYear: -588,
    endYear: -586,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Rebellion breaking vassal oath, 18-month siege, destruction of Solomon’s temple, and exile',
    summary: 'Zedekiah, made king by Nebuchadnezzar under solemn covenant, rebelled and sought Egyptian military help. Nebuchadnezzar laid siege to Jerusalem for eighteen months until famine prevailed; the walls were breached, Zedekiah captured at Jericho, his sons slain before his eyes at Riblah, his eyes put out, Solomon’s temple and palaces burned with fire by Nebuzaradan, and Judah carried captive to Babylon.',
    perspectiveActor1: 'Zedekiah vacillated in terror between fear of his princes and prophetic warnings from Jeremiah; Jeremiah counseled surrender ("Bring your necks under the yoke of the king of Babylon, and serve him and his people, and live", Jer 27:12), while the military faction insisted on fighting, leading to catastrophic starvation and national collapse (2 Kings 25:1–7).',
    perspectiveActor2: 'Nebuchadnezzar treated Zedekiah as a traitorous oath-breaker who violated his sworn covenant in the name of God (Ezekiel 17:15–19), bringing the full wrath of imperial punitive destruction, systematic dismantling of Jerusalem’s defensive walls, and deportation of the elites.',
    tensionAndLimits: 'Crucial internal tension: the biblical prophet Jeremiah commanded Judah to submit to Babylon and seek the peace of the city whither they were carried captive (Jer 29:7), while King Zedekiah and the false prophets rebelled, proving policy was disputed internally and not a monolithic consensus.',
    scriptureRefs: ['2 KINGS {25:1}–{25:21}', 'JEREMIAH {39:1}–{39:10}', 'JEREMIAH {52:1}–{52:30}', 'EZEKIEL {17:15}–{17:21}'],
    scriptureOsis: '2Kgs.25.1',
    additionalScriptureOsis: ['2Kgs.25.8', 'Jer.39.1', 'Jer.52.4'],
    preferredWorldItemId: 'solon-athens-reforms',
    attestationSources: [
      {
        title: 'Babylonian Chronicle (BM 21946 / ABC 5) & Lachish Ostraca · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1956-0717-1',
        provenance: 'Neo-Babylonian cuneiform tablet recording Nebuchadnezzar’s campaigns and capture of the city of Judah, supplemented by carbonized military letters from Lachish stratum II.'
      }
    ],
    moralAssessmentBasis: 'Scripture explicitly attributes the fall to Zedekiah’s rebellion against the word of the LORD spoken by Jeremiah and breaking the oath he had sworn to Nebuchadnezzar: "he stiffened his neck, and hardened his heart from turning unto the LORD God of Israel" (2 Chron 36:13).'
  },
  {
    id: 'jews-persia-cyrus-538bc',
    actor1Id: 'jews-restoration',
    actor1Name: 'Exiles of Judah & Benjamin',
    actor1Type: 'people_group',
    actor1Leader: 'Zerubbabel (Prince of Judah) & Jeshua (High Priest)',
    actor2Id: 'persia',
    actor2Name: 'Achaemenid Persian Empire',
    actor2Type: 'empire',
    actor2Leader: 'Cyrus the Great (Cyrus II)',
    periodLabel: '539–538 BC (First Year of Cyrus King of Persia)',
    startYear: -539,
    endYear: -538,
    relationshipKind: 'voluntary_vassalage',
    relationshipLabel: 'Royal restoration decree, repatriation of sacred temple vessels, and authorized reconstruction',
    summary: 'In the first year of Cyrus king of Persia, that the word of the LORD by the mouth of Jeremiah might be fulfilled, the LORD stirred up the spirit of Cyrus to issue an imperial proclamation throughout all his kingdom permitting the exiles to return to Jerusalem and rebuild the house of the LORD God of Israel, returning 5,400 gold and silver vessels taken by Nebuchadnezzar.',
    perspectiveActor1: 'The returning Jewish exiles celebrated Cyrus as God’s chosen instrument ("The LORD God of heaven hath given me all the kingdoms of the earth; and he hath charged me to build him an house at Jerusalem", Ezra 1:2) and organized 42,360 people under Zerubbabel to re-establish the altar and temple foundation.',
    perspectiveActor2: 'Cyrus practiced a deliberate imperial policy of restoring displaced peoples and repatriating confiscated cultic symbols to their native sanctuaries (as documented on the Cyrus Cylinder for Babylonian and Mesopotamian shrines) to secure provincial loyalty and divine favor across his newly conquered realm.',
    tensionAndLimits: 'Judah remained a Persian imperial province (Yehud Medinata) within the satrapy "Beyond the River" paying tribute, not an independent sovereign monarchy; neighboring adversaries (Rehum and Shimshai) later persuaded Artaxerxes to temporarily halt construction, demonstrating persistent regional friction under Persian rule.',
    scriptureRefs: ['EZRA {1:1}–{1:11}', '2 CHRONICLES {36:22}–{36:23}', 'ISAIAH {44:28}–{45:1}'],
    scriptureOsis: 'Ezra.1.1',
    additionalScriptureOsis: ['2Chr.36.22', 'Ezra.1.2'],
    preferredWorldItemId: 'classical-athens-golden-age',
    attestationSources: [
      {
        title: 'Cyrus Cylinder, BM 90920 · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941',
        provenance: 'Clay barrel cylinder discovered at Babylon (1879) inscribed in cuneiform recording Cyrus’s conquest and policy of repatriation of displaced sanctuaries.'
      }
    ],
    moralAssessmentBasis: 'Scripture prophesied Cyrus by name over a century earlier through Isaiah as the LORD’s shepherd and anointed: "He is my shepherd, and shall perform all my pleasure: even saying to Jerusalem, Thou shalt be built" (Isaiah 44:28; 45:1).'
  },
  {
    id: 'jesus-pilate-sanhedrin-ad33',
    actor1Id: 'jesus',
    actor1Name: 'The Lord Jesus Christ',
    actor1Type: 'person',
    actor1Leader: 'Jesus of Nazareth',
    actor2Id: 'rome-judaea',
    actor2Name: 'Roman Prefect Pontius Pilate & Sanhedrin',
    actor2Type: 'empire',
    actor2Leader: 'Pontius Pilate (Prefect of Judaea) & Caiaphas (High Priest)',
    periodLabel: 'AD 33 (The Trial, Condemnation & Crucifixion of Christ)',
    startYear: 33,
    endYear: 33,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Civil trial, three declarations of innocence, political coercion, and crucifixion',
    summary: 'Arrested in Gethsemane and condemned for blasphemy by the Sanhedrin under Caiaphas, Jesus was delivered to Roman Prefect Pontius Pilate. Pilate repeatedly examined Jesus, marveled at His silence, and publicly declared three times: "I find in him no fault at all." Seeking to release Him, Pilate succumbed to Jewish leadership blackmail ("If thou let this man go, thou art not Caesar’s friend"), washed his hands, scourged Jesus, and delivered Him to be crucified under the titulus "JESUS OF NAZARETH THE KING OF THE JEWS."',
    perspectiveActor1: 'Jesus testified before Pilate: "My kingdom is not of this world... To this end was I born, and for this cause came I into the world, that I should bear witness unto the truth," reminding Pilate, "Thou couldest have no power at all against me, except it were given thee from above" (John 18:36; 19:11).',
    perspectiveActor2: 'Pilate sought Roman administrative tranquility and personal political self-preservation under Emperor Tiberius; though convinced of Jesus’ innocence and warned by his wife’s dream, he feared a public riot and an accusation of maiestas (treason against Caesar) reported to Rome.',
    tensionAndLimits: 'Crucial legal distinction: Rome held the sole jus gladii (authority of capital punishment in Judaea); Pilate repeatedly attempted to release Jesus, yet surrendered legal justice to mob intimidation and political blackmail, illustrating that imperial courts could be compromised by local pressures.',
    scriptureRefs: ['MATTHEW {27:11}–{27:26}', 'LUKE {23:1}–{23:25}', 'JOHN {18:28}–{19:22}'],
    scriptureOsis: 'John.18.38',
    additionalScriptureOsis: ['Matt.27.11', 'Luke.23.4', 'John.19.16'],
    preferredWorldItemId: 'han-dynasty-eastern-ming',
    attestationSources: [
      {
        title: 'Pilate Inscription (AE 1963, 104) & Tacitus Annals 15.44 · Israel Museum',
        url: 'https://www.imj.org.il/en/collections/372990-0',
        provenance: 'Limestone block discovered in the theater at Caesarea Maritima bearing the Latin inscription "[DIS AUGUSTI]S TIBERIEUM ... [PON]TIUS PILATUS ... [PRAEF]ECTUS IUDA[EAE]".'
      }
    ],
    moralAssessmentBasis: 'Scripture records Pilate’s own verdict of absolute judicial innocence: "I find in him no fault at all" (John 18:38; Luke 23:4,14), convicting the Roman tribunal of executing an acknowledged innocent righteous Man.'
  },
  {
    id: 'paul-rome-nero-ad62',
    actor1Id: 'paul',
    actor1Name: 'Apostle Paul & The Church in Rome',
    actor1Type: 'person',
    actor1Leader: 'Apostle Paul',
    actor2Id: 'rome-imperial',
    actor2Name: 'Imperial Rome (Reign of Nero)',
    actor2Type: 'empire',
    actor2Leader: 'Emperor Nero Claudius Caesar',
    periodLabel: 'AD 60–62 (Paul’s First Roman Imprisonment)',
    startYear: 60,
    endYear: 62,
    relationshipKind: 'refuge',
    relationshipLabel: 'Appealed to Caesar: military house custody, Praetorian guard evangelization, and unhindered preaching',
    summary: 'Having exercised his legal rights as a Roman citizen to appeal unto Caesar (Acts 25:11), Paul lived two whole years in his own hired house in Rome under light military guard (bound by chain to a Praetorian soldier). Far from crushing his ministry, his custody advanced the Gospel throughout the entire imperial palace (Philippians 1:13) and allowed him to teach the Kingdom of God with all confidence, no man forbidding him.',
    perspectiveActor1: 'Paul viewed his chains not as imperial defeat, but as sovereign appointment for the defense and confirmation of the Gospel: "the things which happened unto me have fallen out rather unto the furtherance of the gospel; so that my bonds in Christ are manifest in all the palace, and in all other places" (Philippians 1:12–13).',
    perspectiveActor2: 'The Roman imperial administration under early Nero (advised by Seneca and Burrus) handled Paul’s appeal as a provincial appellate case, granting him private custody (custodia libera / militaris) where he was permitted guests, correspondence, and dictation of letters without civic harassment.',
    tensionAndLimits: 'Contrasts sharply with Nero’s later vicious persecution following the Great Fire of Rome in AD 64 (Tacitus Annals 15.44); in AD 60–62, Roman imperial law operated with administrative toleration and protection for Paul, proving that Roman official policy toward Christians varied drastically across distinct periods.',
    scriptureRefs: ['ACTS {28:16}–{28:31}', 'PHILIPPIANS {1:12}–{1:14}', 'PHILIPPIANS {4:22}'],
    scriptureOsis: 'Acts.28.30',
    additionalScriptureOsis: ['Acts.28.16', 'Phil.1.13'],
    preferredWorldItemId: 'han-dynasty-eastern-ming',
    attestationSources: [
      {
        title: 'Tacitus, Annals 13–15 & Pliny the Younger, Epistles 10.96 · Perseus Digital Library',
        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0078',
        provenance: 'Roman imperial historiography documenting early Neronian judicial administration, provincial appellate procedure, and the Praetorian guard garrison.'
      }
    ],
    moralAssessmentBasis: 'Scripture closes Acts with a triumphant statement of unhindered spiritual proclamation under imperial custody: "Preaching the kingdom of God, and teaching those things which concern the Lord Jesus Christ, with all confidence, no man forbidding him" (Acts 28:31).'
  },
  {
    id: 'abraham-abimelech-2060bc',
    actor1Id: 'abraham',
    actor1Name: 'Patriarch Abraham',
    actor1Type: 'person',
    actor1Leader: 'Abraham',
    actor2Id: 'gerar-philistines',
    actor2Name: 'Kingdom of Gerar',
    actor2Type: 'city',
    actor2Leader: 'King Abimelech & Phichol Chief Captain',
    periodLabel: 'c. 2060 BC (The Covenant of Beersheba)',
    startYear: -2060,
    endYear: -2060,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Sovereign reproof, treaty of non-aggression, and the Well of the Oath',
    summary: 'Sojourning in Gerar, Abraham prayed for Abimelech after God warned the king in a dream regarding Sarah. Later, Abimelech and his chief captain Phichol approached Abraham acknowledging "God is with thee in all that thou doest." Abraham reproved Abimelech over a well of water violently seized by Abimelech’s servants, gave seven ewe lambs as witness of digging the well, and they swore a mutual covenant of peace, naming the site Beersheba ("Well of the Oath").',
    perspectiveActor1: 'Abraham rebuked the Philistine herdsmen for seizing his well, accepted compensation and sheep and oxen from Abimelech, called on the name of the LORD the everlasting God, and sojourned in the Philistines’ land many days (Gen 21:25–34).',
    perspectiveActor2: 'Abimelech sought formal diplomatic security with Abraham’s expanding household, swearing: "swear unto me here by God that thou wilt not deal falsely with me, nor with my son, nor with my son’s son: but according to the kindness that I have done unto thee, thou shalt do unto me" (Gen 21:23).',
    tensionAndLimits: 'A peaceable regional covenant of non-aggression between early Philistine pastoral kingdoms and the patriarchs; distinct from later Iron Age military pentapolis hostility under Saul and David.',
    scriptureRefs: ['GENESIS {20:1}–{20:18}', 'GENESIS {21:22}–{21:34}'],
    scriptureOsis: 'Gen.21.31',
    additionalScriptureOsis: ['Gen.20.1', 'Gen.21.22', 'Gen.21.27'],
    preferredWorldItemId: 'ur-iii-law-code',
    attestationSources: [
      {
        title: 'Tell es-Seba (Tel Beer Sheva) Excavations · Israel Antiquities Authority',
        url: 'https://whc.unesco.org/en/list/1108/',
        provenance: 'Excavated monumental water well shaft and stratigraphy of ancient Beersheba bordering the Negev wilderness.'
      }
    ],
    moralAssessmentBasis: 'Scripture records God Himself testifying to Abimelech’s personal integrity in the matter of Sarah: "Yea, I know that thou didst this in the integrity of thy heart; for I also withheld thee from sinning against me" (Genesis 20:6).'
  },
  {
    id: 'israel-gibeonites-1405bc',
    actor1Id: 'israel',
    actor1Name: 'Congregation of Israel',
    actor1Type: 'people_group',
    actor1Leader: 'Joshua Son of Nun & The Princes',
    actor2Id: 'gibeonites',
    actor2Name: 'Hivite League of Gibeon',
    actor2Type: 'city',
    actor2Leader: 'Elders & Inhabitants of Gibeon',
    periodLabel: 'c. 1405 BC (Covenant at Gilgal & Battle of Ajalon)',
    startYear: -1405,
    endYear: -1405,
    relationshipKind: 'voluntary_vassalage',
    relationshipLabel: 'Treaty obtained by deception, sworn oath honored in God’s name, and military defense',
    summary: 'Fearing the fall of Jericho and Ai, the Gibeonites sent ambassadors with old sacks, rent wineskins, and mouldy bread feigning to come from a far country. Joshua and the princes of Israel took of their victuals and asked not counsel at the mouth of the LORD, making a league of peace to let them live. When the ruse was discovered three days later, the princes refused to touch them because they had sworn by the LORD God of Israel, making them hewers of wood and drawers of water for the altar. When five Amorite kings besieged Gibeon, Joshua marched all night and rescued Gibeon while the sun stood still.',
    perspectiveActor1: 'Israel repented of making peace without seeking God’s mouth, yet held their sacred oath inviolable despite the congregation’s complaints ("We have sworn unto them by the LORD God of Israel: now therefore we may not touch them", Josh 9:19), faithfully fighting for Gibeon’s preservation.',
    perspectiveActor2: 'The Gibeonites recognized Israel’s God had commanded the land to be given to them, choosing humble servant status under covenant protection rather than extermination ("Behold, we are in thine hand: as it seemeth good and right unto thee to do unto us, do", Josh 9:25).',
    tensionAndLimits: 'Vital demonstration of the inviolability of biblical oaths: centuries later, God sent a three-year famine upon Israel because King Saul broke this very covenant and slew the Gibeonites in nationalistic zeal (2 Samuel 21:1–2).',
    scriptureRefs: ['JOSHUA {9:1}–{9:27}', 'JOSHUA {10:1}–{10:14}', '2 SAMUEL {21:1}–{21:6}'],
    scriptureOsis: 'Josh.9.15',
    additionalScriptureOsis: ['Josh.9.3', 'Josh.10.6', 'Josh.10.12'],
    preferredWorldItemId: 'mycenaean-greece-bronze',
    attestationSources: [
      {
        title: 'El-Jib Excavations (Ancient Gibeon) · University of Pennsylvania Museum',
        url: 'https://www.penn.museum/sites/expedition/gibeon-where-the-sun-stood-still/',
        provenance: 'Discovery of inscribed jar handles reading "Gb’n" (Gibeon) and the colossal stepped rock-cut pool of Gibeon (2 Sam 2:13).'
      }
    ],
    moralAssessmentBasis: 'Scripture highlights the failure to consult God ("and asked not counsel at the mouth of the LORD", Josh 9:14), yet commands total fidelity to oaths once sworn in His holy name.'
  },
  {
    id: 'solomon-hiram-tyre-960bc',
    actor1Id: 'israel-solomon',
    actor1Name: 'Kingdom of Israel',
    actor1Type: 'kingdom',
    actor1Leader: 'King Solomon',
    actor2Id: 'tyre-phoenicia',
    actor2Name: 'Phoenician Kingdom of Tyre',
    actor2Type: 'city',
    actor2Leader: 'King Hiram I of Tyre',
    periodLabel: 'c. 965–945 BC (Solomonic Golden Age & Temple Construction)',
    startYear: -965,
    endYear: -945,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Royal commercial treaty, maritime partnership, and temple timber alliance',
    summary: 'Hiram king of Tyre, who had ever been a lover of David, sent servants to Solomon upon hearing of his accession. Solomon and Hiram contracted a mutual treaty: Hiram’s skilled Sidonian woodcutters felled cedars and firs of Lebanon, floated them in rafts along the Mediterranean to Joppa, while Solomon supplied Tyre with 20,000 measures of wheat and 20 measures of pure olive oil annually. They later partnered in a joint merchant navy sailing from Ezion-geber to Ophir.',
    perspectiveActor1: 'Solomon rejoiced in Hiram’s skilled craftsmanship and timber resources, declaring "there is not among us any that can skill to hew timber like unto the Sidonians" (1 Kings 5:6), maintaining mutual honor and calling Hiram his brother (1 Kings 9:13).',
    perspectiveActor2: 'Hiram blessed the God of Israel upon receiving Solomon’s letter: "Blessed be the LORD this day, which hath given unto David a wise son over this great people" (1 Kings 5:7), faithfully fulfilling timber and naval contracts.',
    tensionAndLimits: 'Later commercial friction arose when Solomon gave Hiram twenty cities in the land of Galilee, which pleased Hiram not and which he called the land of Cabul ("dirty/worthless", 1 Kings 9:11–13), proving diplomatic alliances retained economic self-interest.',
    scriptureRefs: ['1 KINGS {5:1}–{5:18}', '1 KINGS {9:10}–{9:28}', '2 CHRONICLES {2:1}–{2:18}'],
    scriptureOsis: '1Kgs.5.12',
    additionalScriptureOsis: ['1Kgs.5.1', '1Kgs.9.26', '2Chr.2.3'],
    preferredWorldItemId: 'egypt-tanite-psusennes',
    attestationSources: [
      {
        title: 'Menander of Ephesus & Dius Annals (quoted in Josephus Against Apion 1.17–18)',
        url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0215',
        provenance: 'Classical citations of Phoenician court records of Tyre detailing the 34-year reign of Hirom son of Abibaal and architectural exchanges with Solomon.'
      }
    ],
    moralAssessmentBasis: 'Scripture specifically records God’s gift of wisdom as the foundation of this peaceful international accord: "And the LORD gave Solomon wisdom, as he promised him: and there was peace between Hiram and Solomon; and they two made a league together" (1 Kings 5:12).'
  },
  {
    id: 'solomon-queen-sheba-935bc',
    actor1Id: 'israel-solomon',
    actor1Name: 'Kingdom of Israel',
    actor1Type: 'kingdom',
    actor1Leader: 'King Solomon',
    actor2Id: 'sheba-saba',
    actor2Name: 'Kingdom of Sheba (Sabaeans)',
    actor2Type: 'kingdom',
    actor2Leader: 'The Queen of Sheba',
    periodLabel: 'c. 935 BC (Diplomatic State Visit)',
    startYear: -935,
    endYear: -935,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Diplomatic state visit, theological inquiry, and tribute of royal spices and gold',
    summary: 'Having heard of the fame of Solomon concerning the name of the LORD, the Queen of Sheba traveled ~1,400 miles from southwestern Arabia to Jerusalem with a very great camel caravan bearing spices, very much gold, and precious stones. She tested Solomon with hard questions, observed his temple sacrifices, table, and court order until there was no more spirit in her, confessed that the half had not been told her, and praised the LORD God of Israel who delighted in Solomon.',
    perspectiveActor1: 'Solomon told her all her questions, withholding nothing from her, and granted her all her desire, whatsoever she asked, beside that which he gave her of his royal bounty (1 Kings 10:3,13).',
    perspectiveActor2: 'The Queen praised God’s covenant love for Israel: "Blessed be the LORD thy God, which delighted in thee, to set thee on the throne of Israel: because the LORD loved Israel for ever, therefore made he thee king, to do judgment and justice" (1 Kings 10:9).',
    tensionAndLimits: 'An honorable peaceful encounter founded upon the pursuit of divine wisdom and international trade; cited by the Lord Jesus Christ in Matthew 12:42 as a witness against those who reject the greater than Solomon.',
    scriptureRefs: ['1 KINGS {10:1}–{10:13}', '2 CHRONICLES {9:1}–{9:12}', 'MATTHEW {12:42}'],
    scriptureOsis: '1Kgs.10.1',
    additionalScriptureOsis: ['1Kgs.10.9', '2Chr.9.1'],
    preferredWorldItemId: 'egypt-tanite-psusennes',
    attestationSources: [
      {
        title: 'Sabaean Monumental Inscriptions & Great Dam of Marib · Deutsches Archäologisches Institut',
        url: 'https://www.dainst.org/',
        provenance: 'Epigraphy of Old South Arabian Sabaean trade networks controlling frankincense and myrrh camel caravans to the Levant.'
      }
    ],
    moralAssessmentBasis: 'Jesus Christ commends the Queen of the South for traveling from the uttermost parts of the earth to hear the wisdom of Solomon, using her as an enduring moral benchmark (Matthew 12:42).'
  },
  {
    id: 'josiah-necho-609bc',
    actor1Id: 'judah',
    actor1Name: 'Kingdom of Judah',
    actor1Type: 'kingdom',
    actor1Leader: 'King Josiah',
    actor2Id: 'egypt-saite',
    actor2Name: 'Kingdom of Egypt (Saite 26th Dynasty)',
    actor2Type: 'kingdom',
    actor2Leader: 'Pharaoh Necho II',
    periodLabel: '609 BC (Battle of Megiddo)',
    startYear: -609,
    endYear: -609,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Military interception against prophetic warning, battle of Megiddo, and death of King Josiah',
    summary: 'In 609 BC, Pharaoh Necho II marched northward along the Via Maris toward Carchemish on the Euphrates to assist the dying remnants of Assyria against the rising power of Babylon. King Josiah of Judah marched out to intercept Necho at the pass of Megiddo. Necho sent ambassadors warning Josiah: "What have I to do with thee, thou king of Judah? I come not against thee this day, but against the house wherewith I have war: for God commanded me to make haste: forbear thee from meddling with God, who is with me, that he destroy thee not." Josiah refused to turn back, disguised himself, was fatally struck by Egyptian archers in the valley of Megiddo, and was carried dead to Jerusalem amidst profound national lamentation.',
    perspectiveActor1: 'Josiah, perhaps motivated to prevent an Egyptian-Assyrian coalition from reasserting hegemony over the Levant, rejected Necho’s embassy and forced a battle on the plain of Megiddo, resulting in his tragic mortal wounding (2 Chronicles 35:22–24).',
    perspectiveActor2: 'Necho claimed divine urgency to reach the Euphrates, had no hostile intentions against Judah, and viewed Josiah’s intervention as an unprovoked obstacle to imperial Egyptian geopolitical strategy against Babylon.',
    tensionAndLimits: 'Tragic rupture: Josiah was Judah’s most devout reforming monarch ("like unto him was there no king before him", 2 Kings 23:25), yet his refusal to heed Necho’s words from the mouth of God brought immediate imperial subjugation: Necho deposed Jehoahaz, placed Jehoiakim on the throne, and levied 100 talents of silver and a talent of gold upon Judah.',
    scriptureRefs: ['2 KINGS {23:29}–{23:35}', '2 CHRONICLES {35:20}–{35:25}'],
    scriptureOsis: '2Kgs.23.29',
    additionalScriptureOsis: ['2Chr.35.20', '2Chr.35.22'],
    preferredWorldItemId: 'neo-elamite-median-coalition',
    attestationSources: [
      {
        title: 'Babylonian Chronicle BM 21901 (Fall of Nineveh) & Herodotus Histories 2.159 · British Museum / Perseus',
        url: 'https://www.britishmuseum.org/collection/object/W_1882-0714-37',
        provenance: 'Cuneiform records documenting the 609 BC Carchemish campaign between Egypt, Assyria, and Babylon, corroborated by Herodotus’s Greek account of Necho defeating the Syrians at Magdolos (Megiddo).'
      }
    ],
    moralAssessmentBasis: 'Scripture records that Josiah "hearkened not unto the words of Necho from the mouth of God" (2 Chronicles 35:22), illustrating that even the most godly king could suffer catastrophe when disregarding divine admonition.'
  },
  {
    id: 'jesus-centurion-ad28',
    actor1Id: 'jesus',
    actor1Name: 'The Lord Jesus Christ',
    actor1Type: 'person',
    actor1Leader: 'Jesus of Nazareth',
    actor2Id: 'rome-capernaum',
    actor2Name: 'Roman Garrison at Capernaum',
    actor2Type: 'people_group',
    actor2Leader: 'Centurion of Capernaum',
    periodLabel: 'c. AD 28 (Galilean Ministry at Capernaum)',
    startYear: 28,
    endYear: 28,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Roman military commander submitting to Christ’s authority; great faith commended',
    summary: 'When Jesus entered Capernaum, a Roman centurion whose servant was sick of the palsy and grievously tormented sent Jewish elders beseeching Him to heal his servant. When Jesus offered "I will come and heal him," the centurion answered: "Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed. For I am a man under authority, having soldiers under me: and I say to this man, Go, and he goeth; and to another, Come, and he cometh." Hearing this, Jesus marveled, and said to them that followed, "Verily I say unto you, I have not found so great faith, no, not in Israel." The servant was healed in the selfsame hour.',
    perspectiveActor1: 'Jesus commended the Gentile Roman soldier’s grasp of divine authority and prophesied: "many shall come from the east and west, and shall sit down with Abraham, and Isaac, and Jacob, in the kingdom of heaven" (Matthew 8:11).',
    perspectiveActor2: 'The centurion, an officer of the occupying imperial Roman army who loved the Jewish nation and built them a synagogue at Capernaum (Luke 7:5), recognized Jesus held absolute sovereign spiritual command over sickness without needing physical presence.',
    tensionAndLimits: 'Profound counterexample to viewing Roman occupying forces as monolithic persecutors: a Roman centurion demonstrated greater faith in Christ’s authority than Israel’s religious leaders, foreshadowing the inclusion of Gentile believers across the Roman empire.',
    scriptureRefs: ['MATTHEW {8:5}–{8:13}', 'LUKE {7:1}–{7:10}'],
    scriptureOsis: 'Matt.8.5',
    additionalScriptureOsis: ['Matt.8.10', 'Luke.7.2'],
    preferredWorldItemId: 'rome-augustus-principate',
    attestationSources: [
      {
        title: 'Excavations at Capernaum (Kfar Nahum) · Franciscan Custody of the Holy Land',
        url: 'https://www.custodia.org/en/sanctuaries/capernaum',
        provenance: 'Excavations of the 1st-century basalt foundation of the Capernaum synagogue under the 4th-century white limestone structure, built during the early Roman garrison period.'
      }
    ],
    moralAssessmentBasis: 'Scripture records Christ’s marveling commendation of the Centurion: "I say unto you, I have not found so great faith, no, not in Israel" (Luke 7:9).'
  },
  {
    id: 'israel-assyria-qarqar-853bc',
    actor1Id: 'israel-northern',
    actor1Name: 'Kingdom of Israel (Samaria)',
    actor1Type: 'kingdom',
    actor1Leader: 'King Ahab',
    actor2Id: 'assyria',
    actor2Name: 'Neo-Assyrian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Shalmaneser III',
    periodLabel: '853 BC (Battle of Qarqar on the Orontes)',
    startYear: -853,
    endYear: -853,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Armed coalition resistance against imperial Neo-Assyrian expansion',
    summary: 'In 853 BC, Shalmaneser III marched west toward the Mediterranean. King Ahab of Israel joined a 12-king regional defensive coalition alongside Hadadezer (Ben-hadad II) of Damascus and Irhuleni of Hamath. The Kurkh Monolith records that Ahab the Israelite (Ahabbu Sir’ilaya) fielded 2,000 chariots and 10,000 foot soldiers at the Battle of Qarqar on the Orontes, successfully halting the immediate Assyrian advance into the southern Levant.',
    perspectiveActor1: 'Ahab forged a temporary pragmatic military alliance with his former Syrian adversary Hadadezer (1 Kings 20:34) to protect Levantine trade corridors and prevent northern Israel from becoming an Assyrian tributary province.',
    perspectiveActor2: 'Shalmaneser III claimed victory across his royal annals, boasting of slaying 14,000 coalition troops and damming the Orontes with their corpses, yet his advance was checked and he was forced to return to Assyria without conquering the Levant.',
    tensionAndLimits: 'A remarkable pragmatic coalition between bitter rivals (Israel and Syria) who fought each other before and after Qarqar (1 Kings 22:1). Demonstrates that Israelite foreign policy was dynamically negotiated rather than permanently fixed.',
    scriptureRefs: ['1 KINGS {20:34}', '1 KINGS {22:1}–{22:40}'],
    scriptureOsis: '1Kgs.20.34',
    additionalScriptureOsis: ['1Kgs.22.1', '1Kgs.22.34'],
    preferredWorldItemId: 'western-zhou-gonghe-regency',
    attestationSources: [
      {
        title: 'Kurkh Monolith of Shalmaneser III (BM 118884) · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1863-0406-1',
        provenance: 'Limestone monolith found at Kurkh (Turkey) in 1861, recording Shalmaneser III’s 853 BC campaign and explicitly naming Ahab the Israelite (A-ha-ab-bu Sir-’i-la-a-a).'
      }
    ],
    moralAssessmentBasis: 'Scripture evaluates Ahab as having sold himself to work wickedness in the sight of the LORD, whom Jezebel his wife stirred up (1 Kings 21:25), despite his formidable chariot force recorded on Assyrian monuments.'
  },
  {
    id: 'israel-assyria-jehu-841bc',
    actor1Id: 'israel-northern',
    actor1Name: 'Kingdom of Israel (Samaria)',
    actor1Type: 'kingdom',
    actor1Leader: 'King Jehu Son of Nimshi',
    actor2Id: 'assyria',
    actor2Name: 'Neo-Assyrian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Shalmaneser III',
    periodLabel: '841 BC (18th Regnal Year of Shalmaneser III)',
    startYear: -841,
    endYear: -841,
    relationshipKind: 'voluntary_vassalage',
    relationshipLabel: 'Tributary submission and diplomatic vassalage to secure borders against Syria',
    summary: 'Following his violent overthrow of the Omride dynasty at Jezreel and Samaria, King Jehu faced severe military pressure from Hazael king of Syria. When Shalmaneser III invaded Syria and besieged Damascus in 841 BC, Jehu prudently sent ambassadors bearing heavy tribute of silver, gold bowls, a golden chalice, and tin to the Assyrian camp at Mount Ba’li-ra’si.',
    perspectiveActor1: 'Jehu sought Assyrian imperial counter-weight against Hazael of Damascus, who had begun cutting off Israel’s Transjordan territory (2 Kings 10:32).',
    perspectiveActor2: 'Shalmaneser III depicted Jehu on his royal Black Obelisk as "Ia-u-a mar Hu-um-ri-i" (Jehu son of Omri), recording his submission and listing his tribute items among the conquered western kings.',
    tensionAndLimits: 'Contrasts directly with Ahab’s earlier armed coalition against Assyria twelve years prior: under Jehu, Israel pivoted from coalition resistance to direct tributary vassalage to survive regional Syrian hostility.',
    scriptureRefs: ['2 KINGS {9:1}–{10:36}'],
    scriptureOsis: '2Kgs.10.32',
    additionalScriptureOsis: ['2Kgs.9.1', '2Kgs.10.31'],
    preferredWorldItemId: 'western-zhou-gonghe-regency',
    attestationSources: [
      {
        title: 'The Black Obelisk of Shalmaneser III (BM 118885) · British Museum',
        url: 'https://www.britishmuseum.org/collection/object/W_1848-1104-1',
        provenance: 'Four-sided black limestone obelisk excavated at Nimrud (ancient Calah) in 1846 by Austen Henry Layard, depicting the prostrate king of Israel.'
      }
    ],
    moralAssessmentBasis: 'Scripture records that Jehu executed divine judgment against the house of Ahab, yet took no heed to walk in the law of the LORD God of Israel with all his heart, departing not from the sins of Jeroboam (2 Kings 10:31).'
  },
  {
    id: 'jews-persia-darius-516bc',
    actor1Id: 'jews-restoration',
    actor1Name: 'Restoration Community of Yehud',
    actor1Type: 'people_group',
    actor1Leader: 'Zerubbabel, Joshua the High Priest, Haggai & Zechariah',
    actor2Id: 'persia',
    actor2Name: 'Achaemenid Persian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Darius I (Darius the Great)',
    periodLabel: '520–516 BC (Completion of the Second Temple)',
    startYear: -520,
    endYear: -516,
    relationshipKind: 'voluntary_vassalage',
    relationshipLabel: 'Imperial protection, treasury endowment, and royal confirmation of temple decree',
    summary: 'When local Persian provincial governor Tatnai questioned the authority of the Jewish elders to rebuild the temple, he petitioned King Darius I. Darius searched the royal archives at Achmetha (Ecbatana), discovered Cyrus’s original roll, and issued a stern decree commanding Tatnai to let the work of the house of God alone and to provide sheep, rams, wheat, salt, wine, and oil from the royal revenues beyond the river. The Second Temple was joyfully finished and dedicated on the 3rd of Adar in Darius’s 6th regnal year (516 BC).',
    perspectiveActor1: 'The Jewish restoration community saw God turning the heart of the Persian king to strengthen their hands in the work of the house of God (Ezra 6:22), fulfilling the prophetic exhortations of Haggai and Zechariah.',
    perspectiveActor2: 'Darius pursued imperial administrative order and religious tolerance across his 20 satrapies, requesting that the Jewish priests "offer sacrifices of sweet savours unto the God of heaven, and pray for the life of the king, and of his sons" (Ezra 6:10).',
    tensionAndLimits: 'A benevolent and law-governed imperial relationship based on Persian state archives; contrasted with earlier Samaritan obstruction under Cambyses / Pseudo-Smerdis and later regional frictions.',
    scriptureRefs: ['EZRA {5:1}–{6:22}', 'HAGGAI {1:1}–{2:23}', 'ZECHARIAH {1:1}–{8:23}'],
    scriptureOsis: 'Ezra.6.15',
    additionalScriptureOsis: ['Ezra.5.1', 'Ezra.6.1', 'Hag.1.1', 'Zech.1.1'],
    preferredWorldItemId: 'persian-achaemenid-persepolis',
    attestationSources: [
      {
        title: 'The Behistun Inscription & Persepolis Archives · UNESCO World Heritage',
        url: 'https://whc.unesco.org/en/list/1145/',
        provenance: 'Trilingual cliff inscription and Persepolis administrative tablets documenting Darius I’s postal network and satrapy decrees throughout the empire.'
      }
    ],
    moralAssessmentBasis: 'Scripture attributes the completion of the temple to the divine command working through secular imperial authority: "they builded, and finished it, according to the commandment of the God of Israel, and according to the commandment of Cyrus, and Darius, and Artaxerxes king of Persia" (Ezra 6:14).'
  },
  {
    id: 'esther-xerxes-susa-479bc',
    actor1Id: 'jews-diaspora',
    actor1Name: 'Jewish Diaspora in the Persian Empire',
    actor1Type: 'people_group',
    actor1Leader: 'Queen Esther & Mordecai the Jew',
    actor2Id: 'persia',
    actor2Name: 'Achaemenid Persian Empire',
    actor2Type: 'empire',
    actor2Leader: 'King Ahasuerus (Xerxes I)',
    periodLabel: 'c. 483–473 BC (Events of the Book of Esther)',
    startYear: -483,
    endYear: -473,
    relationshipKind: 'refuge',
    relationshipLabel: 'Imperial court favor, deliverance from state-sponsored genocide, and royal authority',
    summary: 'In the palace of Shushan (Susa), King Ahasuerus (Xerxes I) chose the Jewish orphan Hadassah (Esther) as queen. When prime minister Haman plotted the extermination of all Jews across the 127 provinces of the empire, Esther risked her life by entering the king’s inner court uncalled ("if I perish, I perish"). Ahasuerus extended the golden sceptre, hanged Haman upon his own gallows, and issued an irrevocable royal counter-decree allowing the Jews to defend themselves, elevating Mordecai to second in the kingdom and instituting the Feast of Purim.',
    perspectiveActor1: 'The Jewish people recognized sovereign divine providence acting through Esther’s royal placement ("who knoweth whether thou art come to the kingdom for such a time as this?", Esther 4:14), moving from fasting and sackcloth to gladness and feasting.',
    perspectiveActor2: 'Xerxes governed through centralized imperial law, executing his prerogative to counter foreign intrigue and preserve loyal imperial subjects throughout his vast administrative domains.',
    tensionAndLimits: 'Profound internal vulnerability: while in the royal palace, Esther was forced to conceal her Jewish heritage (Esther 2:10) until the existential crisis demanded public identification with God’s people.',
    scriptureRefs: ['ESTHER {1:1}–{10:3}'],
    scriptureOsis: 'Esth.4.14',
    additionalScriptureOsis: ['Esth.2.16', 'Esth.5.2', 'Esth.8.1'],
    preferredWorldItemId: 'persian-achaemenid-persepolis',
    attestationSources: [
      {
        title: 'Palace of Darius and Xerxes at Susa · Musée du Louvre',
        url: 'https://www.louvre.fr/en/explore/the-palace/the-palace-of-darius-i-at-susa',
        provenance: 'Excavated apadana (audience hall), column bases, and glazed brick friezes of archers at Susa matching the architectural descriptions in Esther 1:5–6.'
      }
    ],
    moralAssessmentBasis: 'Scripture celebrates Mordecai seeking the wealth of his people and speaking peace to all his seed (Esther 10:3), commending courageous faith over self-preservation.'
  },
  {
    id: 'hasmonean-seleucid-167bc',
    actor1Id: 'jews-hasmonean',
    actor1Name: 'Hasmonaean Jewish Commonwealth',
    actor1Type: 'kingdom',
    actor1Leader: 'Judas Maccabaeus & Mattathias of Modin',
    actor2Id: 'seleucid-empire',
    actor2Name: 'Seleucid Empire (Syrian Greeks)',
    actor2Type: 'empire',
    actor2Leader: 'King Antiochus IV Epiphanes',
    periodLabel: '167–164 BC (Maccabean Revolt & Cleansing of the Sanctuary)',
    startYear: -167,
    endYear: -164,
    relationshipKind: 'armed_conflict',
    relationshipLabel: 'Armed religious revolt against enforced pagan apostasy; cleansing of the Second Temple',
    summary: 'Antiochus IV Epiphanes issued imperial edicts outlawing the Torah, forbidding circumcision, and erecting the "abomination of desolation" (an altar to Olympian Zeus with swine sacrifice) upon the temple altar in Jerusalem. Mattathias and his sons sparked the Maccabean revolt from the Judean hills. Led by Judas Maccabaeus, Jewish guerrilla forces defeated successive Seleucid armies, recaptured Mount Zion, cleansed the desecrated sanctuary, and instituted the eight-day Feast of Dedication (Hanukkah).',
    perspectiveActor1: 'The faithful Jews chose armed resistance and martyrdom rather than defiling the holy covenant, fighting "for their lives and their laws" against overwhelming imperial forces.',
    perspectiveActor2: 'Antiochus sought aggressive cultural and religious Hellenization to unify his crumbling empire and finance military campaigns through temple plunder.',
    tensionAndLimits: 'Direct fulfillment of Daniel’s prophetic visions (Daniel 8:11–14, 11:31). This historic rededication was commemorated by the Lord Jesus Christ Himself in Jerusalem at the Feast of Dedication in winter (John 10:22).',
    scriptureRefs: ['DANIEL {8:11}–{8:14}', 'DANIEL {11:31}–{11:35}', 'JOHN {10:22}'],
    scriptureOsis: 'Dan.11.31',
    additionalScriptureOsis: ['Dan.8.11', 'John.10.22'],
    preferredWorldItemId: 'hellenistic-alexandria-septuagint',
    attestationSources: [
      {
        title: '1 Maccabees & Polybius Histories 26–31 · Perseus Digital Library',
        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0234',
        provenance: 'Hellenistic historiography documenting Antiochus IV’s eastern campaigns and Jewish revolts in Coele-Syria.'
      }
    ],
    moralAssessmentBasis: 'Daniel prophesied that the people that do know their God shall be strong, and do exploits (Daniel 11:32), while Christ acknowledged the Feast of Dedication by attending in Solomon’s porch (John 10:22–23).'
  },
  {
    id: 'peter-cornelius-ad38',
    actor1Id: 'peter',
    actor1Name: 'Apostle Peter & The Early Church',
    actor1Type: 'person',
    actor1Leader: 'Simon Peter',
    actor2Id: 'rome-cornelius',
    actor2Name: 'Roman Household of Caesarea',
    actor2Type: 'people_group',
    actor2Leader: 'Cornelius, Centurion of the Italian Band',
    periodLabel: 'c. AD 38–40 (The Gentile Pentecost at Caesarea)',
    startYear: 38,
    endYear: 40,
    relationshipKind: 'peaceable_fellowship',
    relationshipLabel: 'Divine breakthrough to the Gentiles; Roman military officer receiving the gospel',
    summary: 'Cornelius, a devout Roman centurion of the Italian band who feared God with all his house, gave much alms, and prayed to God alway, was commanded by an angel to send for Peter at Joppa. Meanwhile, God gave Peter the vision of the great sheet, cleansing all foods and declaring: "What God hath cleansed, that call not thou common." Peter journeyed to Caesarea, entered Cornelius’s house, and preached Christ’s death and resurrection. While Peter was speaking, the Holy Ghost fell upon all the Gentiles, who spoke with tongues, and were baptized in the name of the Lord.',
    perspectiveActor1: 'Peter realized the epochal revelation: "Of a truth I perceive that God is no respecter of persons: But in every nation he that feareth him, and worketh righteousness, is accepted with him" (Acts 10:34–35).',
    perspectiveActor2: 'Cornelius and his kin received the Word with total reverence ("Now therefore are we all here present before God, to hear all things that are commanded thee of God", Acts 10:33), receiving the same gift of the Holy Spirit as the Jewish believers at Pentecost.',
    tensionAndLimits: 'Radical overcoming of deep ceremonial barriers: Jewish believers were astonished that on the Gentiles also was poured out the gift of the Holy Ghost, leading to initial criticism in Jerusalem (Acts 11:2–3) before joyful glorification of God.',
    scriptureRefs: ['ACTS {10:1}–{10:48}', 'ACTS {11:1}–{11:18}'],
    scriptureOsis: 'Acts.10.1',
    additionalScriptureOsis: ['Acts.10.25', 'Acts.10.34', 'Acts.10.44'],
    preferredWorldItemId: 'han-dynasty-eastern-ming',
    attestationSources: [
      {
        title: 'Caesarea Maritima Roman Military Inscriptions · Israel Antiquities Authority',
        url: 'https://www.antiquities.org.il/',
        provenance: 'Epigraphic Latin inscriptions attesting the Cohors II Italica civium Romanorum stationed in Caesarea during the 1st century AD.'
      }
    ],
    moralAssessmentBasis: 'Scripture records Peter’s landmark confession: "God hath shewed me that I should not call any man common or unclean" (Acts 10:28).'
  },
  {
    id: 'john-domitian-patmos-ad95',
    actor1Id: 'john-apostle',
    actor1Name: 'Apostle John & The Seven Churches of Asia',
    actor1Type: 'person',
    actor1Leader: 'Apostle John the Beloved',
    actor2Id: 'rome-domitian',
    actor2Name: 'Imperial Roman State (Reign of Domitian)',
    actor2Type: 'empire',
    actor2Leader: 'Emperor Titus Flavius Domitianus',
    periodLabel: 'c. AD 95 (Banishment on the Isle of Patmos)',
    startYear: 95,
    endYear: 96,
    relationshipKind: 'refuge',
    relationshipLabel: 'Imperial banishment for the testimony of Jesus; apocalyptic revelation of Christ in glory',
    summary: 'Under Emperor Domitian, who demanded imperial worship as "Dominus et Deus", the aging Apostle John was exiled to the rocky penal island of Patmos in the Aegean Sea. On the Lord’s Day, John was in the Spirit and heard a great voice as of a trumpet, seeing the glorified Christ standing in the midst of the seven golden candlesticks, receiving the visions of the Book of Revelation to comfort and exhort the churches enduring Roman persecution.',
    perspectiveActor1: 'John identified himself as "your brother, and companion in tribulation, and in the kingdom and patience of Jesus Christ" (Rev 1:9), testifying that the Lamb that was slain is King of kings and Lord of lords.',
    perspectiveActor2: 'The Roman provincial administration used penal islands like Patmos (relegatio in insulam) to isolate religious leaders whose refusal of the imperial cult was seen as political sedition.',
    tensionAndLimits: 'The culmination of the apostolic era: Roman imperial power could banish the apostle to a barren rock, but could not hinder the unveiling of the final triumph of Jesus Christ and the New Jerusalem.',
    scriptureRefs: ['REVELATION {1:9}–{1:20}'],
    scriptureOsis: 'Rev.1.9',
    additionalScriptureOsis: ['Rev.1.1', 'Rev.1.18'],
    preferredWorldItemId: 'rome-domitian-empire',
    attestationSources: [
      {
        title: 'Archaeological Survey of the Isle of Patmos & Monastery of Saint John · UNESCO',
        url: 'https://whc.unesco.org/en/list/828/',
        provenance: 'Surveys of ancient Roman acropolis and penal settlement remains on Patmos, matching early patristic records of John’s exile under Domitian.'
      }
    ],
    moralAssessmentBasis: 'Scripture commends patient endurance under tribulation: "Fear none of those things which thou shalt suffer... be thou faithful unto death, and I will give thee a crown of life" (Revelation 2:10).'
  }

];

export function getRelationshipForPassage(bookOsis: string, chapter: number, verse: number): HistoricalRelationship | undefined {
  const ref = `${bookOsis}.${chapter}.${verse}`.toLowerCase();
  return HISTORICAL_RELATIONSHIPS.find(r =>
    r.scriptureOsis.toLowerCase() === ref ||
    (r.additionalScriptureOsis && r.additionalScriptureOsis.some(o => o.toLowerCase() === ref))
  );
}

export function getRelationshipsBetween(actor1Id: string, actor2Id: string): HistoricalRelationship[] {
  const a1 = actor1Id.toLowerCase();
  const a2 = actor2Id.toLowerCase();
  return HISTORICAL_RELATIONSHIPS.filter(r =>
    (r.actor1Id.toLowerCase() === a1 && r.actor2Id.toLowerCase() === a2) ||
    (r.actor1Id.toLowerCase() === a2 && r.actor2Id.toLowerCase() === a1)
  );
}

export function getRelationshipById(id: string): HistoricalRelationship | undefined {
  return HISTORICAL_RELATIONSHIPS.find(r => r.id === id);
}
