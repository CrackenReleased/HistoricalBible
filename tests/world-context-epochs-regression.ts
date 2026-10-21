import test from 'node:test';
import assert from 'node:assert/strict';
import { getJourneyStopForPassage, BIBLICAL_ROUTES } from '../src/data/ancientMapData.ts';
import { getRelationshipForPassage, HISTORICAL_RELATIONSHIPS } from '../src/data/historicalRelationships.ts';
import { getWorldHorizonItem, HISTORICAL_WORLD_ITEMS, isWorldItemInDateInterval } from '../src/data/historicalWorldItems.ts';

// =============================================================================
// EPOCH 1: PENTATEUCH & EXODUS (GENESIS & EXODUS)
// =============================================================================

test('Epoch 1: Jacob narrative passages wire to sequential stops on jacob-padan-aram route', () => {
  const route = BIBLICAL_ROUTES.find(r => r.id === 'jacob-padan-aram');
  assert.ok(route, 'jacob-padan-aram route must exist');
  assert.equal(route.figureId, 'jacob');
  assert.equal(route.stops.length, 9, 'Must have 9 sequential narrative stops');

  // Stop 0: Beersheba (Gen 28:10)
  const s0 = getJourneyStopForPassage('Gen', 28, 10);
  assert.ok(s0);
  assert.equal(s0.route.id, 'jacob-padan-aram');
  assert.equal(s0.stopIndex, 0);
  assert.match(s0.stop.name, /Beersheba/i);

  // Stop 1: Bethel / Luz (Gen 28:12)
  const s1 = getJourneyStopForPassage('Gen', 28, 12);
  assert.ok(s1);
  assert.equal(s1.stopIndex, 1);
  assert.match(s1.stop.name, /Bethel/i);

  // Stop 2: Haran in Padan-Aram (Gen 29:10)
  const s2 = getJourneyStopForPassage('Gen', 29, 10);
  assert.ok(s2);
  assert.equal(s2.stopIndex, 2);
  assert.match(s2.stop.name, /Haran/i);

  // Stop 3: Mount Gilead (Gen 31:48)
  const s3 = getJourneyStopForPassage('Gen', 31, 48);
  assert.ok(s3);
  assert.equal(s3.stopIndex, 3);
  assert.match(s3.stop.name, /Gilead/i);

  // Stop 4: Mahanaim (Gen 32:2)
  const s4 = getJourneyStopForPassage('Gen', 32, 2);
  assert.ok(s4);
  assert.equal(s4.stopIndex, 4);
  assert.match(s4.stop.name, /Mahanaim/i);

  // Stop 5: Peniel / Jabbok (Gen 32:28)
  const s5 = getJourneyStopForPassage('Gen', 32, 28);
  assert.ok(s5);
  assert.equal(s5.stopIndex, 5);
  assert.match(s5.stop.name, /Peniel/i);

  // Stop 6: Succoth & Shechem (Gen 33:4)
  const s6 = getJourneyStopForPassage('Gen', 33, 4);
  assert.ok(s6);
  assert.equal(s6.stopIndex, 6);
  assert.match(s6.stop.name, /Succoth/i);

  // Stop 7: Bethlehem / Rachel's Grave (Gen 35:19)
  const s7 = getJourneyStopForPassage('Gen', 35, 19);
  assert.ok(s7);
  assert.equal(s7.stopIndex, 7);
  assert.match(s7.stop.name, /Bethlehem/i);

  // Stop 8: Hebron / Mamre (Gen 35:27)
  const s8 = getJourneyStopForPassage('Gen', 35, 27);
  assert.ok(s8);
  assert.equal(s8.stopIndex, 8);
  assert.match(s8.stop.name, /Hebron/i);

  // Order assertion
  assert.equal(s0.stopIndex < s1.stopIndex, true);
  assert.equal(s1.stopIndex < s2.stopIndex, true);
  assert.equal(s2.stopIndex < s3.stopIndex, true);
  assert.equal(s6.stopIndex < s7.stopIndex, true);
  assert.equal(s7.stopIndex < s8.stopIndex, true);
});

test('Epoch 1: Exodus passages wire to sequential stops on exodus-route', () => {
  const route = BIBLICAL_ROUTES.find(r => r.id === 'exodus-route');
  assert.ok(route, 'exodus-route must exist');
  assert.equal(route.figureId, 'moses');
  assert.equal(route.stops.length, 8, 'Must have 8 sequential stops');

  // Stop 0: Rameses (Exod 12:37)
  const s0 = getJourneyStopForPassage('Exod', 12, 37);
  assert.ok(s0);
  assert.equal(s0.route.id, 'exodus-route');
  assert.equal(s0.stopIndex, 0);
  assert.match(s0.stop.name, /Rameses/i);

  // Stop 1: Succoth (Exod 13:17)
  const s1 = getJourneyStopForPassage('Exod', 13, 17);
  assert.ok(s1);
  assert.equal(s1.stopIndex, 1);
  assert.match(s1.stop.name, /Succoth/i);

  // Stop 2: Etham (Exod 13:20)
  const s2 = getJourneyStopForPassage('Exod', 13, 20);
  assert.ok(s2);
  assert.equal(s2.stopIndex, 2);
  assert.match(s2.stop.name, /Etham/i);

  // Stop 3: Red Sea Crossing (Exod 14:21)
  const s3 = getJourneyStopForPassage('Exod', 14, 21);
  assert.ok(s3);
  assert.equal(s3.stopIndex, 3);
  assert.match(s3.stop.name, /Red Sea/i);

  // Stop 4: Marah (Exod 15:23)
  const s4 = getJourneyStopForPassage('Exod', 15, 23);
  assert.ok(s4);
  assert.equal(s4.stopIndex, 4);
  assert.match(s4.stop.name, /Marah/i);

  // Stop 5: Elim (Exod 15:27)
  const s5 = getJourneyStopForPassage('Exod', 15, 27);
  assert.ok(s5);
  assert.equal(s5.stopIndex, 5);
  assert.match(s5.stop.name, /Elim/i);

  // Stop 6: Rephidim (Exod 17:1)
  const s6 = getJourneyStopForPassage('Exod', 17, 1);
  assert.ok(s6);
  assert.equal(s6.stopIndex, 6);
  assert.match(s6.stop.name, /Rephidim/i);

  // Stop 7: Mount Sinai (Exod 19:1)
  const s7 = getJourneyStopForPassage('Exod', 19, 1);
  assert.ok(s7);
  assert.equal(s7.stopIndex, 7);
  assert.match(s7.stop.name, /Sinai/i);
});

