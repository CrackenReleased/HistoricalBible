/**
 * src/data/ancientMapData.ts
 * Geodetically accurate coordinates (WGS84) and historical cartography
 * for the Ancient Near East and Mediterranean World.
 * Connects Biblical Figures, World Empires, and Physical Archaeological Discoveries.
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface ArchaeologicalSite {
  id: string;
  name: string;
  ancientRegion: string;
  modernCountry: string;
  coords: GeoCoordinate;
  artifactName: string;
  artifactDate: string;
  discoveryYear?: string;
  currentLocation: string;
  figureId?: string;
  empireId?: string;
  scriptureRef: string;
  scriptureOsis: string;
  scriptureConnection: string;
  description: string;
  significance: string;
  externalUrl?: string;
}

export interface BiblicalCity {
  id: string;
  name: string;
  ancientName?: string;
  coords: GeoCoordinate;
  hitchcockMeaning: string;
  region: string;
  prominence: 1 | 2 | 3; // 1 = major capital/biblical hub, 2 = secondary, 3 = regional
  scriptureAnchor: string;
  figureIds?: string[];
}

export interface BiblicalRoute {
  id: string;
  name: string;
  figureId: string;
  color: string;
  scriptureRef: string;
  summary: string;
  stops: Array<{
    name: string;
    coords: GeoCoordinate;
    note?: string;
  }>;
}

export type FactionType = 'covenant' | 'israel' | 'hostile' | 'allied' | 'global_power';

export interface WorldEmpireRegion {
  id: string;
  name: string;
  color: string;
  fillColor: string;
  dateRange: string;
  capital: { name: string; coords: GeoCoordinate };
  approximateBounds: GeoCoordinate[]; // Boundary polygon for territory representation
  biblicalIntersection: string;
  factionCategory: FactionType;
  populationEstimate: string;
  approximateArea: string;
  eraIds?: string[];
}

export interface MapRegionPreset {
  id: string;
  name: string;
  center: GeoCoordinate;
  zoom: number; // 1 = default full view
  description: string;
}

// Map Projection Bounds (Covering the Ancient World from Atlantic/Rome to Scythia/Russia, Kush/Ethiopia, India & China)
export const MAP_BOUNDS = {
  minLng: -10.0, // Atlantic / Iberia & Rome
  maxLng: 125.0, // Eastern China / Pacific Coast
  minLat: 8.0,   // Horn of Africa / Kush / Indian Ocean
  maxLat: 56.0,  // Scythian Steppes / Russian Plains
};

// Preset Cameras for Quick Navigation
export const REGION_PRESETS: MapRegionPreset[] = [
  {
    id: 'all',
    name: 'All Biblical World (Atlantic to Pacific)',
    center: { lat: 31.0, lng: 52.0 },
    zoom: 1.0,
    description: 'The complete known world: Rome, Scythia/Russia, Kush/Ethiopia, Persia, India & China'
  },
  {
    id: 'levant',
    name: 'The Holy Land / Judea & Galilee',
    center: { lat: 32.0, lng: 35.2 },
    zoom: 3.2,
    description: 'Jerusalem, Galilee, Caesarea, Jordan River & the Dead Sea'
  },
  {
    id: 'egypt',
    name: 'Egypt & Mount Sinai',
    center: { lat: 29.2, lng: 32.5 },
    zoom: 2.2,
    description: 'Nile Delta, Goshen, Red Sea Crossing, and Mount Sinai'
  },
  {
    id: 'mesopotamia',
    name: 'Mesopotamia & Persia',
    center: { lat: 33.8, lng: 44.8 },
    zoom: 1.9,
    description: 'Babylon, Nineveh, Ur of the Chaldees, Susa & the Fertile Crescent'
  },
  {
    id: 'mediterranean',
    name: 'Greece, Asia Minor & Rome',
    center: { lat: 38.5, lng: 25.0 },
    zoom: 1.6,
    description: 'Corinth, Delphi, Ephesus, Athens and the Roman imperial courts'
  }
];

// Physical Water Bodies & Rivers (Geodetic Polylines for Canvas Rendering)
export const WATER_FEATURES: {
  seas: Array<{ name: string; polygon: GeoCoordinate[] }>;
  rivers: Array<{ name: string; path: GeoCoordinate[] }>;
} = {
  seas: [
    {
      name: 'Mediterranean Sea',
      polygon: [
        { lat: 43.5, lng: 11.5 }, { lat: 41.5, lng: 12.8 }, { lat: 38.0, lng: 15.5 },
        { lat: 36.5, lng: 21.5 }, { lat: 35.0, lng: 24.5 }, { lat: 34.5, lng: 32.5 },
        { lat: 36.5, lng: 35.5 }, { lat: 33.0, lng: 35.1 }, { lat: 31.5, lng: 34.4 },
        { lat: 31.2, lng: 32.0 }, { lat: 31.0, lng: 29.5 }, { lat: 32.0, lng: 24.0 },
        { lat: 32.5, lng: 15.0 }, { lat: 37.0, lng: 11.0 }, { lat: 43.5, lng: 11.5 }
      ]
    },
    {
      name: 'Black Sea (Southern Shore)',
      polygon: [
        { lat: 41.2, lng: 28.5 }, { lat: 41.8, lng: 32.0 }, { lat: 41.5, lng: 36.0 },
        { lat: 41.0, lng: 41.5 }, { lat: 43.0, lng: 41.0 }, { lat: 43.5, lng: 35.0 },
        { lat: 43.0, lng: 28.5 }, { lat: 41.2, lng: 28.5 }
      ]
    },
    {
      name: 'Red Sea (Gulf of Suez & Aqaba)',
      polygon: [
        { lat: 29.9, lng: 32.5 }, { lat: 28.0, lng: 33.5 }, { lat: 25.0, lng: 36.5 },
        { lat: 24.5, lng: 37.5 }, { lat: 28.0, lng: 35.0 }, { lat: 29.5, lng: 35.0 },
        { lat: 28.0, lng: 34.4 }, { lat: 29.8, lng: 32.6 }, { lat: 29.9, lng: 32.5 }
      ]
    },
    {
      name: 'Persian Gulf',
      polygon: [
        { lat: 30.0, lng: 48.0 }, { lat: 28.5, lng: 50.5 }, { lat: 26.5, lng: 52.0 },
        { lat: 25.5, lng: 54.0 }, { lat: 28.0, lng: 52.5 }, { lat: 30.0, lng: 49.5 },
        { lat: 30.0, lng: 48.0 }
      ]
    },
    {
      name: 'Sea of Galilee',
      polygon: [
        { lat: 32.90, lng: 35.56 }, { lat: 32.86, lng: 35.63 }, { lat: 32.77, lng: 35.61 },
        { lat: 32.71, lng: 35.58 }, { lat: 32.74, lng: 35.52 }, { lat: 32.84, lng: 35.52 },
        { lat: 32.90, lng: 35.56 }
      ]
    },
    {
      name: 'Dead Sea',
      polygon: [
        { lat: 31.78, lng: 35.52 }, { lat: 31.60, lng: 35.55 }, { lat: 31.35, lng: 35.49 },
        { lat: 31.12, lng: 35.42 }, { lat: 31.05, lng: 35.35 }, { lat: 31.30, lng: 35.36 },
        { lat: 31.65, lng: 35.42 }, { lat: 31.78, lng: 35.52 }
      ]
    }
  ],
  rivers: [
    {
      name: 'Jordan River',
      path: [
        { lat: 33.25, lng: 35.65 }, // Sources near Dan/Hermon
        { lat: 32.90, lng: 35.58 }, // Enters Sea of Galilee
        { lat: 32.70, lng: 35.57 }, // Exits Galilee
        { lat: 32.30, lng: 35.56 }, // Jordan Valley
        { lat: 31.85, lng: 35.52 }, // Jericho crossing
        { lat: 31.78, lng: 35.52 }  // Enters Dead Sea
      ]
    },
    {
      name: 'Nile River',
      path: [
        { lat: 25.72, lng: 32.65 }, // Luxor / Thebes
        { lat: 26.50, lng: 31.80 },
        { lat: 28.00, lng: 30.80 },
        { lat: 29.80, lng: 31.25 }, // Memphis
        { lat: 30.10, lng: 31.30 }, // Delta apex (Cairo)
        { lat: 31.50, lng: 31.80 }  // Damietta branch
      ]
    },
    {
      name: 'Nile Delta Rosetta Branch',
      path: [
        { lat: 30.10, lng: 31.30 },
        { lat: 30.80, lng: 30.60 },
        { lat: 31.45, lng: 30.40 }
      ]
    },
    {
      name: 'Euphrates River',
      path: [
        { lat: 38.80, lng: 39.50 }, // Armenian highlands
        { lat: 36.80, lng: 38.00 }, // Carchemish
        { lat: 35.90, lng: 39.00 }, // Emar
        { lat: 34.40, lng: 40.90 }, // Mari
        { lat: 33.40, lng: 43.30 }, // Near Fallujah
        { lat: 32.54, lng: 44.42 }, // Babylon
        { lat: 30.96, lng: 46.10 }, // Ur of the Chaldees
        { lat: 30.00, lng: 48.00 }  // Shatt al-Arab / Persian Gulf
      ]
    },
    {
      name: 'Tigris River',
      path: [
        { lat: 38.50, lng: 40.00 }, // Lake Hazar
        { lat: 37.00, lng: 42.00 },
        { lat: 36.36, lng: 43.15 }, // Nineveh
        { lat: 36.10, lng: 43.33 }, // Calah / Nimrud
        { lat: 35.45, lng: 43.25 }, // Assur
        { lat: 33.30, lng: 44.40 }, // Baghdad
        { lat: 31.00, lng: 47.40 }, // Joins Euphrates
        { lat: 30.00, lng: 48.00 }
      ]
    }
  ]
};

// Major Biblical Archaeological Synchronies with Physical Coordinates
export const ARCHAEOLOGICAL_SITES: ArchaeologicalSite[] = [
  {
    id: 'pilate-stone',
    name: 'Caesarea Maritima',
    ancientRegion: 'Roman Judea',
    modernCountry: 'Israel',
    coords: { lat: 32.500, lng: 34.890 },
    artifactName: 'The Pilate Stone',
    artifactDate: 'AD 26 – 36',
    discoveryYear: '1961',
    currentLocation: 'Israel Museum, Jerusalem',
    figureId: 'jesus-christ',
    empireId: 'rome',
    scriptureRef: 'LUKE {3:1}, {23:1}–{23:25}',
    scriptureOsis: 'Luke.3.1',
    scriptureConnection: 'Direct Synchrony: Luke 3:1 & Matthew 27:2 — Monumental Latin inscription confirming Pontius Pilate as Roman Prefect of Judea.',
    description: 'A limestone dedicatory block discovered in the Roman theatre at Caesarea bearing the Latin inscription: "[DIS AUGUSTI]S TIBERIEUM ... [PON]TIUS PILATUS ... [PRAEF]ECTUS IUDA[EAE]".',
    significance: 'Confirms Pontius Pilate\'s exact historical office as Roman Prefect of Judea, corroborating Luke\'s precise political synchrony in Luke 3:1.',
    externalUrl: 'https://www.imj.org.il/en/exhibitions/cradle-christianity'
  },
  {
    id: 'caiaphas-ossuary',
    name: 'Jerusalem (Peace Forest)',
    ancientRegion: 'Roman Judea',
    modernCountry: 'Israel',
    coords: { lat: 31.765, lng: 35.230 },
    artifactName: 'The Caiaphas Ossuary',
    artifactDate: '1st Century AD (c. AD 18–36)',
    discoveryYear: '1990',
    currentLocation: 'Israel Museum, Jerusalem',
    figureId: 'jesus-christ',
    empireId: 'rome',
    scriptureRef: 'MATTHEW {26:57}, JOHN {11:49}, {18:14}',
    scriptureOsis: 'Matt.26.57',
    scriptureConnection: 'Direct Synchrony: Matthew 26:57 & John 18:14 — Burial bone-box inscribed with Joseph son of Caiaphas, the High Priest.',
    description: 'An intricately carved limestone burial bone-box inscribed twice with the Aramaic name "Yehosef bar Qayafa" (Joseph son of Caiaphas), found in a family burial cave.',
    significance: 'Material attestation of the Jewish High Priest who presided over the Sanhedrin trial and condemned Jesus Christ.',
    externalUrl: 'https://www.imj.org.il/en/collections/371587-0'
  },
  {
    id: 'taylor-prism',
    name: 'Nineveh (Kuyunjik)',
    ancientRegion: 'Neo-Assyrian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 36.360, lng: 43.150 },
    artifactName: 'The Taylor Prism of Sennacherib',
    artifactDate: '691 BC (Campaign of 701 BC)',
    discoveryYear: '1830',
    currentLocation: 'British Museum, London (Room 55)',
    figureId: 'hezekiah',
    empireId: 'assyria',
    scriptureRef: '2 KINGS {18:13}–{19:37}, ISAIAH {36:1}–{37:38}',
    scriptureOsis: '2Kgs.18.13',
    scriptureConnection: 'Direct Synchrony: 2 Kings 18:13–19:37 — Sennacherib records his siege of "Hezekiah the Judahite" in Jerusalem.',
    description: 'A six-sided hexagonal baked clay prism recording Sennacherib\'s eight military campaigns. It specifically boasts of besieging "Hezekiah the Judahite like a caged bird in Jerusalem his royal city".',
    significance: 'Direct imperial corroboration of the Assyrian invasion of Judah in 701 BC. Crucially, the prism boasts of tribute and capturing fortresses, but never claims to have taken Jerusalem—precisely matching Scripture\'s record of miraculous deliverance.',
    externalUrl: 'https://www.britishmuseum.org/collection/object/W_1855-1028-1'
  },
  {
    id: 'siloam-inscription',
    name: 'Jerusalem (City of David)',
    ancientRegion: 'Kingdom of Judah',
    modernCountry: 'Israel',
    coords: { lat: 31.772, lng: 35.235 },
    artifactName: 'The Siloam Tunnel Inscription',
    artifactDate: 'c. 701 BC (Reign of Hezekiah)',
    discoveryYear: '1880',
    currentLocation: 'Istanbul Archaeology Museum, Turkey',
    figureId: 'hezekiah',
    empireId: 'assyria',
    scriptureRef: '2 KINGS {20:20}, 2 CHRONICLES {32:30}',
    scriptureOsis: '2Kgs.20.20',
    scriptureConnection: 'Direct Synchrony: 2 Kings 20:20 — Memorializes the cutting of Hezekiah\'s subterranean aqueduct into Jerusalem.',
    description: 'An ancient Paleo-Hebrew inscription carved into the bedrock wall inside Hezekiah\'s 1,750-foot subterranean water tunnel, recording the dramatic moment the two mining teams met face-to-face.',
    significance: 'Verifies the colossal engineering feat described in 2 Kings 20:20 ("he made a pool, and a conduit, and brought water into the city") to prepare Jerusalem for the Assyrian siege.',
    externalUrl: 'https://en.wikipedia.org/wiki/Siloam_inscription'
  },
  {
    id: 'cyrus-cylinder',
    name: 'Babylon',
    ancientRegion: 'Neo-Babylonian / Achaemenid Persian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 32.542, lng: 44.421 },
    artifactName: 'The Cyrus Cylinder',
    artifactDate: '539 BC',
    discoveryYear: '1879',
    currentLocation: 'British Museum, London (Room 55)',
    figureId: 'daniel',
    empireId: 'persia',
    scriptureRef: '2 CHRONICLES {36:22}–{36:23}, EZRA {1:1}–{1:4}, ISAIAH {44:28}–{45:1}',
    scriptureOsis: 'Ezra.1.1',
    scriptureConnection: 'Direct Synchrony: 2 Chronicles 36:22–23 & Ezra 1:1–4 — Cyrus the Great decrees return of exiled peoples and rebuilding of sanctuaries.',
    description: 'A barrel-shaped clay cylinder inscribed in Akkadian cuneiform by order of Cyrus the Great after his conquest of Babylon in 539 BC, proclaiming the return of displaced peoples and the restoration of their sanctuaries.',
    significance: 'Corroborates the imperial policy of Cyrus that enabled the Jewish remnant to return to Jerusalem and rebuild the Temple, fulfilling prophecies made 150 years earlier in Isaiah 44:28.',
    externalUrl: 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'
  },
  {
    id: 'nabonidus-cylinder',
    name: 'Ur of the Chaldees (Ziggurat of Ur)',
    ancientRegion: 'Neo-Babylonian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 30.962, lng: 46.103 },
    artifactName: 'The Nabonidus Cylinder of Ur',
    artifactDate: 'c. 550 BC',
    discoveryYear: '1854',
    currentLocation: 'British Museum, London (Room 55)',
    figureId: 'daniel',
    empireId: 'babylon',
    scriptureRef: 'DANIEL {5:1}–{5:30}',
    scriptureOsis: 'Dan.5.1',
    scriptureConnection: 'Direct Synchrony: Daniel 5:1–30 — Inscription naming Belshazzar as co-regent of Babylon, confirming the Daniel 5 narrative.',
    description: 'A clay foundation cylinder of King Nabonidus recording repairs to the temple of Sin at Ur. In its prayer, Nabonidus explicitly names "Bel-sarra-usur [Belshazzar], my eldest son, offspring of my heart".',
    significance: 'Vindicated Daniel 5 against 19th-century critics who claimed Belshazzar was fictional because classical Greek historians only mentioned Nabonidus. It confirmed Belshazzar as co-regent ruler in Babylon.',
    externalUrl: 'https://www.britishmuseum.org/collection/object/W_K-1689'
  },
  {
    id: 'tel-dan-stele',
    name: 'Tel Dan',
    ancientRegion: 'Northern Kingdom of Israel / Aram-Damascus',
    modernCountry: 'Israel',
    coords: { lat: 33.249, lng: 35.652 },
    artifactName: 'The Tel Dan Stele ("House of David" Inscription)',
    artifactDate: 'c. 840 BC (9th Century BC)',
    discoveryYear: '1993',
    currentLocation: 'Israel Museum, Jerusalem',
    figureId: 'david',
    empireId: 'assyria',
    scriptureRef: '2 SAMUEL {7:16}, 1 KINGS {12:16}, LUKE {1:32}',
    scriptureOsis: '2Sam.7.16',
    scriptureConnection: 'Direct Synchrony: 2 Kings 8:28–29 & 9:24 — Hazael of Aram records conflict with the House of David and Israel.',
    description: 'A monumental basalt victory stele erected by Hazael of Aram-Damascus at the city gate of Tel Dan. Line 9 explicitly boasts of defeating "[...mlk.] Bytdwd" ("King of the House of David") and "[...mlk] Ysr\'l" ("King of Israel").',
    significance: 'The first direct extra-biblical historical attestation of King David and the Davidic Dynasty outside the Bible, refuting claims that David was a legendary figure.',
    externalUrl: 'https://www.imj.org.il/en/collections/374567-0'
  },
  {
    id: 'merneptah-stele',
    name: 'Thebes (Luxor)',
    ancientRegion: 'New Kingdom Egypt (19th Dynasty)',
    modernCountry: 'Egypt',
    coords: { lat: 25.718, lng: 32.657 },
    artifactName: 'The Merneptah Stele (The "Israel Stele")',
    artifactDate: 'c. 1208 BC (Year 5 of Pharaoh Merneptah)',
    discoveryYear: '1896',
    currentLocation: 'Egyptian Museum, Cairo',
    figureId: 'moses',
    empireId: 'egypt',
    scriptureRef: 'EXODUS {1:11}, JOSHUA {1:1}',
    scriptureOsis: 'Exod.1.11',
    scriptureConnection: 'Direct Synchrony: Exodus 1 & Joshua — Earliest non-biblical mention of Israel as an established people group in Canaan.',
    description: 'A 10-foot granite victory monument recording campaigns in the Levant. Line 27 states: "Israel is laid waste, its seed is not; Hurru has become a widow for Egypt." Israel is written with the hieroglyphic determinative for a distinct people group.',
    significance: 'The earliest known mention of "Israel" in any non-biblical archaeological record. Proves that Israel was an established nation in Canaan by at least the late 13th century BC.',
    externalUrl: 'https://en.wikipedia.org/wiki/Merneptah_Stele'
  },
  {
    id: 'gallio-inscription',
    name: 'Delphi',
    ancientRegion: 'Achaia / Roman Empire',
    modernCountry: 'Greece',
    coords: { lat: 38.482, lng: 22.501 },
    artifactName: 'The Delphi Inscription (Gallio Inscription)',
    artifactDate: 'AD 51 – 52 (Reign of Claudius)',
    discoveryYear: '1905',
    currentLocation: 'Delphi Archaeological Museum, Greece',
    figureId: 'paul',
    empireId: 'rome',
    scriptureRef: 'ACTS {18:12}–{18:17}',
    scriptureOsis: 'Acts.18.12',
    scriptureConnection: 'Direct Synchrony: Acts 18:12–17 — Inscription at Delphi dating Proconsul Gallio in Achaia to AD 51–52 during Paul\'s ministry.',
    description: 'Nine stone fragments preserving a Greek letter from Emperor Claudius to Delphi. It explicitly names "Lucius Junius Gallio, my friend and proconsul of Achaia".',
    significance: 'Provides the absolute chronological anchor for the entire New Testament apostolic chronology, dating Paul\'s 18-month ministry and courtroom trial in Corinth to AD 51–52.',
    externalUrl: 'https://en.wikipedia.org/wiki/Gallio_inscription'
  },
  {
    id: 'erastus-inscription',
    name: 'Corinth',
    ancientRegion: 'Achaia / Roman Empire',
    modernCountry: 'Greece',
    coords: { lat: 37.906, lng: 22.880 },
    artifactName: 'The Erastus Pavement Inscription',
    artifactDate: 'Mid-1st Century AD',
    discoveryYear: '1929',
    currentLocation: 'Corinth Archaeological Museum, Greece',
    figureId: 'paul',
    empireId: 'rome',
    scriptureRef: 'ROMANS {16:23}, 2 TIMOTHY {4:20}',
    scriptureOsis: 'Rom.16.23',
    scriptureConnection: 'Direct Synchrony: Romans 16:23 & 2 Timothy 4:20 — Pavement in Corinth dedicated by Erastus, city chamberlain / treasurer.',
    description: 'A limestone plaza pavement near the Corinth theater inscribed in Latin: "ERASTVS PRO AEDILITATE S P STRAVIT" ("Erastus in return for his aedileship laid this pavement at his own expense").',
    significance: 'Matches Paul\'s salutation in Romans 16:23 written from Corinth: "Erastus the chamberlain [oikonomos / city treasurer] of the city saluteth you."',
    externalUrl: 'https://en.wikipedia.org/wiki/Erastus_of_Corinth'
  },
  {
    id: 'ketef-hinnom-scrolls',
    name: 'Jerusalem (Hinnom Valley / Ketef Hinnom)',
    ancientRegion: 'Kingdom of Judah',
    modernCountry: 'Israel',
    coords: { lat: 31.769, lng: 35.225 },
    artifactName: 'The Ketef Hinnom Silver Amulet Scrolls',
    artifactDate: 'c. 650 – 600 BC (Late First Temple Period)',
    discoveryYear: '1979',
    currentLocation: 'Israel Museum, Jerusalem',
    figureId: 'jeremiah',
    empireId: 'babylon',
    scriptureRef: 'NUMBERS {6:24}–{6:26}',
    scriptureOsis: 'Num.6.24',
    scriptureConnection: 'Direct Synchrony: Numbers 6:24–26 & 2 Kings 22–23 — Pre-exilic priestly benediction in Paleo-Hebrew found in Jerusalem.',
    description: 'Two tiny rolled silver scrolls found in a burial chamber inscribed in Paleo-Hebrew with the priestly benediction: "The LORD bless thee, and keep thee: The LORD make his face shine upon thee...".',
    significance: 'The oldest surviving biblical texts ever discovered—predating the Dead Sea Scrolls by more than 300 years and proving the Torah\'s Priestly Blessing was in liturgical use before the Babylonian exile.',
    externalUrl: 'https://www.imj.org.il/en/collections/374568-0'
  },
  {
    id: 'mesha-stele',
    name: 'Dhiban (Biblical Dibon)',
    ancientRegion: 'Moab',
    modernCountry: 'Jordan',
    coords: { lat: 31.500, lng: 35.776 },
    artifactName: 'The Mesha Stele (Moabite Stone)',
    artifactDate: 'c. 840 BC',
    discoveryYear: '1868',
    currentLocation: 'Louvre Museum, Paris (Department of Near Eastern Antiquities)',
    figureId: 'david',
    empireId: 'assyria',
    scriptureRef: '2 KINGS {1:1}, {3:4}–{3:27}',
    scriptureOsis: '2Kgs.1.1',
    scriptureConnection: 'Direct Synchrony: 2 Kings 1:1 & 3:4 — King Mesha of Moab records his rebellion against the house of Omri and Israel.',
    description: 'A black basalt stele erected by King Mesha of Moab. The inscription records his rebellion against Israel and mentions "Omri, king of Israel", the "House of David", and the sacred divine name YHWH.',
    significance: 'Independently confirms the events of 2 Kings 1:1 and 2 Kings 3, attests the God of Israel (YHWH) by name, and provides a second 9th-century BC mention of the "House of David".',
    externalUrl: 'https://collections.louvre.fr/en/ark:/53355/cl010120567'
  },
  {
    id: 'black-obelisk',
    name: 'Nimrud (Biblical Calah)',
    ancientRegion: 'Neo-Assyrian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 36.098, lng: 43.330 },
    artifactName: 'The Black Obelisk of Shalmaneser III',
    artifactDate: 'c. 825 BC (Campaign of 841 BC)',
    discoveryYear: '1846',
    currentLocation: 'British Museum, London (Room 6)',
    figureId: 'hezekiah',
    empireId: 'assyria',
    scriptureRef: '2 KINGS {9:1}–{10:36}',
    scriptureOsis: '2Kgs.9.1',
    scriptureConnection: 'Direct Synchrony: 2 Kings 9–10 — Depicts Jehu, King of Israel, paying tribute to Shalmaneser III of Assyria.',
    description: 'A four-sided black limestone obelisk depicting five defeated kings paying tribute. Panel 2 shows "Yaua mar Humri" (Jehu, son/successor of Omri), king of Israel, prostrating before Shalmaneser III.',
    significance: 'The only surviving ancient depiction of an Israelite king, providing precise non-biblical chronological synchrony for Jehu\'s accession recorded in 2 Kings 9–10.',
    externalUrl: 'https://www.britishmuseum.org/collection/object/W_1848-1104-1'
  },
  {
    id: 'sargon-prism',
    name: 'Khorsabad (Dur-Sharrukin)',
    ancientRegion: 'Neo-Assyrian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 36.508, lng: 43.227 },
    artifactName: 'The Khorsabad Annals of Sargon II',
    artifactDate: 'c. 720 BC',
    discoveryYear: '1847',
    currentLocation: 'Louvre Museum, Paris',
    figureId: 'hezekiah',
    empireId: 'assyria',
    scriptureRef: '2 KINGS {17:1}–{17:6}',
    scriptureOsis: '2Kgs.17.6',
    scriptureConnection: 'Direct Synchrony: 2 Kings 17:6 — Sargon II records the conquest of Samaria and deportation of 27,290 Israelites.',
    description: 'Wall reliefs and prism fragments of Sargon II recording: "At the beginning of my royal rule, I besieged and conquered the city of the Samarians... 27,290 people who lived therein I carried away".',
    significance: 'Verifies the historical fall of Samaria and the Assyrian deportation of the Northern Ten Tribes in 722 BC recorded in 2 Kings 17.',
    externalUrl: 'https://en.wikipedia.org/wiki/Sargon_II'
  }
];

// Major Biblical Cities & Geographic Anchors
export const BIBLICAL_CITIES: BiblicalCity[] = [
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    ancientName: 'Zion / Salem / Jebus',
    coords: { lat: 31.778, lng: 35.234 },
    hitchcockMeaning: 'Vision of peace; possession of peace',
    region: 'Judea / Levant',
    prominence: 1,
    scriptureAnchor: 'PSALMS {122:6}, LUKE {24:47}',
    figureIds: ['jesus-christ', 'david', 'hezekiah', 'isaiah', 'jeremiah', 'solomon', 'ezra-nehemiah', 'peter']
  },
  {
    id: 'bethlehem',
    name: 'Bethlehem',
    ancientName: 'Ephrath',
    coords: { lat: 31.705, lng: 35.204 },
    hitchcockMeaning: 'House of bread',
    region: 'Judea / Levant',
    prominence: 1,
    scriptureAnchor: 'MICAH {5:2}, MATTHEW {2:1}',
    figureIds: ['jesus-christ', 'david']
  },
  {
    id: 'nazareth',
    name: 'Nazareth',
    ancientName: 'Nazara',
    coords: { lat: 32.701, lng: 35.303 },
    hitchcockMeaning: 'Separated; crowned; sanctified',
    region: 'Galilee / Levant',
    prominence: 1,
    scriptureAnchor: 'LUKE {2:51}, JOHN {1:46}',
    figureIds: ['jesus-christ']
  },
  {
    id: 'capernaum',
    name: 'Capernaum',
    ancientName: 'Kefar Nahum',
    coords: { lat: 32.881, lng: 35.575 },
    hitchcockMeaning: 'Village of comfort',
    region: 'Galilee / Levant',
    prominence: 1,
    scriptureAnchor: 'MATTHEW {4:13}, {11:23}',
    figureIds: ['jesus-christ', 'peter']
  },
  {
    id: 'caesarea-maritima',
    name: 'Caesarea Maritima',
    ancientName: 'Straton\'s Tower',
    coords: { lat: 32.500, lng: 34.890 },
    hitchcockMeaning: 'A bush of hair; named for Caesar',
    region: 'Roman Judea',
    prominence: 1,
    scriptureAnchor: 'ACTS {10:1}, {25:13}',
    figureIds: ['jesus-christ', 'peter', 'paul']
  },
  {
    id: 'babylon',
    name: 'Babylon',
    ancientName: 'Babel',
    coords: { lat: 32.542, lng: 44.421 },
    hitchcockMeaning: 'Confusion; mixture; gate of God',
    region: 'Mesopotamia',
    prominence: 1,
    scriptureAnchor: 'DANIEL {1:1}, JEREMIAH {25:11}',
    figureIds: ['daniel', 'jeremiah']
  },
  {
    id: 'nineveh',
    name: 'Nineveh',
    ancientName: 'Ninua',
    coords: { lat: 36.360, lng: 43.150 },
    hitchcockMeaning: 'Handsome; agreeable; dwelling of Ninus',
    region: 'Assyria',
    prominence: 1,
    scriptureAnchor: 'JONAH {1:2}, NAHUM {1:1}',
    figureIds: ['hezekiah', 'isaiah']
  },
  {
    id: 'ur-chaldees',
    name: 'Ur of the Chaldees',
    ancientName: 'Urim',
    coords: { lat: 30.962, lng: 46.103 },
    hitchcockMeaning: 'Fire; light; a valley',
    region: 'Southern Mesopotamia',
    prominence: 1,
    scriptureAnchor: 'GENESIS {11:31}, ACTS {7:2}',
    figureIds: ['abraham']
  },
  {
    id: 'haran',
    name: 'Haran',
    ancientName: 'Carrhae',
    coords: { lat: 36.866, lng: 39.025 },
    hitchcockMeaning: 'A mountaineer; mountainous country',
    region: 'Upper Mesopotamia',
    prominence: 2,
    scriptureAnchor: 'GENESIS {12:4}, ACTS {7:4}',
    figureIds: ['abraham']
  },
  {
    id: 'susa',
    name: 'Susa (Shushan)',
    ancientName: 'Shush',
    coords: { lat: 32.190, lng: 48.257 },
    hitchcockMeaning: 'Lily; rose; joy',
    region: 'Elam / Persia',
    prominence: 1,
    scriptureAnchor: 'NEHEMIAH {1:1}, ESTHER {1:2}, DANIEL {8:2}',
    figureIds: ['ezra-nehemiah', 'daniel']
  },
  {
    id: 'damascus',
    name: 'Damascus',
    ancientName: 'Dimmashq',
    coords: { lat: 33.513, lng: 36.292 },
    hitchcockMeaning: 'A sack full of blood; similitude of burning',
    region: 'Syria',
    prominence: 1,
    scriptureAnchor: 'ACTS {9:3}, GENESIS {15:2}',
    figureIds: ['paul', 'abraham']
  },
  {
    id: 'antioch-syria',
    name: 'Antioch (Syria)',
    ancientName: 'Antiochia',
    coords: { lat: 36.202, lng: 36.160 },
    hitchcockMeaning: 'Speedy as a chariot; withstanding',
    region: 'Syria',
    prominence: 1,
    scriptureAnchor: 'ACTS {11:26}, {13:1}',
    figureIds: ['paul', 'peter']
  },
  {
    id: 'corinth',
    name: 'Corinth',
    ancientName: 'Corinthus',
    coords: { lat: 37.906, lng: 22.880 },
    hitchcockMeaning: 'Which is adorned; beauty',
    region: 'Achaia / Greece',
    prominence: 1,
    scriptureAnchor: 'ACTS {18:1}, 1 CORINTHIANS {1:2}',
    figureIds: ['paul']
  },
  {
    id: 'athens',
    name: 'Athens',
    ancientName: 'Athenai',
    coords: { lat: 37.971, lng: 23.726 },
    hitchcockMeaning: 'Named for Athena',
    region: 'Greece',
    prominence: 2,
    scriptureAnchor: 'ACTS {17:16}, {17:22}',
    figureIds: ['paul']
  },
  {
    id: 'rome',
    name: 'Rome',
    ancientName: 'Roma',
    coords: { lat: 41.902, lng: 12.496 },
    hitchcockMeaning: 'Strength; power',
    region: 'Italy / Roman Empire',
    prominence: 1,
    scriptureAnchor: 'ACTS {28:16}, ROMANS {1:7}',
    figureIds: ['paul', 'peter', 'jesus-christ']
  },
  {
    id: 'ephesus',
    name: 'Ephesus',
    ancientName: 'Ephesos',
    coords: { lat: 37.940, lng: 27.341 },
    hitchcockMeaning: 'Desirable; chief',
    region: 'Asia Minor',
    prominence: 1,
    scriptureAnchor: 'ACTS {19:1}, EPHESIANS {1:1}',
    figureIds: ['paul']
  },
  {
    id: 'hebron',
    name: 'Hebron',
    ancientName: 'Kirjath-arba',
    coords: { lat: 31.532, lng: 35.099 },
    hitchcockMeaning: 'Society; friendship; enchanting',
    region: 'Judea / Levant',
    prominence: 1,
    scriptureAnchor: 'GENESIS {23:2}, 2 SAMUEL {2:1}',
    figureIds: ['abraham', 'david']
  },
  {
    id: 'mount-sinai',
    name: 'Mount Sinai',
    ancientName: 'Horeb / Jebel Musa',
    coords: { lat: 28.539, lng: 33.975 },
    hitchcockMeaning: 'Bush of the thorn',
    region: 'Sinai Peninsula',
    prominence: 1,
    scriptureAnchor: 'EXODUS {19:11}, {20:1}',
    figureIds: ['moses']
  }
];

// Major Biblical Journeys & Routes
export const BIBLICAL_ROUTES: BiblicalRoute[] = [
  {
    id: 'abraham-call',
    name: "Abraham's Journey of Faith",
    figureId: 'abraham',
    color: '#d4af37', // Gold
    scriptureRef: 'GENESIS {11:31}–{12:9}, HEBREWS {11:8}',
    summary: "God calls Abram out of Ur of the Chaldees, through Haran, down into Shechem, Bethel, Hebron, and Egypt.",
    stops: [
      { name: 'Ur of the Chaldees', coords: { lat: 30.962, lng: 46.103 }, note: 'Call to depart idolatrous homeland' },
      { name: 'Babylon', coords: { lat: 32.542, lng: 44.421 }, note: 'Journey northwest along Euphrates' },
      { name: 'Mari', coords: { lat: 34.400, lng: 40.900 }, note: 'Upper Euphrates trade route' },
      { name: 'Haran', coords: { lat: 36.866, lng: 39.025 }, note: 'Terah dies; Abram sets out for Canaan at 75' },
      { name: 'Damascus', coords: { lat: 33.513, lng: 36.292 }, note: 'Southern transit into Canaan' },
      { name: 'Shechem', coords: { lat: 32.213, lng: 35.281 }, note: 'First altar erected under Oak of Moreh' },
      { name: 'Bethel & Ai', coords: { lat: 31.928, lng: 35.239 }, note: 'Altar to the LORD' },
      { name: 'Hebron (Mamre)', coords: { lat: 31.532, lng: 35.099 }, note: 'Covenant confirmed; burial at Machpelah' }
    ]
  },
  {
    id: 'exodus-route',
    name: 'The Exodus & Wilderness Route',
    figureId: 'moses',
    color: '#38bdf8', // Azure Blue
    scriptureRef: 'EXODUS {12:37}–{19:2}, NUMBERS {33:1}–{33:49}',
    summary: 'The LORD delivers Israel from slavery in Egypt through the Red Sea to Mount Sinai.',
    stops: [
      { name: 'Rameses (Goshen)', coords: { lat: 30.800, lng: 31.840 }, note: 'Departure on the night of Passover' },
      { name: 'Succoth', coords: { lat: 30.550, lng: 32.100 }, note: 'First encampment' },
      { name: 'Etham', coords: { lat: 30.400, lng: 32.300 }, note: 'Edge of the wilderness' },
      { name: 'Pi-hahiroth / Red Sea', coords: { lat: 29.850, lng: 32.550 }, note: 'Miraculous Red Sea crossing' },
      { name: 'Marah', coords: { lat: 29.300, lng: 32.900 }, note: 'Bitter waters made sweet' },
      { name: 'Elim', coords: { lat: 29.050, lng: 33.150 }, note: 'Twelve wells and seventy palm trees' },
      { name: 'Rephidim', coords: { lat: 28.700, lng: 33.600 }, note: 'Water from the rock; defeat of Amalek' },
      { name: 'Mount Sinai (Horeb)', coords: { lat: 28.539, lng: 33.975 }, note: 'Giving of the Ten Commandments & Law' }
    ]
  },
  {
    id: 'paul-second-journey',
    name: "Paul's Missionary Voyage to Europe",
    figureId: 'paul',
    color: '#a78bfa', // Purple / Roman royal
    scriptureRef: 'ACTS {15:36}–{18:22}',
    summary: 'Paul carries the Gospel from Syrian Antioch across Asia Minor and enters Europe at Philippi, Athens, and Corinth.',
    stops: [
      { name: 'Antioch (Syria)', coords: { lat: 36.202, lng: 36.160 }, note: 'Departure with Silas' },
      { name: 'Tarsus', coords: { lat: 36.916, lng: 34.895 }, note: 'Paul\'s hometown' },
      { name: 'Derbe & Lystra', coords: { lat: 37.583, lng: 32.483 }, note: 'Timothy joins the mission' },
      { name: 'Troas', coords: { lat: 39.750, lng: 26.150 }, note: 'Macedonian vision: "Come over and help us"' },
      { name: 'Philippi', coords: { lat: 41.013, lng: 24.286 }, note: 'First church in Europe; prison earthquake' },
      { name: 'Thessalonica', coords: { lat: 40.640, lng: 22.944 }, note: 'Preaching in the synagogue' },
      { name: 'Berea', coords: { lat: 40.523, lng: 22.202 }, note: 'Searching the scriptures daily' },
      { name: 'Athens', coords: { lat: 37.971, lng: 23.726 }, note: 'Areopagus sermon to the Unknown God' },
      { name: 'Corinth', coords: { lat: 37.906, lng: 22.880 }, note: '18-month ministry; trial before Gallio' },
      { name: 'Ephesus', coords: { lat: 37.940, lng: 27.341 }, note: 'Brief stop before return' },
      { name: 'Caesarea & Jerusalem', coords: { lat: 31.778, lng: 35.234 }, note: 'Salutes the church at Jerusalem' }
    ]
  }
];

// World Empires Territories & Centers (Global Ancient World)
export const WORLD_EMPIRES_GEO: WorldEmpireRegion[] = [
  {
    id: 'judah',
    name: 'Kingdom of Judah (Jerusalem)',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.22)',
    dateRange: 'c. 930 – 586 BC',
    capital: { name: 'Jerusalem', coords: { lat: 31.768, lng: 35.213 } },
    approximateBounds: [
      { lat: 31.95, lng: 34.85 }, { lat: 31.95, lng: 35.50 }, { lat: 31.10, lng: 35.40 },
      { lat: 31.05, lng: 34.70 }, { lat: 31.60, lng: 34.65 }, { lat: 31.95, lng: 34.85 }
    ],
    biblicalIntersection: 'The Davidic royal line ruling from Mount Zion; Solomon\'s Temple; outlasted the Northern Kingdom until the Babylonian exile in 586 BC.',
    factionCategory: 'covenant',
    populationEstimate: '~350,000 – 450,000',
    approximateArea: '~15,000 km²'
  },
  {
    id: 'israel_kingdom',
    name: 'Kingdom of Israel (Samaria)',
    color: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.22)',
    dateRange: 'c. 930 – 722 BC',
    capital: { name: 'Samaria', coords: { lat: 32.277, lng: 35.190 } },
    approximateBounds: [
      { lat: 33.30, lng: 35.10 }, { lat: 33.30, lng: 35.80 }, { lat: 31.95, lng: 35.55 },
      { lat: 31.95, lng: 34.85 }, { lat: 32.70, lng: 34.95 }, { lat: 33.30, lng: 35.10 }
    ],
    biblicalIntersection: 'The northern ten tribes established under Jeroboam; capital at Samaria until exile by Assyria in 722 BC.',
    factionCategory: 'israel',
    populationEstimate: '~700,000 – 900,000',
    approximateArea: '~24,000 km²'
  },
  {
    id: 'phoenicia',
    name: 'Phoenicia (Allied Maritime Ports)',
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.18)',
    dateRange: 'c. 1200 – 332 BC',
    capital: { name: 'Tyre & Sidon', coords: { lat: 33.270, lng: 35.196 } },
    approximateBounds: [
      { lat: 34.80, lng: 35.65 }, { lat: 34.80, lng: 36.00 }, { lat: 33.15, lng: 35.35 },
      { lat: 33.15, lng: 35.05 }, { lat: 34.80, lng: 35.65 }
    ],
    biblicalIntersection: 'Maritime alliance with King David and Solomon; supplied cedar of Lebanon and master craftsmen for the Temple.',
    factionCategory: 'allied',
    populationEstimate: '~400,000 – 600,000',
    approximateArea: '~12,000 km²'
  },
  {
    id: 'moab_kingdom',
    name: 'Kingdom of Moab',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.16)',
    dateRange: 'c. 1300 – 582 BC',
    capital: { name: 'Kir-Hareseth (Kerak)', coords: { lat: 31.18, lng: 35.70 } },
    approximateBounds: [
      { lat: 31.85, lng: 35.65 }, { lat: 31.85, lng: 36.15 }, { lat: 31.05, lng: 36.00 },
      { lat: 31.05, lng: 35.45 }, { lat: 31.85, lng: 35.65 }
    ],
    biblicalIntersection: 'Rebelled against Israel following King Ahab\'s death (2 Kings 1:1, 3:4–27); recorded on the Mesha Stele.',
    factionCategory: 'hostile',
    populationEstimate: '~150,000 – 250,000',
    approximateArea: '~5,000 km²'
  },
  {
    id: 'aram_damascus',
    name: 'Aram-Damascus (Syrian Kingdom)',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.16)',
    dateRange: 'c. 1100 – 732 BC',
    capital: { name: 'Damascus', coords: { lat: 33.513, lng: 36.292 } },
    approximateBounds: [
      { lat: 34.80, lng: 36.00 }, { lat: 34.80, lng: 37.50 }, { lat: 32.50, lng: 37.00 },
      { lat: 32.50, lng: 35.80 }, { lat: 34.80, lng: 36.00 }
    ],
    biblicalIntersection: 'Aramean adversary of Israel under Ben-hadad and Hazael (1 Kings 20, 2 Kings 6–8, 16); crushed by Assyria in 732 BC.',
    factionCategory: 'hostile',
    populationEstimate: '~500,000 – 700,000',
    approximateArea: '~45,000 km²'
  },
  {
    id: 'philistia',
    name: 'Philistine Pentapolis',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.16)',
    dateRange: 'c. 1175 – 604 BC',
    capital: { name: 'Gath & Ashdod', coords: { lat: 31.70, lng: 34.85 } },
    approximateBounds: [
      { lat: 31.85, lng: 34.70 }, { lat: 31.85, lng: 34.90 }, { lat: 31.25, lng: 34.55 },
      { lat: 31.25, lng: 34.25 }, { lat: 31.85, lng: 34.70 }
    ],
    biblicalIntersection: 'Five coastal royal cities (Gaza, Ashkelon, Ashdod, Gath, Ekron); cult of Baal-zebub at Ekron in 2 Kings 1:2.',
    factionCategory: 'hostile',
    populationEstimate: '~200,000 – 300,000',
    approximateArea: '~3,500 km²'
  },
  {
    id: 'edom_kingdom',
    name: 'Kingdom of Edom (Idumea)',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.16)',
    dateRange: 'c. 1300 – 125 BC',
    capital: { name: 'Bozrah & Sela', coords: { lat: 30.74, lng: 35.60 } },
    approximateBounds: [
      { lat: 31.10, lng: 35.25 }, { lat: 31.10, lng: 35.85 }, { lat: 29.50, lng: 35.50 },
      { lat: 29.50, lng: 35.00 }, { lat: 31.10, lng: 35.25 }
    ],
    biblicalIntersection: 'Descendants of Esau in the southern highlands; allied with Judah and Israel during the campaign against Moab in 2 Kings 3.',
    factionCategory: 'hostile',
    populationEstimate: '~100,000 – 180,000',
    approximateArea: '~8,000 km²'
  },
  {
    id: 'assyria',
    name: 'Neo-Assyrian Empire',
    color: '#9e4747',
    fillColor: 'rgba(158, 71, 71, 0.15)',
    dateRange: 'c. 911 – 609 BC',
    capital: { name: 'Nineveh', coords: { lat: 36.360, lng: 43.150 } },
    approximateBounds: [
      { lat: 38.5, lng: 40.0 }, { lat: 38.0, lng: 45.0 }, { lat: 35.0, lng: 46.0 },
      { lat: 33.2, lng: 44.5 }, { lat: 34.0, lng: 41.5 }, { lat: 35.2, lng: 38.2 },
      { lat: 36.8, lng: 37.5 }, { lat: 37.8, lng: 37.5 }, { lat: 38.5, lng: 40.0 }
    ],
    biblicalIntersection: 'Exiled the Northern Kingdom (722 BC); invaded Judah and besieged Hezekiah in Jerusalem (701 BC; Taylor Prism).',
    factionCategory: 'hostile',
    populationEstimate: '~15,000,000 – 20,000,000',
    approximateArea: '~1,400,000 km²'
  },
  {
    id: 'babylon',
    name: 'Neo-Babylonian Empire',
    color: '#467599',
    fillColor: 'rgba(70, 117, 153, 0.15)',
    dateRange: '626 – 539 BC',
    capital: { name: 'Babylon', coords: { lat: 32.542, lng: 44.421 } },
    approximateBounds: [
      { lat: 36.0, lng: 38.0 }, { lat: 36.5, lng: 44.0 }, { lat: 33.0, lng: 47.0 },
      { lat: 30.0, lng: 48.0 }, { lat: 30.5, lng: 45.0 }, { lat: 31.5, lng: 37.5 },
      { lat: 34.5, lng: 37.5 }, { lat: 36.0, lng: 38.0 }
    ],
    biblicalIntersection: 'Destroyed Solomon\'s Temple in 586 BC; 70-year captivity in Babylon; vindication of Daniel (Nabonidus Cylinder).',
    factionCategory: 'hostile',
    populationEstimate: '~10,000,000 – 14,000,000',
    approximateArea: '~1,200,000 km²'
  },
  {
    id: 'old_babylon',
    name: 'Old Babylonian & Kassite Kingdom',
    color: '#5c768d',
    fillColor: 'rgba(92, 118, 141, 0.15)',
    dateRange: 'c. 1894 – 1155 BC',
    capital: { name: 'Babylon & Ur', coords: { lat: 32.542, lng: 44.421 } },
    approximateBounds: [
      { lat: 35.0, lng: 41.5 }, { lat: 35.5, lng: 44.5 }, { lat: 33.0, lng: 47.0 },
      { lat: 29.8, lng: 48.5 }, { lat: 30.5, lng: 46.0 }, { lat: 32.0, lng: 42.5 },
      { lat: 35.0, lng: 41.5 }
    ],
    biblicalIntersection: 'Land of Shinar (Genesis 10–11); Tower of Babel; origin of Abram called out of Ur of the Chaldees.',
    factionCategory: 'hostile',
    populationEstimate: '~3,500,000 – 5,000,000',
    approximateArea: '~450,000 km²'
  },
  {
    id: 'media',
    name: 'Median Empire',
    color: '#854d0e',
    fillColor: 'rgba(133, 77, 14, 0.15)',
    dateRange: '678 – 549 BC',
    capital: { name: 'Ecbatana', coords: { lat: 34.80, lng: 48.51 } },
    approximateBounds: [
      { lat: 40.5, lng: 45.0 }, { lat: 40.0, lng: 60.0 }, { lat: 32.0, lng: 60.0 },
      { lat: 30.0, lng: 52.0 }, { lat: 32.5, lng: 45.5 }, { lat: 38.0, lng: 44.0 },
      { lat: 40.5, lng: 45.0 }
    ],
    biblicalIntersection: 'Allied with Babylon to overthrow Nineveh (612 BC); Daniel 5:28, 6:8 ("the law of the Medes and Persians").',
    factionCategory: 'hostile',
    populationEstimate: '~5,000,000 – 7,500,000',
    approximateArea: '~2,800,000 km²'
  },
  {
    id: 'persia',
    name: 'Achaemenid Medo-Persian Empire',
    color: '#3d8b7d',
    fillColor: 'rgba(61, 139, 125, 0.15)',
    dateRange: '539 – 331 BC',
    capital: { name: 'Susa & Persepolis', coords: { lat: 32.190, lng: 48.257 } },
    approximateBounds: [
      { lat: 41.0, lng: 28.0 }, { lat: 40.0, lng: 68.0 }, { lat: 25.0, lng: 68.0 },
      { lat: 28.0, lng: 48.0 }, { lat: 30.0, lng: 32.0 }, { lat: 34.0, lng: 34.0 },
      { lat: 38.0, lng: 27.0 }, { lat: 41.0, lng: 28.0 }
    ],
    biblicalIntersection: 'Decree of Cyrus permitting the Jewish return (539 BC; Cyrus Cylinder); Nehemiah and Esther in Persian royal courts.',
    factionCategory: 'allied',
    populationEstimate: '~35,000,000 – 50,000,000',
    approximateArea: '~5,500,000 km²'
  },
  {
    id: 'parthia',
    name: 'Parthian Empire (Arsacid Dynasty)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: '247 BC – AD 224',
    capital: { name: 'Ctesiphon', coords: { lat: 33.09, lng: 44.58 } },
    approximateBounds: [
      { lat: 39.0, lng: 44.0 }, { lat: 40.0, lng: 65.0 }, { lat: 28.0, lng: 65.0 },
      { lat: 27.0, lng: 51.0 }, { lat: 30.0, lng: 46.0 }, { lat: 34.0, lng: 42.0 },
      { lat: 39.0, lng: 44.0 }
    ],
    biblicalIntersection: 'Great eastern rival of the Roman Empire; pilgrims from Parthia heard the Gospel at Pentecost (Acts 2:9).',
    factionCategory: 'global_power',
    populationEstimate: '~15,000,000 – 18,000,000',
    approximateArea: '~3,000,000 km²'
  },
  {
    id: 'egypt',
    name: 'Ancient Egyptian Empire',
    color: '#c99738',
    fillColor: 'rgba(201, 151, 56, 0.14)',
    dateRange: 'c. 2100 – 1070 BC',
    capital: { name: 'Thebes & Memphis', coords: { lat: 25.718, lng: 32.657 } },
    approximateBounds: [
      { lat: 24.5, lng: 32.0 }, { lat: 27.0, lng: 31.0 }, { lat: 30.0, lng: 30.5 },
      { lat: 31.5, lng: 30.0 }, { lat: 31.5, lng: 32.5 }, { lat: 31.0, lng: 34.5 },
      { lat: 28.0, lng: 34.5 }, { lat: 24.5, lng: 33.5 }, { lat: 24.5, lng: 32.0 }
    ],
    biblicalIntersection: 'Shelter for Abraham and Jacob; slavery and 10 plagues of Exodus; Merneptah Stele (1208 BC) earliest extrabiblical mention of Israel.',
    factionCategory: 'hostile',
    populationEstimate: '~4,500,000 – 6,000,000',
    approximateArea: '~1,000,000 km²'
  },
  {
    id: 'saite_egypt',
    name: 'Late Dynastic Egypt (26th Saite Dynasty)',
    color: '#d97706',
    fillColor: 'rgba(217, 119, 6, 0.15)',
    dateRange: '664 – 525 BC',
    capital: { name: 'Sais & Memphis', coords: { lat: 30.96, lng: 30.77 } },
    approximateBounds: [
      { lat: 24.0, lng: 32.5 }, { lat: 29.5, lng: 30.5 }, { lat: 31.5, lng: 29.5 },
      { lat: 31.5, lng: 33.0 }, { lat: 28.0, lng: 34.0 }, { lat: 24.0, lng: 33.5 },
      { lat: 24.0, lng: 32.5 }
    ],
    biblicalIntersection: 'Pharaoh Necho slew King Josiah at Megiddo (2 Kings 23:29); Jeremiah taken to Tahpanhes in Egypt.',
    factionCategory: 'hostile',
    populationEstimate: '~3,800,000 – 5,000,000',
    approximateArea: '~800,000 km²'
  },
  {
    id: 'ptolemaic_egypt',
    name: 'Ptolemaic Kingdom of Egypt',
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.16)',
    dateRange: '305 – 30 BC',
    capital: { name: 'Alexandria', coords: { lat: 31.20, lng: 29.91 } },
    approximateBounds: [
      { lat: 23.5, lng: 32.5 }, { lat: 28.0, lng: 29.5 }, { lat: 31.5, lng: 25.0 },
      { lat: 31.5, lng: 34.0 }, { lat: 27.5, lng: 34.5 }, { lat: 23.5, lng: 33.0 },
      { lat: 23.5, lng: 32.5 }
    ],
    biblicalIntersection: 'Daniel 11 ("King of the South"); commissioned the Septuagint (LXX) translation of the Hebrew Scriptures into Greek.',
    factionCategory: 'allied',
    populationEstimate: '~7,000,000',
    approximateArea: '~1,000,000 km²'
  },
  {
    id: 'kush_nubia',
    name: 'Kingdom of Kush & 25th Nubian Dynasty (Ethiopia / Upper Nile)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: 'c. 1070 BC – AD 350',
    capital: { name: 'Napata & Meroë', coords: { lat: 16.94, lng: 33.75 } },
    approximateBounds: [
      { lat: 24.0, lng: 32.9 }, { lat: 22.0, lng: 36.5 }, { lat: 16.0, lng: 39.0 },
      { lat: 13.5, lng: 37.0 }, { lat: 12.0, lng: 33.0 }, { lat: 12.5, lng: 29.5 },
      { lat: 18.0, lng: 28.5 }, { lat: 22.5, lng: 30.5 }, { lat: 24.0, lng: 32.9 }
    ],
    biblicalIntersection: 'Pharaoh Tirhakah (Taharqa) marched against Sennacherib (2 Kings 19:9, Isaiah 37:9); Queen Candace\'s treasurer baptized in Acts 8:27.',
    factionCategory: 'global_power',
    populationEstimate: '~2,000,000 – 3,500,000',
    approximateArea: '~1,200,000 km²'
  },
  {
    id: 'china_zhou',
    name: 'Ancient China — Western & Eastern Zhou Dynasties',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: 'c. 1046 – 256 BC',
    capital: { name: 'Haojing & Luoyang', coords: { lat: 34.62, lng: 112.45 } },
    approximateBounds: [
      { lat: 40.5, lng: 106.0 }, { lat: 40.8, lng: 117.5 }, { lat: 38.0, lng: 119.5 },
      { lat: 35.5, lng: 120.0 }, { lat: 30.5, lng: 121.5 }, { lat: 28.0, lng: 113.0 },
      { lat: 29.5, lng: 104.0 }, { lat: 34.5, lng: 104.5 }, { lat: 40.5, lng: 106.0 }
    ],
    biblicalIntersection: 'Contemporary eastern superpower during Israel\'s monarchy and exile; roots of the silk trade network known biblically as the Land of Sinim (Isaiah 49:12).',
    factionCategory: 'global_power',
    populationEstimate: '~35,000,000 – 40,000,000',
    approximateArea: '~3,400,000 km²'
  },
  {
    id: 'china_han',
    name: 'Imperial China — Han Dynasty (Land of Sinim)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: '202 BC – AD 220',
    capital: { name: 'Chang\'an & Luoyang', coords: { lat: 34.26, lng: 108.94 } },
    approximateBounds: [
      { lat: 40.5, lng: 94.0 }, { lat: 40.0, lng: 100.0 }, { lat: 41.5, lng: 112.0 },
      { lat: 41.5, lng: 123.0 }, { lat: 38.0, lng: 121.0 }, { lat: 32.0, lng: 121.5 },
      { lat: 23.0, lng: 114.0 }, { lat: 22.0, lng: 108.0 }, { lat: 26.0, lng: 102.0 },
      { lat: 31.0, lng: 103.0 }, { lat: 36.5, lng: 98.0 }, { lat: 40.5, lng: 94.0 }
    ],
    biblicalIntersection: 'Isaiah 49:12 — "Behold, these from the land of Sinim." Contemporary world empire during Christ and Apostolic Age; Silk Road terminus.',
    factionCategory: 'global_power',
    populationEstimate: '~57,600,000 (Census of AD 2)',
    approximateArea: '~6,000,000 km²'
  },
  {
    id: 'scythia_steppes',
    name: 'Scythians, Cimmerians & Sarmatians (Northern Steppes / Russia)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: 'c. 900 BC – AD 200',
    capital: { name: 'Neapolis Scythica (Crimea / Steppes)', coords: { lat: 44.94, lng: 34.12 } },
    approximateBounds: [
      { lat: 46.0, lng: 28.5 }, { lat: 51.5, lng: 31.0 }, { lat: 53.0, lng: 40.0 },
      { lat: 53.5, lng: 52.0 }, { lat: 50.0, lng: 60.0 }, { lat: 46.5, lng: 50.5 },
      { lat: 43.5, lng: 43.0 }, { lat: 44.5, lng: 36.5 }, { lat: 44.4, lng: 33.8 },
      { lat: 46.0, lng: 30.5 }, { lat: 46.0, lng: 28.5 }
    ],
    biblicalIntersection: 'Ezekiel 38:2–6, 39:1 ("Gog of the land of Magog, prince of Rosh, Meshech, and Tubal... of the north parts"); Colossians 3:11.',
    factionCategory: 'global_power',
    populationEstimate: '~1,800,000 – 2,800,000 horse archers & nomadic tribes',
    approximateArea: '~3,200,000 km²'
  },
  {
    id: 'india_maurya',
    name: 'Maurya Empire & Kushan Realm (Ancient India / Hoddu)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: 'c. 322 BC – AD 230',
    capital: { name: 'Pataliputra (Patna)', coords: { lat: 25.61, lng: 85.14 } },
    approximateBounds: [
      { lat: 34.0, lng: 71.5 }, { lat: 31.0, lng: 78.0 }, { lat: 28.0, lng: 85.0 },
      { lat: 24.0, lng: 90.0 }, { lat: 20.0, lng: 86.5 }, { lat: 13.0, lng: 80.5 },
      { lat: 8.5, lng: 77.5 }, { lat: 15.0, lng: 74.0 }, { lat: 23.0, lng: 69.0 },
      { lat: 28.0, lng: 66.0 }, { lat: 34.0, lng: 71.5 }
    ],
    biblicalIntersection: 'Esther 1:1, 8:9 — "From India [Hebrew: Hoddu] even unto Ethiopia, an hundred twenty and seven provinces." Connected via maritime spice trade.',
    factionCategory: 'global_power',
    populationEstimate: '~45,000,000 – 55,000,000',
    approximateArea: '~5,000,000 km²'
  },
  {
    id: 'kingdom_sheba',
    name: 'Kingdom of Saba (Sheba / Southern Arabia)',
    color: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.18)',
    dateRange: 'c. 1200 BC – AD 275',
    capital: { name: 'Marib', coords: { lat: 15.42, lng: 45.34 } },
    approximateBounds: [
      { lat: 17.5, lng: 42.5 }, { lat: 18.5, lng: 46.5 }, { lat: 17.5, lng: 53.5 },
      { lat: 14.5, lng: 51.0 }, { lat: 12.8, lng: 45.0 }, { lat: 12.8, lng: 43.3 },
      { lat: 15.0, lng: 42.8 }, { lat: 17.5, lng: 42.5 }
    ],
    biblicalIntersection: '1 Kings 10:1–13 — Queen of Sheba journeyed to Jerusalem with frankincense, gold, and gems to test Solomon with hard questions.',
    factionCategory: 'global_power',
    populationEstimate: '~1,200,000 – 2,000,000',
    approximateArea: '~450,000 km²'
  },
  {
    id: 'nabataea',
    name: 'Nabataean Kingdom (Petra / Arabia Petraea)',
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.16)',
    dateRange: 'c. 312 BC – AD 106',
    capital: { name: 'Petra (Sela)', coords: { lat: 30.328, lng: 35.444 } },
    approximateBounds: [
      { lat: 31.0, lng: 33.5 }, { lat: 31.3, lng: 35.5 }, { lat: 31.5, lng: 37.0 },
      { lat: 29.5, lng: 38.5 }, { lat: 26.8, lng: 38.0 }, { lat: 26.5, lng: 36.5 },
      { lat: 28.5, lng: 34.5 }, { lat: 31.0, lng: 33.5 }
    ],
    biblicalIntersection: '2 Corinthians 11:32 — Governor under King Aretas IV kept Damascus city; ancient incense trade hub carved in rose-red sandstone.',
    factionCategory: 'allied',
    populationEstimate: '~1,000,000',
    approximateArea: '~250,000 km²'
  },
  {
    id: 'greece_seleucid',
    name: 'Seleucid Empire (Hellenistic Empire)',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.16)',
    dateRange: '312 – 63 BC',
    capital: { name: 'Antioch & Seleucia', coords: { lat: 36.202, lng: 36.160 } },
    approximateBounds: [
      { lat: 39.5, lng: 26.5 }, { lat: 40.0, lng: 48.0 }, { lat: 32.0, lng: 48.0 },
      { lat: 33.2, lng: 36.8 }, { lat: 35.0, lng: 36.0 }, { lat: 38.0, lng: 27.0 },
      { lat: 39.5, lng: 26.5 }
    ],
    biblicalIntersection: 'Daniel 8 & 11 ("King of the North"); Antiochus IV Epiphanes profaned the Temple with the abomination of desolation (167 BC).',
    factionCategory: 'hostile',
    populationEstimate: '~18,000,000 – 25,000,000',
    approximateArea: '~3,900,000 km²'
  },
  {
    id: 'rome',
    name: 'Roman Empire',
    color: '#b55938',
    fillColor: 'rgba(181, 89, 56, 0.15)',
    dateRange: '63 BC – AD 476',
    capital: { name: 'Rome', coords: { lat: 41.902, lng: 12.496 } },
    approximateBounds: [
      { lat: 44.0, lng: 11.0 }, { lat: 42.0, lng: 25.0 }, { lat: 38.0, lng: 37.0 },
      { lat: 32.0, lng: 36.0 }, { lat: 31.0, lng: 30.0 }, { lat: 32.0, lng: 13.0 },
      { lat: 38.0, lng: 11.0 }, { lat: 44.0, lng: 11.0 }
    ],
    biblicalIntersection: 'The fullness of time: census of Augustus (Luke 2:1), crucifixion under Pilate (Pilate Stone), proclamation across Roman roads.',
    factionCategory: 'hostile',
    populationEstimate: '~54,000,000 – 65,000,000',
    approximateArea: '~5,000,000 km²'
  }
];

export interface ChronologicalEra {
  id: string;
  name: string;
  yearLabel: string;
  startYear: number;
  endYear: number;
  rulingEmpireId?: string;
  additionalRegionIds?: string[];
  focusCenter: GeoCoordinate;
  focusZoom: number;
  headline: string;
  historicalSummary: string;
  activeSiteIds: string[];
  activeRouteIds: string[];
  activeFigureIds: string[];
}

export const CHRONOLOGICAL_ERAS: ChronologicalEra[] = [
  {
    id: 'patriarchs',
    name: 'Patriarchs & Promise',
    yearLabel: 'c. 2100 – 1800 BC',
    startYear: -2100,
    endYear: -1800,
    rulingEmpireId: 'egypt',
    additionalRegionIds: ['old_babylon', 'kush_nubia', 'china_zhou', 'scythia_steppes', 'kingdom_sheba'],
    focusCenter: { lat: 33.0, lng: 42.0 },
    focusZoom: 5,
    headline: 'The Call of Abraham · Middle Kingdom Egypt & Ur III',
    historicalSummary: 'God calls Abram out of Ur of the Chaldees, through Haran, into Canaan. The Middle Kingdom of Egypt and Ur III rule the wider ancient world alongside early civilizations in Nubia and the Far East.',
    activeRouteIds: ['abraham-call'],
    activeSiteIds: ['nabonidus-cylinder'],
    activeFigureIds: ['abraham']
  },
  {
    id: 'exodus',
    name: 'Exodus & Law',
    yearLabel: 'c. 1446 – 1406 BC',
    startYear: -1446,
    endYear: -1406,
    rulingEmpireId: 'egypt',
    additionalRegionIds: ['old_babylon', 'kush_nubia', 'china_zhou', 'scythia_steppes', 'kingdom_sheba'],
    focusCenter: { lat: 29.5, lng: 33.2 },
    focusZoom: 6,
    headline: 'The Deliverance from Egypt · Mount Sinai & Red Sea',
    historicalSummary: "The LORD judges Egypt's gods with 10 plagues, delivers Israel through the Red Sea, and establishes His Holy Law at Mount Sinai. Ruled by New Kingdom Egypt (18th Dynasty).",
    activeRouteIds: ['exodus-route'],
    activeSiteIds: ['merneptah-stele'],
    activeFigureIds: ['moses']
  },
  {
    id: 'united_monarchy',
    name: 'United Monarchy',
    yearLabel: 'c. 1050 – 930 BC',
    startYear: -1050,
    endYear: -930,
    additionalRegionIds: [
      'judah', 'israel_kingdom', 'phoenicia', 'aram_damascus', 'philistia',
      'moab_kingdom', 'edom_kingdom', 'egypt', 'kush_nubia', 'kingdom_sheba',
      'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 31.8, lng: 35.3 },
    focusZoom: 7,
    headline: "The Davidic Kingdom · Solomon's Temple & Jerusalem",
    historicalSummary: "David establishes Jerusalem as the royal capital; Solomon builds the First Temple. Attested by the Tel Dan Stele ('House of David') and visited by the Queen of Sheba.",
    activeRouteIds: [],
    activeSiteIds: ['tel-dan-stele', 'mesha-stele'],
    activeFigureIds: ['david', 'solomon']
  },
  {
    id: 'divided_monarchy_prophets',
    name: 'Divided Monarchy: Elijah & Elisha',
    yearLabel: 'c. 853 – 841 BC',
    startYear: -853,
    endYear: -841,
    additionalRegionIds: [
      'judah', 'israel_kingdom', 'phoenicia', 'moab_kingdom', 'aram_damascus',
      'philistia', 'edom_kingdom', 'assyria', 'kush_nubia', 'kingdom_sheba',
      'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 32.1, lng: 35.5 },
    focusZoom: 7,
    headline: "The Divided Monarchy · Moabite Rebellion & Elijah's Ministry",
    historicalSummary: "Following Ahab's death, Moab rebels against Israel (Mesha Stele, 2 Kings 1:1, 3:4). Ahaziah falls sick and seeks Baal-zebub at Ekron; Elijah prophesies judgment. Attested by the Mesha Stele, Tel Dan Stele, and Black Obelisk.",
    activeRouteIds: [],
    activeSiteIds: ['mesha-stele', 'tel-dan-stele', 'black-obelisk'],
    activeFigureIds: ['david', 'hezekiah']
  },
  {
    id: '2kings_jehu',
    name: "Jehu's Dynasty & Tiglath-Pileser III",
    yearLabel: 'c. 841 – 732 BC',
    startYear: -841,
    endYear: -732,
    rulingEmpireId: 'assyria',
    additionalRegionIds: [
      'judah', 'israel_kingdom', 'phoenicia', 'moab_kingdom', 'aram_damascus',
      'kush_nubia', 'kingdom_sheba', 'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 33.5, lng: 37.0 },
    focusZoom: 6,
    headline: "Jehu's Coup & Assyrian Hegemony Under Tiglath-Pileser III",
    historicalSummary: "Jehu executes Ahab's line and pays tribute to Shalmaneser III. Assyria expands westward, exacting tribute from Israel until Tiglath-Pileser III begins deportations. Discovered: The Black Obelisk of Shalmaneser III and Tel Dan Stele.",
    activeRouteIds: [],
    activeSiteIds: ['black-obelisk', 'tel-dan-stele'],
    activeFigureIds: ['hezekiah']
  },
  {
    id: '2kings_fall_samaria',
    name: 'Fall of Samaria & Assyrian Exile',
    yearLabel: '722 BC',
    startYear: -722,
    endYear: -722,
    rulingEmpireId: 'assyria',
    additionalRegionIds: [
      'judah', 'phoenicia', 'babylon', 'kush_nubia', 'kingdom_sheba',
      'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 32.5, lng: 35.5 },
    focusZoom: 6,
    headline: "The Fall of Samaria · Assyrian Deportation of Israel",
    historicalSummary: "Hoshea rebels against Assyria; Shalmaneser V and Sargon II capture Samaria in 722 BC, exiling the ten northern tribes across Upper Mesopotamia and Media. Discovered: The Khorsabad Annals of Sargon II.",
    activeRouteIds: [],
    activeSiteIds: ['sargon-prism'],
    activeFigureIds: ['hezekiah', 'isaiah']
  },
  {
    id: 'assyrian_siege',
    name: 'Assyrian Empire',
    yearLabel: '722 – 701 BC',
    startYear: -722,
    endYear: -701,
    rulingEmpireId: 'assyria',
    additionalRegionIds: [
      'judah', 'israel_kingdom', 'phoenicia', 'babylon', 'kush_nubia',
      'kingdom_sheba', 'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 34.0, lng: 39.0 },
    focusZoom: 6,
    headline: "The Assyrian Invasion · Sennacherib's Siege of Jerusalem",
    historicalSummary: "The Neo-Assyrian Empire conquers Samaria (722 BC) and besieges Hezekiah in Jerusalem in 701 BC. Discovered: The Taylor Prism of Sennacherib & Siloam Tunnel Inscription.",
    activeRouteIds: [],
    activeSiteIds: ['taylor-prism', 'siloam-inscription', 'ketef-hinnom-scrolls'],
    activeFigureIds: ['hezekiah', 'isaiah']
  },
  {
    id: 'babylonian_exile',
    name: 'Babylonian Exile',
    yearLabel: '605 – 539 BC',
    startYear: -605,
    endYear: -539,
    rulingEmpireId: 'babylon',
    additionalRegionIds: [
      'judah', 'media', 'saite_egypt', 'kush_nubia', 'scythia_steppes',
      'china_zhou', 'kingdom_sheba'
    ],
    focusCenter: { lat: 32.5, lng: 44.4 },
    focusZoom: 6,
    headline: 'The Fall of Jerusalem · Daniel in Babylon',
    historicalSummary: 'Nebuchadnezzar captures Jerusalem, burns the Temple in 586 BC, and carries Judah into 70 years of exile. Daniel testifies to the Most High in the courts of Babylon. Discovered: Nabonidus Cylinder naming Belshazzar.',
    activeRouteIds: [],
    activeSiteIds: ['nabonidus-cylinder', 'ketef-hinnom-scrolls'],
    activeFigureIds: ['daniel', 'jeremiah']
  },
  {
    id: 'persian_restoration',
    name: 'Persian Restoration',
    yearLabel: '539 – 331 BC',
    startYear: -539,
    endYear: -331,
    rulingEmpireId: 'persia',
    additionalRegionIds: [
      'judah', 'greece_seleucid', 'kush_nubia', 'india_maurya',
      'scythia_steppes', 'china_zhou', 'kingdom_sheba'
    ],
    focusCenter: { lat: 33.0, lng: 46.0 },
    focusZoom: 5,
    headline: 'The Decree of Cyrus · Rebuilding the Temple & Walls',
    historicalSummary: 'Cyrus the Great conquers Babylon in 539 BC and decrees the Jewish return. Nehemiah and Ezra rebuild the walls and worship in Jerusalem under Artaxerxes. Discovered: The Cyrus Cylinder.',
    activeRouteIds: [],
    activeSiteIds: ['cyrus-cylinder'],
    activeFigureIds: ['ezra-nehemiah', 'daniel']
  },
  {
    id: 'roman_christ',
    name: 'Christ & Rome',
    yearLabel: '4 BC – AD 33',
    startYear: -4,
    endYear: 33,
    rulingEmpireId: 'rome',
    additionalRegionIds: [
      'judah', 'parthia', 'china_han', 'kush_nubia', 'nabataea',
      'scythia_steppes', 'india_maurya'
    ],
    focusCenter: { lat: 32.1, lng: 35.2 },
    focusZoom: 7,
    headline: 'The Fullness of Time · Ministry, Death & Resurrection of Christ',
    historicalSummary: 'In Roman Judea under Caesar Augustus, Tiberius, and Pontius Pilate, Jesus Christ is born in Bethlehem, crucified in Jerusalem, and rises bodily on the third day. Discovered: The Pilate Stone & Caiaphas Ossuary.',
    activeRouteIds: [],
    activeSiteIds: ['pilate-stone', 'caiaphas-ossuary'],
    activeFigureIds: ['jesus-christ']
  },
  {
    id: 'apostolic_church',
    name: 'Apostolic Age',
    yearLabel: 'AD 33 – 96',
    startYear: 33,
    endYear: 96,
    rulingEmpireId: 'rome',
    additionalRegionIds: [
      'judah', 'parthia', 'china_han', 'kush_nubia', 'nabataea',
      'scythia_steppes', 'india_maurya'
    ],
    focusCenter: { lat: 38.0, lng: 25.0 },
    focusZoom: 5,
    headline: 'The Gospel to the Nations · Roman Highways & Courts',
    historicalSummary: 'Apostle Paul and the Apostles proclaim the risen Christ across Roman provinces from Syrian Antioch to Philippi, Athens, Corinth, and Rome. Discovered: Gallio Inscription at Delphi & Erastus Inscription at Corinth.',
    activeRouteIds: ['paul-second-journey'],
    activeSiteIds: ['gallio-inscription', 'erastus-inscription'],
    activeFigureIds: ['paul', 'peter']
  },
  {
    id: 'all',
    name: 'All Eras',
    yearLabel: 'c. 2100 BC – AD 100+',
    startYear: -2100,
    endYear: 100,
    focusCenter: { lat: 31.0, lng: 52.0 },
    focusZoom: 4,
    headline: 'The Complete Biblical World in History',
    historicalSummary: 'All surviving archaeological discoveries, imperial extents, and biblical routes across the known ancient world from the Atlantic to China.',
    activeRouteIds: ['abraham-call', 'exodus-route', 'paul-second-journey'],
    activeSiteIds: [
      'pilate-stone', 'caiaphas-ossuary', 'taylor-prism', 'siloam-inscription',
      'cyrus-cylinder', 'nabonidus-cylinder', 'tel-dan-stele', 'merneptah-stele',
      'gallio-inscription', 'erastus-inscription', 'ketef-hinnom-scrolls', 'mesha-stele',
      'black-obelisk', 'sargon-prism'
    ],
    activeFigureIds: [
      'jesus-christ', 'daniel', 'hezekiah', 'moses', 'abraham', 'david',
      'isaiah', 'paul', 'peter', 'jeremiah', 'solomon', 'ezra-nehemiah'
    ]
  }
];

export interface BiblicalGeographicEntity {
  name: string;
  ancientRegion: string;
  coords: GeoCoordinate;
  zoom: number;
  note: string;
  scriptureRef?: string;
}

export const BIBLICAL_GEOGRAPHIC_ENTITIES: Record<string, BiblicalGeographicEntity> = {
  tishbite: {
    name: 'Tishbe in Gilead',
    ancientRegion: 'Gilead / Transjordan',
    coords: { lat: 32.410, lng: 35.730 },
    zoom: 9,
    note: "Hometown of the Prophet Elijah ('Elijah the Tishbite'), located in the mountainous region of Gilead east of the Jordan.",
    scriptureRef: '1 KINGS 17:1, 2 KINGS 1:3'
  },
  tishbe: {
    name: 'Tishbe in Gilead',
    ancientRegion: 'Gilead / Transjordan',
    coords: { lat: 32.410, lng: 35.730 },
    zoom: 9,
    note: "Mountainous highland village east of the Jordan River where Elijah was born.",
    scriptureRef: '1 KINGS 17:1'
  },
  samaria: {
    name: 'Samaria (Shomron)',
    ancientRegion: 'Kingdom of Israel',
    coords: { lat: 32.277, lng: 35.190 },
    zoom: 9,
    note: 'Royal capital of the Northern Kingdom of Israel from King Omri until its fall to the Assyrians in 722 BC.',
    scriptureRef: '1 KINGS 16:24, 2 KINGS 1:2, 17:6'
  },
  ekron: {
    name: 'Ekron (Tel Miqne)',
    ancientRegion: 'Philistia',
    coords: { lat: 31.777, lng: 34.857 },
    zoom: 9,
    note: 'Northernmost city of the Philistine Pentapolis; center of the cult of Baal-zebub whom Ahaziah sought in 2 Kings 1:2.',
    scriptureRef: '2 KINGS 1:2–3, 1 SAMUEL 5:10'
  },
  moab: {
    name: 'Moab (East of Dead Sea)',
    ancientRegion: 'Transjordan',
    coords: { lat: 31.500, lng: 35.776 },
    zoom: 8,
    note: "Kingdom of King Mesha east of the Dead Sea; rebelled against Israel after King Ahab died (2 Kings 1:1, 3:4; Mesha Stele).",
    scriptureRef: '2 KINGS 1:1, 3:4–27'
  },
  israel: {
    name: 'Kingdom of Israel (Northern 10 Tribes)',
    ancientRegion: 'Canaan / Levant',
    coords: { lat: 32.350, lng: 35.300 },
    zoom: 7,
    note: 'The Northern Ten Tribes ruled from Samaria; plagued by calf worship and Baal idolatry until exiled in 722 BC.',
    scriptureRef: '1 KINGS 12:20, 2 KINGS 1:1'
  },
  judah: {
    name: 'Kingdom of Judah (Southern Kingdom)',
    ancientRegion: 'Judea / Levant',
    coords: { lat: 31.650, lng: 35.150 },
    zoom: 7,
    note: 'The Southern Kingdom ruled by the Davidic royal line from Jerusalem; outlasted Israel until the Babylonian exile in 586 BC.',
    scriptureRef: '1 KINGS 12:21, 2 KINGS 18–25'
  },
  jerusalem: {
    name: 'Jerusalem (Mount Zion)',
    ancientRegion: 'Kingdom of Judah',
    coords: { lat: 31.778, lng: 35.234 },
    zoom: 10,
    note: "The Holy City, site of Solomon's Temple, David's royal palace, and the prophetic ministries of Isaiah and Jeremiah.",
    scriptureRef: '2 SAMUEL 5:7, 2 KINGS 19:34'
  },
  carmel: {
    name: 'Mount Carmel',
    ancientRegion: 'Northern Israel',
    coords: { lat: 32.730, lng: 35.050 },
    zoom: 9,
    note: "Promontory overlooking the Mediterranean Sea; site of Elijah's contest with 450 prophets of Baal (1 Kings 18) and his retreat.",
    scriptureRef: '1 KINGS 18:19, 2 KINGS 1:9, 2:25'
  },
  gilead: {
    name: 'Gilead',
    ancientRegion: 'Transjordan',
    coords: { lat: 32.300, lng: 35.800 },
    zoom: 8,
    note: 'Fertile mountainous region east of the Jordan assigned to Gad, Reuben, and Manasseh; home of Elijah.',
    scriptureRef: '1 KINGS 17:1, NUMBERS 32:1'
  },
  bethel: {
    name: 'Bethel (Luz)',
    ancientRegion: 'Ephraim / Benjamin',
    coords: { lat: 31.930, lng: 35.220 },
    zoom: 9,
    note: "Sacred patriarchal sanctuary where Jacob had his vision of the ladder; later corrupted by Jeroboam's golden calf shrine.",
    scriptureRef: 'GENESIS 28:19, 2 KINGS 2:2'
  },
  jericho: {
    name: 'Jericho (City of Palm Trees)',
    ancientRegion: 'Jordan Valley',
    coords: { lat: 31.870, lng: 35.450 },
    zoom: 9,
    note: "Ancient city near the Jordan; site of Joshua's conquest, the school of the prophets, and Elisha's healing of the waters.",
    scriptureRef: 'JOSHUA 6:1, 2 KINGS 2:4, 2:19'
  },
  damascus: {
    name: 'Damascus (Aram)',
    ancientRegion: 'Syria',
    coords: { lat: 33.513, lng: 36.292 },
    zoom: 8,
    note: 'Capital of the Aramean kingdom ruled by Ben-hadad and Hazael; frequent adversary and ally of Israel and Judah.',
    scriptureRef: '1 KINGS 20:1, 2 KINGS 8:7'
  },
  nineveh: {
    name: 'Nineveh',
    ancientRegion: 'Assyria',
    coords: { lat: 36.360, lng: 43.150 },
    zoom: 8,
    note: "Imperial capital of the Neo-Assyrian Empire on the Tigris; site of Sennacherib's palace and Jonah's preaching.",
    scriptureRef: 'JONAH 1:2, 2 KINGS 19:36'
  },
  babylon: {
    name: 'Babylon',
    ancientRegion: 'Mesopotamia',
    coords: { lat: 32.542, lng: 44.421 },
    zoom: 8,
    note: "Capital of Nebuchadnezzar's empire on the Euphrates; destroyed Solomon's Temple in 586 BC and exiled Judah.",
    scriptureRef: '2 KINGS 25:1, DANIEL 1:1'
  },
  egypt: {
    name: 'Egypt (Mizraim)',
    ancientRegion: 'Nile River Valley',
    coords: { lat: 30.000, lng: 31.250 },
    zoom: 6,
    note: 'Land of Goshen, the Nile, and the house of bondage delivered under Moses with 10 mighty plagues.',
    scriptureRef: 'EXODUS 1:1, 1 KINGS 11:40'
  },
  jordan: {
    name: 'Jordan River',
    ancientRegion: 'Rift Valley',
    coords: { lat: 32.000, lng: 35.560 },
    zoom: 8,
    note: 'The sacred river dividing the Promised Land; parted for Joshua, crossed by Elijah and Elisha, and healed Naaman the Syrian.',
    scriptureRef: 'JOSHUA 3:1, 2 KINGS 2:8, 5:10'
  },
  ethiopia: {
    name: 'Kingdom of Kush (Ethiopia / Upper Nile)',
    ancientRegion: 'Nubia / Upper Nile',
    coords: { lat: 16.940, lng: 33.750 },
    zoom: 6,
    note: 'Ancient Nilotic empire of Cush; realm of Pharaoh Tirhakah (2 Kings 19:9) and the royal treasurer of Queen Candace (Acts 8:27).',
    scriptureRef: '2 KINGS 19:9, ISAIAH 37:9, ACTS 8:27'
  },
  cush: {
    name: 'Land of Cush (Kush / Ethiopia)',
    ancientRegion: 'Nubia / Upper Nile',
    coords: { lat: 16.940, lng: 33.750 },
    zoom: 6,
    note: 'Southern land founded by Cush son of Ham (Genesis 10:6); formidable archers and allies/enemies throughout biblical history.',
    scriptureRef: 'GENESIS 10:6, PSALMS 68:31, ISAIAH 18:1'
  },
  sinim: {
    name: 'Land of Sinim (Ancient China)',
    ancientRegion: 'East Asia',
    coords: { lat: 34.260, lng: 108.940 },
    zoom: 5,
    note: 'Isaiah 49:12 — "Behold, these shall come from far: and, lo, these from the north and from the west; and these from the land of Sinim." Terminus of the Silk Road.',
    scriptureRef: 'ISAIAH 49:12'
  },
  china: {
    name: 'Ancient China (Land of Sinim)',
    ancientRegion: 'East Asia',
    coords: { lat: 34.260, lng: 108.940 },
    zoom: 5,
    note: 'Vast East Asian civilization known in biblical prophecy as Sinim; center of classical silk culture connected to the Mediterranean.',
    scriptureRef: 'ISAIAH 49:12'
  },
  sheba: {
    name: 'Kingdom of Sheba (Saba)',
    ancientRegion: 'Southern Arabia (Yemen)',
    coords: { lat: 15.420, lng: 45.340 },
    zoom: 6,
    note: 'Ancient trading kingdom wealthy in gold and frankincense; Queen of Sheba visited Solomon to prove his wisdom (1 Kings 10:1–13).',
    scriptureRef: '1 KINGS 10:1, 2 CHRONICLES 9:1, MATTHEW 12:42'
  },
  scythia: {
    name: 'Scythia (Northern Steppes / Russia)',
    ancientRegion: 'Eurasian Steppes',
    coords: { lat: 44.940, lng: 34.120 },
    zoom: 6,
    note: 'Nomadic warrior confederacy of the far north; linked in Ezekiel 38–39 with Gog, Magog, Meshech, and Tubal; mentioned in Colossians 3:11.',
    scriptureRef: 'EZEKIEL 38:2, COLOSSIANS 3:11'
  },
  india: {
    name: 'India (Hoddu)',
    ancientRegion: 'Indus & Ganges Basins',
    coords: { lat: 25.610, lng: 85.140 },
    zoom: 5,
    note: 'Esther 1:1, 8:9 — The eastern boundary of the Persian Empire stretching "from India even unto Ethiopia, an hundred twenty and seven provinces."',
    scriptureRef: 'ESTHER 1:1, 8:9'
  },
  petra: {
    name: 'Petra (Sela / Nabataea)',
    ancientRegion: 'Edom / Arabia Petraea',
    coords: { lat: 30.328, lng: 35.444 },
    zoom: 8,
    note: 'Sandstone canyon fortress city and capital of the Nabataeans; King Aretas IV attempted to arrest Paul at Damascus (2 Cor 11:32).',
    scriptureRef: '2 KINGS 14:7, ISAIAH 16:1, 2 CORINTHIANS 11:32'
  }
};

