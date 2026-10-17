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

export type RouteEvidenceClass = 'SCRIPTURE_TEXT' | 'EXTERNAL_HISTORICAL_ATTESTATION';

export interface BiblicalRouteStop {
  name: string;
  coords: GeoCoordinate;
  dateLabel: string;
  scriptureRef: string;
  scriptureOsis: string;
  note: string;
  evidenceClass?: RouteEvidenceClass;
  attestationSource?: string;
}

export interface BiblicalRoute {
  id: string;
  name: string;
  shortBanner: string;
  travelerName: string;
  dateRange: string;
  figureId: string;
  color: string;
  scriptureRef: string;
  scriptureOsis: string;
  summary: string;
  evidenceClass?: RouteEvidenceClass;
  attestationSource?: string;
  path?: GeoCoordinate[];
  stops: BiblicalRouteStop[];
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
// Note: Seas & Lakes (Mediterranean, Red Sea, Sea of Galilee, Dead Sea) are rendered directly by the
// Esri World Dark Gray Base map's sub-meter raster GIS tiles. We deliberately omit crude vector polygons
// Physical Water Bodies & Rivers (Geodetic Polylines and Shoreline Polygons)
export const WATER_FEATURES: {
  seas: Array<{ name: string; polygon: GeoCoordinate[]; biblicalLabel?: string }>;
  rivers: Array<{ name: string; path: GeoCoordinate[]; scriptureAnchor?: string }>;
} = {
  seas: [
    {
      name: 'Sea of Galilee (Sea of Chinnereth / Lake of Gennesaret)',
      biblicalLabel: 'NUMBERS {34:11}, MATTHEW {4:18}, JOHN {6:1}',
      polygon: [
        { lat: 32.82697, lng: 35.51622 },
        { lat: 32.82064, lng: 35.51817 },
        { lat: 32.81784, lng: 35.5202 },
        { lat: 32.81342, lng: 35.5222 },
        { lat: 32.81197, lng: 35.52351 },
        { lat: 32.81062, lng: 35.52596 },
        { lat: 32.80553, lng: 35.52877 },
        { lat: 32.8041, lng: 35.5318 },
        { lat: 32.80214, lng: 35.53406 },
        { lat: 32.80127, lng: 35.53659 },
        { lat: 32.79817, lng: 35.53969 },
        { lat: 32.79765, lng: 35.53941 },
        { lat: 32.79725, lng: 35.53975 },
        { lat: 32.79715, lng: 35.54062 },
        { lat: 32.79642, lng: 35.54109 },
        { lat: 32.7943, lng: 35.54155 },
        { lat: 32.79371, lng: 35.54263 },
        { lat: 32.79166, lng: 35.54309 },
        { lat: 32.79128, lng: 35.54272 },
        { lat: 32.79067, lng: 35.54332 },
        { lat: 32.79063, lng: 35.54282 },
        { lat: 32.78983, lng: 35.54335 },
        { lat: 32.7896, lng: 35.54298 },
        { lat: 32.78785, lng: 35.54329 },
        { lat: 32.78668, lng: 35.54359 },
        { lat: 32.78674, lng: 35.54399 },
        { lat: 32.78743, lng: 35.54368 },
        { lat: 32.78746, lng: 35.54399 },
        { lat: 32.78633, lng: 35.54423 },
        { lat: 32.78616, lng: 35.54367 },
        { lat: 32.78266, lng: 35.54458 },
        { lat: 32.78172, lng: 35.54439 },
        { lat: 32.78138, lng: 35.54479 },
        { lat: 32.78242, lng: 35.5448 },
        { lat: 32.78076, lng: 35.54505 },
        { lat: 32.78047, lng: 35.54559 },
        { lat: 32.77861, lng: 35.5461 },
        { lat: 32.77719, lng: 35.54566 },
        { lat: 32.77331, lng: 35.54738 },
        { lat: 32.77004, lng: 35.54804 },
        { lat: 32.76921, lng: 35.5486 },
        { lat: 32.76852, lng: 35.55074 },
        { lat: 32.76687, lng: 35.55165 },
        { lat: 32.76544, lng: 35.55445 },
        { lat: 32.75836, lng: 35.56123 },
        { lat: 32.75535, lng: 35.56284 },
        { lat: 32.75066, lng: 35.56422 },
        { lat: 32.74825, lng: 35.56681 },
        { lat: 32.74374, lng: 35.56814 },
        { lat: 32.73944, lng: 35.56865 },
        { lat: 32.73643, lng: 35.56961 },
        { lat: 32.73572, lng: 35.56939 },
        { lat: 32.73415, lng: 35.57021 },
        { lat: 32.73319, lng: 35.57014 },
        { lat: 32.73277, lng: 35.56947 },
        { lat: 32.72859, lng: 35.56994 },
        { lat: 32.72729, lng: 35.57069 },
        { lat: 32.72515, lng: 35.56854 },
        { lat: 32.72388, lng: 35.56868 },
        { lat: 32.72328, lng: 35.56931 },
        { lat: 32.72197, lng: 35.56945 },
        { lat: 32.72188, lng: 35.57004 },
        { lat: 32.72154, lng: 35.56971 },
        { lat: 32.72105, lng: 35.56998 },
        { lat: 32.72024, lng: 35.57151 },
        { lat: 32.71798, lng: 35.57273 },
        { lat: 32.71798, lng: 35.57312 },
        { lat: 32.71771, lng: 35.57288 },
        { lat: 32.71477, lng: 35.57456 },
        { lat: 32.7138, lng: 35.57568 },
        { lat: 32.71385, lng: 35.57626 },
        { lat: 32.7137, lng: 35.57577 },
        { lat: 32.71148, lng: 35.57742 },
        { lat: 32.71095, lng: 35.57735 },
        { lat: 32.71044, lng: 35.57847 },
        { lat: 32.70974, lng: 35.57772 },
        { lat: 32.70718, lng: 35.58081 },
        { lat: 32.70588, lng: 35.58426 },
        { lat: 32.70675, lng: 35.58536 },
        { lat: 32.70662, lng: 35.58575 },
        { lat: 32.70626, lng: 35.58523 },
        { lat: 32.70596, lng: 35.58563 },
        { lat: 32.7062, lng: 35.58711 },
        { lat: 32.70551, lng: 35.58839 },
        { lat: 32.70608, lng: 35.58964 },
        { lat: 32.70609, lng: 35.59355 },
        { lat: 32.70641, lng: 35.59459 },
        { lat: 32.707, lng: 35.59477 },
        { lat: 32.70697, lng: 35.59553 },
        { lat: 32.70786, lng: 35.5961 },
        { lat: 32.70743, lng: 35.59663 },
        { lat: 32.70806, lng: 35.59968 },
        { lat: 32.71089, lng: 35.60513 },
        { lat: 32.71614, lng: 35.61206 },
        { lat: 32.72044, lng: 35.61626 },
        { lat: 32.72238, lng: 35.61683 },
        { lat: 32.73623, lng: 35.62846 },
        { lat: 32.74469, lng: 35.63394 },
        { lat: 32.74696, lng: 35.63365 },
        { lat: 32.75118, lng: 35.6356 },
        { lat: 32.7531, lng: 35.63602 },
        { lat: 32.75451, lng: 35.63541 },
        { lat: 32.75671, lng: 35.63643 },
        { lat: 32.76109, lng: 35.63692 },
        { lat: 32.76553, lng: 35.63878 },
        { lat: 32.76583, lng: 35.63839 },
        { lat: 32.76931, lng: 35.63833 },
        { lat: 32.77318, lng: 35.64031 },
        { lat: 32.7766, lng: 35.63881 },
        { lat: 32.77966, lng: 35.63672 },
        { lat: 32.78213, lng: 35.6368 },
        { lat: 32.78329, lng: 35.63593 },
        { lat: 32.78355, lng: 35.63629 },
        { lat: 32.78378, lng: 35.63566 },
        { lat: 32.78439, lng: 35.63578 },
        { lat: 32.78417, lng: 35.63633 },
        { lat: 32.78496, lng: 35.63653 },
        { lat: 32.7855, lng: 35.63621 },
        { lat: 32.78536, lng: 35.6356 },
        { lat: 32.78808, lng: 35.63749 },
        { lat: 32.78932, lng: 35.63928 },
        { lat: 32.79254, lng: 35.64074 },
        { lat: 32.79415, lng: 35.64105 },
        { lat: 32.7964, lng: 35.63994 },
        { lat: 32.79815, lng: 35.63981 },
        { lat: 32.80231, lng: 35.6417 },
        { lat: 32.80867, lng: 35.64301 },
        { lat: 32.81054, lng: 35.64428 },
        { lat: 32.81643, lng: 35.64534 },
        { lat: 32.82181, lng: 35.64539 },
        { lat: 32.82551, lng: 35.64473 },
        { lat: 32.82989, lng: 35.6426 },
        { lat: 32.83335, lng: 35.64193 },
        { lat: 32.8339, lng: 35.64232 },
        { lat: 32.83408, lng: 35.64138 },
        { lat: 32.83447, lng: 35.6422 },
        { lat: 32.83423, lng: 35.64353 },
        { lat: 32.83528, lng: 35.64478 },
        { lat: 32.83654, lng: 35.64541 },
        { lat: 32.83724, lng: 35.64718 },
        { lat: 32.8395, lng: 35.64922 },
        { lat: 32.84164, lng: 35.64976 },
        { lat: 32.84451, lng: 35.64977 },
        { lat: 32.84821, lng: 35.64909 },
        { lat: 32.85374, lng: 35.64738 },
        { lat: 32.85887, lng: 35.64485 },
        { lat: 32.85887, lng: 35.64288 },
        { lat: 32.85952, lng: 35.64432 },
        { lat: 32.86012, lng: 35.64381 },
        { lat: 32.85999, lng: 35.64336 },
        { lat: 32.86083, lng: 35.64335 },
        { lat: 32.8603, lng: 35.64185 },
        { lat: 32.86118, lng: 35.64291 },
        { lat: 32.86206, lng: 35.64274 },
        { lat: 32.86372, lng: 35.64372 },
        { lat: 32.86528, lng: 35.64315 },
        { lat: 32.87652, lng: 35.63514 },
        { lat: 32.88178, lng: 35.62997 },
        { lat: 32.88308, lng: 35.62966 },
        { lat: 32.88462, lng: 35.62701 },
        { lat: 32.88564, lng: 35.62727 },
        { lat: 32.88908, lng: 35.62403 },
        { lat: 32.88974, lng: 35.62257 },
        { lat: 32.88897, lng: 35.62154 },
        { lat: 32.89096, lng: 35.62171 },
        { lat: 32.89239, lng: 35.61982 },
        { lat: 32.89257, lng: 35.61872 },
        { lat: 32.89362, lng: 35.61795 },
        { lat: 32.89487, lng: 35.61499 },
        { lat: 32.8953, lng: 35.61314 },
        { lat: 32.89505, lng: 35.61177 },
        { lat: 32.89581, lng: 35.61085 },
        { lat: 32.89636, lng: 35.60688 },
        { lat: 32.89516, lng: 35.60403 },
        { lat: 32.89199, lng: 35.60029 },
        { lat: 32.89082, lng: 35.59653 },
        { lat: 32.89122, lng: 35.5955 },
        { lat: 32.89065, lng: 35.59509 },
        { lat: 32.89113, lng: 35.59443 },
        { lat: 32.89092, lng: 35.59396 },
        { lat: 32.89034, lng: 35.59397 },
        { lat: 32.89087, lng: 35.59334 },
        { lat: 32.89072, lng: 35.59239 },
        { lat: 32.88955, lng: 35.59124 },
        { lat: 32.88864, lng: 35.59219 },
        { lat: 32.88812, lng: 35.59163 },
        { lat: 32.88731, lng: 35.58828 },
        { lat: 32.88514, lng: 35.58367 },
        { lat: 32.88354, lng: 35.58243 },
        { lat: 32.88282, lng: 35.5803 },
        { lat: 32.88106, lng: 35.57852 },
        { lat: 32.88026, lng: 35.57686 },
        { lat: 32.87941, lng: 35.57289 },
        { lat: 32.87931, lng: 35.56735 },
        { lat: 32.87851, lng: 35.56632 },
        { lat: 32.87699, lng: 35.56568 },
        { lat: 32.87518, lng: 35.56404 },
        { lat: 32.87414, lng: 35.56109 },
        { lat: 32.8743, lng: 35.55997 },
        { lat: 32.87385, lng: 35.55957 },
        { lat: 32.87326, lng: 35.55978 },
        { lat: 32.8736, lng: 35.5587 },
        { lat: 32.87232, lng: 35.5539 },
        { lat: 32.87264, lng: 35.55245 },
        { lat: 32.87113, lng: 35.54916 },
        { lat: 32.87145, lng: 35.54712 },
        { lat: 32.87066, lng: 35.54464 },
        { lat: 32.86936, lng: 35.54389 },
        { lat: 32.86641, lng: 35.54004 },
        { lat: 32.86528, lng: 35.53925 },
        { lat: 32.86565, lng: 35.54046 },
        { lat: 32.86502, lng: 35.53945 },
        { lat: 32.86384, lng: 35.53899 },
        { lat: 32.86147, lng: 35.53569 },
        { lat: 32.85964, lng: 35.53478 },
        { lat: 32.85722, lng: 35.53465 },
        { lat: 32.85587, lng: 35.53298 },
        { lat: 32.85374, lng: 35.53324 },
        { lat: 32.85319, lng: 35.53277 },
        { lat: 32.85463, lng: 35.53155 },
        { lat: 32.85332, lng: 35.53216 },
        { lat: 32.85277, lng: 35.53076 },
        { lat: 32.85136, lng: 35.53021 },
        { lat: 32.85079, lng: 35.52861 },
        { lat: 32.84947, lng: 35.52766 },
        { lat: 32.84861, lng: 35.52807 },
        { lat: 32.84883, lng: 35.52736 },
        { lat: 32.84791, lng: 35.52753 },
        { lat: 32.84812, lng: 35.52847 },
        { lat: 32.84781, lng: 35.5275 },
        { lat: 32.84855, lng: 35.52712 },
        { lat: 32.84795, lng: 35.52617 },
        { lat: 32.84501, lng: 35.52472 },
        { lat: 32.84408, lng: 35.52554 },
        { lat: 32.84379, lng: 35.527 },
        { lat: 32.84397, lng: 35.52544 },
        { lat: 32.8434, lng: 35.5249 },
        { lat: 32.84259, lng: 35.52658 },
        { lat: 32.84316, lng: 35.5249 },
        { lat: 32.84229, lng: 35.52286 },
        { lat: 32.84129, lng: 35.52193 },
        { lat: 32.83378, lng: 35.5179 },
        { lat: 32.82896, lng: 35.51638 },
        { lat: 32.82697, lng: 35.51622 }
      ]
    },
    {
      name: 'Dead Sea (Salt Sea / Sea of the Plain)',
      biblicalLabel: 'GENESIS {14:3}, JOSHUA {3:16}, EZEKIEL {47:8}',
      polygon: [
        { lat: 31.43448, lng: 35.39141 },
        { lat: 31.43309, lng: 35.39379 },
        { lat: 31.43242, lng: 35.39287 },
        { lat: 31.42834, lng: 35.39484 },
        { lat: 31.42551, lng: 35.39921 },
        { lat: 31.42439, lng: 35.39617 },
        { lat: 31.42014, lng: 35.39559 },
        { lat: 31.41657, lng: 35.40017 },
        { lat: 31.41564, lng: 35.40513 },
        { lat: 31.41303, lng: 35.40214 },
        { lat: 31.40898, lng: 35.40856 },
        { lat: 31.40464, lng: 35.40316 },
        { lat: 31.40074, lng: 35.40125 },
        { lat: 31.39928, lng: 35.40672 },
        { lat: 31.39581, lng: 35.40554 },
        { lat: 31.39403, lng: 35.40725 },
        { lat: 31.39468, lng: 35.41247 },
        { lat: 31.39076, lng: 35.42127 },
        { lat: 31.38896, lng: 35.42228 },
        { lat: 31.38544, lng: 35.42239 },
        { lat: 31.38223, lng: 35.41634 },
        { lat: 31.37966, lng: 35.41445 },
        { lat: 31.3774, lng: 35.41548 },
        { lat: 31.37549, lng: 35.41302 },
        { lat: 31.37256, lng: 35.4169 },
        { lat: 31.36977, lng: 35.41676 },
        { lat: 31.36869, lng: 35.41405 },
        { lat: 31.36404, lng: 35.41582 },
        { lat: 31.35969, lng: 35.41285 },
        { lat: 31.35845, lng: 35.41555 },
        { lat: 31.3565, lng: 35.41586 },
        { lat: 31.35635, lng: 35.41888 },
        { lat: 31.35403, lng: 35.41733 },
        { lat: 31.35178, lng: 35.41832 },
        { lat: 31.34813, lng: 35.42388 },
        { lat: 31.34463, lng: 35.42107 },
        { lat: 31.34279, lng: 35.42312 },
        { lat: 31.34041, lng: 35.41831 },
        { lat: 31.33703, lng: 35.41996 },
        { lat: 31.33713, lng: 35.41553 },
        { lat: 31.33392, lng: 35.41701 },
        { lat: 31.33317, lng: 35.42109 },
        { lat: 31.33008, lng: 35.42483 },
        { lat: 31.33106, lng: 35.43 },
        { lat: 31.32392, lng: 35.43528 },
        { lat: 31.32049, lng: 35.43499 },
        { lat: 31.3205, lng: 35.43779 },
        { lat: 31.32441, lng: 35.4445 },
        { lat: 31.33133, lng: 35.44735 },
        { lat: 31.33502, lng: 35.45665 },
        { lat: 31.33404, lng: 35.45894 },
        { lat: 31.33662, lng: 35.4576 },
        { lat: 31.33939, lng: 35.46168 },
        { lat: 31.34503, lng: 35.46341 },
        { lat: 31.35807, lng: 35.46226 },
        { lat: 31.36249, lng: 35.46608 },
        { lat: 31.36426, lng: 35.47059 },
        { lat: 31.37108, lng: 35.47159 },
        { lat: 31.37121, lng: 35.47792 },
        { lat: 31.37321, lng: 35.48066 },
        { lat: 31.37664, lng: 35.48223 },
        { lat: 31.37953, lng: 35.48134 },
        { lat: 31.38363, lng: 35.48697 },
        { lat: 31.3927, lng: 35.49212 },
        { lat: 31.39436, lng: 35.49166 },
        { lat: 31.38845, lng: 35.49619 },
        { lat: 31.38784, lng: 35.50063 },
        { lat: 31.38212, lng: 35.50757 },
        { lat: 31.38221, lng: 35.51048 },
        { lat: 31.37797, lng: 35.51078 },
        { lat: 31.37757, lng: 35.5129 },
        { lat: 31.37541, lng: 35.51388 },
        { lat: 31.37437, lng: 35.51283 },
        { lat: 31.37171, lng: 35.51395 },
        { lat: 31.36663, lng: 35.52002 },
        { lat: 31.35618, lng: 35.51841 },
        { lat: 31.3549, lng: 35.51948 },
        { lat: 31.34809, lng: 35.51736 },
        { lat: 31.34555, lng: 35.51936 },
        { lat: 31.3399, lng: 35.51724 },
        { lat: 31.3316, lng: 35.51834 },
        { lat: 31.32886, lng: 35.52543 },
        { lat: 31.33882, lng: 35.53033 },
        { lat: 31.33975, lng: 35.53283 },
        { lat: 31.3421, lng: 35.5323 },
        { lat: 31.34235, lng: 35.53956 },
        { lat: 31.34435, lng: 35.54107 },
        { lat: 31.34855, lng: 35.54111 },
        { lat: 31.35664, lng: 35.5446 },
        { lat: 31.36243, lng: 35.54264 },
        { lat: 31.36324, lng: 35.54377 },
        { lat: 31.36604, lng: 35.54229 },
        { lat: 31.37262, lng: 35.54304 },
        { lat: 31.37472, lng: 35.54612 },
        { lat: 31.38002, lng: 35.54742 },
        { lat: 31.38048, lng: 35.54879 },
        { lat: 31.38534, lng: 35.54825 },
        { lat: 31.39075, lng: 35.54517 },
        { lat: 31.39568, lng: 35.54539 },
        { lat: 31.40465, lng: 35.55072 },
        { lat: 31.40767, lng: 35.55842 },
        { lat: 31.41243, lng: 35.56115 },
        { lat: 31.42055, lng: 35.5607 },
        { lat: 31.42622, lng: 35.56298 },
        { lat: 31.43265, lng: 35.56223 },
        { lat: 31.4354, lng: 35.56509 },
        { lat: 31.44134, lng: 35.56693 },
        { lat: 31.44657, lng: 35.56563 },
        { lat: 31.45162, lng: 35.56186 },
        { lat: 31.45261, lng: 35.56397 },
        { lat: 31.45614, lng: 35.56531 },
        { lat: 31.45937, lng: 35.57084 },
        { lat: 31.46436, lng: 35.56268 },
        { lat: 31.46705, lng: 35.5623 },
        { lat: 31.46989, lng: 35.56487 },
        { lat: 31.47149, lng: 35.57265 },
        { lat: 31.4734, lng: 35.57485 },
        { lat: 31.48557, lng: 35.57135 },
        { lat: 31.49229, lng: 35.56434 },
        { lat: 31.49805, lng: 35.56207 },
        { lat: 31.50241, lng: 35.55781 },
        { lat: 31.50881, lng: 35.55886 },
        { lat: 31.51727, lng: 35.55438 },
        { lat: 31.54288, lng: 35.5554 },
        { lat: 31.54419, lng: 35.55419 },
        { lat: 31.54871, lng: 35.55559 },
        { lat: 31.55082, lng: 35.55343 },
        { lat: 31.55861, lng: 35.55394 },
        { lat: 31.56274, lng: 35.55254 },
        { lat: 31.58403, lng: 35.5536 },
        { lat: 31.58932, lng: 35.55652 },
        { lat: 31.59672, lng: 35.55709 },
        { lat: 31.60228, lng: 35.56114 },
        { lat: 31.61053, lng: 35.56277 },
        { lat: 31.61382, lng: 35.56529 },
        { lat: 31.61986, lng: 35.56353 },
        { lat: 31.63055, lng: 35.57329 },
        { lat: 31.6336, lng: 35.57214 },
        { lat: 31.6393, lng: 35.57411 },
        { lat: 31.64162, lng: 35.57236 },
        { lat: 31.65411, lng: 35.57271 },
        { lat: 31.65708, lng: 35.57116 },
        { lat: 31.67297, lng: 35.57496 },
        { lat: 31.68108, lng: 35.57295 },
        { lat: 31.68949, lng: 35.57674 },
        { lat: 31.69017, lng: 35.57586 },
        { lat: 31.69067, lng: 35.5772 },
        { lat: 31.692, lng: 35.57631 },
        { lat: 31.69356, lng: 35.57803 },
        { lat: 31.69545, lng: 35.57689 },
        { lat: 31.70161, lng: 35.58119 },
        { lat: 31.71088, lng: 35.58092 },
        { lat: 31.71069, lng: 35.58254 },
        { lat: 31.7122, lng: 35.58295 },
        { lat: 31.71334, lng: 35.58108 },
        { lat: 31.71482, lng: 35.58346 },
        { lat: 31.71817, lng: 35.58277 },
        { lat: 31.72278, lng: 35.585 },
        { lat: 31.72435, lng: 35.58825 },
        { lat: 31.72791, lng: 35.5877 },
        { lat: 31.73916, lng: 35.5911 },
        { lat: 31.74415, lng: 35.59103 },
        { lat: 31.74869, lng: 35.58827 },
        { lat: 31.75107, lng: 35.58217 },
        { lat: 31.75686, lng: 35.58022 },
        { lat: 31.75848, lng: 35.57446 },
        { lat: 31.75739, lng: 35.56793 },
        { lat: 31.75912, lng: 35.56249 },
        { lat: 31.75577, lng: 35.5557 },
        { lat: 31.75768, lng: 35.55229 },
        { lat: 31.75826, lng: 35.53859 },
        { lat: 31.7611, lng: 35.52845 },
        { lat: 31.75901, lng: 35.52185 },
        { lat: 31.76178, lng: 35.51632 },
        { lat: 31.76367, lng: 35.50665 },
        { lat: 31.75606, lng: 35.5045 },
        { lat: 31.7543, lng: 35.50204 },
        { lat: 31.73967, lng: 35.49472 },
        { lat: 31.73121, lng: 35.48778 },
        { lat: 31.71702, lng: 35.48279 },
        { lat: 31.70586, lng: 35.47132 },
        { lat: 31.70381, lng: 35.46498 },
        { lat: 31.69969, lng: 35.46151 },
        { lat: 31.69955, lng: 35.45581 },
        { lat: 31.69634, lng: 35.45299 },
        { lat: 31.69292, lng: 35.45451 },
        { lat: 31.69009, lng: 35.45061 },
        { lat: 31.68608, lng: 35.45086 },
        { lat: 31.68284, lng: 35.44895 },
        { lat: 31.6821, lng: 35.4508 },
        { lat: 31.67908, lng: 35.4498 },
        { lat: 31.67787, lng: 35.45384 },
        { lat: 31.67608, lng: 35.44953 },
        { lat: 31.67004, lng: 35.45012 },
        { lat: 31.66941, lng: 35.45179 },
        { lat: 31.66873, lng: 35.45004 },
        { lat: 31.66657, lng: 35.45134 },
        { lat: 31.66511, lng: 35.44807 },
        { lat: 31.66401, lng: 35.44915 },
        { lat: 31.66266, lng: 35.44697 },
        { lat: 31.66043, lng: 35.44763 },
        { lat: 31.66043, lng: 35.44545 },
        { lat: 31.65387, lng: 35.44673 },
        { lat: 31.65395, lng: 35.44258 },
        { lat: 31.65277, lng: 35.44318 },
        { lat: 31.65159, lng: 35.44077 },
        { lat: 31.65035, lng: 35.4416 },
        { lat: 31.64821, lng: 35.43958 },
        { lat: 31.64674, lng: 35.44088 },
        { lat: 31.64596, lng: 35.43819 },
        { lat: 31.64411, lng: 35.44002 },
        { lat: 31.64232, lng: 35.43946 },
        { lat: 31.64227, lng: 35.4377 },
        { lat: 31.63973, lng: 35.43726 },
        { lat: 31.64004, lng: 35.43412 },
        { lat: 31.63726, lng: 35.4352 },
        { lat: 31.63721, lng: 35.43118 },
        { lat: 31.63398, lng: 35.4331 },
        { lat: 31.63219, lng: 35.43136 },
        { lat: 31.63108, lng: 35.43401 },
        { lat: 31.62766, lng: 35.43221 },
        { lat: 31.62498, lng: 35.43518 },
        { lat: 31.61833, lng: 35.4278 },
        { lat: 31.6186, lng: 35.42401 },
        { lat: 31.61574, lng: 35.42398 },
        { lat: 31.61548, lng: 35.42194 },
        { lat: 31.6108, lng: 35.41809 },
        { lat: 31.60849, lng: 35.41861 },
        { lat: 31.60587, lng: 35.42253 },
        { lat: 31.60303, lng: 35.41966 },
        { lat: 31.60284, lng: 35.41495 },
        { lat: 31.60057, lng: 35.41378 },
        { lat: 31.59847, lng: 35.41367 },
        { lat: 31.59627, lng: 35.41611 },
        { lat: 31.59473, lng: 35.4133 },
        { lat: 31.58975, lng: 35.41385 },
        { lat: 31.58505, lng: 35.41186 },
        { lat: 31.58277, lng: 35.41395 },
        { lat: 31.5667, lng: 35.41969 },
        { lat: 31.56011, lng: 35.41384 },
        { lat: 31.55678, lng: 35.41403 },
        { lat: 31.55555, lng: 35.41175 },
        { lat: 31.5532, lng: 35.41261 },
        { lat: 31.55429, lng: 35.40984 },
        { lat: 31.54945, lng: 35.40901 },
        { lat: 31.5509, lng: 35.40615 },
        { lat: 31.54911, lng: 35.40368 },
        { lat: 31.5462, lng: 35.40559 },
        { lat: 31.54456, lng: 35.40438 },
        { lat: 31.54145, lng: 35.40765 },
        { lat: 31.54087, lng: 35.4026 },
        { lat: 31.53817, lng: 35.40374 },
        { lat: 31.53671, lng: 35.4025 },
        { lat: 31.53589, lng: 35.40503 },
        { lat: 31.5338, lng: 35.40392 },
        { lat: 31.53304, lng: 35.40597 },
        { lat: 31.53028, lng: 35.40654 },
        { lat: 31.52897, lng: 35.40149 },
        { lat: 31.52767, lng: 35.40244 },
        { lat: 31.52729, lng: 35.40074 },
        { lat: 31.52432, lng: 35.40109 },
        { lat: 31.52338, lng: 35.40347 },
        { lat: 31.52129, lng: 35.40033 },
        { lat: 31.51881, lng: 35.40216 },
        { lat: 31.51445, lng: 35.39762 },
        { lat: 31.50611, lng: 35.40089 },
        { lat: 31.49782, lng: 35.39814 },
        { lat: 31.49469, lng: 35.40019 },
        { lat: 31.48695, lng: 35.39977 },
        { lat: 31.48354, lng: 35.40175 },
        { lat: 31.47435, lng: 35.39864 },
        { lat: 31.47098, lng: 35.40113 },
        { lat: 31.46415, lng: 35.39949 },
        { lat: 31.45927, lng: 35.40054 },
        { lat: 31.452, lng: 35.39835 },
        { lat: 31.45044, lng: 35.39916 },
        { lat: 31.4484, lng: 35.3968 },
        { lat: 31.44438, lng: 35.39871 },
        { lat: 31.44211, lng: 35.39678 },
        { lat: 31.43816, lng: 35.39725 },
        { lat: 31.43448, lng: 35.39141 }
      ]
    }
  ],
  rivers: [
    {
      name: 'Jordan River (Upper Course · Mount Hermon to Sea of Galilee)',
      scriptureAnchor: 'JOSHUA {3:17}, MATTHEW {3:13}',
      path: [
        { lat: 33.248, lng: 35.694 }, // Banias / Caesarea Philippi source
        { lat: 33.208, lng: 35.654 }, // Dan confluent
        { lat: 33.185, lng: 35.617 }, // Sde Nehemia (Hasbani / Dan / Banias union)
        { lat: 33.170, lng: 35.615 }, // Kfar Blum
        { lat: 33.120, lng: 35.615 }, // Hula Valley
        { lat: 33.070, lng: 35.605 }, // Hula basin
        { lat: 33.020, lng: 35.625 }, // Upper Jordan gorge
        { lat: 33.006, lng: 35.628 }, // Daughters of Jacob Bridge (Gesher Bnot Ya'akov)
        { lat: 32.990, lng: 35.628 }, // Ateret fortress
        { lat: 32.935, lng: 35.625 }, // Jordan River Park gorge outlet
        { lat: 32.915, lng: 35.622 }, // Arik Bridge
        { lat: 32.898, lng: 35.618 }, // Bethsaida valley
        { lat: 32.893, lng: 35.618 }  // Sea of Galilee northern inlet delta
      ]
    },
    {
      name: 'Jordan River (Lower Course · Sea of Galilee to Dead Sea)',
      scriptureAnchor: 'JOSHUA {3:17}, 2 KINGS {2:8}, MATTHEW {3:13}',
      path: [
        { lat: 32.705, lng: 35.588 }, // Degania Dam outlet
        { lat: 32.698, lng: 35.578 }, // Alumot Dam bend
        { lat: 32.645, lng: 35.560 }, // Yarmouk confluence
        { lat: 32.620, lng: 35.558 }, // Gesher ancient bridges
        { lat: 32.502, lng: 35.552 }, // Beth-shan ford
        { lat: 32.380, lng: 35.565 }, // Aenon near Salim
        { lat: 32.285, lng: 35.555 }, // Wadi Faria confluence
        { lat: 32.195, lng: 35.548 }, // Adam (Damia ford - Jordan blocked in Joshua 3)
        { lat: 32.150, lng: 35.545 }, // Jabbok confluence
        { lat: 32.120, lng: 35.535 },
        { lat: 32.020, lng: 35.540 }, // Phasaelis
        { lat: 31.930, lng: 35.525 },
        { lat: 31.838, lng: 35.548 }, // Bethabara / Qasr al-Yahud (Baptism of Jesus)
        { lat: 31.810, lng: 35.545 }, // Jericho crossing
        { lat: 31.782, lng: 35.545 }  // Dead Sea entry
      ]
    },
    {
      name: 'Nile River (Main Valley & Luxor to Apex)',
      scriptureAnchor: 'GENESIS {41:1}, EXODUS {7:20}',
      path: [
        { lat: 24.088, lng: 32.899 }, // First Cataract / Elephantine (Aswan)
        { lat: 24.450, lng: 32.930 }, // Kom Ombo
        { lat: 24.978, lng: 32.873 }, // Edfu
        { lat: 25.295, lng: 32.553 }, // Esna
        { lat: 25.720, lng: 32.650 }, // Thebes (Luxor / Karnak)
        { lat: 26.155, lng: 32.720 }, // Qena bend
        { lat: 26.185, lng: 31.915 }, // Abydos / Balyana
        { lat: 26.560, lng: 31.695 }, // Sohag
        { lat: 27.180, lng: 31.185 }, // Asyut
        { lat: 27.870, lng: 30.840 }, // Tell el-Amarna
        { lat: 28.110, lng: 30.750 }, // Minya
        { lat: 29.075, lng: 31.095 }, // Beni Suef
        { lat: 29.850, lng: 31.250 }, // Memphis / Saqqara
        { lat: 30.010, lng: 31.210 }, // Giza Pyramids
        { lat: 30.120, lng: 31.250 }  // Delta Apex (ancient Heliopolis / On)
      ]
    },
    {
      name: 'Nile Delta — Damietta Branch (East Delta)',
      scriptureAnchor: 'ISAIAH {19:5}–{19:7}',
      path: [
        { lat: 30.120, lng: 31.250 }, // Delta Apex
        { lat: 30.460, lng: 31.180 }, // Benha (Athribis)
        { lat: 30.785, lng: 31.380 }, // Zifta
        { lat: 31.040, lng: 31.380 }, // Mansoura
        { lat: 31.350, lng: 31.680 }, // Damietta
        { lat: 31.520, lng: 31.840 }  // Mediterranean outlet
      ]
    },
    {
      name: 'Nile Delta — Rosetta Branch (West Delta)',
      scriptureAnchor: 'ISAIAH {19:5}–{19:7}',
      path: [
        { lat: 30.120, lng: 31.250 }, // Delta Apex
        { lat: 30.400, lng: 30.880 }, // Menouf
        { lat: 30.820, lng: 30.650 }, // Sais (capital of 26th Dynasty)
        { lat: 31.120, lng: 30.520 }, // Fuwwah
        { lat: 31.400, lng: 30.420 }, // Rosetta (Rashid)
        { lat: 31.470, lng: 30.360 }  // Mediterranean outlet
      ]
    },
    {
      name: 'Pelusiac Branch / Wadi Tumilat (Goshen Waterway)',
      scriptureAnchor: 'EXODUS {1:11}, {12:37}',
      path: [
        { lat: 30.120, lng: 31.250 }, // Apex at Heliopolis/On
        { lat: 30.380, lng: 31.520 }, // Bubastis (Pi-beseth, Ezekiel 30:17)
        { lat: 30.550, lng: 31.800 }, // Rameses / Qantir / Goshen
        { lat: 30.700, lng: 32.100 }, // Succoth / Pithom canal
        { lat: 30.950, lng: 32.400 }, // Baal-zephon marshes
        { lat: 31.050, lng: 32.550 }  // Pelusium (Sin, stronghold of Egypt, Ezek 30:15)
      ]
    },
    {
      name: 'Euphrates River (Perath)',
      scriptureAnchor: 'GENESIS {2:14}, {15:18}, REVELATION {16:12}',
      path: [
        { lat: 38.850, lng: 39.520 }, // Armenian Taurus highlands (Murat / Karasu)
        { lat: 38.050, lng: 38.650 }, // Malatya gorge
        { lat: 37.035, lng: 37.980 }, // Zeugma / Birecik
        { lat: 36.830, lng: 38.010 }, // Carchemish (great battle in Jer 46:2)
        { lat: 35.980, lng: 38.820 }, // Emar / Lake Assad bend
        { lat: 35.950, lng: 39.050 }, // Raqqa (confluence with Balikh)
        { lat: 35.330, lng: 40.140 }, // Deir ez-Zor
        { lat: 34.750, lng: 40.730 }, // Dura-Europos
        { lat: 34.450, lng: 40.890 }, // Mari (Bronze Age royal archives)
        { lat: 34.420, lng: 41.570 }, // Ana
        { lat: 33.600, lng: 42.820 }, // Hit (bitumen springs used for Babel)
        { lat: 33.350, lng: 43.780 }, // Fallujah
        { lat: 32.542, lng: 44.421 }, // Babylon (hanging gardens & Nebuchadnezzar)
        { lat: 31.980, lng: 44.850 }, // Nippur marshlands
        { lat: 31.320, lng: 45.280 }, // Warka (Erech / Uruk of Genesis 10:10)
        { lat: 30.962, lng: 46.103 }, // Ur of the Chaldees (Abram's birthplace)
        { lat: 30.450, lng: 47.450 }, // Basra / Qurna confluence
        { lat: 29.980, lng: 48.550 }  // Persian Gulf mouth
      ]
    },
    {
      name: 'Tigris River (Hiddekel)',
      scriptureAnchor: 'GENESIS {2:14}, DANIEL {10:4}',
      path: [
        { lat: 38.480, lng: 39.420 }, // Lake Hazar source
        { lat: 37.910, lng: 40.240 }, // Amida (Diyarbakir)
        { lat: 37.330, lng: 42.180 }, // Cizre gorge
        { lat: 36.360, lng: 43.150 }, // Nineveh (Mosul — Jonah & Nahum)
        { lat: 36.098, lng: 43.330 }, // Calah / Nimrud (Genesis 10:11)
        { lat: 35.450, lng: 43.260 }, // Assur (ancient religious capital)
        { lat: 34.200, lng: 43.880 }, // Samarra
        { lat: 33.340, lng: 44.400 }, // Baghdad / Opis
        { lat: 33.090, lng: 44.580 }, // Ctesiphon & Seleucia
        { lat: 32.500, lng: 45.820 }, // Kut
        { lat: 31.840, lng: 47.140 }, // Amarah
        { lat: 30.980, lng: 47.450 }, // Joins Euphrates at Qurna
        { lat: 29.980, lng: 48.550 }  // Shatt al-Arab to Persian Gulf
      ]
    },
    {
      name: 'River Jabbok (Wadi Zarqa)',
      scriptureAnchor: 'GENESIS {32:22}, DEUTERONOMY {3:16}',
      path: [
        { lat: 31.950, lng: 35.930 }, // Rabbah of the Ammonites (Amman)
        { lat: 32.180, lng: 35.880 }, // Zarqa loop
        { lat: 32.220, lng: 35.750 }, // Mahanaim
        { lat: 32.192, lng: 35.702 }, // Peniel (Jacob wrestled with the Angel)
        { lat: 32.185, lng: 35.610 }, // Succoth
        { lat: 32.150, lng: 35.545 }  // Empties into Jordan River
      ]
    },
    {
      name: 'River Arnon (Wadi Mujib)',
      scriptureAnchor: 'NUMBERS {21:13}, {22:36}, DEUTERONOMY {2:24}',
      path: [
        { lat: 31.420, lng: 36.050 }, // Desert headwaters
        { lat: 31.460, lng: 35.850 }, // Aroer on the rim of the canyon
        { lat: 31.470, lng: 35.720 }, // Great Arnon chasm (border of Moab & Amorites)
        { lat: 31.468, lng: 35.570 }  // Empties into the Dead Sea
      ]
    },
    {
      name: 'Brook Zered (Wadi al-Hasa)',
      scriptureAnchor: 'DEUTERONOMY {2:13}–{2:14}',
      path: [
        { lat: 30.880, lng: 35.950 }, // Desert headwaters (King\'s Highway crossing)
        { lat: 30.930, lng: 35.820 }, // Deep sandstone gorge
        { lat: 30.980, lng: 35.650 }, // Border between Moab and Edom
        { lat: 31.020, lng: 35.480 }  // Empties into southern Dead Sea bay
      ]
    },
    {
      name: 'Brook Kishon (Nahal Kishon)',
      scriptureAnchor: 'JUDGES {4:7}, {5:21}, 1 KINGS {18:40}',
      path: [
        { lat: 32.520, lng: 35.320 }, // Foothills of Mount Gilboa & En-gannim
        { lat: 32.580, lng: 35.220 }, // Jezreel Valley (Megiddo plain)
        { lat: 32.680, lng: 35.120 }, // Base of Mount Carmel (Elijah slew prophets of Baal)
        { lat: 32.810, lng: 35.030 }  // Empties into Bay of Acre / Great Sea
      ]
    },
    {
      name: 'Brook Cherith (Wadi Qelt)',
      scriptureAnchor: '1 KINGS {17:3}–{17:5}',
      path: [
        { lat: 31.795, lng: 35.250 }, // Slopes east of Jerusalem / Anathoth
        { lat: 31.830, lng: 35.380 }, // Deep limestone canyon (ravens fed Elijah)
        { lat: 31.850, lng: 35.450 }, // St. George monastery cliffs
        { lat: 31.855, lng: 35.520 }  // Enters Jordan Valley near Jericho
      ]
    },
    {
      name: 'Brook of Egypt (Wadi El-Arish)',
      scriptureAnchor: 'NUMBERS {34:5}, 1 KINGS {8:65}, 2 CHRONICLES {7:8}',
      path: [
        { lat: 29.500, lng: 33.800 }, // Central Sinai plateau headwaters
        { lat: 30.150, lng: 34.050 }, // Nakhl crossroads
        { lat: 30.650, lng: 33.950 }, // Jebel Halal gorge
        { lat: 31.130, lng: 33.800 }  // Empties into Mediterranean at Rhinocolura (El-Arish)
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
  },
  {
    id: 'lachish-ostraca',
    name: 'Tel Lachish',
    ancientRegion: 'Kingdom of Judah (Shephelah)',
    modernCountry: 'Israel',
    coords: { lat: 31.565, lng: 34.849 },
    artifactName: 'The Lachish Letters (Ostraca)',
    artifactDate: '588 – 586 BC (Babylonian Siege)',
    discoveryYear: '1935',
    currentLocation: 'British Museum, London & Israel Museum, Jerusalem',
    figureId: 'jeremiah',
    empireId: 'babylon',
    scriptureRef: 'JEREMIAH {34:7}, 2 KINGS {18:14}',
    scriptureOsis: 'Jer.34.7',
    scriptureConnection: 'Direct Synchrony: Jeremiah 34:7 — Military dispatches watching for the fire-signals of Lachish and Azekah as Nebuchadnezzar closed in on Judah.',
    description: 'Pottery shards (ostraca) written in carbon ink in Paleo-Hebrew by a Judean officer named Hoshaiah during the final days before Babylon conquered Judah. Ostracon IV states: "We are watching for the fire-signals of Lachish... for we cannot see Azekah."',
    significance: 'Matches Jeremiah 34:7 ("when the king of Babylon\'s army fought against Jerusalem, and against all the cities of Judah that were left, against Lachish, and against Azekah: for these defenced cities remained of the cities of Judah") from the exact week of the siege.',
    externalUrl: 'https://www.britishmuseum.org/collection/object/W_1938-1010-2'
  },
  {
    id: 'jehoiachin-ration-tablets',
    name: 'Babylon (Royal Palace Archives)',
    ancientRegion: 'Neo-Babylonian Empire',
    modernCountry: 'Iraq',
    coords: { lat: 32.545, lng: 44.423 },
    artifactName: 'The Jehoiachin Ration Tablets',
    artifactDate: 'c. 592 BC (Reign of Nebuchadnezzar II)',
    discoveryYear: '1899',
    currentLocation: 'Vorderasiatisches Museum (Pergamon Museum), Berlin',
    figureId: 'jeremiah',
    empireId: 'babylon',
    scriptureRef: '2 KINGS {25:27}–{25:30}, JEREMIAH {52:31}–{52:34}',
    scriptureOsis: '2Kgs.25.27',
    scriptureConnection: 'Direct Synchrony: 2 Kings 25:29–30 — Babylonian palace cuneiform ledgers recording royal oil and barley rations issued to "Jehoiachin, king of the land of Judah" and his five sons.',
    description: 'Akkadian cuneiform administrative tablets excavated near the Ishtar Gate of Babylon listing rations of oil and grain distributed from Nebuchadnezzar\'s royal storehouse to "Ya\'ukin, king of the land of Yahudu [Judah]" and five royal princes.',
    significance: 'Provides administrative eyewitness proof from Babylon\'s own palace archives confirming the exile, survival, and royal stipends of King Jehoiachin described at the close of 2 Kings 25 and Jeremiah 52.',
    externalUrl: 'https://en.wikipedia.org/wiki/Jehoiachin%27s_Rations_Tablets'
  },
  {
    id: 'dead-sea-scrolls-qumran',
    name: 'Khirbet Qumran (Dead Sea Caves)',
    ancientRegion: 'Judean Desert',
    modernCountry: 'Israel',
    coords: { lat: 31.741, lng: 35.459 },
    artifactName: 'The Great Isaiah Scroll (1QIsaᵃ & Dead Sea Scrolls)',
    artifactDate: 'c. 250 BC – AD 68 (1QIsaᵃ dated c. 125 BC)',
    discoveryYear: '1947',
    currentLocation: 'Shrine of the Book, Israel Museum, Jerusalem',
    figureId: 'isaiah',
    empireId: 'rome',
    scriptureRef: 'ISAIAH {40:8}, {53:1}–{53:12}',
    scriptureOsis: 'Isa.40.8',
    scriptureConnection: 'Direct Synchrony: Isaiah 40:8 & 53:1–12 — Complete 24-foot Hebrew parchment scroll of all 66 chapters of Isaiah predating Christ\'s earthly ministry by over a century.',
    description: 'Seventeen sewn sheepskin parchment sheets (7.34 meters long) found in Cave 1 at Qumran preserving the entire book of Isaiah in Hebrew, alongside fragments of every Old Testament book except Esther.',
    significance: 'Shifted surviving Hebrew manuscript testimony back more than 1,000 years earlier than the medieval Masoretic codices, proving the extraordinary textual preservation of Messianic prophecies such as Isaiah 53.',
    externalUrl: 'https://dss.collections.imj.org.il/isaiah'
  },
  {
    id: 'pool-of-siloam-steps',
    name: 'Jerusalem (Southern Tip of City of David)',
    ancientRegion: 'Roman Judea',
    modernCountry: 'Israel',
    coords: { lat: 31.770, lng: 35.235 },
    artifactName: 'The Second Temple Pool of Siloam',
    artifactDate: '1st Century BC – AD 70',
    discoveryYear: '2004',
    currentLocation: 'City of David National Park, Jerusalem',
    figureId: 'jesus-christ',
    empireId: 'rome',
    scriptureRef: 'JOHN {9:7}, {9:11}',
    scriptureOsis: 'John.9.7',
    scriptureConnection: 'Direct Synchrony: John 9:7 — Monumental stepped stone immersion pool fed by the Gihon Spring where Jesus sent the man born blind to wash and receive sight.',
    description: 'A monumental 225-foot-wide trapezoidal stepped limestone pool discovered during infrastructure work in 2004, featuring three tiers of cut stone steps descending into the waters fed by Hezekiah\'s Tunnel.',
    significance: 'Confirms the exact Second Temple topography described in the Gospel of John prior to the Roman destruction of Jerusalem in AD 70.',
    externalUrl: 'https://en.wikipedia.org/wiki/Pool_of_Siloam'
  },
  {
    id: 'sergius-paulus-inscription',
    name: 'Pisidian Antioch & Soli (Cyprus)',
    ancientRegion: 'Cyprus & Galatia / Roman Empire',
    modernCountry: 'Turkey / Cyprus',
    coords: { lat: 38.304, lng: 31.189 },
    artifactName: 'The Sergius Paulus Inscriptions',
    artifactDate: 'Mid-1st Century AD (Reign of Claudius)',
    discoveryYear: '1877',
    currentLocation: 'Yalvaç Museum, Turkey & Cyprus Museum, Nicosia',
    figureId: 'paul',
    empireId: 'rome',
    scriptureRef: 'ACTS {13:7}, {13:12}',
    scriptureOsis: 'Acts.13.7',
    scriptureConnection: 'Direct Synchrony: Acts 13:7, 12 — Epigraphic attestations of the Roman senatorial family of Lucius Sergius Paulus, Proconsul of Cyprus during Paul\'s first missionary journey.',
    description: 'Greek and Latin stone inscriptions from Cyprus (naming "Paulus the proconsul") and from the family estates at Pisidian Antioch naming Lucius Sergius Paullus the Younger and Sergia Paulla.',
    significance: 'Corroborates Luke\'s exact Roman provincial title ("deputy / anthupatos [proconsul] of the country, Sergius Paulus, a prudent man") in Acts 13:7 and explains why Paul immediately traveled from Cyprus to Pisidian Antioch (Acts 13:14).',
    externalUrl: 'https://en.wikipedia.org/wiki/Sergius_Paulus'
  },
  {
    id: 'arch-of-titus-spoils',
    name: 'Rome (Via Sacra, Forum Romanum)',
    ancientRegion: 'Italy / Roman Empire',
    modernCountry: 'Italy',
    coords: { lat: 41.891, lng: 12.489 },
    artifactName: 'The Arch of Titus (Jerusalem Temple Spoils Relief)',
    artifactDate: 'AD 81 (Commemorating Siege of AD 70)',
    discoveryYear: '81',
    currentLocation: 'Roman Forum, Rome, Italy',
    figureId: 'jesus-christ',
    empireId: 'rome',
    scriptureRef: 'LUKE {19:43}–{19:44}, {21:20}–{21:24}, MATTHEW {24:2}',
    scriptureOsis: 'Luke.21.20',
    scriptureConnection: 'Direct Synchrony: Luke 21:20–24 & Matthew 24:2 — Roman triumphal monument depicting soldiers carrying the golden Menorah, Table of Showbread, and silver trumpets from the destroyed Jerusalem Temple.',
    description: 'A Pentelic marble triumphal arch erected by Emperor Domitian on the Via Sacra in Rome commemorating Titus\'s AD 70 capture of Jerusalem. Its inner south panel relief vividly depicts the sacred vessels of Herod\'s Temple carried in Roman triumph.',
    significance: 'Monumental Roman testimony to the literal historical fulfillment of Jesus Christ\'s Olivet prophecy (Luke 19:43–44, 21:20–24) delivered forty years before the siege.',
    externalUrl: 'https://en.wikipedia.org/wiki/Arch_of_Titus'
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
    shortBanner: "⛺ ABRAHAM'S JOURNEY OF FAITH (c. 2091–1991 BC)",
    travelerName: 'Abraham (Abram)',
    figureId: 'abraham',
    color: '#f59e0b', // Warm Amber Gold
    dateRange: 'c. 2091 – 1991 BC',
    scriptureRef: 'GENESIS {11:31}–{12:9}, HEBREWS {11:8}',
    scriptureOsis: 'GEN.12.1',
    summary: 'God calls Abram out of Ur of the Chaldees, through Haran along the Fertile Crescent, and down into Shechem, Bethel, and Hebron in Canaan.',
    stops: [
      {
        name: 'Ur of the Chaldees',
        coords: { lat: 30.962, lng: 46.103 },
        dateLabel: 'Before c. 2091 BC',
        scriptureRef: 'GENESIS {11:31}, ACTS {7:2}',
        scriptureOsis: 'GEN.11.31',
        note: 'The God of glory appears to Abram in Mesopotamia and calls him to leave his homeland and kindred.'
      },
      {
        name: 'Babylon (Euphrates Corridor)',
        coords: { lat: 32.542, lng: 44.421 },
        dateLabel: 'c. 2095 BC (en route north)',
        scriptureRef: 'GENESIS {11:31}',
        scriptureOsis: 'GEN.11.31',
        note: 'Caravan transit northwest along the lower Euphrates valley with Terah, Sarai, and Lot.'
      },
      {
        name: 'Mari (Middle Euphrates)',
        coords: { lat: 34.400, lng: 40.900 },
        dateLabel: 'c. 2093 BC (Fertile Crescent transit)',
        scriptureRef: 'GENESIS {11:31}',
        scriptureOsis: 'GEN.11.31',
        note: 'Major Bronze Age trade hub along the upper Euphrates highway toward Padan-Aram.'
      },
      {
        name: 'Haran (Padan-Aram)',
        coords: { lat: 36.866, lng: 39.025 },
        dateLabel: 'c. 2091 BC (Abram age 75)',
        scriptureRef: 'GENESIS {12:1}–{12:4}',
        scriptureOsis: 'GEN.12.1',
        note: 'After Terah dies at age 205, Abram departs Haran at age 75 in obedience to the LORD\'s covenant promise.'
      },
      {
        name: 'Damascus',
        coords: { lat: 33.513, lng: 36.292 },
        dateLabel: 'c. 2091 BC (Entering the Levant)',
        scriptureRef: 'GENESIS {15:2}',
        scriptureOsis: 'GEN.15.2',
        note: 'Southern caravan gateway into Canaan; home of Eliezer of Damascus, steward of Abram\'s household.'
      },
      {
        name: 'Shechem (Oak of Moreh)',
        coords: { lat: 32.213, lng: 35.281 },
        dateLabel: 'c. 2091 BC (First stop in Canaan)',
        scriptureRef: 'GENESIS {12:6}–{12:7}',
        scriptureOsis: 'GEN.12.6',
        note: 'The LORD appears to Abram and promises, "Unto thy seed will I give this land." Abram builds his first altar in Canaan.'
      },
      {
        name: 'Bethel & Ai',
        coords: { lat: 31.928, lng: 35.239 },
        dateLabel: 'c. 2090 BC',
        scriptureRef: 'GENESIS {12:8}, {13:3}–{13:4}',
        scriptureOsis: 'GEN.12.8',
        note: 'Abram pitches his tent between Bethel on the west and Ai on the east, builds an altar, and calls upon the name of the LORD.'
      },
      {
        name: 'Hebron (Oaks of Mamre)',
        coords: { lat: 31.532, lng: 35.099 },
        dateLabel: 'c. 2085 – 1991 BC',
        scriptureRef: 'GENESIS {13:18}, {15:1}–{15:18}, {23:19}',
        scriptureOsis: 'GEN.13.18',
        note: 'Abraham\'s long-term residence where God cuts the Covenant of the Pieces and where Sarah and Abraham are buried at Machpelah.'
      }
    ]
  },
  {
    id: 'exodus-route',
    name: 'The Exodus & Wilderness Route',
    shortBanner: '🔥 THE EXODUS ROUTE (1446 BC)',
    travelerName: 'Moses & Israel',
    figureId: 'moses',
    color: '#06b6d4', // Radiant Cyan
    dateRange: 'Spring – Summer 1446 BC',
    scriptureRef: 'EXODUS {12:37}–{19:2}, NUMBERS {33:1}–{33:15}',
    scriptureOsis: 'EXO.12.37',
    summary: 'The LORD delivers Israel from bondage in Egypt on the night of Passover, parting the Red Sea and leading them to Mount Sinai.',
    stops: [
      {
        name: 'Rameses (Goshen)',
        coords: { lat: 30.800, lng: 31.840 },
        dateLabel: '15 Nisan, 1446 BC (Passover Night)',
        scriptureRef: 'EXODUS {12:37}, NUMBERS {33:3}',
        scriptureOsis: 'EXO.12.37',
        note: 'Israel departs Egypt with a high hand on the day after the Passover sacrifice after 430 years of sojourn.'
      },
      {
        name: 'Succoth',
        coords: { lat: 30.550, lng: 32.100 },
        dateLabel: 'Mid-Nisan, 1446 BC (Day 2)',
        scriptureRef: 'EXODUS {12:37}, {13:20}',
        scriptureOsis: 'EXO.12.37',
        note: 'First rallying encampment of the congregation of Israel, baking unleavened cakes from the dough brought out of Egypt.'
      },
      {
        name: 'Etham',
        coords: { lat: 30.400, lng: 32.300 },
        dateLabel: 'Nisan, 1446 BC (Week 1)',
        scriptureRef: 'EXODUS {13:20}–{13:22}',
        scriptureOsis: 'EXO.13.20',
        note: 'Encampment on the edge of the wilderness where the LORD goes before Israel in a pillar of cloud by day and fire by night.'
      },
      {
        name: 'Pi-hahiroth / Red Sea Crossing',
        coords: { lat: 29.850, lng: 32.550 },
        dateLabel: '21 Nisan, 1446 BC',
        scriptureRef: 'EXODUS {14:2}–{14:31}',
        scriptureOsis: 'EXO.14.21',
        note: 'Pharaoh\'s chariots pursue Israel; the LORD divides the sea so Israel walks through on dry ground and delivers them from Egypt.'
      },
      {
        name: 'Marah',
        coords: { lat: 29.300, lng: 32.900 },
        dateLabel: 'Late Nisan, 1446 BC (3 days after Red Sea)',
        scriptureRef: 'EXODUS {15:22}–{15:26}',
        scriptureOsis: 'EXO.15.23',
        note: 'Three days into the Wilderness of Shur, the LORD shows Moses a tree that turns the bitter waters sweet and reveals Himself as Jehovah-Rapha.'
      },
      {
        name: 'Elim',
        coords: { lat: 29.050, lng: 33.150 },
        dateLabel: 'Early Iyyar, 1446 BC (Month 2)',
        scriptureRef: 'EXODUS {15:27}, NUMBERS {33:9}',
        scriptureOsis: 'EXO.15.27',
        note: 'Oasis sanctuary with twelve wells of water and threescore and ten (70) palm trees where Israel encamps beside the waters.'
      },
      {
        name: 'Rephidim (Massah & Meribah)',
        coords: { lat: 28.700, lng: 33.600 },
        dateLabel: 'Late Iyyar, 1446 BC (Month 2)',
        scriptureRef: 'EXODUS {17:1}–{17:16}',
        scriptureOsis: 'EXO.17.1',
        note: 'Moses strikes the rock at Horeb to bring forth water; Joshua defeats Amalek while Aaron and Hur hold up Moses\' hands.'
      },
      {
        name: 'Mount Sinai (Horeb)',
        coords: { lat: 28.539, lng: 33.975 },
        dateLabel: 'Sivan, 1446 BC – Iyyar, 1445 BC (11 Months)',
        scriptureRef: 'EXODUS {19:1}–{20:21}, NUMBERS {10:11}',
        scriptureOsis: 'EXO.19.1',
        note: 'In the third month after leaving Egypt, Israel encamps before the mount; God speaks the Ten Commandments and gives the Tabernacle pattern.'
      }
    ]
  },
  {
    id: 'jacob-joseph-egypt',
    name: "Jacob's Sojourn & Joseph in Egypt",
    shortBanner: "🌾 JACOB & JOSEPH TO EGYPT (c. 1915–1876 BC)",
    travelerName: 'Patriarchs Jacob (Israel) & Joseph',
    figureId: 'abraham',
    color: '#fb923c',
    dateRange: 'c. 1915 – 1876 BC',
    scriptureRef: 'GENESIS {31:17}–{50:26}',
    scriptureOsis: 'GEN.37.28',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Jacob returns from Padan-Aram to wrestle with the Angel at Peniel, dwells at Hebron, and after Joseph is sold into Egypt and exalted as Vizier under Pharaoh, brings all 70 souls of Israel down to Goshen during the seven-year famine.',
    stops: [
      {
        name: 'Haran (Padan-Aram)',
        coords: { lat: 36.865, lng: 39.031 },
        dateLabel: 'c. 1929 BC',
        scriptureRef: 'GENESIS {31:17}–{31:21}',
        scriptureOsis: 'GEN.31.17',
        note: 'After 20 years serving Laban, Jacob departs Padan-Aram at God\'s command with Rachel, Leah, his children, and flocks.'
      },
      {
        name: 'Peniel / Jabbok River',
        coords: { lat: 32.192, lng: 35.702 },
        dateLabel: 'c. 1929 BC',
        scriptureRef: 'GENESIS {32:22}–{32:32}',
        scriptureOsis: 'GEN.32.24',
        note: 'Jacob wrestles with a Man until daybreak; his name is changed from Jacob to Israel ("Prince with God").'
      },
      {
        name: 'Dothan',
        coords: { lat: 32.414, lng: 35.239 },
        dateLabel: 'c. 1898 BC (Joseph Age 17)',
        scriptureRef: 'GENESIS {37:17}–{37:28}',
        scriptureOsis: 'GEN.37.17',
        note: 'Joseph is cast into a pit by his brothers at Dothan and sold for 20 pieces of silver to Ishmaelite/Midianite merchants bound for Egypt.'
      },
      {
        name: 'Hebron & Beersheba',
        coords: { lat: 31.245, lng: 34.841 },
        dateLabel: 'c. 1876 BC',
        scriptureRef: 'GENESIS {46:1}–{46:5}',
        scriptureOsis: 'GEN.46.1',
        note: 'Hearing that Joseph is alive and ruler over Egypt, Jacob offers sacrifices at Beersheba; God promises, "I will go down with thee into Egypt; and I will also surely bring thee up again."'
      },
      {
        name: 'Land of Goshen / Avaris (Eastern Nile Delta)',
        coords: { lat: 30.787, lng: 31.821 },
        dateLabel: 'c. 1876 – 1805 BC',
        scriptureRef: 'GENESIS {46:28}–{47:11}, {50:24}',
        scriptureOsis: 'GEN.46.28',
        note: 'Joseph meets his father Israel in Goshen and nourishes his family through the famine; before dying at age 110, Joseph makes Israel swear to carry up his bones in the Exodus.'
      }
    ]
  },
  {
    id: 'joshua-conquest',
    name: "Joshua's Jordan Crossing & Conquest of Canaan",
    shortBanner: "⚔️ JOSHUA'S CONQUEST OF CANAAN (1406–1399 BC)",
    travelerName: 'Joshua Son of Nun & Israel',
    figureId: 'moses',
    color: '#60a5fa',
    dateRange: 'c. 1406 – 1399 BC',
    scriptureRef: 'JOSHUA {1:1}–{11:23}',
    scriptureOsis: 'JOS.3.14',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'After Moses views the Promised Land from Mount Nebo, Joshua leads Israel across the parted Jordan River to Gilgal, conquers Jericho and Ai, defends Gibeon in the southern campaign, and defeats Hazor in the north.',
    path: [
      { lat: 31.767, lng: 35.725 }, // Plains of Moab & Mount Nebo
      { lat: 31.855, lng: 35.535 }, // Jordan River Crossing & Gilgal
      { lat: 31.871, lng: 35.444 }, // Jericho
      { lat: 32.213, lng: 35.281 }, // Ai & Mount Ebal / Shechem
      { lat: 31.846, lng: 35.184 }, // Gibeon & Valley of Ajalon
      { lat: 32.213, lng: 35.281 }, // Shechem pass northward
      { lat: 32.410, lng: 35.240 }, // Dothan Valley
      { lat: 32.502, lng: 35.500 }, // Beth-shan gap into Jordan trough
      { lat: 32.780, lng: 35.510 }, // Western Galilee foothills around Sea of Galilee
      { lat: 32.880, lng: 35.500 }, // Plain of Gennesaret western bypass
      { lat: 33.017, lng: 35.568 }, // Hazor (Upper Galilee)
      { lat: 32.880, lng: 35.500 }, // Return via western foothills
      { lat: 32.502, lng: 35.500 }, // Beth-shan
      { lat: 32.213, lng: 35.281 }, // Shechem
      { lat: 32.055, lng: 35.289 }  // Shiloh
    ],
    stops: [
      {
        name: 'Plains of Moab & Mount Nebo',
        coords: { lat: 31.767, lng: 35.725 },
        dateLabel: 'Adar, 1406 BC',
        scriptureRef: 'DEUTERONOMY {34:1}–{34:9}, JOSHUA {1:1}–{1:9}',
        scriptureOsis: 'DEU.34.1',
        note: 'Moses views all the land of Gilead, Naphtali, Ephraim, Judah, and Jericho from Pisgah before his death; God commissions Joshua to be strong and very courageous.'
      },
      {
        name: 'Jordan River Crossing & Gilgal',
        coords: { lat: 31.855, lng: 35.535 },
        dateLabel: '10 Nisan, 1406 BC',
        scriptureRef: 'JOSHUA {3:14}–{4:24}',
        scriptureOsis: 'JOS.3.14',
        note: 'As the priests bearing the Ark of the Covenant step into the Jordan, the waters heap up upstream at Adam; Israel crosses on dry ground and sets up 12 memorial stones at Gilgal.'
      },
      {
        name: 'Jericho',
        coords: { lat: 31.871, lng: 35.444 },
        dateLabel: 'Nisan, 1406 BC',
        scriptureRef: 'JOSHUA {6:1}–{6:27}',
        scriptureOsis: 'JOS.6.20',
        note: 'On the seventh day Israel compasses the city seven times; at the blast of the rams\' horns and shout of the people, the wall falls down flat and Rahab\'s household is spared.'
      },
      {
        name: 'Ai & Mount Ebal / Shechem',
        coords: { lat: 32.213, lng: 35.281 },
        dateLabel: '1406 BC',
        scriptureRef: 'JOSHUA {8:1}–{8:35}',
        scriptureOsis: 'JOS.8.30',
        note: 'After capturing Ai, Joshua builds an altar on Mount Ebal and reads all the words of the Law—the blessings and cursings—between Mount Gerizim and Mount Ebal.'
      },
      {
        name: 'Gibeon & Valley of Ajalon',
        coords: { lat: 31.846, lng: 35.184 },
        dateLabel: 'c. 1405 BC (Southern Campaign)',
        scriptureRef: 'JOSHUA {10:1}–{10:15}',
        scriptureOsis: 'JOS.10.12',
        note: 'Marching all night from Gilgal to rescue Gibeon against five Amorite kings, Joshua prays and the sun stands still upon Gibeon and the moon in the Valley of Ajalon.'
      },
      {
        name: 'Hazor (Upper Galilee)',
        coords: { lat: 33.017, lng: 35.568 },
        dateLabel: 'c. 1400 BC (Northern Campaign)',
        scriptureRef: 'JOSHUA {11:1}–{11:15}',
        scriptureOsis: 'JOS.11.10',
        note: 'Joshua defeats Jabin\'s northern coalition at the waters of Merom and burns Hazor, "the head of all those kingdoms."'
      },
      {
        name: 'Shiloh',
        coords: { lat: 32.055, lng: 35.289 },
        dateLabel: 'c. 1399 BC',
        scriptureRef: 'JOSHUA {18:1}–{18:10}',
        scriptureOsis: 'JOS.18.1',
        note: 'The whole congregation of Israel assembles at Shiloh and sets up the Tabernacle of the Congregation after the land is subdued before them.'
      }
    ]
  },
  {
    id: 'david-exile-throne',
    name: "David's Anointing, Wilderness Flight & Royal Throne",
    shortBanner: "👑 DAVID: BETHLEHEM TO ZION (c. 1025–1003 BC)",
    travelerName: 'King David',
    figureId: 'david',
    color: '#eab308',
    dateRange: 'c. 1025 – 1003 BC',
    scriptureRef: '1 SAMUEL {16:1}–2 SAMUEL {5:10}',
    scriptureOsis: '1SA.16.13',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Anointed by Samuel at Bethlehem, David defeats Goliath in the Valley of Elah, endures years as a fugitive from Saul in Adullam and En-gedi, reigns seven years in Hebron, and establishes Jerusalem (Mount Zion) as Israel\'s united capital.',
    path: [
      { lat: 31.705, lng: 35.204 }, // Bethlehem Ephratah
      { lat: 31.690, lng: 34.955 }, // Valley of Elah
      { lat: 31.649, lng: 34.996 }, // Cave of Adullam
      { lat: 31.615, lng: 35.005 }, // Keilah
      { lat: 31.480, lng: 35.130 }, // Wilderness of Ziph
      { lat: 31.420, lng: 35.160 }, // Maon / Carmel in Judah
      { lat: 31.465, lng: 35.388 }, // En-gedi cliffs
      { lat: 31.480, lng: 35.180 }, // Ascent of Ziz westward into Judean hills
      { lat: 31.524, lng: 35.108 }, // Hebron
      { lat: 31.768, lng: 35.213 }  // Jerusalem (City of David / Mount Zion)
    ],
    stops: [
      {
        name: 'Bethlehem Ephratah',
        coords: { lat: 31.705, lng: 35.204 },
        dateLabel: 'c. 1025 BC',
        scriptureRef: '1 SAMUEL {16:1}–{16:13}',
        scriptureOsis: '1SA.16.13',
        note: 'Samuel anoints young shepherd David in the midst of his brethren; the Spirit of the LORD comes upon David from that day forward.'
      },
      {
        name: 'Valley of Elah',
        coords: { lat: 31.690, lng: 34.955 },
        dateLabel: 'c. 1024 BC',
        scriptureRef: '1 SAMUEL {17:1}–{17:54}',
        scriptureOsis: '1SA.17.45',
        note: 'Coming in the name of the LORD of hosts, David slays Goliath of Gath with a sling and a smooth stone from the brook.'
      },
      {
        name: 'Cave of Adullam & En-gedi',
        coords: { lat: 31.465, lng: 35.388 },
        dateLabel: 'c. 1018 – 1011 BC',
        scriptureRef: '1 SAMUEL {22:1}–{22:2}, {24:1}–{24:22}',
        scriptureOsis: '1SA.24.1',
        note: 'Fleeing King Saul, David gathers 400 distressed men at Adullam and spares Saul\'s life in the wilderness strongholds of En-gedi, refusing to touch the LORD\'s anointed.'
      },
      {
        name: 'Hebron',
        coords: { lat: 31.524, lng: 35.108 },
        dateLabel: 'c. 1010 – 1003 BC (7.5 Years)',
        scriptureRef: '2 SAMUEL {2:1}–{2:4}, {5:1}–{5:5}',
        scriptureOsis: '2SA.2.4',
        note: 'After Saul\'s death on Mount Gilboa, David is anointed king over Judah at Hebron for seven years and six months before all the tribes of Israel anoint him king.'
      },
      {
        name: 'Jerusalem (City of David / Mount Zion)',
        coords: { lat: 31.768, lng: 35.213 },
        dateLabel: 'c. 1003 – 970 BC (33 Years)',
        scriptureRef: '2 SAMUEL {5:6}–{7:29}',
        scriptureOsis: '2SA.5.7',
        note: 'David captures the stronghold of Zion, brings up the Ark of the Covenant, and receives the Davidic Covenant promise of an everlasting throne (attested externally on the Tel Dan Stele: "House of David").'
      }
    ]
  },
  {
    id: 'elijah-elisha-ministry',
    name: "Elijah & Elisha's Prophetic Ministry",
    shortBanner: "🔥 ELIJAH & ELISHA PROPHETIC CIRCUIT (c. 865–841 BC)",
    travelerName: 'Prophets Elijah the Tishbite & Elisha',
    figureId: 'hezekiah',
    color: '#f97316',
    dateRange: 'c. 865 – 841 BC',
    scriptureRef: '1 KINGS {17:1}–2 KINGS {13:21}',
    scriptureOsis: '1KI.18.38',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'During the apostasy of Ahab, Jezebel, and Ahaziah, Elijah confronts Baal on Mount Carmel, hears the still small voice at Horeb, prophesies against Ahaziah (2 Kings 1), and ascends in a whirlwind across the Jordan as Elisha receives a double portion.',
    path: [
      { lat: 32.350, lng: 35.680 }, // Brook Cherith (East of Jordan / Gilead)
      { lat: 32.502, lng: 35.500 }, // Beth-shan ford into Jezreel Valley
      { lat: 32.600, lng: 35.250 }, // Jezreel plain
      { lat: 32.648, lng: 35.078 }, // Mount Carmel
      { lat: 32.850, lng: 35.080 }, // Plain of Acre
      { lat: 33.090, lng: 35.100 }, // Ladder of Tyre (coastal pass)
      { lat: 33.270, lng: 35.196 }, // Tyre
      { lat: 33.447, lng: 35.298 }, // Zarephath (Phoenicia)
      { lat: 33.090, lng: 35.100 }, // Return via Phoenician coast
      { lat: 32.648, lng: 35.078 }, // Mount Carmel
      { lat: 31.768, lng: 35.213 }, // South to Beersheba
      { lat: 31.245, lng: 34.790 }, // Beersheba
      { lat: 28.539, lng: 33.975 }, // Mount Horeb (Sinai)
      { lat: 31.245, lng: 34.790 }, // Return through Negev
      { lat: 32.277, lng: 35.190 }, // Samaria & Ekron
      { lat: 31.855, lng: 35.535 }  // Jericho & Jordan River (Ascension)
    ],
    stops: [
      {
        name: 'Brook Cherith (East of Jordan)',
        coords: { lat: 32.350, lng: 35.680 },
        dateLabel: 'c. 863 BC',
        scriptureRef: '1 KINGS {17:1}–{17:7}',
        scriptureOsis: '1KI.17.3',
        note: 'After announcing a three-and-a-half-year drought to King Ahab, Elijah hides by the Brook Cherith where ravens bring him bread and flesh morning and evening.'
      },
      {
        name: 'Zarephath (Phoenicia)',
        coords: { lat: 33.447, lng: 35.298 },
        dateLabel: 'c. 862 – 860 BC',
        scriptureRef: '1 KINGS {17:8}–{17:24}',
        scriptureOsis: '1KI.17.9',
        note: 'In the heartland of Sidonian Baal worship, the widow\'s barrel of meal and cruse of oil do not fail, and God raises her son from the dead through Elijah\'s prayer.'
      },
      {
        name: 'Mount Carmel',
        coords: { lat: 32.648, lng: 35.078 },
        dateLabel: 'c. 860 BC',
        scriptureRef: '1 KINGS {18:19}–{18:46}',
        scriptureOsis: '1KI.18.38',
        note: 'Before all Israel and 450 prophets of Baal, fire of the LORD falls from heaven to consume Elijah\'s water-drenched sacrifice, and the people cry, "The LORD, he is the God!"'
      },
      {
        name: 'Mount Horeb (Sinai)',
        coords: { lat: 28.539, lng: 33.975 },
        dateLabel: 'c. 860 BC',
        scriptureRef: '1 KINGS {19:8}–{19:18}',
        scriptureOsis: '1KI.19.12',
        note: 'Strengthened by angel-baked cake for a 40-day journey, Elijah hears the LORD in a still small voice and is commissioned to anoint Hazael, Jehu, and Elisha.'
      },
      {
        name: 'Samaria & Ekron (Ahaziah\'s Inquiry)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. 852 BC',
        scriptureRef: '2 KINGS {1:1}–{1:17}',
        scriptureOsis: '2KI.1.3',
        note: 'After Moab rebels following Ahab\'s death (attested on the Mesha Stele), King Ahaziah sends messengers toward Ekron to inquire of Baal-zebub; Elijah intercepts them with the word of the LORD.'
      },
      {
        name: 'Jericho & Jordan River (Elijah\'s Whirlwind Ascension)',
        coords: { lat: 31.855, lng: 35.535 },
        dateLabel: 'c. 851 BC',
        scriptureRef: '2 KINGS {2:1}–{2:15}',
        scriptureOsis: '2KI.2.11',
        note: 'Elijah strikes the Jordan with his mantle; across the river a chariot of fire and horses of fire part them, Elijah goes up by a whirlwind into heaven, and Elisha parts the Jordan with Elijah\'s mantle.'
      }
    ]
  },
  {
    id: 'babylonian-deportation-daniel',
    name: 'Babylonian Exile: Jerusalem to Babylon (Daniel & Ezekiel)',
    shortBanner: '🏛️ BABYLONIAN EXILE ROUTE (605–539 BC)',
    travelerName: 'Daniel, Ezekiel & Judean Exiles',
    figureId: 'daniel',
    color: '#ef4444',
    dateRange: '605 – 539 BC',
    scriptureRef: '2 KINGS {24:1}–{25:21}, DANIEL {1:1}–{6:28}',
    scriptureOsis: 'DAN.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'In three waves (605, 597, and 586 BC), Nebuchadnezzar II marches from Babylon up the Euphrates through Carchemish and Riblah to besiege Jerusalem, carrying Daniel, Ezekiel, King Jehoiachin, and Judah into 70 years of Babylonian captivity.',
    path: [
      { lat: 31.768, lng: 35.213 }, // Stop 1: Jerusalem
      { lat: 31.680, lng: 34.980 }, // Valley of Elah / Beit Guvrin road
      { lat: 31.565, lng: 34.849 }, // Stop 2: Lachish
      { lat: 31.700, lng: 34.930 }, // Azekah
      { lat: 31.768, lng: 35.213 }, // Way of the Patriarchs back through Jerusalem
      { lat: 31.930, lng: 35.220 }, // Bethel
      { lat: 32.214, lng: 35.261 }, // Shechem / Tirzah pass
      { lat: 32.410, lng: 35.240 }, // Dothan Valley
      { lat: 32.502, lng: 35.500 }, // Beth-shan gap into Jordan trough
      { lat: 32.650, lng: 35.520 }, // Jordan valley south of Galilee
      { lat: 32.780, lng: 35.510 }, // Western foothills around Sea of Galilee (Tiberias ridge)
      { lat: 32.880, lng: 35.500 }, // Plain of Gennesaret western bypass
      { lat: 33.017, lng: 35.568 }, // Hazor gateway (Great North Road)
      { lat: 33.250, lng: 35.652 }, // Caesarea Philippi / Dan (Lebanon pass)
      { lat: 33.513, lng: 36.292 }, // Damascus royal oasis
      { lat: 33.850, lng: 36.100 }, // Bekaa Valley highway
      { lat: 34.455, lng: 36.578 }, // Stop 3: Riblah on the Orontes
      { lat: 35.300, lng: 36.750 }, // Hamath
      { lat: 36.200, lng: 37.150 }, // Aleppo (Halab)
      { lat: 36.829, lng: 38.015 }, // Stop 4: Carchemish on Euphrates
      { lat: 36.000, lng: 38.900 }, // Emar / Middle Euphrates
      { lat: 35.330, lng: 40.150 }, // Deir ez-Zor
      { lat: 34.450, lng: 40.900 }, // Mari (Euphrates caravan corridor)
      { lat: 33.600, lng: 42.800 }, // Hit (bitumen springs)
      { lat: 32.126, lng: 45.231 }, // Stop 5: River Chebar / Nippur (Tel-abib)
      { lat: 32.542, lng: 44.421 }  // Stop 6: Babylon (Ishtar Gate & Southern Palace)
    ],
    stops: [
      {
        name: 'Jerusalem (Siege & Deportations)',
        coords: { lat: 31.768, lng: 35.213 },
        dateLabel: '605 BC (Daniel) · 597 BC (Jehoiachin/Ezekiel) · 586 BC (Temple Burned)',
        scriptureRef: 'DANIEL {1:1}–{1:6}, 2 KINGS {24:10}–{25:10}',
        scriptureOsis: 'DAN.1.1',
        note: 'Nebuchadnezzar carries Daniel and the royal youths to Babylon in 605 BC, deports Jehoiachin and Ezekiel in 597 BC, and destroys the First Temple in 586 BC.'
      },
      {
        name: 'Lachish (Shephelah Fortress)',
        coords: { lat: 31.565, lng: 34.849 },
        dateLabel: '588 – 586 BC',
        scriptureRef: 'JEREMIAH {34:7}',
        scriptureOsis: 'JER.34.7',
        note: 'One of the last two fortified cities of Judah standing during Nebuchadnezzar\'s final siege, corroborated by the Lachish Letters ("watching for the fire signals of Lachish").'
      },
      {
        name: 'Riblah (Land of Hamath)',
        coords: { lat: 34.455, lng: 36.578 },
        dateLabel: '586 BC',
        scriptureRef: '2 KINGS {25:6}–{25:7}, JEREMIAH {39:5}–{39:7}',
        scriptureOsis: '2KI.25.6',
        note: 'Nebuchadnezzar\'s northern military headquarters on the Orontes River where captured King Zedekiah is judged before being taken in fetters to Babylon.'
      },
      {
        name: 'Carchemish (Upper Euphrates)',
        coords: { lat: 36.829, lng: 38.015 },
        dateLabel: '605 BC',
        scriptureRef: 'JEREMIAH {46:2}, 2 CHRONICLES {35:20}',
        scriptureOsis: 'JER.46.2',
        note: 'Strategic Euphrates crossing where Nebuchadnezzar decisively defeated Pharaoh Necho II in 605 BC (recorded in the Babylonian Chronicle), opening the Fertile Crescent arc to Babylon.'
      },
      {
        name: 'River Chebar / Nippur (Tel-abib)',
        coords: { lat: 32.126, lng: 45.231 },
        dateLabel: '593 – 571 BC',
        scriptureRef: 'EZEKIEL {1:1}–{1:3}, {3:15}',
        scriptureOsis: 'EZK.1.1',
        note: 'Jewish exile settlement along the Grand Canal (Kabaru) of Babylonia where the heavens opened and Ezekiel saw visions of the glory of God.'
      },
      {
        name: 'Babylon (Royal Palace & Ishtar Gate)',
        coords: { lat: 32.542, lng: 44.421 },
        dateLabel: '605 – 539 BC (70 Years)',
        scriptureRef: 'DANIEL {2:1}–{5:31}, 2 KINGS {25:27}–{25:30}',
        scriptureOsis: 'DAN.5.30',
        note: 'Capital of the Neo-Babylonian Empire where Daniel interprets Nebuchadnezzar\'s dream of four world empires, reads the handwriting on Belshazzar\'s wall (539 BC), and where Jehoiachin\'s rations are recorded on cuneiform tablets.'
      }
    ]
  },
  {
    id: 'ezra-nehemiah-return',
    name: 'Persian Restoration: Return of Zerubbabel, Ezra & Nehemiah',
    shortBanner: '📜 PERSIAN RESTORATION RETURN (538–445 BC)',
    travelerName: 'Zerubbabel, Ezra the Scribe & Nehemiah',
    figureId: 'ezra-nehemiah',
    color: '#22c55e',
    dateRange: '538 – 445 BC',
    scriptureRef: 'EZRA {1:1}–{8:36}, NEHEMIAH {1:1}–{6:16}',
    scriptureOsis: 'EZR.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Fulfilling Jeremiah\'s 70-year prophecy and Isaiah\'s naming of Cyrus, the Jewish remnant returns from Babylon and Susa in three waves under Zerubbabel (538 BC), Ezra (458 BC), and Nehemiah (445 BC) to rebuild the Second Temple and Jerusalem\'s walls.',
    stops: [
      {
        name: 'Babylon (Decree of Cyrus)',
        coords: { lat: 32.542, lng: 44.421 },
        dateLabel: '538 BC (Zerubbabel) · 458 BC (Ezra)',
        scriptureRef: 'EZRA {1:1}–{1:11}, {7:6}–{7:9}',
        scriptureOsis: 'EZR.1.1',
        note: 'In the first year of Cyrus king of Persia, the LORD stirs up Cyrus\'s spirit to proclaim liberty for God\'s people to go up to Jerusalem and rebuild the House of the LORD (corroborated by the Cyrus Cylinder).'
      },
      {
        name: 'Shushan the Palace (Susa)',
        coords: { lat: 32.190, lng: 48.257 },
        dateLabel: 'Chislev–Nisan, 445 BC',
        scriptureRef: 'NEHEMIAH {1:1}–{2:8}, ESTHER {1:2}, {4:14}',
        scriptureOsis: 'NEH.1.1',
        note: 'Persian winter capital where Queen Esther saved the Jewish people under Xerxes and where royal cupbearer Nehemiah received King Artaxerxes\' commission to rebuild Jerusalem\'s walls.'
      },
      {
        name: 'River Ahava (Babylonia)',
        coords: { lat: 33.400, lng: 43.200 },
        dateLabel: '1–12 Nisan, 458 BC',
        scriptureRef: 'EZRA {8:15}–{8:31}',
        scriptureOsis: 'EZR.8.21',
        note: 'Ezra gathers the returning exiles and Levites by the river running to Ahava and proclaims a fast to seek from God a right way for them and their little ones.'
      },
      {
        name: 'Tadmor / Upper Euphrates Corridor',
        coords: { lat: 35.950, lng: 39.000 },
        dateLabel: '538 / 458 / 445 BC (~900-Mile Caravan Route)',
        scriptureRef: 'EZRA {7:9}, NEHEMIAH {2:7}–{2:9}',
        scriptureOsis: 'EZR.7.9',
        note: 'Four-month caravan journey following the Euphrates and Syrian saddle with letters to the governors "beyond the River" (Trans-Euphrates).'
      },
      {
        name: 'Jerusalem (Second Temple & Rebuilt Walls)',
        coords: { lat: 31.768, lng: 35.213 },
        dateLabel: '516 BC (Temple Completed) · 445 BC (Walls Rebuilt in 52 Days)',
        scriptureRef: 'EZRA {6:15}, NEHEMIAH {6:15}–{8:8}',
        scriptureOsis: 'NEH.6.15',
        note: 'Zerubbabel and Joshua complete the Second Temple in 516 BC; Ezra reads the Law distinctly before the Water Gate; Nehemiah completes the wall in 52 days so even enemies perceive this work was wrought of God.'
      }
    ]
  },
  {
    id: 'john-baptist-ministry',
    name: "John the Baptist: Wilderness, Jordan & Machaerus (In Relation to Jesus)",
    shortBanner: "🌊 JOHN THE BAPTIST MINISTRY (AD 26–29)",
    travelerName: 'John the Baptist (Forerunner of Christ)',
    figureId: 'jesus-christ',
    color: '#22d3ee', // Bright Cyan
    dateRange: 'c. AD 26 – 29',
    scriptureRef: 'MATTHEW {3:1}–{3:17}, {11:2}–{11:14}, JOHN {1:19}–{1:36}, {3:22}–{3:36}, MARK {6:17}–{6:29}',
    scriptureOsis: 'JHN.1.28',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'In the 15th year of Tiberius Caesar (Luke 3:1), John the Baptist emerges in the Wilderness of Judea to prepare the way of the LORD, baptizes Jesus at Bethabara, ministers at Aenon near Salim simultaneously while Jesus ministers in Judea (John 3:22–24), and is imprisoned and martyred by Herod Antipas at Machaerus.',
    stops: [
      {
        name: 'Hill Country of Judea (Ain Karim / Hebron)',
        coords: { lat: 31.766, lng: 35.161 },
        dateLabel: 'c. 6 BC – AD 26 (Birth & Desert Preparation)',
        scriptureRef: 'LUKE {1:39}–{1:80}',
        scriptureOsis: 'LUK.1.80',
        note: 'Born to Zacharias and Elisabeth six months before Jesus; Mary visits Elisabeth here and sings the Magnificat. John grows and is in the deserts till the day of his shewing unto Israel.'
      },
      {
        name: 'Wilderness of Judea (Lower Jordan Valley)',
        coords: { lat: 31.820, lng: 35.460 },
        dateLabel: 'Spring–Summer AD 26 (15th Year of Tiberius Caesar)',
        scriptureRef: 'LUKE {3:1}–{3:6}, MATTHEW {3:1}–{3:6}',
        scriptureOsis: 'LUK.3.1',
        note: 'The word of God comes to John in the wilderness; clothed in camel\'s hair, he preaches the baptism of repentance as the voice crying in the wilderness foretold by Isaiah 40:3.'
      },
      {
        name: 'Bethabara / Bethany Beyond Jordan (Al-Maghtas)',
        coords: { lat: 31.837, lng: 35.551 },
        dateLabel: 'Autumn AD 26 (Convergence with Jesus)',
        scriptureRef: 'JOHN {1:28}–{1:36}, MATTHEW {3:13}–{3:17}',
        scriptureOsis: 'JHN.1.28',
        note: 'DIRECT RELATION TO JESUS: Jesus comes from Galilee to the Jordan unto John to be baptized. John sees the Spirit descending like a dove and testifies, "Behold the Lamb of God, which taketh away the sin of the world!" His disciples Andrew and John follow Jesus.'
      },
      {
        name: 'Aenon Near Salim (Decapolis / Northern Jordan Valley)',
        coords: { lat: 32.392, lng: 35.515 },
        dateLabel: 'Summer–Autumn AD 27 (Parallel Ministry with Jesus)',
        scriptureRef: 'JOHN {3:22}–{3:36}',
        scriptureOsis: 'JHN.3.23',
        note: 'DIRECT RELATION TO JESUS: While Jesus and His disciples are baptizing in the Judean countryside (~35 miles south, John 3:22), John baptizes at Aenon near Salim "because there was much water there; and he was not yet cast into prison." Here John declares: "He must increase, but I must decrease."'
      },
      {
        name: 'Machaerus Fortress (Perea, East of Dead Sea)',
        coords: { lat: 31.567, lng: 35.624 },
        dateLabel: 'Late AD 27 – Early AD 29 (Imprisonment & Martyrdom)',
        scriptureRef: 'MATTHEW {4:12}, {11:2}–{11:11}, {14:1}–{14:12}, MARK {6:17}–{6:29}',
        scriptureOsis: 'MAT.11.2',
        note: 'DIRECT RELATION TO JESUS: Imprisoned by Herod Antipas at Machaerus fortress (corroborated by Josephus, Antiquities 18.5.2) for rebuking Herod\'s unlawful marriage to Herodias. From this dungeon John sends two disciples to Jesus in Galilee asking, "Art thou he that should come?" before being beheaded by Herod.'
      }
    ]
  },
  {
    id: 'jesus-nativity-youth',
    name: "Jesus Phase 1: Nativity, Flight to Egypt & Youth in Nazareth",
    shortBanner: "⭐ JESUS PHASE 1: NATIVITY & EGYPT (6 BC–AD 8)",
    travelerName: 'Jesus Christ (with Mary & Joseph)',
    figureId: 'jesus-christ',
    color: '#fbbf24', // Warm Messianic Gold
    dateRange: 'c. 6 BC – AD 8',
    scriptureRef: 'MATTHEW {1:18}–{2:23}, LUKE {1:26}–{2:52}',
    scriptureOsis: 'LUK.2.4',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'From Gabriel\'s announcement in Nazareth to the census birth in Bethlehem, presentation at the Jerusalem Temple, refuge in Egypt from Herod the Great, and childhood in Nazareth culminating in the Passover visit at age twelve.',
    stops: [
      {
        name: 'Nazareth (Annunciation)',
        coords: { lat: 32.701, lng: 35.303 },
        dateLabel: 'c. 6 BC',
        scriptureRef: 'LUKE {1:26}–{1:38}',
        scriptureOsis: 'LUK.1.26',
        note: 'The angel Gabriel is sent from God unto a city of Galilee named Nazareth to the virgin Mary: "Thou shalt conceive in thy womb, and bring forth a son, and shalt call his name JESUS."'
      },
      {
        name: 'Bethlehem of Judea (Nativity & Wise Men)',
        coords: { lat: 31.705, lng: 35.204 },
        dateLabel: 'c. 5 BC',
        scriptureRef: 'LUKE {2:1}–{2:20}, MATTHEW {2:1}–{2:12}, MICAH {5:2}',
        scriptureOsis: 'LUK.2.4',
        note: 'Under Caesar Augustus\'s decree, Joseph and Mary travel from Nazareth to Bethlehem, the city of David, where Jesus is born, laid in a manger, heralded to shepherds by angels, and later worshipped by Wise Men from the East.'
      },
      {
        name: 'Jerusalem Temple (Presentation at 40 Days)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. 5 BC (40 Days Old)',
        scriptureRef: 'LUKE {2:22}–{2:38}',
        scriptureOsis: 'LUK.2.22',
        note: 'Presented to the Lord according to the Law of Moses; righteous Simeon takes the child in his arms and praises God: "Mine eyes have seen thy salvation, a light to lighten the Gentiles."'
      },
      {
        name: 'Egypt (Refuge from Herod the Great)',
        coords: { lat: 30.650, lng: 32.050 },
        dateLabel: 'c. 5 – 4 BC',
        scriptureRef: 'MATTHEW {2:13}–{2:18}, HOSEA {11:1}',
        scriptureOsis: 'MAT.2.13',
        note: 'Warned by an angel of the Lord in a dream before Herod\'s massacre in Bethlehem, Joseph flees by night with the young child and his mother into Egypt until the death of Herod (4 BC), fulfilling "Out of Egypt have I called my son."'
      },
      {
        name: 'Nazareth in Galilee (Boyhood)',
        coords: { lat: 32.705, lng: 35.300 },
        dateLabel: 'c. 4 BC – AD 26',
        scriptureRef: 'MATTHEW {2:19}–{2:23}, LUKE {2:39}–{2:40}',
        scriptureOsis: 'MAT.2.23',
        note: 'Returning from Egypt after Herod\'s death, the family settles in Nazareth in Galilee under Herod Antipas, where the child grows and waxes strong in spirit, filled with wisdom.'
      },
      {
        name: 'Jerusalem Temple (Passover at Age 12)',
        coords: { lat: 31.776, lng: 35.236 },
        dateLabel: 'Passover, c. AD 8 (Age 12)',
        scriptureRef: 'LUKE {2:41}–{2:52}',
        scriptureOsis: 'LUK.2.46',
        note: 'At age twelve Jesus sits in the midst of the doctors in the Temple, both hearing them and asking them questions, declaring to Mary and Joseph: "Wist ye not that I must be about my Father\'s business?"'
      }
    ]
  },
  {
    id: 'jesus-early-ministry',
    name: "Jesus Phase 2: Baptism, Cana, Judea & Samaria (Parallel with John the Baptist)",
    shortBanner: "🕊️ JESUS PHASE 2: BAPTISM, JUDEA & SAMARIA (AD 26–27)",
    travelerName: 'Jesus Christ (Early Judean & Samaritan Ministry)',
    figureId: 'jesus-christ',
    color: '#34d399', // Emerald Green
    dateRange: 'AD 26 – 27',
    scriptureRef: 'MATTHEW {3:13}–{4:12}, JOHN {1:29}–{4:54}',
    scriptureOsis: 'JHN.3.22',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Jesus is baptized by John the Baptist at the Jordan, overcomes Satan in the Judean Wilderness, turns water to wine at Cana, cleanses the Temple and teaches Nicodemus in Jerusalem, ministers in the Judean countryside simultaneously with John the Baptist at Aenon (John 3:22–24), and reveals Himself as Messiah to the Samaritan woman at Sychar.',
    stops: [
      {
        name: 'Bethabara Beyond Jordan (Baptism by John)',
        coords: { lat: 31.837, lng: 35.551 },
        dateLabel: 'Autumn AD 26',
        scriptureRef: 'MATTHEW {3:13}–{3:17}, JOHN {1:29}–{1:51}',
        scriptureOsis: 'MAT.3.13',
        note: 'Jesus is baptized by John the Baptist; the heavens open, the Spirit descends like a dove, and the Father\'s voice declares, "This is my beloved Son, in whom I am well pleased." Andrew, Peter, Philip, and Nathanael become His first disciples.'
      },
      {
        name: 'Wilderness of Judea (40 Days of Temptation)',
        coords: { lat: 31.875, lng: 35.410 },
        dateLabel: 'Autumn AD 26',
        scriptureRef: 'MATTHEW {4:1}–{4:11}, LUKE {4:1}–{4:13}',
        scriptureOsis: 'MAT.4.1',
        note: 'Led by the Spirit into the wilderness to be tempted of the devil for forty days and forty nights, Jesus triumphs over every temptation with the written Word of God ("It is written").'
      },
      {
        name: 'Cana of Galilee (First Miracle)',
        coords: { lat: 32.796, lng: 35.336 },
        dateLabel: 'Early Spring AD 27',
        scriptureRef: 'JOHN {2:1}–{2:12}',
        scriptureOsis: 'JHN.2.1',
        note: 'On the third day there is a marriage in Cana of Galilee; Jesus turns six stone waterpots of water into the best wine, manifesting forth His glory so His disciples believe on Him.'
      },
      {
        name: 'Jerusalem (First Passover, Temple Cleansing & Nicodemus)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'Passover, Spring AD 27',
        scriptureRef: 'JOHN {2:13}–{3:21}',
        scriptureOsis: 'JHN.3.16',
        note: 'Jesus drives the moneychangers from the Temple ("Destroy this temple, and in three days I will raise it up") and teaches Pharisee ruler Nicodemus by night of the new birth and God\'s love for the world (John 3:16).'
      },
      {
        name: 'Judean Countryside (Parallel Ministry with John at Aenon)',
        coords: { lat: 31.950, lng: 35.350 },
        dateLabel: 'Summer–Autumn AD 27 (Concurrent with John at Aenon)',
        scriptureRef: 'JOHN {3:22}–{3:26}, {4:1}–{4:3}',
        scriptureOsis: 'JHN.3.22',
        note: 'SPATIAL RELATION TO JOHN THE BAPTIST: Jesus tarries with His disciples in the land of Judea while His disciples baptize—at the exact same time John the Baptist is baptizing ~35 miles north at Aenon near Salim prior to John\'s arrest (John 3:22–24).'
      },
      {
        name: 'Sychar / Jacob\'s Well in Samaria',
        coords: { lat: 32.209, lng: 35.285 },
        dateLabel: 'Late AD 27 (En Route to Galilee After John\'s Arrest)',
        scriptureRef: 'JOHN {4:4}–{4:42}, MATTHEW {4:12}',
        scriptureOsis: 'JHN.4.5',
        note: 'Hearing that John the Baptist has been cast into prison (Matthew 4:12) and that the Pharisees heard Jesus made and baptized more disciples than John (John 4:1), Jesus passes through Samaria, offers living water at Jacob\'s Well, and many Samaritans confess Him as the Saviour of the world.'
      }
    ]
  },
  {
    id: 'jesus-galilean-ministry',
    name: "Jesus Phase 3: Great Galilean & Northern Ministry",
    shortBanner: "⛵ JESUS PHASE 3: GALILEAN MINISTRY (AD 28–29)",
    travelerName: 'Jesus Christ & the Twelve Apostles',
    figureId: 'jesus-christ',
    color: '#60a5fa', // Galilean Sky Blue
    dateRange: 'AD 28 – 29',
    scriptureRef: 'MATTHEW {4:13}–{18:35}, MARK {1:14}–{9:50}, LUKE {4:14}–{9:50}, JOHN {5:1}–{7:52}',
    scriptureOsis: 'MAT.4.13',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Making Capernaum His headquarters by the Sea of Galilee, Jesus calls the Twelve, preaches the Sermon on the Mount, calms the storm, raises the dead at Nain and Capernaum, feeds the 5,000 near Bethsaida, ministers in Tyre and Sidon, and is transfigured in glory near Caesarea Philippi.',
    path: [
      { lat: 32.701, lng: 35.303 }, // Nazareth
      { lat: 32.750, lng: 35.340 }, // Cana
      { lat: 32.820, lng: 35.490 }, // Horns of Hattin / Arbel pass
      { lat: 32.860, lng: 35.505 }, // Plain of Gennesaret
      { lat: 32.872, lng: 35.525 }, // Tabgha road
      { lat: 32.895, lng: 35.545 }, // Mount of Beatitudes
      { lat: 32.902, lng: 35.565 }, // Capernaum (Northwest Shore hillside road)
      { lat: 32.895, lng: 35.545 }, // Mount of Beatitudes
      { lat: 32.872, lng: 35.525 }, // Tabgha road
      { lat: 32.845, lng: 35.505 }, // Gennesaret shoreline road
      { lat: 32.805, lng: 35.505 }, // Magdala
      { lat: 32.768, lng: 35.510 }, // Tiberias
      { lat: 32.680, lng: 35.380 }, // Mount Tabor foothills
      { lat: 32.632, lng: 35.347 }, // Nain (Hill of Moreh)
      { lat: 32.680, lng: 35.380 }, // Return via Tabor
      { lat: 32.768, lng: 35.510 }, // Tiberias embarkation
      { lat: 32.785, lng: 35.647 }, // Country of the Gadarenes (Gospel boat crossing)
      { lat: 32.840, lng: 35.645 }, // Gergesa eastern shore boat landing
      { lat: 32.910, lng: 35.630 }, // Bethsaida Julias (North shore boat landing)
      { lat: 32.902, lng: 35.565 }, // Return by boat to Capernaum
      { lat: 32.895, lng: 35.545 },
      { lat: 32.920, lng: 35.530 }, // Great North Road ascent
      { lat: 33.000, lng: 35.350 }, // Upper Galilee highway
      { lat: 33.270, lng: 35.196 }, // Coasts of Tyre & Sidon
      { lat: 33.248, lng: 35.694 }  // Caesarea Philippi & Mount Hermon
    ],
    stops: [
      {
        name: 'Nazareth Synagogue (Isaiah 61 Scroll)',
        coords: { lat: 32.701, lng: 35.303 },
        dateLabel: 'Early AD 28',
        scriptureRef: 'LUKE {4:16}–{4:30}',
        scriptureOsis: 'LUK.4.16',
        note: 'In His hometown synagogue on the Sabbath, Jesus reads Isaiah 61:1–2 and declares, "This day is this scripture fulfilled in your ears."'
      },
      {
        name: 'Capernaum ("His Own City" & Ministry HQ)',
        coords: { lat: 32.881, lng: 35.575 },
        dateLabel: 'AD 28 – 29',
        scriptureRef: 'MATTHEW {4:13}–{4:25}, {8:5}–{9:8}, MARK {2:1}–{2:12}, JOHN {6:24}–{6:59}',
        scriptureOsis: 'MAT.4.13',
        note: 'Fulfilling Isaiah 9:1–2 ("Galilee of the nations"), Jesus dwells in Capernaum, calls Peter, Andrew, James, John, and Matthew, heals the centurion\'s servant and the paralytic let down through the roof, raises Jairus\'s daughter, and delivers the Bread of Life discourse.'
      },
      {
        name: 'Mount of Beatitudes (North Shore of Galilee)',
        coords: { lat: 32.880, lng: 35.556 },
        dateLabel: 'Summer AD 28',
        scriptureRef: 'MATTHEW {5:1}–{7:29}, LUKE {6:12}–{6:49}',
        scriptureOsis: 'MAT.5.1',
        note: 'After praying all night on a mountain and ordaining the Twelve Apostles, Jesus delivers the Sermon on the Mount with an authority that astonishes the multitudes.'
      },
      {
        name: 'Nain (Hill of Moreh)',
        coords: { lat: 32.632, lng: 35.347 },
        dateLabel: 'Summer/Autumn AD 28 (Just Prior to John\'s Messengers)',
        scriptureRef: 'LUKE {7:11}–{7:28}',
        scriptureOsis: 'LUK.7.11',
        note: 'Moved with compassion at the city gate of Nain, Jesus touches the bier and raises the widow\'s only son from the dead. Immediately afterward (Luke 7:18–23), John the Baptist\'s disciples arrive from Machaerus prison and witness Jesus healing the blind, lame, and lepers.'
      },
      {
        name: 'Country of the Gadarenes / Gergesenes (East Shore)',
        coords: { lat: 32.785, lng: 35.647 },
        dateLabel: 'Late AD 28',
        scriptureRef: 'MARK {4:35}–{5:20}, LUKE {8:22}–{8:39}',
        scriptureOsis: 'MRK.4.39',
        note: 'Crossing the Sea of Galilee, Jesus rebukes the wind and waves ("Peace, be still") and delivers the demoniac from a legion of unclean spirits on the eastern shore, sending him to proclaim throughout Decapolis how great things Jesus had done.'
      },
      {
        name: 'Bethsaida Julias (Feeding the 5,000 & Walking on the Sea)',
        coords: { lat: 32.910, lng: 35.630 },
        dateLabel: 'Passover Season, Spring AD 29 (Upon Hearing of John\'s Martyrdom)',
        scriptureRef: 'MATTHEW {14:13}–{14:33}, MARK {6:30}–{6:52}, JOHN {6:1}–{6:21}',
        scriptureOsis: 'MAT.14.13',
        note: 'When John the Baptist\'s disciples bury his body at Machaerus and come tell Jesus (Matthew 14:12–13), Jesus withdraws by boat to a desert place near Bethsaida, feeds 5,000 men besides women and children with five loaves and two fishes, and walks on the stormy sea.'
      },
      {
        name: 'Coasts of Tyre & Sidon (Phoenicia)',
        coords: { lat: 33.270, lng: 35.196 },
        dateLabel: 'Summer AD 29',
        scriptureRef: 'MATTHEW {15:21}–{15:28}, MARK {7:24}–{7:30}',
        scriptureOsis: 'MAT.15.21',
        note: 'Withdrawing northwest into Gentile Phoenicia, Jesus commends the great faith of the Syrophoenician woman and heals her daughter from afar.'
      },
      {
        name: 'Caesarea Philippi & Mount Hermon (Confession & Transfiguration)',
        coords: { lat: 33.248, lng: 35.694 },
        dateLabel: 'Autumn AD 29',
        scriptureRef: 'MATTHEW {16:13}–{17:13}, MARK {8:27}–{9:13}, LUKE {9:18}–{9:36}',
        scriptureOsis: 'MAT.16.16',
        note: 'At the foot of Mount Hermon, Peter confesses, "Thou art the Christ, the Son of the living God." Six days later on a high mountain, Jesus is transfigured in radiant glory as Moses and Elijah appear talking with Him of His decease (exodus) at Jerusalem.'
      }
    ]
  },
  {
    id: 'jesus-passion-resurrection',
    name: "Jesus Phase 4: Final Journey, Crucifixion, Resurrection & Ascension",
    shortBanner: "✝️ JESUS PHASE 4: PASSION & RESURRECTION (AD 30/33)",
    travelerName: 'Jesus Christ (Crucified & Risen Lord)',
    figureId: 'jesus-christ',
    color: '#f87171', // Crimson-Coral
    dateRange: 'AD 29 – 30 / 33',
    scriptureRef: 'LUKE {9:51}–{24:53}, JOHN {11:1}–{21:25}, MATTHEW {19:1}–{28:20}, ACTS {1:1}–{1:11}',
    scriptureOsis: 'MAT.28.6',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Setting His face steadfastly toward Jerusalem, Jesus ministers in Perea, raises Lazarus at Bethany, passes through Jericho, enters Jerusalem in triumph, suffers and dies on Golgotha for our sins, rises bodily from the tomb on the third day, appears in Emmaus, Jerusalem, and Galilee, and ascends from the Mount of Olives.',
    path: [
      { lat: 31.880, lng: 35.600 }, // Perea Beyond Jordan
      { lat: 31.771, lng: 35.261 }, // Bethany
      { lat: 31.856, lng: 35.444 }, // Jericho
      { lat: 31.778, lng: 35.230 }, // Jerusalem: Gethsemane, Gabbatha, Golgotha & Tomb
      { lat: 31.839, lng: 34.989 }, // Emmaus
      { lat: 31.850, lng: 35.180 }, // Return via Gibeon
      { lat: 31.930, lng: 35.220 }, // Bethel
      { lat: 32.214, lng: 35.261 }, // Shechem
      { lat: 32.502, lng: 35.500 }, // Beth-shan into Jordan Valley
      { lat: 32.780, lng: 35.500 }, // Western Galilee foothills around Sea of Galilee
      { lat: 32.845, lng: 35.505 }, // Plain of Gennesaret western road
      { lat: 32.870, lng: 35.515 }, // Tabgha approach
      { lat: 32.890, lng: 35.545 }, // Mountain in Galilee / Mount of Beatitudes overlook
      { lat: 32.870, lng: 35.515 }, // Return via Tabgha road
      { lat: 32.845, lng: 35.505 }, // Gennesaret
      { lat: 32.780, lng: 35.500 }, // Western foothills
      { lat: 32.502, lng: 35.500 }, // Beth-shan
      { lat: 31.930, lng: 35.525 }, // Jordan Valley south
      { lat: 31.855, lng: 35.520 }, // Jericho
      { lat: 31.778, lng: 35.245 }  // Mount of Olives / Bethany (The Ascension)
    ],
    stops: [
      {
        name: 'Perea Beyond Jordan ("Where John at First Baptized")',
        coords: { lat: 31.880, lng: 35.600 },
        dateLabel: 'Winter AD 29/30',
        scriptureRef: 'JOHN {10:40}–{10:42}, LUKE {13:22}–{17:10}, MATTHEW {19:1}',
        scriptureOsis: 'JHN.10.40',
        note: 'Jesus returns to the place beyond Jordan where John at first baptized; many resort unto Him and believe, saying, "John did no miracle: but all things that John spake of this man were true."'
      },
      {
        name: 'Bethany (Raising of Lazarus)',
        coords: { lat: 31.771, lng: 35.261 },
        dateLabel: 'Early Spring AD 30/33',
        scriptureRef: 'JOHN {11:1}–{12:11}',
        scriptureOsis: 'JHN.11.25',
        note: 'Two miles east of Jerusalem on the eastern slope of Olivet, Jesus declares "I am the resurrection, and the life" and calls Lazarus forth alive after four days in the tomb; Mary of Bethany later anoints His feet with costly spikenard.'
      },
      {
        name: 'Jericho (Bartimaeus & Zacchaeus)',
        coords: { lat: 31.856, lng: 35.444 },
        dateLabel: 'Early Nisan, AD 30/33',
        scriptureRef: 'LUKE {18:35}–{19:28}, MARK {10:46}–{10:52}',
        scriptureOsis: 'LUK.19.10',
        note: 'Ascending toward Jerusalem for His final Passover, Jesus gives sight to blind Bartimaeus and brings salvation to the house of chief publican Zacchaeus: "For the Son of man is come to seek and to save that which was lost."'
      },
      {
        name: 'Jerusalem: Gethsemane, Gabbatha, Golgotha & The Empty Tomb',
        coords: { lat: 31.778, lng: 35.230 },
        dateLabel: '10–16 Nisan, AD 30/33 (Passover Week & Resurrection Sunday)',
        scriptureRef: 'MATTHEW {21:1}–{28:15}, LUKE {22:1}–{24:12}, JOHN {18:1}–{20:31}',
        scriptureOsis: 'MAT.28.6',
        note: 'Jesus institutes the New Covenant in the Upper Room, prays in agony at Gethsemane, is condemned before Caiaphas and Pontius Pilate (both archaeologically attested), is crucified at Golgotha ("It is finished"), and rises bodily from the tomb on the third day ("He is not here: for he is risen").'
      },
      {
        name: 'Emmaus (Resurrection Sunday Appearance)',
        coords: { lat: 31.839, lng: 34.989 },
        dateLabel: '16 Nisan, AD 30/33 (Resurrection Afternoon)',
        scriptureRef: 'LUKE {24:13}–{24:35}',
        scriptureOsis: 'LUK.24.13',
        note: 'Walking with Cleopas and another disciple toward Emmaus, the risen Christ expounds in all the Scriptures the things concerning Himself from Moses and all the prophets, and is known to them in the breaking of bread.'
      },
      {
        name: 'Sea of Galilee & Mountain in Galilee (The Great Commission)',
        coords: { lat: 32.874, lng: 35.560 },
        dateLabel: 'Spring AD 30/33 (During the 40 Post-Resurrection Days)',
        scriptureRef: 'JOHN {21:1}–{21:25}, MATTHEW {28:16}–{28:20}, 1 CORINTHIANS {15:6}',
        scriptureOsis: 'MAT.28.18',
        note: 'Jesus appears to the disciples by the Sea of Tiberias, restores Peter threefold ("Feed my sheep"), appears to above 500 brethren at once, and gives the Great Commission: "Go ye therefore, and teach all nations."'
      },
      {
        name: 'Mount of Olives / Bethany (The Ascension)',
        coords: { lat: 31.778, lng: 35.245 },
        dateLabel: '40 Days After Resurrection, AD 30/33',
        scriptureRef: 'LUKE {24:50}–{24:53}, ACTS {1:3}–{1:12}',
        scriptureOsis: 'ACT.1.8',
        note: 'After showing Himself alive by many infallible proofs for forty days and promising power when the Holy Ghost comes ("witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth"), Jesus ascends visibly into heaven from Olivet.'
      }
    ]
  },
  {
    id: 'peter-philip-missions',
    name: "Peter & Philip: Jerusalem, Samaria, Gaza, Caesarea & Rome",
    shortBanner: "🔥 PETER & PHILIP MISSIONS (AD 33–67)",
    travelerName: 'Apostle Peter & Philip the Evangelist',
    figureId: 'peter',
    color: '#38bdf8', // Apostolic Azure
    dateRange: 'AD 33 – c. 67',
    scriptureRef: 'ACTS {2:1}–{12:19}, {15:7}–{15:11}, GALATIANS {2:11}, 1 PETER {1:1}, {5:13}',
    scriptureOsis: 'ACT.2.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'From the outpouring of the Holy Spirit at Pentecost in Jerusalem, the Gospel expands through Philip to Samaria and the Ethiopian treasurer on the Gaza road, and through Peter to Lydda, Joppa, Cornelius\'s Gentile household in Caesarea, Antioch, the Diaspora of Asia Minor, and Rome.',
    stops: [
      {
        name: 'Jerusalem (Pentecost & Solomon\'s Porch)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'AD 33 – 44',
        scriptureRef: 'ACTS {2:1}–{5:42}, {12:1}–{12:17}, {15:6}–{15:11}',
        scriptureOsis: 'ACT.2.14',
        note: 'On the Day of Pentecost, Peter preaches the crucified and exalted Christ to Jews from every nation—including Parthians, Medes, Elamites, Mesopotamia, Egypt, and Rome—and 3,000 souls are baptized. Delivered from Herod Agrippa I\'s prison by an angel in AD 44.'
      },
      {
        name: 'Samaria (Philip, Peter & John)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. AD 34 – 35',
        scriptureRef: 'ACTS {8:5}–{8:25}',
        scriptureOsis: 'ACT.8.5',
        note: 'Following Stephen\'s martyrdom, Philip goes down to the city of Samaria and preaches Christ; Peter and John come from Jerusalem and pray for the Samaritans to receive the Holy Ghost.'
      },
      {
        name: 'Gaza Desert Road & Azotus (Philip & the Ethiopian Eunuch)',
        coords: { lat: 31.520, lng: 34.550 },
        dateLabel: 'c. AD 35',
        scriptureRef: 'ACTS {8:26}–{8:40}',
        scriptureOsis: 'ACT.8.26',
        note: 'Directed by an angel to the desert road from Jerusalem to Gaza, Philip expounds Isaiah 53 to the Ethiopian treasurer of Queen Candace (Kush/Meroe) and baptizes him, sending the Gospel into Africa.'
      },
      {
        name: 'Lydda & Joppa (Aeneas, Dorcas & Peter\'s Rooftop Vision)',
        coords: { lat: 32.054, lng: 34.751 },
        dateLabel: 'c. AD 38 – 40',
        scriptureRef: 'ACTS {9:32}–{10:23}',
        scriptureOsis: 'ACT.9.36',
        note: 'Peter heals paralytic Aeneas at Lydda, raises Tabitha (Dorcas) from the dead at Joppa, and on the rooftop of Simon the tanner receives the threefold vision declaring that God has cleansed the Gentiles.'
      },
      {
        name: 'Caesarea Maritima (House of Cornelius & Philip\'s Home)',
        coords: { lat: 32.500, lng: 34.890 },
        dateLabel: 'c. AD 40 (and AD 57 in Acts 21:8)',
        scriptureRef: 'ACTS {10:24}–{10:48}, {21:8}–{21:9}',
        scriptureOsis: 'ACT.10.34',
        note: 'In the Roman provincial capital of Judea, Peter preaches to centurion Cornelius\'s household; the Holy Ghost falls on the Gentiles just as at Pentecost. Philip the Evangelist and his four prophesying daughters also reside here.'
      },
      {
        name: 'Antioch (Syria) & Provinces of Pontus, Galatia, Cappadocia, Asia & Bithynia',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'c. AD 47 – 63',
        scriptureRef: 'GALATIANS {2:11}–{2:14}, 1 PETER {1:1}',
        scriptureOsis: '1PE.1.1',
        note: 'Peter visits the Gentile-Jewish church at Syrian Antioch and addresses his first epistle to the elect strangers scattered throughout Pontus, Galatia, Cappadocia, Asia, and Bithynia.'
      },
      {
        name: 'Rome ("Babylon" — Final Testimony & Martyrdom)',
        coords: { lat: 41.902, lng: 12.496 },
        dateLabel: 'c. AD 64 – 67',
        scriptureRef: '1 PETER {5:13}, 2 PETER {1:14}, JOHN {21:18}–{21:19}',
        scriptureOsis: '1PE.5.13',
        note: 'Writing with Silvanus and John Mark ("The church that is at Babylon, elected together with you, saluteth you; and so doth Marcus my son"), Peter fulfills Jesus\'s prophecy of his martyrdom in Rome under Nero (corroborated by Clement of Rome, 1 Clement 5, c. AD 95).'
      }
    ]
  },
  {
    id: 'paul-first-journey',
    name: "Paul's First Missionary Journey: Cyprus & Galatia",
    shortBanner: "⛵ PAUL'S 1ST JOURNEY: CYPRUS & GALATIA (AD 46–48)",
    travelerName: 'Apostle Paul & Barnabas (with John Mark)',
    figureId: 'paul',
    color: '#fb923c', // Warm Amber-Orange
    dateRange: 'AD 46 – 48',
    scriptureRef: 'ACTS {13:1}–{14:28}',
    scriptureOsis: 'ACT.13.2',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Set apart by the Holy Ghost at Syrian Antioch, Barnabas and Saul (Paul) sail to Cyprus, witness Proconsul Sergius Paulus\'s conversion at Paphos, cross the Taurus Mountains into Galatia, and plant enduring churches in Pisidian Antioch, Iconium, Lystra, and Derbe.',
    stops: [
      {
        name: 'Antioch in Syria',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {13:1}–{13:3}',
        scriptureOsis: 'ACT.13.2',
        note: 'At Antioch, the Holy Ghost calls Barnabas and Saul to the work. After fasting and prayer, the church sends them away. Read the passage, then look for the coast they will reach.'
      },
      {
        name: 'Paphos (Cyprus)',
        coords: { lat: 34.756, lng: 32.406 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {13:6}–{13:12}',
        scriptureOsis: 'ACT.13.7',
        note: 'At Paphos, Sergius Paulus asks to hear the word of God. Elymas opposes them; the deputy believes after seeing what happens and hearing the doctrine of the Lord.'
      },
      {
        name: 'Perga in Pamphylia',
        coords: { lat: 36.961, lng: 30.853 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {13:13}',
        scriptureOsis: 'ACT.13.13',
        note: 'Paul and his company arrive at Perga from Paphos. John leaves them and returns to Jerusalem.'
      },
      {
        name: 'Antioch in Pisidia (Galatia)',
        coords: { lat: 38.304, lng: 31.189 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {13:14}–{13:52}',
        scriptureOsis: 'ACT.13.14',
        note: 'From Perga they come to Antioch in Pisidia and enter the synagogue on the sabbath day. This is a different Antioch from the city where the journey began.'
      },
      {
        name: 'Iconium',
        coords: { lat: 37.871, lng: 32.484 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {14:1}–{14:7}',
        scriptureOsis: 'ACT.14.1',
        note: 'At Iconium, Paul and Barnabas speak in the synagogue. They remain for a time, but flee when they learn of an assault planned against them.'
      },
      {
        name: 'Lystra',
        coords: { lat: 37.583, lng: 32.483 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {14:8}–{14:20}',
        scriptureOsis: 'ACT.14.8',
        note: 'At Lystra, Paul heals a man who had never walked. Later Paul is stoned and taken outside the city. He rises and enters the city before departing with Barnabas for Derbe the next day.'
      },
      {
        name: 'Attalia',
        coords: { lat: 36.884, lng: 30.705 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {14:25}–{14:26}',
        scriptureOsis: 'ACT.14.26',
        note: 'After preaching in Perga on the return journey, they go down to Attalia. From here they sail back to Antioch.'
      },
      {
        name: 'Return to Antioch in Syria',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'Exact date not specified in Acts 13–14',
        scriptureRef: 'ACTS {14:26}–{14:28}',
        scriptureOsis: 'ACT.14.27',
        note: 'Back in Antioch, they gather the church and report all that God has done with them, and how He has opened the door of faith to the Gentiles.'
      }
    ]
  },
  {
    id: 'paul-second-journey',
    name: "Paul's Second Missionary Journey",
    shortBanner: "⛵ PAUL'S MISSIONARY JOURNEY (AD 49–52)",
    travelerName: 'Apostle Paul (with Silas, Timothy & Luke)',
    figureId: 'paul',
    color: '#f472b6', // Vibrant Rose-Coral (distinct from Roman Empire purple)
    dateRange: 'AD 49 – 52',
    scriptureRef: 'ACTS {15:36}–{18:22}',
    scriptureOsis: 'ACT.15.36',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Paul and Silas depart Syrian Antioch after the Jerusalem Council, strengthen the churches in Asia Minor with Timothy, cross the Aegean after the Macedonian vision at Troas, and plant churches in Philippi, Thessalonica, Berea, Athens, and Corinth.',
    stops: [
      {
        name: 'Antioch (Syria)',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'Spring AD 49 (Journey Departure)',
        scriptureRef: 'ACTS {15:35}–{15:40}',
        scriptureOsis: 'ACT.15.36',
        note: 'Following the Jerusalem Council (Acts 15), Paul chooses Silas and departs Syrian Antioch, commended by the brethren unto the grace of God.'
      },
      {
        name: 'Tarsus (Cilicia)',
        coords: { lat: 36.916, lng: 34.895 },
        dateLabel: 'Late Spring AD 49',
        scriptureRef: 'ACTS {15:41}',
        scriptureOsis: 'ACT.15.41',
        note: 'Paul travels overland through Syria and his native province of Cilicia (Tarsus), confirming the churches.'
      },
      {
        name: 'Derbe & Lystra (Galatia)',
        coords: { lat: 37.583, lng: 32.483 },
        dateLabel: 'Summer AD 49',
        scriptureRef: 'ACTS {16:1}–{16:5}',
        scriptureOsis: 'ACT.16.1',
        note: 'Young disciple Timothy joins Paul and Silas at Lystra; they deliver the Jerusalem Council decrees and the churches increase in number daily.'
      },
      {
        name: 'Troas (Aegean Coast)',
        coords: { lat: 39.750, lng: 26.150 },
        dateLabel: 'Late Summer / Early Autumn AD 49',
        scriptureRef: 'ACTS {16:8}–{16:11}',
        scriptureOsis: 'ACT.16.8',
        note: 'After the Holy Spirit forbids preaching in Asia and Bithynia, Paul sees a night vision of a man of Macedonia pleading, "Come over into Macedonia, and help us." Luke joins the team ("we").'
      },
      {
        name: 'Philippi (Macedonia)',
        coords: { lat: 41.013, lng: 24.286 },
        dateLabel: 'Autumn AD 49',
        scriptureRef: 'ACTS {16:12}–{16:40}',
        scriptureOsis: 'ACT.16.12',
        note: 'First church planted on European soil: Lydia\'s household is baptized, Paul and Silas sing at midnight in prison, and the Philippian jailer believes after an earthquake.'
      },
      {
        name: 'Thessalonica',
        coords: { lat: 40.640, lng: 22.944 },
        dateLabel: 'Late Autumn / Early Winter AD 49',
        scriptureRef: 'ACTS {17:1}–{17:9}',
        scriptureOsis: 'ACT.17.1',
        note: 'For three Sabbath days Paul reasons out of the Scriptures in the synagogue that Jesus is the Christ; a multitude of devout Greeks and chief women believe.'
      },
      {
        name: 'Berea',
        coords: { lat: 40.523, lng: 22.202 },
        dateLabel: 'Winter AD 49 / Early AD 50',
        scriptureRef: 'ACTS {17:10}–{17:14}',
        scriptureOsis: 'ACT.17.10',
        note: 'The Bereans receive the word with all readiness of mind and search the Scriptures daily whether those things are so.'
      },
      {
        name: 'Athens (Areopagus / Mars\' Hill)',
        coords: { lat: 37.971, lng: 23.726 },
        dateLabel: 'Spring AD 50',
        scriptureRef: 'ACTS {17:15}–{17:34}',
        scriptureOsis: 'ACT.17.15',
        note: 'Provoked by the city\'s idols, Paul proclaims the Creator and risen Judge before the Epicurean and Stoic philosophers on Mars\' Hill; Dionysius and Damaris believe.'
      },
      {
        name: 'Corinth (Achaia)',
        coords: { lat: 37.906, lng: 22.880 },
        dateLabel: 'Spring AD 50 – Autumn AD 51 (18 Months)',
        scriptureRef: 'ACTS {18:1}–{18:18}',
        scriptureOsis: 'ACT.18.1',
        note: 'Paul labors in tentmaking with Aquila and Priscilla, stays a year and six months teaching the word of God, writes 1 & 2 Thessalonians, and is vindicated before Proconsul Gallio (AD 51/52).'
      },
      {
        name: 'Ephesus (Ionia)',
        coords: { lat: 37.940, lng: 27.341 },
        dateLabel: 'Autumn AD 51',
        scriptureRef: 'ACTS {18:19}–{18:21}',
        scriptureOsis: 'ACT.18.19',
        note: 'Sailing across the Aegean from Cenchrea, Paul leaves Priscilla and Aquila at Ephesus, reasons in the synagogue, and promises to return if God wills.'
      },
      {
        name: 'Caesarea & Jerusalem',
        coords: { lat: 31.778, lng: 35.234 },
        dateLabel: 'Late Autumn AD 51 / Spring AD 52',
        scriptureRef: 'ACTS {18:22}',
        scriptureOsis: 'ACT.18.22',
        note: 'Paul lands at Caesarea, goes up and salutes the church at Jerusalem, and goes down to Antioch to complete his ~2,800-mile second missionary journey.'
      }
    ]
  },
  {
    id: 'paul-third-journey',
    name: "Paul's Third Missionary Journey: Ephesus, Macedonia & Achaia",
    shortBanner: "⛵ PAUL'S 3RD JOURNEY: EPHESUS & CORINTH (AD 53–57)",
    travelerName: 'Apostle Paul (with Luke, Timothy, Titus & Erastus)',
    figureId: 'paul',
    color: '#a855f7', // Royal Violet
    dateRange: 'AD 53 – 57',
    scriptureRef: 'ACTS {18:23}–{21:17}',
    scriptureOsis: 'ACT.19.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Passing through Galatia and Phrygia, Paul ministers for three years in Ephesus until all Asia hears the Word of the Lord, writes 1 & 2 Corinthians and Romans across Macedonia and Achaia, raises Eutychus at Troas, bids farewell to the Ephesian elders at Miletus, and goes up to Jerusalem.',
    stops: [
      {
        name: 'Antioch, Galatia & Phrygia',
        coords: { lat: 37.871, lng: 32.484 },
        dateLabel: 'Spring–Summer AD 53',
        scriptureRef: 'ACTS {18:23}',
        scriptureOsis: 'ACT.18.23',
        note: 'Departing Syrian Antioch, Paul goes over all the country of Galatia and Phrygia in order, strengthening all the disciples.'
      },
      {
        name: 'Ephesus (School of Tyrannus — 3 Years)',
        coords: { lat: 37.940, lng: 27.341 },
        dateLabel: 'Autumn AD 53 – Spring AD 56 (3 Years)',
        scriptureRef: 'ACTS {19:1}–{19:41}',
        scriptureOsis: 'ACT.19.10',
        note: 'Disputing daily in the school of Tyrannus for two years (three years total, Acts 20:31), "all they which dwelt in Asia heard the word of the Lord Jesus, both Jews and Greeks." Converts burn 50,000 pieces of silver worth of magic books; Paul writes 1 Corinthians here before Demetrius\'s silversmith riot.'
      },
      {
        name: 'Philippi & Macedonia (Illyricum Border)',
        coords: { lat: 41.013, lng: 24.286 },
        dateLabel: 'Summer–Autumn AD 56',
        scriptureRef: 'ACTS {20:1}–{20:2}, 2 CORINTHIANS {2:12}–{2:13}, {7:5}–{7:6}, ROMANS {15:19}',
        scriptureOsis: 'ACT.20.1',
        note: 'Crossing into Macedonia, Paul meets Titus with joyful news from Corinth, writes 2 Corinthians, and organizes the Macedonian relief collection for the poor saints in Jerusalem.'
      },
      {
        name: 'Corinth (Three Months — Writes Epistle to the Romans)',
        coords: { lat: 37.906, lng: 22.880 },
        dateLabel: 'Winter AD 56/57 (3 Months)',
        scriptureRef: 'ACTS {20:2}–{20:3}, ROMANS {16:1}, {16:23}',
        scriptureOsis: 'ACT.20.3',
        note: 'Spending three winter months in Greece as guest of Gaius and alongside city treasurer Erastus (Romans 16:23, attested by the Corinth Erastus Inscription), Paul dictates the Epistle to the Romans to Tertius and sends it by Phoebe of Cenchrea.'
      },
      {
        name: 'Troas (Eutychus Raised)',
        coords: { lat: 39.750, lng: 26.150 },
        dateLabel: 'Passover / Unleavened Bread, Spring AD 57',
        scriptureRef: 'ACTS {20:6}–{20:12}',
        scriptureOsis: 'ACT.20.7',
        note: 'On the first day of the week when the disciples come together to break bread, Paul preaches until midnight and restores young Eutychus alive after he falls from the third loft.'
      },
      {
        name: 'Miletus (Farewell to the Ephesian Elders)',
        coords: { lat: 37.530, lng: 27.278 },
        dateLabel: 'Late Spring AD 57',
        scriptureRef: 'ACTS {20:15}–{20:38}',
        scriptureOsis: 'ACT.20.17',
        note: 'Calling the elders of Ephesus to the port of Miletus, Paul testifies that he has not shunned to declare unto them all the counsel of God and charges them to feed the church of God, which He purchased with His own blood.'
      },
      {
        name: 'Tyre & Caesarea Maritima (House of Philip the Evangelist)',
        coords: { lat: 32.500, lng: 34.890 },
        dateLabel: 'May AD 57',
        scriptureRef: 'ACTS {21:3}–{21:14}',
        scriptureOsis: 'ACT.21.8',
        note: 'Sailing past Cyprus to Tyre and Ptolemais, Paul and Luke stay in Caesarea with Philip the Evangelist; prophet Agabus binds his own hands with Paul\'s girdle, foretelling Paul\'s arrest in Jerusalem, and Paul replies, "I am ready not to be bound only, but also to die at Jerusalem for the name of the Lord Jesus."'
      },
      {
        name: 'Jerusalem (Arrest in the Temple & Witness Before Kings)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'Pentecost, May AD 57',
        scriptureRef: 'ACTS {21:15}–{23:30}',
        scriptureOsis: 'ACT.21.17',
        note: 'After presenting the Gentile relief offering to James and the elders, Paul is seized by a mob in the Temple, rescued by Roman tribune Claudius Lysias, and comforted by the risen Lord by night: "Be of good cheer, Paul: for as thou hast testified of me in Jerusalem, so must thou bear witness also at Rome."'
      }
    ]
  },
  {
    id: 'paul-voyage-rome',
    name: "Paul's Voyage & Shipwreck to Rome",
    shortBanner: "⚓ PAUL'S VOYAGE TO ROME (AD 59–62)",
    travelerName: 'Apostle Paul (with Luke & Aristarchus under Centurion Julius)',
    figureId: 'paul',
    color: '#e879f9', // Bright Orchid-Magenta
    dateRange: 'AD 59 – 62',
    scriptureRef: 'ACTS {23:31}–{28:31}',
    scriptureOsis: 'ACT.27.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'After two years imprisoned at Caesarea testifying before Felix, Festus, and King Agrippa II, Paul appeals to Caesar, sails across the stormy Mediterranean, survives the Euroclydon shipwreck on Malta with all 276 souls spared, and preaches the Kingdom of God in Rome.',
    stops: [
      {
        name: 'Caesarea Maritima (Appeal to Caesar & Embarkation)',
        coords: { lat: 32.500, lng: 34.890 },
        dateLabel: 'AD 57 – Late Summer AD 59',
        scriptureRef: 'ACTS {24:1}–{27:2}',
        scriptureOsis: 'ACT.27.1',
        note: 'Held two years at Herod\'s Praetorium in Caesarea under Governors Felix and Festus, Paul testifies before King Agrippa II ("Almost thou persuadest me to be a Christian") and embarks with Luke and Aristarchus under Centurion Julius of the Augustus Cohort.'
      },
      {
        name: 'Sidon & Myra in Lycia',
        coords: { lat: 36.259, lng: 29.985 },
        dateLabel: 'Early Autumn AD 59',
        scriptureRef: 'ACTS {27:3}–{27:6}',
        scriptureOsis: 'ACT.27.5',
        note: 'After touching at Sidon, they sail under the lee of Cyprus to Myra in Lycia, where the centurion transfers the prisoners onto a large Alexandrian grain ship bound for Italy.'
      },
      {
        name: 'Fair Havens, Crete (Paul\'s Warning Ignored)',
        coords: { lat: 34.928, lng: 24.805 },
        dateLabel: 'October AD 59 (After the Fast / Day of Atonement)',
        scriptureRef: 'ACTS {27:7}–{27:20}',
        scriptureOsis: 'ACT.27.8',
        note: 'With the Fast (Yom Kippur) already past and winter navigation dangerous, Paul warns of disaster; when the ship attempts to reach Phoenix, the tempestuous Euroclydon northeaster drives them helplessly across the Mediterranean for 14 days.'
      },
      {
        name: 'Melita / Malta (Shipwreck & Three-Month Winter Miracles)',
        coords: { lat: 35.946, lng: 14.403 },
        dateLabel: 'November AD 59 – February AD 60',
        scriptureRef: 'ACTS {27:21}–{28:10}',
        scriptureOsis: 'ACT.28.1',
        note: 'Just as the angel of God promised Paul ("there shall be no loss of any man\'s life among you"), all 276 souls escape safely to land on Malta (St. Paul\'s Bay). Paul shakes a venomous viper into the fire unharmed and heals the father of chief magistrate Publius.'
      },
      {
        name: 'Syracuse (Sicily), Rhegium & Puteoli (Bay of Naples)',
        coords: { lat: 40.826, lng: 14.122 },
        dateLabel: 'Early Spring AD 60',
        scriptureRef: 'ACTS {28:11}–{28:15}',
        scriptureOsis: 'ACT.28.13',
        note: 'Sailing in the Alexandrian ship Castor and Pollux, Paul lands at Syracuse and Puteoli, then walks up the Appian Way where Roman Christians meet him at the Forum of Appius and Three Taverns—causing Paul to thank God and take courage.'
      },
      {
        name: 'Rome (Two-Year House Custody & Prison Epistles)',
        coords: { lat: 41.902, lng: 12.496 },
        dateLabel: 'Spring AD 60 – Spring AD 62 (2 Full Years)',
        scriptureRef: 'ACTS {28:16}–{28:31}, PHILIPPIANS {1:12}–{1:13}',
        scriptureOsis: 'ACT.28.30',
        note: 'In his own hired house in the imperial capital—chained to Praetorian guards so that his bonds in Christ are manifest in all the palace (Philippians 1:13)—Paul writes Ephesians, Philippians, Colossians, and Philemon, preaching the Kingdom of God and teaching those things which concern the Lord Jesus Christ with all confidence, no man forbidding him.'
      }
    ]
  },
  {
    id: 'thomas-parthia-india',
    name: "Apostle Thomas (Didymus): Jerusalem, Parthia & India",
    shortBanner: "🌏 THOMAS: PARTHIA & INDIA [SCRIPTURE + PATRISTIC] (AD 33–72)",
    travelerName: 'Apostle Thomas (Called Didymus)',
    figureId: 'peter',
    color: '#2dd4bf', // Vibrant Teal-Turquoise
    dateRange: 'AD 30 – c. AD 72',
    scriptureRef: 'JOHN {11:16}, {14:5}–{14:6}, {20:24}–{20:29}, {21:2}, ACTS {1:13}, {2:9}',
    scriptureOsis: 'JHN.20.28',
    evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    attestationSource: 'Canonical Scripture (John 11:16; 14:5; 20:24–29; Acts 1:13) + Early Patristic & Archaeological Attestation: Origen (c. AD 185–253, quoted in Eusebius Ecclesiastical History 3.1), Ephrem the Syrian (Carmina Nisibena 42, c. AD 363), Gregory of Nazianzus (Orations 33.11, AD 380), Ambrose of Milan, Jerome (Epistle 59 to Marcela, c. AD 395), 1st-century coins & Takht-i-Bahi inscription of King Gondophares (AD 20–46), and Ancient Malabar Syrian Christian Tradition (AD 52).',
    summary: 'DISTINCTION OF EVIDENCE: In canonical Scripture, Thomas fiercely loves Christ ("Let us also go, that we may die with him," John 11:16), prompts "I am the way, the truth, and the life" (John 14:5–6), and makes the climactic confession to the risen Jesus, "My Lord and my God!" (John 20:28). Beyond Acts, unanimous early patristic witnesses (Origen, Ephrem the Syrian, Gregory of Nazianzus, Jerome) and South Indian Malabar tradition record that Thomas carried the Gospel eastward across the Parthian Empire, the Indo-Parthian court of King Gondophares in Taxila, and down the Malabar Coast of India (c. AD 52) until his martyrdom at Mylapore (c. AD 72).',
    stops: [
      {
        name: 'Jerusalem & Galilee [Canonical Scripture]',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'AD 30 – 33 [Canonical Scripture]',
        scriptureRef: 'JOHN {11:16}, {14:5}–{14:6}, {20:24}–{20:29}, {21:2}, ACTS {1:13}',
        scriptureOsis: 'JHN.20.28',
        evidenceClass: 'SCRIPTURE_TEXT',
        note: 'CANONICAL SCRIPTURE: Eight days after the Resurrection in Jerusalem, the risen Christ shows Thomas His pierced hands and side; Thomas answers, "My Lord and my God!" Present by the Sea of Galilee (John 21:2) and in the Upper Room at Pentecost (Acts 1:13), where Jews from Parthia, Media, Elam, and Mesopotamia hear the Gospel (Acts 2:9).'
      },
      {
        name: 'Edessa / Osrhoene (Upper Mesopotamia) [Patristic Tradition]',
        coords: { lat: 37.159, lng: 38.796 },
        dateLabel: 'c. AD 38 – 42 [Patristic Tradition]',
        scriptureRef: 'ACTS {2:9}',
        scriptureOsis: 'ACT.2.9',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Eusebius Ecclesiastical History 1.13, 3.1; Ephrem the Syrian Carmina Nisibena 42',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Early Syriac Christian chronicles and Eusebius record that Thomas organized the eastward Aramaic-speaking mission through Edessa (Urfa) at the gateway to the Parthian Empire.'
      },
      {
        name: 'Ecbatana & Parthian Heartland (Media / Persia) [Patristic Tradition]',
        coords: { lat: 34.798, lng: 48.515 },
        dateLabel: 'c. AD 42 – 45 [Patristic: Origen in Eusebius 3.1]',
        scriptureRef: 'ACTS {2:9}',
        scriptureOsis: 'ACT.2.9',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Origen (c. AD 230), preserved in Eusebius Ecclesiastical History 3.1',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Origen writes in his third volume on Genesis (quoted by Eusebius, Hist. Eccl. 3.1): "When the holy apostles and disciples of our Saviour were dispersed over all the world, Parthia, according to tradition, was allotted to Thomas as his field of labor."'
      },
      {
        name: 'Taxila — Court of Indo-Parthian King Gondophares (NW India / Punjab) [External Attestation]',
        coords: { lat: 33.746, lng: 72.787 },
        dateLabel: 'c. AD 46 – 49 [Patristic + Numismatic Attestation]',
        scriptureRef: 'ESTHER {1:1}, {8:9}',
        scriptureOsis: 'EST.1.1',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Takht-i-Bahi Inscription (dated Year 26 of King Gondophares = AD 46) & 1st-Century Indo-Parthian Coinage',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Early Syriac tradition places Thomas in northwestern India at the court of King "Gudnaphar" (Gondophares) and his brother Gad. For centuries critics doubted whether such a king existed—until 19th-century archaeologists discovered vast quantities of 1st-century coins of King Gondophares (reigned c. AD 20–46+) and the Takht-i-Bahi stone inscription dated AD 46.'
      },
      {
        name: 'Muziris / Cranganore (Kodungallur, Malabar Coast, SW India) [Patristic & Malabar Tradition]',
        coords: { lat: 10.221, lng: 76.197 },
        dateLabel: 'c. AD 52 – 68 [Patristic: Gregory of Nazianzus & Jerome; Malabar Tradition]',
        scriptureRef: 'ESTHER {1:1}, MATTHEW {28:19}',
        scriptureOsis: 'MAT.28.19',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Gregory of Nazianzus (Orations 33.11), Jerome (Epistle 59: "Christ dwelt in India with Thomas"), Ambrose of Milan, and Mar Thoma Malabar Tradition (AD 52)',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Riding the active 1st-century Red Sea–Malabar monsoon trade route into the premier Roman pepper port of Muziris (attested in Pliny the Elder & the Periplus of the Erythraean Sea, c. AD 50), ancient Malabar tradition records that Thomas landed at Muziris (Cranganore) in AD 52 and established the "Ezharapallikal" (Seven and a Half Churches) along the Kerala coast.'
      },
      {
        name: 'Mylapore / Chennai (Coromandel Coast, SE India) [Patristic Martyrdom Tradition]',
        coords: { lat: 13.033, lng: 80.278 },
        dateLabel: 'c. AD 72 [Patristic: Ephrem the Syrian & Gregory of Tours]',
        scriptureRef: 'JOHN {11:16}, {20:28}',
        scriptureOsis: 'JHN.11.16',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Ephrem the Syrian (Madrasha 1–3 & Carmina Nisibena 42, c. AD 363); Marco Polo (AD 1292); Portuguese excavations (AD 1523)',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Crossing to the eastern (Coromandel) coast of India at Mylapore (modern Chennai), tradition records that Thomas suffered martyrdom by a lance at St. Thomas Mount (Chinnamalai) around AD 72, fulfilling his own words in John 11:16 ("Let us also go, that we may die with him"). Ephrem the Syrian (4th century) celebrates the transfer of his relics from India to Edessa.'
      }
    ]
  },
  {
    id: 'andrew-mark-missions',
    name: "Apostle Andrew (Scythia) & John Mark (Alexandria)",
    shortBanner: "🌍 ANDREW (SCYTHIA) & MARK (ALEXANDRIA) [PATRISTIC] (AD 33–68)",
    travelerName: 'Apostle Andrew & Evangelist John Mark',
    figureId: 'peter',
    color: '#818cf8', // Periwinkle Indigo
    dateRange: 'AD 33 – c. AD 68',
    scriptureRef: 'JOHN {1:40}–{1:42}, {12:20}–{12:22}, ACTS {12:12}, {15:39}, COLOSSIANS {3:11}, 1 PETER {5:13}',
    scriptureOsis: 'COL.3.11',
    evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    attestationSource: 'Canonical Scripture (John 1:40; 12:22; Acts 12:12; 15:39; Col 3:11; 1 Pet 5:13) + Early Patristic Attestation: Origen & Eusebius Ecclesiastical History 2.16 (Mark in Alexandria) and 3.1 (Andrew allotted Scythia); Jerome De Viris Illustribus 8.',
    summary: 'DISTINCTION OF EVIDENCE: In Scripture, Andrew (Simon Peter\'s brother) is the first disciple to bring others to Jesus—including Greeks seeking Him at Passover (John 12:20–22)—while John Mark ministers in Jerusalem, Cyprus, and Rome (Acts 12:12; 15:39; 1 Peter 5:13). Early patristic history (Origen and Eusebius) records that Mark founded the churches of Alexandria in Egypt, while Andrew carried the Gospel north around the Black Sea into Scythia (Colossians 3:11) and south into Achaia (Patras).',
    stops: [
      {
        name: 'Jerusalem & Cyprus [Canonical Scripture]',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'AD 30 – 49 [Canonical Scripture]',
        scriptureRef: 'JOHN {1:40}–{1:42}, ACTS {1:13}, {12:12}, {15:39}',
        scriptureOsis: 'ACT.12.12',
        evidenceClass: 'SCRIPTURE_TEXT',
        note: 'CANONICAL SCRIPTURE: Andrew serves among the Twelve in Jerusalem (Acts 1:13); the early Jerusalem church gathers for prayer in the house of Mary the mother of John Mark (Acts 12:12), and Barnabas takes Mark to evangelize Cyprus in AD 49 (Acts 15:39).'
      },
      {
        name: 'Alexandria in Egypt (John Mark) [Patristic: Eusebius 2.16]',
        coords: { lat: 31.200, lng: 29.918 },
        dateLabel: 'c. AD 49 – 68 [Patristic: Eusebius Hist. Eccl. 2.16]',
        scriptureRef: '1 PETER {5:13}, 2 TIMOTHY {4:11}',
        scriptureOsis: '2TI.4.11',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Eusebius Ecclesiastical History 2.16, 2.24; Jerome De Viris Illustribus 8',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Eusebius (Hist. Eccl. 2.16) records: "They say that this Mark was the first that was sent to Egypt, and that he proclaimed the Gospel which he had written, and first established churches in Alexandria." Eusebius names Annianus as succeeded bishop in the eighth year of Nero (AD 62).'
      },
      {
        name: 'Sinope & Chersonesus — Scythia / Black Sea (Andrew) [Patristic: Origen in Eusebius 3.1]',
        coords: { lat: 44.616, lng: 33.493 },
        dateLabel: 'c. AD 50 – 60 [Patristic: Origen in Eusebius 3.1]',
        scriptureRef: 'COLOSSIANS {3:11}',
        scriptureOsis: 'COL.3.11',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Origen (quoted in Eusebius Ecclesiastical History 3.1); Eucherius of Lyon',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Origen (Eusebius 3.1) states that "Scythia was allotted to Andrew." Echoing Paul\'s statement in Colossians 3:11 ("neither Greek nor Jew... Barbarian, Scythian, bond nor free: but Christ is all"), patristic tradition traces Andrew along the Black Sea ports of Sinope and Chersonesus (Crimea).'
      },
      {
        name: 'Byzantium & Patras in Achaia (Andrew) [Patristic Tradition]',
        coords: { lat: 38.246, lng: 21.734 },
        dateLabel: 'c. AD 60 – 65 [Patristic: Jerome & Gregory of Nazianzus]',
        scriptureRef: 'JOHN {1:40}, {12:20}–{12:22}',
        scriptureOsis: 'JHN.12.22',
        evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
        attestationSource: 'Gregory of Nazianzus (Orations 33.11: "Epirus/Achaia to Andrew"), Jerome (Epistle 59)',
        note: 'EXTERNAL HISTORICAL ATTESTATION: Returning south through Thrace, Macedonia, and Greece, 4th-century patristic writers (Gregory of Nazianzus, Jerome) record that Andrew preached in Achaia and suffered martyrdom by crucifixion at Patras on the Gulf of Corinth.'
      }
    ]
  },
  {
    id: 'john-seven-churches-patmos',
    name: "Apostle John: Seven Churches of Asia & Isle of Patmos",
    shortBanner: "📜 JOHN: 7 CHURCHES & PATMOS (AD 68–96)",
    travelerName: 'Apostle John (The Beloved Disciple)',
    figureId: 'peter',
    color: '#facc15', // Revelation Gold
    dateRange: 'c. AD 68 – 96',
    scriptureRef: 'JOHN {19:26}–{19:27}, GALATIANS {2:9}, REVELATION {1:9}–{3:22}',
    scriptureOsis: 'REV.1.9',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'After serving as a pillar of the Jerusalem church alongside Peter and James, the Apostle John shepherds the churches of Roman Asia from Ephesus, is banished to the rocky Aegean island of Patmos for the Word of God and the testimony of Jesus Christ, and sends the Book of Revelation along the imperial postal circuit of the Seven Churches of Asia.',
    stops: [
      {
        name: 'Jerusalem (Pillar of the Mother Church)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'AD 30 – c. 66',
        scriptureRef: 'JOHN {19:26}–{19:27}, ACTS {3:1}, {8:14}, GALATIANS {2:9}',
        scriptureOsis: 'GAL.2.9',
        note: 'Entrusted with the care of Jesus\'s mother Mary at the Cross (John 19:26–27), John ministers with Peter at the Beautiful Gate, in Samaria, and as a pillar at the Jerusalem Council (Galatians 2:9).'
      },
      {
        name: 'Ephesus (First of the Seven Churches)',
        coords: { lat: 37.940, lng: 27.341 },
        dateLabel: 'c. AD 68 – 96',
        scriptureRef: 'REVELATION {1:11}, {2:1}–{2:7}',
        scriptureOsis: 'REV.2.1',
        note: 'Port metropolis of Roman Asia where John resides in his later decades (attested by Irenaeus, pupil of John\'s disciple Polycarp, Against Heresies 3.1.1, 3.3.4). First stop of the Seven Churches circuit: commended for testing false apostles, called to return to her "first love."'
      },
      {
        name: 'Smyrna & Pergamos (Northern Aegean & Caicus Valley)',
        coords: { lat: 39.132, lng: 27.184 },
        dateLabel: 'c. AD 95',
        scriptureRef: 'REVELATION {2:8}–{2:17}',
        scriptureOsis: 'REV.2.8',
        note: 'Smyrna (where John\'s disciple Polycarp later served as bishop) is promised the crown of life ("Be thou faithful unto death"); Pergamos, seat of imperial temple cults ("where Satan\'s seat is"), is commended for holding fast Christ\'s name even in the days of Antipas\'s martyrdom.'
      },
      {
        name: 'Thyatira, Sardis & Philadelphia (Inland Lydian Road)',
        coords: { lat: 38.488, lng: 28.140 },
        dateLabel: 'c. AD 95',
        scriptureRef: 'REVELATION {2:18}–{3:13}',
        scriptureOsis: 'REV.3.7',
        note: 'Following the Roman circular postal road southeast: Thyatira (home of Lydia the seller of purple), Sardis (called to watch and strengthen what remains), and faithful Philadelphia ("I have set before thee an open door, and no man can shut it").'
      },
      {
        name: 'Laodicea (Lycus Valley — near Hierapolis & Colossae)',
        coords: { lat: 37.836, lng: 29.108 },
        scriptureRef: 'REVELATION {3:14}–{3:22}, COLOSSIANS {4:13}–{4:16}',
        scriptureOsis: 'REV.3.14',
        dateLabel: 'c. AD 95',
        note: 'Seventh church on the circuit, famous for its banking wealth, black wool, and Phrygian eye-salve—and its tepid aqueduct waters from hot Hierapolis and cold Colossae—where the risen Lord knocks: "Behold, I stand at the door, and knock."'
      },
      {
        name: 'Isle of Patmos (Aegean Sea)',
        coords: { lat: 37.315, lng: 26.546 },
        dateLabel: 'c. AD 95 – 96 (Late Reign of Domitian)',
        scriptureRef: 'REVELATION {1:9}–{1:19}, {22:20}',
        scriptureOsis: 'REV.1.9',
        note: '"I John, who also am your brother, and companion in tribulation... was in the isle that is called Patmos, for the word of God, and for the testimony of Jesus Christ. I was in the Spirit on the Lord\'s day." Receives the apocalypse of the reigning Lamb and New Jerusalem.'
      }
    ]
  },
  // --- EXPANDED ALL-CHARACTER CANONICAL ROUTES ---
  {
    id: 'job-land-of-uz',
    name: "Job: Patriarchal Trials & Restoration in the Land of Uz",
    shortBanner: "🏜️ JOB: TRIALS & RESTORATION IN UZ (c. 1900 BC)",
    travelerName: "Job of Uz",
    figureId: 'abraham',
    color: '#d97706',
    dateRange: 'c. 2000 – 1800 BC (Patriarchal Age)',
    scriptureRef: 'JOB {1:1}–{42:17}, EZEKIEL {14:14}, JAMES {5:11}',
    scriptureOsis: 'JOB.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Living in the Land of Uz on the Arabian-Edomite border, upright Job endures the catastrophic loss of his ten children and wealth through Sabean and Chaldean raids, disputes with Eliphaz of Teman, Bildad of Shuah, and Zophar of Naamath, and hears the LORD speak out of the whirlwind with double restoration.',
    stops: [
      {
        name: 'Land of Uz (Edom / Northern Arabian Margins)',
        coords: { lat: 30.50, lng: 36.20 },
        dateLabel: 'c. 1900 BC',
        scriptureRef: 'JOB {1:1}–{1:5}, LAMENTATIONS {4:21}',
        scriptureOsis: 'JOB.1.1',
        note: 'Upright and perfect Job fears God and eschews evil in Uz, offering regular burnt offerings for his seven sons and three daughters according to the number of them all.'
      },
      {
        name: 'Southern Desert Border (The Sabean Raid)',
        coords: { lat: 28.50, lng: 37.50 },
        dateLabel: 'Day of Trial, c. 1900 BC',
        scriptureRef: 'JOB {1:14}–{1:15}',
        scriptureOsis: 'JOB.1.15',
        note: 'Sabean desert raiders fall upon Job\'s 500 yoke of oxen and 500 she asses and slay the servants with the edge of the sword; only one escapes to report.'
      },
      {
        name: 'Eastern Desert Border (The Chaldean Incursion)',
        coords: { lat: 31.80, lng: 38.90 },
        dateLabel: 'Day of Trial, c. 1900 BC',
        scriptureRef: 'JOB {1:17}',
        scriptureOsis: 'JOB.1.17',
        note: 'Three bands of Chaldeans carry away Job\'s 3,000 camels and slay the servants; a great wind from the wilderness strikes the four corners of his eldest son\'s house.'
      },
      {
        name: 'Teman (Highlands of Edom — Eliphaz arrives)',
        coords: { lat: 30.70, lng: 35.60 },
        dateLabel: 'Days of Mourning, c. 1900 BC',
        scriptureRef: 'JOB {2:11}, {4:1}',
        scriptureOsis: 'JOB.2.11',
        note: 'Eliphaz the Temanite journeys from the famed Edomite wisdom city of Teman (Jeremiah 49:7) to mourn with and comfort smitten Job.'
      },
      {
        name: 'Shuah & Naamath (Eastern Margins — Bildad & Zophar)',
        coords: { lat: 31.30, lng: 36.60 },
        dateLabel: 'Days of Mourning, c. 1900 BC',
        scriptureRef: 'JOB {2:11}–{2:13}',
        scriptureOsis: 'JOB.2.11',
        note: 'Bildad the Shuhite (descendant of Abraham and Keturah, Genesis 25:2) and Zophar the Naamathite sit seven days and seven nights in silence seeing his grief.'
      },
      {
        name: 'The Ash Heap of Uz (The Whirlwind & Double Blessing)',
        coords: { lat: 30.50, lng: 36.20 },
        dateLabel: 'Restoration, c. 1880 BC',
        scriptureRef: 'JOB {38:1}–{38:4}, {42:10}–{42:17}',
        scriptureOsis: 'JOB.42.10',
        note: 'The LORD answers Job out of the whirlwind: "Where wast thou when I laid the foundations of the earth?" Job repents in dust and ashes; God accepts his prayer for his friends and gives Job twice as much as he had before: 14,000 sheep, 6,000 camels, 1,000 yoke of oxen, 1,000 she asses, and seven sons and three daughters.'
      }
    ]
  },
  {
    id: 'gideon-judges',
    name: "Gideon: Ophrah, the Harod Spring & Route of the 300",
    shortBanner: "⚔️ GIDEON: HAROD SPRING & MIDIAN ROUT (c. 1191 BC)",
    travelerName: "Gideon (Jerubbaal)",
    figureId: 'moses',
    color: '#38bdf8',
    dateRange: 'c. 1191 – 1151 BC (Judges Era)',
    scriptureRef: 'JUDGES {6:1}–{8:35}, HEBREWS {11:32}',
    scriptureOsis: 'JDG.6.11',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Called while threshing wheat by the winepress in Ophrah to hide from Midian, Gideon casts down Baal\'s altar, tests the fleece, reduces his army to 300 men who lap water at the Spring of Harod, routes the Midianite camp at the Hill of Moreh with trumpets and torches in pitchers, and pursues kings Zebah and Zalmunna across the Jordan.',
    stops: [
      {
        name: 'Ophrah of the Abiezrites (Manasseh)',
        coords: { lat: 32.380, lng: 35.250 },
        dateLabel: 'c. 1191 BC',
        scriptureRef: 'JUDGES {6:11}–{6:40}',
        scriptureOsis: 'JDG.6.11',
        note: 'The Angel of the LORD sits under an oak in Ophrah: "The LORD is with thee, thou mighty man of valour." Gideon offers a kid, destroys the altar of Baal, and tests the fleece with dew on dry ground.'
      },
      {
        name: 'Spring / Well of Harod (Base of Mount Gilboa)',
        coords: { lat: 32.548, lng: 35.358 },
        dateLabel: 'Night Before the Battle, c. 1191 BC',
        scriptureRef: 'JUDGES {7:1}–{7:8}',
        scriptureOsis: 'JDG.7.1',
        note: 'From 32,000 men, 22,000 fearful depart; of the remaining 10,000, only the 300 who lap water putting their hand to their mouth are chosen so Israel cannot boast: "Mine own hand hath saved me."'
      },
      {
        name: 'Camp of Midian (Hill of Moreh / Valley of Jezreel)',
        coords: { lat: 32.595, lng: 35.340 },
        dateLabel: 'Midnight Watch, c. 1191 BC',
        scriptureRef: 'JUDGES {7:9}–{7:22}',
        scriptureOsis: 'JDG.7.18',
        note: 'Divided into three companies with trumpets, empty pitchers, and lamps inside, the 300 shout, "The sword of the LORD, and of Gideon!" The LORD sets every man\'s sword against his fellow throughout all the host.'
      },
      {
        name: 'Beth-barah & Fords of the Jordan',
        coords: { lat: 32.180, lng: 35.540 },
        dateLabel: 'Morning of Victory, c. 1191 BC',
        scriptureRef: 'JUDGES {7:24}–{7:25}',
        scriptureOsis: 'JDG.7.24',
        note: 'Men of Ephraim take the waters of the Jordan and slay Midianite princes Oreb ("Raven") at the rock of Oreb and Zeeb ("Wolf") at the winepress of Zeeb.'
      },
      {
        name: 'Succoth & Penuel (Gilead / Jabbok Valley)',
        coords: { lat: 32.190, lng: 35.700 },
        dateLabel: 'Pursuit Beyond Jordan, c. 1191 BC',
        scriptureRef: 'JUDGES {8:4}–{8:9}',
        scriptureOsis: 'JDG.8.4',
        note: 'Faint yet pursuing, Gideon\'s 300 request bread; the princes of Succoth and Penuel mock him, refusing food until Zebah and Zalmunna are taken.'
      },
      {
        name: 'Karkor (Eastern Syrian Desert Border)',
        coords: { lat: 31.600, lng: 36.800 },
        dateLabel: 'Final Rout of Midian, c. 1191 BC',
        scriptureRef: 'JUDGES {8:10}–{8:12}',
        scriptureOsis: 'JDG.8.10',
        note: 'Gideon smites the secure host of 15,000 remaining Midianites at Karkor, captures kings Zebah and Zalmunna, and returns victorious through the ascent of Heres.'
      },
      {
        name: 'Ophrah (Forty Years of Quietness)',
        coords: { lat: 32.380, lng: 35.250 },
        dateLabel: 'c. 1191 – 1151 BC',
        scriptureRef: 'JUDGES {8:22}–{8:32}',
        scriptureOsis: 'JDG.8.23',
        note: 'Israel asks Gideon to rule over them; he refuses: "I will not rule over you, neither shall my son rule over you: the LORD shall rule over you." Dies in a good old age and is buried in Ophrah.'
      }
    ]
  },
  {
    id: 'samson-judges',
    name: "Samson: Zorah, Timnath, Lehi & the Overthrow at Gaza",
    shortBanner: "🦁 SAMSON: TIMNATH, LEHI & GAZA GATES (c. 1085 BC)",
    travelerName: "Samson the Danite Judge",
    figureId: 'moses',
    color: '#ea580c',
    dateRange: 'c. 1095 – 1075 BC',
    scriptureRef: 'JUDGES {13:1}–{16:31}, HEBREWS {11:32}',
    scriptureOsis: 'JDG.13.24',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Dedicated as a Nazarite from the womb, Samson tears a young lion at Timnath, slays 1,000 Philistines with the jawbone of an ass at Ramath-lehi, carries away the bronze gates of Gaza to the hill before Hebron, and brings down Dagon\'s temple in death.',
    stops: [
      {
        name: 'Zorah & Eshtaol (Foothills of Dan)',
        coords: { lat: 31.775, lng: 34.985 },
        dateLabel: 'c. 1095 BC',
        scriptureRef: 'JUDGES {13:1}–{13:25}',
        scriptureOsis: 'JDG.13.2',
        note: 'The Angel of the LORD whose name is Secret ascends in the flame of Manoah\'s altar; Samson is born and the Spirit of the LORD begins to move him at times in the camp of Dan.'
      },
      {
        name: 'Timnath (Vineyards of the Philistines)',
        coords: { lat: 31.780, lng: 34.908 },
        dateLabel: 'c. 1085 BC',
        scriptureRef: 'JUDGES {14:1}–{14:19}',
        scriptureOsis: 'JDG.14.5',
        note: 'The Spirit of the LORD comes mightily upon him; tears a roaring young lion as he would have rent a kid; later propounds the riddle: "Out of the eater came forth meat, and out of the strong came forth sweetness."'
      },
      {
        name: 'Ashkelon (Philistine Coastal Fortress)',
        coords: { lat: 31.668, lng: 34.555 },
        dateLabel: 'c. 1085 BC',
        scriptureRef: 'JUDGES {14:19}',
        scriptureOsis: 'JDG.14.19',
        note: 'Slays thirty Philistines of Ashkelon, takes their spoil, and gives change of garments unto them which expounded the riddle.'
      },
      {
        name: 'Rock of Etam & Ramath-lehi',
        coords: { lat: 31.720, lng: 34.970 },
        dateLabel: 'c. 1080 BC',
        scriptureRef: 'JUDGES {15:8}–{15:19}',
        scriptureOsis: 'JDG.15.15',
        note: 'Bound by 3,000 men of Judah with two new cords, the cords melt like flax from his arms; with a fresh jawbone of an ass he smites 1,000 men; God cleaves a hollow place at Lehi (En-hakkore spring).'
      },
      {
        name: 'Gaza (Gates Carried to Hebron)',
        coords: { lat: 31.500, lng: 34.460 },
        dateLabel: 'c. 1077 BC',
        scriptureRef: 'JUDGES {16:1}–{16:3}',
        scriptureOsis: 'JDG.16.3',
        note: 'Surrounded by enemies at Gaza, Samson arises at midnight, tears up the doors of the gate of the city with the two posts and bar, and carries them ~40 miles uphill toward Hebron.'
      },
      {
        name: 'Valley of Sorek (Delilah)',
        coords: { lat: 31.770, lng: 34.920 },
        dateLabel: 'c. 1075 BC',
        scriptureRef: 'JUDGES {16:4}–{16:21}',
        scriptureOsis: 'JDG.16.4',
        note: 'Enticed by Delilah with Philistine silver, Samson reveals his Nazarite vow; his seven locks are shorn while sleeping; the Philistines gouge out his eyes and bind him with fetters of brass in Gaza.'
      },
      {
        name: 'Gaza: Temple of Dagon (Final Triumph in Death)',
        coords: { lat: 31.500, lng: 34.460 },
        dateLabel: 'c. 1075 BC',
        scriptureRef: 'JUDGES {16:23}–{16:31}',
        scriptureOsis: 'JDG.16.28',
        note: 'Brought to make sport before 3,000 Philistines on the roof, Samson prays: "O Lord GOD, remember me, I pray thee, and strengthen me... only this once." Bowing with all his might between the two middle pillars, the house falls upon the lords and all the people.'
      }
    ]
  },
  {
    id: 'ruth-boaz',
    name: "Ruth: Plains of Moab to Bethlehem's Threshing Floor",
    shortBanner: "🌾 RUTH: MOAB TO BETHLEHEM (c. 1100 BC)",
    travelerName: "Ruth the Moabitess & Naomi",
    figureId: 'moses',
    color: '#ec4899',
    dateRange: 'c. 1120 – 1100 BC',
    scriptureRef: 'RUTH {1:1}–{4:22}, MATTHEW {1:5}',
    scriptureOsis: 'RUT.1.16',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Ruth forsakes the gods of Moab to cling to Naomi ("Thy people shall be my people, and thy God my God"), gleans in the barley fields of Boaz at Bethlehem, is redeemed at the city gate, and gives birth to Obed, grandfather of King David.',
    path: [
      { lat: 31.500, lng: 35.750 }, // Country of Moab
      { lat: 31.750, lng: 35.720 }, // Plains of Moab (King's Highway north)
      { lat: 31.820, lng: 35.650 }, // Opposite Jericho
      { lat: 31.855, lng: 35.520 }, // Jordan River Ford (Bethabara ford)
      { lat: 31.835, lng: 35.340 }, // Ascent of Adummim
      { lat: 31.740, lng: 35.240 }, // Ridge approach south of Jerusalem
      { lat: 31.705, lng: 35.204 }, // Bethlehem-judah
      { lat: 31.708, lng: 35.210 }, // Fields of Boaz
      { lat: 31.709, lng: 35.212 }, // Threshingfloor
      { lat: 31.704, lng: 35.203 }  // Gate of Bethlehem
    ],
    stops: [
      {
        name: 'Country of Moab ("Whither thou goest, I will go")',
        coords: { lat: 31.500, lng: 35.750 },
        dateLabel: 'c. 1110 BC',
        scriptureRef: 'RUTH {1:1}–{1:19}',
        scriptureOsis: 'RUT.1.16',
        note: 'After the deaths of Elimelech, Mahlon, and Chilion, Ruth refuses to turn back: "Intreat me not to leave thee... where thou diest, will I die, and there will I be buried: the LORD do so to me, and more also, if ought but death part thee and me."'
      },
      {
        name: 'Bethlehem-judah (Beginning of Barley Harvest)',
        coords: { lat: 31.705, lng: 35.204 },
        dateLabel: 'Passover / Spring, c. 1105 BC',
        scriptureRef: 'RUTH {1:22}–{2:3}',
        scriptureOsis: 'RUT.1.22',
        note: 'Naomi and Ruth arrive in Bethlehem as all the city is moved; Ruth haply lights on a part of the field belonging unto Boaz, of the kindred of Elimelech.'
      },
      {
        name: 'Fields of Boaz (Gleaning Behind the Reapers)',
        coords: { lat: 31.708, lng: 35.210 },
        dateLabel: 'Spring–Summer, c. 1105 BC',
        scriptureRef: 'RUTH {2:4}–{2:23}',
        scriptureOsis: 'RUT.2.12',
        note: 'Boaz blesses Ruth: "The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust." Ruth gleans until evening and beats out an ephah of barley.'
      },
      {
        name: 'Threshingfloor of Boaz (The Kinsman Redeemer)',
        coords: { lat: 31.709, lng: 35.212 },
        dateLabel: 'End of Wheat Harvest, c. 1105 BC',
        scriptureRef: 'RUTH {3:1}–{3:18}',
        scriptureOsis: 'RUT.3.9',
        note: 'At midnight at the threshingfloor, Ruth asks Boaz: "Spread therefore thy skirt over thine handmaid; for thou art a near kinsman." Boaz promises to perform the part of a kinsman.'
      },
      {
        name: 'Gate of Bethlehem (Redemption & Lineage of David)',
        coords: { lat: 31.704, lng: 35.203 },
        dateLabel: 'c. 1104 BC',
        scriptureRef: 'RUTH {4:1}–{4:22}',
        scriptureOsis: 'RUT.4.17',
        note: 'Before ten elders at the gate, Boaz buys the inheritance and takes Ruth to wife; bears Obed, who begat Jesse, who begat David—directly into the Messianic line of Christ.'
      }
    ]
  },
  {
    id: 'samuel-circuit',
    name: "Samuel: Shiloh, Ebenezer & the Circuit of Israel",
    shortBanner: "📜 SAMUEL: SHILOH & CIRCUIT OF ISRAEL (c. 1050 BC)",
    travelerName: "Prophet Samuel",
    figureId: 'david',
    color: '#8b5cf6',
    dateRange: 'c. 1090 – 1015 BC',
    scriptureRef: '1 SAMUEL {1:1}–{25:1}, ACTS {3:24}, {13:20}',
    scriptureOsis: '1SA.3.19',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Dedicated by Hannah at Shiloh where God calls him as a boy, Samuel establishes the prophetic office, delivers Israel from the Philistines at Ebenezer, judges Israel in an annual circuit of Bethel, Gilgal, and Mizpah from Ramah, and anoints Saul and David.',
    stops: [
      {
        name: 'Ramathaim-zophim / Ramah (Birth to Hannah)',
        coords: { lat: 31.815, lng: 35.210 },
        dateLabel: 'c. 1090 BC',
        scriptureRef: '1 SAMUEL {1:1}–{1:28}',
        scriptureOsis: '1SA.1.20',
        note: 'Born in response to Hannah\'s prayer of tears; she names him Samuel ("Asked of God") and vows to lend him unto the LORD all the days of his life.'
      },
      {
        name: 'Shiloh (Tabernacle: "Speak, LORD; for thy servant heareth")',
        coords: { lat: 32.055, lng: 35.289 },
        dateLabel: 'c. 1078 BC',
        scriptureRef: '1 SAMUEL {3:1}–{3:21}',
        scriptureOsis: '1SA.3.10',
        note: 'While the lamp of God is burning in the Temple of the LORD where the Ark is, God calls Samuel three times; Eli perceives it is the LORD; all Israel from Dan even to Beersheba knows Samuel is established to be a prophet.'
      },
      {
        name: 'Mizpah of Benjamin (The Ebenezer Stone)',
        coords: { lat: 31.835, lng: 35.180 },
        dateLabel: 'c. 1060 BC',
        scriptureRef: '1 SAMUEL {7:5}–{7:12}',
        scriptureOsis: '1SA.7.12',
        note: 'Samuel gathers Israel to fast and pour out water before the LORD; when Philistines attack, God thunders with a great thunder; Samuel sets up a memorial stone between Mizpah and Shen: "Hitherto hath the LORD helped us" (Ebenezer).'
      },
      {
        name: 'Annual Judicial Circuit: Bethel, Gilgal & Mizpah',
        coords: { lat: 31.930, lng: 35.221 },
        dateLabel: 'c. 1060 – 1025 BC',
        scriptureRef: '1 SAMUEL {7:15}–{7:17}',
        scriptureOsis: '1SA.7.16',
        note: 'Samuel judges Israel all the days of his life, going from year to year in circuit to Bethel, Gilgal, and Mizpah, and returning to his house at Ramah where he builds an altar unto the LORD.'
      },
      {
        name: 'Gibeah of Benjamin (Anointing King Saul)',
        coords: { lat: 31.823, lng: 35.230 },
        dateLabel: 'c. 1050 BC',
        scriptureRef: '1 SAMUEL {10:1}–{10:26}',
        scriptureOsis: '1SA.10.1',
        note: 'Pours a vial of oil upon Saul\'s head: "Is it not because the LORD hath anointed thee to be captain over his inheritance?"'
      },
      {
        name: 'Bethlehem (Anointing Young David with Horn of Oil)',
        coords: { lat: 31.705, lng: 35.204 },
        dateLabel: 'c. 1025 BC',
        scriptureRef: '1 SAMUEL {16:1}–{16:13}',
        scriptureOsis: '1SA.16.7',
        note: 'Sent to Jesse\'s house; hearing the famous divine principle: "For the LORD seeth not as man seeth; for man looketh on the outward appearance, but the LORD looketh on the heart." Anoints young David in the midst of his brethren.'
      }
    ]
  },
  {
    id: 'saul-reign',
    name: "King Saul: Gibeah Fortress, Michmash & Mount Gilboa",
    shortBanner: "👑 SAUL: GIBEAH, MICHMASH & GILBOA (c. 1050–1010 BC)",
    travelerName: "King Saul",
    figureId: 'david',
    color: '#9333ea',
    dateRange: 'c. 1050 – 1010 BC',
    scriptureRef: '1 SAMUEL {9:1}–{31:13}, 1 CHRONICLES {10:1}–{10:14}',
    scriptureOsis: '1SA.10.24',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'First king of Israel, reigning from his fortress at Gibeah of Benjamin, Saul relieves Jabesh-gilead and defeats Philistines at Michmash, but disobeys at Gilgal and Amalek, hunts fugitive David in the Judean wilderness, and falls on Mount Gilboa.',
    stops: [
      {
        name: 'Gibeah of Saul (Tell el-Ful Fortress Capital)',
        coords: { lat: 31.823, lng: 35.230 },
        dateLabel: 'c. 1050 – 1010 BC',
        scriptureRef: '1 SAMUEL {10:26}, {15:34}, {22:6}',
        scriptureOsis: '1SA.10.26',
        note: 'Saul\'s fortified royal seat overlooking the central plateau of Benjamin (confirmed archaeologically at Tell el-Ful with 11th-century BC rustic stone fortress towers).'
      },
      {
        name: 'Jabesh-gilead (Relief from Nahash the Ammonite)',
        coords: { lat: 32.400, lng: 35.650 },
        dateLabel: 'c. 1049 BC',
        scriptureRef: '1 SAMUEL {11:1}–{11:11}',
        scriptureOsis: '1SA.11.11',
        note: 'Saul hews a yoke of oxen into pieces and sends them throughout Israel; gathers 330,000 men at Bezek, crosses the Jordan, and routes the Ammonites in the morning watch.'
      },
      {
        name: 'Gilgal (Unlawful Sacrifice & Kingdom Rejected)',
        coords: { lat: 31.855, lng: 35.535 },
        dateLabel: 'c. 1045 BC',
        scriptureRef: '1 SAMUEL {13:8}–{13:14}',
        scriptureOsis: '1SA.13.13',
        note: 'Fearing the scattering people before the Philistine threat, Saul unlawfully offers the burnt offering; Samuel announces: "Thy kingdom shall not continue: the LORD hath sought him a man after his own heart."'
      },
      {
        name: 'Pass of Michmash (Bozez & Seneh Crags)',
        coords: { lat: 31.875, lng: 35.265 },
        dateLabel: 'c. 1042 BC',
        scriptureRef: '1 SAMUEL {14:1}–{14:23}',
        scriptureOsis: '1SA.14.6',
        note: 'Jonathan and his armor-bearer climb the steep gorge between Bozez and Seneh; the earth quakes and Philistines melt away in panic as Saul joins the pursuit.'
      },
      {
        name: 'Endor (The Medium with a Familiar Spirit)',
        coords: { lat: 32.617, lng: 35.382 },
        dateLabel: 'Night Before the Battle of Gilboa, c. 1010 BC',
        scriptureRef: '1 SAMUEL {28:7}–{28:25}',
        scriptureOsis: '1SA.28.7',
        note: 'Terrified by the Philistine army at Shunem and unanswered by the LORD through dreams, Urim, or prophets, Saul disguises himself to consult a medium at Endor; receives prophecy of death.'
      },
      {
        name: 'Mount Gilboa (Death of Saul and Jonathan)',
        coords: { lat: 32.502, lng: 35.419 },
        dateLabel: 'c. 1010 BC',
        scriptureRef: '1 SAMUEL {31:1}–{31:13}, 2 SAMUEL {1:17}–{1:27}',
        scriptureOsis: '1SA.31.4',
        note: 'Sore wounded by Philistine archers, Saul falls upon his own sword; men of Jabesh-gilead courageously march all night to Beth-shan to rescue the bodies of Saul and his sons.'
      }
    ]
  },
  {
    id: 'solomon-glory',
    name: "King Solomon: Temple, Red Sea Fleet & Golden Age",
    shortBanner: "🏛️ SOLOMON: TEMPLE, NAVY & EMPIRE (c. 970–931 BC)",
    travelerName: "King Solomon",
    figureId: 'solomon',
    color: '#b45309',
    dateRange: 'c. 970 – 931 BC',
    scriptureRef: '1 KINGS {1:1}–{11:43}, 2 CHRONICLES {1:1}–{9:31}',
    scriptureOsis: '1KI.3.12',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Blessed with unparalleled divine wisdom, Solomon builds the First Temple on Mount Moriah, establishes an ocean-going fleet with Hiram of Tyre at Ezion-geber on the Red Sea, fortifies royal chariot cities across Israel, and receives the Queen of Sheba.',
    path: [
      { lat: 31.848, lng: 35.185 }, // Gibeon
      { lat: 31.810, lng: 35.210 },
      { lat: 31.778, lng: 35.235 }, // Jerusalem (Mount Moriah)
      { lat: 31.705, lng: 35.204 }, // Bethlehem
      { lat: 31.525, lng: 35.105 }, // Hebron
      { lat: 31.245, lng: 34.790 }, // Beersheba
      { lat: 30.980, lng: 35.280 }, // Ascent of Akrabbim
      { lat: 30.620, lng: 35.320 }, // Arabah copper road (Punon)
      { lat: 30.150, lng: 35.150 }, // Central Arabah
      { lat: 29.800, lng: 35.050 }, // Southern Arabah
      { lat: 29.540, lng: 34.960 }, // Ezion-geber / Elath (Red Sea fleet)
      { lat: 29.800, lng: 35.050 }, // Return via Arabah
      { lat: 30.150, lng: 35.150 },
      { lat: 30.620, lng: 35.320 },
      { lat: 30.980, lng: 35.280 },
      { lat: 31.245, lng: 34.790 }, // Beersheba
      { lat: 31.525, lng: 35.105 }, // Hebron
      { lat: 31.705, lng: 35.204 }, // Bethlehem
      { lat: 31.778, lng: 35.235 }, // Jerusalem
      { lat: 31.860, lng: 34.920 }, // Gezer (Solomonic chariot city)
      { lat: 32.100, lng: 34.950 }, // Aphek / Sharon plain
      { lat: 32.300, lng: 35.020 }, // Via Maris corridor
      { lat: 32.585, lng: 35.184 }, // Megiddo (Solomonic chariot city)
      { lat: 32.560, lng: 35.320 }, // Jezreel Valley
      { lat: 32.502, lng: 35.500 }, // Beth-shan gate to Jordan Valley
      { lat: 32.700, lng: 35.480 }, // Western hills corridor bypassing Sea of Galilee
      { lat: 32.800, lng: 35.480 }, // West of Tiberias & Magdala
      { lat: 32.880, lng: 35.480 }, // West of Capernaum
      { lat: 33.017, lng: 35.568 }, // Hazor (Solomonic fortified chariot city)
      { lat: 33.150, lng: 35.620 }, // Hula Valley
      { lat: 33.250, lng: 35.652 }, // Dan / Caesarea Philippi gateway
      { lat: 33.320, lng: 35.780 }, // Mount Hermon southern pass
      { lat: 33.513, lng: 36.292 }, // Damascus
      { lat: 33.950, lng: 36.950 }, // Syrian caravan route
      { lat: 34.300, lng: 37.600 },
      { lat: 34.560, lng: 38.280 }, // Tadmor in the Wilderness (Palmyra)
      { lat: 34.300, lng: 37.600 }, // Return from Tadmor via Damascus
      { lat: 33.950, lng: 36.950 },
      { lat: 33.513, lng: 36.292 }, // Damascus
      { lat: 33.320, lng: 35.780 },
      { lat: 33.250, lng: 35.652 }, // Dan
      { lat: 33.017, lng: 35.568 }, // Hazor
      { lat: 32.880, lng: 35.480 }, // Western Galilee bypass
      { lat: 32.700, lng: 35.480 },
      { lat: 32.502, lng: 35.500 }, // Beth-shan
      { lat: 32.417, lng: 35.241 }, // Dothan pass
      { lat: 32.214, lng: 35.261 }, // Shechem
      { lat: 31.930, lng: 35.220 }, // Bethel
      { lat: 31.778, lng: 35.235 }  // Jerusalem (Visit of Queen of Sheba)
    ],
    stops: [
      {
        name: 'Gibeon (The Great High Place — Vision for Wisdom)',
        coords: { lat: 31.848, lng: 35.185 },
        dateLabel: 'c. 970 BC',
        scriptureRef: '1 KINGS {3:4}–{3:15}',
        scriptureOsis: '1KI.3.9',
        note: 'Solomon offers 1,000 burnt offerings at Gibeon where Moses\' Tabernacle resides; asks in a dream: "Give therefore thy servant an understanding heart to judge thy people." God gives wisdom, riches, and honor.'
      },
      {
        name: 'Jerusalem: Mount Moriah (First Temple Dedicated)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'Ethanim / Autumn, c. 959 BC',
        scriptureRef: '1 KINGS {6:1}–{8:66}, 2 CHRONICLES {5:1}–{7:3}',
        scriptureOsis: '1KI.8.10',
        note: 'Built in seven years with Phoenician cedar and stone quarried off-site; the priests bring the Ark into the Holy of Holies; the cloud of glory fills the house of the LORD so priests cannot stand to minister.'
      },
      {
        name: 'Ezion-geber / Elath (Red Sea Fleet to Ophir)',
        coords: { lat: 29.540, lng: 34.960 },
        dateLabel: 'c. 950 BC',
        scriptureRef: '1 KINGS {9:26}–{9:28}, {10:22}',
        scriptureOsis: '1KI.9.26',
        note: 'Solomon builds a navy of ships at Ezion-geber beside Eloth on the shore of the Red Sea in the land of Edom; ships of Tarshish sail with Hiram\'s shipmen to Ophir, bringing 420 talents of gold.'
      },
      {
        name: 'Megiddo, Hazor & Gezer (Royal Chariot Gates)',
        coords: { lat: 32.585, lng: 35.184 },
        dateLabel: 'c. 950 – 940 BC',
        scriptureRef: '1 KINGS {9:15}–{9:19}',
        scriptureOsis: '1KI.9.15',
        note: 'Royal administrative and chariot cities fortified with monumental identical six-chambered stone gates and stables (corroborated by 10th-century BC archaeological discoveries at all three sites).'
      },
      {
        name: 'Tadmor in the Wilderness (Palmyra Caravan Link)',
        coords: { lat: 34.560, lng: 38.280 },
        dateLabel: 'c. 940 BC',
        scriptureRef: '1 KINGS {9:18}, 2 CHRONICLES {8:4}',
        scriptureOsis: '1KI.9.18',
        note: 'Solomon builds Tadmor in the Syrian wilderness and store cities in Hamath to secure the desert caravan trade from the Euphrates to the Mediterranean.'
      },
      {
        name: 'Jerusalem (Visit of the Queen of Sheba)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. 935 BC',
        scriptureRef: '1 KINGS {10:1}–{10:13}',
        scriptureOsis: '1KI.10.1',
        note: 'The Queen of Sheba arrives from southern Arabia with a very great train of camels bearing spices, gold, and precious stones; proclaims: "The half was not told me: thy wisdom and prosperity exceedeth the fame which I heard."'
      }
    ]
  },
  {
    id: 'elijah-prophet',
    name: "Prophet Elijah: Tishbe, Cherith, Carmel & Jordan Whirlwind",
    shortBanner: "🔥 ELIJAH: TISHBE, CARMEL & JORDAN WHIRLWIND (c. 865–851 BC)",
    travelerName: "Prophet Elijah the Tishbite",
    figureId: 'hezekiah',
    color: '#f97316',
    dateRange: 'c. 865 – 851 BC',
    scriptureRef: '1 KINGS {17:1}–2 KINGS {2:12}',
    scriptureOsis: '1KI.18.38',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Confronting the Baal apostasy of King Ahab and Jezebel, Elijah announces drought, is fed by ravens at Cherith, raises the widow\'s son at Zarephath, calls down fire on Mount Carmel, hears the still small voice at Mount Horeb, and ascends to heaven in a chariot of fire.',
    path: [
      { lat: 32.390, lng: 35.730 }, // Tishbe in Gilead
      { lat: 32.350, lng: 35.680 }, // Brook Cherith
      { lat: 32.502, lng: 35.500 }, // Beth-shan ford into Jezreel Valley
      { lat: 32.600, lng: 35.250 }, // Jezreel plain
      { lat: 32.648, lng: 35.078 }, // Mount Carmel
      { lat: 32.850, lng: 35.080 }, // Plain of Acre
      { lat: 33.090, lng: 35.100 }, // Ladder of Tyre (coastal pass)
      { lat: 33.270, lng: 35.196 }, // Tyre
      { lat: 33.447, lng: 35.298 }, // Zarephath in Sidon
      { lat: 33.090, lng: 35.100 }, // Return via Phoenician coast
      { lat: 32.648, lng: 35.078 }, // Mount Carmel
      { lat: 31.768, lng: 35.213 }, // South to Beersheba
      { lat: 31.245, lng: 34.790 }, // Beersheba
      { lat: 28.539, lng: 33.975 }, // Mount Horeb / Sinai
      { lat: 31.245, lng: 34.790 }, // Return through Negev
      { lat: 32.550, lng: 35.320 }, // Jezreel & Samaria
      { lat: 31.855, lng: 35.535 }  // Jordan River opposite Jericho (Whirlwind)
    ],
    stops: [
      {
        name: 'Tishbe in Gilead (Confronting King Ahab)',
        coords: { lat: 32.390, lng: 35.730 },
        dateLabel: 'c. 865 BC',
        scriptureRef: '1 KINGS {17:1}',
        scriptureOsis: '1KI.17.1',
        note: 'Elijah the Tishbite declares unto Ahab: "As the LORD God of Israel liveth, before whom I stand, there shall not be dew nor rain these years, but according to my word."'
      },
      {
        name: 'Brook Cherith (East of Jordan)',
        coords: { lat: 32.350, lng: 35.680 },
        dateLabel: 'c. 865 – 863 BC',
        scriptureRef: '1 KINGS {17:2}–{17:7}',
        scriptureOsis: '1KI.17.3',
        note: 'Hiding by the brook; ravens bring him bread and flesh in the morning and evening, and he drinks of the brook until it dries up because there has been no rain.'
      },
      {
        name: 'Zarephath in Sidon (The Widow\'s Barrel & Cruse)',
        coords: { lat: 33.447, lng: 35.298 },
        dateLabel: 'c. 863 – 861 BC',
        scriptureRef: '1 KINGS {17:8}–{17:24}',
        scriptureOsis: '1KI.17.9',
        note: 'In the heart of Phoenician Baal territory, the widow\'s barrel of meal wastes not and the cruse of oil does not fail; Elijah raises her son from death through prayer.'
      },
      {
        name: 'Mount Carmel (Fire from Heaven Consumes the Sacrifice)',
        coords: { lat: 32.648, lng: 35.078 },
        dateLabel: 'c. 860 BC',
        scriptureRef: '1 KINGS {18:17}–{18:40}',
        scriptureOsis: '1KI.18.38',
        note: 'Before 450 prophets of Baal, Elijah prays; fire of the LORD falls and consumes the burnt sacrifice, wood, stones, and dust, and licks up the water in the trench. All Israel cries: "The LORD, he is the God!"'
      },
      {
        name: 'Mount Horeb / Sinai (The Still Small Voice)',
        coords: { lat: 28.539, lng: 33.975 },
        dateLabel: 'c. 860 BC',
        scriptureRef: '1 KINGS {19:8}–{19:18}',
        scriptureOsis: '1KI.19.12',
        note: 'Strengthened for 40 days by angel-baked cake, Elijah comes to the cave at Horeb; the LORD passes by not in the strong wind, earthquake, or fire, but in a still small voice.'
      },
      {
        name: 'Jezreel & Samaria (Naboth\'s Vineyard Rebuked)',
        coords: { lat: 32.550, lng: 35.320 },
        dateLabel: 'c. 853 BC',
        scriptureRef: '1 KINGS {21:17}–{21:29}',
        scriptureOsis: '1KI.21.19',
        note: 'Confronts Ahab after Jezebel has Naboth stoned: "In the place where dogs licked the blood of Naboth shall dogs lick thy blood, even thine."'
      },
      {
        name: 'Jordan River / Jericho Fords (Whirlwind Ascension)',
        coords: { lat: 31.855, lng: 35.535 },
        dateLabel: 'c. 851 BC',
        scriptureRef: '2 KINGS {2:1}–{2:12}',
        scriptureOsis: '2KI.2.11',
        note: 'Smite the Jordan with his mantle and they cross on dry ground; a chariot of fire and horses of fire appear, and Elijah goes up by a whirlwind into heaven.'
      }
    ]
  },
  {
    id: 'elisha-ministry',
    name: "Prophet Elisha: Double Portion, Shunem & Chariots of Fire",
    shortBanner: "💧 ELISHA: DOUBLE PORTION & DOTHAN CHARIOTS (c. 851–798 BC)",
    travelerName: "Prophet Elisha",
    figureId: 'hezekiah',
    color: '#22c55e',
    dateRange: 'c. 851 – 798 BC',
    scriptureRef: '1 KINGS {19:19}–2 KINGS {13:21}',
    scriptureOsis: '2KI.2.9',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Inheriting Elijah\'s mantle with a double portion of his spirit, Elisha heals Jericho\'s bitter waters, raises the Shunammite\'s dead son, heals Naaman the Syrian leper, and reveals the invisible fiery armies of God surrounding Dothan.',
    path: [
      { lat: 32.360, lng: 35.550 }, // Abel-meholah
      { lat: 31.871, lng: 35.444 }, // Jericho
      { lat: 31.930, lng: 35.220 }, // Bethel
      { lat: 32.603, lng: 35.334 }, // Shunem
      { lat: 32.277, lng: 35.190 }, // Samaria
      { lat: 32.417, lng: 35.241 }, // Dothan
      { lat: 32.502, lng: 35.500 }, // Beth-shan pass to Jordan Valley
      { lat: 32.780, lng: 35.490 }, // Western Galilee foothills around Sea of Galilee
      { lat: 32.880, lng: 35.490 }, // Plain of Gennesaret western bypass
      { lat: 33.017, lng: 35.568 }, // Hazor gateway (Great North Road)
      { lat: 33.250, lng: 35.652 }, // Caesarea Philippi pass
      { lat: 33.513, lng: 36.292 }  // Damascus (Hazael & Ben-hadad)
    ],
    stops: [
      {
        name: 'Abel-meholah (Plowing with 12 Yoke of Oxen)',
        coords: { lat: 32.360, lng: 35.550 },
        dateLabel: 'c. 855 BC',
        scriptureRef: '1 KINGS {19:19}–{19:21}',
        scriptureOsis: '1KI.19.19',
        note: 'Elijah passes by and casts his mantle upon Elisha as he plows; Elisha slays a yoke of oxen, boils their flesh with the instruments, feeds the people, and follows Elijah.'
      },
      {
        name: 'Jericho (Healing the Spring Waters with Salt)',
        coords: { lat: 31.871, lng: 35.444 },
        dateLabel: 'c. 851 BC',
        scriptureRef: '2 KINGS {2:19}–{2:22}',
        scriptureOsis: '2KI.2.21',
        note: 'Casts salt from a new cruse into the spring of Jericho: "Thus saith the LORD, I have healed these waters; there shall not be from thence any more death or barren land."'
      },
      {
        name: 'Shunem (Raising the Shunammite\'s Son)',
        coords: { lat: 32.603, lng: 35.334 },
        dateLabel: 'c. 848 BC',
        scriptureRef: '2 KINGS {4:8}–{4:37}',
        scriptureOsis: '2KI.4.35',
        note: 'The notable woman of Shunem builds a little chamber on the wall with bed, table, stool, and candlestick; Elisha stretches himself upon her dead child until he sneezes seven times and opens his eyes.'
      },
      {
        name: 'Samaria (Healing Naaman the Syrian Leper)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. 845 BC',
        scriptureRef: '2 KINGS {5:1}–{5:27}',
        scriptureOsis: '2KI.5.14',
        note: 'Naaman dips seven times in the Jordan and his flesh comes again like the flesh of a little child; confesses: "Now I know that there is no God in all the earth, but in Israel."'
      },
      {
        name: 'Dothan (Horses and Chariots of Fire Round About)',
        coords: { lat: 32.417, lng: 35.241 },
        dateLabel: 'c. 842 BC',
        scriptureRef: '2 KINGS {6:8}–{6:23}',
        scriptureOsis: '2KI.6.17',
        note: 'When the Syrian army compasses Dothan, Elisha prays: "LORD, I pray thee, open his eyes, that he may see." The mountain is full of horses and chariots of fire round about Elisha.'
      },
      {
        name: 'Damascus (Hazael & Ben-hadad Anointings)',
        coords: { lat: 33.513, lng: 36.292 },
        dateLabel: 'c. 841 BC',
        scriptureRef: '2 KINGS {8:7}–{8:15}',
        scriptureOsis: '2KI.8.13',
        note: 'Elisha travels to Damascus; Ben-hadad sends Hazael with 40 camels burden of every good thing; Elisha weeps foreseeing the evil Hazael will do to Israel.'
      }
    ]
  },
  {
    id: 'amos-prophet',
    name: "Prophet Amos: Tekoa Herdsman to Bethel's Royal Altar",
    shortBanner: "🐑 AMOS: TEKOA HERDSMAN TO BETHEL ALTAR (c. 760 BC)",
    travelerName: "Prophet Amos of Tekoa",
    figureId: 'hezekiah',
    color: '#84cc16',
    dateRange: 'c. 760 – 755 BC (Reign of Jeroboam II)',
    scriptureRef: 'AMOS {1:1}–{9:15}, ACTS {7:42}–{7:43}, {15:16}–{15:17}',
    scriptureOsis: 'AMO.7.14',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'A simple herdsman and gatherer of sycomore fruit from Tekoa in Judah, Amos is sent north to the golden calf sanctuary of Bethel, confronts high priest Amaziah, denounces the injustice and luxurious ease of Samaria, and prophesies the raising up of the fallen tabernacle of David.',
    stops: [
      {
        name: 'Tekoa (Wilderness of Judah)',
        coords: { lat: 31.652, lng: 35.215 },
        dateLabel: 'c. 760 BC (Two Years Before the Earthquake)',
        scriptureRef: 'AMOS {1:1}, {7:14}–{7:15}',
        scriptureOsis: 'AMO.1.1',
        note: '"I was no prophet, neither was I a prophet\'s son; but I was an herdman, and a gatherer of sycomore fruit: and the LORD took me as I followed the flock, and the LORD said unto me, Go, prophesy unto my people Israel."'
      },
      {
        name: 'Bethel (Royal Sanctuary of King Jeroboam II)',
        coords: { lat: 31.930, lng: 35.221 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'AMOS {7:10}–{7:17}',
        scriptureOsis: 'AMO.7.10',
        note: 'Amaziah priest of Bethel warns King Jeroboam II: "Amos hath conspired against thee in the midst of the house of Israel." Amos replies with the vision of the plumbline and the desolation of the high places of Isaac.'
      },
      {
        name: 'Samaria (Rebuking the Ivory Palaces & Ease in Zion)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'AMOS {3:15}, {4:1}, {6:1}–{6:6}, {9:11}',
        scriptureOsis: 'AMO.9.11',
        note: 'Denounces those who "lie upon beds of ivory, and stretch themselves upon their couches... but they are not grieved for the affliction of Joseph." Closes with the Messianic promise: "In that day will I raise up the tabernacle of David that is fallen" (cited by James at the Jerusalem Council in Acts 15:16).'
      }
    ]
  },
  {
    id: 'hosea-prophet',
    name: "Prophet Hosea: Unfailing Covenant Love in Samaria",
    shortBanner: "❤️ HOSEA: UNFAILING LOVE IN SAMARIA (c. 755–715 BC)",
    travelerName: "Prophet Hosea",
    figureId: 'hezekiah',
    color: '#e11d48',
    dateRange: 'c. 755 – 715 BC',
    scriptureRef: 'HOSEA {1:1}–{14:9}, MATTHEW {2:15}, ROMANS {9:25}–{9:26}',
    scriptureOsis: 'HOS.1.2',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Prophesying to the northern ten tribes during their final turbulent decades before Assyrian exile, Hosea\'s marriage to Gomer reflects God\'s broken yet relentless covenant love, promising future restoration where "in the place where it was said unto them, Ye are not my people, there it shall be said unto them, Ye are the sons of the living God."',
    stops: [
      {
        name: 'Samaria & Northern Highlands',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. 755 BC',
        scriptureRef: 'HOSEA {1:1}–{3:5}',
        scriptureOsis: 'HOS.1.2',
        note: 'God instructs Hosea to take a wife of whoredoms; redeems unfaithful Gomer for fifteen pieces of silver and an homer and an half of barley as a picture of Israel\'s redemption.'
      },
      {
        name: 'Valley of Jezreel (Prophecy of the Bow Broken)',
        coords: { lat: 32.580, lng: 35.320 },
        dateLabel: 'c. 750 BC',
        scriptureRef: 'HOSEA {1:4}–{1:9}',
        scriptureOsis: 'HOS.1.4',
        note: 'Names his children Jezreel, Lo-ruhamah ("Not Pitied"), and Lo-ammi ("Not My People"), foretelling the end of the dynasty of Jehu.'
      },
      {
        name: 'Mizpah of Gilead & Mount Tabor',
        coords: { lat: 32.686, lng: 35.389 },
        dateLabel: 'c. 735 BC',
        scriptureRef: 'HOSEA {5:1}–{5:2}',
        scriptureOsis: 'HOS.5.1',
        note: 'Rebukes the priests and princes for setting snare traps of idolatry across the high places of Mizpah and Tabor.'
      },
      {
        name: 'Samaria (Final Fall & Sovereign Restoration)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. 722 BC',
        scriptureRef: 'HOSEA {13:14}–{14:9}',
        scriptureOsis: 'HOS.14.4',
        note: 'Foresees Samaria\'s fall to Assyria, yet proclaims God\'s sovereign triumph: "I will ransom them from the power of the grave; I will redeem them from death... I will be as the dew unto Israel: he shall grow as the lily, and cast forth his roots as Lebanon."'
      }
    ]
  },
  {
    id: 'jonah-prophet',
    name: "Prophet Jonah: Joppa, the Deep & the Great City of Nineveh",
    shortBanner: "🐋 JONAH: JOPPA, THE DEEP & NINEVEH (c. 760 BC)",
    travelerName: "Prophet Jonah Son of Amittai",
    figureId: 'hezekiah',
    color: '#0ea5e9',
    dateRange: 'c. 782 – 753 BC (Reign of Jeroboam II)',
    scriptureRef: 'JONAH {1:1}–{4:11}, 2 KINGS {14:25}, MATTHEW {12:39}–{12:41}',
    scriptureOsis: 'JON.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Fleeing from the presence of the LORD from Joppa toward Tarshish, Jonah is cast into the raging Mediterranean, preserved three days and three nights in the great fish, preaches repentance to 120,000 souls in Nineveh, and learns God\'s universal mercy through the withered gourd.',
    stops: [
      {
        name: 'Gath-hepher in Galilee (Zebulun)',
        coords: { lat: 32.741, lng: 35.328 },
        dateLabel: 'c. 765 BC',
        scriptureRef: 'JONAH {1:1}–{1:2}, 2 KINGS {14:25}',
        scriptureOsis: 'JON.1.1',
        note: 'Jonah son of Amittai from Gath-hepher (Galilee) receives the divine commission: "Arise, go to Nineveh, that great city, and cry against it; for their wickedness is come up before me."'
      },
      {
        name: 'Joppa (Mediterranean Port)',
        coords: { lat: 32.054, lng: 34.752 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'JONAH {1:3}',
        scriptureOsis: 'JON.1.3',
        note: 'Jonah goes down to Joppa, pays the fare of a ship going to Tarshish (Spain), and sails to flee from the presence of the LORD.'
      },
      {
        name: 'The Deep (Eastern Mediterranean Sea)',
        coords: { lat: 33.500, lng: 33.000 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'JONAH {1:4}–{2:10}, MATTHEW {12:40}',
        scriptureOsis: 'JON.2.1',
        note: 'A mighty tempest strikes; lots fall upon Jonah; cast into the sea which ceases from raging; swallowed by a prepared great fish; prays from the belly of hell; vomited upon dry land after three days and three nights (the sign of Jonah).'
      },
      {
        name: 'Nineveh (The Great Assyrian Capital)',
        coords: { lat: 36.360, lng: 43.150 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'JONAH {3:1}–{3:10}',
        scriptureOsis: 'JON.3.4',
        note: 'Enters a city of three days\' journey; preaches: "Yet forty days, and Nineveh shall be overthrown!" The king of Nineveh arises from his throne, covers himself with sackcloth, and sits in ashes; all people and cattle fast; God repents of the evil.'
      },
      {
        name: 'East of Nineveh (The Gourd & Vehement East Wind)',
        coords: { lat: 36.380, lng: 43.250 },
        dateLabel: 'c. 760 BC',
        scriptureRef: 'JONAH {4:1}–{4:11}',
        scriptureOsis: 'JON.4.11',
        note: 'Sits in a booth on the east side of the city; God prepares a gourd for shade, then a worm and an east wind; teaches Jonah divine compassion for more than sixscore thousand persons that cannot discern between their right hand and left.'
      }
    ]
  },
  {
    id: 'isaiah-ministry',
    name: "Prophet Isaiah: Temple Vision, Immanuel & Deliverance of Zion",
    shortBanner: "🕊️ ISAIAH: VISION OF HOLY ONE & ZION (c. 740–681 BC)",
    travelerName: "Prophet Isaiah Son of Amoz",
    figureId: 'isaiah',
    color: '#6366f1',
    dateRange: 'c. 740 – 681 BC',
    scriptureRef: 'ISAIAH {1:1}–{66:24}, 2 KINGS {18:1}–{20:21}',
    scriptureOsis: 'ISA.6.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Called in the Temple in the year King Uzziah died seeing the Holy One of Israel high and lifted up, Isaiah announces the virgin birth of Immanuel to King Ahaz, ministers beside King Hezekiah through the Assyrian siege where 185,000 soldiers fall, and pens the supreme prophecies of the Suffering Servant and New Jerusalem.',
    stops: [
      {
        name: 'Jerusalem Temple (The Throne Vision & Holy, Holy, Holy)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. 740 BC (Year King Uzziah Died)',
        scriptureRef: 'ISAIAH {6:1}–{6:13}',
        scriptureOsis: 'ISA.6.1',
        note: 'Sees the Lord sitting upon a throne, high and lifted up, and His train filled the Temple; seraphim cry: "Holy, holy, holy, is the LORD of hosts: the whole earth is full of his glory." Seraph touches his lips with a live coal from the altar.'
      },
      {
        name: 'Conduit of the Upper Pool (Highway of the Fuller\'s Field)',
        coords: { lat: 31.774, lng: 35.230 },
        dateLabel: 'c. 734 BC (Syro-Ephraimite War)',
        scriptureRef: 'ISAIAH {7:1}–{7:16}',
        scriptureOsis: 'ISA.7.14',
        note: 'Meets King Ahaz with son Shear-jashub; delivers the immortal prophecy: "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel."'
      },
      {
        name: 'Royal Palace of Mount Zion (Sennacherib Defeated)',
        coords: { lat: 31.772, lng: 35.234 },
        dateLabel: '701 BC',
        scriptureRef: 'ISAIAH {36:1}–{38:22}',
        scriptureOsis: 'ISA.37.36',
        note: 'Rabshakeh blasphemes outside Jerusalem; Hezekiah spreads the letter before the LORD; Isaiah prophesies Sennacherib shall not shoot an arrow here; the angel of the LORD smites 185,000 Assyrians in one night.'
      },
      {
        name: 'Broad Wall of Jerusalem (The Suffering Servant & New Creation)',
        coords: { lat: 31.775, lng: 35.231 },
        dateLabel: 'c. 690 – 681 BC',
        scriptureRef: 'ISAIAH {40:1}–{40:11}, {53:1}–{53:12}, {65:17}',
        scriptureOsis: 'ISA.53.5',
        note: '"He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed." Prophesies Cyrus by name (44:28) and the new heavens and new earth.'
      }
    ]
  },
  {
    id: 'jeremiah-ministry',
    name: "Prophet Jeremiah: Anathoth, Temple Gate, Cistern & Egypt",
    shortBanner: "📜 JEREMIAH: ANATHOTH, TEMPLE GATE & CISTERN (627–580 BC)",
    travelerName: "Prophet Jeremiah (The Weeping Prophet)",
    figureId: 'jeremiah',
    color: '#a855f7',
    dateRange: '627 – 580 BC',
    scriptureRef: 'JEREMIAH {1:1}–{52:34}',
    scriptureOsis: 'JER.1.5',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Ordained a prophet to the nations before birth, Jeremiah preaches unheeded in the Temple gate, breaks the potter\'s bottle in Hinnom, survives the miry cistern dungeon of Malchiah, witnesses the burning of Jerusalem, and is taken into Egypt.',
    stops: [
      {
        name: 'Anathoth in Benjamin (Priestly Hometown & Call)',
        coords: { lat: 31.815, lng: 35.260 },
        dateLabel: '627 BC (13th Year of Josiah)',
        scriptureRef: 'JEREMIAH {1:1}–{1:19}',
        scriptureOsis: 'JER.1.5',
        note: '"Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations." Sees the almond rod and seething pot facing north.'
      },
      {
        name: 'Jerusalem Temple Gate (The Famous Temple Sermon)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: '609 BC (Beginning of Jehoiakim)',
        scriptureRef: 'JEREMIAH {7:1}–{7:15}, {26:1}–{26:24}',
        scriptureOsis: 'JER.7.4',
        note: 'Stands in the gate of the LORD\'s house: "Trust ye not in lying words, saying, The temple of the LORD, The temple of the LORD... Amend your ways." Arrested by priests and threatened with death.'
      },
      {
        name: 'Valley of the Son of Hinnom (The Broken Earthen Bottle)',
        coords: { lat: 31.768, lng: 35.230 },
        dateLabel: 'c. 605 BC',
        scriptureRef: 'JEREMIAH {19:1}–{19:15}',
        scriptureOsis: 'JER.19.10',
        note: 'Takes ancients of the people and priests to Tophet; breaks the potter\'s bottle: "Even so will I break this people and this city, as one breaketh a potter\'s vessel, that cannot be made whole again."'
      },
      {
        name: 'Dungeon of Malchiah (The Cistern Mire & Ebed-melech)',
        coords: { lat: 31.774, lng: 35.235 },
        dateLabel: '588 BC (During the Final Siege)',
        scriptureRef: 'JEREMIAH {38:1}–{38:13}',
        scriptureOsis: 'JER.38.6',
        note: 'Cast with cords into the miry dungeon of prince Malchiah where there was no water, but mire; Ethiopian eunuch Ebed-melech petitions King Zedekiah and draws him out with old cast clouts and rotten rags.'
      },
      {
        name: 'Mizpah of Benjamin (With Governor Gedaliah)',
        coords: { lat: 31.835, lng: 35.180 },
        dateLabel: '586 BC',
        scriptureRef: 'JEREMIAH {40:1}–{40:6}',
        scriptureOsis: 'JER.40.6',
        note: 'Nebuzar-adan frees Jeremiah at Ramah with victuals and a reward; Jeremiah goes unto Gedaliah at Mizpah and dwells among the remaining remnant.'
      },
      {
        name: 'Tahpanhes in Egypt (Buried Stones at Pharaoh\'s Palace)',
        coords: { lat: 30.860, lng: 32.180 },
        dateLabel: 'c. 582 BC',
        scriptureRef: 'JEREMIAH {43:8}–{43:13}',
        scriptureOsis: 'JER.43.9',
        note: 'Forcibly carried into Egypt by Johanan; hides great stones in the clay of the brickkiln at Pharaoh\'s house in Tahpanhes prophesying Nebuchadnezzar shall spread his royal pavilion over them.'
      }
    ]
  },
  {
    id: 'daniel-exile',
    name: "Daniel: Babylon, the Fiery Furnace, Lions' Den & Susa",
    shortBanner: "🦁 DANIEL: BABYLON, FURNACE, LIONS & SUSA (605–536 BC)",
    travelerName: "Daniel the Prophet (Belteshazzar)",
    figureId: 'daniel',
    color: '#f43f5e',
    dateRange: '605 – 536 BC',
    scriptureRef: 'DANIEL {1:1}–{12:13}, EZEKIEL {14:14}, {28:3}, MATTHEW {24:15}',
    scriptureOsis: 'DAN.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Taken captive from Jerusalem as a royal youth in 605 BC, Daniel serves in the imperial court of Babylon under Nebuchadnezzar, Belshazzar, Darius the Mede, and Cyrus the Persian, survives the den of lions, and receives panoramic apocalypses of world history and the coming everlasting Kingdom of the Son of Man.',
    stops: [
      {
        name: 'Jerusalem (Deportation by Nebuchadnezzar)',
        coords: { lat: 31.768, lng: 35.213 },
        dateLabel: '605 BC (3rd Year of Jehoiakim)',
        scriptureRef: 'DANIEL {1:1}–{1:6}',
        scriptureOsis: 'DAN.1.1',
        note: 'Selected among children of the king\'s seed in whom was no blemish, well favoured, and skilful in all wisdom, to be educated three years in the tongue of the Chaldeans.'
      },
      {
        name: 'Babylon (Palace School & Colossal Statue Dream)',
        coords: { lat: 32.536, lng: 44.421 },
        dateLabel: '603 BC (2nd Year of Nebuchadnezzar)',
        scriptureRef: 'DANIEL {1:8}–{1:21}, {2:1}–{2:49}',
        scriptureOsis: 'DAN.2.31',
        note: 'Purposes in his heart not to defile himself with the king\'s meat; interprets Nebuchadnezzar\'s forgotten dream of the image of gold, silver, brass, iron, and clay, and the Stone cut without hands that fills the whole earth.'
      },
      {
        name: 'Plain of Dura in Babylon (The Burning Fiery Furnace)',
        coords: { lat: 32.420, lng: 44.520 },
        dateLabel: 'c. 594 BC',
        scriptureRef: 'DANIEL {3:1}–{3:30}',
        scriptureOsis: 'DAN.3.25',
        note: 'Shadrach, Meshach, and Abednego refuse to bow to the golden image 60 cubits high; cast into the furnace heated seven times hotter; king sees four men loose, and the form of the fourth is like the Son of God.'
      },
      {
        name: 'Babylon: Banquet Hall (Belshazzar\'s Feast)',
        coords: { lat: 32.536, lng: 44.421 },
        dateLabel: 'Night of 12 October, 539 BC',
        scriptureRef: 'DANIEL {5:1}–{5:31}',
        scriptureOsis: 'DAN.5.25',
        note: 'Drinking wine out of the golden vessels of Solomon\'s Temple; fingers of a man\'s hand write on the plaster: MENE, MENE, TEKEL, UPHARSIN. Daniel reads the judgment; that night Belshazzar is slain and Darius the Median takes the kingdom.'
      },
      {
        name: 'Babylon (The Den of Lions under Darius the Mede)',
        coords: { lat: 32.536, lng: 44.421 },
        dateLabel: 'c. 538 BC',
        scriptureRef: 'DANIEL {6:1}–{6:28}',
        scriptureOsis: 'DAN.6.22',
        note: 'Praying toward Jerusalem three times a day despite royal decree; cast into the lions\' den; God sends His angel and shuts the lions\' mouths because innocency was found in him.'
      },
      {
        name: 'Shushan / Susa (Palace by the River Ulai)',
        coords: { lat: 32.190, lng: 48.243 },
        dateLabel: 'c. 551 BC (3rd Year of Belshazzar)',
        scriptureRef: 'DANIEL {8:1}–{8:27}',
        scriptureOsis: 'DAN.8.2',
        note: 'In vision at Shushan the palace in the province of Elam by the river of Ulai, Daniel sees the Ram (Medo-Persia) and the He-Goat with the notable horn (Alexander the Great of Greece).'
      },
      {
        name: 'River Hiddekel / Tigris (The Final Apocalypse of Weeks)',
        coords: { lat: 32.800, lng: 44.950 },
        dateLabel: 'c. 536 BC (3rd Year of Cyrus)',
        scriptureRef: 'DANIEL {10:1}–{12:13}',
        scriptureOsis: 'DAN.12.2',
        note: 'After a 21-day fast by the great river Hiddekel, sees a man clothed in linen with belt of fine gold of Uphaz; receives the revelation of the Seventy Weeks and the resurrection: "many of them that sleep in the dust of the earth shall awake."'
      }
    ]
  },
  {
    id: 'ezekiel-exile',
    name: "Prophet Ezekiel: Chebar Chariot Throne & Valley of Dry Bones",
    shortBanner: "⚡ EZEKIEL: CHEBAR CHARIOT & DRY BONES (593–571 BC)",
    travelerName: "Prophet Ezekiel Son of Buzi",
    figureId: 'daniel',
    color: '#06b6d4',
    dateRange: '593 – 571 BC',
    scriptureRef: 'EZEKIEL {1:1}–{48:35}',
    scriptureOsis: 'EZK.1.1',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'A priest deported with King Jehoiachin in 597 BC, Ezekiel witnesses the cosmic chariot-throne of God by the River Chebar in Babylonia, enacts the siege of Jerusalem with a tile and iron pan, prophesies life to the dry bones, and diagrams the Millennial Temple.',
    stops: [
      {
        name: 'Jerusalem Temple (Priestly Lineage Before 597 BC Exile)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: '622 – 597 BC',
        scriptureRef: 'EZEKIEL {1:3}',
        scriptureOsis: 'EZK.1.3',
        note: 'Son of Buzi of the priestly line of Zadok in Jerusalem before deportation under Nebuchadnezzar\'s second wave alongside King Jehoiachin.'
      },
      {
        name: 'Tel-abib by the River Chebar (The Chariot Throne Vision)',
        coords: { lat: 32.200, lng: 44.800 },
        dateLabel: '5 Tammuz, 593 BC (5th Year of Jehoiachin\'s Captivity)',
        scriptureRef: 'EZEKIEL {1:1}–{3:27}',
        scriptureOsis: 'EZK.1.1',
        note: 'Among the captives by the grand canal of Chebar; the heavens open; sees a whirlwind from the north, a great cloud and fire infolding, four living creatures with wheels full of eyes, and the likeness of a throne above the firmament.'
      },
      {
        name: 'Valley of Dry Bones (Babylonian Plain)',
        coords: { lat: 32.300, lng: 44.700 },
        dateLabel: 'c. 586 BC',
        scriptureRef: 'EZEKIEL {37:1}–{37:14}',
        scriptureOsis: 'EZK.37.3',
        note: 'Carried out in the Spirit into the midst of the valley full of dry bones; prophesies: "O ye dry bones, hear the word of the LORD." Noise and shaking; sinews and flesh come upon them; breath enters them and they stand upon their feet an exceeding great army.'
      },
      {
        name: 'The Very High Mountain (The Millennial Temple Vision)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: '10 Nisan, 573 BC (25th Year of Captivity)',
        scriptureRef: 'EZEKIEL {40:1}–{48:35}',
        scriptureOsis: 'EZK.48.35',
        note: 'Brought in visions of God to the land of Israel; a man whose appearance was like brass with a measuring reed measures the holy city and temple; water flows from under the threshold eastward into the Dead Sea healing all it touches. City name: The LORD is There (Jehovah-Shammah).'
      }
    ]
  },
  {
    id: 'esther-mordecai',
    name: "Esther & Mordecai: Susa Citadel, King's Gate & Purim",
    shortBanner: "👑 ESTHER & MORDECAI: SUSA CITADEL & PURIM (483–473 BC)",
    travelerName: "Queen Esther & Mordecai the Jew",
    figureId: 'ezra-nehemiah',
    color: '#e879f9',
    dateRange: 'c. 483 – 473 BC (Reign of Ahasuerus / Xerxes I)',
    scriptureRef: 'ESTHER {1:1}–{10:3}',
    scriptureOsis: 'EST.4.14',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Set in the winter capital of Shushan (Susa) of the Persian Empire, orphaned Hadassah (Esther) is crowned Queen, Mordecai uncovers palace treason, Haman plots Jewish extermination, Esther risks her life entering unsummoned, Haman is hanged on his own 50-cubit gallows, and the Feast of Purim is established across 127 provinces.',
    stops: [
      {
        name: 'Susa / Shushan the Palace (House of the Women & Coronation)',
        coords: { lat: 32.190, lng: 48.243 },
        dateLabel: 'Tebeth, 479 BC (7th Year of Ahasuerus)',
        scriptureRef: 'ESTHER {2:1}–{2:18}',
        scriptureOsis: 'EST.2.17',
        note: 'After Queen Vashti is deposed, Esther is preferred above all women; King Ahasuerus sets the royal crown upon her head and makes a great feast to all his princes.'
      },
      {
        name: 'The King\'s Gate at Shushan (Mordecai Sits in the Gate)',
        coords: { lat: 32.191, lng: 48.242 },
        dateLabel: '474 BC',
        scriptureRef: 'ESTHER {2:19}–{3:6}',
        scriptureOsis: 'EST.3.2',
        note: 'Mordecai discovers the assassination plot of Bigthan and Teresh; refuses to bow or revere Haman the Agagite; Haman casts Pur (lots) to destroy all Jews throughout the kingdom on the 13th of Adar.'
      },
      {
        name: 'Inner Court of the Royal Palace ("If I perish, I perish")',
        coords: { lat: 32.190, lng: 48.245 },
        dateLabel: 'Nisan, 474 BC',
        scriptureRef: 'ESTHER {4:1}–{5:8}',
        scriptureOsis: 'EST.4.14',
        note: 'Mordecai\'s message: "Who knoweth whether thou art come to the kingdom for such a time as this?" After a three-day fast with her maidens, Esther stands in the inner court; the king holds out the golden sceptre.'
      },
      {
        name: 'Royal Banquet Hall (Haman\'s Exposure & Hanging)',
        coords: { lat: 32.189, lng: 48.244 },
        dateLabel: 'Nisan, 474 BC',
        scriptureRef: 'ESTHER {7:1}–{7:10}',
        scriptureOsis: 'EST.7.6',
        note: 'At the second banquet of wine, Esther petitions for her people: "The adversary and enemy is this wicked Haman." Harbonah points out the 50-cubit gallows Haman made for Mordecai; they hang Haman thereon.'
      },
      {
        name: 'The Citadel of Shushan (Decree Across 127 Provinces & Purim)',
        coords: { lat: 32.190, lng: 48.243 },
        dateLabel: 'Adar, 473 BC',
        scriptureRef: 'ESTHER {8:1}–{9:32}',
        scriptureOsis: 'EST.9.22',
        note: 'Mordecai receives the royal signet ring; letters sent by posts on mules and young dromedaries grant the Jews permission to defend their lives; Feast of Purim established as days of feasting and joy.'
      }
    ]
  },
  {
    id: 'ezra-journey',
    name: "Ezra the Scribe: Babylon to Jerusalem Temple Assembly",
    shortBanner: "📖 EZRA: AHAVA FAST TO JERUSALEM (458 BC)",
    travelerName: "Ezra the Priest & Scribe",
    figureId: 'ezra-nehemiah',
    color: '#10b981',
    dateRange: '458 BC (7th Year of Artaxerxes I)',
    scriptureRef: 'EZRA {7:1}–{10:44}',
    scriptureOsis: 'EZR.7.10',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'A ready scribe in the Law of Moses whose heart was prepared to seek the Law of the LORD, to do it, and to teach in Israel statutes and judgments, Ezra leads the second return from Babylon, proclaims a fast at the River Ahava without royal troops, and leads a great national spiritual reformation in Jerusalem.',
    stops: [
      {
        name: 'Babylon (Royal Decree of Artaxerxes I)',
        coords: { lat: 32.536, lng: 44.421 },
        dateLabel: '1 Nisan, 458 BC',
        scriptureRef: 'EZRA {7:1}–{7:28}',
        scriptureOsis: 'EZR.7.10',
        note: 'Ezra departs Babylon with a royal firman from Artaxerxes I Longimanus granting free passage, gold and silver from the king\'s treasury, and exemption from toll for temple ministers.'
      },
      {
        name: 'River Ahava (Fasting for Divine Journey Protection)',
        coords: { lat: 33.350, lng: 43.780 },
        dateLabel: '9–12 Nisan, 458 BC',
        scriptureRef: 'EZRA {8:15}–{8:31}',
        scriptureOsis: 'EZR.8.22',
        note: 'Encamping three days by the River of Ahava, Ezra finds no Levites and enlists ministers; proclaims a fast: "For I was ashamed to require of the king a band of soldiers and horsemen to help us against the enemy in the way: because we had spoken unto the king, saying, The hand of our God is upon all them for good that seek him."'
      },
      {
        name: 'Overland Route Along the Euphrates Arc',
        coords: { lat: 35.500, lng: 39.500 },
        dateLabel: 'Nisan – Ab, 458 BC (4 Months)',
        scriptureRef: 'EZRA {8:31}–{8:32}',
        scriptureOsis: 'EZR.8.31',
        note: 'Carrying 650 talents of silver and 100 talents of gold; God\'s hand protects the 1,500 returning families from ambush in the way.'
      },
      {
        name: 'Jerusalem Temple Courts (Weighing Vessels & National Repentance)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: '1 Ab, 458 BC',
        scriptureRef: 'EZRA {8:33}–{10:17}',
        scriptureOsis: 'EZR.9.5',
        note: 'Arrives the first day of the fifth month; sacred vessels weighed in the house of God; hearing of compromise with neighboring idolatries, Ezra plucks off his hair and mantle, falls on his knees, and weeps in the temple court in heavy rain as the congregation repents.'
      }
    ]
  },
  {
    id: 'nehemiah-walls',
    name: "Nehemiah: Susa Palace to the 52-Day Jerusalem Wall Circuit",
    shortBanner: "🧱 NEHEMIAH: SUSA TO 52-DAY JERUSALEM WALL CIRCUIT (445 BC)",
    travelerName: "Nehemiah the Cupbearer & Governor",
    figureId: 'ezra-nehemiah',
    color: '#059669',
    dateRange: '445 – 432 BC (20th Year of Artaxerxes I)',
    scriptureRef: 'NEHEMIAH {1:1}–{13:31}',
    scriptureOsis: 'NEH.2.17',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Serving as cupbearer to King Artaxerxes I in Susa, Nehemiah mourns over Jerusalem\'s broken walls, receives royal letters and cavalry escort, performs a secret night inspection of the ruins, organizes all families to rebuild the ten gates with a trowel in one hand and sword in the other in 52 days, and leads the wall dedication.',
    stops: [
      {
        name: 'Shushan the Palace (Cupbearer to Artaxerxes I)',
        coords: { lat: 32.190, lng: 48.243 },
        dateLabel: 'Chisleu – Nisan, 445 BC (20th Year of Artaxerxes)',
        scriptureRef: 'NEHEMIAH {1:1}–{2:8}',
        scriptureOsis: 'NEH.1.1',
        note: 'Hanani reports: "The wall of Jerusalem also is broken down, and the gates thereof are burned with fire." Nehemiah fasts and prays; serves wine before the king with sad countenance; Artaxerxes sends him as governor.'
      },
      {
        name: 'Euphrates River Crossing (Governors Beyond the River)',
        coords: { lat: 34.000, lng: 44.000 },
        dateLabel: 'Spring, 445 BC',
        scriptureRef: 'NEHEMIAH {2:7}–{2:9}',
        scriptureOsis: 'NEH.2.9',
        note: 'Travels with letters to governors beyond the river and Asaph keeper of the king\'s forest, accompanied by captains of the army and horsemen.'
      },
      {
        name: 'Jerusalem: Secret Night Inspection of Ruined Walls',
        coords: { lat: 31.775, lng: 35.235 },
        dateLabel: 'Third Night in Jerusalem, 445 BC',
        scriptureRef: 'NEHEMIAH {2:11}–{2:16}',
        scriptureOsis: 'NEH.2.13',
        note: 'Rides out by night by the Valley Gate, Dragon Well, and Dung Gate to view the broken walls; at the Fountain Gate and King\'s Pool there was no place for his beast to pass.'
      },
      {
        name: 'Jerusalem: 10 Gates Rebuilding Circuit (52 Days)',
        coords: { lat: 31.777, lng: 35.236 },
        dateLabel: 'Elul, 445 BC (Completed in 52 Days)',
        scriptureRef: 'NEHEMIAH {3:1}–{4:23}, {6:15}',
        scriptureOsis: 'NEH.6.15',
        note: 'High priest Eliashib and all guilds work side-by-side; Sanballat and Tobiah conspire to attack; Nehemiah arms builders: "half of my servants wrought in the work, and the other half held the spears." The wall finished in fifty and two days.'
      },
      {
        name: 'Jerusalem: Water Gate Law Reading & Wall Dedication',
        coords: { lat: 31.776, lng: 35.234 },
        dateLabel: '1 Tisri / Feast of Tabernacles, 445 BC',
        scriptureRef: 'NEHEMIAH {8:1}–{8:18}, {12:27}–{12:43}',
        scriptureOsis: 'NEH.8.1',
        note: 'Ezra reads from dawn to midday on a wooden pulpit at the Water Gate; all the people weep; Nehemiah proclaims: "the joy of the LORD is your strength." Two great companies march in opposite directions atop the new walls and meet with trumpets at the Temple.'
      }
    ]
  },
  {
    id: 'stephen-philip-deacons',
    name: "Stephen & Philip: Jerusalem Deacons, Samaria & Gaza Road",
    shortBanner: "⚡ STEPHEN & PHILIP: JERUSALEM, SAMARIA & GAZA (AD 34–37)",
    travelerName: "Stephen the Protomartyr & Philip the Evangelist",
    figureId: 'peter',
    color: '#f59e0b',
    dateRange: 'c. AD 34 – 37',
    scriptureRef: 'ACTS {6:1}–{8:40}, {21:8}',
    scriptureOsis: 'ACT.6.5',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Chosen among the seven deacons full of faith and the Holy Ghost, Stephen preaches before the Sanhedrin seeing the Son of Man standing at God\'s right hand and is stoned outside Jerusalem, while Philip carries the Gospel to the city of Samaria and baptizes the Ethiopian royal treasurer on the desert road to Gaza.',
    stops: [
      {
        name: 'Jerusalem (Seven Deacons & Stephen\'s Martyrdom)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. AD 34 – 35',
        scriptureRef: 'ACTS {6:1}–{7:60}',
        scriptureOsis: 'ACT.7.55',
        note: 'Stephen\'s face shines as an angel; recounts redemptive history from Abraham to Solomon; cries: "Behold, I see the heavens opened, and the Son of man standing on the right hand of God." Stoned outside the city as Saul guards the clothes.'
      },
      {
        name: 'City of Samaria (Philip Preaches Christ with Signs)',
        coords: { lat: 32.277, lng: 35.190 },
        dateLabel: 'c. AD 35',
        scriptureRef: 'ACTS {8:5}–{8:25}',
        scriptureOsis: 'ACT.8.5',
        note: 'Scattered believers go everywhere preaching; Philip preaches Christ in Samaria with unclean spirits cast out and paralytics healed; great joy in the city; Peter and John come down and impart the Holy Ghost.'
      },
      {
        name: 'Gaza Desert Road (The Ethiopian Royal Treasurer)',
        coords: { lat: 31.450, lng: 34.600 },
        dateLabel: 'c. AD 36',
        scriptureRef: 'ACTS {8:26}–{8:39}',
        scriptureOsis: 'ACT.8.35',
        note: 'Angel tells Philip: "Arise, and go toward the south unto the way that goeth down from Jerusalem unto Gaza, which is desert." Joins the chariot of the treasurer of Queen Candace reading Isaiah 53; preaches unto him Jesus and baptizes him in water.'
      },
      {
        name: 'Azotus (Ashdod) to Caesarea Maritima',
        coords: { lat: 32.500, lng: 34.890 },
        dateLabel: 'c. AD 36 – 57',
        scriptureRef: 'ACTS {8:40}, {21:8}–{21:9}',
        scriptureOsis: 'ACT.8.40',
        note: 'The Spirit catches away Philip; found at Azotus (coastal Ashdod); preaches through all cities till he comes to Caesarea Maritima, where twenty years later his house with four prophesying daughters hosts Paul.'
      }
    ]
  },
  {
    id: 'paul-conversion-early',
    name: "Paul's Conversion & Early Ministry: Tarsus, Damascus & Arabia",
    shortBanner: "⚡ PAUL: TARSUS, DAMASCUS & ARABIA (AD 33–46)",
    travelerName: "Apostle Paul (Saul of Tarsus)",
    figureId: 'paul',
    color: '#ec4899',
    dateRange: 'c. AD 33 – 46',
    scriptureRef: 'ACTS {9:1}–{9:30}, {11:25}–{11:26}, GALATIANS {1:11}–{1:24}',
    scriptureOsis: 'ACT.9.3',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'From his birth in Tarsus and rabbinic training under Gamaliel in Jerusalem to his dramatic conversion by the risen Christ on the road to Damascus, retreat into the Nabataean desert of Arabia, midnight basket escape from Damascus, and return to Antioch with Barnabas.',
    stops: [
      {
        name: 'Tarsus in Cilicia (Birthplace & Roman Citizen)',
        coords: { lat: 36.916, lng: 34.895 },
        dateLabel: 'c. AD 5',
        scriptureRef: 'ACTS {21:39}, {22:3}',
        scriptureOsis: 'ACT.22.3',
        note: '"I am verily a man which am a Jew, born in Tarsus, a city in Cilicia, yet brought up in this city at the feet of Gamaliel, and taught according to the perfect manner of the law of the fathers."'
      },
      {
        name: 'Jerusalem (Sanhedrin & Persecution of the Church)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. AD 33 – 34',
        scriptureRef: 'ACTS {8:1}–{8:3}, {9:1}–{9:2}',
        scriptureOsis: 'ACT.9.1',
        note: 'Consenting unto Stephen\'s death; breathing out threatenings and slaughter against the disciples; goes unto the high priest for letters to Damascus to bind any of the Way.'
      },
      {
        name: 'Road to Damascus (The Heavenly Midday Light)',
        coords: { lat: 33.300, lng: 36.100 },
        dateLabel: 'c. AD 34',
        scriptureRef: 'ACTS {9:3}–{9:9}, {26:13}–{26:18}',
        scriptureOsis: 'ACT.9.3',
        note: 'At midday a light from heaven above the brightness of the sun shines round about him; hears a voice: "Saul, Saul, why persecutest thou me?... I am Jesus whom thou persecutest." Blinded, he is led by the hand into Damascus.'
      },
      {
        name: 'Straight Street, Damascus (House of Judas & Ananias)',
        coords: { lat: 33.510, lng: 36.315 },
        dateLabel: 'c. AD 34',
        scriptureRef: 'ACTS {9:10}–{9:22}',
        scriptureOsis: 'ACT.9.11',
        note: 'Ananias sent to the street called Straight; lays hands on Saul: "Brother Saul, the Lord, even Jesus, that appeared unto thee... hath sent me." Scales fall from his eyes; baptized; preaches Christ in the synagogues that He is the Son of God.'
      },
      {
        name: 'Arabia (Nabataean Desert Revelation)',
        coords: { lat: 30.320, lng: 35.480 },
        dateLabel: 'c. AD 34 – 37 (Three Years)',
        scriptureRef: 'GALATIANS {1:15}–{1:18}',
        scriptureOsis: 'GAL.1.17',
        note: '"Immediately I conferred not with flesh and blood: neither went I up to Jerusalem to them which were apostles before me; but I went into Arabia, and returned again unto Damascus." Receives the Gospel directly by revelation of Jesus Christ.'
      },
      {
        name: 'Damascus (Escape in a Basket Over the Wall)',
        coords: { lat: 33.512, lng: 36.310 },
        dateLabel: 'c. AD 37',
        scriptureRef: 'ACTS {9:23}–{9:25}, 2 CORINTHIANS {11:32}–{11:33}',
        scriptureOsis: '2CO.11.32',
        note: 'The governor under King Aretas IV of the Nabataeans keeps the city of the Damascenes with a garrison to apprehend him; disciples take him by night and let him down through the wall in a basket.'
      },
      {
        name: 'Jerusalem & Tarsus (Received by Barnabas)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. AD 37 – 44',
        scriptureRef: 'ACTS {9:26}–{9:30}',
        scriptureOsis: 'ACT.9.27',
        note: 'Disciples at Jerusalem are afraid of him until Barnabas brings him to Peter and James (Galatians 1:18–19); Hellenists attempt to slay him; brethren bring him to Caesarea and send him home to Tarsus.'
      },
      {
        name: 'Syrian Antioch (Barnabas Fetches Saul)',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'c. AD 44 – 46',
        scriptureRef: 'ACTS {11:25}–{11:26}',
        scriptureOsis: 'ACT.11.26',
        note: 'Barnabas departs to Tarsus to seek Saul; brings him to Antioch where for a whole year they assemble with the church and teach much people; disciples are called Christians first in Antioch.'
      }
    ]
  },
  {
    id: 'barnabas-mark',
    name: "Barnabas & Mark: Jerusalem, Syrian Antioch & Cyprus Mission",
    shortBanner: "⛵ BARNABAS & MARK: CYPRUS & ANTIOCH (AD 45–52)",
    travelerName: "Barnabas & John Mark",
    figureId: 'paul',
    color: '#14b8a6',
    dateRange: 'c. AD 45 – 52',
    scriptureRef: 'ACTS {4:36}–{4:37}, {11:22}–{11:26}, {13:1}–{13:13}, {15:36}–{15:39}, 2 TIMOTHY {4:11}',
    scriptureOsis: 'ACT.11.24',
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Joseph Barnabas ("Son of Consolation"), a Levite of Cyprus, sells his land for the early church, brings Saul into the apostolic circle, mentors his nephew John Mark through Antioch and Cyprus, and after a temporary parting, sees Mark fully restored as profitable for Paul\'s ministry.',
    stops: [
      {
        name: 'Jerusalem (Selling Land at the Apostles\' Feet)',
        coords: { lat: 31.778, lng: 35.235 },
        dateLabel: 'c. AD 33',
        scriptureRef: 'ACTS {4:36}–{4:37}',
        scriptureOsis: 'ACT.4.36',
        note: 'Joses, by the apostles surnamed Barnabas (which is, being interpreted, The son of consolation), a Levite of the country of Cyprus, having land, sells it, and brings the money to the apostles.'
      },
      {
        name: 'Syrian Antioch (A Good Man, Full of the Holy Ghost)',
        coords: { lat: 36.202, lng: 36.160 },
        dateLabel: 'c. AD 44',
        scriptureRef: 'ACTS {11:22}–{11:24}',
        scriptureOsis: 'ACT.11.24',
        note: 'Sent from Jerusalem to Antioch; sees the grace of God and is glad; exhorts them all that with purpose of heart they would cleave unto the Lord: "for he was a good man, and full of the Holy Ghost and of faith."'
      },
      {
        name: 'Salamis & Paphos in Cyprus (With John Mark as Minister)',
        coords: { lat: 34.750, lng: 32.420 },
        dateLabel: 'c. AD 46',
        scriptureRef: 'ACTS {13:4}–{13:12}',
        scriptureOsis: 'ACT.13.5',
        note: 'Set apart by the Holy Ghost with Saul; takes young cousin John Mark as their minister; preaches through the synagogues from Salamis to Paphos where Proconsul Sergius Paulus believes.'
      },
      {
        name: 'Perga in Pamphylia (John Mark Departs)',
        coords: { lat: 36.960, lng: 30.550 },
        dateLabel: 'c. AD 47',
        scriptureRef: 'ACTS {13:13}',
        scriptureOsis: 'ACT.13.13',
        note: 'John Mark departs from Paul and Barnabas at Perga and returns to Jerusalem; later the occasion of sharp contention before their second journey.'
      },
      {
        name: 'Second Cyprus Voyage (Barnabas & Mark Return to Cyprus)',
        coords: { lat: 35.150, lng: 33.850 },
        dateLabel: 'c. AD 49 – 52',
        scriptureRef: 'ACTS {15:39}, COLOSSIANS {4:10}, 2 TIMOTHY {4:11}',
        scriptureOsis: 'ACT.15.39',
        note: 'Barnabas insists on giving Mark a second chance, sailing with him to strengthen Cyprus, while Paul chooses Silas. Later completely vindicated when Paul writes from Roman custody: "Take Mark, and bring him with thee: for he is profitable to me for the ministry."'
      }
    ]
  },
];

// World Empires Territories & Centers (Global Ancient World)
export const WORLD_EMPIRES_GEO: WorldEmpireRegion[] = [
  {
    id: 'united_israel',
    name: 'United Kingdom of Israel (Saul, David & Solomon)',
    color: '#d4af37',
    fillColor: 'rgba(212, 175, 55, 0.16)',
    dateRange: 'c. 1050 – 930 BC',
    capital: { name: 'Jerusalem (Zion)', coords: { lat: 31.778, lng: 35.235 } },
    approximateBounds: [
      { lat: 33.090, lng: 35.100 }, // Ladder of Tyre (Phoenician border)
      { lat: 33.110, lng: 35.530 }, // Upper Galilee / Kedesh
      { lat: 33.250, lng: 35.652 }, // Dan (northern boundary of Israel)
      { lat: 33.320, lng: 35.780 }, // Mount Hermon slopes / Aram border
      { lat: 33.000, lng: 35.850 }, // Golan heights / Bashan
      { lat: 32.550, lng: 36.000 }, // Ramoth-gilead (Transjordan frontier)
      { lat: 31.950, lng: 35.950 }, // Ammonite border
      { lat: 31.800, lng: 35.750 }, // Plains of Moab / Medeba plateau
      { lat: 31.468, lng: 35.620 }, // River Arnon canyon
      { lat: 31.020, lng: 35.520 }, // Brook Zered (Edom border)
      { lat: 30.980, lng: 35.280 }, // Ascent of Akrabbim (Scorpion Pass)
      { lat: 31.245, lng: 34.790 }, // Beersheba (southern border: Dan to Beersheba)
      { lat: 31.350, lng: 34.580 }, // Brook of Egypt / Gerar
      { lat: 31.565, lng: 34.849 }, // Lachish
      { lat: 31.700, lng: 34.930 }, // Azekah (Valley of Elah)
      { lat: 31.750, lng: 34.980 }, // Beth-shemesh
      { lat: 31.860, lng: 34.920 }, // Gezer (Solomonic chariot city)
      { lat: 32.050, lng: 34.850 }, // Sharon plain / Joppa border
      { lat: 32.610, lng: 34.920 }, // Dor / Carmel coast
      { lat: 32.830, lng: 34.970 }, // Mount Carmel promontory
      { lat: 32.850, lng: 35.080 }, // Bay of Acre
      { lat: 33.090, lng: 35.100 }  // Back to Ladder of Tyre
    ],
    biblicalIntersection: 'The golden age of unified Israel under King David and King Solomon; First Temple built on Mount Moriah; empire extended from the Euphrates river to the border of Egypt (1 Kings 4:21).',
    factionCategory: 'covenant',
    populationEstimate: '~1,200,000 – 1,500,000',
    approximateArea: '~40,000 km²'
  },
  {
    id: 'judah',
    name: 'Kingdom of Judah (Jerusalem)',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.20)',
    dateRange: 'c. 930 – 586 BC',
    capital: { name: 'Jerusalem', coords: { lat: 31.768, lng: 35.213 } },
    approximateBounds: [
      { lat: 31.850, lng: 35.480 }, // Jordan River crossing east of Jericho
      { lat: 31.835, lng: 35.340 }, // Ascent of Adummim
      { lat: 31.810, lng: 35.260 }, // Anathoth / Mount Scopus
      { lat: 31.785, lng: 35.213 }, // North ridge of Jerusalem / Valley of Hinnom
      { lat: 31.795, lng: 35.170 }, // Nephtoah spring
      { lat: 31.805, lng: 35.105 }, // Kiriath-jearim
      { lat: 31.840, lng: 34.980 }, // Valley of Aijalon / Upper Beth-horon border
      { lat: 31.750, lng: 34.980 }, // Beth-shemesh (Shephelah gate)
      { lat: 31.700, lng: 34.930 }, // Azekah (Valley of Elah)
      { lat: 31.620, lng: 34.880 }, // Moresheth-gath
      { lat: 31.565, lng: 34.849 }, // Tel Lachish
      { lat: 31.520, lng: 34.770 }, // Eglon
      { lat: 31.350, lng: 34.580 }, // Gerar / Brook Besor border
      { lat: 31.245, lng: 34.790 }, // Beersheba (southern border of Israel: Dan to Beersheba)
      { lat: 31.280, lng: 35.120 }, // Tel Arad (Judean fortress temple)
      { lat: 30.980, lng: 35.280 }, // Ascent of Akrabbim (Scorpion Pass, Num 34:4)
      { lat: 31.050, lng: 35.370 }, // Mount Sodom (west of Dead Sea southern basin)
      { lat: 31.180, lng: 35.350 }, // Masada western plateau
      { lat: 31.455, lng: 35.385 }, // Ein Gedi (Dead Sea cliffs & oasis - strictly on land)
      { lat: 31.725, lng: 35.450 }, // Qumran / Ras Feshkha cliffs
      { lat: 31.782, lng: 35.490 }, // Jordan River delta western bank
      { lat: 31.850, lng: 35.480 }  // Back to Jordan crossing
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
    fillColor: 'rgba(34, 197, 94, 0.20)',
    dateRange: 'c. 930 – 722 BC',
    capital: { name: 'Samaria', coords: { lat: 32.277, lng: 35.190 } },
    approximateBounds: [
      { lat: 33.090, lng: 35.100 }, // Ladder of Tyre (Phoenician border)
      { lat: 33.110, lng: 35.530 }, // Kedesh in Galilee
      { lat: 33.260, lng: 35.580 }, // Abel-beth-maachah
      { lat: 33.250, lng: 35.652 }, // Dan (northern sanctuary with golden calf)
      { lat: 33.320, lng: 35.750 }, // Mount Hermon southern slopes
      { lat: 33.100, lng: 35.800 }, // Golan heights / Bashan
      { lat: 32.820, lng: 35.700 }, // East of Sea of Galilee (Gamla / Hippos)
      { lat: 32.700, lng: 35.750 }, // Yarmouk River canyon
      { lat: 32.550, lng: 36.000 }, // Ramoth-gilead (Ahab fallen in battle, 1 Kgs 22)
      { lat: 32.220, lng: 35.750 }, // Mahanaim in Transjordan
      { lat: 32.150, lng: 35.545 }, // Jabbok River confluence with Jordan
      { lat: 31.880, lng: 35.520 }, // Jordan valley opposite Jericho
      { lat: 31.930, lng: 35.220 }, // Bethel (Jeroboam's golden calf sanctuary)
      { lat: 31.850, lng: 35.210 }, // Ramah of Benjamin
      { lat: 31.880, lng: 35.120 }, // Beth-horon the nether
      { lat: 31.840, lng: 34.980 }, // Valley of Aijalon (Judah border)
      { lat: 32.050, lng: 34.850 }, // Sharon plain / Joppa border
      { lat: 32.100, lng: 34.930 }, // Aphek / Antipatris
      { lat: 32.610, lng: 34.920 }, // Dor / Carmel coast
      { lat: 32.830, lng: 34.970 }, // Mount Carmel promontory (Elijah's contest)
      { lat: 32.850, lng: 35.080 }, // Bay of Acre
      { lat: 33.090, lng: 35.100 }  // Back to Ladder of Tyre
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
      { lat: 32.950, lng: 35.080 }, // Plain of Acre southern limit
      { lat: 33.090, lng: 35.105 }, // Ladder of Tyre
      { lat: 33.270, lng: 35.205 }, // Island city of Tyre
      { lat: 33.450, lng: 35.295 }, // Sarepta (Elijah and widow, 1 Kgs 17)
      { lat: 33.560, lng: 35.375 }, // Sidon (great maritime mother city)
      { lat: 33.890, lng: 35.500 }, // Berytus (Beirut)
      { lat: 34.120, lng: 35.650 }, // Byblos (Gebal — Temple stonecutters, 1 Kgs 5:18)
      { lat: 34.250, lng: 35.670 }, // Botrys (Batroun)
      { lat: 34.430, lng: 35.830 }, // Tripolis
      { lat: 34.880, lng: 35.880 }, // Arvad (Arwad island, Gen 10:18, Ezek 27:8)
      { lat: 35.150, lng: 35.910 }, // Northern Phoenician littoral limit
      { lat: 35.100, lng: 36.150 }, // Mount Lebanon crest (cedars of God)
      { lat: 34.400, lng: 36.100 }, // Kadisha gorge / Cedar groves
      { lat: 33.900, lng: 35.850 }, // Central Lebanon ridge
      { lat: 33.400, lng: 35.550 }, // Southern Lebanon range
      { lat: 33.100, lng: 35.300 }, // Galilee mountain border
      { lat: 32.950, lng: 35.080 }  // Back to Acre coast
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
      { lat: 31.820, lng: 35.650 }, // Plains of Moab opposite Jericho
      { lat: 31.820, lng: 35.800 }, // Medeba / Mount Nebo plateau
      { lat: 31.650, lng: 36.150 }, // Jahaz border
      { lat: 31.350, lng: 36.120 }, // Desert margins east of Dibon
      { lat: 31.050, lng: 36.050 }, // Eastern desert fringe (King's Highway)
      { lat: 30.930, lng: 35.820 }, // Upper Zered gorge
      { lat: 30.980, lng: 35.650 }, // Brook Zered canyon (southern border with Edom)
      { lat: 31.020, lng: 35.500 }, // Mouth of Brook Zered
      { lat: 31.180, lng: 35.530 }, // Kir-Hareseth approach (strictly on eastern shore)
      { lat: 31.250, lng: 35.545 }, // Lisan Peninsula eastern bay
      { lat: 31.468, lng: 35.580 }, // Mouth of River Arnon canyon
      { lat: 31.580, lng: 35.620 }, // Fortress ridge of Machaerus
      { lat: 31.610, lng: 35.585 }, // Hot springs of Callirrhoe
      { lat: 31.782, lng: 35.560 }, // Dead Sea northeast shore
      { lat: 31.820, lng: 35.650 }  // Back to Plains of Moab
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
      { lat: 33.300, lng: 35.850 }, // Eastern slopes of Mount Hermon
      { lat: 33.700, lng: 36.050 }, // Anti-Lebanon range / Barada River gorge
      { lat: 34.200, lng: 36.350 }, // Northern Anti-Lebanon
      { lat: 34.560, lng: 36.520 }, // Kadesh on the Orontes
      { lat: 34.600, lng: 36.900 }, // Hamath kingdom border
      { lat: 34.200, lng: 37.300 }, // Syrian steppe / Tadmor (Palmyra) trail
      { lat: 33.600, lng: 37.350 }, // Damascus desert oasis fringe
      { lat: 33.000, lng: 37.000 }, // Trachonitis / Leja volcanic fields
      { lat: 32.700, lng: 36.600 }, // Jebel al-Druze / Bashan border
      { lat: 32.700, lng: 36.100 }, // Hauran border with Israel
      { lat: 33.100, lng: 35.850 }, // Foot of Mount Hermon
      { lat: 33.300, lng: 35.850 }  // Back to Hermon
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
      { lat: 31.280, lng: 34.240 }, // Mediterranean coast south of Raphia
      { lat: 31.500, lng: 34.450 }, // Gaza (royal city of Samson)
      { lat: 31.670, lng: 34.550 }, // Ashkelon (ancient coastal seaport)
      { lat: 31.800, lng: 34.640 }, // Ashdod (temple of Dagon, 1 Sam 5)
      { lat: 32.020, lng: 34.750 }, // Joppa southern boundary
      { lat: 31.850, lng: 34.820 }, // Timnah
      { lat: 31.780, lng: 34.850 }, // Ekron (Tel Miqne — Baal-zebub oracle, 2 Kgs 1)
      { lat: 31.700, lng: 34.850 }, // Gath (Tel es-Safi — Goliath's home)
      { lat: 31.540, lng: 34.780 }, // Shephelah foothills west of Lachish
      { lat: 31.360, lng: 34.600 }, // Gerar basin
      { lat: 31.280, lng: 34.350 }, // Brook Besor mouth
      { lat: 31.280, lng: 34.240 }  // Back to Raphia coast
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
      { lat: 31.020, lng: 35.500 }, // Mouth of Brook Zered (Moab border)
      { lat: 30.980, lng: 35.650 }, // Brook Zered canyon
      { lat: 30.930, lng: 35.820 }, // Upper Zered
      { lat: 30.740, lng: 35.750 }, // Bozrah of Edom (Gen 36:33, Isa 63:1)
      { lat: 30.200, lng: 35.700 }, // Teman / Ma'an (famous for wisdom, Jer 49:7)
      { lat: 29.600, lng: 35.450 }, // Southern Mount Seir range
      { lat: 29.550, lng: 35.000 }, // Head of Gulf of Aqaba (Elath / Aila north shore)
      { lat: 29.550, lng: 34.970 }, // Ezion-geber / Elath (Solomon's port, 1 Kgs 9:26)
      { lat: 29.950, lng: 35.120 }, // Southern Arabah western cliff
      { lat: 30.330, lng: 35.440 }, // Petra / Sela (rose-red rock fortress, Obadiah 1:3)
      { lat: 30.620, lng: 35.380 }, // Punon / Feinan (copper mines of the Arabah)
      { lat: 30.950, lng: 35.350 }, // Arabah plain south of Dead Sea
      { lat: 31.020, lng: 35.500 }  // Back to Brook Zered mouth
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
      { lat: 38.50, lng: 40.00 }, // Taurus Mountains (Armenia/Urartu border)
      { lat: 38.20, lng: 44.50 }, // Lake Urmia basin
      { lat: 36.80, lng: 45.20 }, // Zagros mountain crest
      { lat: 35.00, lng: 46.00 }, // Media border
      { lat: 33.20, lng: 44.50 }, // Northern Babylonian border
      { lat: 34.00, lng: 41.50 }, // Middle Euphrates
      { lat: 35.20, lng: 38.20 }, // Syrian steppe
      { lat: 36.83, lng: 38.01 }, // Carchemish on the Euphrates
      { lat: 37.00, lng: 36.20 }, // Cilicia / Amanus mountains
      { lat: 37.80, lng: 37.50 }, // Commagene
      { lat: 38.50, lng: 40.00 }  // Back to Taurus highlands
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
      { lat: 36.83, lng: 38.01 }, // Carchemish (Nebuchadnezzar defeated Necho, 605 BC)
      { lat: 36.36, lng: 43.15 }, // Conquered Assyrian heartland
      { lat: 34.50, lng: 45.50 }, // Zagros foothills
      { lat: 32.19, lng: 48.25 }, // Susa / Elam border
      { lat: 29.98, lng: 48.55 }, // Persian Gulf / Shatt al-Arab
      { lat: 30.50, lng: 46.50 }, // Ur / Chaldean marshlands
      { lat: 31.50, lng: 43.00 }, // Arabian desert perimeter
      { lat: 33.00, lng: 39.00 }, // Syrian desert transit
      { lat: 34.50, lng: 36.50 }, // Riblah in the land of Hamath (2 Kgs 25:6)
      { lat: 36.00, lng: 37.50 }, // Aleppo corridor
      { lat: 36.83, lng: 38.01 }  // Back to Carchemish
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
      { lat: 35.00, lng: 41.50 }, // Mari and middle Euphrates
      { lat: 35.50, lng: 44.50 }, // Nuzi / Arrapha
      { lat: 33.00, lng: 47.00 }, // Lower Tigris
      { lat: 29.80, lng: 48.50 }, // Head of Persian Gulf
      { lat: 30.50, lng: 46.00 }, // Ur of the Chaldees
      { lat: 32.00, lng: 42.50 }, // Shinar desert margin
      { lat: 35.00, lng: 41.50 }
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
      { lat: 40.50, lng: 45.00 }, // Caucasus / Armenia
      { lat: 40.00, lng: 60.00 }, // Central Asian steppes
      { lat: 32.00, lng: 60.00 }, // Eastern desert plateau
      { lat: 30.00, lng: 52.00 }, // Fars / Persia border
      { lat: 32.50, lng: 45.50 }, // Zagros mountains
      { lat: 38.00, lng: 44.00 }, // Lake Urmia
      { lat: 40.50, lng: 45.00 }
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
      { lat: 41.50, lng: 27.50 }, // Thrace / Hellespont (European bridgehead)
      { lat: 41.80, lng: 41.50 }, // Black Sea south shore / Pontus
      { lat: 41.00, lng: 50.00 }, // Caspian Sea
      { lat: 42.00, lng: 68.00 }, // Sogdiana / Oxus River
      { lat: 34.00, lng: 72.00 }, // Indus River border (Hoddu)
      { lat: 25.00, lng: 67.00 }, // Arabian Sea coast
      { lat: 27.00, lng: 52.00 }, // Persian Gulf north coast
      { lat: 30.00, lng: 48.00 }, // Susa / Elam
      { lat: 31.00, lng: 45.00 }, // Babylonia
      { lat: 33.50, lng: 36.30 }, // Damascus / Syria satrapy
      { lat: 32.85, lng: 35.80 }, // Golan / Bashan (east of Sea of Galilee)
      { lat: 32.55, lng: 35.95 }, // Ramoth-gilead
      { lat: 31.95, lng: 35.93 }, // Rabbah of Ammon (Amman)
      { lat: 31.70, lng: 35.80 }, // Medeba / Moab
      { lat: 31.00, lng: 35.55 }, // Southern desert fringe (south of Dead Sea)
      { lat: 31.25, lng: 34.80 }, // Beersheba / Negev
      { lat: 31.50, lng: 34.50 }, // Gaza / Philistine coast
      { lat: 31.28, lng: 34.25 }, // Rafah
      { lat: 31.13, lng: 33.80 }, // El-Arish
      { lat: 31.05, lng: 32.55 }, // Pelusium
      { lat: 30.12, lng: 31.25 }, // Apex of Nile Delta / Memphis
      { lat: 24.08, lng: 32.90 }, // First Cataract at Aswan (southern Egypt satrapy)
      { lat: 24.10, lng: 32.70 }, // West bank of Aswan
      { lat: 29.85, lng: 31.15 }, // Memphis west bank
      { lat: 31.20, lng: 29.90 }, // Alexandria / Delta west
      { lat: 31.42, lng: 30.40 }, // Rosetta coast
      { lat: 31.40, lng: 31.80 }, // Damietta mouth
      { lat: 31.20, lng: 32.20 }, // Lake Manzala south coast
      { lat: 31.05, lng: 32.55 }, // Pelusium / Sinai corridor
      { lat: 31.13, lng: 33.80 }, // El-Arish
      { lat: 31.28, lng: 34.25 }, // Rafah
      { lat: 31.50, lng: 34.50 }, // Gaza / Philistine coast
      { lat: 32.05, lng: 34.80 }, // Sharon / Joppa
      { lat: 32.80, lng: 35.00 }, // Mount Carmel
      { lat: 33.27, lng: 35.21 }, // Tyre
      { lat: 33.56, lng: 35.38 }, // Sidon
      { lat: 34.43, lng: 35.83 }, // Tripoli
      { lat: 35.50, lng: 35.80 }, // Latakia
      { lat: 35.85, lng: 35.90 }, // Mount Casius
      { lat: 36.12, lng: 35.95 }, // Seleucia Pieria
      { lat: 36.60, lng: 36.15 }, // Alexandretta
      { lat: 36.80, lng: 35.80 }, // Cilicia / Issus
      { lat: 38.50, lng: 27.00 }, // Sardis / Lydia / Ionian coast
      { lat: 41.50, lng: 27.50 }  // Back to Hellespont
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
      { lat: 39.00, lng: 44.00 }, // Armenia border
      { lat: 40.00, lng: 65.00 }, // Central Asian frontier
      { lat: 28.00, lng: 65.00 }, // Indus border
      { lat: 27.00, lng: 51.00 }, // Persian Gulf
      { lat: 30.00, lng: 46.00 }, // Southern Mesopotamia
      { lat: 34.00, lng: 42.00 }, // Euphrates border with Rome
      { lat: 39.00, lng: 44.00 }
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
      { lat: 31.200, lng: 29.900 }, // Alexandria / Canopic coast
      { lat: 31.420, lng: 30.400 }, // Rosetta mouth
      { lat: 31.400, lng: 31.800 }, // Damietta mouth
      { lat: 31.200, lng: 32.200 }, // Lake Manzala south coast
      { lat: 31.050, lng: 32.550 }, // Pelusium (Sin) on Mediterranean shore
      { lat: 30.500, lng: 32.350 }, // Lake Timsah / Bitter Lakes
      { lat: 29.970, lng: 32.500 }, // Suez isthmus
      { lat: 29.800, lng: 32.300 }, // Ain Sokhna coast (west of Suez)
      { lat: 29.500, lng: 32.350 }, // Zafarana coast
      { lat: 28.500, lng: 32.850 }, // Ras Gharib (Egyptian desert coast)
      { lat: 27.250, lng: 33.700 }, // Hurghada / Red Sea west coast
      { lat: 25.720, lng: 32.700 }, // Thebes (Luxor / Karnak)
      { lat: 24.080, lng: 32.900 }, // First Cataract at Aswan / Elephantine (border with Kush)
      { lat: 24.100, lng: 32.700 }, // West bank of First Cataract
      { lat: 26.180, lng: 31.850 }, // Abydos / western desert oases approach
      { lat: 27.180, lng: 31.100 }, // Asyut west bank
      { lat: 29.850, lng: 31.150 }, // Memphis / Saqqara pyramid plateau
      { lat: 30.010, lng: 31.100 }, // Giza pyramid plateau
      { lat: 30.400, lng: 30.300 }, // Wadi Natrun (western desert border)
      { lat: 31.200, lng: 29.900 }  // Back to Alexandria
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
      { lat: 31.200, lng: 29.900 },
      { lat: 31.420, lng: 30.400 },
      { lat: 31.400, lng: 31.800 },
      { lat: 31.200, lng: 32.200 },
      { lat: 31.050, lng: 32.550 },
      { lat: 29.970, lng: 32.500 },
      { lat: 29.800, lng: 32.300 },
      { lat: 29.500, lng: 32.350 },
      { lat: 27.250, lng: 33.700 },
      { lat: 24.080, lng: 32.900 },
      { lat: 24.100, lng: 32.700 },
      { lat: 27.180, lng: 31.100 },
      { lat: 29.850, lng: 31.150 },
      { lat: 30.400, lng: 30.300 },
      { lat: 31.200, lng: 29.900 }
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
      { lat: 32.00, lng: 20.00 }, // Cyrenaica / Libya
      { lat: 31.200, lng: 29.900 }, // Alexandria
      { lat: 31.420, lng: 30.400 }, // Rosetta coast
      { lat: 31.400, lng: 31.800 }, // Damietta mouth
      { lat: 31.200, lng: 32.200 }, // Lake Manzala south coast
      { lat: 31.050, lng: 32.550 }, // Pelusium
      { lat: 29.970, lng: 32.500 }, // Suez isthmus
      { lat: 29.850, lng: 31.250 }, // Memphis
      { lat: 27.180, lng: 31.185 }, // Asyut
      { lat: 25.720, lng: 32.650 }, // Thebes / Luxor
      { lat: 24.080, lng: 32.900 }, // Aswan
      { lat: 24.100, lng: 32.700 }, // Aswan west bank
      { lat: 29.00, lng: 25.00 }, // Siwa oasis
      { lat: 32.00, lng: 20.00 }
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
      { lat: 24.08, lng: 32.90 }, // First Cataract at Aswan
      { lat: 22.00, lng: 36.50 }, // Red Sea coast of Nubia
      { lat: 16.00, lng: 39.00 }, // Eritrean hills
      { lat: 13.50, lng: 37.00 }, // Lake Tana / Ethiopian highlands
      { lat: 12.00, lng: 33.00 }, // Blue Nile
      { lat: 12.50, lng: 29.50 }, // Kordofan
      { lat: 18.00, lng: 28.50 }, // Nubian desert west bank
      { lat: 22.50, lng: 30.50 }, // Second Cataract
      { lat: 24.08, lng: 32.90 }
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
      { lat: 40.50, lng: 106.00 }, { lat: 40.80, lng: 117.50 }, { lat: 38.00, lng: 119.50 },
      { lat: 35.50, lng: 120.00 }, { lat: 30.50, lng: 121.50 }, { lat: 28.00, lng: 113.00 },
      { lat: 29.50, lng: 104.00 }, { lat: 34.50, lng: 104.50 }, { lat: 40.50, lng: 106.00 }
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
      { lat: 40.50, lng: 94.00 }, { lat: 40.00, lng: 100.00 }, { lat: 41.50, lng: 112.00 },
      { lat: 41.50, lng: 123.00 }, { lat: 38.00, lng: 121.00 }, { lat: 32.00, lng: 121.50 },
      { lat: 23.00, lng: 114.00 }, { lat: 22.00, lng: 108.00 }, { lat: 26.00, lng: 102.00 },
      { lat: 31.00, lng: 103.00 }, { lat: 36.50, lng: 98.00 }, { lat: 40.50, lng: 94.00 }
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
      { lat: 46.00, lng: 28.50 }, { lat: 51.50, lng: 31.00 }, { lat: 53.00, lng: 40.00 },
      { lat: 53.50, lng: 52.00 }, { lat: 50.00, lng: 60.00 }, { lat: 46.50, lng: 50.50 },
      { lat: 43.50, lng: 43.00 }, { lat: 44.50, lng: 36.50 }, { lat: 44.40, lng: 33.80 },
      { lat: 46.00, lng: 30.50 }, { lat: 46.00, lng: 28.50 }
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
      { lat: 34.00, lng: 71.50 }, { lat: 31.00, lng: 78.00 }, { lat: 28.00, lng: 85.00 },
      { lat: 24.00, lng: 90.00 }, { lat: 20.00, lng: 86.50 }, { lat: 13.00, lng: 80.50 },
      { lat: 8.50, lng: 77.50 }, { lat: 15.00, lng: 74.00 }, { lat: 23.00, lng: 69.00 },
      { lat: 28.00, lng: 66.00 }, { lat: 34.00, lng: 71.50 }
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
      { lat: 17.50, lng: 42.50 }, { lat: 18.50, lng: 46.50 }, { lat: 17.50, lng: 53.50 },
      { lat: 14.50, lng: 51.00 }, { lat: 12.80, lng: 45.00 }, { lat: 12.80, lng: 43.30 },
      { lat: 15.00, lng: 42.80 }, { lat: 17.50, lng: 42.50 }
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
      { lat: 31.100, lng: 34.800 }, // Negev / Beersheba border
      { lat: 30.600, lng: 35.250 }, // Central Arabah
      { lat: 29.550, lng: 35.000 }, // Head of Gulf of Aqaba (Elath / Aila port)
      { lat: 29.000, lng: 35.020 }, // Midian coast east of Gulf of Aqaba
      { lat: 28.000, lng: 35.200 }, // Red Sea coast of Arabia
      { lat: 26.800, lng: 36.500 }, // Red Sea coast west of Hegra
      { lat: 26.800, lng: 38.000 }, // Hegra / Mada'in Salih
      { lat: 27.600, lng: 38.500 }, // Tayma oasis route
      { lat: 29.500, lng: 38.500 }, // Dumat al-Jandal / desert transit
      { lat: 31.200, lng: 37.000 }, // Eastern desert fringe
      { lat: 31.300, lng: 35.700 }, // Moab border
      { lat: 31.000, lng: 35.550 }, // Arabah plain south of Dead Sea (Zin border)
      { lat: 30.950, lng: 35.300 }, // Southern Arabah foothills
      { lat: 31.100, lng: 34.800 }  // Back to Negev
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
      { lat: 39.50, lng: 26.50 }, // Hellespont / Troas
      { lat: 40.00, lng: 48.00 }, // Caspian Sea
      { lat: 32.00, lng: 48.00 }, // Babylonia / Seleucia on the Tigris
      { lat: 33.20, lng: 36.80 }, // Damascus / Syria
      { lat: 35.50, lng: 35.80 }, // Latakia / Syrian coast
      { lat: 35.85, lng: 35.90 }, // Mount Casius / Ras al-Bassit
      { lat: 36.12, lng: 35.95 }, // Seleucia Pieria / Antioch port
      { lat: 36.60, lng: 36.15 }, // Alexandretta / Iskenderun
      { lat: 36.80, lng: 35.80 }, // Cilicia / Issus
      { lat: 37.87, lng: 32.50 }, // Iconium / Pisidia
      { lat: 38.50, lng: 28.00 }, // Sardis / Lydia
      { lat: 39.50, lng: 26.50 }  // Back to Troas
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
      { lat: 55.00, lng: -2.00 },  // Hadrian's Wall (Britannia northern frontier)
      { lat: 51.50, lng: 1.00 },   // Dover / English Channel
      { lat: 51.00, lng: 6.00 },   // Lower Rhine (Germania Inferior)
      { lat: 49.00, lng: 8.50 },   // Upper Rhine / Agri Decumates
      { lat: 48.00, lng: 16.50 },  // Danube frontier (Vindobona / Vienna)
      { lat: 44.50, lng: 28.50 },  // Moesia / Black Sea mouth of Danube
      { lat: 41.00, lng: 29.00 },  // Byzantium / Bosporus
      { lat: 41.00, lng: 39.50 },  // Pontus / Trapezus
      { lat: 38.00, lng: 40.00 },  // Armenia frontier
      { lat: 34.50, lng: 41.00 },  // Euphrates frontier (Dura-Europos)
      { lat: 33.50, lng: 36.30 },  // Damascus / Syria
      { lat: 30.00, lng: 35.50 },  // Arabia Petraea (Nabataean limes)
      { lat: 28.00, lng: 34.50 },  // Head of Red Sea / Sinai
      { lat: 24.08, lng: 32.90 },  // First Cataract at Aswan (Egypt southern frontier)
      { lat: 30.50, lng: 18.00 },  // Cyrenaica / Sahara desert limes
      { lat: 32.50, lng: 10.00 },  // Africa Proconsularis (Carthage / Tripolitania)
      { lat: 31.50, lng: -3.00 },  // Mauretania Tingitana (Atlas Mountains)
      { lat: 36.00, lng: -5.50 },  // Pillars of Hercules (Strait of Gibraltar)
      { lat: 43.50, lng: -8.00 },  // Finisterre / Hispania Atlantic coast
      { lat: 48.00, lng: -4.50 },  // Brittany (Armorica)
      { lat: 50.50, lng: -4.00 },  // Cornwall (Britannia southwest)
      { lat: 55.00, lng: -2.00 }   // Back to Hadrian's Wall
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
    headline: 'The Call of Abraham · Jacob & Joseph in Egypt',
    historicalSummary: 'God calls Abram out of Ur of the Chaldees, through Haran, into Canaan, and preserves Israel through Jacob and Joseph in Egypt. The Middle Kingdom of Egypt and Old Babylon rule the wider ancient world.',
    activeRouteIds: [
      'gideon-judges',
      'samson-judges',
      'ruth-boaz',
      'samuel-circuit',
      'saul-reign',
      'solomon-glory',
      'elijah-prophet',
      'elisha-ministry',
      'amos-prophet',
      'hosea-prophet',
      'jonah-prophet',
      'isaiah-ministry',
      'jeremiah-ministry',
      'daniel-exile',
      'ezekiel-exile',
      'esther-mordecai',
      'ezra-journey',
      'nehemiah-walls',
      'stephen-philip-deacons',
      'paul-conversion-early',
      'barnabas-mark',
      'job-land-of-uz','abraham-call', 'jacob-joseph-egypt'],
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
    headline: 'The Deliverance from Egypt · Mount Sinai & Conquest of Canaan',
    historicalSummary: "The LORD judges Egypt's gods with 10 plagues, delivers Israel through the Red Sea, gives His Holy Law at Mount Sinai, and brings Israel across the Jordan under Joshua.",
    activeRouteIds: [
      'gideon-judges',
      'samson-judges',
      'ruth-boaz','exodus-route', 'joshua-conquest'],
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
      'united_israel', 'phoenicia', 'philistia', 'egypt', 'kush_nubia', 'kingdom_sheba',
      'china_zhou', 'scythia_steppes'
    ],
    focusCenter: { lat: 31.8, lng: 35.3 },
    focusZoom: 7,
    headline: "The Davidic Kingdom · Solomon's Temple & Jerusalem",
    historicalSummary: "David establishes Jerusalem as the royal capital; Solomon builds the First Temple. Attested by the Tel Dan Stele ('House of David') and visited by the Queen of Sheba.",
    activeRouteIds: [
      'samuel-circuit',
      'saul-reign',
      'solomon-glory','david-exile-throne'],
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
    activeRouteIds: [
      'elijah-prophet',
      'elisha-ministry',
      'amos-prophet',
      'hosea-prophet',
      'jonah-prophet',
      'isaiah-ministry','elijah-elisha-ministry'],
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
    activeRouteIds: [
      'elijah-prophet',
      'elisha-ministry',
      'amos-prophet',
      'jonah-prophet','elijah-elisha-ministry'],
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
    activeRouteIds: [
      'isaiah-ministry',
      'hosea-prophet'
    ],
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
    activeRouteIds: [
      'jeremiah-ministry',
      'daniel-exile',
      'ezekiel-exile','babylonian-deportation-daniel'],
    activeSiteIds: ['nabonidus-cylinder', 'ketef-hinnom-scrolls', 'lachish-ostraca', 'jehoiachin-ration-tablets'],
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
    activeRouteIds: [
      'esther-mordecai',
      'ezra-journey',
      'nehemiah-walls','ezra-nehemiah-return'],
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
    headline: 'The Fullness of Time · John the Baptist & Earthly Life of Jesus Christ',
    historicalSummary: 'In Roman Judea and Galilee, John the Baptist prepares the way at the Jordan and Aenon; Jesus Christ is born in Bethlehem, sheltered in Egypt, raised in Nazareth, ministers across Galilee, Samaria, and Judea, is crucified under Pontius Pilate, rises bodily on the third day, and ascends from Olivet.',
    activeRouteIds: [
      'stephen-philip-deacons',
      'paul-conversion-early',
      'barnabas-mark',
      'john-baptist-ministry',
      'jesus-nativity-youth',
      'jesus-early-ministry',
      'jesus-galilean-ministry',
      'jesus-passion-resurrection'
    ],
    activeSiteIds: ['pilate-stone', 'caiaphas-ossuary', 'pool-of-siloam-steps', 'dead-sea-scrolls-qumran'],
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
    focusCenter: { lat: 36.5, lng: 30.0 },
    focusZoom: 5,
    headline: 'The Gospel to the Nations · Apostles from Rome to Parthia & India',
    historicalSummary: 'From Pentecost in Jerusalem, Peter and Philip carry the Gospel through Samaria, Gaza, and Caesarea to Rome; Paul completes three missionary journeys and his voyage to Rome; John shepherds the Seven Churches and receives Revelation on Patmos; and early patristic history attests Andrew in Scythia, Mark in Alexandria, and Thomas across Parthia to India.',
    activeRouteIds: [
      'stephen-philip-deacons',
      'paul-conversion-early',
      'barnabas-mark',
      'peter-philip-missions',
      'paul-first-journey',
      'paul-second-journey',
      'paul-third-journey',
      'paul-voyage-rome',
      'john-seven-churches-patmos',
      'thomas-parthia-india',
      'andrew-mark-missions'
    ],
    activeSiteIds: ['gallio-inscription', 'erastus-inscription', 'sergius-paulus-inscription', 'arch-of-titus-spoils'],
    activeFigureIds: ['jesus-christ', 'paul', 'peter']
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
    activeRouteIds: [
      'abraham-call',
      'job-land-of-uz',
      'jacob-joseph-egypt',
      'exodus-route',
      'joshua-conquest',
      'gideon-judges',
      'samson-judges',
      'ruth-boaz',
      'samuel-circuit',
      'saul-reign',
      'david-exile-throne',
      'solomon-glory',
      'elijah-prophet',
      'elisha-ministry',
      'amos-prophet',
      'hosea-prophet',
      'jonah-prophet',
      'isaiah-ministry',
      'elijah-elisha-ministry',
      'jeremiah-ministry',
      'daniel-exile',
      'ezekiel-exile',
      'babylonian-deportation-daniel',
      'esther-mordecai',
      'ezra-journey',
      'nehemiah-walls',
      'ezra-nehemiah-return',
      'john-baptist-ministry',
      'jesus-nativity-youth',
      'jesus-early-ministry',
      'jesus-galilean-ministry',
      'jesus-passion-resurrection',
      'stephen-philip-deacons',
      'peter-philip-missions',
      'paul-conversion-early',
      'barnabas-mark',
      'paul-first-journey',
      'paul-second-journey',
      'paul-third-journey',
      'paul-voyage-rome',
      'john-seven-churches-patmos',
      'thomas-parthia-india',
      'andrew-mark-missions'
    ],
    activeSiteIds: [
      'pilate-stone', 'caiaphas-ossuary', 'taylor-prism', 'siloam-inscription',
      'cyrus-cylinder', 'nabonidus-cylinder', 'tel-dan-stele', 'merneptah-stele',
      'gallio-inscription', 'erastus-inscription', 'ketef-hinnom-scrolls', 'mesha-stele',
      'black-obelisk', 'sargon-prism', 'lachish-ostraca', 'jehoiachin-ration-tablets',
      'dead-sea-scrolls-qumran', 'pool-of-siloam-steps', 'sergius-paulus-inscription',
      'arch-of-titus-spoils'
    ],
    activeFigureIds: [
      'jesus-christ', 'daniel', 'hezekiah', 'moses', 'abraham', 'david',
      'isaiah', 'paul', 'peter', 'jeremiah', 'solomon', 'ezra-nehemiah'
    ]
  }
];

export interface GranularTimelineFilter {
  id: string;
  eraIds: string[]; // Which macro-eras display this granular filter button
  categoryLabel: string;
  label: string;
  dateLabel: string;
  routeIds: string[];
  focusCenter: GeoCoordinate;
  focusZoom: number;
  evidenceClass: RouteEvidenceClass;
  summary: string;
}

export const GRANULAR_TIMELINE_FILTERS: GranularTimelineFilter[] = [
  // Patriarchs
  {
    id: 'filter-abraham-call',
    eraIds: ['patriarchs', 'all'],
    categoryLabel: 'Patriarchs',
    label: '🏕️ Abraham: Ur to Canaan & Moriah',
    dateLabel: 'c. 2091–2050 BC',
    routeIds: ['abraham-call'],
    focusCenter: { lat: 33.2, lng: 40.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Abram\'s covenant journey from Ur of the Chaldees through Haran to Shechem, Bethel, Hebron, Egypt, Beersheba, and Mount Moriah.'
  },
  {
    id: 'filter-jacob-joseph',
    eraIds: ['patriarchs', 'all'],
    categoryLabel: 'Patriarchs',
    label: '🌾 Jacob & Joseph: Haran to Goshen',
    dateLabel: 'c. 1929–1876 BC',
    routeIds: ['jacob-joseph-egypt'],
    focusCenter: { lat: 33.0, lng: 35.5 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Jacob\'s return from Padan-Aram via Peniel and Joseph\'s sale from Dothan into Egypt, culminating in Israel\'s descent to Goshen.'
  },
  // Exodus & Conquest
  {
    id: 'filter-moses-exodus',
    eraIds: ['exodus', 'all'],
    categoryLabel: 'Exodus & Conquest',
    label: '🔥 Moses: Exodus & Mount Sinai',
    dateLabel: '1446–1445 BC',
    routeIds: ['exodus-route'],
    focusCenter: { lat: 29.5, lng: 33.1 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Israel\'s departure from Rameses through Succoth, the Red Sea crossing, Marah, Elim, and Rephidim to the giving of the Law at Mount Sinai.'
  },
  {
    id: 'filter-joshua-conquest',
    eraIds: ['exodus', 'all'],
    categoryLabel: 'Exodus & Conquest',
    label: '⚔️ Joshua: Jordan Crossing & Conquest',
    dateLabel: '1406–1399 BC',
    routeIds: ['joshua-conquest'],
    focusCenter: { lat: 32.15, lng: 35.42 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'From Mount Nebo and the parted Jordan River to Gilgal, Jericho, Ai, Gibeon, Hazor, and the Tabernacle at Shiloh.'
  },
  // Monarchy & Prophets
  {
    id: 'filter-david-throne',
    eraIds: ['united_monarchy', 'all'],
    categoryLabel: 'Monarchy',
    label: '👑 David: Bethlehem & Adullam to Zion',
    dateLabel: 'c. 1025–1003 BC',
    routeIds: ['david-exile-throne'],
    focusCenter: { lat: 31.65, lng: 35.20 },
    focusZoom: 9,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'David\'s anointing at Bethlehem, victory in the Valley of Elah, wilderness refuge at Adullam and En-gedi, reign at Hebron, and enthronement in Jerusalem.'
  },
  {
    id: 'filter-elijah-elisha',
    eraIds: ['divided_monarchy_prophets', '2kings_jehu', 'all'],
    categoryLabel: 'Prophets',
    label: '🔥 Elijah & Elisha: Carmel, Horeb & Jordan',
    dateLabel: 'c. 865–841 BC',
    routeIds: ['elijah-elisha-ministry'],
    focusCenter: { lat: 31.6, lng: 35.1 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Elijah\'s prophetic circuit from Brook Cherith and Zarephath to Mount Carmel, Mount Horeb, Samaria (2 Kings 1), and his whirlwind ascension by the Jordan.'
  },
  // Exile & Restoration
  {
    id: 'filter-babylon-daniel',
    eraIds: ['babylonian_exile', 'all'],
    categoryLabel: 'Exile & Return',
    label: '🏛️ Daniel & Ezekiel: Exile to Babylon',
    dateLabel: '605–539 BC',
    routeIds: ['babylonian-deportation-daniel'],
    focusCenter: { lat: 33.8, lng: 40.0 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Deportation waves from Jerusalem and Lachish through Riblah and Carchemish to Ezekiel\'s Tel-abib by the River Chebar and Daniel\'s witness in Babylon.'
  },
  {
    id: 'filter-ezra-nehemiah',
    eraIds: ['persian_restoration', 'all'],
    categoryLabel: 'Exile & Return',
    label: '📜 Zerubbabel, Ezra & Nehemiah Return',
    dateLabel: '538–445 BC',
    routeIds: ['ezra-nehemiah-return'],
    focusCenter: { lat: 33.5, lng: 41.8 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Return of the Jewish exiles from Babylon and Susa (Shushan) across the Euphrates to rebuild the Second Temple and the walls of Jerusalem.'
  },
  // Gospels & Life of Christ (accessible in BOTH Christ & Rome AND Apostolic Age!)
  {
    id: 'filter-john-jesus-parallel',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'John the Baptist & Jesus',
    label: '🌊 John the Baptist + Jesus Parallel',
    dateLabel: 'AD 26–29',
    routeIds: ['john-baptist-ministry', 'jesus-early-ministry'],
    focusCenter: { lat: 32.08, lng: 35.42 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Displays John the Baptist\'s wilderness, Bethabara, Aenon near Salim, and Machaerus imprisonment side-by-side with Jesus\'s baptism, Cana miracle, Judean ministry (John 3:22–24), and Samaritan journey.'
  },
  {
    id: 'filter-john-baptist-only',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'John the Baptist & Jesus',
    label: '🌊 John the Baptist: Wilderness to Machaerus',
    dateLabel: 'c. 6 BC – AD 29',
    routeIds: ['john-baptist-ministry'],
    focusCenter: { lat: 31.95, lng: 35.48 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'John the Baptist\'s birth in the Judean hill country, preaching in the Wilderness of Judea, baptism of Jesus at Bethabara, parallel baptizing at Aenon near Salim, and imprisonment/martyrdom at Machaerus.'
  },
  {
    id: 'filter-jesus-phase-1',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Life of Jesus Christ',
    label: '⭐ Jesus 1: Nativity, Flight to Egypt & Youth',
    dateLabel: 'c. 6 BC – AD 8',
    routeIds: ['jesus-nativity-youth'],
    focusCenter: { lat: 31.65, lng: 33.90 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Annunciation in Nazareth, birth in Bethlehem, Temple presentation, refuge in Egypt from Herod, childhood in Nazareth, and Passover in the Temple at age 12.'
  },
  {
    id: 'filter-jesus-phase-2',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Life of Jesus Christ',
    label: '🕊️ Jesus 2: Baptism, Cana, Judea & Samaria',
    dateLabel: 'AD 26–27',
    routeIds: ['jesus-early-ministry'],
    focusCenter: { lat: 32.25, lng: 35.38 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Baptism at Bethabara, 40 days in the Judean wilderness, water into wine at Cana, First Passover & Nicodemus in Jerusalem, Judean ministry parallel to John at Aenon, and the woman at the well in Sychar.'
  },
  {
    id: 'filter-jesus-phase-3',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Life of Jesus Christ',
    label: '⛵ Jesus 3: Galilean & Northern Ministry',
    dateLabel: 'AD 28–29',
    routeIds: ['jesus-galilean-ministry'],
    focusCenter: { lat: 32.92, lng: 35.50 },
    focusZoom: 9,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Capernaum HQ, Sermon on the Mount, raising the widow\'s son at Nain, calming the storm to Gadara, feeding the 5,000 at Bethsaida, Tyre & Sidon, and Peter\'s confession & Transfiguration at Caesarea Philippi.'
  },
  {
    id: 'filter-jesus-phase-4',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Life of Jesus Christ',
    label: '✝️ Jesus 4: Passion, Resurrection & Ascension',
    dateLabel: 'AD 29–30/33',
    routeIds: ['jesus-passion-resurrection'],
    focusCenter: { lat: 32.15, lng: 35.35 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Perean ministry, raising Lazarus at Bethany, Jericho, crucifixion at Golgotha & bodily resurrection in Jerusalem, Road to Emmaus, Sea of Galilee appearance, and Ascension from the Mount of Olives.'
  },
  {
    id: 'filter-jesus-all-phases',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Life of Jesus Christ',
    label: '👑 Complete Earthly Life of Jesus (All 4 Phases)',
    dateLabel: 'c. 6 BC – AD 33',
    routeIds: [
      'jesus-nativity-youth',
      'jesus-early-ministry',
      'jesus-galilean-ministry',
      'jesus-passion-resurrection'
    ],
    focusCenter: { lat: 32.1, lng: 35.2 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'All 27 chronological stops of Jesus\'s earthly life from Nazareth, Bethlehem, and Egypt through Galilee, Samaria, and Judea to His Resurrection and Ascension.'
  },
  // Apostolic Missions (accessible in Apostolic Age, Christ & Rome, and All)
  {
    id: 'filter-peter-philip',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Twelve Apostles & Evangelists',
    label: '🔥 Peter & Philip: Judea, Samaria, Gaza & Rome',
    dateLabel: 'AD 33–67',
    routeIds: ['peter-philip-missions'],
    focusCenter: { lat: 35.5, lng: 25.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Pentecost in Jerusalem, Philip in Samaria and on the Gaza road with the Ethiopian treasurer, Peter at Lydda, Joppa, Cornelius\'s house in Caesarea, Antioch, and final testimony in Rome.'
  },
  {
    id: 'filter-paul-1',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Apostle Paul',
    label: '⛵ Paul\'s 1st Journey: Cyprus & Galatia',
    dateLabel: 'AD 46–48',
    routeIds: ['paul-first-journey'],
    focusCenter: { lat: 36.8, lng: 33.0 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Paul and Barnabas sail from Syrian Antioch to Cyprus (Paphos / Proconsul Sergius Paulus) and plant churches in Pisidian Antioch, Iconium, Lystra, and Derbe (Acts 13–14).'
  },
  {
    id: 'filter-paul-2',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Apostle Paul',
    label: '⛵ Paul\'s 2nd Journey: Macedonia & Greece',
    dateLabel: 'AD 49–52',
    routeIds: ['paul-second-journey'],
    focusCenter: { lat: 38.0, lng: 28.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Paul, Silas, Timothy, and Luke travel from Antioch through Galatia and Troas into Philippi, Thessalonica, Berea, Athens (Mars\' Hill), Corinth, and Ephesus (Acts 15:36–18:22).'
  },
  {
    id: 'filter-paul-3',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Apostle Paul',
    label: '⛵ Paul\'s 3rd Journey: Ephesus & Corinth',
    dateLabel: 'AD 53–57',
    routeIds: ['paul-third-journey'],
    focusCenter: { lat: 37.8, lng: 28.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Three years in Ephesus (Acts 19), ministry across Macedonia and Corinth (writing 1 & 2 Corinthians and Romans), raising Eutychus at Troas, Miletus farewell, and arrest in Jerusalem (Acts 18:23–21:17).'
  },
  {
    id: 'filter-paul-rome',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Apostle Paul',
    label: '⚓ Paul\'s Voyage & Shipwreck to Rome',
    dateLabel: 'AD 59–62',
    routeIds: ['paul-voyage-rome'],
    focusCenter: { lat: 37.2, lng: 22.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'From Caesarea Maritima past Crete through the Euroclydon storm and shipwreck on Malta (Melita) to Syracuse, Puteoli, and two years of house arrest in Rome (Acts 27–28).'
  },
  {
    id: 'filter-john-patmos',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Twelve Apostles & Evangelists',
    label: '📜 John: 7 Churches of Asia & Patmos',
    dateLabel: 'AD 68–96',
    routeIds: ['john-seven-churches-patmos'],
    focusCenter: { lat: 37.8, lng: 27.6 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Apostle John\'s ministry from Jerusalem to Ephesus, the Seven Churches postal circuit (Ephesus, Smyrna, Pergamos, Thyatira, Sardis, Philadelphia, Laodicea), and exile on the Isle of Patmos (Revelation 1–3).'
  },
  {
    id: 'filter-thomas-india',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Twelve Apostles & Evangelists',
    label: '🌏 Thomas: Parthia & India [Scripture + Patristic]',
    dateLabel: 'AD 33 – c. AD 72',
    routeIds: ['thomas-parthia-india'],
    focusCenter: { lat: 24.5, lng: 58.0 },
    focusZoom: 4,
    evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    summary: 'Canonical appearances in Jerusalem & Galilee (John 20:28) followed by early patristic & Malabar historical attestation (Origen, Ephrem, Gregory of Nazianzus, Jerome) across Edessa, Parthia, King Gondophares\' Taxila (c. AD 46), Muziris on the Malabar Coast (AD 52), and Mylapore (c. AD 72).'
  },
  {
    id: 'filter-andrew-mark',
    eraIds: ['apostolic_church', 'roman_christ', 'all'],
    categoryLabel: 'Twelve Apostles & Evangelists',
    label: '🌍 Andrew (Scythia) & Mark (Alexandria) [Patristic]',
    dateLabel: 'AD 33 – c. AD 68',
    routeIds: ['andrew-mark-missions'],
    focusCenter: { lat: 38.0, lng: 31.0 },
    focusZoom: 5,
    evidenceClass: 'EXTERNAL_HISTORICAL_ATTESTATION',
    summary: 'Canonical ministry in Jerusalem and Cyprus followed by early patristic attestation (Origen & Eusebius Hist. Eccl. 2.16, 3.1) of John Mark founding the church in Alexandria and Andrew preaching along the Black Sea in Scythia and Patras in Achaia.'
  },
  // --- EXPANDED CHARACTER TIMELINE FILTERS ---
  {
    id: 'filter-job-uz',
    eraIds: ['patriarchs', 'all'],
    categoryLabel: 'Patriarchs',
    label: '🏜️ Job: Trials, Comforters & Whirlwind in Uz',
    dateLabel: 'c. 1900 BC',
    routeIds: ['job-land-of-uz'],
    focusCenter: { lat: 30.6, lng: 36.5 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Follow Job\'s upright life in the land of Uz, catastrophic Sabean and Chaldean raids, disputes with his three comforters, and God\'s majestic whirlwind speech bringing double restoration.'
  },
  {
    id: 'filter-gideon-judges',
    eraIds: ['exodus', 'all'],
    categoryLabel: 'Judges Era',
    label: '⚔️ Gideon: Harod Spring & 300 Midian Rout',
    dateLabel: 'c. 1191 BC',
    routeIds: ['gideon-judges'],
    focusCenter: { lat: 32.4, lng: 35.5 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Trace Gideon from the oak in Ophrah to the water lapping test at Harod Spring, the midnight attack with trumpets and pitchers at Moreh, and the pursuit to Karkor.'
  },
  {
    id: 'filter-samson-judges',
    eraIds: ['exodus', 'all'],
    categoryLabel: 'Judges Era',
    label: '🦁 Samson: Timnath, Lehi & Gaza Gates',
    dateLabel: 'c. 1085 BC',
    routeIds: ['samson-judges'],
    focusCenter: { lat: 31.65, lng: 34.8 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Samson\'s Nazarite exploits from Zorah and Timnath to the jawbone victory at Lehi, the midnight carrying of the gates of Gaza, and the final overthrow of Dagon\'s temple.'
  },
  {
    id: 'filter-ruth-boaz',
    eraIds: ['exodus', 'all'],
    categoryLabel: 'Judges Era',
    label: '🌾 Ruth & Naomi: Moab to Bethlehem',
    dateLabel: 'c. 1100 BC',
    routeIds: ['ruth-boaz'],
    focusCenter: { lat: 31.6, lng: 35.4 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Ruth\'s faithful journey from the plains of Moab to the barley fields and threshingfloor of Boaz at Bethlehem, bringing Obed into the royal ancestry of David.'
  },
  {
    id: 'filter-samuel-circuit',
    eraIds: ['united_monarchy', 'all'],
    categoryLabel: 'Prophets & Judges',
    label: '📜 Samuel: Circuit Judge & Anointings',
    dateLabel: 'c. 1050 BC',
    routeIds: ['samuel-circuit'],
    focusCenter: { lat: 31.9, lng: 35.2 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Samuel\'s lifelong prophetic ministry from childhood at Shiloh to the Ebenezer stone at Mizpah, the annual judicial circuit (Bethel, Gilgal, Mizpah), and the anointings of Saul and David.'
  },
  {
    id: 'filter-saul-reign',
    eraIds: ['united_monarchy', 'all'],
    categoryLabel: 'Monarchy',
    label: '👑 Saul: Gibeah, Michmash & Gilboa',
    dateLabel: 'c. 1050–1010 BC',
    routeIds: ['saul-reign'],
    focusCenter: { lat: 32.1, lng: 35.3 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'First king of Israel: reigning from Gibeah fortress, defeating Philistines at Michmash Pass, consulting the medium at Endor, and falling on Mount Gilboa.'
  },
  {
    id: 'filter-solomon-glory',
    eraIds: ['united_monarchy', 'all'],
    categoryLabel: 'Monarchy',
    label: '🏛️ Solomon: Temple, Red Sea Fleet & Glory',
    dateLabel: 'c. 970–931 BC',
    routeIds: ['solomon-glory'],
    focusCenter: { lat: 31.8, lng: 35.4 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Solomon\'s golden age: the dream at Gibeon, dedicating the First Temple in Jerusalem, building the Red Sea fleet to Ophir at Ezion-geber, fortifying chariot cities, and greeting the Queen of Sheba.'
  },
  {
    id: 'filter-elijah-prophet-only',
    eraIds: ['divided_monarchy_prophets', '2kings_jehu', 'all'],
    categoryLabel: 'Prophets',
    label: '🔥 Elijah: Tishbe, Cherith, Carmel & Whirlwind',
    dateLabel: 'c. 865–851 BC',
    routeIds: ['elijah-prophet'],
    focusCenter: { lat: 32.1, lng: 35.4 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Prophet Elijah\'s complete personal route: confronting Ahab at Tishbe, ravens at Cherith, widow\'s meal at Zarephath, fire on Mount Carmel, still small voice at Horeb, and ascension in chariot of fire by the Jordan.'
  },
  {
    id: 'filter-elisha-prophet-only',
    eraIds: ['divided_monarchy_prophets', '2kings_jehu', 'all'],
    categoryLabel: 'Prophets',
    label: '💧 Elisha: Jordan Parting, Shunem & Dothan',
    dateLabel: 'c. 851–798 BC',
    routeIds: ['elisha-ministry'],
    focusCenter: { lat: 32.4, lng: 35.3 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Prophet Elisha\'s miraculous ministry: parting the Jordan, healing Jericho\'s waters, raising the Shunammite\'s son, cleansing Naaman, and revealing chariots of fire at Dothan.'
  },
  {
    id: 'filter-amos-prophet',
    eraIds: ['divided_monarchy_prophets', '2kings_jehu', 'all'],
    categoryLabel: 'Prophets',
    label: '🐑 Amos: Tekoa Herdsman to Bethel Altar',
    dateLabel: 'c. 760 BC',
    routeIds: ['amos-prophet'],
    focusCenter: { lat: 31.95, lng: 35.2 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Tekoa herdsman Amos sent north to the royal golden calf sanctuary at Bethel, confronting high priest Amaziah and denouncing the luxurious ease of Samaria.'
  },
  {
    id: 'filter-hosea-prophet',
    eraIds: ['divided_monarchy_prophets', 'assyrian_siege', 'all'],
    categoryLabel: 'Prophets',
    label: '❤️ Hosea: Unfailing Love in Samaria',
    dateLabel: 'c. 755–715 BC',
    routeIds: ['hosea-prophet'],
    focusCenter: { lat: 32.4, lng: 35.3 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Prophet Hosea\'s living parable of redeeming unfaithful Gomer to mirror God\'s unwavering covenant love for Israel in the twilight of the Northern Kingdom.'
  },
  {
    id: 'filter-jonah-prophet',
    eraIds: ['divided_monarchy_prophets', '2kings_jehu', 'all'],
    categoryLabel: 'Prophets',
    label: '🐋 Jonah: Joppa to Nineveh & Gourd',
    dateLabel: 'c. 760 BC',
    routeIds: ['jonah-prophet'],
    focusCenter: { lat: 34.5, lng: 38.5 },
    focusZoom: 5,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Jonah\'s journey from Galilee to Joppa, the raging Mediterranean sea and great fish, the repentance of 120,000 souls in Nineveh, and the lesson of the withered gourd.'
  },
  {
    id: 'filter-isaiah-ministry',
    eraIds: ['divided_monarchy_prophets', 'assyrian_siege', 'all'],
    categoryLabel: 'Prophets',
    label: '🕊️ Isaiah: Temple Vision, Immanuel & Zion',
    dateLabel: 'c. 740–681 BC',
    routeIds: ['isaiah-ministry'],
    focusCenter: { lat: 31.78, lng: 35.23 },
    focusZoom: 10,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Isaiah\'s throne vision in the Temple, Immanuel prophecy to King Ahaz at the Upper Pool, deliverance of Jerusalem from Sennacherib, and the Suffering Servant songs.'
  },
  {
    id: 'filter-jeremiah-ministry',
    eraIds: ['babylonian_exile', 'all'],
    categoryLabel: 'Exile & Return',
    label: '📜 Jeremiah: Anathoth, Tophet, Cistern & Egypt',
    dateLabel: '627–580 BC',
    routeIds: ['jeremiah-ministry'],
    focusCenter: { lat: 31.5, lng: 34.5 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Jeremiah\'s call at Anathoth, the Temple Gate sermon, the shattered bottle in Hinnom, the miry cistern dungeon, and the final prophecy at Tahpanhes in Egypt.'
  },
  {
    id: 'filter-daniel-exile-only',
    eraIds: ['babylonian_exile', 'all'],
    categoryLabel: 'Exile & Return',
    label: '🦁 Daniel: Babylon, Furnace, Lions & Susa',
    dateLabel: '605–536 BC',
    routeIds: ['daniel-exile'],
    focusCenter: { lat: 32.5, lng: 44.5 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Daniel\'s 70-year witness from captive youth in Jerusalem to the colossal statue dream, the fiery furnace, Belshazzar\'s feast, the lions\' den, and apocalypses at Susa and the Tigris.'
  },
  {
    id: 'filter-ezekiel-exile',
    eraIds: ['babylonian_exile', 'all'],
    categoryLabel: 'Exile & Return',
    label: '⚡ Ezekiel: Chebar Chariot & Dry Bones',
    dateLabel: '593–571 BC',
    routeIds: ['ezekiel-exile'],
    focusCenter: { lat: 32.2, lng: 44.8 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Ezekiel\'s visions among the exiles: the chariot throne with burning coals and wheels full of eyes by the River Chebar, the valley of dry bones raised to life, and the Millennial Temple.'
  },
  {
    id: 'filter-esther-mordecai',
    eraIds: ['persian_restoration', 'all'],
    categoryLabel: 'Exile & Return',
    label: '👑 Esther & Mordecai: Susa Citadel & Purim',
    dateLabel: '483–473 BC',
    routeIds: ['esther-mordecai'],
    focusCenter: { lat: 32.19, lng: 48.24 },
    focusZoom: 9,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'The providential deliverance of the Jewish people in the Persian winter capital of Shushan: Esther crowned queen, Mordecai in the King\'s Gate, Haman\'s defeat on his own gallows, and Purim.'
  },
  {
    id: 'filter-ezra-journey',
    eraIds: ['persian_restoration', 'all'],
    categoryLabel: 'Exile & Return',
    label: '📖 Ezra: Ahava Fast to Jerusalem Assembly',
    dateLabel: '458 BC',
    routeIds: ['ezra-journey'],
    focusCenter: { lat: 33.5, lng: 41.5 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Ezra the ready scribe leading 1,500 families from Babylon, fasting at the River Ahava without royal soldiers, and arriving in Jerusalem to restore the Law of God.'
  },
  {
    id: 'filter-nehemiah-walls',
    eraIds: ['persian_restoration', 'all'],
    categoryLabel: 'Exile & Return',
    label: '🧱 Nehemiah: Susa to 52-Day Wall Circuit',
    dateLabel: '445 BC',
    routeIds: ['nehemiah-walls'],
    focusCenter: { lat: 31.78, lng: 35.23 },
    focusZoom: 9,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Nehemiah cupbearer to Artaxerxes arriving from Susa with cavalry, inspecting the ruins by night, organizing builders with sword and trowel, and finishing the walls in 52 days.'
  },
  {
    id: 'filter-stephen-philip',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Deacons & Evangelists',
    label: '⚡ Stephen & Philip: Jerusalem, Samaria & Gaza',
    dateLabel: 'AD 34–37',
    routeIds: ['stephen-philip-deacons'],
    focusCenter: { lat: 31.8, lng: 34.8 },
    focusZoom: 8,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Stephen\'s angelic witness and martyrdom outside Jerusalem, Philip\'s revival in Samaria, and the baptism of the Ethiopian royal treasurer on the desert road to Gaza.'
  },
  {
    id: 'filter-paul-conversion',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Apostolic Age',
    label: '⚡ Paul: Tarsus, Damascus & Arabia',
    dateLabel: 'AD 33–46',
    routeIds: ['paul-conversion-early'],
    focusCenter: { lat: 33.5, lng: 35.5 },
    focusZoom: 6,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Paul\'s dramatic Damascus road conversion by the risen Christ, Ananias on Straight Street, three years of revelation in Arabia, midnight basket escape, and return to Antioch.'
  },
  {
    id: 'filter-barnabas-mark',
    eraIds: ['roman_christ', 'apostolic_church', 'all'],
    categoryLabel: 'Apostolic Age',
    label: '⛵ Barnabas & Mark: Cyprus & Antioch',
    dateLabel: 'AD 45–52',
    routeIds: ['barnabas-mark'],
    focusCenter: { lat: 35.5, lng: 34.0 },
    focusZoom: 7,
    evidenceClass: 'SCRIPTURE_TEXT',
    summary: 'Barnabas the son of consolation mentoring young John Mark through Antioch and Cyprus, standing by Mark through departure, and seeing him restored as profitable for ministry.'
  },

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
  },
  corinth: {
    name: 'Corinth (Achaia)',
    ancientRegion: 'Greece / Roman Province of Achaia',
    coords: { lat: 37.906, lng: 22.880 },
    zoom: 8,
    note: 'Commercial crossroads of Roman Greece where Paul ministered for 18 months (Acts 18), stood before Proconsul Gallio (AD 51–52), and penned Romans.',
    scriptureRef: 'ACTS 18:1–17, 1 CORINTHIANS 1:2, ROMANS 16:23'
  },
  rome: {
    name: 'Rome (Imperial Capital)',
    ancientRegion: 'Italy / Roman Empire',
    coords: { lat: 41.902, lng: 12.496 },
    zoom: 7,
    note: 'Seat of the Caesars; destination of Paul\'s appeal to Caesar (Acts 25:11, 28:16) where he penned the Prison Epistles (Ephesians, Philippians, Colossians, Philemon) and 2 Timothy.',
    scriptureRef: 'ACTS 28:16, ROMANS 1:7, 2 TIMOTHY 1:17'
  },
  ephesus: {
    name: 'Ephesus',
    ancientRegion: 'Roman Asia Minor',
    coords: { lat: 37.940, lng: 27.341 },
    zoom: 8,
    note: 'Metropolis of Roman Asia where Paul taught daily in the school of Tyrannus for three years (Acts 19:9–10) and later addressed Ephesians and 1 Timothy; first of the Seven Churches of Revelation.',
    scriptureRef: 'ACTS 19:1–41, EPHESIANS 1:1, REVELATION 2:1'
  },
  philippi: {
    name: 'Philippi (Roman Colony)',
    ancientRegion: 'Macedonia',
    coords: { lat: 41.013, lng: 24.286 },
    zoom: 8,
    note: 'Chief city of eastern Macedonia and a Roman military colony; site of Paul\'s first European convert (Lydia) and the conversion of the Philippian jailer (Acts 16).',
    scriptureRef: 'ACTS 16:12–40, PHILIPPIANS 1:1'
  },
  colossae: {
    name: 'Colossae (Lycus Valley)',
    ancientRegion: 'Phrygia / Asia Minor',
    coords: { lat: 37.787, lng: 29.261 },
    zoom: 8,
    note: 'Phrygian city in the Lycus River valley near Laodicea and Hierapolis; home of Epaphras, Philemon, and Onesimus.',
    scriptureRef: 'COLOSSIANS 1:2, PHILEMON 1:1–2'
  },
  thessalonica: {
    name: 'Thessalonica',
    ancientRegion: 'Macedonia',
    coords: { lat: 40.640, lng: 22.944 },
    zoom: 8,
    note: 'Capital port of Roman Macedonia on the Via Egnatia where Paul reasoned for three Sabbaths in the synagogue (Acts 17:1–9); recipient of 1 & 2 Thessalonians.',
    scriptureRef: 'ACTS 17:1, 1 THESSALONIANS 1:1'
  },
  galatia: {
    name: 'Galatia (Pisidian Antioch, Iconium, Lystra, Derbe)',
    ancientRegion: 'Central Asia Minor',
    coords: { lat: 38.304, lng: 31.189 },
    zoom: 7,
    note: 'Roman province in Asia Minor evangelized by Paul and Barnabas on the First Missionary Journey (Acts 13–14); recipient of the Epistle to the Galatians.',
    scriptureRef: 'ACTS 13:14–14:23, GALATIANS 1:2'
  },
  antioch: {
    name: 'Antioch on the Orontes (Syrian Antioch)',
    ancientRegion: 'Roman Syria',
    coords: { lat: 36.202, lng: 36.160 },
    zoom: 8,
    note: 'Third largest city of the Roman Empire where the disciples were first called Christians (Acts 11:26) and the sending church for Paul\'s three missionary journeys.',
    scriptureRef: 'ACTS 11:26, 13:1–3, GALATIANS 2:11'
  },
  athens: {
    name: 'Athens (Areopagus / Mars\' Hill)',
    ancientRegion: 'Attica / Greece',
    coords: { lat: 37.971, lng: 23.726 },
    zoom: 9,
    note: 'Intellectual heart of classical Greece where Paul proclaimed the Creator and risen Judge before the Epicurean and Stoic philosophers on Mars\' Hill (Acts 17:22–31).',
    scriptureRef: 'ACTS 17:15–34, 1 THESSALONIANS 3:1'
  },
  crete: {
    name: 'Crete',
    ancientRegion: 'Mediterranean Sea',
    coords: { lat: 35.240, lng: 24.809 },
    zoom: 7,
    note: 'Mountainous Mediterranean island where Paul left Titus to "set in order the things that are wanting, and ordain elders in every city" (Titus 1:5).',
    scriptureRef: 'ACTS 27:7–13, TITUS 1:5'
  },
  patmos: {
    name: 'Isle of Patmos',
    ancientRegion: 'Aegean Sea / Roman Asia',
    coords: { lat: 37.319, lng: 26.548 },
    zoom: 9,
    note: 'Rocky Aegean island where the Apostle John was exiled "for the word of God, and for the testimony of Jesus Christ" and received the book of Revelation (AD 95–96).',
    scriptureRef: 'REVELATION 1:9'
  },
  hebron: {
    name: 'Hebron (Kirjath-arba / Mamre)',
    ancientRegion: 'Judean Highlands',
    coords: { lat: 31.532, lng: 35.099 },
    zoom: 9,
    note: 'Patriarchal burial site at the Cave of Machpelah, Caleb\'s inheritance in Joshua 14, and King David\'s royal capital for the first seven years and six months of his reign.',
    scriptureRef: 'GENESIS 23:19, JOSHUA 14:13, 2 SAMUEL 2:1–4, 5:5'
  },
  shiloh: {
    name: 'Shiloh',
    ancientRegion: 'Hill Country of Ephraim',
    coords: { lat: 32.055, lng: 35.289 },
    zoom: 9,
    note: 'Central sanctuary of Israel for over 300 years where Joshua set up the Tabernacle (Joshua 18:1) and where Hannah prayed and young Samuel heard the voice of the LORD.',
    scriptureRef: 'JOSHUA 18:1, JUDGES 21:19, 1 SAMUEL 1:3, 3:21'
  },
  gibeon: {
    name: 'Gibeon (El-Jib)',
    ancientRegion: 'Benjamin Plateau',
    coords: { lat: 31.846, lng: 35.184 },
    zoom: 9,
    note: 'Canaanite royal city that made a treaty with Joshua; site where the sun stood still (Joshua 10:12) and where Solomon asked God for an understanding heart (1 Kings 3:5).',
    scriptureRef: 'JOSHUA 9:3, 10:12, 1 KINGS 3:4–5'
  },
  hazor: {
    name: 'Hazor (Tel Hazor)',
    ancientRegion: 'Upper Galilee',
    coords: { lat: 33.017, lng: 35.568 },
    zoom: 9,
    note: '"The head of all those kingdoms" in northern Canaan conquered and burned by Joshua (Joshua 11:10–13), later fortified with a six-chambered gate by Solomon (1 Kings 9:15).',
    scriptureRef: 'JOSHUA 11:10, JUDGES 4:2, 1 KINGS 9:15'
  },
  ai: {
    name: 'Ai (Beside Beth-aven, East of Bethel)',
    ancientRegion: 'Central Highlands',
    coords: { lat: 31.917, lng: 35.261 },
    zoom: 9,
    note: 'Canaanite stronghold east of Bethel where Abraham pitched his tent (Genesis 12:8) and which Joshua conquered after the judgment of Achan\'s sin (Joshua 7–8).',
    scriptureRef: 'GENESIS 12:8, JOSHUA 7:2–8:29'
  },
  shechem: {
    name: 'Shechem (Between Mount Ebal & Mount Gerizim)',
    ancientRegion: 'Hill Country of Ephraim',
    coords: { lat: 32.213, lng: 35.281 },
    zoom: 9,
    note: 'Site of Abram\'s first altar in Canaan (Genesis 12:6), Joshua\'s covenant renewal address (Joshua 24:1–25), and Rehoboam\'s coronation crisis (1 Kings 12:1).',
    scriptureRef: 'GENESIS 12:6, JOSHUA 24:1, 1 KINGS 12:1'
  },
  beersheba: {
    name: 'Beersheba (Well of the Oath)',
    ancientRegion: 'Negev / Southern Judah',
    coords: { lat: 31.245, lng: 34.841 },
    zoom: 8,
    note: 'Southern boundary anchor of Israel ("from Dan even to Beer-sheba") where Abraham, Isaac, and Jacob dug wells and called on the name of the everlasting God.',
    scriptureRef: 'GENESIS 21:31–33, 26:33, JUDGES 20:1, 1 KINGS 19:3'
  },
  dan: {
    name: 'Dan (Tel Dan / Laish)',
    ancientRegion: 'Upper Jordan Sources (Mount Hermon)',
    coords: { lat: 33.249, lng: 35.652 },
    zoom: 9,
    note: 'Northernmost boundary city of Israel ("from Dan even to Beer-sheba"); discovery site of the 9th-century BC Tel Dan Stele bearing the inscription "House of David".',
    scriptureRef: 'GENESIS 14:14, JUDGES 18:29, 1 KINGS 12:29'
  },
  lachish: {
    name: 'Lachish (Tel Lachish)',
    ancientRegion: 'Judean Shephelah',
    coords: { lat: 31.565, lng: 34.849 },
    zoom: 9,
    note: 'Second most important fortified city of Judah after Jerusalem; besieged by Sennacherib in 701 BC (2 Kings 18:14) and Nebuchadnezzar in 588–586 BC (Jeremiah 34:7; Lachish Letters).',
    scriptureRef: 'JOSHUA 10:31, 2 KINGS 18:14, JEREMIAH 34:7'
  },
  susa: {
    name: 'Susa (Shushan the Palace)',
    ancientRegion: 'Elam / Persia',
    coords: { lat: 32.190, lng: 48.257 },
    zoom: 7,
    note: 'Winter royal capital of the Achaemenid Persian Empire where Queen Esther interceded before Xerxes, Nehemiah served as cupbearer to Artaxerxes, and Daniel saw visions by the Ulai.',
    scriptureRef: 'NEHEMIAH 1:1, ESTHER 1:2, DANIEL 8:2'
  },
  shushan: {
    name: 'Shushan the Palace (Susa)',
    ancientRegion: 'Elam / Persia',
    coords: { lat: 32.190, lng: 48.257 },
    zoom: 7,
    note: 'Royal citadel of the Medo-Persian kings; setting for the entire book of Esther and the opening commission of Nehemiah.',
    scriptureRef: 'NEHEMIAH 1:1, ESTHER 1:2, DANIEL 8:2'
  },
  bethlehem: {
    name: 'Bethlehem Ephratah',
    ancientRegion: 'Judea',
    coords: { lat: 31.705, lng: 35.204 },
    zoom: 10,
    note: 'Home of Ruth and Boaz, birthplace and anointing city of King David (1 Samuel 16), and prophesied birthplace of Jesus the Messiah (Micah 5:2, Matthew 2:1, Luke 2:4).',
    scriptureRef: 'RUTH 1:19, 1 SAMUEL 16:1, MICAH 5:2, LUKE 2:4–7'
  },
  nazareth: {
    name: 'Nazareth',
    ancientRegion: 'Lower Galilee',
    coords: { lat: 32.701, lng: 35.303 },
    zoom: 9,
    note: 'Galilean hill town where the angel Gabriel appeared to Mary (Luke 1:26) and where Jesus Christ grew up in fulfillment of prophecy ("He shall be called a Nazarene").',
    scriptureRef: 'MATTHEW 2:23, LUKE 1:26, 2:51, 4:16'
  },
  capernaum: {
    name: 'Capernaum (His Own City)',
    ancientRegion: 'Sea of Galilee',
    coords: { lat: 32.881, lng: 35.575 },
    zoom: 10,
    note: 'Fishing town on the northwestern shore of the Sea of Galilee that served as the headquarters of Jesus\'s Galilean ministry and home of Peter, Andrew, and Matthew.',
    scriptureRef: 'MATTHEW 4:13, 9:1, MARK 1:21, JOHN 6:59'
  },
  caesarea: {
    name: 'Caesarea Maritima',
    ancientRegion: 'Mediterranean Coast / Roman Judea',
    coords: { lat: 32.500, lng: 34.890 },
    zoom: 9,
    note: 'Roman administrative capital of Judea built by Herod the Great; discovery site of the Pilate Stone, home of Cornelius (Acts 10), and site of Paul\'s two-year imprisonment (Acts 23–26).',
    scriptureRef: 'ACTS 10:1, 23:23, 25:13'
  }
};

/**
 * Calculates planar equirectangular area (in square kilometers) of a geodesic polygon.
 * Used to deterministically sort regions so that larger macro empires render in the
 * background (DOM bottom) while smaller focal kingdoms and lakes render in the
 * foreground (DOM top).
 */
export function calculatePolygonGeodesicArea(coords: Array<{ lat: number; lng: number }>): number {
  if (!coords || coords.length < 3) return 0;
  const n = coords.length;
  let meanLat = 0;
  for (let i = 0; i < n; i++) meanLat += coords[i].lat;
  meanLat = (meanLat / n) * (Math.PI / 180);
  const cosLat = Math.cos(meanLat);

  let sum = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = coords[i].lng * cosLat;
    const yi = coords[i].lat;
    const xj = coords[j].lng * cosLat;
    const yj = coords[j].lat;
    sum += xi * yj - xj * yi;
  }
  return (Math.abs(sum) / 2) * 111.32 * 110.574;
}