test('Epoch 1: Relationships express non-collapse and time-contingency', () => {
  // Israel & Egypt in Exodus 12
  const exodusRel = getRelationshipForPassage('Exod', 12, 37);
  assert.ok(exodusRel);
  assert.equal(exodusRel.id, 'israel-egypt-exodus');
  assert.equal(exodusRel.actor1Id, 'israel');
  assert.equal(exodusRel.actor2Id, 'egypt');
  assert.equal(exodusRel.relationshipKind, 'coerced_captivity');
  assert.match(exodusRel.tensionAndLimits, /Contrasts sharply with Genesis 47/i);
  assert.ok(exodusRel.moralAssessmentBasis && exodusRel.moralAssessmentBasis.length > 20);

  // Abram & Melchizedek in Genesis 14
  const melchRel = getRelationshipForPassage('Gen', 14, 18);
  assert.ok(melchRel);
  assert.equal(melchRel.id, 'abraham-melchizedek');
  assert.equal(melchRel.actor1Id, 'abraham');
  assert.equal(melchRel.actor2Id, 'salem');
  assert.equal(melchRel.relationshipKind, 'peaceable_fellowship');
  assert.match(melchRel.tensionAndLimits, /Bera king of Sodom/i);
  assert.ok(melchRel.moralAssessmentBasis && melchRel.moralAssessmentBasis.length > 20);
});

test('Epoch 1: World horizons provide cited independent records with no-contact boundaries', () => {
  // 12th Dynasty Egyptian Middle Kingdom
  const midEgypt = getWorldHorizonItem('egypt-middle-kingdom-12th');
  assert.ok(midEgypt);
  assert.match(midEgypt.name, /Middle Kingdom/i);
  assert.equal(isWorldItemInDateInterval(midEgypt, -1890), true);
  assert.match(midEgypt.overlapExplanation, /no known contact with Jacob’s family/i);

  // Shang Dynasty Bronze Age China
  const shang = getWorldHorizonItem('shang-dynasty-bronze');
  assert.ok(shang);
  assert.match(shang.name, /Shang Dynasty/i);
  assert.equal(isWorldItemInDateInterval(shang, -1446), true);
  assert.match(shang.overlapExplanation, /no known contact with Israel or Egypt/i);
});

// =============================================================================
// EPOCH 2: THE EXILE & RETURN (BABYLONIAN EXILE & PERSIAN RESTORATION)
// =============================================================================

test('Epoch 2: Ezra and Nehemiah narrative passages wire to sequential stops', () => {
  // Ezra 8:21 -> River Ahava (Stop 1)
  const ezraAhava = getJourneyStopForPassage('Ezra', 8, 21);
  assert.ok(ezraAhava);
  assert.equal(ezraAhava.route.id, 'ezra-journey');
  assert.equal(ezraAhava.stopIndex, 1);
  assert.match(ezraAhava.stop.name, /Ahava/i);

  // Ezra 9:5 -> Jerusalem Temple Courts (Stop 3)
  const ezraTemple = getJourneyStopForPassage('Ezra', 9, 5);
  assert.ok(ezraTemple);
  assert.equal(ezraTemple.route.id, 'ezra-journey');
  assert.equal(ezraTemple.stopIndex, 3);
  assert.match(ezraTemple.stop.name, /Jerusalem/i);

  // Nehemiah 2:13 -> Secret Night Inspection (Stop 2)
  const nehNight = getJourneyStopForPassage('Neh', 2, 13);
  assert.ok(nehNight);
  assert.equal(nehNight.route.id, 'nehemiah-walls');
  assert.equal(nehNight.stopIndex, 2);
  assert.match(nehNight.stop.name, /Night Inspection/i);

  // Nehemiah 6:15 -> 10 Gates Rebuilding Circuit (Stop 3)
  const nehGates = getJourneyStopForPassage('Neh', 6, 15);
  assert.ok(nehGates);
  assert.equal(nehGates.route.id, 'nehemiah-walls');
  assert.equal(nehGates.stopIndex, 3);
  assert.match(nehGates.stop.name, /10 Gates/i);

  // Nehemiah 8:1 -> Water Gate Law Reading (Stop 4)
  const nehWaterGate = getJourneyStopForPassage('Neh', 8, 1);
  assert.ok(nehWaterGate);
  assert.equal(nehWaterGate.route.id, 'nehemiah-walls');
  assert.equal(nehWaterGate.stopIndex, 4);
  assert.match(nehWaterGate.stop.name, /Water Gate/i);
});

test('Epoch 2: Relationships express Zedekiah rebellion vs Cyrus decree', () => {
  // Zedekiah & Nebuchadnezzar (2 Kings 25:1)
  const babylonRel = getRelationshipForPassage('2Kgs', 25, 1);
  assert.ok(babylonRel);
  assert.equal(babylonRel.id, 'judah-babylon-586bc');
  assert.equal(babylonRel.actor1Id, 'judah');
  assert.equal(babylonRel.actor2Id, 'babylon');
  assert.equal(babylonRel.relationshipKind, 'armed_conflict');
  assert.match(babylonRel.perspectiveActor1, /Jeremiah counseled surrender/i);
  assert.match(babylonRel.tensionAndLimits, /crucial internal tension/i);

  // Cyrus & Jewish Exiles (Ezra 1:1)
  const persiaRel = getRelationshipForPassage('Ezra', 1, 1);
  assert.ok(persiaRel);
  assert.equal(persiaRel.id, 'jews-persia-cyrus-538bc');
  assert.equal(persiaRel.actor1Id, 'jews-restoration');
  assert.equal(persiaRel.actor2Id, 'persia');
  assert.equal(persiaRel.relationshipKind, 'voluntary_vassalage');
  assert.match(persiaRel.perspectiveActor2, /Cyrus Cylinder/i);
  assert.match(persiaRel.tensionAndLimits, /Yehud Medinata/i);
});

