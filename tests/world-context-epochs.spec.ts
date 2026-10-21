import { test, expect } from '@playwright/test';

test.describe('Historical World Context - Epochs Expansion (Pentateuch, Exile & Return, Apostolic Church)', () => {
  // ---------------------------------------------------------------------------
  // Epoch 1: Pentateuch & Exodus
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Jacob journey stop at Bethel and Middle Kingdom world horizon (Genesis 28:12)', async ({ page }) => {
    await page.goto('/bible?book=Gen&chapter=28&verse=12', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Along this journey card: Jacob's ladder at Bethel
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('ALONG THIS JOURNEY · NARRATIVE SEQUENCE');
    await expect(journeyCard).toContainText("Jacob's Travels");
    await expect(journeyCard).toContainText('Bethel / Luz');
    await expect(journeyCard).toContainText('Stop 2 of 9');

    // View Stop on Map link
    const mapLink = journeyCard.locator('a');
    await expect(mapLink).toBeVisible();
    const href = await mapLink.getAttribute('href');
    expect(href).toContain('journey=jacob-padan-aram');
    expect(href).toContain('stop=1');

    // World horizon card: Egyptian Middle Kingdom
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON');
    await expect(worldCard).toContainText('Egyptian Middle Kingdom');
    await expect(worldCard).toContainText('Beni Hasan');
    await expect(worldCard).toContainText('no known contact with Jacob’s family', { ignoreCase: true });
  });

  test('Bible Reader displays Exodus Red Sea Crossing stop and Israel ↔ Egypt relationship (Exodus 14:21)', async ({ page }) => {
    await page.goto('/bible?book=Exod&chapter=14&verse=21', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Red Sea Crossing
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('The Exodus & Wilderness Route');
    await expect(journeyCard).toContainText('Red Sea Crossing');
    await expect(journeyCard).toContainText('Stop 4 of 8');

    // Relationship card: Israel and Egypt
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('RELATIONSHIP AT THIS TIME');
    await expect(relCard).toContainText('Children of Israel ↔ Kingdom of Egypt (New Kingdom)');
    await expect(relCard).toContainText('Generational slavery, hard bondage, plagues, and miraculous deliverance');

    // World horizon: Shang Dynasty Bronze Age
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Shang Dynasty · Late Bronze Age China');
    await expect(worldCard).toContainText('no known contact with Israel or Egypt', { ignoreCase: true });
  });

  // ---------------------------------------------------------------------------
  // Epoch 2: The Exile & Return
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Nehemiah secret night inspection and Classical Greece world horizon (Nehemiah 2:13)', async ({ page }) => {
    await page.goto('/bible?book=Neh&chapter=2&verse=13', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Nehemiah Night Inspection
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Nehemiah: Susa Palace to the 52-Day Jerusalem Wall Circuit');
    await expect(journeyCard).toContainText('Secret Night Inspection of Ruined Walls');
    await expect(journeyCard).toContainText('Stop 3 of 5');

    // World horizon: Classical Greece (Age of Pericles & Parthenon)
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Classical Greece · The Age of Pericles & The Parthenon');
    await expect(worldCard).toContainText('no known contact with Nehemiah or Susa', { ignoreCase: true });
  });

  test('Bible Reader displays Judah ↔ Babylon 586 BC siege relationship and Solon world horizon (2 Kings 25:1)', async ({ page }) => {
    await page.goto('/bible?book=2Kgs&chapter=25&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship card: Judah and Babylon
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Kingdom of Judah ↔ Neo-Babylonian Empire');
    await expect(relCard).toContainText('Rebellion breaking vassal oath, 18-month siege');
    await expect(relCard).toContainText('Jeremiah counseled surrender');

    // World horizon: Solon's Reforms in Archaic Athens
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Archaic Greece · Solon’s Constitutional Reforms in Athens');
    await expect(worldCard).toContainText('no known contact with Judah or Babylon', { ignoreCase: true });
  });

  // ---------------------------------------------------------------------------
  // Epoch 3: Gospels & Apostolic Church
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Paul at Athens Mars\' Hill and Eastern Han world horizon (Acts 17:15)', async ({ page }) => {
    await page.goto('/bible?book=Acts&chapter=17&verse=15', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Paul at Athens
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText("Paul's Second Missionary Journey");
    await expect(journeyCard).toContainText('Athens (Areopagus / Mars\' Hill)');
    await expect(journeyCard).toContainText('Stop 8 of 11');

    // World horizon: Eastern Han Dynasty / Emperor Ming
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Eastern Han Dynasty · Emperor Ming');
    await expect(worldCard).toContainText('no known contact with Paul, Rome, or Judaea', { ignoreCase: true });
  });

  test('Bible Reader displays Paul in Rome under Nero relationship and voyage stop (Acts 28:30)', async ({ page }) => {
    await page.goto('/bible?book=Acts&chapter=28&verse=30', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Rome Two-Year House Custody
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText("Paul's Voyage & Shipwreck to Rome");
    await expect(journeyCard).toContainText('Rome (Two-Year House Custody & Prison Epistles)');
    await expect(journeyCard).toContainText('Stop 6 of 6');

    // Relationship card: Paul & Roman Church ↔ Imperial Rome under Nero
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Apostle Paul & The Church in Rome ↔ Imperial Rome (Reign of Nero)');
    await expect(relCard).toContainText('military house custody, Praetorian guard evangelization');
    await expect(relCard).toContainText('Contrasts sharply with Nero’s later vicious persecution');
  });

  test('Map page carries journey stop and preserves return link for Jacob at Bethel', async ({ page }) => {
    await page.goto('/map?ref=Gen.28.12&journey=jacob-padan-aram&stop=1', { waitUntil: 'networkidle' });

    // Drawer displays Bethel stop details
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Bethel / Luz');

    // Context bar points back to Bible reader
    const contextBar = page.locator('#atlas-context-bar');
    await expect(contextBar).toBeVisible();
    const returnLink = page.locator('#atlas-context-bible');
    await expect(returnLink).toBeVisible();
    const returnHref = await returnLink.getAttribute('href');
    expect(returnHref?.toLowerCase()).toMatch(/\/bible\?ref=gen\.28\.12/i);
  });

  // ---------------------------------------------------------------------------
  // Epoch 4: Patriarchs & Conquest (Abraham & Joshua)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Abraham journey stop at Haran and Ur III world horizon (Genesis 12:1)', async ({ page }) => {
    await page.goto('/bible?book=Gen&chapter=12&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Haran
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText("Abraham's Journey of Faith");
    await expect(journeyCard).toContainText('Haran');

    // World horizon: Ur III & Code of Ur-Nammu
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Third Dynasty of Ur · Code of Ur-Nammu');
    await expect(worldCard).toContainText('no known contact with Abram is claimed', { ignoreCase: true });
  });

  test('Bible Reader displays Israel ↔ Gibeonites covenant relationship and Mycenaean Greece (Joshua 9:3)', async ({ page }) => {
    await page.goto('/bible?book=Josh&chapter=9&verse=3', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship card: Israel and Gibeonites
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Congregation of Israel ↔ Hivite League of Gibeon');
    await expect(relCard).toContainText('Treaty obtained by deception, sworn oath honored');

    // World horizon: Mycenaean Greece
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Late Bronze Age Greece · Mycenaean Palaces & Lion Gate');
    await expect(worldCard).toContainText('no known contact with Israel or Canaan is claimed', { ignoreCase: true });
  });

  // ---------------------------------------------------------------------------
  // Epoch 5: United Monarchy & Pre-Exilic Reforms (Solomon & Josiah)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Solomon ↔ Queen of Sheba and Tanite Egypt (1 Kings 10:1)', async ({ page }) => {
    await page.goto('/bible?book=1Kgs&chapter=10&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Visit of Queen of Sheba
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('King Solomon: Temple, Red Sea Fleet & Golden Age');
    await expect(journeyCard).toContainText('Visit of the Queen of Sheba');

    // Relationship: Solomon and Sheba
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Kingdom of Israel ↔ Kingdom of Sheba (Sabaeans)');

    // World horizon: Egyptian 21st Dynasty Tanis
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Egyptian Twenty-First Dynasty · The Gold Mask of Psusennes I');
  });

  test('Bible Reader displays Josiah ↔ Necho at Megiddo and Fall of Nineveh synchrony (2 Kings 23:29)', async ({ page }) => {
    await page.goto('/bible?book=2Kgs&chapter=23&verse=29', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship: Josiah and Necho
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Kingdom of Judah ↔ Kingdom of Egypt (Saite 26th Dynasty)');
    await expect(relCard).toContainText('Battle of Megiddo');

    // World horizon: Fall of Nineveh
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('The Median Empire · Cyaxares & The Fall of Nineveh');
    await expect(worldCard).toContainText('ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON');
  });

  // ---------------------------------------------------------------------------
  // Epoch 6: Prophets & Gospels (Daniel & Life of Christ)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Daniel at Plain of Dura (Daniel 3:1)', async ({ page }) => {
    await page.goto('/bible?book=Dan&chapter=3&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Plain of Dura
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Daniel: Babylon, the Fiery Furnace, Lions\' Den & Susa');
    await expect(journeyCard).toContainText('Plain of Dura');
  });

  test('Bible Reader displays Jesus ↔ Roman Centurion at Capernaum and Augustus Principate (Matthew 8:5)', async ({ page }) => {
    await page.goto('/bible?book=Matt&chapter=8&verse=5', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship: Jesus and Centurion
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('The Lord Jesus Christ ↔ Roman Garrison at Capernaum');
    await expect(relCard).toContainText('speak the word only', { ignoreCase: true });

    // World horizon: Roman Principate of Augustus
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('The Roman Principate · Pax Romana & The Res Gestae of Augustus');
    await expect(worldCard).toContainText('Luke 2:1');
  });

  // ---------------------------------------------------------------------------
  // Epoch 7: Divided Kingdom (Jehu & Black Obelisk)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Jehu ↔ Shalmaneser III tributary submission and Gonghe Regency (2 Kings 10:32)', async ({ page }) => {
    await page.goto('/bible?book=2Kgs&chapter=10&verse=32', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship: Jehu and Shalmaneser III
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Kingdom of Israel (Samaria) ↔ Neo-Assyrian Empire');
    await expect(relCard).toContainText('Black Obelisk');

    // World horizon: Western Zhou Gonghe Regency
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Western Zhou Dynasty · The Gonghe Regency');
    await expect(worldCard).toContainText('841 BC');
  });

  // ---------------------------------------------------------------------------
  // Epoch 8: Restoration & Esther (Shushan Citadel & Behistun Inscription)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Esther at King’s Gate and Behistun Inscription world horizon (Esther 4:14)', async ({ page }) => {
    await page.goto('/bible?book=Esth&chapter=4&verse=14', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: King's Gate
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Esther & Mordecai');

    // Relationship: Esther and Xerxes
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Jewish Diaspora in the Persian Empire ↔ Achaemenid Persian Empire');
    await expect(relCard).toContainText('for such a time as this', { ignoreCase: true });

    // World horizon: Persian Empire Behistun & Persepolis
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Achaemenid Persian Empire · Darius the Great & The Behistun Inscription');
  });

  test('Bible Reader displays Ruth arriving in Bethlehem and barley harvest stop (Ruth 1:22)', async ({ page }) => {
    await page.goto('/bible?book=Ruth&chapter=1&verse=22', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Bethlehem
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Ruth: Plains of Moab to Bethlehem');
    await expect(journeyCard).toContainText('Bethlehem-judah');
  });

  // ---------------------------------------------------------------------------
  // Epoch 9: Intertestamental Era (Maccabees & Septuagint)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Judas Maccabaeus sanctuary cleansing relationship and Septuagint horizon (Daniel 11:31)', async ({ page }) => {
    await page.goto('/bible?book=Dan&chapter=11&verse=31', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship: Hasmonaeans and Seleucids
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Hasmonaean Jewish Commonwealth ↔ Seleucid Empire');
    await expect(relCard).toContainText('Feast of Dedication');

    // World horizon: Alexandria Library & Septuagint
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Ptolemaic Kingdom · The Library of Alexandria & The Septuagint Translation');
  });

  // ---------------------------------------------------------------------------
  // Epoch 10: Apostolic Gentile Outreach & Patmos (Peter & John)
  // ---------------------------------------------------------------------------
  test('Bible Reader displays Peter ↔ Cornelius at Caesarea (Acts 10:1)', async ({ page }) => {
    await page.goto('/bible?book=Acts&chapter=10&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Caesarea Maritima
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Caesarea Maritima');

    // Relationship: Peter and Cornelius
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Apostle Peter & The Early Church ↔ Roman Household of Caesarea');
    await expect(relCard).toContainText('Italian band');
  });

  test('Bible Reader displays John on Patmos and Domitian persecution horizon (Revelation 1:9)', async ({ page }) => {
    await page.goto('/bible?book=Rev&chapter=1&verse=9', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Journey stop: Patmos
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('Isle of Patmos');

    // Relationship: John and Domitian
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('Apostle John & The Seven Churches of Asia ↔ Imperial Roman State (Reign of Domitian)');

    // World horizon: Domitian Imperial Cult
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('Imperial Rome · Emperor Domitian & The Enforced Imperial Ruler Cult');
    await expect(worldCard).toContainText('Dominus et Deus');
  });
});
