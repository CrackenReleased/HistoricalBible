/** Reviewed claim records. These annotate, and never modify, canonical Scripture. */
import type { ArchaeologicalSite } from './ancientMapData';
export interface EvidenceReceipt {
  id: string;
  siteId: string;
  scriptureRef: string;
  claim: string;
  claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION';
  status: 'attested' | 'inferred' | 'proposed' | 'disputed' | 'unknown';
  sourceTitle: string;
  sourceRecord: string;
  sourceUrl: string;
  datingSourceTitle: string;
  datingSourceUrl: string;
  dateRange: string;
  connectionMethod: string;
  limitation: string;
  reuse: string;
  relatedRecord?: {
    label: string;
    claim: string;
    sourceTitle: string;
    sourceUrl: string;
    originalTitle: string;
    originalUrl: string;
    limitation: string;
  };
}

export const EVIDENCE_RECEIPTS: Readonly<Record<string, EvidenceReceipt>> = {
  'pilate-stone': {
    id: 'pilate-prefect-caesarea',
    siteId: 'pilate-stone',
    scriptureRef: 'Luke.3.1',
    claim: 'A fragmentary Latin dedication found at Caesarea names Pontius Pilate as prefect of Judea.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Inscriptions of Israel/Palestine, The Portrayals of Pilate',
    sourceRecord: 'caes0043 (Pilate dedication)',
    sourceUrl: 'https://www.inscriptionsisraelpalestine.org/story/the-portrayals-of-pilate/',
    datingSourceTitle: 'Inscriptions of Israel/Palestine, caes0043 catalog dating',
    datingSourceUrl: 'https://search.inscriptionsisraelpalestine.org/inscriptions?page=14',
    dateRange: 'Corpus range AD 31–36; Pilate’s office lasted longer than this object range',
    connectionMethod: 'Luke 3:1 names Pilate governing Judea. The independent Latin stone gives Pilate’s name and prefect title; the passage and inscription refer to the same provincial official.',
    limitation: 'The dedication is fragmentary and partly restored. It does not mention Jesus, describe a trial, or independently date every event in Luke.',
    reuse: 'Corpus metadata paraphrased with a direct record link. No full inscription transcription or photograph copied.'
  },
  'erastus-inscription': {
    id: 'corinth-erastus-pavement',
    siteId: 'erastus-inscription',
    scriptureRef: 'Rom.16.23',
    claim: 'Corinthian theater pavement slabs preserve a Latin dedication by a man named Erastus in connection with his aedileship.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'proposed',
    sourceTitle: 'American School of Classical Studies at Athens, Corinth VIII.3',
    sourceRecord: 'Inscription no. 232, inventory 2436',
    sourceUrl: 'https://www.ascsa.edu.gr/publications/book/?i=9780876610831',
    datingSourceTitle: 'John Harvey Kent, Corinth VIII.3, no. 232',
    datingSourceUrl: 'https://www.ascsa.edu.gr/uploads/media/oa_ebooks/oa_corinth/Corinth_VIII_3.pdf',
    dateRange: 'Lettering: first half of first century AD (excavation edition)',
    connectionMethod: 'Romans 16:23 names Erastus as city steward. The Corinth inscription names an Erastus associated with an aedileship; a personal identification is proposed, not established by the shared name.',
    limitation: 'Greek oikonomos in Romans and Latin aedile in the inscription are different office terms. The pavement gives no link to Paul, and the original excavation interpretation of identity is an argument, not inscriptional fact.',
    reuse: 'Excavation publication identifier and short paraphrase linked. No inscription transcription, plate, or photograph copied.'
  },
  'pool-of-siloam-steps': {
    id: 'late-second-temple-siloam-pool',
    siteId: 'pool-of-siloam-steps',
    scriptureRef: 'John.9.7',
    claim: 'An excavation at the southern City of David exposed part of a large stepped pool identified by its excavators as the late Second Temple Pool of Siloam.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'inferred',
    sourceTitle: 'Ronny Reich and Eli Shukron, The Pool of Siloam in Jerusalem of the Late Second Temple Period and Its Surroundings',
    sourceRecord: 'IAA permit A-4192/2004 and subsequent 2005–2007 permits; excavation chapter DOI 10.5325/j.ctv1bxgwc2.17',
    sourceUrl: 'https://doi.org/10.5325/j.ctv1bxgwc2.17',
    datingSourceTitle: 'Reich and Shukron excavation report',
    datingSourceUrl: 'https://doi.org/10.5325/j.ctv1bxgwc2.17',
    dateRange: 'Late Second Temple period; the excavated pool has Hasmonean and Roman phases',
    connectionMethod: 'John 9:7 names Siloam. The excavators identify this stepped pool at the southern end of the City of David as the period pool; the connection is a place identification.',
    limitation: 'The excavated portion and its identification provide setting, not an independent account of the healing or proof that every point of the Gospel scene took place at a particular step.',
    reuse: 'Excavators’ publication metadata paraphrased with a DOI link. No excavation photo, plan, or full text copied.'
  },
  'ketef-hinnom-scrolls': {
    id: 'ketef-hinnom-priestly-blessing',
    siteId: 'ketef-hinnom-scrolls',
    scriptureRef: 'Num.6.24',
    claim: 'Two silver amulets from Ketef Hinnom preserve early wording also found in the Hebrew Bible’s priestly blessing.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Barkay, Lundberg, Vaughn and Zuckerman, The Amulets from Ketef Hinnom: A New Edition and Evaluation',
    sourceRecord: 'Ketef Hinnom amulets I and II; BASOR 334 (2004), 41–71; DOI 10.2307/4150106',
    sourceUrl: 'https://doi.org/10.2307/4150106',
    datingSourceTitle: 'Barkay and colleagues, revised epigraphic evaluation',
    datingSourceUrl: 'https://doi.org/10.2307/4150106',
    dateRange: 'Late pre-exilic period (edition conclusion; no exact year)',
    connectionMethod: 'Numbers 6:24–26 includes priestly blessing language also read on the two amulets. This is a textual parallel across witnesses, not an event synchrony.',
    limitation: 'The small damaged amulets do not date the composition of the whole Torah, establish a complete Numbers manuscript, or prove a particular liturgical setting. Readings depend on imaging and editorial reconstruction.',
    reuse: 'Published edition abstract and identifiers paraphrased with a DOI link. No amulet image or full transcription copied; publisher retains text and image rights.'
  },
  'sargon-prism': {
    id: 'sargon-khorsabad-samaria',
    siteId: 'sargon-prism',
    scriptureRef: '2Kgs.17.6',
    claim: 'A Khorsabad palace wall inscription of Sargon II claims that he conquered Samaria and the land of Israel.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Royal Inscriptions of the Neo-Assyrian Period, Sargon II corpus',
    sourceRecord: 'RINAP 2, Sargon II 007 / ORACC Q006488, palace wall slab',
    sourceUrl: 'https://oracc.museum.upenn.edu/rinap/rinap2/Q006488',
    datingSourceTitle: 'RINAP 2 editor commentary on Sargon’s accession and Samaria campaign',
    datingSourceUrl: 'https://oracc.museum.upenn.edu/rinap/rinap2/Q006488',
    dateRange: 'Late eighth century BC; 722 and 720 BC figure in competing campaign reconstructions',
    connectionMethod: '2 Kings 17:6 describes the Assyrian taking of Samaria. The independent Assyrian royal text claims conquest of the same city and country.',
    limitation: 'This is Sargon’s royal viewpoint. It does not settle every stage of Samaria’s fall, prove the exact year of every deportation, or identify all deportees as particular tribes. Numerals vary across exemplars and are not asserted in the card.',
    reuse: 'Scholarly corpus record and identifiers paraphrased with a link. No full transliteration, translation, or relief image copied.'
  },
  'merneptah-stele': {
    id: 'merneptah-israel-name',
    siteId: 'merneptah-stele',
    scriptureRef: 'Exod.1.1',
    claim: 'Merneptah’s Egyptian victory stele includes a hieroglyphic group commonly read as Israel in its Canaan campaign text.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'University College London Digital Egypt, Merenptah mortuary temple stele',
    sourceRecord: 'Egyptian Museum Cairo JE 31408; UCL object and inscription guide',
    sourceUrl: 'https://www.ucl.ac.uk/museums-static/digitalegypt/thebes/merenptah/stela.html',
    datingSourceTitle: 'Metropolitan Museum of Art, Assyria to Iberia catalog discussion of Merneptah',
    datingSourceUrl: 'https://resources.metmuseum.org/resources/metpublications/pdf/Assyria_to_Iberia_Art_and_Culture_in_the_Iron_Age.pdf',
    dateRange: 'Merneptah’s reign, approximately 1213–1203 BC; the stele is conventionally placed late in that reign',
    connectionMethod: 'Exodus 1:1 uses the name Israel in its own narrative. The much later Egyptian text is compared only as an independent use of the name for a Canaanite group.',
    limitation: 'The stele does not describe the Exodus, identify Moses, date the biblical episode, or prove that the named group was an established nation. The reading and referent have scholarly discussion.',
    reuse: 'UCL object guide and museum publication paraphrased with links. No full hieroglyphic text or image copied.'
  },
  'siloam-inscription': {
    id: 'siloam-tunnel-workers-inscription',
    siteId: 'siloam-inscription',
    scriptureRef: '2Kgs.20.20',
    claim: 'The Siloam tunnel inscription commemorates ancient Jerusalem tunnel cutting but does not name its royal sponsor.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'disputed',
    sourceTitle: 'Rendsburg and Schniedewind, The Siloam Tunnel Inscription',
    sourceRecord: 'KAI 189; Israel Exploration Journal 60 (2010), 188–203',
    sourceUrl: 'https://jewishstudies.rutgers.edu/images/documents/faculty/Rendsburg/IEJ_Siloam.pdf',
    datingSourceTitle: 'Reich and Shukron, The Date of the Siloam Tunnel Reconsidered',
    datingSourceUrl: 'https://doi.org/10.1179/033443511x13099584885268',
    dateRange: 'Iron Age; commonly assigned to the late eighth century BC, with an excavator proposal for an earlier eighth-century completion',
    connectionMethod: '2 Kings 20:20 credits Hezekiah with making a conduit. The inscription is from a Jerusalem conduit, so the texts may concern the same water system, but the stone does not identify the king.',
    limitation: 'The royal assignment and exact date remain disputed. The inscription does not say the tunnel was built for the Assyrian siege, name Hezekiah, or independently establish every detail in 2 Kings.',
    reuse: 'Peer-reviewed studies and KAI identifier paraphrased with links. No full inscription or artifact photograph copied.'
  },
  'lachish-ostraca': {
    id: 'lachish-letter-four-azekah',
    siteId: 'lachish-ostraca',
    scriptureRef: 'Jer.34.7',
    claim: 'Lachish Letter 4 is a late Judahite ostracon that refers to signals involving Lachish and Azekah.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'disputed',
    sourceTitle: 'Oxford Research Archive, Lachish 4 catalog entry',
    sourceRecord: 'IAA 1938–128 / field 4025 / KAI 194; Israel Museum, Jerusalem',
    sourceUrl: 'https://ora.ox.ac.uk/objects/uuid:db71cf81-ba6c-4a91-8e51-3c694993ebfe',
    datingSourceTitle: 'Oxford Research Archive catalog, archaeological and script dating',
    datingSourceUrl: 'https://ora.ox.ac.uk/objects/uuid:db71cf81-ba6c-4a91-8e51-3c694993ebfe',
    dateRange: 'Late seventh to early sixth century BC; archaeological context ends around 588/587 BC',
    connectionMethod: 'Jeremiah 34:7 and Lachish Letter 4 both name Lachish and Azekah in late Judahite contexts. This is a place-name and period comparison, not a claim that both were written the same week.',
    limitation: 'The signal report has competing readings; a 2024 scholarly reading rejects the common inference that Azekah had already fallen. The letter does not mention Jeremiah or date the verse.',
    reuse: 'Oxford catalog identifiers and a short paraphrase of the letter’s subject linked. No full transcription or object image copied.'
  },
  'jehoiachin-ration-tablets': {
    id: 'jehoiachin-babylon-oil-ration',
    siteId: 'jehoiachin-ration-tablets',
    scriptureRef: '2Kgs.25.27',
    claim: 'A sixth-century Babylonian oil ration tablet names the king of Judah among people receiving provisions at Nebuchadnezzar II’s court.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Staatliche Museen zu Berlin, Vorderasiatisches Museum collection',
    sourceRecord: 'VAT 16378 / object 1743721',
    sourceUrl: 'https://search.smb.museum/en/object/obj-1743721',
    datingSourceTitle: 'Berlin Vorderasiatisches Museum object record',
    datingSourceUrl: 'https://search.smb.museum/en/object/obj-1743721',
    dateRange: 'Sixth century BC (museum catalog range)',
    connectionMethod: '2 Kings 25:27–30 names Jehoiachin in Babylon. The independent ration tablet identifies Judah’s king in a Babylonian palace provision list; it offers historical context for his presence there.',
    limitation: 'The tablet records oil rations, not the later release by Evil-merodach or the full narrative of 2 Kings 25. The museum record does not support the previous claims about five sons, barley, or an exact 592 BC date for this tablet.',
    reuse: 'Museum object metadata paraphrased and linked. The catalog credits a CC BY-SA 4.0 photograph; no image or full tablet text copied.'
  },
  'sergius-paulus-inscription': {
    id: 'soloi-paulus-proconsul',
    siteId: 'sergius-paulus-inscription',
    scriptureRef: 'Acts.13.7',
    claim: 'A Greek inscription from Soloi in Cyprus mentions a proconsul named Paulus; identification with Sergius Paulus in Acts is proposed.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'proposed',
    sourceTitle: 'T. B. Mitford, Notes on Some Published Inscriptions of Roman Cyprus',
    sourceRecord: 'Soloi inscription IGRR III 930; Annual of the British School at Athens 42 (1947)',
    sourceUrl: 'https://www.cambridge.org/core/journals/annual-of-the-british-school-at-athens/article/abs/notes-on-some-published-inscriptions-of-roman-cyprus1/25FFC6A3A9F921ACDD23A971646A1795',
    datingSourceTitle: 'Mitford’s epigraphic assessment of Cypriot inscriptions',
    datingSourceUrl: 'https://www.cambridge.org/core/journals/annual-of-the-british-school-at-athens/article/abs/notes-on-some-published-inscriptions-of-roman-cyprus1/25FFC6A3A9F921ACDD23A971646A1795',
    dateRange: 'Roman period; this inscription does not securely date the Acts 13 encounter',
    connectionMethod: 'Acts 13:7 names Sergius Paulus as proconsul of Cyprus. IGRR III 930 gives a proconsul Paulus in Cyprus, but only the cognomen and office overlap.',
    limitation: 'The Soloi inscription does not preserve Sergius or a link to the apostle. Other inscriptions from Rome and Pisidian Antioch are distinct objects and cannot be merged into one person or used to explain Paul’s itinerary without further evidence.',
    reuse: 'Published inscription ID and critical scholarly assessment paraphrased with a link. No inscription text or photograph copied.'
  },
  'caiaphas-ossuary': {
    id: 'caiaphas-family-ossuary',
    siteId: 'caiaphas-ossuary',
    scriptureRef: 'Matt.26.57',
    claim: 'A documented Jerusalem ossuary bears an inscription read as “Joseph son of Caiaphas”; identification with the Gospel high priest is proposed.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'proposed',
    sourceTitle: 'Zvi Greenhut, excavation account of the Caiaphas family tomb',
    sourceRecord: '1990 rescue excavation, southern Jerusalem, ossuary in loculus IV',
    sourceUrl: 'https://jamestabor.com/wp-content/uploads/2018/03/Burial-Cave-of-the-Caiaphas-Family.pdf',
    datingSourceTitle: 'The Israel Museum Caiaphas ossuary exhibition',
    datingSourceUrl: 'https://www.imj.org.il/en/exhibitions/ossuary-caiaphas-high-priest-18-36-ce',
    dateRange: 'First century AD; tomb use extends at least into AD 42–43',
    connectionMethod: 'Matthew 26:57 names Caiaphas as high priest. The excavated ossuary gives a closely related family name; connecting the remains to the individual in Matthew requires further identification beyond the inscription.',
    limitation: 'The inscription does not give the bearer’s office. The ossuary held several people, and a coin from another ossuary dates later tomb use; neither fact proves whose remains were in this box.',
    reuse: 'Excavation account and museum exhibition paraphrased with links. Only the short identifying name is rendered; no full transcription or photograph copied.'
  },
  'arch-of-titus-spoils': {
    id: 'arch-titus-jerusalem-spoils',
    siteId: 'arch-of-titus-spoils',
    scriptureRef: 'Luke.21.20',
    claim: 'The Arch of Titus in Rome depicts soldiers carrying spoils from the Jerusalem Temple.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Parco archeologico del Colosseo',
    sourceRecord: 'Arch of Titus, Roman Forum, inner spoils panel',
    sourceUrl: 'https://colosseo.it/en/marvels/arch-of-titus/',
    datingSourceTitle: 'Parco archeologico del Colosseo conservation account',
    datingSourceUrl: 'https://colosseo.it/en/restauri/arch-of-titus/',
    dateRange: 'Jewish War in AD 70–71; monument constructed after AD 81',
    connectionMethod: 'Luke 21:20–24 speaks of Jerusalem under siege. The later Roman monument celebrates the Jewish War and shows Temple spoils, supplying a separate witness to the Roman conquest.',
    limitation: 'The arch does not state when Luke’s words were spoken or establish every detail of the passage. Its relief is Roman triumphal art with its own political purpose.',
    reuse: 'Official monument description paraphrased with links. No relief image copied.'
  },
  'dead-sea-scrolls-qumran': {
    id: 'great-isaiah-scroll-textual-witness',
    siteId: 'dead-sea-scrolls-qumran',
    scriptureRef: 'Isa.40.8',
    claim: 'The Great Isaiah Scroll is an early Hebrew manuscript preserving all 66 chapters of Isaiah.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'The Israel Museum, Great Isaiah Scroll exhibition',
    sourceRecord: '1QIsaᵃ; 54 columns, 7.34 meters',
    sourceUrl: 'https://www.imj.org.il/sites/default/files/IMJ%20Great%20Isaiah%20Scroll%20Exhibition.pdf',
    datingSourceTitle: 'The Israel Museum manuscript description',
    datingSourceUrl: 'https://www.imj.org.il/sites/default/files/IMJ%20Great%20Isaiah%20Scroll%20Exhibition.pdf',
    dateRange: 'Approximately 125 BC (museum estimate)',
    connectionMethod: 'Isaiah 40:8 is within a book attested by this early Hebrew manuscript. The link is textual transmission, not a claim that the scroll documents an event in the passage.',
    limitation: 'The manuscript does not itself establish a prophecy’s fulfillment, resolve all textual variants, or serve as the project’s canonical KJV source.',
    reuse: 'Museum manuscript metadata paraphrased and linked. No manuscript image or transcription copied.'
  },
  'black-obelisk': {
    id: 'shalmaneser-jehu-tribute',
    siteId: 'black-obelisk',
    scriptureRef: '2Kgs.9.1',
    claim: 'Shalmaneser III’s Black Obelisk records tribute associated with Jehu of Israel.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'British Museum / Cuneiform Digital Library Initiative',
    sourceRecord: 'BM 118885 / 1848,1104.1 / CDLI P423554',
    sourceUrl: 'https://cdli.earth/artifacts/423554',
    datingSourceTitle: 'British Museum object catalog',
    datingSourceUrl: 'https://www.britishmuseum.org/collection/object/W_1848-1104-1',
    dateRange: 'Obelisk made about 825 BC; tribute associated with Jehu around 841 BC',
    connectionMethod: '2 Kings 9–10 identifies Jehu in Israel. The Assyrian royal inscription names a tribute bearer associated with Jehu; it gives an independent contemporary political context.',
    limitation: '2 Kings does not describe this tribute. The person pictured may be Jehu or an envoy; the monument does not show his accession or verify the full narrative.',
    reuse: 'Object identifiers and catalog descriptions paraphrased with links. No relief photograph or inscription text copied.'
  },
  'nabonidus-cylinder': {
    id: 'nabonidus-cylinder-belshazzar',
    siteId: 'nabonidus-cylinder',
    scriptureRef: 'Dan.5.1',
    claim: 'The British Museum catalogs Belshazzar as named in a Nabonidus cylinder excavated at Ur.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'British Museum collection',
    sourceRecord: 'K.1689 / museum 91125 / CDLI P393977',
    sourceUrl: 'https://www.britishmuseum.org/collection/object/W_K-1689',
    datingSourceTitle: 'British Museum object catalog',
    datingSourceUrl: 'https://www.britishmuseum.org/collection/object/W_K-1689',
    dateRange: '556–539 BC (museum production range)',
    connectionMethod: 'Daniel 5:1 names Belshazzar; the independent cylinder names a Belshazzar in the Nabonidus royal context. The name match is a historical comparison, not verification of the feast narrative.',
    limitation: 'This object record alone does not establish Belshazzar’s precise office, chronology of the feast, or the events described in Daniel 5.',
    reuse: 'Museum catalog metadata paraphrased and linked. No inscription transcription or image copied.'
  },
  'tel-dan-stele': {
    id: 'tel-dan-house-david',
    siteId: 'tel-dan-stele',
    scriptureRef: '2Sam.7.16',
    claim: 'A ninth-century Aramaic victory stele from Tel Dan refers to a king of the “House of David.”',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'The Jewish Museum exhibition, on loan from the Israel Museum',
    sourceRecord: 'Israel Antiquities Authority 1996-125 / 1993-3162',
    sourceUrl: 'https://thejewishmuseum.org/exhibitions/tel-dan-stele/',
    datingSourceTitle: 'The Jewish Museum excavation and object summary',
    datingSourceUrl: 'https://thejewishmuseum.org/exhibitions/tel-dan-stele/',
    dateRange: 'Ninth century BC (museum range)',
    connectionMethod: '2 Samuel 7:16 speaks of David’s house as a dynasty. The stele independently uses the dynastic expression in a later royal context; this is a connection of names and institutions, not an account of the promise.',
    limitation: 'The stele does not narrate David’s life. Hazael’s authorship is proposed because his name is not preserved. This receipt does not decide every proposed reconstruction of damaged lines.',
    reuse: 'Museum object description paraphrased and linked. Photograph copyright retained by the Israel Museum; no image copied.'
  },
  'cyrus-cylinder': {
    id: 'cyrus-babylon-restoration',
    siteId: 'cyrus-cylinder',
    scriptureRef: 'Ezra.1.1',
    claim: 'A royal Babylonian inscription of Cyrus records the conquest of Babylon and restoration of shrines.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'British Museum collection',
    sourceRecord: 'BM 90920 / 1880,0617.1941',
    sourceUrl: 'https://www.britishmuseum.org/collection/image/262895001',
    datingSourceTitle: 'Metropolitan Museum of Art exhibition object record',
    datingSourceUrl: 'https://www.metmuseum.org/exhibitions/listings/2013/cyrus-cylinder',
    dateRange: '539–538 BC (museum object range)',
    connectionMethod: 'Ezra 1:1 describes Cyrus’s decree about the Jerusalem temple. The cylinder shows Cyrus’s royal restoration language in Babylon, a related imperial context rather than the same document.',
    limitation: 'The surviving cylinder does not name Jerusalem or the Jews, quote Ezra’s decree, or date Isaiah’s composition.',
    reuse: 'Museum catalog metadata paraphrased with links. No third-party image or inscription text copied.'
  },
  'mesha-stele': {
    id: 'mesha-moab-israel-louvre',
    siteId: 'mesha-stele',
    scriptureRef: '2Kgs.1.1',
    claim: 'The Louvre catalogs a Moabite stele of King Mesha describing the recovery of territories from Israel.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Louvre collections',
    sourceRecord: 'AO 5066 / KAI 181',
    sourceUrl: 'https://collections.louvre.fr/en/ark:/53355/cl010120339',
    datingSourceTitle: 'Louvre object catalog',
    datingSourceUrl: 'https://collections.louvre.fr/en/ark:/53355/cl010120339',
    dateRange: 'Approximately 830–805 BC (museum range)',
    connectionMethod: '2 Kings 1:1 reports Moab’s rebellion; the stele presents Mesha’s own account of recovering Moabite territory from Israel. The accounts are compared as independent viewpoints.',
    limitation: 'The stele does not prove every episode in 2 Kings 3. Its damaged line 31 has competing readings, including “House of David” and alternatives; no such reading is asserted here.',
    reuse: 'Louvre catalog paraphrased and linked. No museum image or inscription text copied.'
  },
  'taylor-prism': {
    id: 'sennacherib-hezekiah-tribute',
    siteId: 'taylor-prism',
    scriptureRef: '2Kgs.18.13',
    claim: 'The Taylor Prism records tribute from Hezekiah, king of Judah, in Sennacherib’s 701 BC campaign.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'British Museum collection',
    sourceRecord: '1855,1028.1 (Taylor Prism)',
    sourceUrl: 'https://www.britishmuseum.org/collection/image/426311001',
    datingSourceTitle: 'British Museum catalog description',
    datingSourceUrl: 'https://www.britishmuseum.org/collection/image/426311001',
    dateRange: 'Campaign: 701 BC; prism made later, during Sennacherib’s reign',
    connectionMethod: 'The imperial record names Hezekiah and Judah; 2 Kings 18:13 independently describes Sennacherib’s attack on Judah. The texts differ in viewpoint and detail.',
    limitation: 'The prism does not establish the biblical account of Jerusalem’s deliverance or every detail of the campaign. The museum image is linked, not reused.',
    reuse: 'Catalog metadata paraphrased with attribution. Museum image rights restrict reuse; no image copied.'
  },
  'gallio-inscription': {
    id: 'gallio-office-delphi',
    siteId: 'gallio-inscription',
    scriptureRef: 'Acts.18.12',
    claim: 'A fragmentary letter of Claudius names Gallio as proconsul of Achaia.',
    claimClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    status: 'attested',
    sourceTitle: 'Packard Humanities Institute Greek Inscriptions',
    sourceRecord: 'FD III 4:286',
    sourceUrl: 'https://epigraphy.packhum.org/text/240470',
    datingSourceTitle: 'É. Plassart, Revue des Études Grecques 80 (1967)',
    datingSourceUrl: 'https://www.persee.fr/doc/reg_0035-2039_1967_num_80_379_3963',
    dateRange: 'Gallio’s Achaian office: approximately AD 51–52',
    connectionMethod: 'Acts 18:12 names Gallio as proconsul of Achaia; the independent inscription names the same officeholder and province. Dating Paul’s encounter uses an additional inference from Acts and Roman chronology.',
    limitation: 'The inscription does not describe Paul, his hearing, or the duration of his stay in Corinth.',
    reuse: 'Linked scholarly transcription and article; no third-party inscription text or image reproduced.',
    relatedRecord: {
      label: 'Gallio in Roman literature',
      claim: 'The Gallio who governed Achaia is identified as the philosopher Seneca’s brother. Seneca addresses Gallio as his brother in On the Happy Life.',
      sourceTitle: 'Oxford Classical Dictionary · Annaeus Novatus',
      sourceUrl: 'https://academic.oup.com/edited-volume/61673/chapter-abstract/548071868?login=false',
      originalTitle: 'Seneca, De Vita Beata 1 · Perseus',
      originalUrl: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A2007.01.0022',
      limitation: 'Neither record says Paul met Seneca or connects Seneca’s philosophy to the hearing in Acts.'
    }
  }
};