test('Epoch 2: World horizons cover Solon’s Athens and Classical Greece with no-contact boundaries', () => {
  // Solon’s Reforms in Archaic Athens (c. 586 BC)
  const solon = getWorldHorizonItem('solon-athens-reforms');
  assert.ok(solon);
  assert.equal(isWorldItemInDateInterval(solon, -586), true);
  assert.match(solon.overlapExplanation, /no known contact with Judah or Babylon/i);

  // Classical Greece / Age of Pericles & Parthenon (c. 445 BC)
  const pericles = getWorldHorizonItem('classical-athens-golden-age');
  assert.ok(pericles);
  assert.equal(isWorldItemInDateInterval(pericles, -445), true);
  assert.match(pericles.overlapExplanation, /no known contact with Nehemiah or Susa/i);
});

// =============================================================================
// EPOCH 3: GOSPELS & APOSTOLIC CHURCH (LIFE OF CHRIST & ACTS)
// =============================================================================

test('Epoch 3: Paul narrative passages wire to sequential stops on second journey and voyage to Rome', () => {
  // Acts 16:12 -> Philippi (Stop 4 on paul-second-journey)
  const p2Philippi = getJourneyStopForPassage('Acts', 16, 12);
  assert.ok(p2Philippi);
  assert.equal(p2Philippi.route.id, 'paul-second-journey');
  assert.equal(p2Philippi.stopIndex, 4);
  assert.match(p2Philippi.stop.name, /Philippi/i);

  // Acts 17:15 -> Athens Mars' Hill (Stop 7 on paul-second-journey)
  const p2Athens = getJourneyStopForPassage('Acts', 17, 15);
  assert.ok(p2Athens);
  assert.equal(p2Athens.route.id, 'paul-second-journey');
  assert.equal(p2Athens.stopIndex, 7);
  assert.match(p2Athens.stop.name, /Athens/i);

  // Acts 18:1 -> Corinth (Stop 8 on paul-second-journey)
  const p2Corinth = getJourneyStopForPassage('Acts', 18, 1);
  assert.ok(p2Corinth);
  assert.equal(p2Corinth.route.id, 'paul-second-journey');
  assert.equal(p2Corinth.stopIndex, 8);
  assert.match(p2Corinth.stop.name, /Corinth/i);

  // Acts 27:8 -> Fair Havens (Stop 2 on paul-voyage-rome)
  const romeHavens = getJourneyStopForPassage('Acts', 27, 8);
  assert.ok(romeHavens);
  assert.equal(romeHavens.route.id, 'paul-voyage-rome');
  assert.equal(romeHavens.stopIndex, 2);
  assert.match(romeHavens.stop.name, /Fair Havens/i);

  // Acts 28:1 -> Malta Shipwreck (Stop 3 on paul-voyage-rome)
  const romeMalta = getJourneyStopForPassage('Acts', 28, 1);
  assert.ok(romeMalta);
  assert.equal(romeMalta.route.id, 'paul-voyage-rome');
  assert.equal(romeMalta.stopIndex, 3);
  assert.match(romeMalta.stop.name, /Melita/i);

  // Acts 28:30 -> Rome Two-Year House Custody (Stop 5 on paul-voyage-rome)
  const romeCustody = getJourneyStopForPassage('Acts', 28, 30);
  assert.ok(romeCustody);
  assert.equal(romeCustody.route.id, 'paul-voyage-rome');
  assert.equal(romeCustody.stopIndex, 5);
  assert.match(romeCustody.stop.name, /Rome/i);
});

test('Epoch 3: Relationships express Jesus & Pilate trial and Paul in Rome under Nero', () => {
  // Jesus & Pilate (John 18:38)
  const pilateRel = getRelationshipForPassage('John', 18, 38);
  assert.ok(pilateRel);
  assert.equal(pilateRel.id, 'jesus-pilate-sanhedrin-ad33');
  assert.equal(pilateRel.actor1Id, 'jesus');
  assert.equal(pilateRel.actor2Id, 'rome-judaea');
  assert.match(pilateRel.summary, /I find in him no fault at all/i);
  assert.match(pilateRel.perspectiveActor2, /convinced of Jesus’ innocence/i);
  assert.match(pilateRel.tensionAndLimits, /sole jus gladii/i);

  // Paul & Rome under Nero (Acts 28:30)
  const neroRel = getRelationshipForPassage('Acts', 28, 30);
  assert.ok(neroRel);
  assert.equal(neroRel.id, 'paul-rome-nero-ad62');
  assert.equal(neroRel.actor1Id, 'paul');
  assert.equal(neroRel.actor2Id, 'rome-imperial');
  assert.equal(neroRel.relationshipKind, 'refuge');
  assert.match(neroRel.tensionAndLimits, /Contrasts sharply with Nero’s later vicious persecution/i);
});

test('Epoch 3: World horizons cover Eastern Han Dynasty and Flavian Colosseum', () => {
  // Eastern Han Dynasty / Emperor Ming (c. AD 60–62)
  const hanMing = getWorldHorizonItem('han-dynasty-eastern-ming');
  assert.ok(hanMing);
  assert.equal(isWorldItemInDateInterval(hanMing, 60), true);
  assert.match(hanMing.overlapExplanation, /no known contact with Paul, Rome, or Judaea/i);

  // Flavian Amphitheatre / Colosseum (AD 70–80)
  const colosseum = getWorldHorizonItem('rome-flavian-colosseum');
  assert.ok(colosseum);
  assert.equal(isWorldItemInDateInterval(colosseum, 75), true);
  assert.equal(colosseum.connectionKind, 'direct_synchrony');
  assert.match(colosseum.summary, /spoils of Judaea/i);
});

