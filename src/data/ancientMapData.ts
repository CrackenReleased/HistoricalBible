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

export interface WorldEmpireRegion {
  id: string;
  name: string;
  color: string;
  fillColor: string;
  dateRange: string;
  capital: { name: string; coords: GeoCoordinate };
  approximateBounds: GeoCoordinate[]; // Boundary polygon for territory representation
  biblicalIntersection: string;
}

export interface MapRegionPreset {
  id: string;
  name: string;
  center: GeoCoordinate;
  zoom: number; // 1 = default full view
  description: string;
}

// Map Projection Bounds (Covering Ancient Near East from Rome to Persepolis)
export const MAP_BOUNDS = {
  minLng: 10.0, // Italy / Rome
  maxLng: 54.0, // Persian Gulf / Persepolis
  minLat: 24.5, // Upper Egypt / Thebes
  maxLat: 44.0, // Black Sea / Northern Balkans
};

// Preset Cameras for Quick Navigation
export const REGION_PRESETS: MapRegionPreset[] = [
  {
    id: 'all',
    name: 'All Biblical World',
    center: { lat: 33.5, lng: 35.5 },
    zoom: 1.0,
    description: 'The complete Ancient Near East from Rome to Persepolis'
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

// 12 Major Biblical Archaeological Synchronies with Physical Coordinates
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
    scriptureRef: '2 KINGS {3:4}–{3:27}',
    scriptureOsis: '2Kgs.3.4',
    description: 'A black basalt stele erected by King Mesha of Moab. The inscription records his rebellion against Israel and mentions "Omri, king of Israel", the "House of David", and the sacred divine name YHWH.',
    significance: 'Independently confirms the events of 2 Kings 3, attests the God of Israel (YHWH) by name, and provides a second 9th-century BC mention of the "House of David".',
    externalUrl: 'https://collections.louvre.fr/en/ark:/53355/cl010120567'
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

// World Empires Territories & Centers
export const WORLD_EMPIRES_GEO: WorldEmpireRegion[] = [
  {
    id: 'egypt',
    name: 'Ancient Egyptian Empire',
    color: '#c99738',
    fillColor: 'rgba(201, 151, 56, 0.12)',
    dateRange: 'c. 2100 – 609 BC',
    capital: { name: 'Thebes & Memphis', coords: { lat: 25.718, lng: 32.657 } },
    approximateBounds: [
      { lat: 24.5, lng: 32.0 }, { lat: 27.0, lng: 31.0 }, { lat: 30.0, lng: 30.5 },
      { lat: 31.5, lng: 30.0 }, { lat: 31.5, lng: 32.5 }, { lat: 31.0, lng: 34.5 },
      { lat: 28.0, lng: 34.5 }, { lat: 24.5, lng: 33.5 }, { lat: 24.5, lng: 32.0 }
    ],
    biblicalIntersection: 'Shelter for Abraham and Jacob; slavery and 10 plagues of Exodus; invaded Judah under Rehoboam.'
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
      { lat: 32.5, lng: 44.5 }, { lat: 31.5, lng: 35.0 }, { lat: 35.0, lng: 35.5 },
      { lat: 37.5, lng: 37.5 }, { lat: 38.5, lng: 40.0 }
    ],
    biblicalIntersection: 'Exiled the Northern Kingdom (722 BC); invaded Judah and besieged Hezekiah in Jerusalem (701 BC).'
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
      { lat: 30.0, lng: 48.0 }, { lat: 30.5, lng: 45.0 }, { lat: 31.5, lng: 35.0 },
      { lat: 34.5, lng: 36.0 }, { lat: 36.0, lng: 38.0 }
    ],
    biblicalIntersection: 'Destroyed Solomon\'s Temple in 586 BC; 70-year captivity in Babylon; vindication of Daniel.'
  },
  {
    id: 'persia',
    name: 'Achaemenid Medo-Persian Empire',
    color: '#3d8b7d',
    fillColor: 'rgba(61, 139, 125, 0.15)',
    dateRange: '539 – 331 BC',
    capital: { name: 'Susa & Persepolis', coords: { lat: 32.190, lng: 48.257 } },
    approximateBounds: [
      { lat: 41.0, lng: 28.0 }, { lat: 40.0, lng: 52.0 }, { lat: 28.0, lng: 53.0 },
      { lat: 28.0, lng: 48.0 }, { lat: 30.0, lng: 32.0 }, { lat: 34.0, lng: 34.0 },
      { lat: 38.0, lng: 27.0 }, { lat: 41.0, lng: 28.0 }
    ],
    biblicalIntersection: 'Decree of Cyrus permitting the Jewish return (539 BC); Nehemiah and Esther in Persian courts.'
  },
  {
    id: 'rome',
    name: 'Roman Empire',
    color: '#b55938',
    fillColor: 'rgba(181, 89, 56, 0.15)',
    dateRange: '63 BC – AD 100+',
    capital: { name: 'Rome', coords: { lat: 41.902, lng: 12.496 } },
    approximateBounds: [
      { lat: 44.0, lng: 11.0 }, { lat: 42.0, lng: 25.0 }, { lat: 38.0, lng: 37.0 },
      { lat: 32.0, lng: 36.0 }, { lat: 31.0, lng: 30.0 }, { lat: 32.0, lng: 13.0 },
      { lat: 38.0, lng: 11.0 }, { lat: 44.0, lng: 11.0 }
    ],
    biblicalIntersection: 'The fullness of time: census of Augustus, crucifixion under Pilate, proclamation across Roman roads.'
  }
];
