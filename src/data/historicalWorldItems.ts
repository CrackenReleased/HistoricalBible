/**
 * src/data/historicalWorldItems.ts
 * Independently sourced world conditions, civilizations, and events contemporary with biblical history.
 *
 * Invariant (HISTORICAL_WORLD_CONTEXT_BRIEF.md § Non-negotiable editorial rules):
 * - Independent world events have their own external sources and provenance.
 * - Time overlap alone does not imply biblical contact or corroboration.
 * - Any world item shown solely for temporal overlap must explicitly state: "no known contact is claimed".
 * - Intervals must be verifiable; an outside event must not be displayed outside its stated interval.
 */

export interface WorldHorizonItem {
  id: string;
  name: string;
  regionName: string;
  dateRangeLabel: string;
  startYear: number;
  endYear: number;
  summary: string;
  overlapExplanation: string;
  connectionKind: 'contemporary_overlap_no_contact' | 'direct_synchrony' | 'later_timeline';
  sourceTitle: string;
  sourceUrl: string;
  method: string;
  limit: string;
  coords?: { lat: number; lng: number };
  mapRegionId?: string;
}

export const HISTORICAL_WORLD_ITEMS: readonly WorldHorizonItem[] = [
  {
    id: 'eastern-zhou-spring-autumn',
    name: 'Eastern Zhou Dynasty · Early Spring and Autumn Period',
    regionName: 'Central Plains / Yellow River Valley, China (Luoyang)',
    dateRangeLabel: 'c. 770–476 BC (Spring and Autumn Period); c. 701 BC',
    startYear: -770,
    endYear: -476,
    summary: 'In ancient China, King Huan of Zhou ruled the Eastern Zhou from Luoyang amidst the rise of competing regional feudal hegemonies. In 701 BC, the annals record the death of Duke Zhuang of Zheng following the battle of Xuge, marking the breakdown of central royal Zhou military authority and the onset of the multi-state hegemony system.',
    overlapExplanation: 'No known contact with Judah is claimed. This world record is included solely because its independently established date range overlaps the 701 BC campaign of Sennacherib in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Spring and Autumn Annals (Chunqiu) & Zuo Zhuan · Chinese Text Project',
    sourceUrl: 'https://ctext.org/chun-qiu-zuo-zhuan',
    method: 'Astronomical and dynastic regnal calendar synchrony of independent Chinese court annals, completely independent of Near Eastern archives.',
    limit: 'The Chinese annals do not mention Judah, Israel, or Assyria, and establish only contemporary world condition, not contact.',
    coords: { lat: 34.62, lng: 112.45 },
    mapRegionId: 'china_zhou'
  },
  {
    id: 'western-zhou-early',
    name: 'Western Zhou Dynasty · Early Bronze Age Kingdom',
    regionName: 'Wei River Valley / Shaanxi & Central Plains, China (Feng & Hao)',
    dateRangeLabel: 'c. 1046–950 BC (Reigns of King Cheng and King Kang); c. 1010 BC',
    startYear: -1046,
    endYear: -950,
    summary: 'In East Asia, the early Western Zhou kings established their twin capitals at Feng and Haojing (near modern Xi’an) following the overthrow of the Shang Dynasty. During the reigns of King Cheng and King Kang, royal authority consolidated the feudal fengjian administrative structure, celebrated on large ceremonial bronze ritual vessels such as the Da Yu ding (National Museum of China).',
    overlapExplanation: 'No known contact with Israel is claimed. This world record is included solely because its independently established date range overlaps the era of King Saul and King David in ancient world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Records of the Grand Historian (Shiji, Zhou Annals) · Chinese Text Project',
    sourceUrl: 'https://ctext.org/shiji/zhou-ben-ji',
    method: 'Archaeological stratigraphy of Western Zhou royal capitals and epigraphy of inscribed ritual bronzes matched to traditional historiography.',
    limit: 'Early Zhou bronze inscriptions document internal investitures and military campaigns in the Yellow and Huai river basins; no contact with Near Eastern kingdoms exists.',
    coords: { lat: 34.25, lng: 108.72 },
    mapRegionId: 'china_zhou'
  },
  {
    id: 'egypt-middle-kingdom-12th',
    name: 'Egyptian Middle Kingdom · Twelfth Dynasty & Beni Hasan Semitic Caravan',
    regionName: 'Nile Valley & Faiyum, Egypt (Itjtawy & Beni Hasan)',
    dateRangeLabel: 'c. 1991–1786 BC (12th Dynasty); c. 1890 BC (Tomb of Khnumhotep II)',
    startYear: -1991,
    endYear: -1786,
    summary: 'During the Egyptian Middle Kingdom, the 12th Dynasty ruled from Itjtawy near the Faiyum, presiding over a classical era of literature and extensive Near Eastern trade. The famous tomb of Khnumhotep II at Beni Hasan (dated to the reign of Senusret II, c. 1890 BC) depicts a multi-generational caravan of 37 West Semitic (Aamu) travelers dressed in vibrant patterned tunics bringing cosmetics to Egypt.',
    overlapExplanation: 'No known contact with Jacob’s family in Padan-Aram is claimed. This world record is included solely because its independently established date range overlaps the era of Patriarch Jacob in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Tomb of Khnumhotep II (Beni Hasan Tomb 3) & The Story of Sinuhe · Griffith Institute / British Museum',
    sourceUrl: 'https://www.britishmuseum.org/collection/term/x120300',
    method: 'Astronomical Sothic synchronisms (Illahun/Kahun papyri) and royal administrative tomb inscriptions of the 12th Dynasty.',
    limit: 'The Beni Hasan mural confirms West Semitic family movements and distinctive patterned textiles entering Egypt during this period, but does not record individual biblical patriarchs.',
    coords: { lat: 27.93, lng: 30.88 },
    mapRegionId: 'egypt_middle_kingdom'
  },
  {
    id: 'shang-dynasty-bronze',
    name: 'Shang Dynasty · Late Bronze Age China (Yinxu / Anyang)',
    regionName: 'Anyang, Henan Province, China (Huang-He Valley)',
    dateRangeLabel: 'c. 1600–1046 BC (Shang Dynasty); c. 1446 BC (Late Bronze Age I)',
    startYear: -1600,
    endYear: -1046,
    summary: 'In East Asia, the Shang Dynasty governed the Yellow River valley with advanced piece-mold bronze metallurgy for ritual vessels and royal divination recorded on oracle bones at Yinxu. Excavations of royal tombs, such as that of queen and military general Fu Hao, reveal vast bronze hoards, jade carvings, and sacrificial vessels.',
    overlapExplanation: 'No known contact with Israel or Egypt is claimed. This world record is included solely because its independently established date range overlaps the era of the Exodus in ancient world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Yinxu Archaeological Site Excavations · UNESCO World Heritage / Institute of Archaeology CASS',
    sourceUrl: 'https://whc.unesco.org/en/list/1114/',
    method: 'Radiocarbon dating of oracle bone strata and stratigraphic excavations of the Shang royal cemetery at Anyang.',
    limit: 'Oracle bone inscriptions document Shang ancestor veneration, warfare with neighboring Fang states, and agricultural divinations in Henan; no contact with the Mediterranean or Near East existed.',
    coords: { lat: 36.12, lng: 114.32 },
    mapRegionId: 'china_shang'
  },
  {
    id: 'solon-athens-reforms',
    name: 'Archaic Greece · Solon’s Constitutional Reforms in Athens',
    regionName: 'Attica, Greece (Athens)',
    dateRangeLabel: 'c. 594–580 BC; c. 586 BC (Contemporary with Fall of Jerusalem)',
    startYear: -594,
    endYear: -580,
    summary: 'In Archaic Greece, the statesman and poet Solon was appointed archon and reconciler of Athens. Facing severe agrarian debt crisis and civil strife, Solon instituted the Seisachtheia ("shaking off of burdens"), abolishing debt slavery, canceling mortgages, and dividing citizens into four wealth classes to establish constitutional rule of law.',
    overlapExplanation: 'No known contact with Judah or Babylon is claimed. This world record is included solely because its independently established date range overlaps the era of Nebuchadnezzar’s siege of Jerusalem in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Aristotle, Constitution of the Athenians (Athenaion Politeia) & Plutarch, Life of Solon · Perseus Digital Library',
    sourceUrl: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0046',
    method: 'Attic archon lists, classical historiographical citations, and surviving poetic fragments of Solon preserved in Greek literature.',
    limit: 'Greek political reforms addressed local Athenian civic crises in the Aegean basin and had no contact with or knowledge of events in Judah.',
    coords: { lat: 37.97, lng: 23.72 },
    mapRegionId: 'greece_archaic'
  },
  {
    id: 'classical-athens-golden-age',
    name: 'Classical Greece · The Age of Pericles & The Parthenon',
    regionName: 'Athens & The Delian League, Greece (Acropolis)',
    dateRangeLabel: 'c. 450–430 BC; c. 445 BC (Contemporary with Nehemiah in Jerusalem)',
    startYear: -450,
    endYear: -430,
    summary: 'During the Golden Age of Athens under the democratic leadership of Pericles, Athens directed allied funds to construct the Acropolis monuments—chiefly the Parthenon (supervised by Phidias, Iktinos, and Kallikrates) and the Propylaea—while the tragic playwrights Sophocles and Euripides staged classic dramas.',
    overlapExplanation: 'No known contact with Nehemiah or Susa is claimed. This world record is included solely because its independently established date range overlaps the 445 BC rebuilding of Jerusalem’s walls by Nehemiah in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Thucydides, History of the Peloponnesian War & Acropolis Epigraphic Inscriptions · Perseus Digital Library',
    sourceUrl: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0200',
    method: 'Epigraphical building accounts on marble stele (IG I³ 436–451) dating the Parthenon construction between 447/6 and 432/1 BC.',
    limit: 'Attic building steles record payments for marble masons and sculptors in Athens; no interaction with the Persian satrapy of Yehud or Nehemiah took place.',
    coords: { lat: 37.971, lng: 23.726 },
    mapRegionId: 'greece_classical'
  },
  {
    id: 'han-dynasty-eastern-ming',
    name: 'Eastern Han Dynasty · Emperor Ming & Arrival of Buddhism in China',
    regionName: 'Luoyang, Henan Province, China (Han Empire)',
    dateRangeLabel: 'c. AD 58–75; c. AD 60–62 (Contemporary with Paul in Rome)',
    startYear: 58,
    endYear: 75,
    summary: 'In East Asia, Emperor Ming of Han (Liu Zhuang) ruled a unified empire from Luoyang. Dynastic annals record that in AD 64, Emperor Ming dispatched envoys to the western regions who returned with Buddhist scriptures and monks Kasyapa Matanga and Dharmaratna, founding the White Horse Temple (Baima Si) in AD 68 outside Luoyang as the cradle of Chinese Buddhism.',
    overlapExplanation: 'No known contact with Paul, Rome, or Judaea is claimed. This world record is included solely because its independently established date range overlaps the apostolic ministry of Paul in imperial Rome in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Book of the Later Han (Hou Hanshu, Annals of Emperor Ming) · Chinese Text Project',
    sourceUrl: 'https://ctext.org/hou-han-shu',
    method: 'Imperial dynastic annals of the Eastern Han court matched to early Chinese Buddhist historical records (Mouzi Lihuolun).',
    limit: 'Court annals chronicle Han relations with Central Asian kingdoms (Tarim Basin) and internal court administration; no contact with the Roman Mediterranean world took place.',
    coords: { lat: 34.68, lng: 112.45 },
    mapRegionId: 'china_han'
  },
  {
    id: 'rome-flavian-colosseum',
    name: 'Imperial Rome · Construction of the Flavian Amphitheatre (Colosseum)',
    regionName: 'Rome, Italy (Imperial Capital)',
    dateRangeLabel: 'c. AD 70–80; c. AD 70 (Destruction of Jerusalem & Temple Spoils)',
    startYear: 70,
    endYear: 80,
    summary: 'Following the siege and destruction of Jerusalem and the burning of the Second Temple by Titus in AD 70, Emperor Vespasian and Titus used the immense spoils of Judaea to finance the construction of the Flavian Amphitheatre (Colosseum) in central Rome, as commemorated on the Arch of Titus and an excavated monumental Latin dedicatory inscription.',
    overlapExplanation: 'Direct historical synchrony with biblical prophecy: Jesus explicitly prophesied of Jerusalem and the Temple, "there shall not be left here one stone upon another, that shall not be thrown down" (Matthew 24:2; Luke 19:43–44), fulfilled when Titus captured the city in AD 70.',
    connectionKind: 'direct_synchrony',
    sourceTitle: 'Colosseum Dedicatory Inscription (CIL VI 40454a) & Arch of Titus · Soprintendenza Archeologica di Roma',
    sourceUrl: 'https://parcocolosseo.it/',
    method: 'Epigraphical reconstruction of the original bronze-lettered inscription on the Colosseum: "Imp. T. Caes. Vespasianus Aug. amphitheatrum novum ex manubiis fieri iussit" (Emperor Titus ordered the new amphitheatre made from the spoils of war [Judaean war]).',
    limit: 'Directly connects Roman imperial monuments to the catastrophic destruction of the Jewish commonwealth foretold in the Gospels.',
    coords: { lat: 41.890, lng: 12.492 },
    mapRegionId: 'rome_flavian'
  },
  {
    id: 'ur-iii-law-code',
    name: 'Third Dynasty of Ur · Code of Ur-Nammu & The Great Ziggurat',
    regionName: 'Sumer / Lower Mesopotamia, Iraq (Ur)',
    dateRangeLabel: 'c. 2112–2004 BC; c. 2090 BC (Contemporary with Abram in Ur & Haran)',
    startYear: -2112,
    endYear: -2004,
    summary: 'In southern Mesopotamia, the Third Dynasty of Ur (Ur III) led a Sumerian cultural renaissance under Ur-Nammu and Shulgi. Ur-Nammu promulgated the oldest surviving legal code in human history (Code of Ur-Nammu) and erected the monumental Great Ziggurat of Ur dedicated to the moon god Nanna.',
    overlapExplanation: 'No known contact with Abram is claimed. This world record is included solely because its independently established date range overlaps the era of Abram leaving Ur of the Chaldees in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Code of Ur-Nammu (Cuneiform Tablets, Istanbul & Schøyen Collection) & British Museum Ur Excavations',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/W_1928-1010-1',
    method: 'Stratigraphic cuneiform archives and archaeological excavations by Sir Leonard Woolley at Tell el-Mukayyar (ancient Ur).',
    limit: 'Cuneiform administrative tablets document local temple grain distributions and royal court decrees; no record of Abram or monotheistic migration exists in the archive.',
    coords: { lat: 30.962, lng: 46.103 },
    mapRegionId: 'mesopotamia_ur3'
  },
  {
    id: 'mycenaean-greece-bronze',
    name: 'Late Bronze Age Greece · Mycenaean Palaces & Lion Gate',
    regionName: 'Peloponnese, Greece (Mycenae & Tiryns)',
    dateRangeLabel: 'c. 1400–1200 BC; c. 1400 BC (Contemporary with Joshua and the Judges)',
    startYear: -1400,
    endYear: -1200,
    summary: 'In the Aegean, the Mycenaean civilization flourished with fortified cyclopean citadels, royal shaft graves, tholos tombs, and the monumental Lion Gate at Mycenae. Palace administrations kept economic inventories on clay tablets inscribed in Linear B (an early form of Greek) at Pylos, Knossos, and Mycenae.',
    overlapExplanation: 'No known contact with Israel or Canaan is claimed. This world record is included solely because its independently established date range overlaps the era of Joshua and early Judges in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Mycenae Archaeological Site & Linear B Archives · National Archaeological Museum Athens',
    sourceUrl: 'https://www.namuseum.gr/en/collections/mycenaean-collection/',
    method: 'Radiocarbon dating of Mycenaean LH III destruction strata and decipherment of Linear B syllabic script by Michael Ventris.',
    limit: 'Linear B tablets deal exclusively with palace rations, wool, chariot inventories, and local landholders in Greece; no contact with the Levant occurred.',
    coords: { lat: 37.730, lng: 22.756 },
    mapRegionId: 'greece_mycenaean'
  },
  {
    id: 'egypt-tanite-psusennes',
    name: 'Egyptian Twenty-First Dynasty · The Gold Mask of Psusennes I',
    regionName: 'Nile Delta, Egypt (Tanis / Zoan)',
    dateRangeLabel: 'c. 1047–991 BC; c. 960 BC (Contemporary with King Solomon)',
    startYear: -1047,
    endYear: -943,
    summary: 'During the Third Intermediate Period, the 21st Dynasty ruled northern Egypt from Tanis in the eastern Nile Delta. The unplundered royal tomb of Pharaoh Psusennes I (excavated by Pierre Montet in 1940) yielded extraordinary treasures of solid silver sarcophagi and a pristine gold funerary mask, rivaling that of Tutankhamun.',
    overlapExplanation: 'No known direct contact with Solomon is claimed for this specific tomb, though Solomon married a Pharaoh’s daughter during this general dynastic horizon (1 Kings 3:1). Included because its date range independently documents the material culture of Egypt during the Solomonic era.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'The Royal Tombs of Tanis · Egyptian Museum Cairo',
    sourceUrl: 'https://www.britishmuseum.org/collection/term/x120302',
    method: 'Excavation stratigraphy of the Tanis necropolis (NRT III) and epigraphy of Psusennes I cartouches.',
    limit: 'Tanis royal inscriptions detail Amun-Ra temple dedications in the delta and do not mention Israel or Solomon’s temple.',
    coords: { lat: 30.976, lng: 31.880 },
    mapRegionId: 'egypt_tanite'
  },
  {
    id: 'neo-elamite-median-coalition',
    name: 'The Median Empire · Cyaxares & The Fall of Nineveh',
    regionName: 'Iranian Plateau & Upper Tigris (Ecbatana & Nineveh)',
    dateRangeLabel: 'c. 625–585 BC; 612 BC (Fall of Nineveh; Contemporary with Jeremiah & Josiah)',
    startYear: -625,
    endYear: -585,
    summary: 'On the Iranian plateau and in Upper Mesopotamia, King Cyaxares of the Medes forged an allied coalition with Nabopolassar of Babylon to overthrow the Neo-Assyrian Empire. In 612 BC, the Medes and Babylonians breached the massive walls of Nineveh, fulfilling the prophecies of Nahum and Zephaniah regarding the total desolation of the Assyrian capital.',
    overlapExplanation: 'Direct historical synchrony with biblical prophecy: The prophet Nahum foretold of Nineveh, "The gates of the rivers shall be opened, and the palace shall be dissolved" (Nahum 2:6), fulfilled when the Medes and Babylonians inundated and stormed the city in 612 BC.',
    connectionKind: 'direct_synchrony',
    sourceTitle: 'Fall of Nineveh Chronicle (BM 21901 / ABC 3) · British Museum',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/W_1882-0714-37',
    method: 'Neo-Babylonian cuneiform court chronicle dating the siege and sack of Nineveh to the month of Abu in the 14th year of Nabopolassar (August 612 BC).',
    limit: 'Directly documents the collapse of the Assyrian world empire during the prophetic ministries of Jeremiah, Zephaniah, and Habakkuk in Judah.',
    coords: { lat: 36.360, lng: 43.150 },
    mapRegionId: 'media_empire'
  },
  {
    id: 'rome-augustus-principate',
    name: 'The Roman Principate · Pax Romana & The Res Gestae of Augustus',
    regionName: 'Rome & The Mediterranean Basin (Roman Empire)',
    dateRangeLabel: '27 BC – AD 14; c. 4 BC (Contemporary with Nativity of Jesus Christ)',
    startYear: -27,
    endYear: 14,
    summary: 'Following the fall of the Roman Republic, Caesar Augustus established the Roman Principate, inaugurating the Pax Romana across the Mediterranean world. Augustus ordered provincial censuses and taxation, as commemorated in his monumental autobiographical inscription, the Res Gestae Divi Augusti (Monumentum Ancyranum).',
    overlapExplanation: 'Direct historical synchrony with Scripture: Luke 2:1 explicitly states, "And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed", setting the historical context for Joseph and Mary traveling to Bethlehem for the birth of Jesus.',
    connectionKind: 'direct_synchrony',
    sourceTitle: 'Res Gestae Divi Augusti (Monumentum Ancyranum) · Perseus Digital Library',
    sourceUrl: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0060',
    method: 'Monumental bilingual Latin/Greek inscription on the walls of the Temple of Augustus and Rome at Ankara (Ancyra), inscribed upon Augustus’s death in AD 14.',
    limit: 'Directly corroborates the imperial administrative decree of universal census and taxation recorded in Luke 2:1.',
    coords: { lat: 41.902, lng: 12.496 },
    mapRegionId: 'rome_augustan'
  },
  {
    id: 'western-zhou-gonghe-regency',
    name: 'Western Zhou Dynasty · The Gonghe Regency & First Exact Chinese Date',
    regionName: 'Yellow & Wei River Valleys, China (Haojing / Zhouyuan)',
    dateRangeLabel: 'c. 841–828 BC; 841 BC (First Year of Unbroken Exact Chinese Chronology)',
    startYear: -850,
    endYear: -820,
    summary: 'Following the popular uprising that drove King Li of Zhou into exile, the Gonghe (Joint Harmony) Regency governed the Western Zhou state from 841 to 828 BC until King Xuan ascended the throne. In the Records of the Grand Historian (Shiji), Sima Qian chose 841 BC as the absolute starting anchor for consecutive, undisputed year-by-year chronological tables in Chinese history.',
    overlapExplanation: 'No known contact with Israel or the prophet Elijah is claimed. This world record is included solely because its independently established date range overlaps the 9th-century BC prophetic ministry in Israel in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Records of the Grand Historian (Shiji, Chronological Tables & Zhou Annals) · Chinese Text Project',
    sourceUrl: 'https://ctext.org/shiji/shi-er-zhu-hou-nian-biao',
    method: 'Unbroken year-by-year continuous court astronomical and regnal tables beginning precisely with the Gonghe Regency in 841 BC.',
    limit: 'Documents royal and ducal successions in China; no contact with ancient Israel or the Levant took place.',
    coords: { lat: 34.25, lng: 108.72 },
    mapRegionId: 'china_zhou'
  },
  {
    id: 'persian-achaemenid-persepolis',
    name: 'Achaemenid Persian Empire · Darius the Great & The Behistun Inscription',
    regionName: 'Persis / Iranian Plateau (Persepolis & Behistun)',
    dateRangeLabel: 'c. 522–486 BC; c. 516 BC (Completion of the Second Temple in Jerusalem)',
    startYear: -522,
    endYear: -486,
    summary: 'King Darius I (the Great) consolidated the Achaemenid Empire stretching from the Indus to the Aegean and Egypt. Darius ordered the monumental trilingual Behistun Inscription carved into the rock face of Mount Behistun, established the satrapy administrative network with the Royal Road, and commenced construction of the ceremonial capital of Persepolis (Takht-e Jamshid).',
    overlapExplanation: 'Direct historical synchrony with Scripture: Ezra 6:15 explicitly records that the Second Temple "was finished on the third day of the month Adar, which was in the sixth year of the reign of Darius the king" (March 516 BC), following Darius’s imperial decree reaffirming the edict of Cyrus.',
    connectionKind: 'direct_synchrony',
    sourceTitle: 'The Behistun Inscription (DB) & Persepolis Administrative Tablets · UNESCO World Heritage / Oriental Institute',
    sourceUrl: 'https://whc.unesco.org/en/list/1145/',
    method: 'Trilingual cuneiform royal inscription in Old Persian, Elamite, and Babylonian commemorating Darius’s accession and imperial administrative boundaries.',
    limit: 'Provides direct imperial administrative context for the decrees of Darius cited in Ezra 5–6.',
    coords: { lat: 29.935, lng: 52.891 },
    mapRegionId: 'persia_achaemenid'
  },
  {
    id: 'classical-rome-early-republic',
    name: 'Early Roman Republic · Expulsion of Tarquin Kings & Consular Government',
    regionName: 'Latium, Central Italy (Rome)',
    dateRangeLabel: 'c. 509–450 BC; c. 509 BC (Contemporary with Haggai & Zechariah)',
    startYear: -509,
    endYear: -450,
    summary: 'In central Italy, the Roman populace expelled the Etruscan tyrant Tarquin the Proud (Lucius Tarquinius Superbus), founding the Roman Republic under the leadership of two annually elected consuls (Lucius Junius Brutus and Lucius Tarquinius Collatinus). The early Republic instituted citizen assemblies and later inscribed the Law of the Twelve Tables in the Roman Forum.',
    overlapExplanation: 'No known contact with Judah or Persia is claimed. This world record is included solely because its independently established date range overlaps the era of the Second Temple restoration in world history.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Livy, History of Rome (Ab Urbe Condita 1–3) · Perseus Digital Library',
    sourceUrl: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0026',
    method: 'Fasti Consulares (Roman consular lists) and classical historiographical records preserved by Roman historians.',
    limit: 'Documents early Latin political transitions in the Tiber valley; no interaction with the Persian satrapy of Yehud occurred.',
    coords: { lat: 41.892, lng: 12.485 },
    mapRegionId: 'rome_republic'
  },
  {
    id: 'hellenistic-alexandria-septuagint',
    name: 'Ptolemaic Kingdom · The Library of Alexandria & The Septuagint Translation',
    regionName: 'Nile Delta, Egypt (Alexandria)',
    dateRangeLabel: 'c. 332–250 BC; c. 280 BC (Greek Translation of the Hebrew Scriptures)',
    startYear: -332,
    endYear: -250,
    summary: 'Following Alexander the Great’s conquest, the Ptolemaic dynasty governed Egypt from the newly founded Mediterranean capital of Alexandria. Under Pharaoh Ptolemy II Philadelphus, the Great Library of Alexandria became the intellectual hub of the ancient Mediterranean. Seventy-two Jewish scholars translated the Torah into Greek (the Septuagint / LXX), producing the Scripture translation widely cited by the New Testament writers.',
    overlapExplanation: 'Documents the cultural, linguistic, and historical bridge between the Old and New Testaments during the Intertestamental era, producing the Greek Scriptures read across the Diaspora synagogues.',
    connectionKind: 'contemporary_overlap_no_contact',
    sourceTitle: 'Letter of Aristeas & Archaeological Excavations of Alexandria Royal Quarter · British Museum / Bibliotheca Alexandrina',
    sourceUrl: 'https://www.britishmuseum.org/collection/term/x120304',
    method: 'Papyrological fragments (Papyrus Rylands 458) and Hellenistic literary records dating the earliest Greek Torah manuscripts to the 3rd century BC.',
    limit: 'Documents Hellenistic literary and translation history in Alexandria; illuminates the linguistic background of New Testament citations.',
    coords: { lat: 31.200, lng: 29.918 },
    mapRegionId: 'ptolemaic_egypt'
  },
  {
    id: 'rome-domitian-empire',
    name: 'Imperial Rome · Emperor Domitian & The Enforced Imperial Ruler Cult',
    regionName: 'Rome & The Aegean Sea (Rome & Isle of Patmos)',
    dateRangeLabel: 'c. AD 81–96; c. AD 95 (Contemporary with the Apocalypse of John)',
    startYear: 81,
    endYear: 96,
    summary: 'The last Flavian emperor, Domitian, expanded authoritarian rule in Rome, erecting monumental civic works including the Arch of Titus and the Stadium of Domitian (Piazza Navona). Domitian demanded imperial divine honors, insisting on the title "Dominus et Deus" (Our Lord and God), and exiled political dissidents and Christians who refused to participate in imperial emperor worship.',
    overlapExplanation: 'Direct historical synchrony with Scripture: Revelation 1:9 explicitly records that the Apostle John was banished to "the isle that is called Patmos, for the word of God, and for the testimony of Jesus Christ" during Domitian’s reign.',
    connectionKind: 'direct_synchrony',
    sourceTitle: 'Suetonius, Life of Domitian & Irenaeus, Against Heresies 5.30.3 · Perseus Digital Library',
    sourceUrl: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0132',
    method: 'Roman imperial historiography and early Christian patristic testimonies (Irenaeus, Eusebius) dating the banishment of John on Patmos to the end of Domitian’s reign.',
    limit: 'Directly contextualizes the historical setting of the Book of Revelation and the imperial persecution of the Seven Churches of Asia.',
    coords: { lat: 41.890, lng: 12.492 },
    mapRegionId: 'rome_flavian'
  }
];

export function getWorldHorizonItem(id: string): WorldHorizonItem | undefined {
  return HISTORICAL_WORLD_ITEMS.find(item => item.id === id);
}

export function isWorldItemInDateInterval(item: WorldHorizonItem, year: number): boolean {
  return year >= item.startYear && year <= item.endYear;
}