// =============================================================================
// EPOCH 4: PATRIARCHS & CONQUEST (ABRAHAM & JOSHUA)
// =============================================================================

test('Epoch 4: Abraham and Joshua narrative passages wire to sequential stops', () => {
  // Abraham: Gen 11:31 -> Ur of Chaldees (Stop 0)
  const abrUr = getJourneyStopForPassage('Gen', 11, 31);
  assert.ok(abrUr);
  assert.equal(abrUr.route.id, 'abraham-call');
  assert.equal(abrUr.stopIndex, 0);
  assert.match(abrUr.stop.name, /Ur of the Chaldees/i);

  // Abraham: Gen 12:1 -> Haran (Stop 3)
  const abrHaran = getJourneyStopForPassage('Gen', 12, 1);
  assert.ok(abrHaran);
  assert.equal(abrHaran.route.id, 'abraham-call');
  assert.equal(abrHaran.stopIndex, 3);
  assert.match(abrHaran.stop.name, /Haran/i);

  // Abraham: Gen 12:6 -> Shechem (Stop 5)
  const abrShechem = getJourneyStopForPassage('Gen', 12, 6);
  assert.ok(abrShechem);
  assert.equal(abrShechem.stopIndex, 5);
  assert.match(abrShechem.stop.name, /Shechem/i);

  // Abraham: Gen 13:18 -> Hebron (Stop 7)
  const abrHebron = getJourneyStopForPassage('Gen', 13, 18);
  assert.ok(abrHebron);
  assert.equal(abrHebron.stopIndex, 7);
  assert.match(abrHebron.stop.name, /Hebron/i);

  // Joshua: Josh 1:1 -> Shittim (Stop 0)
  const joshShittim = getJourneyStopForPassage('Josh', 1, 1);
  assert.ok(joshShittim);
  assert.equal(joshShittim.route.id, 'joshua-conquest');
  assert.equal(joshShittim.stopIndex, 0);
  assert.match(joshShittim.stop.name, /Plains of Moab/i);

  // Joshua: Josh 6:20 -> Jericho (Stop 2)
  const joshJericho = getJourneyStopForPassage('Josh', 6, 20);
  assert.ok(joshJericho);
  assert.equal(joshJericho.stopIndex, 2);
  assert.match(joshJericho.stop.name, /Jericho/i);

  // Joshua: Josh 10:12 -> Gibeon (Stop 4)
  const joshGibeon = getJourneyStopForPassage('Josh', 10, 12);
  assert.ok(joshGibeon);
  assert.equal(joshGibeon.stopIndex, 4);
  assert.match(joshGibeon.stop.name, /Gibeon/i);

  // Joshua: Josh 18:1 -> Shiloh (Stop 6)
  const joshShiloh = getJourneyStopForPassage('Josh', 18, 1);
  assert.ok(joshShiloh);
  assert.equal(joshShiloh.stopIndex, 6);
  assert.match(joshShiloh.stop.name, /Shiloh/i);
});

test('Epoch 4: Relationships express Gerar treaty and Gibeonite covenant', () => {
  // Abraham & Abimelech King of Gerar (Gen 20:1, 21:22)
  const abimRel = getRelationshipForPassage('Gen', 20, 1);
  assert.ok(abimRel);
  assert.equal(abimRel.id, 'abraham-abimelech-2060bc');
  assert.equal(abimRel.actor1Id, 'abraham');
  assert.equal(abimRel.actor2Id, 'gerar-philistines');
  assert.equal(abimRel.relationshipKind, 'peaceable_fellowship');
  assert.match(abimRel.summary, /Beersheba/i);
  assert.match(abimRel.tensionAndLimits, /distinct from later Iron Age/i);

  // Israel & Gibeonites (Josh 9:3, 10:6)
  const gibRel = getRelationshipForPassage('Josh', 9, 3);
  assert.ok(gibRel);
  assert.equal(gibRel.id, 'israel-gibeonites-1405bc');
  assert.equal(gibRel.actor1Id, 'israel');
  assert.equal(gibRel.actor2Id, 'gibeonites');
  assert.equal(gibRel.relationshipKind, 'voluntary_vassalage');
  assert.match(gibRel.perspectiveActor1, /sworn unto them by the LORD God of Israel/i);
  assert.match(gibRel.tensionAndLimits, /King Saul broke this very covenant/i);
});

test('Epoch 4: World horizons cover Ur III Law Code and Mycenaean Greece', () => {
  // Ur III / Code of Ur-Nammu (c. 2090 BC)
  const ur3 = getWorldHorizonItem('ur-iii-law-code');
  assert.ok(ur3);
  assert.equal(isWorldItemInDateInterval(ur3, -2090), true);
  assert.match(ur3.overlapExplanation, /no known contact with Abram is claimed/i);
  assert.match(ur3.summary, /Great Ziggurat of Ur/i);

  // Mycenaean Greece / Lion Gate & Linear B (c. 1400 BC)
  const mycenae = getWorldHorizonItem('mycenaean-greece-bronze');
  assert.ok(mycenae);
  assert.equal(isWorldItemInDateInterval(mycenae, -1400), true);
  assert.match(mycenae.overlapExplanation, /no known contact with Israel or Canaan is claimed/i);
  assert.match(mycenae.summary, /Lion Gate/i);
});

// =============================================================================
// EPOCH 5: UNITED MONARCHY & PRE-EXILIC REFORMS (SOLOMON & JOSIAH)
// =============================================================================