export function getEvidenceReceipt(siteId: string): EvidenceReceipt | undefined {
  return EVIDENCE_RECEIPTS[siteId];
}

export function isArtifactReviewed(siteId: string): boolean {
  return Boolean(getEvidenceReceipt(siteId));
}

/** Public copy is conservative until an object-specific source review is complete. */
export function getArtifactDisplay(site: ArchaeologicalSite): { description: string; connection: string; significance: string; date: string; sourceLabel: string } {
  if (isArtifactReviewed(site.id)) return {
    description: site.description,
    connection: site.scriptureConnection,
    significance: site.significance,
    date: site.artifactDate,
    sourceLabel: 'View reviewed source record ↗'
  };
  return {
    description: `Existing atlas candidate associated with ${site.name}. Its object identity, provenance, dating, and passage connection await object-specific source review.`,
    connection: `Possible reading connection: ${site.scriptureRef}. This association has not been individually verified.`,
    significance: 'Editorial review pending. The catalog notes are withheld from the default view until a source record and limits are documented.',
    date: 'Date under review',
    sourceLabel: 'Background link · not a reviewed object record ↗'
  };
}

/** Build with textContent so editorial data never becomes executable HTML. */
export function createEvidenceReceiptElement(receipt: EvidenceReceipt): HTMLElement {
  const section = document.createElement('section');
  section.className = 'evidence-receipt';
  section.setAttribute('aria-label', 'Historical evidence receipt');
  const line = (label: string, value: string) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    p.append(strong, value);
    section.append(p);
  };
  const source = (label: string, title: string, url: string) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    p.append(strong, link);
    section.append(p);
  };
  const assessment = receipt.status === 'attested'
    ? 'attested source claim'
    : `${receipt.status} passage connection`;
  line('Evidence', `Independent historical record · ${assessment}`);
  line('What survives', receipt.claim);
  source('Source record', `${receipt.sourceRecord} · ${receipt.sourceTitle}`, receipt.sourceUrl);
  source('Dating analysis', receipt.datingSourceTitle, receipt.datingSourceUrl);
  line('Date range', receipt.dateRange);
  line('Why connected', receipt.connectionMethod);
  line('Limit', receipt.limitation);
  line('Reuse', receipt.reuse);
  if (receipt.relatedRecord) {
    const heading = document.createElement('h4');
    heading.textContent = receipt.relatedRecord.label;
    section.append(heading);
    line('Contemporary connection', receipt.relatedRecord.claim);
    source('Identity source', receipt.relatedRecord.sourceTitle, receipt.relatedRecord.sourceUrl);
    source('Ancient text', receipt.relatedRecord.originalTitle, receipt.relatedRecord.originalUrl);
    line('Limit', receipt.relatedRecord.limitation);
  }
  return section;
}