test('Epoch 5: Solomon narrative passages wire to sequential stops on solomon-glory', () => {
  // 1 Kgs 3:4 -> Gibeon Great High Place (Stop 0)
  const solGibeon = getJourneyStopForPassage('1Kgs', 3, 4);
  assert.ok(solGibeon);
  assert.equal(solGibeon.route.id, 'solomon-glory');
  assert.equal(solGibeon.stopIndex, 0);
  assert.match(solGibeon.stop.name, /Gibeon/i);

  // 1 Kgs 8:1 -> Temple Dedicated in Jerusalem (Stop 1)
  const solTemple = getJourneyStopForPassage('1Kgs', 8, 1);
  assert.ok(solTemple);
  assert.equal(solTemple.stopIndex, 1);
  assert.match(solTemple.stop.name, /Temple Dedicated/i);

  // 1 Kgs 9:26 -> Ezion-geber Red Sea Fleet (Stop 2)
  const solEzion = getJourneyStopForPassage('1Kgs', 9, 26);
  assert.ok(solEzion);
  assert.equal(solEzion.stopIndex, 2);
  assert.match(solEzion.stop.name, /Ezion-geber/i);

  // 1 Kgs 9:15 -> Fortified Strategic Cities (Stop 3)
  const solCities = getJourneyStopForPassage('1Kgs', 9, 15);
  assert.ok(solCities);
  assert.equal(solCities.stopIndex, 3);
  assert.match(solCities.stop.name, /Megiddo.*Hazor.*Gezer/i);

  // 1 Kgs 10:1 -> Visit of the Queen of Sheba (Stop 5)
  const solSheba = getJourneyStopForPassage('1Kgs', 10, 1);
  assert.ok(solSheba);
  assert.equal(solSheba.stopIndex, 5);
  assert.match(solSheba.stop.name, /Queen of Sheba/i);
});

test('Epoch 5: Relationships express Hiram of Tyre, Queen of Sheba, and Josiah at Megiddo', () => {
  // Solomon & Hiram of Tyre (1 Kgs 5:1)
  const hiramRel = getRelationshipForPassage('1Kgs', 5, 1);
  assert.ok(hiramRel);
  assert.equal(hiramRel.id, 'solomon-hiram-tyre-960bc');
  assert.equal(hiramRel.actor1Id, 'israel-solomon');
  assert.equal(hiramRel.actor2Id, 'tyre-phoenicia');
  assert.equal(hiramRel.relationshipKind, 'peaceable_fellowship');
  assert.match(hiramRel.summary, /cedars.*of Lebanon/i);
  assert.match(hiramRel.tensionAndLimits, /Cabul/i);

  // Solomon & Queen of Sheba (1 Kgs 10:1)
  const shebaRel = getRelationshipForPassage('1Kgs', 10, 1);
  assert.ok(shebaRel);
  assert.equal(shebaRel.id, 'solomon-queen-sheba-935bc');
  assert.equal(shebaRel.actor1Id, 'israel-solomon');
  assert.equal(shebaRel.actor2Id, 'sheba-saba');
  assert.equal(shebaRel.relationshipKind, 'peaceable_fellowship');
  assert.match(shebaRel.summary, /hard questions/i);

  // Josiah & Pharaoh Necho II at Megiddo (2 Kgs 23:29)
  const nechoRel = getRelationshipForPassage('2Kgs', 23, 29);
  assert.ok(nechoRel);
  assert.equal(nechoRel.id, 'josiah-necho-609bc');
  assert.equal(nechoRel.actor1Id, 'judah');
  assert.equal(nechoRel.actor2Id, 'egypt-saite');
  assert.equal(nechoRel.relationshipKind, 'armed_conflict');
  assert.match(nechoRel.summary, /Megiddo/i);
  assert.match(nechoRel.perspectiveActor2, /Necho claimed divine urgency/i);
});

test('Epoch 5: World horizons cover Tanite Egypt and the Median Coalition at Nineveh', () => {
  // 21st Dynasty Egypt / Gold Mask of Psusennes I (c. 960 BC)
  const psusennes = getWorldHorizonItem('egypt-tanite-psusennes');
  assert.ok(psusennes);
  assert.equal(isWorldItemInDateInterval(psusennes, -960), true);
  assert.match(psusennes.overlapExplanation, /No known direct contact with Solomon is claimed/i);
  assert.match(psusennes.summary, /Tanis/i);

  // The Median Empire & Fall of Nineveh (612 BC)
  const nineveh = getWorldHorizonItem('neo-elamite-median-coalition');
  assert.ok(nineveh);
  assert.equal(isWorldItemInDateInterval(nineveh, -612), true);
  assert.equal(nineveh.connectionKind, 'direct_synchrony');
  assert.match(nineveh.overlapExplanation, /Nahum 2:6/i);
  assert.match(nineveh.summary, /Cyaxares/i);
});

// =============================================================================
// EPOCH 6: PROPHETS & GOSPELS (JEREMIAH, DANIEL & LIFE OF CHRIST)
// =============================================================================

test('Epoch 6: Jeremiah and Daniel narrative passages wire to sequential stops', () => {
  // Jeremiah: Jer 1:1 -> Anathoth (Stop 0)
  const jerAnathoth = getJourneyStopForPassage('Jer', 1, 1);
  assert.ok(jerAnathoth);
  assert.equal(jerAnathoth.route.id, 'jeremiah-ministry');
  assert.equal(jerAnathoth.stopIndex, 0);

  // Jeremiah: Jer 7:2 -> Temple Gate (Stop 1)
  const jerGate = getJourneyStopForPassage('Jer', 7, 2);
  assert.ok(jerGate);
  assert.equal(jerGate.stopIndex, 1);
  assert.match(jerGate.stop.name, /Temple Gate/i);

  // Jeremiah: Jer 38:6 -> Miry Cistern (Stop 3)
  const jerCistern = getJourneyStopForPassage('Jer', 38, 6);
  assert.ok(jerCistern);
  assert.equal(jerCistern.stopIndex, 3);
  assert.match(jerCistern.stop.name, /Cistern/i);

  // Daniel: Dan 1:1 -> Jerusalem Deportation (Stop 0)
  const danDeport = getJourneyStopForPassage('Dan', 1, 1);
  assert.ok(danDeport);
  assert.equal(danDeport.route.id, 'daniel-exile');
  assert.equal(danDeport.stopIndex, 0);

  // Daniel: Dan 3:1 -> Plain of Dura Golden Image (Stop 2)
  const danDura = getJourneyStopForPassage('Dan', 3, 1);
  assert.ok(danDura);
  assert.equal(danDura.stopIndex, 2);
  assert.match(danDura.stop.name, /Plain of Dura/i);

  // Daniel: Dan 6:16 -> Den of Lions (Stop 4)
  const danLions = getJourneyStopForPassage('Dan', 6, 16);
  assert.ok(danLions);
  assert.equal(danLions.stopIndex, 4);
  assert.match(danLions.stop.name, /Den of Lions/i);
});

test('Epoch 6: Jesus Galilean ministry and Passion/Resurrection wire to sequential stops', () => {
  // Jesus Galilean: Luke 4:16 -> Nazareth Synagogue (Stop 0)
  const jesusNaz = getJourneyStopForPassage('Luke', 4, 16);
  assert.ok(jesusNaz);
  assert.equal(jesusNaz.route.id, 'jesus-galilean-ministry');
  assert.equal(jesusNaz.stopIndex, 0);
  assert.match(jesusNaz.stop.name, /Nazareth/i);

  // Jesus Galilean: Matt 4:13 -> Capernaum (Stop 1)
  const jesusCap = getJourneyStopForPassage('Matt', 4, 13);
  assert.ok(jesusCap);
  assert.equal(jesusCap.route.id, 'jesus-galilean-ministry');
  assert.equal(jesusCap.stopIndex, 1);
  assert.match(jesusCap.stop.name, /Capernaum/i);

  // Jesus Galilean: Matt 5:1 -> Mount of Beatitudes (Stop 2)
  const jesusBeat = getJourneyStopForPassage('Matt', 5, 1);
  assert.ok(jesusBeat);
  assert.equal(jesusBeat.stopIndex, 2);
  assert.match(jesusBeat.stop.name, /Beatitudes/i);

  // Jesus Galilean: Matt 16:13 -> Caesarea Philippi (Stop 7)
  const jesusCaesarea = getJourneyStopForPassage('Matt', 16, 13);
  assert.ok(jesusCaesarea);
  assert.equal(jesusCaesarea.stopIndex, 7);
  assert.match(jesusCaesarea.stop.name, /Caesarea Philippi/i);

  // Jesus Passion: John 10:40 -> Perea (Stop 0)
  const jesusPerea = getJourneyStopForPassage('John', 10, 40);
  assert.ok(jesusPerea);
  assert.equal(jesusPerea.route.id, 'jesus-passion-resurrection');
  assert.equal(jesusPerea.stopIndex, 0);
  assert.match(jesusPerea.stop.name, /Perea/i);

  // Jesus Passion: John 11:1 -> Bethany (Stop 1)
  const jesusBeth = getJourneyStopForPassage('John', 11, 1);
  assert.ok(jesusBeth);
  assert.equal(jesusBeth.stopIndex, 1);
  assert.match(jesusBeth.stop.name, /Bethany/i);

  // Jesus Passion: Matt 26:36 -> Jerusalem Passion & Empty Tomb (Stop 3)
  const jesusGeth = getJourneyStopForPassage('Matt', 26, 36);
  assert.ok(jesusGeth);
  assert.equal(jesusGeth.stopIndex, 3);
  assert.match(jesusGeth.stop.name, /Jerusalem/i);

  // Jesus Passion: Acts 1:9 -> Olivet Ascension (Stop 6)
  const jesusAsc = getJourneyStopForPassage('Acts', 1, 9);
  assert.ok(jesusAsc);
  assert.equal(jesusAsc.stopIndex, 6);
  assert.match(jesusAsc.stop.name, /Ascension/i);
});

test('Epoch 6: Relationships express Roman Centurion faith and Augustus Principate', () => {
  // Jesus & Capernaum Centurion (Matt 8:5)
  const centRel = getRelationshipForPassage('Matt', 8, 5);
  assert.ok(centRel);
  assert.equal(centRel.id, 'jesus-centurion-ad28');
  assert.equal(centRel.actor1Id, 'jesus');
  assert.equal(centRel.actor2Id, 'rome-capernaum');
  assert.equal(centRel.relationshipKind, 'peaceable_fellowship');
  assert.match(centRel.summary, /speak the word only/i);
  assert.match(centRel.moralAssessmentBasis, /so great faith, no, not in Israel/i);

  // Roman Principate of Augustus (27 BC - AD 14)
  const augustus = getWorldHorizonItem('rome-augustus-principate');
  assert.ok(augustus);
  assert.equal(isWorldItemInDateInterval(augustus, -4), true);
  assert.equal(augustus.connectionKind, 'direct_synchrony');
  assert.match(augustus.overlapExplanation, /Luke 2:1/i);
  assert.match(augustus.summary, /Res Gestae Divi Augusti/i);
});

// =============================================================================
// EPOCH 7: DIVIDED KINGDOM & ASSYRIAN ADVANCE (AHAB & JEHU)
// =============================================================================

test('Epoch 7: Relationships express Ahab Qarqar coalition and Jehu Black Obelisk tribute', () => {
  // Ahab & Shalmaneser III at Qarqar (1 Kgs 20:34)
  const qarqarRel = getRelationshipForPassage('1Kgs', 20, 34);
  assert.ok(qarqarRel);
  assert.equal(qarqarRel.id, 'israel-assyria-qarqar-853bc');
  assert.equal(qarqarRel.actor1Id, 'israel-northern');
  assert.equal(qarqarRel.actor2Id, 'assyria');
  assert.equal(qarqarRel.relationshipKind, 'armed_conflict');
  assert.match(qarqarRel.summary, /2,000 chariots and 10,000 foot soldiers/i);
  assert.match(qarqarRel.tensionAndLimits, /pragmatic coalition between bitter rivals/i);

  // Jehu & Shalmaneser III tributary submission (2 Kgs 10:32)
  const jehuRel = getRelationshipForPassage('2Kgs', 10, 32);
  assert.ok(jehuRel);
  assert.equal(jehuRel.id, 'israel-assyria-jehu-841bc');
  assert.equal(jehuRel.actor1Id, 'israel-northern');
  assert.equal(jehuRel.relationshipKind, 'voluntary_vassalage');
  assert.match(jehuRel.perspectiveActor2, /Black Obelisk/i);
  assert.match(jehuRel.perspectiveActor2, /Ia-u-a mar Hu-um-ri-i/i);
});

test('Epoch 7: World horizon covers Western Zhou Gonghe Regency (841 BC)', () => {
  const gonghe = getWorldHorizonItem('western-zhou-gonghe-regency');
  assert.ok(gonghe);
  assert.equal(isWorldItemInDateInterval(gonghe, -841), true);
  assert.match(gonghe.summary, /Gonghe/i);
  assert.match(gonghe.overlapExplanation, /no known contact with Israel or the prophet Elijah is claimed/i);
  assert.match(gonghe.sourceTitle, /Records of the Grand Historian/i);
});

// =============================================================================
// EPOCH 8: RESTORATION, ESTHER & RUTH (DARIUS, XERXES & BOAZ)
// =============================================================================

test('Epoch 8: Ruth and Esther narrative passages wire to sequential stops', () => {
  // Ruth 1:1 -> Country of Moab (Stop 0)
  const ruthMoab = getJourneyStopForPassage('Ruth', 1, 1);
  assert.ok(ruthMoab);
  assert.equal(ruthMoab.route.id, 'ruth-boaz');
  assert.equal(ruthMoab.stopIndex, 0);

  // Ruth 1:22 -> Bethlehem arrival (Stop 1)
  const ruthBeth = getJourneyStopForPassage('Ruth', 1, 22);
  assert.ok(ruthBeth);
  assert.equal(ruthBeth.stopIndex, 1);
  assert.match(ruthBeth.stop.name, /Bethlehem/i);

  // Ruth 2:1 -> Fields of Boaz (Stop 2)
  const ruthFields = getJourneyStopForPassage('Ruth', 2, 1);
  assert.ok(ruthFields);
  assert.equal(ruthFields.stopIndex, 2);
  assert.match(ruthFields.stop.name, /Fields of Boaz/i);

  // Ruth 4:1 -> Gate of Bethlehem (Stop 4)
  const ruthGate = getJourneyStopForPassage('Ruth', 4, 1);
  assert.ok(ruthGate);
  assert.equal(ruthGate.stopIndex, 4);
  assert.match(ruthGate.stop.name, /Gate of Bethlehem/i);

  // Esther 1:1 -> Susa Palace (Stop 0)
  const esthSusa = getJourneyStopForPassage('Esth', 1, 1);
  assert.ok(esthSusa);
  assert.equal(esthSusa.route.id, 'esther-mordecai');
  assert.equal(esthSusa.stopIndex, 0);

  // Esther 3:1 -> King's Gate (Stop 1)
  const esthGate = getJourneyStopForPassage('Esth', 3, 1);
  assert.ok(esthGate);
  assert.equal(esthGate.stopIndex, 1);

  // Esther 5:1 -> Inner Court (Stop 2)
  const esthCourt = getJourneyStopForPassage('Esth', 5, 1);
  assert.ok(esthCourt);
  assert.equal(esthCourt.stopIndex, 2);

  // Esther 7:1 -> Banquet Hall (Stop 3)
  const esthBanquet = getJourneyStopForPassage('Esth', 7, 1);
  assert.ok(esthBanquet);
  assert.equal(esthBanquet.stopIndex, 3);

  // Esther 8:1 -> Citadel of Shushan (Stop 4)
  const esthCitadel = getJourneyStopForPassage('Esth', 8, 1);
  assert.ok(esthCitadel);
  assert.equal(esthCitadel.stopIndex, 4);
});

test('Epoch 8: Relationships express Darius Temple Decree and Esther royal favor', () => {
  // Darius I & Second Temple (Ezra 6:15)
  const dariusRel = getRelationshipForPassage('Ezra', 6, 15);
  assert.ok(dariusRel);
  assert.equal(dariusRel.id, 'jews-persia-darius-516bc');
  assert.equal(dariusRel.actor2Id, 'persia');
  assert.equal(dariusRel.relationshipKind, 'voluntary_vassalage');
  assert.match(dariusRel.summary, /Second Temple was joyfully finished/i);
  assert.match(dariusRel.moralAssessmentBasis, /commandment of Cyrus, and Darius/i);

  // Esther & Ahasuerus (Esther 4:14)
  const estherRel = getRelationshipForPassage('Esth', 4, 14);
  assert.ok(estherRel);
  assert.equal(estherRel.id, 'esther-xerxes-susa-479bc');
  assert.equal(estherRel.actor1Id, 'jews-diaspora');
  assert.equal(estherRel.relationshipKind, 'refuge');
  assert.match(estherRel.summary, /golden sceptre/i);
  assert.match(estherRel.perspectiveActor1, /for such a time as this/i);
});

test('Epoch 8: World horizons cover Behistun Inscription and Early Roman Republic', () => {
  // Darius Behistun & Persepolis (c. 516 BC)
  const behistun = getWorldHorizonItem('persian-achaemenid-persepolis');
  assert.ok(behistun);
  assert.equal(isWorldItemInDateInterval(behistun, -516), true);
  assert.equal(behistun.connectionKind, 'direct_synchrony');
  assert.match(behistun.overlapExplanation, /Ezra 6:15/i);
  assert.match(behistun.summary, /Behistun Inscription/i);

  // Early Roman Republic (c. 509 BC)
  const romeRep = getWorldHorizonItem('classical-rome-early-republic');
  assert.ok(romeRep);
  assert.equal(isWorldItemInDateInterval(romeRep, -509), true);
  assert.match(romeRep.overlapExplanation, /no known contact with Judah or Persia is claimed/i);
  assert.match(romeRep.summary, /Tarquin the Proud/i);
});

// =============================================================================
// EPOCH 9: INTERTESTAMENTAL ERA (MACCABEES & SEPTUAGINT)
// =============================================================================

test('Epoch 9: Hasmonaean resistance and Alexandria Septuagint bridge Old and New Testaments', () => {
  // Judas Maccabaeus & Antiochus IV (Dan 11:31 / John 10:22)
  const maccRel = getRelationshipForPassage('Dan', 11, 31);
  assert.ok(maccRel);
  assert.equal(maccRel.id, 'hasmonean-seleucid-167bc');
  assert.equal(maccRel.actor1Id, 'jews-hasmonean');
  assert.equal(maccRel.actor2Id, 'seleucid-empire');
  assert.equal(maccRel.relationshipKind, 'armed_conflict');
  assert.match(maccRel.summary, /Feast of Dedication/i);
  assert.match(maccRel.tensionAndLimits, /John 10:22/i);

  // Ptolemaic Alexandria & Septuagint (c. 280 BC)
  const lxx = getWorldHorizonItem('hellenistic-alexandria-septuagint');
  assert.ok(lxx);
  assert.equal(isWorldItemInDateInterval(lxx, -280), true);
  assert.match(lxx.summary, /Septuagint/i);
  assert.match(lxx.overlapExplanation, /Diaspora synagogues/i);
});

// =============================================================================
// EPOCH 10: APOSTOLIC CHURCH & APOCALYPSE (PETER & JOHN)
// =============================================================================

test('Epoch 10: Peter and John narrative passages wire to sequential stops', () => {
  // Peter in Samaria: Acts 8:14 (Stop 1)
  const petSamaria = getJourneyStopForPassage('Acts', 8, 14);
  assert.ok(petSamaria);
  assert.equal(petSamaria.route.id, 'peter-philip-missions');
  assert.equal(petSamaria.stopIndex, 1);

  // Philip on Gaza Desert Road: Acts 8:26 (Stop 2)
  const philGaza = getJourneyStopForPassage('Acts', 8, 26);
  assert.ok(philGaza);
  assert.equal(philGaza.stopIndex, 2);
  assert.match(philGaza.stop.name, /Gaza/i);

  // Peter at Joppa: Acts 9:36 (Stop 3)
  const petJoppa = getJourneyStopForPassage('Acts', 9, 36);
  assert.ok(petJoppa);
  assert.equal(petJoppa.stopIndex, 3);
  assert.match(petJoppa.stop.name, /Joppa/i);

  // Peter at Caesarea (Cornelius): Acts 10:1 (Stop 4)
  const petCaesarea = getJourneyStopForPassage('Acts', 10, 1);
  assert.ok(petCaesarea);
  assert.equal(petCaesarea.stopIndex, 4);
  assert.match(petCaesarea.stop.name, /Caesarea/i);

  // John on Isle of Patmos: Rev 1:9 (Stop 5)
  const johnPatmos = getJourneyStopForPassage('Rev', 1, 9);
  assert.ok(johnPatmos);
  assert.equal(johnPatmos.route.id, 'john-seven-churches-patmos');
  assert.equal(johnPatmos.stopIndex, 5);
  assert.match(johnPatmos.stop.name, /Patmos/i);

  // John to Ephesus: Rev 2:1 (Stop 1)
  const johnEphesus = getJourneyStopForPassage('Rev', 2, 1);
  assert.ok(johnEphesus);
  assert.equal(johnEphesus.stopIndex, 1);
  assert.match(johnEphesus.stop.name, /Ephesus/i);

  // John to Laodicea: Rev 3:14 (Stop 4)
  const johnLaodicea = getJourneyStopForPassage('Rev', 3, 14);
  assert.ok(johnLaodicea);
  assert.equal(johnLaodicea.stopIndex, 4);
  assert.match(johnLaodicea.stop.name, /Laodicea/i);
});

test('Epoch 10: Relationships express Peter & Cornelius and John exiled under Domitian', () => {
  // Peter & Cornelius (Acts 10:1)
  const cornRel = getRelationshipForPassage('Acts', 10, 1);
  assert.ok(cornRel);
  assert.equal(cornRel.id, 'peter-cornelius-ad38');
  assert.equal(cornRel.actor1Id, 'peter');
  assert.equal(cornRel.relationshipKind, 'peaceable_fellowship');
  assert.match(cornRel.summary, /Italian band/i);
  assert.match(cornRel.moralAssessmentBasis, /any man common or unclean/i);

  // John & Domitian at Patmos (Rev 1:9)
  const domRel = getRelationshipForPassage('Rev', 1, 9);
  assert.ok(domRel);
  assert.equal(domRel.id, 'john-domitian-patmos-ad95');
  assert.equal(domRel.actor1Id, 'john-apostle');
  assert.equal(domRel.relationshipKind, 'refuge');
  assert.match(domRel.summary, /penal island of Patmos/i);
  assert.match(domRel.moralAssessmentBasis, /be thou faithful unto death/i);

  // Roman Empire of Domitian (AD 81–96)
  const domitian = getWorldHorizonItem('rome-domitian-empire');
  assert.ok(domitian);
  assert.equal(isWorldItemInDateInterval(domitian, 95), true);
  assert.equal(domitian.connectionKind, 'direct_synchrony');
  assert.match(domitian.overlapExplanation, /Revelation 1:9/i);
  assert.match(domitian.summary, /Dominus et Deus/i);
});
